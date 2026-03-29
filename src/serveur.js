import http from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

import { executerRecherche } from "./service-recherche.js";

const fichierCourant = fileURLToPath(import.meta.url);
const dossierCourant = dirname(fichierCourant);
const racinePublique = normalize(join(dossierCourant, "..", "public"));
const port = Number(process.env.PORT || 3000);
const LIMITE_CORPS = 10_000;

const TYPES_MIME = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function appliquerEntetesSecurite(reponse) {
  reponse.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; object-src 'none'"
  );
  reponse.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  reponse.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  reponse.setHeader("Referrer-Policy", "no-referrer");
  reponse.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  reponse.setHeader("X-Content-Type-Options", "nosniff");
  reponse.setHeader("X-Frame-Options", "DENY");
  reponse.setHeader("Permissions-Policy", "camera=(), geolocation=(), microphone=()");
  reponse.setHeader("Cache-Control", "no-store");
}

function envoyerJson(reponse, statut, donnees) {
  appliquerEntetesSecurite(reponse);
  reponse.writeHead(statut, {
    "Content-Type": "application/json; charset=utf-8"
  });
  reponse.end(JSON.stringify(donnees));
}

async function lireCorps(requete) {
  const morceaux = [];
  let taille = 0;

  for await (const morceau of requete) {
    taille += morceau.length;

    if (taille > LIMITE_CORPS) {
      throw new Error("Corps trop volumineux.");
    }

    morceaux.push(morceau);
  }

  return Buffer.concat(morceaux).toString("utf8");
}

async function servirFichier(reponse, cheminDemande) {
  const fichierDemande = cheminDemande === "/" ? "/index.html" : cheminDemande;
  const cheminNormalise = normalize(join(racinePublique, fichierDemande));

  if (!cheminNormalise.startsWith(racinePublique)) {
    envoyerJson(reponse, 403, { erreur: "Acces refuse." });
    return;
  }

  try {
    const contenu = await readFile(cheminNormalise);
    appliquerEntetesSecurite(reponse);
    reponse.writeHead(200, {
      "Content-Type": TYPES_MIME[extname(cheminNormalise)] || "application/octet-stream"
    });
    reponse.end(contenu);
  } catch {
    envoyerJson(reponse, 404, { erreur: "Ressource introuvable." });
  }
}

const serveur = http.createServer(async (requete, reponse) => {
  try {
    const url = new URL(requete.url || "/", `http://${requete.headers.host || "localhost"}`);

    if (requete.method === "GET") {
      await servirFichier(reponse, url.pathname);
      return;
    }

    if (requete.method === "POST" && url.pathname === "/api/analyser") {
      const typeContenu = String(requete.headers["content-type"] || "");

      if (!typeContenu.startsWith("application/json")) {
        envoyerJson(reponse, 415, { erreur: "Le type de contenu doit etre application/json." });
        return;
      }

      const corps = await lireCorps(requete);
      const donnees = JSON.parse(corps || "{}");
      const resultat = executerRecherche(donnees?.requete || "");

      envoyerJson(reponse, resultat.succes ? 200 : 400, resultat);
      return;
    }

    envoyerJson(reponse, 405, { erreur: "Methode non autorisee." });
  } catch (erreur) {
    const message = erreur instanceof Error ? erreur.message : "Erreur interne.";
    envoyerJson(reponse, 500, { erreur: message });
  }
});

serveur.listen(port, () => {
  console.log(`Serveur lance sur http://localhost:${port}`);
});

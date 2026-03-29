const formulaire = document.getElementById("formulaire-recherche");
const champRecherche = document.getElementById("requete");
const zoneErreur = document.getElementById("message-erreur");
const zoneResultats = document.getElementById("resultats");
const gabaritModule = document.getElementById("gabarit-module");

formulaire.addEventListener("submit", async (evenement) => {
  evenement.preventDefault();
  afficherErreur("");
  zoneResultats.innerHTML = "";

  const requete = champRecherche.value.trim();

  if (!requete) {
    afficherErreur("Saisis un nom, un pseudo ou une adresse e-mail.");
    return;
  }

  try {
    const reponse = await fetch("/api/analyser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ requete })
    });

    const resultat = await reponse.json();

    if (!reponse.ok || !resultat.succes) {
      afficherErreur(resultat.erreur || "Une erreur est survenue.");
      return;
    }

    afficherResultats(resultat.donnees);
  } catch {
    afficherErreur("Impossible de contacter le serveur local.");
  }
});

function afficherErreur(message) {
  zoneErreur.textContent = message;
  zoneErreur.hidden = !message;
}

function afficherResultats(donnees) {
  const fragment = document.createDocumentFragment();

  donnees.modules.forEach((moduleCourant) => {
    const carte = gabaritModule.content.firstElementChild.cloneNode(true);
    carte.querySelector(".module-categorie").textContent = moduleCourant.categorie;
    carte.querySelector(".module-titre").textContent = moduleCourant.nom;
    carte.querySelector(".module-resume").textContent = moduleCourant.resume;
    carte.querySelector(".module-niveau").textContent = moduleCourant.niveau;

    const liste = carte.querySelector(".module-elements");

    moduleCourant.resultats.forEach((entree) => {
      const element = document.createElement("li");
      element.className = "element-resultat";

      const contenu = document.createElement("div");
      contenu.className = "element-contenu";

      const titre = document.createElement("strong");
      titre.textContent = entree.titre;

      const resume = document.createElement("p");
      resume.textContent = entree.resume;

      const groupeActions = document.createElement("div");
      groupeActions.className = "groupe-actions";

      entree.actions.forEach((actionCourante, indexAction) => {
        const lien = document.createElement("a");
        lien.className = "lien-action";
        lien.href = actionCourante.url;
        lien.target = "_blank";
        lien.rel = "noreferrer noopener";
        lien.textContent = actionCourante.libelle;

        if (indexAction === entree.actions.length - 1) {
          lien.dataset.suppression = "true";
        }

        groupeActions.appendChild(lien);
      });

      contenu.append(titre, resume, groupeActions);
      element.appendChild(contenu);
      liste.appendChild(element);
    });

    fragment.appendChild(carte);
  });

  zoneResultats.appendChild(fragment);
}

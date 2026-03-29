import test from "node:test";
import assert from "node:assert/strict";

import { executerRecherche } from "../src/service-recherche.js";
import { validerRequete } from "../src/utilitaires/validation.js";

test("validerRequete accepte une requete simple", () => {
  const resultat = validerRequete("alice.dev");

  assert.equal(resultat.valide, true);
  assert.equal(resultat.valeur, "alice.dev");
});

test("validerRequete refuse les caracteres dangereux", () => {
  const resultat = validerRequete("<script>");

  assert.equal(resultat.valide, false);
  assert.match(resultat.message, /non autorises/i);
});

test("executerRecherche renvoie les trois modules attendus", () => {
  const resultat = executerRecherche("alice");

  assert.equal(resultat.succes, true);
  assert.equal(resultat.donnees.requete, "alice");
  assert.equal(resultat.donnees.modules.length, 3);
  assert.deepEqual(
    resultat.donnees.modules.map((moduleCourant) => moduleCourant.nom),
    ["Google", "Usernames", "Breaches"]
  );
});

test("chaque module propose au moins une action de suppression", () => {
  const resultat = executerRecherche("alice");

  for (const moduleCourant of resultat.donnees.modules) {
    assert.ok(moduleCourant.resultats.length > 0);

    for (const entree of moduleCourant.resultats) {
      assert.ok(Array.isArray(entree.actions));
      assert.ok(entree.actions.length >= 2);
      assert.ok(entree.actions[0].url.startsWith("https://"));
      assert.ok(
        entree.actions.some((actionCourante) =>
          /supprimer|effacement|reinitialiser|privatiser|confidentialite/i.test(actionCourante.libelle)
        )
      );
    }
  }
});

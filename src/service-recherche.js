import { validerRequete } from "./utilitaires/validation.js";
import { creerResultatsGoogle } from "./modules/module-google.js";
import { creerResultatsPseudos } from "./modules/module-pseudos.js";
import { creerResultatsBreaches } from "./modules/module-breaches.js";

export function executerRecherche(requeteBrute) {
  const verification = validerRequete(requeteBrute);

  if (!verification.valide) {
    return {
      succes: false,
      erreur: verification.message
    };
  }

  const requete = verification.valeur;

  return {
    succes: true,
    donnees: {
      requete,
      modules: [
        creerResultatsGoogle(requete),
        creerResultatsPseudos(requete),
        creerResultatsBreaches(requete)
      ]
    }
  };
}

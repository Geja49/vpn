import { validerRequete } from "./utilitaires/validation.js";
import { analyserGoogle } from "./modules/module-google.js";
import { analyserPseudos } from "./modules/module-pseudos.js";
import { analyserBreaches } from "./modules/module-breaches.js";

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
        analyserGoogle(requete),
        analyserPseudos(requete),
        analyserBreaches(requete)
      ]
    }
  };
}

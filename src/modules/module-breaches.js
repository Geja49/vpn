import { encoderSegment } from "../utilitaires/validation.js";

function calculerNiveau(requete) {
  const base = requete.length + (requete.includes("@") ? 18 : 6);

  if (base >= 28) {
    return "eleve";
  }

  if (base >= 18) {
    return "moyen";
  }

  return "faible";
}

function creerAction(libelle, url) {
  return { libelle, url };
}

function creerResultat(titre, resume, lienVerification, lienSuppression, libelleSuppression) {
  return {
    titre,
    resume,
    actions: [
      creerAction("Verifier l'exposition", lienVerification),
      creerAction(libelleSuppression, lienSuppression)
    ]
  };
}

export function creerResultatsBreaches(requete) {
  const cible = encoderSegment(requete);
  const urlEffacementEurope = "https://commission.europa.eu/law/law-topic/data-protection/reform/rights-citizens/my-rights/right-erasure_en";

  return {
    nom: "Breaches",
    categorie: "Fuites",
    niveau: calculerNiveau(requete),
    description: `Analyse preventive du risque d'exposition autour de ${requete}.`,
    resultats: [
      creerResultat(
        "Verifier les fuites connues",
        "Controle la presence potentielle de l'identifiant dans des incidents publics references.",
        `https://haveibeenpwned.com/account/${cible}`,
        `https://haveibeenpwned.com/account/${cible}`,
        "Supprimer ou reinitialiser l'acces"
      ),
      creerResultat(
        "Renouveler les mots de passe associes",
        "Mettre en place des mots de passe uniques et activer l'authentification multifacteur.",
        "https://support.google.com/accounts/answer/185839",
        "https://myaccount.google.com/security",
        "Supprimer les acces exposes"
      ),
      creerResultat(
        "Demander l'effacement quand c'est possible",
        "Exercer le droit a l'effacement ou fermer le compte compromis lorsque le service le permet.",
        urlEffacementEurope,
        urlEffacementEurope,
        "Demander un effacement"
      )
    ]
  };
}

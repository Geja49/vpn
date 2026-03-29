import { encoderSegment } from "../utilitaires/validation.js";

function creerAction(libelle, url) {
  return { libelle, url };
}

function creerResultat(titre, resume, lienRecherche, lienSuppression) {
  return {
    titre,
    resume,
    actions: [
      creerAction("Ouvrir la recherche", lienRecherche),
      creerAction("Demander la suppression", lienSuppression)
    ]
  };
}

export function creerResultatsGoogle(requete) {
  const segment = encoderSegment(requete);

  return {
    nom: "Google",
    categorie: "Moteur de recherche",
    niveau: "guide",
    description: "Repere les traces indexees et oriente vers les formulaires de suppression appropries.",
    resultats: [
      creerResultat(
        `Resultats publics pour ${requete}`,
        "Recherche simple des pages indexees susceptibles d'exposer des informations personnelles.",
        `https://www.google.com/search?q=${segment}`,
        "https://support.google.com/websearch/troubleshooter/3111061"
      ),
      creerResultat(
        `Images publiques associees a ${requete}`,
        "Verification des images visibles dans Google Images pour identifier une exposition inutile.",
        `https://www.google.com/search?tbm=isch&q=${segment}`,
        "https://support.google.com/websearch/troubleshooter/3111061"
      ),
      creerResultat(
        `Recherche precise sur ${requete}`,
        "Utilise une requete plus ciblee pour limiter les faux positifs sur les grands reseaux sociaux.",
        `https://www.google.com/search?q=%22${segment}%22+OR+site%3Afacebook.com+OR+site%3Alinkedin.com`,
        "https://support.google.com/legal/troubleshooter/1114905"
      )
    ]
  };
}

import { encoderSegment } from "../utilitaires/validation.js";

function creerResultatPseudo(titre, resume, lienRecherche, libelleSuppression, lienSuppression) {
  return {
    titre,
    resume,
    actions: [
      {
        libelle: "Ouvrir le profil",
        url: lienRecherche
      },
      {
        libelle: libelleSuppression,
        url: lienSuppression
      }
    ]
  };
}

export function creerResultatsPseudos(requete) {
  const pseudo = requete.replace(/^@/, "");
  const cible = encoderSegment(pseudo);

  return {
    nom: "Usernames",
    categorie: "Pseudos",
    niveau: "moyen",
    description: `Verification guidee du pseudo "${pseudo}" sur plusieurs plateformes courantes.`,
    resultats: [
      creerResultatPseudo(
        "GitHub",
        "Verifier si le pseudo expose des depots publics ou des informations personnelles.",
        `https://github.com/${cible}`,
        "Supprimer ou privatiser les depots",
        "https://github.com/settings/repositories"
      ),
      creerResultatPseudo(
        "X",
        "Controler si le pseudo est associe a des anciens messages, likes ou abonnements publics.",
        `https://x.com/${cible}`,
        "Supprimer les traces ou durcir la confidentialite",
        "https://x.com/settings/account"
      ),
      creerResultatPseudo(
        "Reddit",
        "Revoir les publications et commentaires publics relies au pseudo.",
        `https://www.reddit.com/user/${cible}/`,
        "Supprimer les contributions visibles",
        `https://www.reddit.com/user/${cible}/`
      )
    ]
  };
}

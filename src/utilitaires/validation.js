const LIMITE_REQUETE = 120;
const CARACTERES_AUTORISES = /^[a-zA-Z0-9@._+\-\s]+$/;

export function nettoyerEntree(valeur) {
  if (typeof valeur !== "string") {
    return "";
  }

  return valeur.trim().replace(/\s+/g, " ");
}

export function validerRequete(valeur) {
  const requete = nettoyerEntree(valeur);

  if (!requete) {
    return {
      valide: false,
      message: "La requete est obligatoire."
    };
  }

  if (requete.length > LIMITE_REQUETE) {
    return {
      valide: false,
      message: `La requete doit contenir au maximum ${LIMITE_REQUETE} caracteres.`
    };
  }

  if (!CARACTERES_AUTORISES.test(requete)) {
    return {
      valide: false,
      message: "La requete contient des caracteres non autorises."
    };
  }

  return {
    valide: true,
    valeur: requete
  };
}

export function encoderSegment(valeur) {
  return encodeURIComponent(nettoyerEntree(valeur));
}

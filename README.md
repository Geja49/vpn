# Reducteur d'empreinte numerique

Application web modulaire pour identifier des traces numeriques publiques et proposer des actions de suppression guidees.

## Objectifs

- approche simple et facile a comprendre ;
- architecture modulaire pour tester chaque brique separement ;
- base securisee avec validation stricte des entrees et en-tetes HTTP durcis ;
- proposition d'actions concretes de suppression plutot qu'une simple liste de resultats.

## Modules

- **Google** : genere des pistes de recherche publique autour d'un nom, d'un email ou d'un pseudo ;
- **Pseudos** : propose des recherches sur plusieurs plateformes courantes ;
- **Breaches** : indique les reflexes a suivre pour verifier une exposition et lancer une suppression ou une remediation.

## Demarrage local

```bash
npm run demarrer
```

Puis ouvrir `http://localhost:3000`.

## Tests

```bash
npm test
```

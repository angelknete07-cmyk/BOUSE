# Passe 30 : parcours par objectif, entraînement, date de vérification, fiches

Suite proposée le 6 novembre 2026 et validée par l'utilisateur (« Vz fait tout »). **La direction artistique n'est pas déclarée validée.**

## Ce qui change

- **Parcours par objectif.** Cinq parcours sont proposés dans l'Académie, sous « Commencer ici » :
  - Créer mon entreprise (11 étapes) ;
  - Gérer mon argent (9) ;
  - Commencer à investir (9) ;
  - Piloter une entreprise (7) ;
  - Travailler avec l'IA (7).

  « Suivre ce parcours » le mémorise (`activePathId`, champ facultatif validé au chargement). La recommandation unique de l'application suit alors son ordre : l'accueil indique « Étape 1 sur 11 de votre parcours « Créer mon entreprise » ». Un test vérifie que les prérequis de chaque leçon arrivent toujours plus tôt dans son parcours.

- **Entraînement libre** (onglet Pratiquer). Il propose des séries de quatre questions « quel terme correspond à cette définition ? », construites à partir des 165 termes du lexique, avec des choix de la même catégorie. « Nouvelle série » les renouvelle. **Rien n'est enregistré** : un quiz validé ne peut jamais repasser « à revoir », et un test le vérifie.
- **Date de vérification.** Les 14 leçons à règles datées (seuils, taux, calendriers) affichent « Règles vérifiées en novembre 2026 ». Au-delà de 12 mois, la mention passe en avertissement : « à revérifier ».
- **Fiches pratiques à télécharger** (onglet Appliquer) :
  - liste de contrôle de création d'entreprise ;
  - modèle de facture avec ses mentions ;
  - plan de trésorerie sur six mois (CSV) ;
  - budget mensuel (CSV).

## Contrôles

- `npm test` : 245 cas, dont 7 nouveaux : parcours, recommandation, entraînement, vérification, fiches, validation de l'état.
- `npx playwright test` : 86 tests, dont un nouveau qui suit un parcours, vérifie l'accueil, fait un entraînement sans tentative enregistrée et télécharge une fiche.
- Build sans avertissement ; aucun débordement ni erreur console, desktop et mobile.

## Captures

- `passe-30/` : Académie avec les parcours, entraînement, fiche (desktop 1440 × 1000, Pixel 7).
- Paire `latest-*` : Académie.
- Archive datée.

## Ce qui reste

- **Supabase :** le projet « bouse » est créé ; le schéma est à installer depuis votre ordinateur, puis viennent le branchement dans Vercel et le mentor.
- **À valider par vous :** la review externe de la direction artistique et un test avec de vrais débutants.

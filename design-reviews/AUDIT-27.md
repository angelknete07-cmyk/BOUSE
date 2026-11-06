# Passe 27 : simulateurs, onglets en pastilles, lexique indexé

Suite du plan après la passe 26 (« Vz go », 6 novembre 2026). Elle traite les points restants d'AUDIT-26 : le rythme des leçons sans manipulation (point 12), les onglets de leçon et la longueur du lexique. **La direction artistique n'est pas déclarée validée.**

## Cinq nouveaux simulateurs

Il y a désormais 16 leçons interactives sur 43, contre 11. Chaque simulateur repose sur un moteur pur (`src/lib/lessonModels.ts`, 7 tests unitaires) et vit dans une scène (`src/components/LessonScenesMore.tsx`).

| Leçon                            | Ce qu'on manipule                                                               | Ce que la scène fait comprendre                                                                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Comprendre l'impôt sur le revenu | revenu imposable, nombre de parts                                               | Impôt tranche par tranche, taux marginal et taux moyen, et l'effet d'une hausse de 1 000 € : on paie un peu plus d'impôt, mais on garde toujours plus. |
| BFR et plan de trésorerie        | délais clients, délais fournisseurs, durée du stock                             | Argent bloqué contre crédit fournisseurs ; trésorerie supplémentaire nécessaire si les ventes augmentent de 20 %.                                      |
| Louer ou acheter                 | années d'occupation, évolution du prix du logement                              | Coût net de chaque option côte à côte, point de bascule, mensualité.                                                                                   |
| Construire son allocation        | part d'actions visée, mouvement des actions sur l'année                         | Dérive de l'allocation et opération pour revenir à la cible.                                                                                           |
| Choisir son statut               | cinq critères (associés, levée de fonds, protection sociale, plafonds, charges) | La forme vers laquelle ils orientent, avec la raison de chaque orientation et sa contrepartie.                                                         |

**Faits utilisés :**

- **Barème de l'impôt 2026** (revenus 2025, loi de finances pour 2026, seuils relevés de 0,9 %) : 11 600 / 29 579 / 84 577 / 181 917 €, taux de 0 / 11 / 30 / 41 / 45 %. Les sources secondaires concordent en novembre 2026. C'est un impôt brut, avant plafonnement du quotient familial, décote et réductions, marqué « à vérifier sur impots.gouv.fr ».
- **Autres simulateurs :** hypothèses fictives affichées dans la scène (notaire environ 7,5 % dans l'ancien, entretien 1,5 % par an, loyers +2 % par an). Mentions : aucun conseil en investissement, aucun conseil juridique.

## Interface

- **Onglets de leçon en pastilles**, à la manière de la référence 1 : piste sombre bordée, étape active en carte éclairée. Rôles `tab`, flèches clavier et focus inchangés.
- **Lexique :** index alphabétique collant (sauter à une lettre), fiches resserrées sur mobile, fondu en bout de rangée. Le mobile passe de 27 212 à 23 365 px. La longueur restante vient des 165 termes ; l'index évite de tout faire défiler.
- **Choix des scènes :** une légende visible (« Paiement des clients », « Prix du logement par an ») et des libellés courts sur une ligne. Deux options ne sont jamais empilées dans une seule barre : un graphe de comparaison les met côte à côte.

## Défauts trouvés en cours de passe et corrigés

- La barre unique de « Louer ou acheter » additionnait deux alternatives : remplacée par deux barres comparées.
- Libellés des choix sur deux lignes sur mobile.
- « % » orphelins en fin de ligne : espaces insécables.
- Index du lexique coupé net sur mobile : ajout d'un fondu.
- Une valeur attendue erronée dans mon propre test (748 € et non 0 € pour 2 parts) : corrigée.

## Contrôles

- `npm test` : 220 cas réussis.
- `npx playwright test` : 80 tests réussis, dont un nouveau test qui vérifie trois simulateurs (impôt de 2 104 € puis 748 €, statut SAS, bascule louer/acheter).
- Build sans avertissement ; Prettier conforme ; aucun débordement ni erreur console sur les cinq scènes, desktop et mobile.

## Captures

- `simulateurs-27/` : les cinq scènes après une interaction (desktop 1440 × 1000 à densité 2, Pixel 7), plus le lexique et la leçon avec ses pastilles.
- `latest-desktop.png` / `latest-mobile.png` : leçon « Chiffre d'affaires, marge et trésorerie » avec les onglets en pastilles.
- Archive `2026-11-06_10-33-15-Europe-Paris`.

## Ce qui reste

- **Leçons sans scène :** 27 sur 43. Priorités : lecture de bilan, prévisionnel, intérêts du crédit immobilier, arnaques (jeu de repérage), évaluation d'une IA (jeu de cas de test).
- **Lexique :** il faudrait des fiches repliables pour réduire encore la longueur.
- **Accueil :** la trajectoire reste dense avec 11 notions.
- **À valider par vous :** la review externe de la direction artistique et un test avec de vrais utilisateurs.

# Passe 23 : balayage de test complet

Demande de l'utilisateur, le 6 novembre 2026 : « tester toutes les fonctionnalités possibles et tout ce qui est testable visuellement comme techniquement », chercher les bugs, les améliorations et de nouvelles idées.

## Ce qui a été testé

| Contrôle                               | Périmètre                                                                                                | Résultat                                                                              |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Balayage visuel et technique           | 13 écrans + 43 leçons × toutes les séquences × 4 onglets, desktop 1440 px et Pixel 7 (près de 900 états) | 1er passage : 10 alertes d'accessibilité (une seule cause). 2e passage : **0 défaut** |
| Erreurs JavaScript et console          | même périmètre                                                                                           | aucune                                                                                |
| Requêtes en échec                      | même périmètre                                                                                           | aucune                                                                                |
| Débordement horizontal                 | même périmètre, plus 768 px et 1024 px sur 14 écrans                                                     | aucun                                                                                 |
| Accessibilité (axe, WCAG 2.1 AA)       | 13 écrans et un échantillon de leçons et de quiz, sur les deux formats                                   | 1 défaut corrigé (barre de progression du quiz sans rôle)                             |
| Hors ligne                             | version compilée : accueil, leçon, lexique, Académie après une visite                                    | OK, 28 fichiers en cache                                                              |
| Quiz d'une nouvelle leçon              | micro-entreprise réussie, suite proposée, accueil et carte des compétences mis à jour                    | OK                                                                                    |
| Lexique au clavier                     | Entrée ouvre, Échap ferme, le focus revient au terme                                                     | OK                                                                                    |
| Recherche universelle                  | « micro-entreprise », « SCPI », « AI Act », « prélèvement à la source », « bilan »                       | OK, 1 à 3 résultats chacun                                                            |
| Export Markdown                        | nouvelle leçon avec une note personnelle                                                                 | OK : titre et note présents                                                           |
| « Copier et demander à mon Claude »    | presse-papiers avec le contexte de la leçon                                                              | OK                                                                                    |
| Performance (version compilée, locale) | accueil : plus grand élément affiché (LCP) 220 ms, 300 ko transférés                                     | OK                                                                                    |
| Suites automatiques                    | `npm test` 207 cas ; `npx playwright test` 74 tests                                                      | tous réussis                                                                          |

## Bugs trouvés et corrigés

1. **Clignotement des boutons au survol** (vrai bug, visible par l'utilisateur).
   - Cause : le survol remontait les boutons d'un pixel. Avec le pointeur sur le bord inférieur, le bouton quittait le pointeur puis revenait, à chaque image.
   - Comment il a été trouvé : le nouveau test du catalogue restait bloqué sur un bouton « instable ». Un relevé image par image a montré une oscillation de 868,7 à 869,7 px, sans aucune animation en cours.
   - Correction : plus aucun élément cliquable ne se déplace lui-même ; seul son contenu (le cercle d'une notion) monte. Même correction pour les boutons, les cartes, les choix de révision, les nœuds de l'atlas et la constellation de l'Atelier IA.
2. **« / FONDATIONS » sous le numéro** des nouvelles leçons d'entrepreneuriat et de finance : la règle ne connaissait que deux domaines. Le domaine réel s'affiche désormais.
3. **Barre de progression du quiz** : libellé ARIA sur un élément sans rôle (axe). Elle a maintenant le rôle `progressbar`, avec ses valeurs.
4. **« Vos fondations »** dans le menu mobile, pour un parcours de 43 notions : remplacé par « Votre parcours ».
5. **Paquet JavaScript trop lourd** (vague précédente) : il passe de 596 à 78 kB.

## Nouveau test permanent

`tests/catalogue.spec.ts` ouvre chaque leçon, chaque séquence et chaque onglet, sur desktop et mobile. Il échoue en cas d'erreur, de débordement ou d'élément instable (28 s pour les deux formats). Une leçon future cassée sera donc détectée par la CI.

## Nouvelles idées pour l'application

Classées par utilité estimée :

1. **Scènes interactives pour les nouvelles leçons**, sur le modèle des simulateurs existants :
   - simulateur de micro-entreprise (chiffre d'affaires → cotisations, impôt, revenu) ;
   - comparateur de statuts ;
   - plan de trésorerie à remplir ;
   - simulateur louer ou acheter ;
   - barème d'impôt fictif ;
   - rééquilibrage d'allocation.
2. **Parcours guidés par objectif.** Par exemple « Créer mon entreprise » : modèle, prix, statut, création, micro, facturation, financement, trésorerie, dans l'ordre et à travers les domaines.
3. **Mode entraînement sans version.** Des questions supplémentaires par leçon, hors du quiz officiel, pour s'exercer davantage sans faire repasser les quiz validés « à revoir ».
4. **Date de vérification visible par leçon**, avec un signal si elle dépasse douze mois, pour les règles fiscales et sociales qui changent chaque année.
5. **Recherche dans le texte des leçons**, et pas seulement dans les titres et le lexique.
6. **Fiches pratiques à télécharger** : liste de création, modèle de facture, plan de trésorerie (l'export Markdown existe déjà).
7. **Suivi de régularité** : semaines actives, minutes cumulées, prochain rappel.
8. **Rappels de révision par notification** (application installée). Nécessite un service d'envoi.

## Ce qui reste imparfait

- Les 28 nouvelles leçons n'ont pas encore de scène interactive.
- Les quiz restent à deux questions.
- **Faits réglementaires :** vérifiés le 6 novembre 2026 sur des sources secondaires concordantes, les sites officiels n'étant pas accessibles depuis la session. Ils seront à revoir à chaque loi de finances.
- **Trajectoire de l'accueil :** avec 11 notions (Investissement), ses liens se croisent beaucoup.
- **Non testé :** synchronisation Supabase et mentor intégré (non configurés), appareil physique, Safari, Firefox, lecteur d'écran réel.

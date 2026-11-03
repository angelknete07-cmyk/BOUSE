# Review design — passe 08 : scènes, atlas et instruments

**3 novembre 2026, 15:29 Europe/Paris.** Vérification interne effectuée ; **review design externe attendue**. Passe exclusivement artistique, en réponse à la demande de correction de composition. Aucun élargissement fonctionnel.

## Rendus prioritaires

| Écran                                     | Desktop                                                 | Mobile                                                 |
| ----------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------ |
| Accueil, premier écran                    | [Capture](latest-desktop.png)                           | [Capture](latest-mobile.png)                           |
| Accueil complet, trajectoire et domaines  | [Capture](screens/desktop/01-home.png)                  | [Capture](screens/mobile/01-home.png)                  |
| AI Lab, instrument et extrait sélectionné | [Capture](screens/desktop/06-ai-structure-viewport.png) | [Capture](screens/mobile/06-ai-structure-viewport.png) |
| Academy, atlas                            | [Capture](screens/desktop/02-academy.png)               | [Capture](screens/mobile/02-academy.png)               |
| Leçon, concept et manipulation            | [Capture](screens/desktop/03-lecon-learn.png)           | [Capture](screens/mobile/03-lecon-learn.png)           |
| Lab financier, équations et seuil         | [Capture](screens/desktop/05-lab-financier.png)         | [Capture](screens/mobile/05-lab-financier.png)         |

**133 captures réelles**, dont la galerie existante pour contrôler la propagation du design system. Desktop : 1440 × 1000. Mobile : Pixel 7 émulé, viewport CSS 412 × 839, échelle 2,625. Données de démonstration fictives. Les captures complètes conservent les barres fixes à la limite du premier viewport ; aucune retouche d’image.

## Ce qui change

- **Accueil** : scène panoramique, relief argenté animé, titre dominant ; trajectoire ouverte et deux domaines aux signatures différentes, courbes pour Finance et réseau pour IA.
- **AI Lab** : sept repères reliés au texte, sélection d’un passage, comparaison original/trame ; sur mobile, vues Structure et Écrire partageant le même brouillon. Le score existant devient secondaire.
- **Academy** : carte spatiale des notions et de leurs prérequis, sélection focalisée, catalogue en second choix ; exploration horizontale mobile.
- **Leçon** : compositions différentes pour concept, explications, cas, teach-back et quiz. La manipulation remonte avant le développement du concept sur mobile.
- **Lab financier** : paramètres dans l’équation par vente, graphe ventes/coûts animé, seuil visible, équation mensuelle. Les règles de calcul sont conservées et les montants affichent les centimes lorsqu’ils existent.
- **Système central** : noir profond, blanc cassé, argent, surfaces ponctuelles, Manrope variable auto-hébergée, indices typographiques et mouvement mesuré. Logo conservé.

L’[audit avant intervention](AUDIT-08.md) décrit les écarts observés. Les règles métier, contenus de cours, sauvegardes et données utilisateur n’ont pas été refondus.

## Comparaison avant / après

Base : passe 07, archive `2026-11-03_08-16-27-Europe-Paris`. Comparaison effectuée à viewports identiques.

| Écran         | Avant desktop / mobile                                                                                                                                                            | Différence visible dans les nouveaux rendus ci-dessus                                                                      |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Accueil       | [Desktop](archive/2026-11-03_08-16-27-Europe-Paris/screens/desktop/01-home.png) · [Mobile](archive/2026-11-03_08-16-27-Europe-Paris/screens/mobile/01-home.png)                   | Le hero et son petit widget adjacent cèdent la place à une scène dominante et un réseau en bande ouverte.                  |
| AI Lab        | [Desktop](archive/2026-11-03_08-16-27-Europe-Paris/screens/desktop/06-ai-lab.png) · [Mobile](archive/2026-11-03_08-16-27-Europe-Paris/screens/mobile/06-ai-lab.png)               | Le formulaire et la checklist empilés deviennent un instrument texte/réseau ; la carte est visible dès l’ouverture mobile. |
| Academy       | [Desktop](archive/2026-11-03_08-16-27-Europe-Paris/screens/desktop/02-academy.png) · [Mobile](archive/2026-11-03_08-16-27-Europe-Paris/screens/mobile/02-academy.png)             | Les articles identiques deviennent un territoire avec relations et détail sélectionné.                                     |
| Leçon         | [Desktop](archive/2026-11-03_08-16-27-Europe-Paris/screens/desktop/03-lecon-learn.png) · [Mobile](archive/2026-11-03_08-16-27-Europe-Paris/screens/mobile/03-lecon-learn.png)     | Concept éditorial face à la scène ; en-tête mobile allégé et manipulation remontée.                                        |
| Lab financier | [Desktop](archive/2026-11-03_08-16-27-Europe-Paris/screens/desktop/05-lab-financier.png) · [Mobile](archive/2026-11-03_08-16-27-Europe-Paris/screens/mobile/05-lab-financier.png) | Les formulaires et métriques séparés deviennent deux équations et une représentation physique du seuil.                    |

## États complémentaires

Les deux dossiers `screens/desktop/` et `screens/mobile/` contiennent les mêmes noms :

- Academy : `02-academy-selection.png`, `02-academy-catalogue.png`.
- AI Lab : `06-ai-empty.png`, `06-ai-writing.png`, `06-ai-structure.png`, `06-ai-comparison.png`.
- Leçon complète : `03-lecon-learn.png`, `03-lecon-mechanisms.png`, `03-lecon-vocabulary.png`, `03-lecon-pitfall.png`, `03-lecon-case.png`, `03-teach-back.png`, `03-lecon-summary.png`, `03-lecon-practice.png`, `04-quiz-feedback.png`, `04-quiz-valide.png`, `03-lecon-application.png`.
- Lab financier : `05-lab-below-threshold.png`, `05-lab-invalid.png`.

## Vérifications et limites

Compilation TypeScript/Vite réussie. **146 cas unitaires et 46 tests navigateur réussis** sur la version finale, dont huit tests de galerie, interactions et motion. Aucun test ignoré. Le manifeste associe les 133 images aux sources finales et au dernier run réussi.

Inspection interne : composition, contrastes de masse, hiérarchie, spacing, profondeur, lisibilité des diagrammes, sélection, erreurs, progression, responsive et états du quiz. Corrections issues des rendus : vue mobile contextuelle pour AI Lab, remontée de la scène de leçon, séparation d’un style d’atlas qui débordait sur la carte de compétences. Les captures ont été régénérées après correction.

Contrôle complémentaire des cinq écrans à 320, 375, 768, 1024 et 1920 px : aucun débordement du document. Matière SVG observée en mouvement (18 s, amplitude de quelques pixels, easing non linéaire), désactivée avec `prefers-reduced-motion`. La carte horizontale reste volontairement défilable à l’intérieur de son conteneur. Contrôle du build servi : cinq routes, police locale et ressources compilées chargées sans erreur ; transitions du graphe observées, puis désactivées en reduced motion. Navigation au clavier des vues et repères AI Lab vérifiée avec focus visible.

AI Lab reste un outil local à indices lexicaux, sans modèle IA connecté ; les sept repères graphiques et le score à six règles ne certifient pas la qualité d’un prompt. La trame doit être complétée. Les exemples financiers sont fictifs et simplifiés. Chromium et émulation mobile uniquement, sans validation sur appareil physique ni Safari/Firefox.

Archive finale : `archive/2026-11-03_15-29-31-Europe-Paris/`. Reproduction : `npx playwright test tests/design.spec.ts`, puis `node scripts/save-design-review.mjs --primary=00-home-viewport`. **La suite fonctionnelle reste suspendue jusqu’à la review design externe.**

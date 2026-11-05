# Review design — passe 10 : navigation et accessibilité

**5 novembre 2026, 05:27 Europe/Paris.** Suite autorisée après la proposition Inter. Vérification interne effectuée ; **review design externe attendue** pour cette passe.

## Changements

- Recherche utilisable avec ↑/↓, Home/End et Entrée ; compteur de résultats annoncé et état vide explicite.
- Menu mobile et recherche exclusifs ; fermeture et changement de page rendent le focus au bon endroit. Le document porte le titre de la leçon ou du projet ouvert.
- Diagnostic et quiz : focus sur la nouvelle étape ou la correction ; sur mobile, cette correction reste au-dessus du dock.
- Libellés accessibles alignés sur le texte visible de l’accueil, de l’Academy, des compétences, de l’AI Lab, du portfolio et des mois de simulation. Groupes et progression exposent leur rôle réel.
- Contraste renforcé pour les indices de trajectoire, la mention de chapitre et les opérateurs de l’équation mensuelle, avec les tokens existants. Balisage des résultats financiers corrigé.

L’[audit](AUDIT-10.md) détaille les constats. La classe commune destinée aux lecteurs d’écran a aussi été corrigée après inspection d’un rendu intermédiaire : elle ne déforme plus l’avatar latéral. Les rendus ci-dessous proviennent tous de la version finale.

## Captures et comparaison

Paire principale : [desktop](latest-desktop.png) · [mobile](latest-mobile.png). Elle montre le premier résultat de recherche focalisé au clavier.

| Écran     | Avant desktop                                                                                | Avant mobile                                                                                | Après desktop                                           | Après mobile                                           |
| --------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------ |
| Recherche | [Voir](../2026-11-03_20-49-59-Europe-Paris/screens/desktop/03-recherche.png)            | [Voir](../2026-11-03_20-49-59-Europe-Paris/screens/mobile/03-recherche.png)            | [Voir](screens/desktop/16-search-keyboard-viewport.png) | [Voir](screens/mobile/16-search-keyboard-viewport.png) |
| Accueil   | [Voir](../2026-11-03_20-49-59-Europe-Paris/screens/desktop/00-home-viewport.png)        | [Voir](../2026-11-03_20-49-59-Europe-Paris/screens/mobile/00-home-viewport.png)        | [Voir](screens/desktop/00-home-viewport.png)            | [Voir](screens/mobile/00-home-viewport.png)            |
| Leçon     | [Voir](../2026-11-03_20-49-59-Europe-Paris/screens/desktop/03-lecon-learn-viewport.png) | [Voir](../2026-11-03_20-49-59-Europe-Paris/screens/mobile/03-lecon-learn-viewport.png) | [Voir](screens/desktop/03-lecon-learn-viewport.png)     | [Voir](screens/mobile/03-lecon-learn-viewport.png)     |

États complémentaires : correction focalisée du quiz [desktop](screens/desktop/04-quiz-feedback-focus-viewport.png) / [mobile](screens/mobile/04-quiz-feedback-focus-viewport.png), recherche vide [desktop](screens/desktop/16-search-empty.png) / [mobile](screens/mobile/16-search-empty.png), [menu mobile](screens/mobile/02-navigation-mobile.png). La galerie [desktop](screens/desktop/) / [mobile](screens/mobile/) contient aussi l’atlas, AI Lab et les deux Labs financiers.

La comparaison conserve Inter, les compositions éditoriales, la matière monochrome et les niveaux de surfaces. La recherche ajoute un repère clavier net sans accent coloré ; les résultats financiers gardent leur alignement. Les changements de hiérarchie et de densité restent limités aux informations d’interaction. Les captures de quiz avec focus conservent la position réelle après validation ; les autres vues complètes commencent en haut de page. Le dock fixe apparaît à la limite du premier viewport dans les captures longues.

## Vérifications effectuées

- Application réellement lancée dans Chromium ; inspection desktop/mobile de la recherche, du quiz, de la leçon et des résultats financiers, contrôle de la navigation et comparaison aux images de la passe 09.
- `npm run build` : TypeScript et Vite réussis. Avertissement Vite sur le bundle principal de 502,52 kB minifié ; découpage du chargement à traiter séparément.
- `npm test` et exécution directe des huit fichiers : **146 cas unitaires réussis**.
- Suite complète `npm run test:e2e` : **54 tests réussis**, aucun échec, test ignoré ou retry. Inclut les parcours métier, clavier, états interactifs, captures, débordements, motion et `prefers-reduced-motion`.
- **33 états audités avec axe**, aucune violation automatiquement établie dans les règles WCAG A/AA exécutées. Les annotations ARIA signalées pour examen ont été corrigées. [Rapport synthétique](accessibility-report.json).
- **141 captures fraîches** vérifiées par le manifeste. Desktop 1440 × 1000 ; mobile Pixel 7 émulé, 412 × 839 CSS px, DPR 2,625.

Axe laisse des contrastes à examiner manuellement dans 22 états, notamment sur les SVG, gradients et contenus partiellement masqués par un défilement interne. L’inspection visuelle ne remplace pas une mesure exhaustive de ces contrastes. Aucun audit WCAG complet, essai NVDA/VoiceOver, Safari/Firefox ou appareil physique n’est revendiqué. La vérification interne ne vaut pas validation design indépendante.

Archive : `archive/2026-11-05_05-27-47-Europe-Paris/`. Reproduction : `npm run build`, `npm run test:e2e`, puis `node scripts/save-design-review.mjs --primary=16-search-keyboard-viewport`.

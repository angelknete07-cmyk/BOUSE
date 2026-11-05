# Review design — passe 11 : corrections du diagnostic de reprise

**5 novembre 2026, 06:43 Europe/Paris.** Corrections demandées par l'utilisateur après le diagnostic de reprise (« Oui fait tout »). Vérification interne effectuée ; **review design externe attendue** pour cette passe comme pour la passe 10.

## Changements

- **Défauts corrigés.** Les lignes de l'atlas et de la trajectoire relient les cercles par leur centre. « 0 » et « €/mois » ne se chevauchent plus. La recherche est classée par pertinence. La légende illisible de l'accueil est supprimée. Les rangées mobiles qui défilent se terminent par un fondu. Le contour de focus est plus proche des formes.
- **Composition.** En-têtes factuels sur une ligne pour l'Académie, le Lab et l'Atelier IA. Accueil sans répétition (la trajectoire s'ouvre sur la notion suivante), bloc principal plus compact. Grands chiffres en Inter tabulaire. Largeur de page unique (`--page-max`).
- **Langue.** Comprendre / Pratiquer / Démontrer / Appliquer, Académie, Projets, Atelier IA. Radar conservé.

Le détail des constats, causes et corrections est dans l'[audit de la passe 11](AUDIT-11.md).

## Captures et comparaison

Paire principale : [desktop](latest-desktop.png) · [mobile](latest-mobile.png). Elle montre l'atlas de l'Académie avec son en-tête compact et les liaisons corrigées.

Avant : passe 10, archive `2026-11-05_05-27-47-Europe-Paris`.

| Écran                    | Avant desktop                                                                                     | Avant mobile                                                                                     | Après desktop                                            | Après mobile                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------- |
| Académie (atlas)         | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/desktop/02-academy-viewport.png)          | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/mobile/02-academy-viewport.png)          | [Voir](screens/desktop/02-academy-viewport.png)          | [Voir](screens/mobile/02-academy-viewport.png)          |
| Accueil                  | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/desktop/00-home-viewport.png)             | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/mobile/00-home-viewport.png)             | [Voir](screens/desktop/00-home-viewport.png)             | [Voir](screens/mobile/00-home-viewport.png)             |
| Accueil complet          | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/desktop/01-home.png)                      | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/mobile/01-home.png)                      | [Voir](screens/desktop/01-home.png)                      | [Voir](screens/mobile/01-home.png)                      |
| Lab financier            | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/desktop/05-lab-financier-viewport.png)    | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/mobile/05-lab-financier-viewport.png)    | [Voir](screens/desktop/05-lab-financier-viewport.png)    | [Voir](screens/mobile/05-lab-financier-viewport.png)    |
| Atelier IA               | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/desktop/06-ai-structure-viewport.png)     | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/mobile/06-ai-structure-viewport.png)     | [Voir](screens/desktop/06-ai-structure-viewport.png)     | [Voir](screens/mobile/06-ai-structure-viewport.png)     |
| Leçon                    | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/desktop/03-lecon-learn-viewport.png)      | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/mobile/03-lecon-learn-viewport.png)      | [Voir](screens/desktop/03-lecon-learn-viewport.png)      | [Voir](screens/mobile/03-lecon-learn-viewport.png)      |
| « Et si ? »              | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/desktop/13-simulation-viewport.png)       | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/mobile/13-simulation-viewport.png)       | [Voir](screens/desktop/13-simulation-viewport.png)       | [Voir](screens/mobile/13-simulation-viewport.png)       |
| Parcours de projet       | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/desktop/15-project-learning-viewport.png) | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/mobile/15-project-learning-viewport.png) | [Voir](screens/desktop/15-project-learning-viewport.png) | [Voir](screens/mobile/15-project-learning-viewport.png) |
| Portfolio                | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/desktop/14-portfolio-viewport.png)        | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/mobile/14-portfolio-viewport.png)        | [Voir](screens/desktop/14-portfolio-viewport.png)        | [Voir](screens/mobile/14-portfolio-viewport.png)        |
| Recherche « trésorerie » | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/desktop/16-search-keyboard-viewport.png)  | [Voir](archive/2026-11-05_05-27-47-Europe-Paris/screens/mobile/16-search-keyboard-viewport.png)  | [Voir](screens/desktop/16-search-keyboard-viewport.png)  | [Voir](screens/mobile/16-search-keyboard-viewport.png)  |

La galerie complète [desktop](screens/desktop/) / [mobile](screens/mobile/) contient aussi l'onboarding, le quiz, les révisions, l'atelier terrain et les états secondaires.

## Inspection interne

- **Atlas.** Les lignes 01→02, 04→05 et les deux courbes vers 06 touchent le centre des cercles sur desktop et mobile.
- **Recherche.** « Chiffre d'affaires, marge et trésorerie » passe en premier, devant le projet puis « Et si ? ».
- **« Et si ? ».** « 0 » et « €/mois » sont séparés dans le champ des charges fixes.
- **Accueil.** Le titre de la leçon n'apparaît plus qu'une fois dans le premier écran, et la trajectoire montre « Trouver son seuil de rentabilité ». Sur mobile, le bouton « Ouvrir la leçon » et le début de la trajectoire tiennent dans le premier écran.
- **Mobile.** Les filtres, l'atlas, les scénarios et la trajectoire se terminent par un fondu au lieu d'un libellé coupé net.
- **Chiffres.** Portfolio, parcours de projet et révisions emploient Inter tabulaire.
- **Largeur.** Les bords gauche et droit sont identiques entre les pages projet, simulation, portfolio et Académie.
- **Palette.** Monochrome conservée : aucune couleur ajoutée et aucune couleur écrite en dur hors de `tokens.css`.

**Limites observées.** Sur mobile, la légende de domaine « Intelligence artificielle » de l'atlas est proche de la ligne de durée de « Comprendre le client », sans la chevaucher. Le libellé « quiz courants validés » du parcours de projet passe sur trois lignes sur desktop.

## Vérifications effectuées

- `npm run build` : TypeScript et Vite réussis. Avertissement Vite sur le bundle principal de 503,08 kB minifié (146,93 kB gzip), inchangé en nature.
- `npm test` : **148 cas unitaires réussis** (146 + 2 nouveaux tests de classement de recherche).
- Suite complète `npx playwright test` : **54 tests réussis**, aucun échec, test ignoré ou retry. Elle inclut les audits axe, la navigation clavier, les captures, les débordements, la motion et `prefers-reduced-motion`.
- Prettier vérifié sur `src/` et `tests/`.
- **141 captures** fraîches vérifiées par le manifeste. Desktop 1440 × 1000 ; mobile Pixel 7 émulé, 412 × 839 CSS px, DPR 2,625.

Les tests navigateur ont suivi les nouveaux libellés visibles (étapes de leçon, Académie, Atelier IA, en-têtes). Aucune assertion n'a été retirée.

Chromium headless et Pixel 7 émulé seulement : ni appareil physique, ni Safari/Firefox, ni lecteur d'écran réel. La vérification interne ne vaut pas validation design indépendante.

Archive : `archive/2026-11-05_06-43-13-Europe-Paris/`. Reproduction : `npm run build`, `npm run test:e2e`, puis `node scripts/save-design-review.mjs --primary=02-academy-viewport`.

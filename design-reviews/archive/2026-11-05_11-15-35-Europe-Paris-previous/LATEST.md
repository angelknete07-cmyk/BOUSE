# Review design — passe 12 : audit DA complet, préférences, dette technique

**5 novembre 2026, 10:37 Europe/Paris.** L'utilisateur a demandé de vérifier toute la direction artistique, d'améliorer le design et les fonctionnalités existantes, de traiter la dette technique puis de poursuivre la feuille de route. Il a explicitement autorisé la suite **sans attendre la review design externe** des passes 10 et 11. Vérification interne effectuée ; **review design externe toujours attendue** pour les passes 10, 11 et 12.

## Changements

- **Cohérence.** Un seul nom court par notion dans l'atlas, la trajectoire et la carte des compétences. Les derniers restes d'anglais sont traduits.
- **Révisions.** Le graphe des intervalles suit maintenant le calendrier réel (arcs croissants sur un axe en jours) au lieu d'une vague. L'anneau décoratif est retiré.
- **Projets.** Fiche allégée et frise des neuf étapes déclarées.
- **Préférences.** Niveau, objectif, centres d'intérêt et façon d'apprendre deviennent modifiables.
- **Petites corrections.** « € » collé au chiffre dans le Lab, légende de l'atlas mobile, libellé du parcours de projet.
- **Technique.** Chargement des écrans à la demande (bundle principal de 503 à 341 kB), CI GitHub, CSS allégé, adaptateur de persistance.

Le détail est dans l'[audit de la passe 12](AUDIT-12.md).

## Captures et comparaison

Paire principale : [desktop](latest-desktop.png) · [mobile](latest-mobile.png), sur l'écran des révisions et son nouveau graphe.

Avant : passe 11, archive `2026-11-05_06-43-13-Europe-Paris`.

| Écran                 | Avant desktop                                                                                  | Avant mobile                                                                                  | Après desktop                                         | Après mobile                                         |
| --------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| Révisions             | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/desktop/11-revisions-viewport.png)     | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/mobile/11-revisions-viewport.png)     | [Voir](screens/desktop/11-revisions-viewport.png)     | [Voir](screens/mobile/11-revisions-viewport.png)     |
| Révisions disponibles | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/desktop/11-revisions-due.png)          | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/mobile/11-revisions-due.png)          | [Voir](screens/desktop/11-revisions-due.png)          | [Voir](screens/mobile/11-revisions-due.png)          |
| Projets (liste)       | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/desktop/07-incubator.png)              | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/mobile/07-incubator.png)              | [Voir](screens/desktop/07-incubator.png)              | [Voir](screens/mobile/07-incubator.png)              |
| Préférences           | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/desktop/10-parametres.png)             | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/mobile/10-parametres.png)             | [Voir](screens/desktop/10-parametres.png)             | [Voir](screens/mobile/10-parametres.png)             |
| Compétences           | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/desktop/09-competences.png)            | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/mobile/09-competences.png)            | [Voir](screens/desktop/09-competences.png)            | [Voir](screens/mobile/09-competences.png)            |
| Académie (atlas)      | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/desktop/02-academy-viewport.png)       | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/mobile/02-academy-viewport.png)       | [Voir](screens/desktop/02-academy-viewport.png)       | [Voir](screens/mobile/02-academy-viewport.png)       |
| Accueil               | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/desktop/01-home.png)                   | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/mobile/01-home.png)                   | [Voir](screens/desktop/01-home.png)                   | [Voir](screens/mobile/01-home.png)                   |
| Lab financier         | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/desktop/05-lab-financier-viewport.png) | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/mobile/05-lab-financier-viewport.png) | [Voir](screens/desktop/05-lab-financier-viewport.png) | [Voir](screens/mobile/05-lab-financier-viewport.png) |
| Atelier du projet     | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/desktop/12-project-outcome.png)        | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/mobile/12-project-outcome.png)        | [Voir](screens/desktop/12-project-outcome.png)        | [Voir](screens/mobile/12-project-outcome.png)        |
| Onboarding            | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/desktop/01-onboarding.png)             | [Voir](archive/2026-11-05_06-43-13-Europe-Paris/screens/mobile/01-onboarding.png)             | [Voir](screens/desktop/01-onboarding.png)             | [Voir](screens/mobile/01-onboarding.png)             |

La galerie complète [desktop](screens/desktop/) / [mobile](screens/mobile/) contient les 141 captures.

## Inspection interne

- **Révisions.** Cinq arcs de hauteur croissante ; « 24 h », « 3 j », « 7 j », « 14 j » et « 30 j » sont lisibles et séparés. Un premier rendu sur axe linéaire faisait se chevaucher « 24 h » et « 3 j » : l'axe a été corrigé, puis la suite et les captures relancées. Sur mobile, cette colonne garde sa présentation précédente (prochain rendez-vous, sans graphe).
- **Projets.** Libellés discrets et faits lisibles. « Étape 3 sur 9 · Validation » au-dessus de la frise, étape courante en blanc.
- **Préférences.** Les cinq champs sont présents et alignés sur la grille ; la note sur la portée des choix est visible.
- **Noms.** « Marge et trésorerie », « Seuil de rentabilité », etc. sont identiques sur l'accueil, l'atlas et la carte.
- **Lab.** « 45 € » et « 18 € » : l'unité suit le chiffre.
- **Palette.** Monochrome conservée. Aucune couleur ajoutée et aucune couleur écrite en dur hors de `tokens.css`.

**Limites observées.** La capture mobile pleine page de la liste des projets montre le dock fixe au milieu, effet connu des captures longues. Les écrans chargés à la demande affichent « Chargement… » une fraction de seconde au premier accès ; les captures attendent la fin du chargement.

## Vérifications effectuées

- `npm run build` : TypeScript et Vite réussis, **sans avertissement de taille** (bundle principal 341,20 kB, 108,07 kB gzip).
- `npm test` : **154 cas unitaires réussis** (148 + 6 tests de l'adaptateur de persistance).
- Suite complète `npx playwright test` : **56 tests réussis** (le test des préférences s'ajoute sur desktop et mobile), aucun échec, test ignoré ni retry.
- Prettier vérifié sur `src/` et `tests/`.
- **141 captures** fraîches. Desktop 1440 × 1000 ; mobile Pixel 7 émulé, 412 × 839 CSS px, DPR 2,625.

Tests navigateur adaptés :

- Le test de projet vérifie l'étape courante via `aria-current="step"` et « Étape 2 sur 9 », au lieu d'un texte devenu présent trois fois.
- Deux tests attendent la fin du chargement de la leçon et de l'Atelier IA avant de choisir leur chemin desktop ou mobile.

Aucune assertion n'a été retirée.

Chromium headless et Pixel 7 émulé seulement : ni appareil physique, ni Safari/Firefox, ni lecteur d'écran réel. La vérification interne ne vaut pas validation design indépendante.

Archive : `archive/2026-11-05_10-37-05-Europe-Paris/`. Reproduction : `npm run build`, `npm run test:e2e`, puis `node scripts/save-design-review.mjs --primary=11-revisions-viewport`.

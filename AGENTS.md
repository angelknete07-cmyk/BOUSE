# BOUSE — règles de travail

Lire `docs/PRODUCT.md`, `docs/ARCHITECTURE.md` et `docs/DESIGN.md` avant de modifier le produit. Utiliser le checkout existant ; chaque tâche cloud est déjà isolée. Ne pas créer de Git worktree sans demande explicite.

## Direction artistique

Interface très sombre, premium et minimaliste, perçue à 94–97 % monochrome : noir, anthracite, gris et blanc cassé. Aucun vert de marque, aucune palette IA vive. Les couleurs fonctionnelles (succès, erreur/danger, avertissement) restent réservées à leurs états.

**Règle d’accent (brief V4, 6 novembre 2026 — remplace la règle de la passe 32)** : rendu perçu **94 à 97 % neutre**. Une seule couleur dominante **désaturée** par bloc (lavande d’essai `#9A8AB7`), sur une information à la fois : courbe active, étape en cours, point sélectionné, progression. Halo nul ou très faible (alpha ≤ 0,15), aires sous 8 % d’opacité, aucun bouton, menu, fond ou carte coloré, aucune lueur multicolore. Les accents vifs de la passe 32 (`#A78BFA`, `#6BA6F2`, `#3FCB9B`, halo 22 px à 45 %) sont jugés trop saturés et doivent être recalibrés (jalons V4, validation de l’utilisateur). **Ne jamais remplacer la vague `Terrain.tsx` ni retirer un élément existant** : on améliore sa couleur et sa finition. Les références de l’utilisateur sont des inspirations, pas des spécifications. Mémoire des préférences : `docs/MEMOIRE-DESIGN.md`. L’information reste lisible sans la couleur (valeur écrite, libellé, forme).

## Définition de terminé : revue visuelle obligatoire

Après chaque modification importante d’interface ou de design :

1. Lancer réellement l’application. Compiler seul ne suffit pas.
2. Exercer les écrans modifiés et leurs états interactifs.
3. Générer au minimum une capture desktop et une capture mobile du rendu réel.
4. Enregistrer les images dans `design-reviews/`, dont `latest-desktop.png` et `latest-mobile.png`. Conserver une archive datée lorsqu’elle aide la comparaison. Ajouter des paires par écran si plusieurs écrans changent ; ne pas se limiter à l’accueil.
5. Inspecter soi-même les captures : DA monochrome, hiérarchie, spacing, typographie, profondeur, responsive, états interactifs, motion et reduced motion, densité et identité visuelle. Corriger les défauts avant livraison.
6. Mettre à jour `design-reviews/LATEST.md` : changements, écrans, fichiers de captures, tailles de viewport, contrôles et limites. Séparer les vérifications de Codex de la validation design externe ; ne jamais inventer cette dernière.
7. Inclure les fichiers de review dans le dépôt, sans règle d’exclusion. Respecter le workflow GitHub demandé ; ne pas annoncer une synchronisation sans l’avoir vérifiée. Employer des données de démonstration sans secrets ni données personnelles réelles dans les captures.

Workflow : **construction → rendus → review design externe → corrections → nouveaux rendus → validation → suite du développement**.

Ne pas empiler de nouvelles fonctionnalités lorsqu’un rendu important attend sa revue visuelle. Présenter les rendus concrets à examiner. Les corrections demandées par la revue reprennent le même cycle.

## Commandes

Depuis `/workspace/BOUSE` : `npm ci --no-audit --no-fund`, `npm run dev -- --port 5173 --strictPort`, `npm run build`, `npm test`, `npm run test:e2e`.

Les tests `tests/design.spec.ts` génèrent les captures des écrans. Après une exécution réussie, `node scripts/save-design-review.mjs` les copie dans le dossier versionné et crée une archive datée. Choisir l’écran modifié pour la paire stable avec `--primary=15-project-learning-viewport` (ou une autre capture réellement produite), plutôt que de conserver systématiquement l’accueil. Mettre à jour `LATEST.md` avec les résultats réels et inspecter les fichiers copiés. Ne pas remplacer les captures manquantes ou les contrôles échoués par des images de démonstration.

Chromium système est disponible à `/usr/bin/chromium`. Dans le cloud, lancer Vite et Chromium via le mécanisme de permissions étendues si le sandbox renvoie `EPERM`. Préserver TLS, les intégrités du lockfile, les fichiers utilisateur et les secrets.

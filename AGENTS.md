# BOUSE — règles de travail

Lire `docs/PRODUCT.md`, `docs/ARCHITECTURE.md` et `docs/DESIGN.md` avant de modifier le produit. Utiliser le checkout existant ; chaque tâche cloud est déjà isolée. Ne pas créer de Git worktree sans demande explicite.

## Direction artistique

Interface très sombre, premium et minimaliste, perçue à 90–95 % monochrome : noir, anthracite, gris et blanc cassé. Aucun vert de marque, aucune palette IA vive. Les couleurs fonctionnelles (succès, erreur/danger, avertissement) restent réservées à leurs états.

**Règle d’accent (brief V3.2, 6 novembre 2026 — remplace l’interdiction absolue des accents bleu/violet/cyan)** : de rares accents désaturés sont permis, via les seuls tokens `--accent-lavender*`, `--accent-glacier` et `--accent-teal` de `src/tokens.css`. Au plus **une couleur dominante par écran** (la lavande par défaut), uniquement sur une marque fine porteuse d’information : remplissage de barre ou d’anneau de progression, courbe ou point sélectionné, étape active, numéro de l’onglet courant. Jamais d’aplat coloré, jamais sur un bouton, une carte, un fond ou un texte courant ; jamais pour distinguer des catégories. L’information reste lisible sans la couleur (valeur écrite, libellé, forme). Employer les tokens de `src/tokens.css` ; ne pas recréer une palette, des ombres ou une motion par écran. Conserver des rayons modérés, des séparateurs discrets, une typographie lisible et `prefers-reduced-motion`.

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

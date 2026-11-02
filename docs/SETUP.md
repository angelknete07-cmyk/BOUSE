# Environnement de développement

## Prérequis et installation

Utiliser le checkout existant `/workspace/BOUSE`. Chaque tâche cloud dispose déjà d’un environnement isolé : ne pas créer de Git worktree supplémentaire sans demande explicite. Vérifier les changements locaux avant toute opération d’installation ; ne pas réinitialiser le dépôt ni écraser les fichiers de l’utilisateur.

Node.js doit satisfaire `>=22.12.0`. L’instance préparée dispose de **Node.js 24.19.0**, de npm et de Git. Les dépendances principales sont React/React DOM **19.3.1**, TypeScript **7.0.2**, Vite **8.3.5**, `@vitejs/plugin-react` **6.2.1** et Playwright **1.64.1**. Les versions et intégrités exactes sont conservées dans `package-lock.json`.

```bash
cd /workspace/BOUSE
node --version
npm --version
git status --short
npm ci --no-audit --no-fund
```

L’installation utilise le lockfile sans le mettre à jour. Le registre npm et ses artefacts doivent être accessibles via le proxy et la politique réseau de l’environnement. Conserver la vérification TLS et d’intégrité. Aucune base, aucun service distant et aucun identifiant ne sont requis pour le fonctionnement local actuel. `.env.example` documente la limite des intégrations ; ne pas inventer de clé pour démarrer.

## Démarrage

```bash
cd /workspace/BOUSE
npm run dev -- --port 5173 --strictPort
```

Le processus Vite doit rester en cours d’exécution. Le port est strict : s’il est déjà occupé, identifier le service présent avant d’arrêter uniquement un processus que vous avez lancé. Les processus de cette session ne sont pas supposés survivre à la restauration d’un environnement cloud ; relancer cette commande dans une nouvelle tâche.

Pour vérifier le démarrage dans la machine, effectuer une requête HTTP locale vers le port 5173 puis exercer un parcours représentatif dans un navigateur : terminer le diagnostic, ouvrir une leçon et soumettre un quiz. Un PID ou une page HTML reçue ne suffit pas à valider ces interactions. Aucun lien de prévisualisation publique n’est fourni ici.

Le workflow utilise les données locales du navigateur : profil, diagnostic, tentatives, notes et projets. Tester avec un profil de navigateur dédié. L’export/import et la suppression s’effectuent dans les paramètres de l’application. Un export JSON contient ces informations en clair. Il n’y a ni compte, ni sauvegarde distante, ni synchronisation entre appareils.

## Tests et validation

Depuis `/workspace/BOUSE` :

```bash
npm run build
npm test
npm run test:e2e
```

- `build` exécute TypeScript puis produit le bundle Vite dans `dist/`.
- `test` utilise le runner de Node avec effacement des types pour les tests métier.
- `test:e2e` lance les parcours Playwright desktop Chromium et mobile Chromium. Sa configuration peut démarrer Vite sur le port 5173 et réutilise un serveur déjà présent. L’émulation mobile n’équivaut pas à un test sur appareil physique ou Safari.

Pour un contrôle TypeScript seul :

```bash
npm run typecheck
```

Ne pas annoncer de tests réussis sans lire leur résultat actuel, leurs cibles et leur statut de sortie. La vérification des parcours navigateur est distincte de la compilation et des tests métier. Les résultats effectifs et les limites de la session sont rapportés à la livraison.

## Navigateur Playwright dans cet environnement

Le téléchargement du navigateur Playwright depuis `cdn.playwright.dev` a rencontré une restriction réseau dans cette instance. Un Chromium système est installé à `/usr/bin/chromium` ; `playwright.config.ts` le sélectionne automatiquement lorsqu’il existe. Cela conserve les vérifications des paquets et évite de modifier le lockfile pour contourner le problème.

La configuration accepte également `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` pour choisir explicitement un navigateur déjà installé. En l’absence de Chromium système, Playwright utilise son navigateur attendu, à installer par sa commande officielle lorsque la politique réseau l’autorise :

```bash
npx playwright install chromium
```

Dans l’exécution cloud restreinte, le lancement de Chromium peut nécessiter que la commande de test soit exécutée avec les permissions d’exécution étendues prévues par l’outil, après son contrôle d’approbation. Ce besoin concerne le lancement du navigateur dans cette instance ; ne pas désactiver TLS, modifier les intégrités ou affaiblir les tests pour les faire passer. Conserver les permissions minimales pour les autres commandes.

## Configuration et publication cloud

Les dépendances et fichiers installés peuvent être conservés par le snapshot de l’environnement. Les processus doivent être redémarrés à chaque nouvelle instance. Le script d’installation et les instructions de démarrage enregistrés dans le brouillon de configuration restent distincts de leur exécution dans cette machine et de la publication par l’utilisateur.

Le code et les rendus de la passe 02 sont versionnés dans la branche GitHub `codex/learning-design-review`. La publication de cette branche ne déploie pas l’application. L’authentification, Supabase, les appels réels à un fournisseur IA et la veille automatisée restent à construire. Aucun secret n’est nécessaire au MVP local ; une future intégration sensible devra passer par le serveur et les paramètres sécurisés appropriés.

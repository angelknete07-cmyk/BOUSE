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

Le code et les rendus sont versionnés dans la branche GitHub `codex/learning-design-review`. La publication de cette branche ne déploie pas l’application. L’authentification, Supabase, les appels réels à un fournisseur IA et la veille automatisée restent à construire. Aucun secret n’est nécessaire au MVP local ; une future intégration sensible devra passer par le serveur et les paramètres sécurisés appropriés.

## Comptes, synchronisation et mentor IA (facultatif)

Sans configuration, l’application reste entièrement locale : la synchronisation affiche « Non configurée » et le mentor « non connecté », sans réponse simulée. Activer ces fonctions demande un projet Supabase **dédié**. Ne pas réutiliser un projet existant sans l’avoir inspecté.

1. **Créer le projet** sur supabase.com et récupérer, dans _Project Settings → API_, l’URL du projet et la clé publique `anon`.
2. **Appliquer la migration** `supabase/migrations/20261105120000_learning_state_and_mentor.sql`, avec la CLI (`supabase link --project-ref <ref>` puis `supabase db push`) ou dans l’éditeur SQL. Elle crée :
   - `learning_states`, une copie par utilisateur, avec une révision tenue par le serveur ;
   - `mentor_usage`, les quotas quotidiens ;
   - les politiques RLS « chacun ne voit que ses lignes » ;
   - `delete_my_account()`.
3. **Activer la connexion par e-mail** (_Authentication → Providers → Email_). Déclarer l’URL de l’application dans _Authentication → URL Configuration_ (Site URL et Redirect URLs). L’application utilise le flux PKCE : le lien de connexion revient avec `?code=…`.
4. **Configurer le front** avec un fichier `.env.local`, jamais versionné :
   ```bash
   VITE_SUPABASE_URL=https://<ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<clé anon>
   ```
   La clé `anon` est publique par conception ; les politiques RLS protègent les données. Ne jamais placer la clé `service_role` ni une clé de fournisseur d’IA dans une variable `VITE_*`.
5. **Déployer le mentor** :
   ```bash
   supabase secrets set ANTHROPIC_API_KEY=<clé>
   # facultatif : MENTOR_DAILY_REQUESTS (30 par défaut), MENTOR_MAX_OUTPUT_TOKENS (8000),
   # MENTOR_ALLOWED_ORIGIN (origine de l’application, « * » par défaut)
   supabase functions deploy mentor
   ```
   La fonction vérifie la session de l’appelant, applique le quota, interroge `claude-opus-5-5` (effort `medium`, repli automatique côté serveur si une demande est refusée) et renvoie une réponse marquée « brouillon » avec les passages de leçon cités. Ses journaux contiennent les statuts et le nombre de jetons, jamais les questions.

Vérification après configuration :

- se connecter depuis _Préférences → Compte et synchronisation_ ;
- vérifier que la copie en ligne apparaît ;
- ouvrir l’application dans un autre navigateur et se connecter : la progression doit être récupérée ;
- poser une question au mentor depuis une leçon.

Ces étapes n’ont pas été exécutées contre un vrai projet dans cette session : aucun projet ni aucune clé n’étaient disponibles.

# Validation du 2 novembre 2026

Validation de l’instance cloud et des fichiers présents dans `/workspace/BOUSE`. Ces résultats ne constituent ni une publication de l’environnement, ni un déploiement, ni une validation dans une nouvelle tâche restaurée.

| Contrôle exécuté                                          | Résultat                                                                       |
| --------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Accès GitHub en lecture avec l’authentification existante | `git ls-remote origin HEAD` réussi                                             |
| Installation reproductible                                | `npm ci --no-audit --no-fund` réussi, lockfile conservé                        |
| Compilation TypeScript stricte et Vite                    | `npm run build` réussi                                                         |
| Logique métier, import et structure pédagogique           | `npm test` : **33 réussis**, aucun échec ni test ignoré                        |
| Parcours navigateur                                       | `npm run test:e2e` : **12 réussis**, aucun échec ni test ignoré                |
| Serveur de production local                               | HTML et ressources JavaScript/CSS de la dernière compilation reçus avec succès |
| Lisibilité et espaces                                     | Prettier et `git diff --check` réussis                                         |

Trois scénarios fonctionnels et trois scénarios de rendu/motion sont exécutés dans Chromium sur ordinateur et en émulation Pixel 7 :

1. Onboarding et diagnostic, leçon, exercice avec indice et solution, quiz, création d’idée sans doublon, modification et avancement du projet, rechargement et carte de compétences.
2. Calcul financier et cas limites, navigation clavier de la palette, synonymes de recherche et grille locale de prompts.
3. Quiz échoué puis révision proposée, téléchargement réel de la sauvegarde JSON, refus d’un import incompatible et confirmation explicite d’un remplacement valide conservé au rechargement.

Les scénarios de design contrôlent les surfaces neutres, la trajectoire sélectionnable, les états pédagogiques et la réduction des mouvements ; ils génèrent la galerie réelle desktop/mobile. Les rendus et la comparaison visuelle de la seconde passe sont détaillés dans `design-reviews/LATEST.md`.

Les tests contrôlent aussi l’absence de débordement horizontal et le retour en haut après onboarding. Les captures ordinateur et mobile ont été inspectées. Des défauts d’import, de recherche, de largeur mobile et de défilement ont été corrigés pendant ces vérifications. Les tests de structure des références vérifient les URL et champs ; ils ne certifient pas le contenu externe des sources.

## Configuration enregistrée

Le brouillon de l’environnement contient `install_script` et `start_skill`. Le script a été exécuté intégralement avant enregistrement. Il installe les versions du lockfile, compile et exécute les tests unitaires. Les instructions de démarrage décrivent le checkout existant, le processus Vite à relancer, Chromium système, les contrôles fonctionnels et les limites du stockage local. La politique réseau et les exigences de secrets n’ont pas été modifiées.

L’enregistrement du brouillon a été confirmé par l’outil. La revue, l’enregistrement dans les paramètres et la publication de l’environnement restent des actions du produit à effectuer par l’utilisateur. Le code et les fichiers de review sont synchronisés avec la branche GitHub `codex/learning-design-review`. La synchronisation Git est distincte de la publication de l’environnement cloud et du déploiement de l’application.

## Limites

Pas de test sur appareil physique, Safari ou Firefox, ni d’audit d’accessibilité automatisé complet. Le fonctionnement du clavier et les états principaux sont exercés ; cela ne constitue pas une certification d’accessibilité. Les références pédagogiques sont signalées comme non vérifiées. Les intégrations Supabase, authentification, IA distante et veille automatisée restent à construire. Aucun identifiant n’est requis pour la version locale validée.

# Validation — mise à jour du 5 novembre 2026

Validation de l’instance cloud et des fichiers présents dans `/workspace/BOUSE`. Ces résultats ne constituent ni une publication de l’environnement, ni un déploiement, ni une validation dans une nouvelle tâche restaurée.

| Contrôle exécuté                                          | Résultat                                                                         |
| --------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Accès GitHub en lecture avec l’authentification existante | `git ls-remote origin HEAD` réussi                                               |
| Installation reproductible                                | `npm ci --no-audit --no-fund` réussi, lockfile conservé                          |
| Compilation TypeScript stricte et Vite                    | `npm run build` réussi                                                           |
| Logique métier, import et structure pédagogique           | **146 cas unitaires réussis** dans les huit fichiers, aucun échec ni test ignoré |
| Parcours navigateur                                       | **54 tests réussis** sur la version finale, aucun test ignoré                    |
| Serveur de production local                               | HTML et ressources JavaScript/CSS de la dernière compilation reçus avec succès   |
| Lisibilité et espaces                                     | Prettier et `git diff --check` réussis                                           |

Dix-neuf scénarios fonctionnels, quatre scénarios d’accessibilité et quatre scénarios de rendu/motion sont exécutés dans Chromium sur ordinateur et en émulation Pixel 7. Les parcours initiaux comprennent :

1. Onboarding et diagnostic, leçon, exercice avec indice et solution, quiz, création d’idée sans doublon, modification et avancement du projet, rechargement et carte de compétences.
2. Calcul financier et cas limites, navigation clavier de la palette, synonymes de recherche et grille locale de prompts.
3. Quiz échoué puis révision proposée, téléchargement réel de la sauvegarde JSON, refus d’un import incompatible et confirmation explicite d’un remplacement valide conservé au rechargement.

Les scénarios de design contrôlent les surfaces neutres, la trajectoire sélectionnable, les états pédagogiques et la réduction des mouvements ; ils génèrent la galerie réelle desktop/mobile. Les rendus et la comparaison visuelle de la dernière passe sont détaillés dans `design-reviews/LATEST.md`.

Les tests contrôlent aussi l’absence de débordement horizontal et le retour en haut après onboarding. Les captures ordinateur et mobile ont été inspectées. Des défauts d’import, de recherche, de largeur mobile et de défilement ont été corrigés pendant ces vérifications. Les tests de structure des références vérifient les URL et champs ; ils ne certifient pas le contenu externe des sources.

## Configuration enregistrée

Le brouillon de l’environnement contient `install_script` et `start_skill`. Le script a été exécuté intégralement avant enregistrement. Il installe les versions du lockfile, compile et exécute les tests unitaires. Les instructions de démarrage décrivent le checkout existant, le processus Vite à relancer, Chromium système, les contrôles fonctionnels et les limites du stockage local. La politique réseau et les exigences de secrets n’ont pas été modifiées.

L’enregistrement du brouillon a été confirmé par l’outil. La revue, l’enregistrement dans les paramètres et la publication de l’environnement restent des actions du produit à effectuer par l’utilisateur. Le code et les fichiers de review sont synchronisés avec la branche GitHub `codex/learning-design-review`. La synchronisation Git est distincte de la publication de l’environnement cloud et du déploiement de l’application.

## Limites

Pas de test sur appareil physique, Safari ou Firefox, ni d’essai avec un lecteur d’écran réel. Le clavier, les états principaux et les règles WCAG A/AA automatisables sont exercés avec axe ; les contrastes sur fonds complexes demandent une vérification humaine. Cela ne constitue pas une certification d’accessibilité. Les références pédagogiques sont signalées comme non vérifiées. Les intégrations Supabase, authentification, IA distante et veille automatisée restent à construire. Aucun identifiant n’est requis pour la version locale validée.

## Passe 03 — rappels espacés

Cette passe comportait 18 tests navigateur réussis (9 scénarios sur desktop et mobile) et 54 tests unitaires réussis : 6 de contenu, 15 métier, 18 de planification, 15 de sauvegarde. Les nouveaux parcours vérifient la révélation avant notation, le double clic, les échéances exactes de 24 h/3 jours, le score de quiz inchangé, la conservation au rechargement, l’export et l’import d’une ancienne sauvegarde sans historique de rappel. Les tests unitaires couvrent aussi les versions de contenu, les dates futures, les changements d’heure, les paliers et les nouveaux échecs de quiz.

La galerie réelle de 49 captures est conservée en archive, avec la paire principale centrée sur les révisions. Les états disponibles, rappel, révélé, terminé, à jour et vide ont été inspectés sur les deux viewports. L’utilisateur a autorisé la suite sur cette base.

## Passe 04 — atelier terrain et journal de décisions

Cette passe comportait **24 tests navigateur réussis** (12 scénarios sur les deux viewports) et **75 cas unitaires réussis** : 6 de contenu, 15 métier, 18 de planification, 16 de projets, 20 de sauvegarde. `npm test` exécute les cinq fichiers ; chaque fichier a aussi été lancé directement pour vérifier le nombre de cas. TypeScript et la compilation Vite passaient.

Les six nouveaux parcours navigateur couvrent les plans de test, les preuves saisies, la conservation des hypothèses et critères de départ, les décisions liées au même projet, la comparaison au réel sans réécriture de l’attente, le rechargement, l’export Markdown du seul dossier ouvert, l’export JSON et une ancienne sauvegarde v1 sans ces nouveaux champs. Les cas unitaires vérifient aussi limites de texte, dates calendaires et UTC, résultats antérieurs à la création, doubles enregistrements, références orphelines et identifiants ambigus.

**61 captures réelles** sont conservées en archive, avec une paire stable centrée sur l’atelier. Les états vide, planifié, observé, décision et bilan ont été inspectés sur ordinateur et mobile. Une première inspection a conduit à resserrer l’introduction mobile avant de relancer l’ensemble des tests et rendus. La comparaison complète attendu/réel figure dans les images `12-project-outcome.png`. L’utilisateur a autorisé la suite sur cette base.

Un contrôle navigateur autonome a aussi mesuré l’entrée des formulaires test/décision (360 ms, déplacement de 5 px, opacité de 0 à 1), sa désactivation avec `prefers-reduced-motion`, le focus visible et les raccourcis clavier des onglets. Aucun débordement ni erreur JavaScript observé. Ce contrôle n’est pas un test sur appareil physique ni une mesure de performance GPU.

## Passe 05 — laboratoire « Et si ? »

Cette passe comportait **30 tests navigateur** et **101 cas unitaires** (6 de contenu, 15 métier, 16 projets, 18 révisions, 22 simulation et 24 sauvegarde), avec TypeScript et compilation Vite réussis. Les six fichiers unitaires ont été lancés directement pour confirmer les comptes de cas en plus de `npm test`. Aucun test ignoré. Le serveur de production a aussi servi le HTML et les ressources JS/CSS strictement identiques à la compilation.

Les nouveaux parcours vérifient le résultat inchangé avec un délai client différent, les flux mensuels accessibles, l’absence de calcul sur une entrée vide, la conservation des hypothèses d’une comparaison, la copie chargée sans réécriture, le rechargement, les exports Markdown/JSON et l’import ancien ou invalide. Les nouveaux cas unitaires couvrent les délais entiers, créances, besoin de financement, ventes nulles, contribution négative, identité comptable, bornes, précision décimale avant arrondi, snapshots et export reproductible. Les régressions incluent `1.005 × 3 → 3.02` et les variations en pourcentage sur des fractions de centime.

**69 captures réelles** sont conservées en archive. L’inspection a conduit à aligner les points sur les libellés des six fins de mois et à retirer sur mobile les montants répétés sous les boutons, trop serrés. Les montants précis restent dans le détail sélectionné et le tableau. La suite navigateur complète et les rendus ont été régénérés après la dernière correction mobile.

Contrôle navigateur complémentaire du nouvel écran : transition du point 220 ms avec easing non linéaire, entrée du formulaire 360 ms, focus visible, sélection d’un mois au clavier et réduction des mouvements immédiate. Aucun débordement ni erreur JavaScript observé dans ce contrôle. Chromium headless et Pixel 7 émulé ; pas de mesure sur appareil physique ou de performance GPU. L’utilisateur a autorisé la poursuite sur cette base.

Le correctif d’export a aussi été exercé directement : titre vide → alerte, aucun téléchargement ni erreur JavaScript ; titre valide → Markdown téléchargé avec le titre et la version attendus. Aucune comparaison n’a été créée par ce contrôle.

## Passe 06 — portfolio d’apprentissage

Cette passe comportait **38 tests navigateur réussis**, **121 cas unitaires réussis** (6 de contenu, 15 métier, 16 projets, 18 révisions, 22 simulation, 24 sauvegarde, 20 portfolio), TypeScript et compilation Vite. `npm test` et les sept fichiers lancés directement passent, sans test ignoré. Le HTML et les ressources JS/CSS servis en production ont été comparés aux fichiers de la dernière compilation.

Les huit nouveaux parcours navigateur vérifient l’accès depuis la carte, la sélection d’une notion, le dernier échec courant malgré un import désordonné ou une ancienne réussite, les dossiers et simulations séparés, les notes hors catalogue, le téléchargement Markdown et l’absence de mutation des données. Une régression avance la date de dix secondes sans déclencher le timer : un quiz réellement soumis reste immédiatement visible dans le résumé de la leçon. Les tests métier vérifient aussi versions, dates futures ou invalides, égalités chronologiques, copies indépendantes, relations, archives et protection de la structure Markdown.

**79 captures réelles** sont enregistrées dans `design-reviews/`, avec une paire principale sur le portfolio et une archive datée. Les vues notions, dossiers/explorations, notes et dossier vide ont été inspectées sur ordinateur et mobile. Les accords des repères ont été corrigés après le premier rendu puis la suite et les captures ont été régénérées. La carte, l’accueil et le résumé de leçon utilisent maintenant la même règle de quiz courant.

Un contrôle autonome a exercé les onglets par flèches/Home/End, les lignes par Tab/Entrée et le transfert du focus au détail mobile. Motion observée : contenu 360 ms avec easing non linéaire, opacité de 0 à 1 et déplacement de 5 px ; réduction des mouvements : affichage immédiat, aucune animation ou transition. Aucun débordement ni erreur JavaScript observé, état inchangé. Chromium headless et Pixel 7 émulé, sans appareil physique ni mesure GPU. L’utilisateur a autorisé la poursuite sur cette base ; aucune validation design indépendante n’est revendiquée.

## Passe 07 — parcours d’apprentissage par projet

Le 3 novembre 2026, la suite complète passe avec **44 tests navigateur** (22 scénarios sur desktop et mobile) et **146 cas unitaires** : 6 de contenu, 15 métier, 16 projets, 18 révisions, 22 simulation, 28 sauvegarde, 20 portfolio et 21 parcours de projet. Les huit fichiers passent via `npm test` et ont été exécutés directement pour confirmer les nombres de cas. Aucun échec ni test ignoré. TypeScript strict et compilation Vite passent.

Les six nouveaux parcours navigateur vérifient les objectifs explicites, la fermeture des prérequis, la sauvegarde au rechargement, la conservation du stade et des associations, la priorité au prérequis à reprendre, un quiz réellement soumis puis le retour immédiat au plan. Ils couvrent aussi les objectifs hors catalogue dans les exports JSON et Markdown du dossier et du portfolio, leur retrait explicite et le lien inverse depuis la carte. Les tests métier incluent prérequis partagés, versions, dates, import désordonné, cycles qui se chevauchent, branches indépendantes, contenus manquants et copies indépendantes.

**93 captures réelles** sont conservées avec une paire stable sur le parcours du projet. Le premier rendu mobile occupait tout l’écran avec des introductions : la correction rapproche « Étudier » et la première étape du début de page. L’inspection desktop a aussi révélé une classe héritée qui limitait indûment la largeur ; la vue dispose désormais de sa propre portée de style. Le volet secondaire « Le cap du projet » utilise un indicateur unique. Les six tests de galerie/motion ont été réexécutés après cette dernière correction CSS et les rendus régénérés. Les anciennes captures sont archivées pour comparaison.

Contrôle navigateur complémentaire sur le build de production : action principale dans le premier viewport, focus sur l’éditeur, sélection avec Espace, annulation et retour du focus, données inchangées. Animation de 360 ms, déplacement de 5 px et easing `cubic-bezier(0.22, 1, 0.36, 1)` ; préférence de réduction : aucune animation. Aucun débordement ni erreur JavaScript observé dans ces contrôles. Le HTML et les ressources JS/CSS servis ont été comparés aux fichiers compilés.

Les objectifs restent distincts des associations et des réussites de quiz ; le parcours ne certifie ni compétence professionnelle ni réussite du projet. Les tests utilisent Chromium et une émulation Pixel 7, sans appareil physique ni Safari/Firefox. La review design externe de cette passe reste à effectuer avant le prochain élargissement fonctionnel.

## Passe 08 — direction artistique exclusivement

Les cinq compositions prioritaires ont été refactorisées : scène d’accueil, instrument de prompt, atlas Academy, séquences de leçon et équations/graphe du Lab financier. Aucun changement dans `src/lib/` ni `src/data/`. La police Manrope est locale et accompagnée de sa licence OFL.

TypeScript et build Vite réussis. Les huit fichiers unitaires ont été exécutés directement : **146 cas réussis**, aucun échec. La suite navigateur a confirmé les **38 tests fonctionnels** et les six anciens tests de galerie/motion. Les deux nouveaux tests de composition ont d’abord révélé une donnée de test ambiguë (« document » active aussi Format) ; elle a été remplacée par une consigne ne contenant qu’un indice d’objectif. La suite complète finale passe : **46 tests navigateur réussis**, incluant les huit tests de galerie/motion, sur desktop et mobile. Ils exercent atlas, sélection et filtres, brouillon partagé entre vues mobiles, repères lexicaux et extraits, comparaison de prompt, graphe financier modifié/invalide et toutes les séquences de la première leçon.

**133 captures fraîches**, vérifiées puis enregistrées avec manifeste, paire stable sur l’accueil et archive datée. L’inspection a conduit à séparer les noms de classe des deux cartes, remplacer l’empilement AI Lab mobile par deux vues et rapprocher la manipulation du début de la leçon mobile. Le contrôle complémentaire des cinq écrans à 320, 375, 768, 1024 et 1920 px n’a relevé aucun débordement du document. La matière SVG a été mesurée à 18 secondes avec easing non linéaire ; elle s’arrête avec la préférence de réduction des mouvements.

Les limites restent celles de Chromium/Pixel 7 émulé, des modèles locaux et des contenus existants. La vérification interne ne vaut pas validation design externe. Les liens avant/après, captures prioritaires et états secondaires sont dans [LATEST.md](../design-reviews/LATEST.md).

Le dernier contrôle du build de production confirme les cinq routes, la police locale et l’affichage des centimes. Le déplacement des tracés financiers a été observé pendant la transition, puis supprimé avec reduced motion. Les vues mobiles et repères du prompt ont été sélectionnés au clavier avec un focus visible.

## Passe 09 — correction de la police

Après le retour utilisateur sur la typographie, Inter variable auto-hébergée remplace Manrope et la police de secours du texte courant. Les graisses et les approches des titres, sections et nombres sont centralisées. Aucun changement aux composants React, aux contenus ou aux règles métier.

`npm run build` réussit. Les **8 tests existants de galerie/motion** passent sur desktop et mobile, avec **133 nouvelles captures** : navigation, leçon complète, quiz, atlas, instrument de prompt, états du calculateur, surfaces neutres et réduction des animations. Aucun test ajouté pour cette correction de styles. La suite métier et les 38 autres tests fonctionnels ne sont pas relancés ; leurs résultats de la passe 08 restent historiques.

L’inspection des cinq écrans prioritaires sur les deux viewports, du teach-back, du quiz corrigé et de l’onboarding desktop confirme la nouvelle hiérarchie. Les cinq routes ont aussi été contrôlées à 320, 375, 768, 1024 et 1920 px, sans débordement du document ni erreur JavaScript. Les glyphes des titres et du texte de leçon ont été vérifiés via le protocole Chromium : police locale Inter réellement utilisée, pas seulement déclarée dans CSS. Le chargement initial des cinq routes desktop/mobile confirme aussi la disponibilité d’Inter.

Les captures, les liens avant/après et les limites sont consignés dans [LATEST.md](../design-reviews/LATEST.md), archive `2026-11-03_20-49-59-Europe-Paris`. Validation design externe encore attendue ; Chromium et Pixel 7 émulé uniquement.

## Passe 10 — accès au clavier et consolidation

La suite demandée après Inter reprend le chantier d’accessibilité de la feuille de route. Le menu mobile et la palette partagent un retour de focus fiable ; les flèches parcourent la recherche, les routes portent un titre précis et le diagnostic/quiz focalise la nouvelle étape. Les noms accessibles reprennent les libellés visibles. Les groupes, indicateurs de progression et descriptions financières exposent des rôles valides. Trois indices de contraste sont corrigés avec les tokens existants.

Le run final du 5 novembre 2026 passe avec **54 tests navigateur** (27 scénarios sur deux viewports), aucun échec, test ignoré ou retry. Les quatre nouveaux scénarios couvrent les audits d’écran, la recherche y compris vide, le menu/recherche et le redimensionnement, le diagnostic et le quiz au clavier. **33 états sont audités avec axe 4.14.0**, sans violation automatiquement établie ni annotation ARIA restant à corriger dans les résultats exécutés. Les 22 états comportant des contrastes indéterminés sont consignés dans `design-reviews/accessibility-report.json` ; ils ne sont pas présentés comme une conformité acquise.

`npm test` passe, et l’exécution directe des huit fichiers confirme **146 cas réussis**. TypeScript et Vite compilent ; Vite signale le bundle principal de 502,52 kB minifié (146,71 kB gzip). La passe ne change ni le modèle de données ni les règles métier. Le chargement par écran reste un chantier distinct.

**141 captures fraîches** sont archivées sous `2026-11-05_05-27-47-Europe-Paris`, avec la paire stable sur la recherche. L’inspection a corrigé un texte d’assistance visible par erreur dans la barre latérale ; la galerie finale a été régénérée. La correction du quiz est focalisée et sa boîte vérifiée au-dessus du dock mobile ; deux rendus de viewport montrent ce comportement. Les tests de motion et de réduction des mouvements passent. Les sélecteurs de tests suivent désormais les libellés visibles des graphes.

Les captures de recherche, quiz, leçon et simulation ont été inspectées sur desktop/mobile et comparées à la passe Inter. Les comptes rendus et limites sont dans [LATEST.md](../design-reviews/LATEST.md). La poursuite a été autorisée par l’utilisateur ; aucune review design indépendante ni certification d’accessibilité n’est revendiquée.

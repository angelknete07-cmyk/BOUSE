# Architecture de la première version

## Décisions

Le dépôt initial ne contenait qu’un README. La première version est une application web TypeScript à composants React, assemblée par Vite. Les versions retenues ont été contrôlées sur le registre npm le **2 novembre 2026** : React/React DOM **19.3.1**, Vite **8.3.5** et TypeScript **7.0.2**. Le manifeste et le lockfile constituent les références reproductibles ; installer avec `npm ci` plutôt qu’une mise à jour implicite.

Une application locale convient à ce premier cycle d’apprentissage : pas de serveur ni d’identifiants indispensables pour essayer les fonctionnalités. Next.js, Supabase, une base vectorielle et une infrastructure d’agents n’apporteraient pas encore de capacité nécessaire à ce périmètre. Les besoins serveur seront introduits avec l’authentification, la synchronisation ou les appels IA réels.

## Responsabilités

| Zone                 | Responsabilité                                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Interface React      | Navigation, formulaires, leçons, états de chargement/erreur, interactions clavier et présentation adaptative.                                                |
| Contenus             | Leçons structurées, prérequis, références, versions, exercices et corrigés ; indépendants du stockage personnel.                                             |
| `src/lib/types.ts`   | Contrats du profil, des tentatives, des projets et de l’état applicatif.                                                                                     |
| `src/lib/domain.ts`  | Fonctions pures : évaluation de quiz, calcul économique, normalisation de recherche, grille de prompt et étapes de projet. Aucun accès réseau ou navigateur. |
| `src/lib/storage.ts` | Lecture/validation de l’état local et export de fichiers ; frontière à remplacer lors de l’ajout d’une persistance distante.                                 |
| `tests/`             | Cas métier et parcours navigateur critiques. Les assertions doivent vérifier un comportement utile, pas uniquement la présence d’un composant.               |

## État et progression

L’état versionné `schemaVersion: 1` regroupe un profil optionnel, les tentatives horodatées, les projets, les notes par leçon et la dernière leçon ouverte. La clé locale est `bouse.academy.v1`.

Le diagnostic enregistre un point de départ. Les tentatives constituent les preuves utilisées par la progression ; les états dérivés doivent rester calculables depuis ces données. Un score élevé au quiz n’établit pas à lui seul une maîtrise professionnelle. Le passage d’un projet à l’étape suivante est une déclaration utilisateur.

La lecture et l’import valident la structure et la version avant utilisation. Une sauvegarde illisible doit être préservée tant que l’utilisateur n’a pas explicitement choisi sa suppression ou son remplacement. Le stockage navigateur peut être refusé, saturé ou effacé : signaler l’échec et offrir l’export, sans annoncer une sauvegarde réussie.

## Calculs et analyse de prompts

Le calculateur est un modèle pédagogique hors taxes, à prix et coût variable unitaires constants. Il calcule `CA = prix × volume`, `contribution = (prix − coût variable) × volume`, puis `résultat simplifié = contribution − coûts fixes`. Le seuil en unités arrondit à l’entier supérieur ; si la contribution unitaire n’est pas positive, aucun seuil fini n’est annoncé. Les entrées invalides et dépassements numériques sont refusés. Le modèle ne calcule ni trésorerie complète, ni impôt, ni BFR.

La relecture de prompts utilise une grille transparente de mots-clés : objectif, contexte/public, données, contraintes, format et vérification. Son score mesure la présence d’indices de structure, pas la qualité garantie d’un résultat. Elle ne simule pas l’exécution d’un LLM et n’appelle aucun fournisseur.

## Frontières futures

**Supabase/PostgreSQL** : introduire un adaptateur de persistance, des migrations versionnées et des politiques de sécurité par utilisateur avant synchronisation. Le schéma pourra séparer profils, contenus/version de contenu, compétences/prérequis, tentatives, révisions, projets et notes. Une clé privilégiée reste exclusivement côté serveur. Les données existantes devront être inspectées avant toute migration.

**IA** : définir un contrat de requête/réponse indépendant du fournisseur côté serveur. Authentifier l’appelant, limiter coûts et taille, gérer délais et erreurs, journaliser sans prompts sensibles et distinguer génération, recherche et vérification. Aucune clé privée dans une variable `VITE_*` : elle serait exposée au navigateur.

**Radar et contenus** : séparer sources proposées, pages consultées, brouillons et versions publiées. Une automatisation future devra conserver provenance et historique, dédupliquer, vérifier puis demander une validation éditoriale appropriée. La version locale ne promet pas cette infrastructure.

## Qualité attendue

- TypeScript strict et séparation des données, de l’interface et des règles métier.
- Tests des calculs aux limites, de l’évaluation de quiz et des entrées/imports invalides.
- Parcours navigateur : onboarding, quiz, persistance après rechargement, projet, palette, export/import et mobile.
- Libellés accessibles, focus visible, commandes utilisables au clavier et `prefers-reduced-motion`.
- Aucune donnée personnelle fictive présentée comme historique réel, aucun secret dans Git, aucune transmission externe implicite.

Les commandes et leurs résultats de validation sont rapportés au moment de la livraison. La compilation seule ne démontre ni accessibilité complète, ni sécurité d’un futur backend, ni disponibilité en production.

## Navigation et repères accessibles

Le menu mobile et la recherche sont exclusifs : ouvrir la recherche ferme le menu et mémorise son déclencheur extérieur. Une fermeture rend le focus à ce déclencheur s’il est encore visible et disponible, sinon au contenu principal. Une navigation attend le retrait de `inert` avant de focaliser le nouveau contenu ; le titre du document identifie la leçon ou le projet ouvert.

La recherche conserve des boutons natifs. Tab reste utilisable ; les flèches, Home et End parcourent les résultats et Entrée ouvre le résultat actif (le premier depuis le champ). Aucun résultat ne déclenche aucune navigation. Le compteur est un statut annoncé. Le diagnostic focalise le nouveau titre et le quiz sa correction, puis la séquence suivante.

Les contrôles prennent leur nom dans le texte visible lorsque possible ; les descriptions complémentaires des graphes passent par `aria-describedby`. La classe commune `.sr-only` conserve une information pour les technologies d’assistance sans modifier la composition. Les tests `accessibility.spec.ts` vérifient les parcours clavier et les règles automatisables WCAG A/AA avec axe ; ils ne constituent pas une certification d’accessibilité.

## Révisions espacées — extension compatible du format v1

`reviewEvents` est un champ facultatif du format existant. Les anciennes sauvegardes qui ne le contiennent pas restent acceptées sans effacement ni migration destructive. Les nouveaux événements portent identifiant, leçon/version, carte, autoévaluation, instant UTC, échéance et palier. La validation de sauvegarde réutilise `isReviewEvent` pour refuser les échéances incohérentes et les identifiants en double.

`src/lib/reviews.ts` dérive le calendrier des tentatives et de ces événements. Les cartes sont identifiées par `lessonId::version::index`. Les nouvelles tentatives portent `lessonVersion` ; les anciennes sans cette propriété correspondent au catalogue initial `1.0.0`. Un quiz v1 ne crée pas de retard sur une nouvelle version v2. L’historique v1 reste conservé.

Les intervalles sont des durées UTC exactes, affichées en heure de Paris. Les événements futurs, invalides ou précédant le travail de la version sont écartés du calcul. L’ajout d’événement est immuable et idempotent par identifiant. Le composant fige au plus cinq cartes au départ, garde la révélation avant notation, protège les doubles clics et ne modifie jamais les tentatives. Le score de quiz et l’autoévaluation de rappel sont deux preuves différentes.

## Tests terrain et journal de décisions

Les champs optionnels `experiments` et `decisions` étendent le format v1 sans transformer les anciennes sauvegardes. `src/lib/projects.ts` valide les formes, bornes de saisie, dates calendaires réelles et horodatages UTC. Les constructeurs copient explicitement les champs autorisés ; les fonctions de bilan conservent le plan initial et refusent un second résultat.

La frontière de sauvegarde valide aussi les relations : identifiants uniques, projet existant et test associé appartenant au même projet que la décision. Un import incohérent est refusé avant remplacement ; les anciennes données sont préservées. Les échéances sont des dates calendaires sans heure inventée ; les enregistrements ont un instant UTC et un résultat ne peut précéder son plan.

Le parcours `project/<id>` ouvre l’atelier. Les états et calculs de compétences/quiz/révision ne sont pas modifiés par les conclusions terrain. L’avancement de projet reste une déclaration manuelle. Les exports Markdown et les menus de tests associés sont limités au projet courant.

## Simulation financière versionnée

`src/lib/simulation.ts` contient le modèle pur à six mois, ses bornes, la validation de snapshots et l’export Markdown. La référence et le scénario utilisent le même modèle ; les changements de prix, volume, coût variable, coût fixe et délai d’encaissement sont appliqués dès le premier mois. Les produits et variations utilisent des coefficients décimaux `BigInt` avant arrondi au centime de la trésorerie initiale et des flux mensuels. Les calculs refusent les valeurs non finies, hors bornes ou non représentables de façon fiable. L’export conserve aussi les hypothèses numériques exactes dans un bloc JSON pour reproduire les fractions acceptées.

Le modèle n’a aucune créance initiale. Une vente est encaissée après un nombre entier de mois ; les dépenses sont payées immédiatement. Le ledger mensuel expose revenu, dépenses, résultat, encaissements, cash et créances. Le financement nécessaire est dérivé du minimum des soldes d’ouverture et de fin de mois, sans versement automatique. L’identité cash/résultat/créances permet une vérification indépendante.

Le champ optionnel `simulations` préserve la compatibilité du format v1. Chaque comparaison stocke identifiant, titre, instant UTC, version de modèle et copie des hypothèses ; les résultats sont recalculés. L’import refuse les snapshots invalides, les identifiants en double et les versions de modèle inconnues avant remplacement. L’interface `simulation` ne modifie ni projets, ni tentatives, ni rappels.

## Portfolio dérivé et règle commune de quiz

`src/lib/portfolio.ts` dérive un dossier depuis le catalogue et l’état existant, sans nouveau champ de stockage. `latestCurrentAttempt` et `currentQuizAttempts` sélectionnent les tentatives de la version courante, avec instant UTC canonique valide et antérieur ou égal à la date d’observation. L’ordre chronologique prime sur l’ordre importé ; en cas d’égalité, la dernière entrée tranche. Les anciennes tentatives sans version se rapportent à `1.0.0`. Les cas non admissibles sont conservés dans les archives.

Ces helpers sont partagés par le portfolio, l’accueil, les prérequis, la carte et le résumé de leçon pour éviter des états divergents après import. L’export Markdown conserve les notes, projets, observations, bilans et comparaisons sans les convertir en preuves de maîtrise. Son frontmatter date l’export, sans inventer de vérification de contenu. Les textes personnels préservent leur contenu dans des blocs littéraux qui protègent la structure du document. Les sorties sont des copies ; aucune consultation ni export ne modifie l’état.

Le hook `useClock` déclenche toujours une actualisation périodique et au retour sur l’onglet, mais lit l’heure réelle à chaque rendu. Une tentative enregistrée entre deux ticks ne doit pas être rejetée comme future à cause d’une heure mémorisée plus ancienne.

## Objectifs et parcours d’un projet

`Project.learningGoalIds?: string[]` est une extension compatible du format v1. L’absence du champ ne crée aucun objectif à partir de `lessonIds`, qui conserve son rôle d’association depuis Apply. La validation refuse formes invalides, doublons et identifiants non normalisés, mais conserve les identifiants hors catalogue. Le setter copie la fiche complète et la mise à jour fonctionnelle préserve les autres champs actuels.

`src/lib/projectLearning.ts` dérive la fermeture des prérequis, l’ordre des étapes, leurs objectifs d’origine et les états selon `latestCurrentAttempt`. Les prérequis partagés n’apparaissent qu’une fois. Les cycles et contenus manquants bloquent leurs descendants ; une branche indépendante peut rester disponible. Les minutes et compteurs sont dérivés, sans état « compétence terminée » persisté.

`project-plan/<id>` ouvre directement Repères sans modifier les routes de dossier existantes. Les leçons relient les objectifs et leurs prérequis au plan ; la carte distingue les objectifs explicitement choisis des apprentissages associés. L’export de dossier utilise `projectLearningMarkdown` ; le portfolio exporte les objectifs exacts sans importer le module de parcours, ce qui évite une dépendance circulaire avec les helpers de quiz.

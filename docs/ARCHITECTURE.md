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

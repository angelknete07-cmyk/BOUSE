# BOUSE — Business & AI Academy

Une académie personnelle francophone pour comprendre la finance, expérimenter avec l’IA et transformer ses connaissances en projets. Première version fonctionnelle locale : **apprendre → pratiquer → démontrer → appliquer**.

## Démarrer

Prérequis : Node.js **22.12.0 ou supérieur** et npm. L’environnement cloud utilise Node.js **24.19.0**. Réutiliser le dépôt existant ; aucun Git worktree supplémentaire n’est nécessaire.

```bash
cd /workspace/BOUSE
npm ci --no-audit --no-fund
npm run dev -- --port 5173 --strictPort
```

Le serveur de développement utilise le port 5173. Aucune clé API n’est nécessaire pour cette version. Les détails de l’environnement et des tests figurent dans [SETUP.md](docs/SETUP.md).

## Fonctionnalités

- Onboarding court et diagnostic de cinq questions, qui oriente le parcours sans certifier de niveau.
- Tableau de bord, 43 leçons dans cinq domaines (finance d’entreprise, entrepreneuriat, IA, finance personnelle, investissement), chacune avec une scène manipulable, prérequis, quiz corrigés, flashcards, notes et progression par compétence.
- Cinq parcours par objectif (créer mon entreprise, gérer mon argent, commencer à investir, piloter une entreprise, travailler avec l’IA).
- Entraînement libre tiré du lexique, fiches pratiques à télécharger et date de vérification des règles fiscales.
- Lab de rentabilité : prix, coûts, volume et seuil de rentabilité.
- Mode « Et si ? » : comparaison de scénarios sur six mois, délais de paiement, courbe de trésorerie, hypothèses sauvegardées et export Markdown.
- AI Lab : relecture de prompts par grille explicite et déterministe.
- Incubateur : projets liés aux leçons, atelier de tests terrain et journal de décisions avec comparaison attendu/réel.
- Parcours par projet : objectifs d’apprentissage choisis, prérequis et prochaine leçon selon les quiz courants, avec retour direct au plan.
- Recherche et palette de commandes, navigation mobile dédiée et réduction des animations.
- Leçons en séquences, outils manipulables, teach-back autoévalué et quiz progressif.
- Trajectoire et graphe de compétences interactifs fondés sur les prérequis et les dernières tentatives.
- Portfolio d’apprentissage : quiz courants, notes, dossiers et explorations reliés, avec export Markdown utilisable dans Obsidian.
- Révisions espacées : sessions courtes de rappel, autoévaluation et prochaines échéances sauvegardées.
- Sauvegarde dans le navigateur, export/import JSON et suppression des données.
- Radar de références sélectionnées, avec distinction entre vérification et piste proposée.

Le profil, les tentatives, les notes et les projets restent dans le `localStorage` du navigateur courant. Un effacement des données du navigateur peut les supprimer : conserver un export JSON pour les sauvegarder. Cet export contient des données personnelles en clair.

## Vérifier

```bash
npm run build
npm test
npm run test:e2e
```

La compilation inclut la vérification TypeScript. Les tests métier et les parcours navigateur sont distincts ; voir [les conditions d’exécution des tests](docs/SETUP.md#tests-et-validation). La présence de ces commandes ne constitue pas à elle seule un résultat de validation.

## Stack et structure

React **19.3.1**, TypeScript **7.0.2**, Vite **8.3.5** ; Playwright **1.64.1** pour les parcours navigateur. Le lockfile fixe l’installation reproductible.

- `src/` : interface, contenus et logique métier.
- `src/tokens.css` : couleurs, surfaces, typographie, espacements, radius, ombres et motion partagés.
- `tests/` : tests métier et parcours navigateur desktop/mobile.
- [PRODUCT.md](docs/PRODUCT.md) : périmètre, pédagogie, données personnelles et feuille de route.
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) : décisions techniques et frontières des futures intégrations.
- [DESIGN.md](docs/DESIGN.md) : audit et direction artistique noire, blanche et grise.
- [VALIDATION.md](docs/VALIDATION.md) : résultats des contrôles exécutés.

## Review design

[Derniers rendus et notes de review](design-reviews/LATEST.md) : captures desktop/mobile réelles, comparaison à la passe précédente et statut de validation externe. Après une modification visuelle importante, lancer `npm run review:render`, inspecter les images puis actualiser les notes. Les règles durables se trouvent dans `AGENTS.md`.

## Limites de cette version

Il n’existe pas encore d’authentification, de synchronisation cloud ni de connexion à Supabase. L’AI Lab n’appelle aucun modèle ; sa grille n’évalue pas la qualité garantie d’une réponse. Le Radar ne réalise aucune veille automatique. Le simulateur de dirigeant, le mentor IA et les contenus avancés restent dans la feuille de route.

Aucun déploiement ni envoi vers GitHub n’est effectué par ces instructions. La mise en production demandera les intégrations et validations correspondantes. Les secrets futurs devront rester côté serveur ; ne jamais les placer dans une variable `VITE_*`.

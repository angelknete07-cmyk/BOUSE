# Review design — passe 04 : atelier terrain et décisions

**Rendus du 2 novembre 2026 à 22:47, Europe/Paris.**
**Statut : passe acceptée par l’utilisateur ; poursuite autorisée.**

La passe 03 a été acceptée par l’utilisateur avec « LA SUITE ». Cette autorisation a permis de construire cette étape sur les projets. Après sa présentation, l’utilisateur a demandé « SUIT », autorisant la prochaine étape sur cette base. Aucune validation design indépendante n’est revendiquée.

## Rendus à examiner

- [Desktop, viewport 1440 × 1000](latest-desktop.png) · [Mobile, viewport CSS 412 × 839](latest-mobile.png)
- [Atelier vide — desktop](screens/desktop/12-project-empty.png) · [mobile](screens/mobile/12-project-empty.png)
- [Plan du test — desktop](screens/desktop/12-project-test-plan.png) · [mobile](screens/mobile/12-project-test-plan.png)
- [Observations et preuves — desktop](screens/desktop/12-project-result.png) · [mobile](screens/mobile/12-project-result.png)
- [Décision initiale — desktop](screens/desktop/12-project-decision.png) · [mobile](screens/mobile/12-project-decision.png)
- [Comparaison attendu/réel — desktop](screens/desktop/12-project-outcome.png) · [mobile](screens/mobile/12-project-outcome.png)
- [Liste des projets — desktop](screens/desktop/07-incubator.png) · [mobile](screens/mobile/07-incubator.png)

**61 captures réelles**, incluant les autres écrans existants. La paire latest montre le premier écran de l’atelier Décisions. La comparaison complète se trouve plus bas dans la page, dans les captures `12-project-outcome.png`. Le mobile utilise Pixel 7 émulé, à 2,625 pixels par pixel CSS. Dans les captures de page complète, le dock fixe apparaît à la limite du premier viewport ; ce raccord est un effet de capture. Les fichiers latest montrent le viewport réel. Toutes les données sont fictives et destinées à la démonstration.

## Audit et changements

L’Incubator conservait une fiche d’idée et un stade manuel, sans espace pour garder les preuves terrain ni comparer une décision à ses résultats. Le nouvel atelier utilise les tokens centraux existants ; aucune nouvelle palette ou marque n’a été introduite.

- **Terrain** : hypothèse, protocole, critère de réussite et date de revue, puis observations, éléments de preuve et conclusion personnelle.
- **Décisions** : contexte, alternatives, choix, résultat attendu, confiance déclarée et risque, puis comparaison au réel et apprentissage.
- Le plan initial et le raisonnement sont conservés tels qu’enregistrés. Ajouter un bilan ne les réécrit pas ; cette règle est expliquée avant enregistrement.
- Registre numéroté et lecture par séquences. Les surfaces distinguent plan et faits ; le contraste et les mots indiquent les conclusions, sans accent coloré.
- Sur mobile : introduction et espacements resserrés après inspection, comparaison séquentielle, actions de formulaires accessibles au-dessus du dock.
- Export Markdown du dossier ouvert ; sauvegarde JSON complète et anciennes sauvegardes v1 compatibles. Accès direct depuis un projet et la recherche.
- Les observations ne changent automatiquement ni stade du projet, ni quiz, ni maîtrise des compétences. La confiance est une estimation personnelle.

## Comparaison et vérification

La base acceptée est conservée dans [l’archive de la passe 03](archive/2026-11-02_22-24-49-Europe-Paris/LATEST.md). Comparer notamment son [ancienne fiche Incubator](archive/2026-11-02_22-24-49-Europe-Paris/screens/desktop/07-incubator.png) au registre et à la comparaison attendu/réel. L’ancienne fiche regroupait toute l’information dans un grand panneau ; l’atelier distingue désormais préparation, faits et apprentissage par la composition et les changements de surface. Les autres univers gardent leur identité.

Inspection desktop/mobile des états vide, planifié, observé, décision et bilan : noirs et gris cohérents, titres nettement distincts des métadonnées, surfaces discrètes, absence de débordement observé. Les espaces mobiles ont été réduits après une première capture pour faire apparaître plus tôt l’action et le premier élément. Les états interactifs ont été exercés dans Chromium. Les formulaires et notices utilisent les easings des tokens ; `prefers-reduced-motion` désactive leur mouvement.

Contrôle navigateur complémentaire : entrée des formulaires mesurée à 360 ms avec une décélération non linéaire, opacité de 0 à 1 et mouvement de 5 px. Avec réduction des mouvements, affichage immédiat sans animation ni transition. Focus argent visible ; navigation des onglets par flèches, Home et End vérifiée. Le hover mobile a été exercé avec un pointeur émulé ; il ne représente pas un geste tactile.

**Compilation/TypeScript, 75 cas unitaires et 24 tests navigateur réussis, aucun test ignoré.** Les parcours vérifient notamment la conservation du plan et de l’attente initiale, les liens entre décisions et tests d’un même projet, le rechargement, l’export Markdown du seul dossier ouvert, l’export JSON et les anciennes sauvegardes. Les tests métier refusent les identifiants ambigus, dates invalides, données incomplètes et références à un autre projet.

Le manifeste contient les empreintes des sources et PNG, les viewports et le résultat du run. Archive actuelle : `archive/2026-11-02_22-47-00-Europe-Paris/`.

## Reproduire et limites

Lancer `npm run test:e2e`, puis `npm run review:save -- --primary=12-project-viewport`. Le script refuse les images antérieures aux sources ou issues d’un run échoué. Examiner `ProjectWorkbench.tsx`, `project-workbench.css`, `projects.ts` et la validation d’import dans `storage.ts`.

Code et rendus sont destinés à la branche `codex/learning-design-review` du dépôt `angelknete07-cmyk/BOUSE` ; la synchronisation est vérifiée à la livraison. Stockage local au navigateur, sans compte ni synchronisation entre appareils. L’application ne vérifie pas les preuves saisies et n’envoie pas de rappel extérieur. Mobile émulé dans Chromium ; les captures fixes ne restituent pas les animations et ne remplacent pas une review design externe.

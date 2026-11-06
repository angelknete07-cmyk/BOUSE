# Review design — passe 03 : révisions espacées

**Rendus du 2 novembre 2026 à 22:24, Europe/Paris.**
**Statut : passe acceptée par l’utilisateur ; poursuite autorisée.**

La passe 02 a été acceptée par l’utilisateur : « OK, bah c’est parti pour la suite alors. » Cet accord autorisait cette brique. Après sa présentation, l’utilisateur a demandé « LA SUITE », autorisant la prochaine étape sur cette base. Aucune review indépendante par un autre ChatGPT n’est revendiquée.

## Rendus

- [Desktop, viewport 1440 × 1000](latest-desktop.png) · [Mobile, viewport CSS 412 × 839](latest-mobile.png)
- [Disponibles — desktop](screens/desktop/11-revisions-due.png) · [mobile](screens/mobile/11-revisions-due.png)
- [Rappel — desktop](screens/desktop/11-revisions-recall.png) · [mobile](screens/mobile/11-revisions-recall.png)
- [Repères révélés — desktop](screens/desktop/11-revisions-revealed.png) · [mobile](screens/mobile/11-revisions-revealed.png)
- [Bilan — desktop](screens/desktop/11-revisions-complete.png) · [mobile](screens/mobile/11-revisions-complete.png)
- [Échéances futures — desktop](screens/desktop/11-revisions-planned.png) · [mobile](screens/mobile/11-revisions-planned.png)
- [État vide — desktop](screens/desktop/11-revisions-empty.png) · [mobile](screens/mobile/11-revisions-empty.png)
- [Accueil actualisé — desktop](screens/desktop/01-home.png) · [mobile](screens/mobile/01-home.png)

**49 captures réelles**, dont les autres écrans existants. La paire latest montre désormais le nouvel espace Révisions. Le mobile utilise Pixel 7 émulé, à 2,625 pixels par pixel CSS. Les images de page complète incluent le dock fixe à la position du viewport : la paire latest représente le premier écran réel. Le profil et les tentatives sont explicitement des données de démonstration.

## Changements

- Sessions de cinq cartes maximum : rappel de mémoire, révélation puis autoévaluation.
- Échec au quiz : priorité aux repères de la leçon, sans diagnostic artificiel d’une faiblesse précise.
- « À reprendre » : 24 h et palier remis au début ; « Encore fragile » : 24 h sans avancer ; « Retrouvé sans aide » : 3, 7, 14 puis 30 jours.
- Score des quiz inchangé. Passer ou quitter ne crée aucune réussite.
- Échéances et historique conservés au rechargement et dans l’export/import JSON ; anciennes sauvegardes compatibles.
- Les tentatives et les cartes sont associées à une version de contenu. Un quiz v1 ne crée pas de retard sur une nouvelle leçon v2 jamais travaillée.
- Accès depuis l’accueil, le bilan du quiz et la navigation. Le dock mobile donne accès à « Réviser » ; l’AI Lab reste dans les espaces et son univers.

## Comparaison et vérification

La base acceptée est conservée dans [l’archive de la passe 02](archive/2026-11-02_22-03-08-Europe-Paris/LATEST.md). Le nouvel espace reprend ses noirs, gris, argent, surfaces discrètes et hiérarchie typographique. Une table de rappel centrale et un calendrier visuel remplacent une longue liste de cartes. Les autres univers gardent leur composition.

Inspection desktop/mobile effectuée pour les états disponible, carte, révélé, bilan, planifié et vide : typographie lisible, question dominante pendant la session, pas de débordement ni chevauchement observé, choix tactiles adaptés au dock, focus sur la réponse révélée. Pas de grandes surfaces vertes ; les états restent neutres. Transitions non linéaires et réduction des mouvements conservées.

**Compilation/TypeScript, 54 tests unitaires et 18 tests navigateur réussis, aucun test ignoré.** Les parcours couvrent révélation obligatoire, double clic sans doublon, échéances exactes, quiz inchangé, abandon, rechargement, sauvegardes anciennes et export. Les tests métier couvrent aussi versions, dates futures, changements d’heure et paliers.

Le manifeste conserve empreintes des sources/PNG, viewports et résultat du run. Archive actuelle : archive/2026-11-02_22-24-49-Europe-Paris/.

## Reproduire et examiner

Lancer npm run test:e2e, puis npm run review:save -- --primary=11-revisions-viewport. Le script refuse les images antérieures aux sources ou issues d’un run échoué.

Code et rendus sont destinés à la branche codex/learning-design-review du dépôt angelknete07-cmyk/BOUSE ; la synchronisation est vérifiée à la livraison. Examiner notamment Reviews.tsx, reviews.css et reviews.ts.

Limites : stockage dans le navigateur, sans notification hors application ni synchronisation entre appareils. Calendrier explicite du produit, sans promesse de personnalisation scientifique. Mobile émulé dans Chromium ; les captures fixes ne restituent pas les animations.

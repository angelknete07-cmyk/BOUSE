# Review design — passe 07 : apprendre pour un projet

**Rendus du 3 novembre 2026 à 08:16, Europe/Paris.**
**Statut : vérification interne effectuée ; review design externe à réaliser.**

Le « GO » de l’utilisateur autorisait la suite du portfolio (passe 06). Cette passe étend l’onglet Repères des projets avec des objectifs explicites et leur parcours de prérequis. Aucune validation design indépendante n’est revendiquée.

## Rendus à examiner

- [Desktop, viewport 1440 × 1000](latest-desktop.png) · [Mobile, viewport CSS 412 × 839](latest-mobile.png)
- [Sans objectif — desktop](screens/desktop/15-project-learning-empty.png) · [mobile](screens/mobile/15-project-learning-empty.png)
- [Choisir les objectifs — desktop](screens/desktop/15-project-learning-editor.png) · [mobile](screens/mobile/15-project-learning-editor.png)
- [Parcours complet — desktop](screens/desktop/15-project-learning-plan.png) · [mobile](screens/mobile/15-project-learning-plan.png)
- [Après un quiz réussi — desktop](screens/desktop/15-project-learning-updated.png) · [mobile](screens/mobile/15-project-learning-updated.png)
- [Retour depuis la leçon — desktop](screens/desktop/15-project-learning-lesson.png) · [mobile](screens/mobile/15-project-learning-lesson.png)
- [Accès depuis la carte — desktop](screens/desktop/15-project-learning-map.png) · [mobile](screens/mobile/15-project-learning-map.png)

**93 captures réelles**, incluant la galerie existante. La paire stable montre le premier écran du parcours. Les pages complètes montrent le dock fixe à la limite du premier viewport ; les captures ne sont pas retouchées. Pixel 7 émulé, échelle 2,625. Toutes les données présentées sont fictives.

## Audit et changements

L’ancien onglet Repères affichait des liens aux leçons et des suggestions fondées sur ces associations. Il ne permettait pas de choisir un objectif, de voir tous ses prérequis ni de reprendre directement le parcours après un quiz.

- **Incubator → ouvrir un projet → Repères → Choisir mes objectifs.** Les choix sont sauvegardés séparément des apprentissages associés depuis Apply.
- Une chronologie relie les objectifs et leurs prérequis, déduplique les notions communes et propose le prochain pas disponible. Les quiz courants déterminent les états ; une ancienne réussite ne masque pas un échec plus récent.
- Les leçons, y compris les prérequis, proposent un retour direct au plan. La carte signale les objectifs choisis dans les projets.
- Sauvegarde JSON et exports Markdown du dossier et du portfolio conservent les objectifs, même ceux absents du catalogue. Les anciennes fiches restent compatibles.
- Surfaces, typographie, espacement, rayons, ombres et motion reprennent les tokens centraux. Le fil des étapes structure le contenu sans grille de cartes ni couleurs décoratives.

## Comparaison et corrections

Comparer le premier diagnostic [desktop](archive/2026-11-02_project-learning-initial/latest-desktop.png) et [mobile](archive/2026-11-02_project-learning-initial/latest-mobile.png) à la paire stable. Les introductions occupaient tout le premier écran mobile. L’en-tête et la notice ont été resserrés ; le contexte du projet est maintenant repliable après le parcours. **Le bouton Étudier et la première étape sont visibles sans défiler** dans le viewport mobile de référence.

Une règle de style héritée rétrécissait la composition desktop ; elle a été isolée. Le volet « Le cap du projet » utilise désormais un seul indicateur d’ouverture, cohérent avec les autres volets. Les rendus ont été régénérés après ces corrections.

Inspection interne : hiérarchie de la prochaine action, densité, alignements, contrastes monochromes, profondeur légère, sélection des objectifs, états disponibles/à reprendre/prérequis et retour après quiz. Aucun débordement horizontal observé. Le contexte secondaire reste accessible sous le parcours.

## Contrôles et limites

**Compilation/TypeScript, 146 cas unitaires et 44 tests navigateur réussis, aucun test ignoré.** Les six tests de galerie/motion ont ensuite été réexécutés après la dernière correction CSS. Les 93 images sont fraîches et liées aux sources par `render-manifest.json`.

Contrôle complémentaire dans Chromium : action principale visible, focus sur l’éditeur, sélection avec Espace, annulation avec retour du focus et données inchangées. Entrée de 360 ms, déplacement de 5 px et easing non linéaire ; aucune animation avec `prefers-reduced-motion`. Le HTML et les ressources JS/CSS servis en production correspondent aux fichiers compilés.

Le parcours reste limité au catalogue actuel de six leçons. Les minutes sont indicatives ; un quiz validé ne certifie ni compétence professionnelle ni réussite du projet. Stockage local, sans synchronisation cloud. Pas de test sur appareil physique, Safari ou Firefox, ni de certification d’accessibilité.

Archive finale : `archive/2026-11-03_08-16-27-Europe-Paris/`. La [passe 06](archive/2026-11-02_23-27-21-Europe-Paris/LATEST.md) reste disponible pour comparaison.

Reproduction : `npm run test:e2e`, puis `node scripts/save-design-review.mjs --primary=15-project-learning-viewport`. La review externe de cette passe précède le prochain élargissement fonctionnel.

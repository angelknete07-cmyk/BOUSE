# Passe 32 — planche 03 : accueil en tableau de bord, graphiques premium

Date : 6 novembre 2026. Suite directe de la passe 31, après retour de l'utilisateur.

## Retour de l'utilisateur

- Les captures de la passe 31 « ne ressemblent pas du tout » aux images envoyées.
- La **planche 03** est celle qu'il préfère, logo compris.
- **Garder ce qui existe déjà** (la vague de l'accueil, les éléments de la carte) ; améliorer surtout **la couleur des courbes, graphiques et progressions**, avec le petit « B » dans la barre latérale, pour un rendu premium.
- Choix explicite : « Nouvel accueil + vague ».

Une première version utilisait une image de montagne générée et retirait des éléments de la carte : elle a été abandonnée suite à ce retour. La vague et tous les éléments d'origine sont revenus.

## Différences relevées entre les références et l'application (avant)

| Point       | Planche 03                                                       | BOUSE passe 31                        |
| ----------- | ---------------------------------------------------------------- | ------------------------------------- |
| Composition | tableau de bord dense visible d'un coup                          | une grande carte, chiffres plus bas   |
| Navigation  | barre large, logo + « BOUSE », icône et libellé sur une ligne    | rail étroit, libellés sous les icônes |
| En-tête     | salutation, champ de recherche, avatar                           | fil d'Ariane, icône de recherche      |
| Couleur     | violet, bleu, émeraude ponctuels, lueur                          | lavande très discrète                 |
| Graphiques  | courbes violettes lumineuses, aires en dégradé, anneaux dégradés | courbes argent ou lavande fine        |

## Ce qui change

- **Règle d'accent** (AGENTS.md, DESIGN.md) : violet `#A78BFA`, bleu `#6BA6F2`, émeraude `#3FCB9B` ; surfaces toujours noires et argent ; ne pas retirer d'élément existant sans demande.
- **Marque** : `BrandLogo`, un « B » argenté en rubans dessiné en SVG ; « BOUSE » en capitales espacées.
- **Barre latérale large** (248 px au-delà de 1100 px) ; navigation active bordée de violet. Le rail reste entre 701 et 1100 px, le dock sur mobile.
- **En-tête** : champ « Rechercher une leçon, un outil, un terme… » et avatar (le nom accessible reste « Ouvrir la recherche »).
- **Accueil** :
  - salutation « Bienvenue » au premier passage, « Bon retour » ensuite ;
  - carte de la leçon avec la vague d'origine, la coordonnée BOUSE / DOMAINE, la raison, le plan de séance, les rappels et la barre « Votre parcours » ;
  - carte « Ma progression » (anneau violet → bleu) ;
  - quatre tuiles : compétences acquises, simulations, révisions à faire, projets en cours ;
  - « Mon parcours » en étapes : le parcours suivi, sinon les cinq domaines (validé en émeraude, en cours en violet lumineux) ;
  - « Mon activité (7 jours) » : courbe lissée violette, tirée des quiz et révisions réels ;
  - les sections existantes (objectifs, domaines, trajectoire) restent dessous.
- **Graphiques de toute l'application** : séries principales violettes avec lueur (Lab, Et si ?, scènes de leçon), aires en dégradé violet, points lumineux, références grises, barres de progression violet → bleu, anneaux dégradés, barres clés des scènes violette et bleue.

## Captures

- Avant : `accents-31/apres/` ; après : `console-32/apres/` (desktop 1440 × 1000, Pixel 7) ; planches `console-32/comparaisons/`.
- Galerie complète régénérée : `screens/`, archive `2026-11-06_15-35-30-Europe-Paris`.

## Contrôles de l'agent

- `npm test` : 245 cas ; `npx playwright test` : 86 tests (desktop et Pixel 7, axe compris) ; Prettier ; build sans avertissement.
- Tests adaptés : nouveaux titres, bouton « Continuer / Commencer la leçon », sélecteurs de la carte, recherche dans l'en-tête ; la bordure active violette n'est plus vérifiée comme neutre.

## Limites

- L'écran de leçon garde sa composition éditoriale : seules ses couleurs changent. La planche 03 montre une leçon avec visuel et panneau de paramètres : à faire après ton avis sur l'accueil.
- Les curseurs (`input range`) restent argent.
- **Direction artistique non validée** : elle attend ta review.

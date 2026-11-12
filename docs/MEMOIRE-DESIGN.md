# Mémoire design BOUSE — ce que l'utilisateur a appris et décidé

Fichier vivant : chaque passe y ajoute les préférences confirmées par l'utilisateur. À lire avant toute modification visuelle. Les règles détaillées restent dans `AGENTS.md` et `docs/DESIGN.md` ; ce fichier garde **le pourquoi** et les erreurs à ne pas répéter.

## Ce qu'il aime (à protéger)

- **L'accueil B** (V4) : richesse « professionnelle », cartes en relief, un panneau qui montre le vrai plan de la séance plutôt qu'un anneau isolé.

- **La vague filaire** de `src/components/Terrain.tsx` : signature du produit. Ne jamais la remplacer (montagne, photo, image générée). On peut retravailler sa lumière, son opacité et un très léger reflet coloré, pas sa géométrie.
- **Le « B » argenté** en rubans (`src/components/BrandLogo.tsx`, passe 32) et « BOUSE » en capitales espacées.
- **Le bouton principal blanc argenté** ; jamais de bouton violet.
- **La sensation de la référence « dashboard » (EduMe)** : profondeur, cartes riches, ergonomie, petites touches de couleur, courbes dégradées. Sa _qualité de composition_, pas ses objets.
- **Le noir profond et l'argent** de la référence d'origine.

## Ce qu'il rejette

- Les maquettes générées **trop saturées, néon, « gaming »** : violet et cyan lumineux, lueurs partout, cartes colorées, menus brillants.
- Les objets fictifs des maquettes : montagne, pièces, trophées, XP, séries, faux pourcentages.
- **Qu'on retire ce qui existe** pour coller à une image : « garde ce qui existe, améliore la couleur et la finition ».
- Les grands titres éditoriaux qui mangent l'écran et les micro-textes illisibles.

## Couleur (état au 6 novembre 2026, brief V4 — système adopté)

- Rendu perçu **94 à 97 % neutre** (noir, anthracite, argent, blanc cassé).
- **Une seule couleur dominante discrète par bloc**, sur une information à la fois : courbe active, étape en cours, point sélectionné, progression.
- Teintes désaturées **adoptées** (choix de l'accueil B) : lavande `#9A8AB7`, bleu glacier gris `#839CAF`, vert d'eau `#7FA69C` ; lueurs × 0,15, voiles × 0,55 (`--glow-k`, `--wash-k` dans `tokens.css`). Le violet `#A78BFA` et la lueur `0 0 22px` à 45 % de la passe 32 sont **jugés trop vifs**.
- Les graphiques doivent rester lisibles en niveaux de gris (pointillé/plein, épaisseur, libellés).

## Méthode de travail qu'il attend

1. **Comparer côte à côte** les captures réelles avec ses images avant de livrer, et dire honnêtement les écarts.
2. **Travailler par jalons** : audit, système visuel, **3 variantes réelles** sur le vrai produit, puis **attendre sa validation** avant de propager.
3. Captures avant/après desktop et mobile à chaque jalon ; ne jamais déclarer la DA « validée » sans son retour.
4. Ses images de référence sont des **inspirations**, pas des spécifications. En cas de doute, préserver et demander.
5. **Parler français**, simplement ; il suit souvent depuis son téléphone.
6. Ranger les apprentissages : ici, dans `CLAUDE.md`, et dans son Cerveau (coffre de notes sur son Mac) via une session qui y a accès.

## Historique des décisions

| Date            | Décision                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Passe 26        | Fusion des deux références : cartes en relief, bouton argent, anneaux.                                                                                                                                                                                                                                                                                                                                                                                 |
| Passe 31 (V3.2) | Petits accents désaturés autorisés (lavande). Jugé trop timide et trop éloigné des images.                                                                                                                                                                                                                                                                                                                                                             |
| Passe 32        | Planche 03 retenue (composition, logo B). Une montagne générée a remplacé la vague → refusé, vague rétablie. Accents violet/bleu/émeraude lumineux.                                                                                                                                                                                                                                                                                                    |
| V4              | Recentrage : sobre, premium, 94–97 % neutre ; violets trop vifs à apaiser ; vague et fonctions intouchables ; jalons avec validation.                                                                                                                                                                                                                                                                                                                  |
| V4 jalons A–C   | Proposé : palette apaisée, Inter affiné (Manrope écarté : titres plus larges sans gain), trois accueils A/B/C.                                                                                                                                                                                                                                                                                                                                         |
| 6 nov. 2026     | **Choix de l'utilisateur : accueil B « riche et professionnel »** (panneau « Votre séance » avec le plan réel), avec palette apaisée et Inter affiné, devenus le système par défaut. A (épurée) et C (proche de la référence) non retenues.                                                                                                                                                                                                            |
| 6 nov., soir    | **Correction de l'utilisateur** : la palette « apaisée » est trop grise. Il veut se rapprocher **au maximum, pour les couleurs et la lumière, de ses planches** (« Pack review V2 » et « Direction artistique cible ») : violet `#9B87F5`, cyan `#56C4E8`, vert `#5ECD96`, lueurs douces (× 0,6), vague argentée éclairée de violet puis cyan sur la crête. **Sans** reprendre leurs objets (montagne, etc.) ni changer la structure ou les fonctions. |
| 11 nov. 2026    | **Didacticiel** : maquette posée sur la vraie appli **validée** (« Oui, construis-le ») ; l’utilisateur veut en plus que **chaque onglet soit expliqué** (« ils sont compliqués à utiliser ») → bouton « Me montrer » par espace. Toujours montrer une maquette avant de construire.                                                                                                                                                                   |
| 11 nov. 2026    | **Arbre des compétences** (idée 7) : l’ancienne carte était illisible (« les fils se croisent »). Maquette d’un arbre par branches, grand, zoomable, ouvert avec une animation **validée** (« Oui, construis-le ») puis construite telle quelle. Aucun trait ne doit croiser un autre dans une branche.                                                                                                                                      |
| 11 nov. 2026    | **Catalogue des compétences** (idées 13 et 15) : tous les domaines, du débutant total à l’expert, même les gestes pratiques. Maquette montrée, puis « Fait le catalogue » et « Fait tout dans l’ordre sens demander ». Construit tel que la maquette : choix des domaines (au début et dans l’Académie), page d’un domaine par niveaux, fiche d’une compétence, arbre des domaines choisis (« Bientôt » en pointillés). |
| 11 nov. 2026    | **Téléphone simplifié** : maquette avant/après posée sur la vraie appli, construite dans l’ordre demandé. Sur téléphone, l’accueil commence par l’essentiel et replie le suivi (« Voir tout mon suivi ») ; l’aide de page tient en une phrase (« La suite ») ; textes ≥ 12 px, cibles ≥ 44 px. Rien de retiré. |
| 12 nov. 2026    | **Compétences courtes** : les 125 compétences « bientôt » écrites au format de la maquette (idée, modèle à remplir, trois questions) ; elles se valident dans l’arbre. Contenus à relire par l’utilisateur. |
| 12 nov. 2026    | **Missions réelles** (idée 14) : maquette montrée puis « Go ». Quatre projets de vie, des missions courtes, un dossier clair qui se remplit en direct, téléchargeable ; les compétences utilisées sont « mises en pratique ». Contenus à relire par l’utilisateur. |
| 12 nov. 2026    | **Nouvelle barre** (idée 12) : vidéo de référence de l’utilisateur (« Vertix »), maquette à trois variantes ; **choix : B, rail d’icônes** en gélules flottantes, pastille argentée qui glisse, nom en bulle au survol, page qui apparaît en douceur ; barre du bas flottante sur téléphone. Il ne voyait pas les nouveautés dans l’appli installée → bouton « Mettre à jour maintenant ». |

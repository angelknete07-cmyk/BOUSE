# Mémoire design BOUSE — ce que l'utilisateur a appris et décidé

Fichier vivant : chaque passe y ajoute les préférences confirmées par l'utilisateur. À lire avant toute modification visuelle. Les règles détaillées restent dans `AGENTS.md` et `docs/DESIGN.md` ; ce fichier garde **le pourquoi** et les erreurs à ne pas répéter.

## Ce qu'il aime (à protéger)

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

## Couleur (état au 6 novembre 2026, brief V4)

- Rendu perçu **94 à 97 % neutre** (noir, anthracite, argent, blanc cassé).
- **Une seule couleur dominante discrète par bloc**, sur une information à la fois : courbe active, étape en cours, point sélectionné, progression.
- Teintes désaturées à tester : lavande `#9A8AB7`, bleu glacier gris `#839CAF`, vert d'eau `#7FA69C`. Le violet `#A78BFA` et la lueur `0 0 22px` à 45 % de la passe 32 sont **jugés trop vifs**.
- Les graphiques doivent rester lisibles en niveaux de gris (pointillé/plein, épaisseur, libellés).

## Méthode de travail qu'il attend

1. **Comparer côte à côte** les captures réelles avec ses images avant de livrer, et dire honnêtement les écarts.
2. **Travailler par jalons** : audit, système visuel, **3 variantes réelles** sur le vrai produit, puis **attendre sa validation** avant de propager.
3. Captures avant/après desktop et mobile à chaque jalon ; ne jamais déclarer la DA « validée » sans son retour.
4. Ses images de référence sont des **inspirations**, pas des spécifications. En cas de doute, préserver et demander.
5. **Parler français**, simplement ; il suit souvent depuis son téléphone.
6. Ranger les apprentissages : ici, dans `CLAUDE.md`, et dans son Cerveau (coffre de notes sur son Mac) via une session qui y a accès.

## Historique des décisions

| Date            | Décision                                                                                                                                            |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Passe 26        | Fusion des deux références : cartes en relief, bouton argent, anneaux.                                                                              |
| Passe 31 (V3.2) | Petits accents désaturés autorisés (lavande). Jugé trop timide et trop éloigné des images.                                                          |
| Passe 32        | Planche 03 retenue (composition, logo B). Une montagne générée a remplacé la vague → refusé, vague rétablie. Accents violet/bleu/émeraude lumineux. |
| V4              | Recentrage : sobre, premium, 94–97 % neutre ; violets trop vifs à apaiser ; vague et fonctions intouchables ; jalons avec validation.               |

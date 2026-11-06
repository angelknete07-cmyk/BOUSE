# BOUSE V4 — Jalon C : trois variantes réelles de l'accueil

**6 novembre 2026. Choix de l'utilisateur : B.** B, la palette apaisée et l'Inter affiné sont devenus la version par défaut ; les variantes A et C ont été retirées du code (captures conservées ici pour mémoire, et les adresses `?da=…` ne fonctionnent plus).

Suite de [V4_INVENTORY.md](V4_INVENTORY.md) (jalon A) et [V4_STYLE_SAMPLES.md](V4_STYLE_SAMPLES.md) (jalon B).

## Comment les voir

Sur le vrai produit, avec le même profil de démonstration et les mêmes chiffres :

| Variante                           | Adresse (serveur de dev)                 |
| ---------------------------------- | ---------------------------------------- |
| Actuelle (passe 32, inchangée)      | `http://127.0.0.1:5173/#home`            |
| **A — épurée**                     | `http://127.0.0.1:5173/?da=a#home`       |
| **B — riche et professionnelle**   | `http://127.0.0.1:5173/?da=b#home`       |
| **C — proche de la référence**     | `http://127.0.0.1:5173/?da=c#home`       |

Chaque variante prend d'office le système recommandé au jalon B (palette apaisée + Inter affiné) ; on peut le forcer autrement, par exemple `?da=c&type=manrope`. **Sans paramètre, le site est identique au pixel près** (vérifié sur 9 pages × 2 formats).

## Ce que les trois ont en commun

- **Même vague `Terrain.tsx`** (empreinte SHA-256 `2c0c2a6c…` inchangée) ; seuls son cadrage et, en B et C, un reflet lavande très léger (calque CSS en mode « color », alpha ≤ 0,4 sur une zone floue) changent.
- **Mêmes fonctions et mêmes données** : reprise de leçon, rappels, progression, 4 chiffres, parcours, activité, objectifs, domaines, trajectoire. Aucun chiffre inventé.
- **Une couleur par bloc** : anneau et barre de progression en lavande pleine (plus de dégradé violet → bleu), pastille « Reprendre le fil » et puits d'icônes neutres, étape en cours du parcours en lavande, étapes terminées en argent avec coche.
- **Tablette (768 px)** : la carte de leçon garde toute la largeur (632 px au lieu de 394) ; titre sur 2 lignes au lieu de 3 ; bouton sur une ligne ; la progression passe en bandeau dessous.
- **Téléphone** : la vague reste en tête de carte mais en bande de 150 px (au lieu de 210) ; le titre chevauche son fondu. Le bouton « Continuer la leçon » remonte :

| Format   | Actuel                         | A      | B      | C      |
| -------- | ------------------------------ | ------ | ------ | ------ |
| 320×700  | 686 px (**caché par le dock**) | 486 px | 486 px | 502 px |
| 390×844  | 602 px                         | 439 px | 439 px | 455 px |

  Pour y arriver, deux informations secondaires sont **repliées sur mobile** (pas supprimées du produit) : « Dernière notion validée » et la phrase « Votre séance de 20 min… ». En B, cette phrase devient le panneau « Votre séance ».
- **En-tête mobile** : le titre de page tient sur une ligne ; sous 360 px, l'indicateur devient « Local » (libellé complet conservé pour les lecteurs d'écran).

## Les trois directions

| | **A — épurée** | **B — riche et professionnelle** | **C — proche de la référence** |
|---|---|---|---|
| Idée | La sobriété actuelle, affinée : moins de boîtes, plus d'air | La richesse de la référence EduMe, presque monochrome | La planche 03 / référence, avec des couleurs atténuées |
| Carte de leçon | Pleine largeur, vague plus grande, titre sur une ligne | 2/3 de largeur, reflet lavande discret | Comme aujourd'hui, reflet lavande + glacier plus visible |
| Progression | Petit anneau en tête d'une **bande unique** qui regroupe les 4 chiffres (séparateurs fins, icônes sans fond) | **Panneau « Votre séance »** : anneau + « 3 / 43 notions validées », puis le plan réel de la séance (rappels → leçon en cours → leçon suivante), chaque ligne cliquable | Colonne « Ma progression » comme la passe 32, plus étroite (260 px) |
| Chiffres | Bande unique | 4 tuiles en relief, icônes neutres | 4 tuiles, une seule teinte (Révisions, l'action à faire) ; sur mobile, tuiles en lignes comme la maquette téléphone |
| Profondeur | Faible, filet lumineux en haut | Plus marquée (ombre portée, filet) | Celle de la passe 32 |
| Corrige A1 (colonne vide) | Oui (supprime la colonne, garde l'anneau) | Oui (la colonne devient utile) | Partiellement (colonne plus étroite, toujours peu remplie) |

## Captures (toutes réelles, même machine, même profil)

- Comparaisons côte à côte (actuel · A · B · C) dans [`v4/jalon-c/comparaisons/`](v4/jalon-c/comparaisons/) : [1440×900](v4/jalon-c/comparaisons/accueil-1440x900.png), [1440×900 en niveaux de gris](v4/jalon-c/comparaisons/accueil-1440x900-niveaux-de-gris.png), [1440×1000](v4/jalon-c/comparaisons/accueil-1440x1000.png), [page entière bureau](v4/jalon-c/comparaisons/accueil-1440x900-page-entiere.png), [768×1024](v4/jalon-c/comparaisons/accueil-768x1024.png), [390×844](v4/jalon-c/comparaisons/accueil-390x844.png), [page entière mobile](v4/jalon-c/comparaisons/accueil-390x844-page-entiere.png), [320×700](v4/jalon-c/comparaisons/accueil-320x700.png), [Pixel 7](v4/jalon-c/comparaisons/accueil-pixel7.png), [face aux deux références](v4/jalon-c/comparaisons/references-face-a-B-et-C.png).
- Captures brutes : `v4/jalon-c/{actuel,a,b,c}/{1440x900,1440x1000,768x1024,390x844,320x700,pixel7}/home.png` (+ pages entières 1440×900 et 390×844).
- Les captures « actuel » de ce dossier sont faites sur le Mac ; celles de `v4/avant/` venaient du cloud (rendu des polices légèrement différent).

## Bilan honnête des écarts

**Vérifié par l'agent**

- Rendu par défaut inchangé : 0 pixel de différence sur 18 captures comparées à une copie du code d'avant.
- Aucun débordement horizontal à 320 px sur 13 pages × 4 versions (défaut, A, B, C) après deux corrections de grille (`styles.css` Préférences, `fusion.css` Académie : `1fr` → `minmax(0, 1fr)`).
- `npm test` 249 cas, `npx playwright test` 86 tests passés, `npm run build`, Prettier : OK.

**Points encore imparfaits**

1. **C** garde la colonne de progression peu remplie (A1 seulement atténué) : c'est le prix de la fidélité à la référence.
2. **A** rend la carte de leçon très large à 1440 px : le texte n'occupe que 40 % de la carte, à droite la vague seule.
3. **B** répète un peu l'information « rappels » (panneau + tuile Révisions).
4. Mobile : « Dernière notion validée » n'est plus visible sur l'accueil (repliée) ; à confirmer.
5. Les autres pages (Lab, Atelier IA, scènes…) gardent les accents vifs tant qu'aucune direction n'est choisie : ce sera le jalon D, **après** ton choix.
6. Pas de test sur un vrai téléphone, ni avec des débutants. **Aucune validation externe : la DA n'est pas déclarée validée.**

## La question

Quelle direction pour l'accueil : **A**, **B**, **C**, ou un mélange (par exemple « la carte de A + le panneau séance de B ») ? Les jetons du jalon B (palette apaisée, Inter affiné) sont-ils à garder ?

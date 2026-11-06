# Passe 16 : finition artistique des cinq écrans prioritaires

Le 5 novembre 2026, une review design externe a indiqué que la **direction artistique n'était pas encore validée**. Elle a demandé une passe de finition ciblée, **sans nouvelle fonctionnalité**, sur cinq écrans, et des comparaisons avant/après en desktop et en mobile. Cette passe y répond. Elle ne vaut pas validation : une nouvelle review externe reste nécessaire.

Avant : archive `2026-11-05_12-59-57-Europe-Paris` (passe 15). Après : archive `2026-11-05_15-34-40-Europe-Paris`.

## Comparaisons avant/après

Chaque image place l'avant (passe 15) à gauche et l'après (passe 16) à droite.

| Écran                         | Desktop                                          | Mobile                                          |
| ----------------------------- | ------------------------------------------------ | ----------------------------------------------- |
| 1. Accueil                    | [Comparer](compare-16/01-accueil-desktop.png)    | [Comparer](compare-16/01-accueil-mobile.png)    |
| 2. Académie (atlas)           | [Comparer](compare-16/02-academie-desktop.png)   | [Comparer](compare-16/02-academie-mobile.png)   |
| 3. Atelier IA (après analyse) | [Comparer](compare-16/03-atelier-ia-desktop.png) | [Comparer](compare-16/03-atelier-ia-mobile.png) |
| 4. Leçon (séquence concept)   | [Comparer](compare-16/04-lecon-desktop.png)      | [Comparer](compare-16/04-lecon-mobile.png)      |
| 5. Leçon budget (cas signalé) | [Comparer](compare-16/05-budget-desktop.png)     | [Comparer](compare-16/05-budget-mobile.png)     |

## Réponse point par point

### 1. Accueil : les quatre territoires

- **Composition asymétrique.** Grille de 12 colonnes : Finance et Finance personnelle sur 7 colonnes, IA et Investissement sur 5. Les deux rangées se croisent au lieu de former un damier.
- **Matière et relief.** Chaque territoire devient un folio : bord fin, éclairage radial venu du haut, courbes de niveau très discrètes reprenant la vague de l'accueil, grain léger. Au survol, le folio monte de 2 px et la courbe Finance se redessine.
- **Variation.** Grand numéro fantôme (01 à 04) à 5 % d'opacité, au niveau du titre. Une barre de repères (un trait par leçon, plein quand le quiz est validé) remplace la seule fraction. Le compteur « 0 / 2 repères » passe en texte lisible.
- **Sans couleur ajoutée.** Tout reste en blanc, gris et argent. La vague topographique et le module principal sont inchangés.
- **Mobile.** Les numéros fantômes sont masqués : sur 86 % de largeur ils passaient derrière le titre.

### 2. Académie : un atlas plus immersif

- **Scène.** L'atlas est posé sur une surface avec bord et lumière. Cinq bandes de domaines, avec des limites calculées à mi-distance des rangées et une bande sur deux à peine éclairée. Le nom du domaine est en haut à gauche de sa bande, sous l'en-tête des colonnes et non plus dessus.
- **Hiérarchie.** La taille du cercle suit le niveau de la notion (40, 46, 52 px ; 58 px pour la notion choisie, avec un halo).
- **États.** Validée : cercle plein. Accessible : anneau argent. Prérequis à faire : anneau pointillé.
- **Chemin choisi.** La notion choisie, ses prérequis et ses suites forment le chemin, avec des liens argent de 1,6 px. Les autres liens et cercles s'atténuent, mais les **libellés restent lisibles** : un premier rendu les atténuait à 42 % d'opacité, ce qui les rendait illisibles. Corrigé : seul le cercle est atténué et le texte passe en gris secondaire.
- **Légende.** La phrase « Une ligne relie une notion à son prérequis » devient une légende des cinq états.

### 3. Atelier IA : un instrument d'un seul tenant

- **Châssis.** L'écriture et l'analyse forment un seul instrument (bord, ombre de scène, séparation verticale), au lieu de deux blocs posés côte à côte.
- **Saisie.** Texte plus grand et filet argent. Une jauge de sept traits sous le texte indique « 6 / 7 repères dans le texte » pendant la saisie. C'est le même calcul que la constellation, rendu visible là où l'on écrit, pas une nouvelle analyse.
- **Analyse.** Le cœur grandit (140 px) avec un halo. Les points des repères passent à 28 px. Les rayons aboutissent maintenant au point : un premier rendu les faisait finir au centre du bouton, donc sur le libellé. Le rayon du repère du haut s'arrête sous son libellé au lieu de le traverser. La lecture du repère choisi est séparée par un filet.
- **Comparaison.** L'original et la trame sont deux panneaux ; la trame est légèrement surélevée et porte un filet argent.

### 4. Leçons : équilibre et métadonnées

- **Métadonnées agrandies.** Domaine, niveau et durée passent de 11 à 13 px, avec niveau et durée en blanc. L'indicateur « SÉQUENCE 01 / 07 » passe de 11 à 12 px, en gris secondaire. Les libellés des graphiques des scènes passent d'environ 9 px rendus à environ 12 px.
- **Titres.** Le vocabulaire du concept est réduit (de 2,7 rem à 2,1 rem au maximum sur desktop, 1,5 rem sur mobile) pour rendre de la place à l'explication, qui passe de 13 à 16 px.
- **Scènes.** Le simulateur est posé sur un établi : bord, ombre, marges intérieures plus larges.
- **Chiffres.** « 8,33 % » et « 61,11 % » deviennent « 8,3 % » et « 61,1 % », avec une espace insécable : le « % » ne passe plus seul à la ligne.
- **Doublon retiré sur mobile.** « / FINANCE PERSONNELLE » sous le numéro de chapitre se coupait mot à mot et répétait la ligne du dessus.

### 5. Mobile : panneaux fixes et actions flottantes

- **Cas signalé.** Sur la leçon budget, la barre flottante « Séquence suivante » couvrait la barre du budget et les curseurs. Elle est désormais placée **après le contenu**, sans position fixe. La comparaison 5 montre la scène entière visible au-dessus du dock.
- **Contrôle général.** Les autres barres d'action fixes (atelier projet, plan, simulation) sont conservées : ce sont des formulaires où l'action doit rester à portée. `scroll-padding-bottom` (150 px plus la zone sûre) empêche un champ qui reçoit le focus de finir sous le dock ou sous une barre.

### 6. Identité commune

Les nouveaux matériaux sont des tokens partagés (`--matter-grain`, `--matter-contour`, `--line-silver`, `--glow-ring` dans `src/tokens.css`), appliqués par une seule feuille `src/finish.css`, chargée en dernier. Aucune nouvelle couleur, aucune nouvelle carte. Le mouvement ajouté (survol des folios, courbe redessinée) est coupé par la règle globale `prefers-reduced-motion`.

## Vérifications internes

- `npm test` : 189 cas réussis.
- `npx playwright test` : 70 tests réussis, desktop 1440 × 1000 et Pixel 7 émulé ; aucun sélecteur cassé.
- `npm run build` sans avertissement. Bundle principal : 392,21 kB.
- 159 captures fraîches, paire principale sur l'accueil (`00-home-viewport`).
- Inspection des rendus avant enregistrement : quatre défauts vus et corrigés.
  - Numéros fantômes sur le compteur.
  - Libellés de l'atlas illisibles.
  - Rayon traversant le libellé « Objectif ».
  - Grille du concept appliquée au mobile, qui écrasait la scène budget en deux colonnes.

## Limites

- Pas d'appareil physique, ni Safari, ni Firefox, ni lecteur d'écran réel.
- Le survol et l'animation de la courbe n'apparaissent pas sur une capture fixe.
- **Direction artistique non validée** : cette passe attend une nouvelle review design externe.

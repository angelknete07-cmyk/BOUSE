# BOUSE V4 — Jalon B : système visuel (essais comparés)

**6 novembre 2026.** Suite de [V4_INVENTORY.md](V4_INVENTORY.md). **Rien n'est appliqué par défaut** : chaque essai s'active par l'adresse et le site publié reste identique tant que l'utilisateur n'a pas choisi.

## 1. Ce qui a changé dans le code

| Changement                                                                                                                                                           | Fichiers                                       | Effet visible par défaut                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------- |
| **Source unique des accents** : chaque accent est défini par ses canaux RGB (`--accent-violet-rgb`…) ; deux coefficients règlent toutes les lueurs (`--glow-k`) et tous les voiles teintés (`--wash-k`). Les 21 couleurs écrites en dur de `console.css` utilisent désormais ces jetons. | `src/tokens.css`, `src/console.css`            | **Aucun** (0 pixel de différence, voir § 4)  |
| Palette d'essai `?palette=apaisee`                                                                                                                                   | `src/tokens.css`                               | Aucun sans le paramètre                      |
| Essais typographiques `?type=manrope` et `?type=affine`                                                                                                              | `src/tokens.css`, `public/fonts/` (Manrope OFL) | Aucun sans le paramètre                      |
| Lecture des essais dans l'adresse (`?palette`, `?type`, `?da`), valeurs inconnues ignorées                                                                           | `src/lib/designPreview.ts`, `src/main.tsx`, test `tests/designPreview.test.ts` | Aucun                                        |
| **Page de contrôle interne** `#labo-design` : boutons, champs, icônes, graphique, anneaux, vague, tableau des jetons avec contrastes calculés en direct              | `src/components/StyleLab.tsx`, `src/App.tsx`   | **Absente du site publié** (chargée seulement en développement ; vérifié : 0 occurrence dans `dist/`) |
| **Correction S1** : la page Préférences ne déborde plus à 320 px (`minmax(0, 1fr)`)                                                                                  | `src/styles.css`                               | Oui, 320 px seulement : largeur de page 353 → 320 px |

Pas de nouvelle feuille « v4-overrides » : les essais vivent dans `tokens.css`, à côté des valeurs qu'ils remplacent.

## 2. Couleurs : passe 32 contre palette apaisée

| Rôle      | Passe 32 (défaut)   | Apaisée V4                | Lueurs (`--glow-k`) | Voiles (`--wash-k`) |
| --------- | ------------------- | ------------------------- | ------------------- | ------------------- |
| Accent 1  | `#A78BFA` (sat. 92 %) | lavande `#9A8AB7` (24 %) | × 1 → **× 0,15** (halo max 0,13) | × 1 → **× 0,55** (aires ≤ 8 %) |
| Accent 2  | `#6BA6F2` (84 %)    | glacier `#839CAF` (22 %)  | idem                | idem                |
| Accent 3  | `#3FCB9B` (57 %)    | vert d'eau `#7FA69C` (18 %) | idem              | idem                |

Contrastes (fond / carte) : lavande 6,5 / 5,9:1, glacier 7,1 / 6,4:1, vert d'eau 7,6 / 6,9:1 — tous AA.

**Constat sur captures réelles** ([palettes-bureau-1440x900.png](v4/jalon-b/palettes-bureau-1440x900.png), [palettes-mobile-390x844.png](v4/jalon-b/palettes-mobile-390x844.png), [palettes-gros-plan.png](v4/jalon-b/palettes-gros-plan.png)) :

- Accueil : l'arc de l'anneau, la pastille « Reprendre le fil » et les 3 puits d'icônes deviennent quasi neutres ; la vague et le bouton argent dominent enfin.
- Lab et « Et si ? » : la courbe reste repérable (trait plein contre pointillé), sans halo ; l'aire sous la courbe devient un voile.
- Scène « Risque » : l'aplat violet passe en lavande grisée. **Reste un aplat** : le remplacer par un trait relève du jalon D (scènes).
- Anneau vert d'eau (« acquis ») : lisible mais discret.

**Recommandation : palette apaisée.** Elle respecte la règle 94–97 % neutre sans perdre l'information. Les trois teintes restent définies, mais le jalon C n'en montre **qu'une par bloc**.

## 3. Typographie : trois essais sur quatre vrais écrans

Écrans : accueil (dense), leçon (lecture), Préférences (formulaire), Lab (chiffres), en 1440 × 900 et 390 × 844, avec la palette apaisée.

| Essai              | Ce qui change                                                                                                                         | Constat                                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A — Inter actuel   | —                                                                                                                                     | Propre, mais métadonnées et axes en 8–11 px.                                                                                                                 |
| B — Titres Manrope | Titres et chiffres en Manrope (OFL, fichier local 24 ko), lecture en Inter                                                            | Lettres plus larges : le titre de l'accueil mobile passe sur 2 lignes, « Marge sur coûts variables » aussi en leçon. Aucun gain de lecture, une famille de plus. **Écarté.** |
| C — Inter affiné   | Plancher 12 px pour les textes utiles (11 px pour les axes), corps 15 px, interlignes 1,6 / 1,75, approche un peu moins serrée | Méta, axes et légendes deviennent lisibles ; aucune casse de mise en page vue sur les 8 captures ; le bouton de reprise mobile descend de ~6 px.             |

Planches : [typo-home](v4/jalon-b/typo-home-1440x900.png), [typo-leçon](v4/jalon-b/typo-lesson_ca_marge_tresorerie-1440x900.png), [typo-préférences](v4/jalon-b/typo-settings-1440x900.png), [typo-lab](v4/jalon-b/typo-lab-1440x900.png), [mobile accueil/leçon](v4/jalon-b/typo-mobile-accueil-lecon.png), [mobile préférences/lab](v4/jalon-b/typo-mobile-preferences-lab.png). Ordre dans chaque planche : Inter actuel, Inter affiné, Manrope.

**Recommandation : C, Inter affiné.** Conforme au brief : « ne pas changer la police juste pour changer ».

## 4. Preuve de non-régression

- **Rendu par défaut identique au pixel près** : 8 écrans (accueil, Lab, Atelier IA, Scénarios, Compétences, leçon 01, Préférences, Révisions) × 2 formats (1440 × 900, 390 × 844), comparés à une copie du code d'avant (commit `d574809`) lancée sur le même Mac : **0 pixel différent** sur les 16 paires. (La correction S1 n'affecte que 320 px.)
- `Terrain.tsx` et `BrandLogo.tsx` : empreintes SHA-256 inchangées.
- `npm test` : 248 cas (245 + 3 nouveaux), 0 échec. `npm run build` sans avertissement. Prettier OK.
- `npx playwright test` : 86 tests passés (lancés au jalon C, après toutes les modifications).

## 5. Page de contrôle

En développement : `http://127.0.0.1:5173/#labo-design`, avec des boutons pour basculer palette et typographie ; le tableau recalcule les contrastes des jetons réels. Capture des 4 combinaisons : [labo-de-style-4-essais.png](v4/jalon-b/labo-de-style-4-essais.png).

## 6. Écarts restants et limites

- Les accents de la passe 31 dans `fusion.css` (`rgb(155 138 203 / …)`, 2 occurrences) ne suivent pas encore les jetons : déjà désaturés, laissés tels quels pour garder le défaut identique.
- `--ink-faint` (3,0:1) n'est pas encore corrigé : à traiter avec le choix typographique.
- Aplat de la scène « Risque », 7 pastilles de l'Atelier IA, score « 100 / 100 » : jalon D.
- Aucune validation externe : **ces recommandations attendent l'avis de l'utilisateur.**

# Review design — passe 09 : typographie Inter

**3 novembre 2026, 20:49 Europe/Paris.** Correction après le retour « J’aime pas la police ». Vérification interne effectuée ; **review design externe attendue**.

## Correction

L’audit a identifié des titres Manrope fins et très serrés, ainsi qu’une référence à Inter sans police Inter chargée pour le texte courant.

- Inter variable remplace Manrope et la police de secours du texte courant. Fichier auto-hébergé, préchargement, taille optique automatique et licence OFL dans le dépôt.
- Titres principaux à 600, sections à 550, grands nombres à 450, lecture à 400. Les rôles et les approches sont centralisés dans `src/tokens.css`.
- Espacement des lettres moins comprimé : −0,035 em pour les grands titres, −0,025 em pour les sections, au lieu d’approches allant jusqu’à −0,07 em.
- Application à l’accueil, AI Lab, Academy, aux leçons/quiz et au Lab financier, avec propagation de la famille aux composants communs. Composition, palette, monogramme et logique métier conservés.

## Comparaison avant / après

| Écran         | Avant desktop                                                                                  | Avant mobile                                                                                  | Après desktop                                         | Après mobile                                         |
| ------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| Accueil       | [Voir](../2026-11-03_15-29-31-Europe-Paris/screens/desktop/00-home-viewport.png)          | [Voir](../2026-11-03_15-29-31-Europe-Paris/screens/mobile/00-home-viewport.png)          | [Voir](screens/desktop/00-home-viewport.png)          | [Voir](screens/mobile/00-home-viewport.png)          |
| AI Lab        | [Voir](../2026-11-03_15-29-31-Europe-Paris/screens/desktop/06-ai-structure-viewport.png)  | [Voir](../2026-11-03_15-29-31-Europe-Paris/screens/mobile/06-ai-structure-viewport.png)  | [Voir](screens/desktop/06-ai-structure-viewport.png)  | [Voir](screens/mobile/06-ai-structure-viewport.png)  |
| Academy       | [Voir](../2026-11-03_15-29-31-Europe-Paris/screens/desktop/02-academy-viewport.png)       | [Voir](../2026-11-03_15-29-31-Europe-Paris/screens/mobile/02-academy-viewport.png)       | [Voir](screens/desktop/02-academy-viewport.png)       | [Voir](screens/mobile/02-academy-viewport.png)       |
| Leçon         | [Voir](../2026-11-03_15-29-31-Europe-Paris/screens/desktop/03-lecon-learn-viewport.png)   | [Voir](../2026-11-03_15-29-31-Europe-Paris/screens/mobile/03-lecon-learn-viewport.png)   | [Voir](screens/desktop/03-lecon-learn-viewport.png)   | [Voir](screens/mobile/03-lecon-learn-viewport.png)   |
| Lab financier | [Voir](../2026-11-03_15-29-31-Europe-Paris/screens/desktop/05-lab-financier-viewport.png) | [Voir](../2026-11-03_15-29-31-Europe-Paris/screens/mobile/05-lab-financier-viewport.png) | [Voir](screens/desktop/05-lab-financier-viewport.png) | [Voir](screens/mobile/05-lab-financier-viewport.png) |

Paire stable : [latest-desktop.png](latest-desktop.png) et [latest-mobile.png](latest-mobile.png). Galerie complète : [desktop](screens/desktop/) et [mobile](screens/mobile/). Les rendus complets incluent les séquences de leçon, le teach-back, le quiz corrigé, la saisie et la comparaison de prompt, ainsi que les états du calculateur.

À l’inspection, les titres se détachent davantage des explications et les petits textes sont cohérents avec les contrôles. Les chiffres financiers restent distincts des titres par leur poids. Sur mobile, le titre d’accueil passe de deux à trois lignes ; l’action principale et la matière graphique restent dans le premier écran. La comparaison conserve les mêmes données de démonstration « Profil démo ».

## Vérifications

- Application réellement lancée dans Chromium. Inspection des cinq écrans sur desktop/mobile, du teach-back, du quiz corrigé et de l’onboarding desktop.
- `npm run build` : TypeScript et Vite réussis.
- `npx playwright test tests/design.spec.ts` : **8 tests réussis**, dont interactions, surfaces neutres, absence de débordement, motion et `prefers-reduced-motion`.
- **133 captures fraîches**, avec manifeste et archive. Desktop 1440 × 1000 ; mobile Pixel 7 émulé, 412 × 839 CSS px, DPR 2,625.
- Contrôle complémentaire des cinq routes à 320, 375, 768, 1024 et 1920 px : aucun débordement du document ni erreur JavaScript observés. Le défilement interne de l’atlas est volontaire.
- Le protocole Chromium confirme que les glyphes des titres et du texte de leçon utilisent effectivement la police Inter locale.

Les tests métier ne sont pas relancés pour cette correction de styles ; leurs résultats précédents restent documentés dans `docs/VALIDATION.md`. Vérification sur Chromium et mobile émulé, sans appareil physique ni Safari/Firefox.

Archive : `archive/2026-11-03_20-49-59-Europe-Paris/`. Reproduction : `npm run build`, `npx playwright test tests/design.spec.ts`, puis `node scripts/save-design-review.mjs --primary=00-home-viewport`. **Aucune nouvelle fonctionnalité ajoutée ; cette proposition typographique attend la review design.**

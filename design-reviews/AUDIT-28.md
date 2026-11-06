# Passe 28 : cinq simulateurs de plus et lexique repliable

Suite du plan (« Vz go », 6 novembre 2026). **La direction artistique n'est pas déclarée validée.**

## Cinq nouveaux simulateurs

Il y a désormais 21 leçons interactives sur 43, contre 16. Les moteurs sont dans `src/lib/lessonModels.ts` (4 nouveaux cas de test, 11 au total) et les scènes dans `src/components/LessonScenesMore.tsx`.

| Leçon                                  | Type                   | Ce que la scène fait comprendre                                                                                                                                                                          |
| -------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Obligations et taux                    | curseurs               | Le prix baisse quand les taux montent. Le moteur retrouve l'exemple de la leçon : 1 000 € à 2 %, 9 ans restants, marché à 4 %, prix d'environ 851 €. Plus l'échéance est lointaine, plus le prix réagit. |
| Construire un prévisionnel             | curseurs               | Trois scénarios (pessimiste −40 %, central, optimiste +30 %), dont le pessimiste négatif en alerte, et le nombre de clients nécessaire pour couvrir les charges fixes.                                   |
| Lire un compte de résultat et un bilan | opérations successives | Six opérations (apport, emprunt, machine, stock à crédit, vente, remboursement). Le bilan reste à l'équilibre, et chaque opération est expliquée.                                                        |
| Repérer une arnaque au placement       | jeu de tri             | Six messages à classer en « signal d'alerte » ou « pas un signal », avec explication immédiate et compte des signaux graves manqués.                                                                     |
| Évaluer et tester une IA               | jeu de tri             | Six réponses d'un assistant à juger « juste » ou « faux » face à la facture ; trois erreurs graves, donc pas d'automatisation sans relecture.                                                            |

## Lexique

- **Sur mobile :** chaque définition est repliée à deux lignes, avec « Lire la définition » (`aria-expanded`) et « Replier ».
- **Le terme ciblé depuis une leçon s'ouvre**, et **une recherche ou une liste de trois termes au plus ouvre tout** : chercher un terme, c'est vouloir le lire.
- **Sur desktop**, les définitions restent complètes.
- Mobile : 23 365 → 22 121 px. Le gain est modeste mais la lecture en diagonale est plus rapide. L'index alphabétique (passe 27) reste le principal raccourci.

## Défauts trouvés en cours de passe et corrigés

- Le test du lexique cliquait un lien masqué sur mobile. Plutôt que de modifier le test, la recherche ouvre désormais les définitions, ce qui améliore l'usage.
- Une fiche ouverte à la main ne pouvait plus se replier quand le bouton était masqué ; il ne l'est plus que pour les fiches ouvertes par une recherche.

## Contrôles

- `npm test` : 224 cas réussis.
- `npx playwright test` : 82 tests réussis, dont un nouveau test : bilan équilibré à 30 000 €, mauvaise réponse au jeu des arnaques expliquée, repli du lexique sur mobile.
- Build sans avertissement ; Prettier conforme ; aucun débordement ni erreur console sur les cinq scènes, desktop et mobile.

## Captures

- `simulateurs-28/` : les cinq scènes (desktop 1440 × 1000 à densité 2, Pixel 7) et le lexique mobile replié.
- Archive `2026-11-06_10-59-45-Europe-Paris`.

## Ce qui reste

- **Leçons sans scène :** 22 sur 43. Les leçons de concepts (LLM, prompt, agents) et une partie de la finance personnelle ont déjà une scène ; les prochaines utiles sont l'épargne de précaution, l'inflation, les crypto-actifs, la fiscalité des placements et la facturation.
- **Accueil :** la trajectoire reste dense avec 11 notions.
- **À valider par vous :** la review externe et un test avec de vrais utilisateurs.

# Passe 29 : une scène interactive dans chaque leçon

Demande de l'utilisateur, le 6 novembre 2026 : « Vz go fait tout ». Cette passe traite tous les points restants des audits 26 à 28. **La direction artistique n'est pas déclarée validée.**

## Les 43 leçons ont désormais une scène

Avant la passe 26, 11 leçons sur 43 avaient une scène. Il y en a maintenant 43 sur 43. Cette passe ajoute 22 scènes : 13 à curseurs, dont les moteurs sont testés (`src/lib/lessonModelsMore.ts`, 13 cas), et 9 jeux de tri (`src/components/LessonScenesExtra.tsx`).

| Domaine              | Scène chiffrée                                                                                                                                                          | Jeu de tri                                                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Finance personnelle  | Épargne de précaution (objectif, mois pour l'atteindre) ; inflation (pouvoir d'achat, salaire réel) ; épargne retraite (versé contre capital)                           | Fraude ou message bancaire normal ; assurances obligatoires ou facultatives                                        |
| Investissement       | Frais de 0,2 % contre 2 % ; rendement locatif brut puis net ; asymétrie des pertes (−50 % demande +100 %) ; gain après impôt, compte-titres contre PEA de plus de 5 ans | Action ou obligation ; biais ou décision raisonnée                                                                 |
| Entrepreneuriat      | Valeur client contre coût d'acquisition ; entonnoir de conversion ; prix HT, TVA, TTC ou franchise ; plan de financement                                                | Avant ou après l'immatriculation ; mentions obligatoires d'une facture                                             |
| Finance d'entreprise | Amortissement et délai de récupération ; tableau de bord en trois indicateurs avec alertes                                                                              | —                                                                                                                  |
| IA                   | —                                                                                                                                                                       | Ce qu'on peut coller dans un outil grand public ; bon ou mauvais premier pilote ; catégories de risque de l'AI Act |

**Faits utilisés :**

- **Fiscalité 2026** (sources concordantes, marquée « à vérifier ») : flat tax de 31,4 % sur un compte-titres ; prélèvements sociaux de 18,6 % sur un PEA de plus de cinq ans ; 17,2 % en assurance-vie, mentionnés sans calcul. Une source isolée conteste la hausse : d'où la mention « à vérifier ».
- **Jeux de tri :** uniquement des règles bien établies. Les cas ambigus ont été écartés, comme l'assurance emprunteur, non obligatoire légalement mais exigée en pratique.

## Trajectoire de l'accueil

Un domaine de plus de 7 notions affiche une fenêtre de 7 notions autour de la prochaine (`trackWindow`, testée), avec ses numéros réels et « Notions 1 à 7 sur 11 · voir toute la carte ».

## Défauts trouvés en cours de passe et corrigés

- « ? » orphelins en début de ligne dans 14 titres de scènes : espaces insécables.
- Deux erreurs dans mes scripts de capture (une scène sans chiffre principal, un clic sur une carte qui ouvrait une leçon). Aucune ne venait de l'application.
- Captures trop lourdes (56 Mo) : ramenées à 22 Mo.

## Contrôles

- `npm test` : 238 cas réussis.
- `npx playwright test` : 84 tests réussis, dont un nouveau test (prix TTC puis franchise, gain après impôt, jeu des assurances) et le parcours de toutes les leçons, qui ouvre maintenant 43 scènes sans erreur ni débordement.
- Build sans avertissement ; Prettier conforme.

## Captures

- `simulateurs-29/` : les 22 scènes (desktop 1440 × 1000, Pixel 7) et la trajectoire Investissement.
- Paire `latest-*` : accueil.
- Archive `2026-11-06_11-49-24-Europe-Paris`.

## Ce qui reste

- **Lexique mobile :** il reste long (22 121 px) malgré l'index et les fiches repliées. C'est inhérent à 165 termes.
- **Hors de ma portée dans cette session :**
  - Supabase et le mentor intégré (votre projet et votre clé) ;
  - tests sur appareil réel, Safari, Firefox et lecteur d'écran ;
  - fusion de la PR #1 (votre décision).
- **À valider par vous :** la review externe de la direction artistique, puis un test avec de vrais débutants.

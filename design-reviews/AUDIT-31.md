# Passe 31 — accents colorés subtils (brief V3.2)

Date : 6 novembre 2026. Base : branche `claude/bouse-development-resume-gktqqs` après la passe 30.

## Règle qui change

Le brief V3.2 fusionne la référence noire premium (01) et le dashboard aux petites couleurs (02). Il **modifie l’interdiction absolue des accents bleu, violet et cyan** des passes 08 à 30, sans autoriser de palette vive. La règle est écrite avant implémentation dans `AGENTS.md` (« Règle d’accent ») et `docs/DESIGN.md` (« Passe 31 — accents colorés subtils »).

- Jetons ajoutés à `src/tokens.css` : `--accent-lavender` `#9B8ACB` (+ `-strong`, `-dim`, `-wash` à 14 %), `--accent-glacier` `#79A6CD`, `--accent-teal` `#66B5AD`.
- Une seule couleur dominante par écran : la lavande. Glacier et teal sont réservés et **non employés** dans cette passe.
- Uniquement sur des marques fines porteuses d’information. Aucun aplat, bouton, carte, fond ni texte courant coloré.
- Les images 03 et 04 du brief ont servi d’inspiration d’ambiance, pas de spécification : aucune de leurs mises en page ni de leurs données n’a été reprise.

## Où la lavande apparaît

| Écran                  | Marque colorée                                                                                      | Reste neutre                                                                |
| ---------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Accueil                | barre « Votre parcours », anneau des compétences, courbe d’activité                                 | textes, cartes, bouton, icônes                                              |
| Académie               | pastille de l’étape « À faire maintenant » et son contour fin                                       | libellé « À faire maintenant » (corrigé : il était coloré au premier rendu) |
| Leçon                  | numéro de l’onglet actif, point de la séquence courante, série clé de la scène (barre, comparaison) | onglets, texte, panneaux                                                    |
| Lab financier          | droite du chiffre d’affaires                                                                        | coûts (pointillés), seuil, repères                                          |
| Et si ?                | courbe du scénario, point du mois choisi, trait de légende                                          | référence en pointillés gris                                                |
| Atelier IA             | points des éléments repérés dans le texte                                                           | schéma, compteurs                                                           |
| Compétences, Portfolio | barres et anneaux de progression                                                                    | carte complète                                                              |

Les états fonctionnels (succès vert après validation, avertissement, erreur) gardent leurs jetons. Une étape déjà validée reste marquée par la coche verte de succès.

## Corrections P0 / P1 de cette passe

| Priorité | Constat (avant)                                                                                                       | Correction                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| P0       | Leçon desktop : la question de départ ajoutée en passe 25 repoussait la scène sous le texte, dans une colonne étroite | Scène placée en regard de l’explication (colonne 2, collante) au-delà de 1100 px ; empilement inchangé en dessous |
| P1       | Accueil : progression exprimée seulement en « n / 43 notions »                                                        | Carte « Compétences acquises » (compétences des leçons validées sur 138, dernière acquise)                        |
| P1       | Accueil : aucune trace de l’activité réelle                                                                           | Carte « Activité sur 7 jours » tirée des quiz et révisions enregistrés, sans série à tenir ni culpabilisation     |
| P1       | Carte « Notions validées » en double de la barre de parcours                                                          | Retirée                                                                                                           |
| P1       | Académie : titre centré sur le catalogue                                                                              | « Que voulez-vous apprendre ? », l’inventaire passe en index                                                      |
| P1       | Et si ? : carte du graphique imbriquée dans le panneau (passe 26), titre collé au bord                                | Carte imbriquée retirée ; le panneau porte seul la matière                                                        |
| P1       | Et si ? : légende blanche, courbe lavande                                                                             | Trait de légende accordé à la courbe                                                                              |
| Doc      | README : « six leçons », « diagnostic de trois questions »                                                            | 43 leçons, cinq domaines, cinq questions, cinq parcours par objectif                                              |

## Non traité dans cette passe (après review)

Le brief demande de continuer P2/P3 seulement après review des premières compositions. Restent donc ouverts :

- **Quiz plus robustes** : banque de questions plus large par leçon et ordre des options varié (aujourd’hui deux questions liées à la version de la leçon).
- **Diversité des activités** : l’entraînement libre de la passe 30 existe, mais d’autres formats (remise en ordre, estimation chiffrée) ne sont pas encore systématiques.
- La barre « Votre parcours » de l’accueil affiche encore « 3 / 43 notions » ; elle pourrait passer au parcours par objectif actif lorsqu’il est choisi.
- Mobile : les cartes de statistiques s’empilent correctement ; la courbe d’activité reste petite sous 400 px.

## Captures

- Avant : `design-reviews/accents-31/avant/` ; après : `design-reviews/accents-31/apres/` (desktop 1440 × 1000, mobile Pixel 7 412 × 839, plus pages entières).
- Planches côte à côte : `design-reviews/accents-31/comparaisons/` (accueil, leçon, Académie, Lab, Et si ? en desktop ; accueil et leçon en mobile).
- Données de démonstration (profil « Camille »), aucune donnée réelle.

Note : sur les captures mobiles en page entière, le dock de navigation fixe apparaît au milieu de l’image ; c’est un artefact de capture, pas un défaut de mise en page.

## Proposition de test avec 3 à 5 débutants

Objectif : vérifier que la lavande guide sans distraire et que la progression en compétences est comprise.

1. Recruter 3 à 5 personnes sans formation en finance (étudiant, salarié qui pense créer, indépendant débutant).
2. Séance de 20 minutes, en partage d’écran, sur la production. Consigne unique : « Vous voulez savoir combien vendre pour couvrir vos charges. »
3. Observer sans aider : temps pour ouvrir la bonne leçon, usage de la scène, réussite du quiz.
4. Questions après coup : « Qu’est-ce qui vous dit où vous en êtes ? », « Qu’indique la couleur violette ? », « Reviendriez-vous demain, et pourquoi ? ».
5. Critères : au moins 4 sur 5 associent la lavande à « où j’en suis / ce que je manipule » ; aucun ne la prend pour un bouton ; la carte « Compétences acquises » est expliquée correctement.

## Statut

Vérifications faites par l’agent (rendus réels, tests) : voir `LATEST.md`. **La direction artistique n’est pas validée** et l’effet sur la rétention n’est pas mesuré : ils attendent la review externe et les tests utilisateurs ci-dessus.

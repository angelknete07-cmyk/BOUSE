# Passe 12 : audit DA complet, préférences, dette technique

Le 5 novembre 2026, l'utilisateur a demandé de vérifier toute la direction artistique, d'améliorer ce qui pouvait l'être (design et fonctionnalités existantes), de traiter les petites corrections et la dette technique, puis de poursuivre la feuille de route. Il a explicitement autorisé la suite **sans attendre la review design externe** des passes 10 et 11. Cette review reste due : rien ici ne la remplace.

## Audit des écrans non couverts par la passe 11

Écrans examinés sur desktop et mobile : onboarding, révisions (disponibles, rappel, révélé), compétences, projets (liste, terrain, décisions, bilan), Radar, préférences, quiz et séquences de leçon.

| Zone             | Constat                                                                                                                                                               | Correction                                                                                                                                                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Noms des notions | La même notion avait jusqu'à quatre noms courts : « Lire les chiffres » (atlas), « Les chiffres » (accueil), « Marge & trésorerie » (compétences).                    | Une seule source, `src/data/lessonLabels.ts`, utilisée par l'atlas, la trajectoire et la carte des compétences.                                                                                                                           |
| Révisions        | Le graphe des intervalles montait et descendait (24 h bas, 3 j haut, 7 j bas…) alors que les intervalles ne font qu'augmenter : la visualisation induisait en erreur. | Axe en jours (racine carrée pour garder les premiers libellés lisibles), un arc par intervalle, hauteur proportionnelle à l'écart.                                                                                                        |
| Révisions        | Anneau décoratif sombre sans information dans la carte principale.                                                                                                    | Retiré.                                                                                                                                                                                                                                   |
| Projets (liste)  | Fiche lourde : intertitres de 20 px, tous les textes en blanc ; les neuf étapes formaient une longue ligne de texte.                                                  | Libellés discrets, faits en texte secondaire sur deux colonnes, frise des neuf étapes avec l'étape courante nommée (`aria-current="step"`). Sur mobile, la frise garde les repères et la légende nomme l'étape.                           |
| Langue           | « INCUBATOR / L'atelier du projet » et « Business & AI Academy » sous le logo.                                                                                        | « Projets / L'atelier du projet », « Académie business & IA ». Les étapes « Business model » et « MVP » sont conservées : ce sont les termes que le cours doit enseigner, et ce sont des valeurs enregistrées.                            |
| Préférences      | Seuls le prénom et la durée étaient modifiables ; objectif et préférence étaient affichés en lecture seule, le niveau et les intérêts absents.                        | Tout le profil est modifiable. Les options sont partagées avec l'onboarding (`profileOptions.ts`) et une valeur importée hors liste reste sélectionnable. Une phrase précise que ces choix n'affectent ni quiz, ni révisions, ni projets. |

## Petites corrections reportées de la passe 11

- **Lab :** le « € » suit désormais le chiffre (`field-sizing: content`, avec repli sur l'ancien comportement dans les navigateurs qui ne le gèrent pas).
- **Atlas mobile :** la légende « Intelligence artificielle » est rapprochée de sa rangée.
- **Parcours de projet :** le libellé « quiz courants validés » tient sur deux lignes.

## Dette technique

- **Découpage :** les écrans secondaires sont chargés à la demande. Le bundle principal passe de 503 à 341 kB et l'avertissement Vite disparaît. Le CSS reste dans la feuille principale, dans l'ordre de cascade historique ; la feuille compilée a été comparée octet par octet avec la précédente, identique à la nouvelle règle de chargement près.
- **CI :** `.github/workflows/ci.yml` lance Prettier, le build, les tests unitaires et les tests navigateur à chaque push et pull request.
- **CSS :** les neuf blocs « reduced motion » par écran doublaient la règle globale de `styles.css` : retirés. Environ 140 sélecteurs ne correspondant à aucune classe du code ont été supprimés. Les `!important` restants servent tous la réduction des mouvements, sauf un radio natif masqué dans le quiz.

## Feuille de route

- **Étape 2, préparation :** la sauvegarde passe par un adaptateur (`src/lib/persistence.ts`, interface locale d'abord) au lieu d'appels directs à `localStorage`. Six tests unitaires couvrent la lecture, l'écriture, la sauvegarde illisible conservée et les refus du navigateur. Aucune connexion distante n'est ajoutée.
- **Suite bloquée :** Supabase (étape 2) et le mentor IA (étape 3) demandent des comptes et des clés que seul l'utilisateur peut fournir.
- **Idée notée :** un module Bourse et investissement est inscrit dans `docs/PRODUCT.md`, avec ses garde-fous (pédagogie, pas de conseil, sources vérifiées).

Les rendus et contrôles sont dans [LATEST.md](LATEST.md).

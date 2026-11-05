# Passe 17 : review globale des espaces et des parcours

Le 5 novembre 2026, la règle de review globale a demandé de couvrir tous les écrans, parcours et états significatifs, en desktop et en mobile. Objectif : une application immédiatement compréhensible, sans surcharge, où **la complexité est gérée par l'application et non subie par l'utilisateur**.

Cette passe ne déclare pas la direction artistique validée : une review design externe reste attendue.

## Méthode

1. **Scénarios utilisateurs réels**, rejoués dans un vrai navigateur, en desktop (1440 × 900) et en mobile (Pixel 7 émulé), avec des captures de ce que l'utilisateur voit à l'écran :
   - **première visite** : onboarding, point de départ, premier accueil, puis chacun des neuf espaces, le lexique, une adresse inexistante et le menu mobile ;
   - **première leçon** : sept séquences, pratique, quiz avec une erreur, résultat, retour à l'accueil, révisions.
2. **Espaces avec données** : projet (terrain, décisions, parcours), portfolio, révisions, scénarios, à partir des 159 captures automatiques.
3. **Tests automatisés** : ils vérifient que rien n'est perdu, mais ne servent pas de preuve de simplicité.

Chaque problème ci-dessous a été vu dans une capture. Les images avant/après sont dans `compare-17/`.

## Inventaire couvert

| Espace                  | États contrôlés                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| Onboarding              | profil, point de départ (vide, répondu, résultat)                                                        |
| Vue d'ensemble          | profil neuf, après un quiz échoué, profil démo avec projet                                               |
| Académie                | atlas, catalogue, filtres, recherche, sélection, lexique, terme ciblé                                    |
| Leçon                   | 7 séquences, pratique (indice, solution), quiz (question, erreur, résultat), application, carnet, mentor |
| Révisions               | vide, planifiées, disponibles, rappel, révélé, terminé                                                   |
| Mes compétences         | carte, sélection, portfolio (vide, notions, projets, notes)                                              |
| Lab financier           | défaut, sous le seuil, saisie invalide                                                                   |
| Scénarios (« Et si ? ») | défaut, scénario, comparaison enregistrée                                                                |
| Atelier IA              | vide, écriture, structure, comparaison                                                                   |
| Projets                 | vide, test, résultat, décision, bilan, parcours d'apprentissage (vide, carte, éditeur, mise à jour)      |
| Sources                 | liste                                                                                                    |
| Préférences             | profil, données, compte non configuré                                                                    |
| Transverse              | recherche (clavier, vide), menu mobile, page introuvable, erreur de sauvegarde illisible                 |

## Comparaisons avant/après

Les numéros des tableaux renvoient à ces images (gauche : passe 16, droite : passe 17).

| N°  | Sujet                        | Desktop                                                  | Mobile                                                |
| --- | ---------------------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| 01  | Point de départ              | [Comparer](compare-17/01-diagnostic-desktop.png)         | [Comparer](compare-17/01-diagnostic-mobile.png)       |
| 02  | Premier accueil              | [Comparer](compare-17/02-accueil-nouveau-desktop.png)    | [Comparer](compare-17/02-accueil-nouveau-mobile.png)  |
| 03  | Trajectoire et territoires   | [Comparer](compare-17/03-trajectoire-desktop.png)        | [Comparer](compare-17/03-trajectoire-mobile.png)      |
| 04  | Académie                     | [Comparer](compare-17/04-academie-desktop.png)           | [Comparer](compare-17/04-academie-mobile.png)         |
| 05  | Menu                         | rail visible dans 02                                     | [Comparer](compare-17/05-menu-mobile.png)             |
| 06  | Page introuvable             | [Comparer](compare-17/06-page-introuvable-desktop.png)   | [Comparer](compare-17/06-page-introuvable-mobile.png) |
| 07  | Fin de leçon                 | [Comparer](compare-17/07-fin-de-lecon-desktop.png)       | après seulement, dans les captures du parcours        |
| 08  | Quiz                         | [Comparer](compare-17/08-quiz-desktop.png)               | après seulement, dans les captures du parcours        |
| 09  | Accueil après un quiz échoué | [Comparer](compare-17/09-accueil-apres-quiz-desktop.png) | [Après](compare-17/09-accueil-apres-quiz-mobile.png)  |
| 10  | Préférences                  | [Comparer](compare-17/10-preferences-desktop.png)        | [Comparer](compare-17/10-preferences-mobile.png)      |

Le parcours mobile de la première leçon n'a pas pu être capturé avant correction : le script de scénario s'est arrêté sur une sauvegarde de test incomplète. Il n'a été rejoué qu'après correction ; ses captures ont été inspectées, pas comparées.

## Problèmes identifiés et priorisés

**Bloquant : aucun constaté.** Tous les parcours testés aboutissent, sur desktop comme sur mobile.

### Majeur

| #   | Problème (où, ce qu'on voit)                                                                                                                                                                                                                                                               | Pourquoi c'est gênant                                                                       | Correction                                                                                                                                                                                                                        | Avant/après      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| M1  | **Trois « prochaines actions » concurrentes.** Profil neuf : l'accueil propose « Comprendre ce qu'un LLM fait vraiment », le bloc voisin « Un repère à explorer : Construire un prompt », et l'Académie s'ouvre sur « Marge et trésorerie ».                                               | L'utilisateur ne sait pas quoi faire en premier : c'est la première question qu'il se pose. | Une seule recommandation, partagée par l'accueil, l'Académie et la carte des compétences (`src/lib/recommendation.ts`). Le bloc voisin devient « Ensuite » : « Après « Comprendre un LLM » : son quiz ouvre la suite ».           | `02`, `03`, `04` |
| M2  | **La recommandation ne dit pas pourquoi.**                                                                                                                                                                                                                                                 | Sans raison, la proposition paraît arbitraire, ce qui coûte en confiance.                   | Ligne « Pourquoi celle-ci ? » : point de départ et centre d'intérêt, reprise d'un quiz à refaire, prérequis validés…                                                                                                              | `02`, `09`       |
| M3  | **Après un quiz échoué, les rappels prêts sont invisibles** depuis l'accueil (seulement en bas de page).                                                                                                                                                                                   | La révision, cœur de la rétention, n'est pas proposée au bon moment.                        | Lien « 2 rappels prêts avant de continuer » à côté de l'action principale ; sur mobile, sur sa propre ligne.                                                                                                                      | `09`             |
| M4  | **Navigation à 9 entrées, à plat, avec des libellés obscurs** : « Et si ? », « Radar ». « Et si ? » est une partie du Lab, mais a sa propre entrée.                                                                                                                                        | Un débutant ne devine pas ce que contiennent ces espaces.                                   | Trois groupes de verbes : **Apprendre**, **S'exercer**, **Construire**. « Scénarios » et « Sources » remplacent les anciens noms. Une phrase d'usage par espace dans le menu mobile, en infobulle sur le rail. Rien n'est retiré. | `05`, `02`       |
| M5  | **Le point de départ contredit son texte** : « Ne pas savoir fait partie du chemin », mais chaque question est obligatoire. Le navigateur bloque l'envoi avec son propre message (en anglais dans un navigateur anglais). Le prénom est obligatoire alors qu'une valeur par défaut existe. | Premier contact bloquant ; impression d'examen.                                             | Option « Je ne sais pas encore » pour chaque question ; une question laissée vide compte comme telle. Prénom facultatif.                                                                                                          | `01`             |
| M6  | **« Quatre territoires » sur l'accueil pour 5 domaines.** L'Entrepreneuriat n'apparaissait nulle part sur l'accueil.                                                                                                                                                                       | Incohérence entre écrans, et une notion inaccessible depuis l'accueil.                      | La carte 01 devient « Finance et entreprise » (3 notions). Les compteurs disent « notions validées » au lieu de « repères ». La carte ouvre la première notion accessible.                                                        | `03`             |

### Amélioration

| #   | Problème                                                                               | Correction                                                                                                                 | Avant/après |
| --- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------- |
| A1  | Page introuvable titrée « Préférences » dans la barre, sans autre issue que l'accueil. | Titre « Page introuvable », une phrase rassurante (progression intacte), trois issues : accueil, leçons, recherche.        | `06`        |
| A2  | Deux boutons « Passer à la pratique » identiques à la fin de la dernière séquence.     | Un seul, dans le pied de séquence.                                                                                         | `07`        |
| A3  | Niveau « Débutant++ » : jargon.                                                        | Libellés clairs (« Je découvre », « J'ai quelques bases »…) ; les valeurs enregistrées et les sauvegardes ne changent pas. | `10`        |
| A4  | « Incubateur » dans les boutons d'une leçon alors que l'espace s'appelle « Projets ».  | « Garder cette idée dans mes projets », « Ouvrir mes projets ».                                                            | tests       |
| A5  | Atlas sous-titré « Fondations » alors qu'il couvre 5 domaines.                         | « Tous les domaines ».                                                                                                     | `04`        |
| A6  | Étiquette « BOUSE / FONDATIONS » figée sur l'accueil.                                  | Le domaine de la leçon proposée ; masquée sur mobile où elle faisait passer le libellé sur deux lignes.                    | `02`        |

### Finition

| #   | Problème                                                                                                               | Correction                                                                              |
| --- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| F1  | « 10 000 » et « € » séparés par un retour à la ligne dans le quiz (`08`).                                              | 256 espaces insécables dans les contenus. Un test unitaire empêche le retour du défaut. |
| F2  | « À votre rythme → » sur l'onboarding ressemble à un lien mais ne fait rien.                                           | Flèche retirée.                                                                         |
| F3  | Libellés du rail desktop à 10 px, gris tertiaire.                                                                      | 11 px, gris secondaire ; groupes séparés par un filet.                                  |
| F4  | Liens de navigation : le texte visible et le nom accessible divergeaient après l'ajout des descriptions (axe, mobile). | Le nom reste le libellé ; la description est reliée par `aria-describedby`.             |

## Propositions de composition et de fonctionnement

Mises en œuvre dans cette passe :

- **Une seule source pour la prochaine leçon**, expliquée et reprise partout.
- **Navigation par intentions** (apprendre, s'exercer, construire), avec une phrase d'usage pour chaque espace.
- **Le moment de réviser** placé à côté de l'action principale, seulement quand des rappels sont prêts.
- **Un point de départ qui accepte l'ignorance** : « Je ne sais pas encore » oriente le parcours comme une réponse.

## Nouvelles idées proposées (non implémentées)

1. **Termes du lexique reconnus dans les leçons.** Un mot comme « TAEG » ou « trésorerie » s'ouvre en définition courte au survol ou au toucher, avec un lien vers le lexique. Le lexique est déjà relié aux leçons ; c'est le chemin inverse.
2. **Reprendre à la séquence exacte.** Rouvrir une leçon là où on l'a quittée (séquence 4 sur 7), pas au début.
3. **Séance du jour calibrée sur le temps choisi.** Avec 20 min : « 1 rappel + séquences 3 à 5 ». Cela donnerait un vrai effet au réglage du temps par session.
4. **Trajectoire de l'accueil sur les 5 domaines.** Aujourd'hui elle ne montre que les 6 notions de base. Elle pourrait suivre les centres d'intérêt.
5. **Point de départ étendu** aux domaines Finance personnelle et Investissement (3 questions aujourd'hui, pour 3 des 5 domaines).
6. **Fin de leçon en deux phrases** : « Ce que vous savez maintenant » et « Votre prochaine étape », avant la pratique.
7. **Vocabulaire de l'interface unifié** : « repère » désigne encore plusieurs choses (indice de leçon, carte de révision, élément d'un prompt, onglet d'un projet). Il faudrait choisir un mot par concept.
8. **Choix du profil effectifs** : le niveau, l'objectif et la façon d'apprendre sont enregistrés mais ne changent pas encore le parcours. Le texte des préférences le dit honnêtement. C'est la tâche suivante proposée.

## Vérification sans perte de fonctionnalité

- **Aucune entrée retirée.** Les 9 espaces restent dans la navigation (renommés pour deux d'entre eux) et dans la recherche. Taper « radar » ou « et si » les retrouve toujours.
- `npm test` : **190 cas réussis**, dont le nouveau test typographique.
- `npx playwright test` : **70 tests réussis** (desktop et Pixel 7 émulé), y compris l'audit axe des écrans principaux. Les tests ont été mis à jour uniquement pour les libellés renommés (« mes projets »).
- **Carte des compétences** : un test a montré qu'elle doit continuer à s'ouvrir sur la dernière leçon travaillée (pour retrouver ses preuves). Elle le fait ; la recommandation commune ne s'applique qu'en l'absence de leçon récente.
- `npm run build` sans avertissement.
- **159 captures**, archive `2026-11-05_15-59-53-Europe-Paris`. Avant : archive `2026-11-05_15-34-40-Europe-Paris` (passe 16).

## Ce qui reste imparfait

> Mise à jour passe 18 : le vocabulaire « repère » est unifié et les choix du profil ont un effet. Les deux premiers points ci-dessous sont traités.

- **Vocabulaire :** « repère » garde plusieurs sens (voir l'idée 7).
- **Profil :** le niveau, l'objectif et la façon d'apprendre n'influencent pas encore le parcours.
- **Trajectoire de l'accueil :** limitée aux 6 notions de base. Une leçon recommandée en Finance personnelle ou en Investissement n'y apparaît pas.
- **Quiz à deux questions :** le résultat ne peut valoir que 0, 50 ou 100 %, ce qui est peu nuancé.
- **Onboarding desktop :** le formulaire dépasse la hauteur de l'écran, alors que la colonne de gauche reste vide en bas.
- **Mobile :** le lien « Toute l'Académie » est placé au-dessus du titre « Quatre territoires ».
- **Rail desktop :** « Vue d'ensemble » s'affiche sur deux lignes.
- **Sources :** quatre liens seulement ; l'espace reste peu dense.
- **Messages de validation natifs :** ceux qui restent (champs numériques des projets, par exemple) suivent la langue du navigateur.
- **Parcours non rejoués à la main** dans cette passe, couverts seulement par les tests automatisés : création et édition complète d'un projet, import et export, mentor et synchronisation (non configurés), hors ligne.
- **Pas d'essai réel** sur téléphone physique, Safari, Firefox ou lecteur d'écran.
- **Direction artistique non validée :** une review design externe est attendue.

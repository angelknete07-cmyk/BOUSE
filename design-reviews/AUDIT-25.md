# Passe 25 : engagement, plaisir et envie de revenir

Demande de l'utilisateur, le 6 novembre 2026 : évaluer l'engagement durable et la motivation intrinsèque, tester sur plusieurs leçons consécutives, sans dark pattern. **La direction artistique et l'engagement ne sont pas déclarés validés** : un test avec de vraies personnes reste nécessaire.

## Méthode

- **Parcours :** un débutant réel, avec la configuration par défaut et le diagnostic entièrement en « Je ne sais pas encore ».
- **Déroulé :** trois leçons consécutives jusqu'au quiz réussi, à la transition et au retour à l'accueil.
- **Formats :** mobile (Pixel 7), puis desktop 1440 px sur deux leçons.
- **Relevés :** clics, mots lus par séquence, texte de chaque écran et captures dans `engagement-25/` (avant) et `engagement-25/apres/`.

**Mesures :**

- 3 clics de l'arrivée à la première leçon.
- 13 clics par leçon jusqu'au quiz réussi.
- 7 séquences de 60 à 230 mots, soit 860 à 1 020 mots par leçon : 4 à 5 minutes de lecture pour 16 à 20 minutes annoncées, exercice et quiz compris.

## Constats avant correction

| Critère                        | Constat                                                                                                                                                                                                 | Gravité |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Intérêt des premières minutes  | La leçon ouvre sur trois noms de notions et un paragraphe d'enjeu. Aucune question ne crée de curiosité. Sans scène interactive (32 leçons sur 43), on lit d'abord.                                     | Haute   |
| Variété                        | Lecture, scène (11 leçons), « À vous d'expliquer », exercice, quiz. Les nouvelles leçons manquent de manipulation.                                                                                      | Haute   |
| Satisfaction sans gamification | L'écran de réussite est identique pour toutes les leçons (« L'idée est comprise. Faites-en quelque chose. »). Il ne dit pas ce qui a été appris.                                                        | Haute   |
| Transition vers la suite       | Avec « Exemples puis pratique », le bouton principal mène **toujours** au Lab financier, même après « Lire un compte de résultat », que le Lab ne manipule pas. La leçon suivante n'est jamais montrée. | Haute   |
| Recommandation et reprise      | « Pourquoi celle-ci ? » répète le même texte d'une leçon à l'autre, sans lien avec ce qui vient d'être validé.                                                                                          | Moyenne |
| Rythme et longueurs            | L'écran de réussite empile trois notes de bas de page et quatre actions. Sur mobile, l'action principale passe sous la ligne de flottaison.                                                             | Moyenne |
| Progresser vers un objectif    | La progression n'apparaît qu'en « 03 / 43 » : un total abstrait, intimidant au début.                                                                                                                   | Moyenne |
| S'arrêter sans culpabilité     | Rien ne dit que s'arrêter est un bon moment. La reprise à la séquence exacte existe déjà (passe 19).                                                                                                    | Basse   |
| Défaut trouvé en passant       | Sans prénom, l'accueil affichait « À vous de jouer, Vous. ». Le libellé « quiz validés » de la progression était coupé au bord droit de l'accueil (desktop).                                            | Moyenne |

## Corrections

1. **Question de départ** (découvrir).
   - La première séquence de chaque leçon pose la première question du quiz et promet d'y répondre. C'est l'effet du prétest, qui améliore la mémorisation.
   - Le quiz la signale comme « Votre question de départ ». Le titre de réussite boucle : « C'est acquis. La question de départ est résolue. »
2. **Écran de réussite recentré** (réussir et voir sa progression).
   - Il affiche les notions acquises de la leçon et le compte « Finance : 2 notions validées sur 7 · votre parcours : 2/43 ».
   - Une carte « La suite » montre la leçon suivante (titre, résumé, durée, « prolonge cette leçon »).
   - Sur mobile, l'action principale passe en premier. Les notes sont réduites à une ligne, et « Nouvelle tentative » n'apparaît qu'en cas d'échec.
3. **Pratique pertinente seulement.**
   - Un espace d'exercice n'est proposé que pour les 14 leçons qu'il manipule vraiment : Lab financier (marge, seuil, modèle, prix), Scénarios (BFR, prévisionnel, délais de paiement), Atelier IA, Projets.
   - Pour les autres, la suite est la leçon suivante. « Commencer la leçon suivante » reste toujours disponible.
4. **Continuité.**
   - La recommandation explique : « Elle prolonge « Marge et trésorerie », que vous venez de valider. »
   - L'accueil rappelle « Dernière notion validée : … » quand la leçon proposée ne la prolonge pas.
5. **S'arrêter sereinement.** « Bon point d'arrêt. Tout est enregistré dans ce navigateur ; la suite vous attendra, sans rappel ni compte à rebours. », avec « Revenir à l'accueil ».
6. **Défauts corrigés :**
   - salutation sans prénom : « À vous de jouer. » ;
   - libellé de progression sur une ligne, vérifié à 1440 px, 1024 px et sur mobile.

## Boucle testée

| Étape               | Où                                                                            | Vérifié par                                                             |
| ------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Découvrir           | question de départ, séquence 1                                                | test e2e `deux leçons de suite…`, captures `apres/*-r*-a-ouverture.png` |
| Comprendre          | 7 séquences, détails repliés (« Pourquoi cette notion change les décisions ») | parcours (mots par séquence)                                            |
| Manipuler           | scènes interactives (11 leçons), « À vous d'expliquer », exercice             | catalogue.spec (toutes les leçons)                                      |
| Réussir             | quiz, question de départ reconnue, notions acquises listées                   | test e2e                                                                |
| Voir sa progression | compte du domaine et du parcours, « Dernière notion validée » à l'accueil     | test e2e, captures `apres/*-r*-f-accueil-apres.png`                     |
| Envie de la suite   | carte « La suite » et raison « Elle prolonge… »                               | test e2e (deux leçons enchaînées), test unitaire de la recommandation   |

Le test e2e enchaîne deux leçons sur desktop et mobile. Il vérifie aussi l'absence de « série », « streak » ou « ne perdez pas ».

## Garde-fous respectés

- **Rien de manipulateur :** aucune série de jours, aucun compte à rebours, aucune notification, aucune formulation de perte, aucun point ni badge.
- **Progression réelle :** elle compte des quiz réussis, pas du temps passé.
- **S'arrêter est présenté comme un bon résultat.**

## Ce qui reste imparfait

- **Manipuler :** 32 leçons sur 43 n’ont pas encore de scène. C'est le principal levier restant. Priorités : comparateur de statuts, plan de trésorerie, louer ou acheter, barème d'impôt fictif, rééquilibrage, lecture de bilan.
- **Quiz à deux questions :** la réussite dépend d'un seul écart. Un mode entraînement, sans version, permettrait plus de questions sans invalider les quiz validés.
- **Défi :** aucun cas « défi » transversal (par exemple « votre entreprise fictive, an 1 ») ne relie plusieurs leçons.
- **Progression vers l'objectif :** elle est comptée par domaine, pas par objectif. Les parcours guidés par objectif (« Créer mon entreprise ») restent à faire.
- **Motivation réelle :** elle ne se prouve pas par un test automatique. Il faut observer trois à cinq débutants sur deux séances, avec les questions « qu'avez-vous appris ? » et « reviendriez-vous ? Pourquoi ? ».

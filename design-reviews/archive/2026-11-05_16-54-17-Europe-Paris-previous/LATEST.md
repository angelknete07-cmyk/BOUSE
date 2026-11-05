# Review design — passe 18 : choix du profil effectifs, vocabulaire unifié

**5 novembre 2026, 16:38 Europe/Paris.** Suite de la passe 17, validée par l'utilisateur (« Oui vas-y go »). Deux chantiers de la liste « ce qui reste imparfait ». **La direction artistique n'est pas déclarée validée.**

## Choix du profil effectifs

Chaque choix a maintenant un effet visible, expliqué là où il agit. Détail dans `docs/PRODUCT.md` (« Ce que le profil change ») :

- **Objectif** : il départage les notions accessibles et il est cité dans « Pourquoi celle-ci ? ».
- **Niveau** : aux niveaux « Je pratique déjà » et « Je veux approfondir », une leçon jamais ouverte propose « Vérifier directement au quiz ».
- **Temps par session** : l'accueil découpe la séance (« Votre séance de 10 min : environ 3 séquences sur 7 »).
- **Façon d'apprendre** : elle choisit la suite après un quiz réussi. Cette suite pointe toujours vers la **même** prochaine leçon que l'accueil : un premier rendu proposait deux leçons différentes, corrigé avant les captures.
- **Préférences** : la phrase d'aide dit ce que chaque choix change.

Captures, profil « Je pratique déjà », 10 min, « Concepts puis cas professionnel » :

| Écran                | Desktop                                     | Mobile                                     |
| -------------------- | ------------------------------------------- | ------------------------------------------ |
| Accueil              | [Voir](profil-18/desktop-home.png)          | [Voir](profil-18/mobile-home.png)          |
| Leçon jamais ouverte | [Voir](profil-18/desktop-lesson-skip.png)   | [Voir](profil-18/mobile-lesson-skip.png)   |
| Quiz réussi          | [Voir](profil-18/desktop-quiz-passed.png)   | [Voir](profil-18/mobile-quiz-passed.png)   |
| Préférences          | [Voir](profil-18/desktop-settings-note.png) | [Voir](profil-18/mobile-settings-note.png) |

## Vocabulaire unifié

Le mot « repère » avait plusieurs sens. Chaque concept a maintenant son mot :

| Concept                         | Mot           |
| ------------------------------- | ------------- |
| Sujet d'une leçon               | **notion**    |
| Rappel de révision              | **carte**     |
| Partie d'une demande à l'IA     | **élément**   |
| Ce qu'une réponse doit contenir | **point clé** |
| Aide pendant l'exercice         | **indice**    |

Exemples : l'onglet « Repères » d'un projet devient « Notions », « 02 repères disponibles » devient « 02 cartes disponibles », « 6 / 7 repères dans le texte » devient « 6 / 7 éléments dans le texte ».

## Vérifications internes

- `npm test` : 196 cas réussis, dont 6 nouveaux sur la recommandation, le découpage de séance et la suite après un quiz.
- `npx playwright test` : 70 tests réussis (desktop et Pixel 7 émulé), dont l'audit axe. Seuls les libellés renommés ont été mis à jour dans les tests.
- Build sans avertissement ; 159 captures, archive `2026-11-05_16-38-57-Europe-Paris`.
- Défauts vus à l'écran et corrigés :
  - bandeau du quiz placé dans la colonne du numéro, puis masqué sur mobile ;
  - deux « prochaines leçons » différentes après un quiz réussi ;
  - guillemets coupés en fin de ligne.

**Limites :**

- La recommandation ne saute jamais les prérequis, même au niveau avancé : seul le passage direct au quiz est proposé.
- Le découpage de séance est une estimation (durée de la leçon divisée par 7, environ 1 min par rappel).
- La reprise à la séquence exacte n'est pas encore faite.

---

# Review design — passe 17 : review globale des espaces et des parcours

**5 novembre 2026, 15:59 Europe/Paris.** Application de la règle de review globale : tous les espaces, parcours et états significatifs, en desktop et en mobile, à partir de **scénarios utilisateurs réels** (première visite, première leçon avec un quiz échoué) et des 159 captures. Détail, priorités et comparaisons : [AUDIT-17.md](AUDIT-17.md). **La direction artistique n'est pas déclarée validée.**

## En bref

- **Bloquant :** aucun constaté.
- **Majeur, corrigé :**
  - une seule prochaine leçon, partagée par l'accueil, l'Académie et la carte des compétences, avec sa raison (« Pourquoi celle-ci ? ») ;
  - les rappels prêts proposés à côté de l'action principale ;
  - navigation regroupée en **Apprendre / S'exercer / Construire**, avec une phrase d'usage par espace ; « Scénarios » et « Sources » remplacent « Et si ? » et « Radar » ;
  - « Je ne sais pas encore » accepté au point de départ, prénom facultatif ;
  - les 5 domaines présents sur l'accueil.
- **Amélioration et finition, corrigées :**
  - page introuvable utile ;
  - un seul « Passer à la pratique » ;
  - niveaux en langage clair ;
  - « mes projets » au lieu d'« incubateur » ;
  - 256 espaces insécables, avec un test ;
  - rail plus lisible.
- **Idées proposées, non implémentées :** termes du lexique reconnus dans les leçons, reprise à la séquence exacte, séance calibrée sur le temps choisi, trajectoire sur 5 domaines, vocabulaire « repère » unifié, choix du profil effectifs.

## Avant / après (gauche : passe 16, droite : passe 17)

| Sujet                        | Desktop                                                  | Mobile                                                |
| ---------------------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| Point de départ              | [Comparer](compare-17/01-diagnostic-desktop.png)         | [Comparer](compare-17/01-diagnostic-mobile.png)       |
| Premier accueil              | [Comparer](compare-17/02-accueil-nouveau-desktop.png)    | [Comparer](compare-17/02-accueil-nouveau-mobile.png)  |
| Trajectoire et territoires   | [Comparer](compare-17/03-trajectoire-desktop.png)        | [Comparer](compare-17/03-trajectoire-mobile.png)      |
| Académie                     | [Comparer](compare-17/04-academie-desktop.png)           | [Comparer](compare-17/04-academie-mobile.png)         |
| Menu                         | rail visible dans « Premier accueil »                    | [Comparer](compare-17/05-menu-mobile.png)             |
| Page introuvable             | [Comparer](compare-17/06-page-introuvable-desktop.png)   | [Comparer](compare-17/06-page-introuvable-mobile.png) |
| Fin de leçon                 | [Comparer](compare-17/07-fin-de-lecon-desktop.png)       | —                                                     |
| Quiz                         | [Comparer](compare-17/08-quiz-desktop.png)               | —                                                     |
| Accueil après un quiz échoué | [Comparer](compare-17/09-accueil-apres-quiz-desktop.png) | [Après](compare-17/09-accueil-apres-quiz-mobile.png)  |
| Préférences                  | [Comparer](compare-17/10-preferences-desktop.png)        | [Comparer](compare-17/10-preferences-mobile.png)      |

Avant : archive `2026-11-05_15-34-40-Europe-Paris`. Après : archive `2026-11-05_15-59-53-Europe-Paris`. Paire principale : [desktop](latest-desktop.png) · [mobile](latest-mobile.png).

## Vérifications internes

- `npm test` : 190 cas réussis.
- `npx playwright test` : 70 tests réussis (desktop 1440 × 1000, Pixel 7 émulé), dont l'audit axe.
- Build sans avertissement ; 159 captures.
- Défauts vus en cours de passe et corrigés avant les captures finales :
  - actions de l'accueil serrées sur mobile ;
  - libellé « Commencer la traversée » sur deux lignes ;
  - nom accessible des liens de navigation différent de leur texte visible ;
  - carte des compétences qui ne s'ouvrait plus sur la dernière leçon travaillée.

**Limites :**

- Le projet complet, l'import et l'export, le mentor, la synchronisation et le mode hors ligne n'ont pas été rejoués à la main dans cette passe ; ils restent couverts par les tests automatisés.
- Pas d'appareil physique, ni Safari, ni Firefox, ni lecteur d'écran réel.
- Liste complète de ce qui reste imparfait : [AUDIT-17.md](AUDIT-17.md#ce-qui-reste-imparfait).

---

# Review design — passe 16 : finition artistique ciblée

**5 novembre 2026, 15:34 Europe/Paris.** Réponse à la review externe « DA non encore validée ». Passe de finition **sans nouvelle fonctionnalité** sur les cinq écrans prioritaires. Détail point par point : [AUDIT-16.md](AUDIT-16.md). **La direction artistique n'est pas déclarée validée : une nouvelle review externe est attendue.**

## Avant / après (gauche : passe 15, droite : passe 16)

| Écran                         | Desktop                                          | Mobile                                          |
| ----------------------------- | ------------------------------------------------ | ----------------------------------------------- |
| 1. Accueil                    | [Comparer](compare-16/01-accueil-desktop.png)    | [Comparer](compare-16/01-accueil-mobile.png)    |
| 2. Académie (atlas)           | [Comparer](compare-16/02-academie-desktop.png)   | [Comparer](compare-16/02-academie-mobile.png)   |
| 3. Atelier IA (après analyse) | [Comparer](compare-16/03-atelier-ia-desktop.png) | [Comparer](compare-16/03-atelier-ia-mobile.png) |
| 4. Leçon (séquence concept)   | [Comparer](compare-16/04-lecon-desktop.png)      | [Comparer](compare-16/04-lecon-mobile.png)      |
| 5. Leçon budget (cas signalé) | [Comparer](compare-16/05-budget-desktop.png)     | [Comparer](compare-16/05-budget-mobile.png)     |

Avant : archive `2026-11-05_12-59-57-Europe-Paris`. Après : archive `2026-11-05_15-34-40-Europe-Paris`. Paire principale : [desktop](latest-desktop.png) · [mobile](latest-mobile.png) sur l'accueil.

## En bref

- **Accueil :** territoires en folios asymétriques (7/5 puis 5/7 colonnes), avec relief, courbes de niveau, grain, numéro fantôme et barre de repères. Aucune couleur ajoutée.
- **Académie :**
  - bandes de domaines alignées sur les rangées ;
  - taille des cercles selon le niveau ;
  - états validée, accessible et prérequis ;
  - chemin de la notion choisie en argent ;
  - légende des états.
- **Atelier IA :**
  - écriture et analyse réunies en un seul instrument ;
  - jauge des repères sous le texte ;
  - rayons ancrés sur les points, plus jamais sur les libellés ;
  - comparaison en deux panneaux.
- **Leçons :**
  - métadonnées de 11 à 13 px ;
  - vocabulaire moins massif, explication de 13 à 16 px ;
  - scène posée sur un établi ;
  - libellés de graphique agrandis ;
  - « % » insécable.
- **Mobile :** « Séquence suivante » n'est plus flottant et ne couvre plus la scène budget. Les champs qui reçoivent le focus restent au-dessus du dock.
- **Identité :** quatre tokens de matière partagés et une seule feuille `src/finish.css`. La motion ajoutée respecte `prefers-reduced-motion`.

## Vérifications internes

- `npm test` : 189 cas réussis.
- `npx playwright test` : 70 tests réussis (desktop 1440 × 1000, Pixel 7 émulé).
- Build sans avertissement ; 159 captures.
- Quatre défauts vus à l'inspection et corrigés avant les captures finales : numéros fantômes sur le compteur, libellés de l'atlas illisibles, rayon traversant « Objectif », grille du concept qui écrasait la scène budget sur mobile.

**Limites :** pas d'appareil physique, ni Safari, ni Firefox, ni lecteur d'écran réel ; le survol et l'animation ne se voient pas sur une capture fixe.

---

# Review design — passe 15 : module Finance personnelle

**5 novembre 2026, 12:59 Europe/Paris.** Quatre leçons enchaînées, deux scènes interactives, 15 termes ajoutés au lexique, renommé « Lexique de la finance ». Vérification interne effectuée ; review design externe toujours attendue.

- **Leçons :**
  - construire son budget ;
  - l'épargne de précaution ;
  - crédit : taux, TAEG et coût total ;
  - inflation et pouvoir d'achat.

  Exemples fictifs, aucun taux réglementé ni plafond chiffré, sources : Banque de France (Mes questions d'argent), service-public.fr, IEFP, Insee.

- **Scènes :**
  - un budget du mois en trois segments gris, épargne en argent, avec marge ou dépassement affiché ;
  - le crédit : mensualité et intérêts selon la durée et le taux, avec un moteur pur (`src/lib/personalFinance.ts`) couvert par 7 tests.
- **Structure à 5 domaines :**
  - l'atlas passe à 5 rangées et la carte des compétences à 5 colonnes, avec défilement horizontal sur mobile ;
  - l'accueil affiche 4 cartes en grille 2 × 2 (« Quatre territoires ») ;
  - l'Académie affiche « 15 notions, 5 domaines ».
- **Défauts corrigés après inspection :**
  - barre du budget peu lisible ;
  - compteur de l'accueil coupé sur mobile avec 15 notions ;
  - libellés tronqués de la carte des compétences mobile ;
  - montants coupés sur deux lignes.
- **Préférences.** La phrase d'aide dit maintenant précisément ce que chaque choix change aujourd'hui : les intérêts orientent la leçon proposée ; le niveau, l'objectif et la façon d'apprendre ne modifient pas encore le parcours.
- **Captures :** [budget desktop](screens/desktop/19-finance-perso-budget-viewport.png), [budget mobile](screens/mobile/19-finance-perso-budget-viewport.png), [crédit desktop](screens/desktop/19-finance-perso-credit.png), [crédit mobile](screens/mobile/19-finance-perso-credit.png), [atlas](screens/desktop/02-academy.png), [accueil](screens/desktop/01-home.png), [compétences mobile](screens/mobile/09-competences.png). Archive `2026-11-05_12-59-57-Europe-Paris`.
- **Vérifications :**
  - `npm test` : 189 cas unitaires réussis ;
  - `npx playwright test` : 70 tests réussis (nouveau scénario : simulateur de crédit) ;
  - build sans avertissement.

---

# Review design — passe 14 : application installable et nouveau logo

**5 novembre 2026.** BOUSE devient une application web installable, qui fonctionne hors ligne. Le logo est remplacé par la proposition D, choisie par l'utilisateur parmi quatre ([propositions](logo-propositions.png), [jeu final](logo-final.png)).

- **Logo D.**
  - Icônes : un « b. » en Inter, avec un point carré argent, sur fond noir et la vague topographique de l'accueil.
  - Variante sans les lignes fines pour les favicons de 32 et 48 px, où elles deviennent illisibles.
  - Version « maskable » : le logo est recentré dans la zone sûre, pour les lanceurs qui découpent l'icône en cercle.
  - Le « b. » de la barre latérale et de l'onboarding adopte le même dessin (Inter, point carré argent). Le « . » reste présent pour les lecteurs d'écran.
- **Installation.**
  - Manifeste en français (`BOUSE`, plein écran, démarrage sur l'accueil).
  - Icône Apple, balises pour iOS, couleur de thème `#050505`.
- **Hors ligne.**
  - Le service worker prend la page sur le réseau en priorité, puis sa copie en cache.
  - Les ressources compilées sont servies depuis le cache. Un plugin Vite inscrit tous les fichiers compilés, avec une version calculée sur leur contenu.
  - Les requêtes vers d'autres domaines (synchronisation, mentor) ne sont jamais mises en cache.
  - Enregistrement en production seulement.
- **Vérifié sur la version compilée** (`vite preview`, Chromium) : 24 fichiers en cache, l'accueil se recharge hors ligne, et le lexique s'ouvre hors ligne sans jamais avoir été ouvert en ligne. Un premier essai a échoué (scripts `crossorigin` et en-tête `Vary`), puis il a été corrigé avec `ignoreVary`.
- **Tests.** `npm test` : 179 cas réussis, dont 2 sur le manifeste et le service worker. `npx playwright test` : 68 tests réussis. 153 captures enregistrées, dont l'accueil et le nouveau « b. ».
- **Limites.** Pas d'essai d'installation sur un vrai téléphone. Le cache est réservé à l'origine du site.

---

# Review design — passe 13 : module Bourse, comptes et mentor IA

**5 novembre 2026, 11:15 Europe/Paris.** À la demande « Oui fais les 3 », cette passe livre trois chantiers :

1. le module Bourse et investissement ;
2. la synchronisation de compte Supabase ;
3. le mentor IA.

La synchronisation et le mentor restent **inactifs tant qu'aucun projet n'est configuré**. Vérification interne effectuée ; **review design externe toujours attendue** pour les passes 10 à 13.

## Changements visibles

- **Académie à quatre domaines.**
  - « 11 notions, 4 domaines » ;
  - lien « Lexique de la bourse » ;
  - atlas à quatre rangées, avec la rangée Investissement en chaîne de cinq notions ;
  - filtre Investissement.
- **Leçons d'investissement.** Cinq leçons, avec la mention « / INVESTISSEMENT ». Deux scènes interactives :
  - intérêts composés et frais (deux courbes, curseurs frais et durée) ;
  - hausse nécessaire après une baisse (trois barres).
- **Lexique.** 53 termes classés par lettre :
  - recherche et filtres par catégorie ;
  - lien vers la leçon qui explique chaque terme ;
  - termes trouvables dans la recherche universelle.
- **Compétences.** Quatrième colonne Investissement ; la hauteur mobile est augmentée pour la pile de cinq notions.
- **Accueil.** Troisième carte « 03 / Investissement » ; le titre devient « Trois territoires. Un même horizon. » et chaque carte compte les repères de son domaine.
- **Préférences.** Panneau « Compte et synchronisation », qui affiche « Non configurée » ici. Le texte de confidentialité s'adapte à la configuration.
- **Leçon.** Volet « Poser une question au mentor ». Ici il indique « Mentor IA non connecté », sans réponse simulée.

## Captures

Paire principale : [desktop](latest-desktop.png) · [mobile](latest-mobile.png), sur la leçon « Intérêts composés, inflation et frais » et son simulateur.

| Écran                          | Desktop                                                      | Mobile                                                      |
| ------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------- |
| Lexique                        | [Voir](screens/desktop/17-lexique-viewport.png)              | [Voir](screens/mobile/17-lexique-viewport.png)              |
| Lexique, recherche « ordre »   | [Voir](screens/desktop/17-lexique-recherche.png)             | [Voir](screens/mobile/17-lexique-recherche.png)             |
| Leçon intérêts composés        | [Voir](screens/desktop/18-investissement-lecon-viewport.png) | [Voir](screens/mobile/18-investissement-lecon-viewport.png) |
| Leçon risque (scène de baisse) | [Voir](screens/desktop/18-investissement-risque.png)         | [Voir](screens/mobile/18-investissement-risque.png)         |
| Académie (atlas à 4 rangées)   | [Voir](screens/desktop/02-academy.png)                       | [Voir](screens/mobile/02-academy.png)                       |
| Compétences (4 colonnes)       | [Voir](screens/desktop/09-competences.png)                   | [Voir](screens/mobile/09-competences.png)                   |
| Accueil (3 territoires)        | [Voir](screens/desktop/01-home.png)                          | [Voir](screens/mobile/01-home.png)                          |
| Préférences (compte)           | [Voir](screens/desktop/10-parametres.png)                    | [Voir](screens/mobile/10-parametres.png)                    |

Avant : archive `2026-11-05_10-37-05-Europe-Paris` (passe 12).

## Inspection interne

- **Atlas.** Les cinq nœuds Investissement sont alignés sur les guides verticaux (1er, 3e, 5e) et leurs liens partent du centre des cercles. Sur mobile, la largeur minimale passe à 900 px et l'atlas défile, avec un fondu, pour que les libellés ne se chevauchent pas.
- **Compétences mobile.** Un premier rendu montrait le statut « À explorer » chevauchant le point suivant dans la colonne Investissement ; corrigé par la hauteur de la carte.
- **Leçons.** Un premier rendu affichait « / FONDATIONS » sur les leçons d'investissement ; corrigé.
- **Simulateur.** « 21 702 € » avec 1 % de frais, « 26 533 € » sans frais : mêmes valeurs que l'exemple écrit et que les tests unitaires du moteur.
- **Monochrome conservé.** Seule couleur fonctionnelle ajoutée : le point d'état de la synchronisation (succès ou avertissement), jamais visible sans configuration.

**Limites.**

- La connexion, la synchronisation entre appareils, la résolution de conflit et une vraie réponse du mentor n'ont **pas** pu être exercées : aucun projet Supabase ni aucune clé n'étaient disponibles.
- Ces chemins sont couverts par des tests unitaires (décision de synchronisation, contrat du mentor, contexte de leçon) et par une vérification de types contre le vrai SDK, pas par un essai réel.
- `service-public.fr` était inaccessible depuis cette session : les règles fiscales ne sont pas chiffrées dans le contenu.

## Vérifications effectuées

- `npm run build` réussit sans avertissement. Bundle principal : 366,60 kB. Le SDK Supabase est un chunk séparé de 214 kB, chargé seulement si la synchronisation est configurée.
- `npm test` : **176 cas unitaires réussis**. Nouveaux tests : contenu du module, moteur de projection, synchronisation, contrat du mentor, contexte de leçon.
- `npx playwright test` : **68 tests réussis** sur desktop et mobile. Nouveaux scénarios : lexique, recherche universelle vers un terme, simulateur, mentor non connecté, synchronisation non configurée, captures du module. Une régression vue en cours de route (deux rôles `status` dans les préférences) a été corrigée avant le run final.
- **Fonction serveur du mentor** : vérifiée par TypeScript avec `@anthropic-ai/sdk` 1.1.0 et `@supabase/supabase-js` 2.118.0. Deno n'est pas installé : elle n'a pas été exécutée.
- **153 captures** fraîches. Desktop 1440 × 1000 ; mobile Pixel 7 émulé.

Archive : `archive/2026-11-05_11-15-35-Europe-Paris/`. Reproduction : `npm run build`, `npm run test:e2e`, puis `node scripts/save-design-review.mjs --primary=18-investissement-lecon-viewport`.

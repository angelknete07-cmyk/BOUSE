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

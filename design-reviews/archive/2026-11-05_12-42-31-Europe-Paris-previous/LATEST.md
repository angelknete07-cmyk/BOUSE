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

# Passe 11 : corrections issues du diagnostic de reprise

Diagnostic interne fait lors de la reprise du 5 novembre 2026, à partir des rendus de la passe 10 et du code. L'utilisateur a demandé de tout corriger (« Oui fait tout »). Aucune review design externe n'a été transmise : ces constats ne la remplacent pas.

## Défauts confirmés dans le code

| Zone                     | Constat                                                                                                                                                   | Correction                                                                                                                                                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Atlas de l'Académie      | Les lignes de prérequis passaient environ 20 px sous les cercles. Le bouton entier (cercle + libellés) était centré sur le point que la ligne atteignait. | Le centre du cercle (76 px / 2) est ancré sur le point. Le canevas est un peu plus haut pour garder les libellés.                                                                                                    |
| Trajectoire de l'accueil | Les liaisons étaient tracées à la main et ne correspondaient pas aux prérequis réels ; les nœuds étaient placés de façon asymétrique.                     | Colonnes = profondeur de prérequis, lignes = domaines, comme dans l'atlas. Les liaisons sont calculées depuis `lesson.prerequisites` et le trait ne se déforme plus.                                                 |
| « Et si ? »              | « 0 » et « €/mois » se chevauchaient : la règle `:last-of-type` ne ciblait pas le bon champ.                                                              | Classe explicite `has-long-unit` posée selon la longueur de l'unité.                                                                                                                                                 |
| Recherche                | Aucun classement : une recherche « trésorerie » proposait d'abord « Et si ? ».                                                                            | `searchRank` / `rankSearchResults` (fonctions pures, testées) : titre exact, début de titre, mot du titre, titre, puis description. L'ordre déclaré départage les égalités. Une note se trouve par son propre texte. |
| Accueil                  | La légende « NO. 01 / Un nouveau point de vue. » était posée sur la vague, presque illisible et sans information.                                         | Supprimée.                                                                                                                                                                                                           |
| Mobile                   | Libellés coupés net (filtres, atlas, scénarios, trajectoire) sans signe qu'on peut faire défiler.                                                         | Fondu en bout de rangée et marge de fin.                                                                                                                                                                             |
| Focus clavier            | Contour de 2 px à 4 px d'écart : l'arrondi gonflait au-delà de 3/5/8 px.                                                                                  | 2 px à 2 px d'écart, token `--line-focus` ; contour intérieur dans les résultats de recherche.                                                                                                                       |

## Composition

| Zone                               | Constat                                                                                                                             | Correction                                                                                                                                                                                                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| En-têtes Académie, Lab, Atelier IA | Slogan géant sur deux lignes et accroche à droite : environ 350 px avant le contenu.                                                | Titre factuel sur une ligne au rôle `--type-page-fluid`, comme « Et si ? » et le portfolio. L'instrument remonte de 100 à 130 px sur desktop.                                                                         |
| Accueil                            | Le titre de la leçon apparaissait trois fois, le compteur 00/06 deux fois. Le bloc principal occupait tout le premier écran mobile. | Le compteur de la trajectoire est retiré. La trajectoire s'ouvre sur la notion suivante, pas sur la leçon déjà présentée. Bloc principal plus bas (460 px), titre au rôle `--type-stage-title`, relief mobile réduit. |
| Grands chiffres                    | Trois styles : Inter, monospace et Inter gris.                                                                                      | Les grands chiffres utilisent Inter, `--weight-figure`, `--tracking-figure` et des chiffres tabulaires. Le monospace reste réservé aux petites coordonnées.                                                           |
| Largeur                            | Pages projet et révisions plafonnées à 1 200 px (bord gauche décalé de 20 px), d'autres à 1 280 ou 1 320 px.                        | Token unique `--page-max` (1 366 px, cadre de `.main-content`).                                                                                                                                                       |

## Langue

Learn / Do / Prove / Apply deviennent Comprendre / Pratiquer / Démontrer / Appliquer. Academy devient Académie, Incubator devient Projets (nom déjà employé par le dock mobile), AI Lab devient Atelier IA. **Radar est conservé** : c'est un mot français, et « Veille » laisserait croire à une surveillance automatique que le produit exclut. Dans l'Atelier IA, « indice repéré » n'est plus répété sept fois : seul « à préciser » reste visible, l'état trouvé reste annoncé aux lecteurs d'écran.

Une phrase du contenu de la leçon « Structurer un prompt » nommait « AI Lab ». Elle nomme désormais « l'Atelier IA ». C'est un changement de nom d'écran, pas de fond pédagogique : la version du contenu n'est pas modifiée.

## Non traité dans cette passe

- Le fichier JavaScript principal (503 kB) n'est toujours pas découpé par écran.
- Environ 13 000 lignes de CSS et environ 35 `!important` restent à consolider.
- Les unités « € » du Lab restent alignées en bout de champ.

Les rendus et contrôles sont consignés dans [LATEST.md](LATEST.md).

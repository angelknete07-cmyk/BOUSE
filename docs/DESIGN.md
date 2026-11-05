# Direction artistique de BOUSE

## Exigence durable

BOUSE doit donner l’impression d’un logiciel professionnel sobre, actuel et haut de gamme. Sa palette de marque est presque entièrement noire, blanche et grise. La hiérarchie vient de la typographie, de l’espace, des niveaux de surface et de détails d’interaction précis.

**Le vert n’est pas une couleur de marque ni un accent décoratif.** Ne pas réintroduire de palette verte, violette ou bleue pour évoquer l’IA, distinguer des catégories ou remplir une interface. Une couleur sémantique n’est permise que lorsqu’elle transmet une information fonctionnelle : vert pour une réussite ou validation, rouge pour une erreur ou un danger, orange pour un avertissement.

Cette exigence s’applique aux nouveaux écrans, aux variantes de composants et aux illustrations comme aux écrans existants.

## Audit avant refactorisation

La feuille `src/styles.css` comportait 174 occurrences de couleurs hexadécimales et 160 valeurs distinctes. Les nuances olive étaient dispersées dans les composants ; remplacer le seul token d’accent n’aurait pas suffi.

| Zone                    | Écart identifié                                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Marque et onboarding    | Logo, favicon, titre, boutons et focus verts ; surfaces et textes teintés olive.                                                                |
| Navigation              | Sélection, recherche, avatar, progression et points décoratifs verts.                                                                           |
| Dashboard               | Grand aplat olive, orbites avec halo, progression et cartes de parcours colorées.                                                               |
| Academy et compétences  | Filtres, badges, bordures et textes secondaires teintés ; trop de cadres concurrents.                                                           |
| Leçon et quiz           | Exemples, flashcards et sélection de réponses verts avant toute validation ; retours pédagogiques verts même lorsqu’ils signalaient une erreur. |
| Lab et AI Lab           | Métriques, blocs de texte, champs et surfaces teintés ; coloration sans signification fonctionnelle.                                            |
| Recherche et paramètres | Palette et sous-sections portant leurs propres couleurs plutôt qu’un système partagé.                                                           |
| Interactions            | Quelques transitions locales, sans tokens de motion ; hiérarchie d’états hover, focus et pressed peu systématique.                              |

Le respect de `prefers-reduced-motion` existait déjà. La structure fonctionnelle et les parcours doivent être conservés pendant la correction artistique.

## Design system appliqué

Les valeurs de référence sont centralisées dans **`src/tokens.css`**, chargé avant les styles des composants. Les règles de composants doivent utiliser les tokens au lieu d’inventer de nouvelles couleurs, ombres, durées ou courbes.

### Couleurs et surfaces

- Fond profond : `#050505`, arrière-plan secondaire : `#09090A`.
- Surfaces successives : `#0D0D0F`, `#141416`, puis `#1A1A1D` pour une élévation exceptionnelle.
- Texte principal `#F3F2EE`, secondaire `#B4B4B9`, métadonnées `#9A9A9F`, accent argent `#D8D8DC`. `#626268` reste réservé aux grands indices décoratifs. Les petits textes utilisent un gris plus lisible.
- Accent éventuel blanc, gris froid ou argent discret. Le contraste, plutôt qu’une teinte colorée, identifie l’action principale.
- Séparateurs blancs à faible opacité ; contours plus présents uniquement lorsqu’ils servent l’interaction ou la compréhension.
- Aucun gradient coloré, néon ou halo décoratif. Une profondeur neutre très légère peut renforcer un élément sans devenir une illustration concurrente.

Les tokens de succès, d’erreur et d’avertissement restent séparés des tokens de marque. Une réponse sélectionnée n’est pas encore correcte : sa sélection reste neutre. La couleur de réussite apparaît après validation. Les textes, icônes et états doivent transmettre l’information indépendamment de la couleur.

### Typographie et espace

Définir des rôles cohérents : titre de page, titre de section, titre de composant, texte de lecture, contrôle, métadonnée et nombre financier. Employer des chiffres tabulaires pour les données financières. Garder un contraste suffisant pour la lecture ; la discrétion d’une métadonnée ne justifie pas son illisibilité.

Inter variable est chargée localement pour les titres, la lecture et les contrôles, avec adaptation optique automatique. Les titres principaux utilisent le rôle `--weight-display` (600), les titres de section `--weight-heading` (550), les grands nombres `--weight-figure` (450) et la lecture le poids régulier (400). Les approches `--tracking-display`, `--tracking-heading` et `--tracking-figure` évitent les lettres excessivement serrées. Les indices techniques conservent la pile monospace ; le monogramme garde sa police dédiée.

Utiliser une échelle d’espacement partagée pour les regroupements, séparations et marges de page. Un groupe s’identifie d’abord par sa proximité et son titre ; il ne nécessite pas systématiquement une carte bordée. Conserver des cibles tactiles confortables sur mobile.

### Radius et profondeur

Les rayons usuels sont **3, 5 et 8 px**, selon la taille et le rôle de l’élément. Les formes circulaires restent réservées aux avatars, points ou représentations réellement circulaires. Éviter les grands arrondis répétés.

Les ombres sont faibles et neutres. Les niveaux de noir et d’anthracite doivent porter l’essentiel de la profondeur. Réduire les contours superposés, notamment lorsque des panneaux contiennent déjà des badges, cartes ou sous-sections.

### Motion et états

Les mouvements servent la continuité, le contexte et le retour d’action. Centraliser durées et courbes : réponses rapides pour hover et pressed, entrée courte pour un changement d’état, easing non linéaire avec décélération naturelle. Un léger dépassement n’est pertinent que s’il apporte un retour tactile mesuré.

- Hover : changement subtil de contraste ou de surface.
- Pressed : déplacement ou réduction infime, immédiatement réactif.
- Focus clavier : repère net, neutre et visible, sans halo excessif.
- Navigation, quiz et progression : transition courte qui clarifie le changement.
- `prefers-reduced-motion: reduce` : supprimer les déplacements et animations non essentiels ; conserver les informations et retours d’action.

Aucune animation continue ne doit attirer inutilement l’attention pendant la lecture. Éviter les effets de sortie qui retardent une action ou donnent une impression de lenteur.

Les noms accessibles des actions doivent inclure leurs libellés visibles, y compris dans les cartes et graphes. Un intitulé complet peut compléter une abréviation via une description, sans remplacer son nom visible. Une commande réduite à une icône sur un breakpoint conserve un nom accessible. Les indices utiles restent contrastés ; les états de focus ne doivent pas être masqués par le dock mobile. Les instructions réservées aux lecteurs d’écran utilisent la classe commune `.sr-only`.

## Vérification

La refactorisation doit être contrôlée sur ordinateur et mobile pour : onboarding et diagnostic, dashboard, Academy, carte de compétences, leçon et quiz, Lab financier, AI Lab, Incubator, Radar, recherche et paramètres.

Vérifier les états initiaux, hover, focus, pressed, sélection, succès, erreur, avertissement et réduction des animations. Confirmer l’absence de débordement et le maintien des parcours fonctionnels.

La capture de référence fournie guide les contrastes noir/argent, la densité et les reliefs. L’accueil utilise une illustration topographique originale en SVG (`Terrain.tsx`), avec une animation de matière lente et de faible amplitude, désactivée avec `prefers-reduced-motion`. Les pages entrent avec une courte décélération ; boutons, navigation, choix et panneaux dépliables partagent les courbes des tokens.

La seconde passe remplace les KPI et l’anneau génériques par une trajectoire interactive, différencie visuellement Finance et IA, allège la navigation desktop et ajoute un dock mobile. Les leçons se présentent en séquences manipulables ; le quiz avance question par question. Le graphe de compétences utilise les prérequis réels et les preuves des dernières tentatives.

L’atelier de projet privilégie un dossier de travail : registre de tests, étapes numérotées et comparaison entre attente initiale et résultat observé. Éviter de transformer ces éléments en tuiles de KPI. Les surfaces neutres distinguent le plan et les faits ; les conclusions s’expriment en texte sans couleur dominante. Sur mobile, la comparaison devient séquentielle, l’introduction se resserre et les actions des formulaires restent accessibles au-dessus du dock.

Le mode « Et si ? » utilise un grand tracé comparatif monochrome et des mois sélectionnables pour expliquer le cash. La référence et le scénario se distinguent par le trait et les libellés ; le signe et le texte indiquent un besoin de financement sans grande surface rouge ou verte. Les hypothèses restent accessibles, les flux disposent d’une lecture tabulaire et l’ordre mobile rapproche le graphique des décisions.

Le portfolio utilise un registre de notions et de traces, relié aux dossiers existants. La sélection révèle les détails ; quiz, notes et projets se distinguent par leurs libellés et leur composition, sans score global ni palette par catégorie. Sur mobile, le registre devient une liste compacte et le détail conserve des actions accessibles. Les explorations fictives restent visuellement séparées des observations déclarées.

Le parcours de projet étend Repères avec une timeline d’apprentissage et un prochain pas dominant. Les objectifs choisis et les prérequis se distinguent par leurs libellés ; les quiz restent neutres visuellement. Le contexte de projet secondaire est repliable après le parcours afin de préserver l’accès mobile à l’action principale. L’éditeur d’objectifs utilise les mêmes surfaces, états de focus et tokens de mouvement.

La revue visuelle est obligatoire après toute modification importante. Voir `AGENTS.md`, `design-reviews/LATEST.md` et la commande `npm run review:render`. Les captures sont conservées dans le dépôt avec une paire stable desktop/mobile et un historique daté. La vérification interne et la validation design externe sont des étapes distinctes.

Les résultats des tests et de l’inspection des captures sont consignés dans `docs/VALIDATION.md`. La vérification porte sur le rendu réel dans Chromium desktop et mobile émulé ; elle ne constitue pas un test sur appareil physique.

## Passe 08 — scènes, atlas et instruments

La demande du 3 novembre arrête l’élargissement fonctionnel pour corriger la composition. L’audit de départ est dans [AUDIT-08.md](../design-reviews/AUDIT-08.md). La palette monochrome seule ne suffit pas : les grands nombres, les relations et les espaces composent l’écran.

- **Accueil** : une scène panoramique associe titre éditorial et relief SVG original. La progression reprend les quiz réels. La trajectoire flotte sous la scène ; Finance emploie des courbes activité/cash et IA un réseau, sans deux cadres jumeaux.
- **AI Lab** : le texte et son architecture occupent deux foyers. Sept repères sélectionnables révèlent les passages associés ; leur détection repose sur les règles locales existantes et des indices lexicaux, sans prétendre comprendre ou évaluer le prompt. Original et trame à compléter se lisent en parallèle. Sur mobile, Structure et Écrire partagent le même brouillon dans deux vues contextuelles.
- **Academy** : un atlas représente les six notions, trois domaines et leurs vrais prérequis. La sélection révèle une seule leçon ; le catalogue reste une présentation secondaire. Le défilement horizontal mobile et le recentrage interne préservent la carte sans élargir la page.
- **Leçon** : chapitre compact, vocabulaire composé, scène manipulable, explications numérotées, cas éditorial, atelier d’explication et quiz question par question. Sur mobile, la scène interactive précède le développement du concept ; le résumé redondant de l’en-tête est masqué.
- **Lab financier** : les contrôles habitent l’équation prix − coût = contribution. Le graphe ventes/coûts et le seuil sont proches des curseurs volume/charges ; l’équation mensuelle révèle le résultat. Les règles de calcul restent identiques.

La passe 08 utilisait Manrope pour les titres et grands nombres, remplacée par Inter à la passe 09 après retour utilisateur. Source et licence OFL de la police active sont documentées dans `public/fonts/`. Les couleurs, surfaces, échelles, rayons, ombres et courbes partent de `tokens.css`. `art-direction.css` rassemble ces compositions et leurs variantes mobiles ; ses règles spécifiques ne doivent pas détourner les classes des écrans secondaires.

La matière varie de quelques pixels sur 18 secondes avec une courbe non linéaire. Les nœuds et extraits ont des retours courts ; les points et tracés financiers suivent les paramètres. Les animations sont supprimées avec `prefers-reduced-motion`. Aucun effet ne doit introduire un délai dans un calcul ou une saisie.

La passe attend une review design externe avant de poursuivre les fonctionnalités. Les rendus précédents restent archivés ; `design-reviews/LATEST.md` relie chaque écran avant/après.

## Passe 09 — correction typographique

Le retour utilisateur porte sur la police. L’audit relève des titres Manrope très fins, des approches allant jusqu’à −0,07 em et une référence à Inter dans la pile de texte sans fichier Inter chargé. Le remplacement unifie l’interface autour d’une Inter variable auto-hébergée et préchargée. Les titres gagnent en poids et en espacement, les nombres gardent un poids intermédiaire et les textes de lecture restent réguliers. Les réglages sont centralisés pour les cinq écrans prioritaires et les composants communs. La composition, la palette, les animations et la logique métier sont conservées. Les nouveaux rendus sont comparés à la passe 08 dans `design-reviews/LATEST.md`.

## Passe 11 — corrections du diagnostic de reprise

Le diagnostic de reprise du 5 novembre a relevé des défauts visibles et une composition trop uniforme. L'utilisateur a demandé de tout corriger. Le détail est dans [AUDIT-11.md](../design-reviews/AUDIT-11.md).

- **Pages de travail** : l'Académie, le Lab et l'Atelier IA ouvrent sur un titre factuel d'une ligne (`--type-page-fluid`) et une phrase utile, pas sur un slogan de deux lignes. L'accueil garde sa scène, plus compacte (`--type-stage-title`).
- **Graphes de relations** : un nœud est ancré par le centre de son cercle, pas par le centre de son bloc. L'atlas et la trajectoire partagent la même grammaire (colonnes = profondeur des prérequis, lignes = domaines) et leurs liaisons viennent des prérequis réels.
- **Chiffres** : un seul style pour les grands nombres, Inter avec `--weight-figure`, `--tracking-figure` et chiffres tabulaires. Le monospace reste réservé aux petites coordonnées et indices.
- **Largeur** : toutes les racines de page utilisent `--page-max`.
- **Défilement horizontal mobile** : une rangée qui défile se termine par un fondu (`mask-image`) et une marge de fin, jamais par un libellé coupé net.
- **Focus** : contour de 2 px à 2 px d'écart avec `--line-focus` ; contour intérieur dans les listes à fond sélectionné.
- **Langue** : libellés en français (Comprendre / Pratiquer / Démontrer / Appliquer, Académie, Projets, Atelier IA). Radar est conservé : « Veille » suggérerait une surveillance automatique.

La passe attend une review design externe avant de poursuivre les fonctionnalités.

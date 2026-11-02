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

- Fond presque noir : `#0b0b0c`.
- Surfaces successives : `#111113`, `#171719`, puis gris anthracite légèrement relevé pour les éléments interactifs.
- Texte principal blanc cassé ; texte secondaire et métadonnées en gris neutre.
- Accent éventuel blanc, gris froid ou argent discret. Le contraste, plutôt qu’une teinte colorée, identifie l’action principale.
- Séparateurs blancs à faible opacité ; contours plus présents uniquement lorsqu’ils servent l’interaction ou la compréhension.
- Aucun gradient coloré, néon ou halo décoratif. Une profondeur neutre très légère peut renforcer un élément sans devenir une illustration concurrente.

Les tokens de succès, d’erreur et d’avertissement restent séparés des tokens de marque. Une réponse sélectionnée n’est pas encore correcte : sa sélection reste neutre. La couleur de réussite apparaît après validation. Les textes, icônes et états doivent transmettre l’information indépendamment de la couleur.

### Typographie et espace

Définir des rôles cohérents : titre de page, titre de section, titre de composant, texte de lecture, contrôle, métadonnée et nombre financier. Employer des chiffres tabulaires pour les données financières. Garder un contraste suffisant pour la lecture ; la discrétion d’une métadonnée ne justifie pas son illisibilité.

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

## Vérification

La refactorisation doit être contrôlée sur ordinateur et mobile pour : onboarding et diagnostic, dashboard, Academy, carte de compétences, leçon et quiz, Lab financier, AI Lab, Incubator, Radar, recherche et paramètres.

Vérifier les états initiaux, hover, focus, pressed, sélection, succès, erreur, avertissement et réduction des animations. Confirmer l’absence de débordement et le maintien des parcours fonctionnels.

La capture de référence fournie guide les contrastes noir/argent, la densité et les reliefs. L’accueil utilise une illustration topographique originale en SVG (`Terrain.tsx`), avec une animation de matière lente et de faible amplitude, désactivée avec `prefers-reduced-motion`. Les pages entrent avec une courte décélération ; boutons, navigation, choix et panneaux dépliables partagent les courbes des tokens.

La seconde passe remplace les KPI et l’anneau génériques par une trajectoire interactive, différencie visuellement Finance et IA, allège la navigation desktop et ajoute un dock mobile. Les leçons se présentent en séquences manipulables ; le quiz avance question par question. Le graphe de compétences utilise les prérequis réels et les preuves des dernières tentatives.

L’atelier de projet privilégie un dossier de travail : registre de tests, étapes numérotées et comparaison entre attente initiale et résultat observé. Éviter de transformer ces éléments en tuiles de KPI. Les surfaces neutres distinguent le plan et les faits ; les conclusions s’expriment en texte sans couleur dominante. Sur mobile, la comparaison devient séquentielle, l’introduction se resserre et les actions des formulaires restent accessibles au-dessus du dock.

Le mode « Et si ? » utilise un grand tracé comparatif monochrome et des mois sélectionnables pour expliquer le cash. La référence et le scénario se distinguent par le trait et les libellés ; le signe et le texte indiquent un besoin de financement sans grande surface rouge ou verte. Les hypothèses restent accessibles, les flux disposent d’une lecture tabulaire et l’ordre mobile rapproche le graphique des décisions.

Le portfolio utilise un registre de notions et de traces, relié aux dossiers existants. La sélection révèle les détails ; quiz, notes et projets se distinguent par leurs libellés et leur composition, sans score global ni palette par catégorie. Sur mobile, le registre devient une liste compacte et le détail conserve des actions accessibles. Les explorations fictives restent visuellement séparées des observations déclarées.

La revue visuelle est obligatoire après toute modification importante. Voir `AGENTS.md`, `design-reviews/LATEST.md` et la commande `npm run review:render`. Les captures sont conservées dans le dépôt avec une paire stable desktop/mobile et un historique daté. La vérification interne et la validation design externe sont des étapes distinctes.

Les résultats des tests et de l’inspection des captures sont consignés dans `docs/VALIDATION.md`. La vérification porte sur le rendu réel dans Chromium desktop et mobile émulé ; elle ne constitue pas un test sur appareil physique.

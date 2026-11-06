# Review design — passe 02

**Rendus du 2 novembre 2026 à 22:03, Europe/Paris.**

**Statut : passe acceptée par l’utilisateur, poursuite autorisée.** Après présentation de ces rendus, l’utilisateur a répondu : « OK, bah c’est parti pour la suite alors. » Cet accord valide la poursuite sur cette base visuelle. Il ne constitue pas une review indépendante réalisée par un autre ChatGPT.

## Ouvrir les rendus

- [Desktop — viewport 1440 × 1000](latest-desktop.png)
- [Mobile — viewport CSS 412 × 839, Pixel 7 émulé](latest-mobile.png)
- [Accueil complet desktop](screens/desktop/01-home.png) · [mobile](screens/mobile/01-home.png)
- [Leçon interactive desktop](screens/desktop/03-lecon-learn.png) · [mobile](screens/mobile/03-lecon-learn.png)
- [Quiz et feedback desktop](screens/desktop/04-quiz-feedback.png) · [mobile](screens/mobile/04-quiz-feedback.png)
- [Teach-back desktop](screens/desktop/03-teach-back.png) · [mobile](screens/mobile/03-teach-back.png)
- [Graphe de compétences desktop](screens/desktop/09-competences.png) · [mobile](screens/mobile/09-competences.png)

La galerie `screens/` couvre aussi onboarding, Academy, résultat du quiz, Lab financier, AI Lab, Incubator et son erreur de formulaire, Radar, sélection d’un autre nœud de compétences, recherche et paramètres. **35 PNG** proviennent de la dernière exécution réussie. Les fichiers `latest-*` montrent le viewport réel ; les fichiers des écrans comprennent aussi des captures de page complète. Les éléments fixes de navigation apparaissent à la position du viewport dans les images de page complète : utiliser la paire `latest-*` pour juger le premier écran mobile.

Les images mobiles sont enregistrées à l’échelle native du profil Playwright (2,625 pixels par pixel CSS), d’où des dimensions PNG supérieures au viewport CSS. Le profil affiché est explicitement **« Profil démo »**. « Camille » n’est présent que dans les fixtures des tests fonctionnels et dans l’archive de la passe précédente ; aucun prénom n’est codé en dur dans `src/`.

## Changements et comparaison

| Zone          | Passe précédente                                             | Passe actuelle                                                                                                 |
| ------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Cadre desktop | Sidebar large, séparateur vertical et répétition de panneaux | Rail discret sans cadre, espace principal élargi et lumière neutre très légère                                 |
| Accueil       | Héro, anneau de pourcentage et bande de KPI                  | Héro topographique animé lentement, trajectoire à six nœuds sélectionnables et action suivante contextualisée  |
| Finance / IA  | Deux cartes de composition très proche                       | Lecture comptable et matière verticale pour Finance ; réseau contexte/modèle/vérification pour IA              |
| Compétences   | Six cartes indépendantes                                     | Graphe des prérequis réels, état issu du dernier quiz et panneau contextuel unique                             |
| Leçon         | Tous les paragraphes affichés successivement                 | Séquences courtes : concept, outil manipulable, approfondissement, situation fictive, teach-back et synthèse   |
| Quiz          | Radios classiques, deux questions empilées                   | Choix à lettres, une question à la fois, progression, validation, explication et bilan consultable             |
| Mobile        | Desktop essentiellement empilé                               | Dock accessible en bas, trajectoire et univers balayables, sélecteur de séquence, carnet et sources repliables |
| Couleurs      | Neutres avec plusieurs confirmations vertes                  | Succès courants en gris ; erreurs et avertissements ponctuels uniquement                                       |

La comparaison visuelle a été faite avec [l’accueil desktop précédent](archive/2026-11-02-pass-01/desktop/surfaces/01-home.png) et [la leçon précédente](archive/2026-11-02-pass-01/desktop/gallery/03-lecon-learn.png), puis avec leurs versions mobiles. L’archive de cette passe est `archive/2026-11-02_22-03-08-Europe-Paris/`.

## Contrôles effectués

- Application réellement lancée avec Vite sur le port 5173 ; captures prises dans Chromium, aucune image de maquette substituée.
- Inspection des rendus de l’accueil, de la leçon, du quiz, du teach-back et du graphe : hiérarchie des titres, rythme de lecture, profondeur neutre, espaces, largeur mobile et accès aux actions.
- Ajustements issus de cette inspection : séparation des styles de l’accueil et de la leçon, réduction de l’illustration Finance sur mobile, libellé du réseau IA contenu dans son cadre, action de séquence placée au-dessus du dock mobile, icônes SVG cohérentes.
- Trajectoire et graphe réellement sélectionnables ; manipulation du délai client distinguant résultat et cash ; teach-back explicitement autoévalué, sans modèle IA ni score automatique inventé.
- Quiz réussi et échoué, absence de double soumission, progression conservée au rechargement, projet appliqué et modifié, export/import explicite.
- Transitions non linéaires, états hover/focus/pressed et respect de `prefers-reduced-motion`. La matière graphique ne bouge que de quelques pixels avec une variation d’échelle faible ; elle s’immobilise avec la réduction des mouvements.
- **Compilation et TypeScript réussis, 33 tests unitaires réussis, 12 tests navigateur réussis**, aucun test ignoré. Les tests vérifient aussi les couleurs neutres et l’absence de débordement horizontal.

Le manifeste `render-manifest.json` conserve les empreintes des sources et des PNG, les viewports, les heures de capture et le résultat du run. Le script refuse une capture manquante ou antérieure aux sources.

## Points à examiner dans la review externe

La signature topographique, le rail desktop, la densité de la trajectoire, la distinction des deux univers, le rythme des séquences et le dock mobile sont prêts à être jugés avec les images ci-dessus. La qualité perçue et l’identité de marque restent des sujets de review : les tests ne valent pas approbation artistique.

Les animations sont exercées dans l’application ; une capture fixe ne les restitue pas. Mobile émulé dans Chromium, sans validation sur appareil physique ou Safari. Les cas chiffrés sont pédagogiques et fictifs ; aucune entreprise réelle ou vidéo de cours n’est simulée.

## Accès pour la review externe

Le code, les rendus stables, la galerie, les archives et ce compte rendu sont versionnés sur la branche GitHub **`codex/learning-design-review`** du dépôt **`angelknete07-cmyk/BOUSE`**. La publication de cette branche a été confirmée par Git. Un autre ChatGPT chargé du Product Design doit lire ce fichier sur cette branche puis examiner les PNG avec les composants correspondants. La poursuite a été **autorisée par l’utilisateur** après présentation de cette passe. Aucune review indépendante par un autre ChatGPT n’est revendiquée.

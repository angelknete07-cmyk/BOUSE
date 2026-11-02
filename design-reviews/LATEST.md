# Review design — passe 06 : portfolio d’apprentissage

**Rendus du 2 novembre 2026 à 23:27, Europe/Paris.**
**Statut : vérification interne effectuée ; nouveaux rendus à examiner.**

L’utilisateur a autorisé la suite de la passe 05 avec « GO ». Cette étape consolide les traces déjà enregistrées, sans ajouter de nouveau stockage. Aucune validation indépendante ni acceptation de la passe 06 n’est revendiquée.

## Rendus à examiner

- [Desktop, viewport 1440 × 1000](latest-desktop.png) · [Mobile, viewport CSS 412 × 839](latest-mobile.png)
- [Registre et détail — desktop](screens/desktop/14-portfolio-overview.png) · [mobile](screens/mobile/14-portfolio-overview.png)
- [Dossiers et explorations — desktop](screens/desktop/14-portfolio-projects.png) · [mobile](screens/mobile/14-portfolio-projects.png)
- [Notes — desktop](screens/desktop/14-portfolio-notes.png) · [mobile](screens/mobile/14-portfolio-notes.png)
- [Dossier vide — desktop](screens/desktop/14-portfolio-empty.png) · [mobile](screens/mobile/14-portfolio-empty.png)
- [Accès depuis la carte — desktop](screens/desktop/09-competences.png) · [mobile](screens/mobile/09-competences.png)

**79 captures réelles**, incluant les autres écrans existants. La paire latest montre le registre des notions ; sélectionner une ligne révèle les traces associées. Sur mobile, ce détail reçoit le focus et défile dans la zone visible. Pixel 7 émulé, échelle 2,625. Les pages complètes montrent le dock fixe à la limite du premier viewport ; la paire latest représente le premier écran réel. Toutes les données sont fictives et destinées à la démonstration.

## Audit et changements

Les quiz, notes, projets, observations et simulations étaient répartis entre les espaces. La carte montrait les prérequis mais n’offrait pas de dossier commun exportable. Certains écrans utilisaient également l’ordre du tableau importé pour déterminer le « dernier quiz ».

- Accès depuis **Mes compétences → Ouvrir mon portfolio**, ainsi que depuis la recherche. Le portfolio reste rattaché à cet espace, sans ajouter une nouvelle entrée dans la navigation principale.
- Registre de six notions, état du quiz courant, présence de notes et liens vers les dossiers. La sélection révèle la dernière tentative, les repères, les notes et les applications reliées.
- Onglets **Notions / Projets & explorations / Notes**. Les observations et bilans sont déclaratifs ; les simulations sont présentées séparément comme explorations fictives.
- Export d’un fichier Markdown utilisable dans Obsidian : versions, historique, notes hors catalogue, dossiers, observations, bilans et hypothèses de simulation. La date est celle de l’export ; aucune date de note ou vérification de contenu n’est inventée.
- Le registre devient une liste compacte sur mobile. Les contrastes, surfaces, rayons, typographie et mouvements reprennent les tokens centraux. Aucun accent coloré décoratif ni score de certification.
- Consulter, sélectionner, changer d’onglet ou exporter ne crée ni progression ni nouvelle donnée.

## Comparaison et corrections

Comparer l’[ancienne carte](archive/2026-11-02_23-06-07-Europe-Paris/screens/desktop/09-competences.png) à son accès au portfolio : le graphe garde son rôle de carte, tandis que le nouveau registre relie les notions aux traces personnelles et aux dossiers. L’[archive de la passe 05](archive/2026-11-02_23-06-07-Europe-Paris/LATEST.md) conserve la base précédente.

La première inspection a corrigé les accords des repères avec un compteur égal à un. Les nouveaux rendus ont été produits ensuite. Desktop : registre et volet se lisent côte à côte ; mobile : liste et détail se succèdent avec des contrôles accessibles. Hiérarchie, spacing, surfaces, sélection, notes multilignes et états vides ont été inspectés ; aucun débordement observé.

La règle de quiz est désormais commune à l’accueil, aux prérequis, à la carte, au résumé de leçon et au portfolio : dernière tentative chronologique admissible de la version courante, anciennes versions et dates invalides/futures conservées en archives. Une réussite suivie d’un échec reste « À reprendre ».

L’audit a aussi corrigé l’horloge : une tentative soumise entre deux rafraîchissements ne doit pas sembler future. Un parcours réel avance la date de dix secondes puis soumet le quiz ; le résultat apparaît immédiatement dans la leçon, sans attendre le tick d’une minute.

## Contrôles et limites

**Compilation/TypeScript, 121 cas unitaires et 38 tests navigateur réussis, aucun test ignoré.** Les parcours couvrent navigation, cohérence des quiz, dossiers, notes hors catalogue, téléchargement Markdown, données inchangées et soumission entre deux ticks. Le bundle de production et ses ressources ont été reçus et comparés aux fichiers compilés.

Contrôle autonome : flèches/Home/End pour les onglets, Tab/Entrée pour les notions, focus visible et transfert au détail mobile. Entrée du contenu mesurée à 360 ms, opacité de 0 à 1 et déplacement de 5 px, avec easing non linéaire. Les lignes utilisent les transitions des tokens. `prefers-reduced-motion` rend l’affichage immédiat, sans animation ni transition. Aucune erreur JavaScript observée dans ce contrôle.

Le portfolio n’est pas un diplôme. Notes et conclusions restent personnelles, les rappels sont autoévalués et les simulations hypothétiques. Les exercices et teach-back non conservés ne sont pas présentés comme réalisés. Le Markdown sert à lire les traces ; le JSON reste le format de restauration. Aucun coffre Obsidian n’est ouvert ou synchronisé.

Données locales au navigateur, sans compte ni synchronisation entre appareils. Mobile émulé dans Chromium, sans appareil physique, Safari, vidéo ou mesure GPU. Les captures fixes et les vérifications internes ne remplacent pas la review design externe.

## Reproduire

Lancer `npm run test:e2e`, puis `npm run review:save -- --primary=14-portfolio-viewport`. Le script refuse les images antérieures aux sources ou issues d’un run échoué. Le manifeste conserve les empreintes des sources/PNG, les viewports et le résultat du run.

Archive actuelle : `archive/2026-11-02_23-27-21-Europe-Paris/`. Examiner `LearningPortfolio.tsx`, `learning-portfolio.css`, `portfolio.ts`, `useClock.ts` et les intégrations du helper de quiz dans les écrans existants. Code et rendus destinés à la branche `codex/learning-design-review` du dépôt `angelknete07-cmyk/BOUSE` ; synchronisation vérifiée à la livraison.

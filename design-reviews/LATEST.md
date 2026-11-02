# Review design — passe 05 : laboratoire « Et si ? »

**Rendus du 2 novembre 2026 à 23:06, Europe/Paris.**
**Statut : vérification interne effectuée ; nouveaux rendus à examiner.**

L’utilisateur a autorisé la suite de la passe 04 avec « SUIT ». Cette étape ajoute une expérience financière sur six mois. Aucune validation indépendante ni acceptation de la passe 05 n’est revendiquée.

## Rendus à examiner

- [Desktop, viewport 1440 × 1000](latest-desktop.png) · [Mobile, viewport CSS 412 × 839](latest-mobile.png)
- [Paiements retardés — desktop](screens/desktop/13-simulation-default.png) · [mobile](screens/mobile/13-simulation-default.png)
- [Coûts fournisseurs — desktop](screens/desktop/13-simulation-scenario.png) · [mobile](screens/mobile/13-simulation-scenario.png)
- [Comparaison sauvegardée — desktop](screens/desktop/13-simulation-saved.png) · [mobile](screens/mobile/13-simulation-saved.png)
- [Accès depuis le Lab — desktop](screens/desktop/05-lab-financier.png) · [mobile](screens/mobile/05-lab-financier.png)

**69 captures réelles**, incluant les autres écrans existants. La paire latest montre le scénario fictif « Paiements retardés ». Les pages complètes incluent les flux, la comparaison du résultat et du cash, les hypothèses et les sauvegardes. Pixel 7 émulé, échelle 2,625. Dans une capture de page complète, le dock fixe apparaît à la limite du premier viewport : la paire latest montre le premier écran réel. Données de démonstration, sans historique personnel inventé.

## Audit et changements

Le Lab précédent calculait un mois de rentabilité, avec une référence temporaire. Il n’expliquait pas les décalages d’encaissement et ne conservait pas les hypothèses de deux scénarios. Son calculateur reste accessible ; l’expérience « Et si ? » prolonge ce travail.

- Grande courbe comparative monochrome : référence en pointillé, scénario en trait plein, six fins de mois sélectionnables et détail des flux.
- Scénarios modifiables : paiements retardés, perte de volume client, coûts fournisseurs, recrutement et hausse de prix. Aucun effet de prix sur la demande n’est inventé.
- Résultat cumulé, cash, créances et besoin théorique de financement expliqués séparément, avec identité comptable visible et tableau des flux.
- Sauvegarde de la référence, des changements et de la version du modèle ; charger une copie ne réécrit pas l’original. Export Markdown avec hypothèses exactes, calculs et limites ; export/import JSON compatible avec les anciennes sauvegardes.
- Composition portée par le graphique, la typographie et les surfaces des tokens existants. Aucun accent coloré décoratif. Sur mobile : scénarios horizontaux, pupitre en deux colonnes et comparaison adaptée à la largeur.
- Les simulations ne changent pas les observations terrain, les quiz ou les compétences.

## Comparaison et corrections

Comparer l’[ancien Lab financier](archive/2026-11-02_22-47-00-Europe-Paris/screens/desktop/05-lab-financier.png) à la nouvelle expérience : la courbe et le choix d’un mois rendent la relation résultat/encaissement directement manipulable. Les autres univers conservent leur composition.

L’audit a corrigé un arrondi de produit décimal : `1.005 × 3` doit donner `3.02`, et non `3.01`. Le modèle calcule désormais produits et variations en décimal exact avant arrondi au centime. L’export conserve les hypothèses numériques sans perte de précision. Les points et boutons du graphique ont aussi été alignés sur les mêmes abscisses.

Le [premier rendu mobile](archive/2026-11-02_23-03-19-Europe-Paris/latest-mobile.png) répétait des montants trop serrés sous les six mois. La version actuelle garde uniquement les noms des mois à cet endroit ; le montant précis figure dans le détail sélectionné. La suite complète et les captures ont été relancées après cette correction. Cette comparaison conserve une trace concrète de l’inspection interne.

Inspection desktop/mobile effectuée : noirs et gris cohérents, titres distincts des métadonnées, profondeur discrète de la scène, courbes différenciées sans couleur, contrôles lisibles et absence de débordement observé. Sélection, focus, survol, sauvegarde, chargement et export ont été exercés dans l’application. Les mouvements utilisent les courbes des tokens : point 220 ms, formulaire 360 ms ; `prefers-reduced-motion` supprime les transitions et déplacements. Le hover mobile a été exercé avec un pointeur émulé, sans prétendre à un geste tactile.

## Contrôles et limites

**Compilation/TypeScript, 101 cas unitaires et 30 tests navigateur réussis, aucun test ignoré.** Les parcours couvrent délai client sans changement du bénéfice, flux mensuels, entrée vide, hypothèses immuables, rechargement, exports et imports ancien/invalide. Les tests métier vérifient aussi l’identité cash/résultat/créances et les arrondis. Le bundle de production et ses ressources ont été reçus et comparés aux fichiers compilés.

Le correctif d’export avec titre vide a été exercé : alerte sans téléchargement ni erreur JavaScript, puis téléchargement Markdown réussi après saisie d’un titre valide.

Le cas commence au mois 1 sans créances initiales, avec ventes constantes et dépenses payées le mois de la vente. Les encaissements se décalent par mois entiers. Les variations à l’intérieur du mois, TVA, impôts, stocks, investissements, dette, intérêts, impayés et capacité ne sont pas modélisés. Un solde négatif indique un besoin théorique de financement ; aucun financement automatique ou risque de faillite chiffré n’est inventé.

Données locales au navigateur, sans compte ni synchronisation. Mobile émulé dans Chromium, sans appareil physique, Safari, vidéo ou mesure GPU. Les captures fixes et la vérification interne ne remplacent pas la review design externe.

## Reproduire

Lancer `npm run test:e2e`, puis `npm run review:save -- --primary=13-simulation-viewport`. Le script refuse les images antérieures aux sources ou issues d’un run échoué. Le manifeste conserve les empreintes des sources/PNG, les viewports et le résultat du run.

Archive actuelle : `archive/2026-11-02_23-06-07-Europe-Paris/`. Examiner `SimulationLab.tsx`, `simulation-lab.css`, `simulation.ts` et la validation d’import dans `storage.ts`. Code et rendus destinés à la branche `codex/learning-design-review` du dépôt `angelknete07-cmyk/BOUSE` ; synchronisation vérifiée à la livraison.

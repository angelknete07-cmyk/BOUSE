# Review design — V4 : la DA des planches de A à Z

**6 novembre 2026, soir.** **La direction artistique n'est pas déclarée validée.** Paire principale : leçon (`03-lecon-learn-viewport`).

- **Une seule grammaire visuelle partout** (fin de `src/console.css`) : pastilles d'icônes en relief (objectifs, domaines, compétences, projets, portfolio, actions de leçon, tuiles) qui s'éclairent de violet au survol ; curseurs à piste violette ; anneaux violet → cyan avec halo léger ; courbes principales violettes lumineuses, flux de trésorerie en cyan, références en gris ; barres et jauges en dégradé violet.
- **Leçons** : onglet actif souligné de violet, points de séquence et point actif du fil lumineux, quiz en cours et orbite du résultat violets.
- **Académie, compétences, trajectoire** : étape suivante, nœud choisi et liens actifs en violet ; notions acquises en vert.
- **Contraste** : numéro du fil de leçon en encre sombre sur le violet (le test d'accessibilité a refusé le blanc à 2,9:1).
- **Contrôles de l'agent** : `npm test` 245 cas, `npx playwright test` 86 tests (contrastes axe compris), Prettier, build ; galerie régénérée ; 0 débordement à 320 px sur 13 pages.
- **Limites** : les 43 scènes reçoivent la DA par leurs classes communes, sans retouche une par une ; pas de vrai téléphone ni de validation externe.

---

# Review design — V4 jalon D : la DA des planches dans toute l'application

**6 novembre 2026, 17 h 32 Europe/Paris.** **La direction artistique n'est pas déclarée validée.**

- **La vague partout, avec mesure** : la même vague (`Terrain.tsx`, empreinte inchangée) en tête des pages d'outils (compétences, révisions, Lab, scénarios, Atelier IA, projets, sources, lexique, préférences), très atténuée ; pas dans les leçons (lecture). Lumière violette puis cyan sur la crête par une **copie colorée de la même vague** masquée autour de la crête (aucun mélange de calques, donc aucune tache) ; même lumière sur la vague de l'Académie.
- **Honnêteté** : « C'est acquis » → « Quiz réussi » ; Atelier IA « 100 / 100 » → « 6 / 6 critères ».
- **Onboarding** : logo « B » argenté à la place de l'ancien « b. ».
- **Mobile** : Lab, une commande par rangée ; Scénarios, fondu au bord des cas pour montrer qu'ils défilent.
- **Contrôles de l'agent** : `npm test` 245 cas, `npx playwright test` 86 tests, Prettier, build ; galerie régénérée (archive `2026-11-06_17-32-33-Europe-Paris`) ; 0 débordement à 320 px sur 13 pages.
- **Restent** (voir `V4_INVENTORY.md`) : Académie mobile (reprise après les onglets), compétences mobile (3 cartes avant la carte), en-tête de leçon compact, onboarding en 2 étapes, paramètres (export en tête). Pas de vrai téléphone ni de validation externe.

---

# Review design — V4 : accueil B adopté, couleurs des planches de l'utilisateur

**6 novembre 2026, 17 h 22 Europe/Paris.** **La direction artistique n'est pas déclarée validée.**

- Choix de l'utilisateur : **accueil B** (panneau « Votre séance » avec le plan réel), devenu la version par défaut ; variantes A et C retirées du code.
- Puis correction de l'utilisateur : couleurs rapprochées de ses planches (violet `#9B87F5`, cyan `#56C4E8`, vert `#5ECD96`, lueurs × 0,6) ; la vague reste celle de `Terrain.tsx` (empreinte inchangée), éclairée de violet puis cyan sur la crête par un calque CSS en mode « multiply » (le noir reste noir).
- Inter avec plancher 12 px pour les textes utiles ; Manrope écarté et retiré.
- Corrections : régression trouvée par les tests (le détail « séquences 3 à 7 » réaffiché dans le panneau) ; test clavier des onglets stabilisé (attente du focus du panneau).
- **Contrôles de l'agent** : `npm test` 245 cas, `npx playwright test` 86 tests, Prettier, build ; galerie régénérée (archive `2026-11-06_17-22-31-Europe-Paris`) ; 0 débordement à 320 px sur 14 pages.
- **Limites** : les autres pages ont pris les nouvelles couleurs et tailles par les jetons, sans retouche page par page (jalon D) ; pas de vrai téléphone ; pas de validation externe.

---

# Review design — V4, jalons A, B et C (en attente du choix de l'utilisateur)

**6 novembre 2026, sur le Mac.** **La direction artistique n'est pas déclarée validée.** Aucun changement visible par défaut, sauf deux corrections de débordement à 320 px.

- **Jalon A** — [V4_INVENTORY.md](V4_INVENTORY.md) : 312 captures du pack reprises une par une ([tableau](v4/V4_INVENTORY_CAPTURES.csv)), constats mesurés, registre de préservation, contrastes.
- **Jalon B** — [V4_STYLE_SAMPLES.md](V4_STYLE_SAMPLES.md) : accents centralisés (canaux RGB + coefficients de lueur/voile), essais `?palette=apaisee`, `?type=manrope|affine`, page interne `#labo-design` (développement seulement). Recommandé : palette apaisée + Inter affiné ; Manrope écarté.
- **Jalon C** — [V4_HOME_VARIANTS.md](V4_HOME_VARIANTS.md) : trois accueils réels `?da=a|b|c`, même vague, mêmes données ; planches dans `v4/jalon-c/comparaisons/`.
- **Corrections** : Préférences et Académie ne débordent plus à 320 px (`minmax(0, 1fr)`).
- **Contrôles de l'agent** : rendu par défaut identique au pixel près (18 captures), `npm test` 249 cas, build, Prettier, 0 débordement à 320 px. `npx playwright test` 86 tests passés (bureau et mobile) ; 52 combinaisons pages × versions sans débordement à 320 px.
- **Limites** : pas de vrai téléphone, pas de test avec des débutants, pas de validation externe. Les autres pages ne changent qu'après le choix.

---

# Review design — passe 32 : planche 03, accueil en tableau de bord, graphiques premium

**6 novembre 2026, 15:35 Europe/Paris.** Détail : [AUDIT-32.md](AUDIT-32.md). **La direction artistique n'est pas déclarée validée.**

- Suite au retour de l'utilisateur (planche 03 préférée, garder la vague et l'existant, travailler couleurs et graphiques) :
  - barre latérale large avec le « B » argenté ;
  - recherche dans l'en-tête ;
  - accueil en tableau de bord : leçon avec la vague, anneau de progression, 4 tuiles, « Mon parcours », activité.
- Courbes et graphiques en violet lumineux, aires en dégradé, progressions violet → bleu, réussite en émeraude.
- **Contrôles de l'agent** : `npm test` 245 cas, `npx playwright test` 86 tests, Prettier, build sans avertissement.
- **Captures** :
  - paire principale = accueil (`00-home-viewport`) ;
  - avant/après dans `console-32/` ;
  - archive `2026-11-06_15-35-30-Europe-Paris`.
- **Limites** : composition de la leçon inchangée (couleurs seulement) ; curseurs argent.

---

# Review design — passe 31 : accents colorés subtils (brief V3.2)

**6 novembre 2026, 15:11 Europe/Paris.** Détail : [AUDIT-31.md](AUDIT-31.md). **La direction artistique n'est pas déclarée validée ; la rétention n'est pas mesurée.**

- **Règle modifiée et écrite avant implémentation** (`AGENTS.md`, `docs/DESIGN.md`) : de rares accents désaturés sont permis, une seule couleur dominante par écran (lavande `#9B8ACB`), uniquement sur des marques fines (progression, courbe ou point sélectionné, étape active). Aucun aplat, bouton, carte ni texte coloré. Glacier et teal sont définis mais non employés.
- **Leçon desktop** : la scène est de nouveau en regard de l'explication (elle était repoussée dans une colonne étroite).
- **Accueil** : progression en compétences (10 / 138 sur le profil de démonstration) et activité réelle sur 7 jours, sans série à tenir ; carte en double retirée.
- **Académie** : « Que voulez-vous apprendre ? » ; étape à faire marquée en lavande, libellé neutre.
- **Et si ?** : carte imbriquée du graphique retirée, légende accordée à la courbe.
- **README** corrigé (43 leçons, diagnostic de cinq questions, cinq parcours).
- **Contrôles de l'agent** : `npm test` 245 cas, `npx playwright test` 86 tests (puis design et e2e relancés après la dernière retouche : 34 tests), Prettier, build sans avertissement.
- **Captures** :
  - paire principale `latest-desktop.png` / `latest-mobile.png` = leçon (`03-lecon-learn-viewport`) ;
  - avant/après : `accents-31/avant/`, `accents-31/apres/`, planches `accents-31/comparaisons/` (desktop 1440 × 1000, Pixel 7) ;
  - archive `2026-11-06_15-11-22-Europe-Paris`.
- **Limites** :
  - quiz (banque plus large, options mélangées) et diversité des formats d'activité : après review ;
  - la barre de parcours de l'accueil compte encore les notions ;
  - aucun test sur appareil réel ni avec des débutants (protocole proposé dans l'audit).

---

# Review design — passe 30 : parcours, entraînement, vérification, fiches

**6 novembre 2026.** Détail : [AUDIT-30.md](AUDIT-30.md). **La direction artistique n'est pas déclarée validée.**

- **Cinq parcours par objectif** à suivre depuis l'Académie ; la prochaine leçon suit alors leur ordre.
- **Entraînement libre** à partir du lexique, sans aucun enregistrement.
- **Date de vérification** sur les 14 leçons à règles datées, avec un avertissement au-delà de 12 mois.
- **Quatre fiches pratiques** à télécharger.
- **Contrôles** : `npm test` 245 cas, `npx playwright test` 86 tests, build sans avertissement.
- **Captures** : `passe-30/` (desktop 1440 × 1000, Pixel 7).

---

# Review design — passe 29 : une scène dans chaque leçon

**6 novembre 2026, 11:49 Europe/Paris.** Détail : [AUDIT-29.md](AUDIT-29.md). **La direction artistique n'est pas déclarée validée.**

- **43 leçons sur 43 ont une scène interactive**, contre 11 avant la passe 26. Cette passe en ajoute 22 : 13 à curseurs (moteurs testés) et 9 jeux de tri.
- **Trajectoire de l'accueil** : une fenêtre de 7 notions autour de la prochaine quand un domaine en compte plus.
- **Contrôles** : `npm test` 238 cas, `npx playwright test` 84 tests (les 43 scènes ouvertes sans erreur ni débordement), build sans avertissement.
- **Captures** : `simulateurs-29/` (desktop 1440 × 1000, Pixel 7) ; archive `2026-11-06_11-49-24-Europe-Paris`.
- **Limites** :
  - lexique mobile encore long ;
  - fiscalité 2026 « à vérifier » ;
  - aucun test sur appareil réel.

---

# Review design — passe 28 : cinq simulateurs de plus, lexique repliable

**6 novembre 2026, 10:59 Europe/Paris.** Détail : [AUDIT-28.md](AUDIT-28.md). **La direction artistique n'est pas déclarée validée.**

- **Simulateurs** (21 leçons interactives sur 43) :
  - prix d'une obligation selon les taux (retrouve l'exemple de la leçon, 851 €) ;
  - prévisionnel en trois scénarios ;
  - bilan opération par opération, toujours à l'équilibre ;
  - jeu de tri des signaux d'arnaque ;
  - jeu de test d'un assistant IA.
- **Lexique mobile** : définitions repliées à deux lignes ; une recherche ou un terme ciblé les ouvre.
- **Contrôles** : `npm test` 224 cas, `npx playwright test` 82 tests, build sans avertissement.
- **Captures** : `simulateurs-28/` (desktop 1440 × 1000, Pixel 7) ; archive `2026-11-06_10-59-45-Europe-Paris`.
- **Limites** :
  - 22 leçons sans scène ;
  - trajectoire de l'accueil dense ;
  - aucun test sur appareil réel.

---

# Review design — passe 27 : simulateurs, onglets en pastilles, lexique indexé

**6 novembre 2026, 10:33 Europe/Paris.** Suite du plan après la passe 26. Détail : [AUDIT-27.md](AUDIT-27.md). **La direction artistique n'est pas déclarée validée.**

- **Cinq nouveaux simulateurs** (16 leçons interactives sur 43) :
  - impôt sur le revenu (barème 2026, à vérifier) ;
  - BFR et trésorerie ;
  - louer ou acheter ;
  - rééquilibrage d'allocation ;
  - choix du statut.
- **Moteurs testés :** `src/lib/lessonModels.ts`, avec 7 cas.
- **Onglets de leçon en pastilles** (référence 1), clavier et rôles inchangés.
- **Lexique** : index alphabétique collant, fiches resserrées sur mobile (27 212 → 23 365 px).
- **Captures** :
  - `simulateurs-27/` : desktop 1440 × 1000 et Pixel 7 ;
  - paire `latest-*` : leçon avec pastilles ;
  - archive `2026-11-06_10-33-15-Europe-Paris`.
- **Contrôles** : `npm test` 220 cas, `npx playwright test` 80 tests, build sans avertissement.
- **Limites** :
  - 27 leçons sans scène ;
  - lexique encore long ;
  - aucun test sur appareil réel.

---

# Review design — passe 26 : fusion des deux directions artistiques

**6 novembre 2026, 10:07 Europe/Paris.** Brief V2 : identité sombre et premium de la référence 1, avec la profondeur et la richesse des cartes de la référence 2, sans ses couleurs. Review de toute l'application, puis corrections P0 et P1. Détail : [AUDIT-26.md](AUDIT-26.md). **La direction artistique n'est pas déclarée validée** : elle attend votre review.

## Changements

- **Matière commune** (`src/fusion.css`) : cartes en relief (dégradé neutre, bord éclairé, ombre profonde, rayon de 14 px), boutons argentés, barres et anneaux de progression argent, icônes de domaine.
- **Accueil** :
  - parcours en % dans la scène ;
  - « Vos prochains objectifs » (3 cartes) ;
  - « Vos cinq domaines » avec anneaux, à la place de quatre grands folios ;
  - 2 910 → 1 758 px en desktop.
- **Académie** :
  - vue par défaut « Commencer ici » : reprise, chemin pas à pas, 5 domaines ;
  - atlas et catalogue à un clic ;
  - **bug corrigé :** « / 06 quiz validés » devient « / 43 ».
- **Compétences** : « Acquis / En cours / Ensuite » avant la carte complète.
- **Portfolio** : synthèse vivante, registre limité aux notions travaillées ; 5 188 → 1 711 px en desktop, 5 937 → 2 669 px sur mobile.
- **Atelier IA** : l'écriture d'abord (mobile ouvert sur « Écrire »), trois exemples de départ.
- **Lab** : encadré « Ce que ça veut dire », qui suit les curseurs.
- **Projets** : état vide en trois étapes, avec un appel à l'action.

## Captures

- `latest-desktop.png` / `latest-mobile.png` : accueil (rendus du test de design), 1440 × 1000 et Pixel 7.
- `fusion-26/avant/` et `fusion-26/apres/` : 13 écrans, desktop 1440 × 1000 et Pixel 7, à l'écran et en page entière, avec un profil de démonstration (3 quiz validés, 1 à reprendre).
- `fusion-26/comparaisons/` : 14 planches avant/après (accueil, Académie, compétences, portfolio, Atelier IA, projets, Lab ; desktop et mobile).
- Archive `2026-11-06_10-07-01-Europe-Paris`.

## Contrôles

- `npm test` : 213 cas réussis.
- `npx playwright test` : 78 tests réussis, dont l'accessibilité axe des écrans principaux et le parcours du catalogue entier.
- Build sans avertissement ; Prettier conforme.
- Défauts trouvés en cours de passe et corrigés :
  - grille mobile de l'Atelier IA ;
  - police du libellé de progression ;
  - noms accessibles des cartes de domaine et des étapes du chemin ;
  - doublon dans « Ensuite ».

## Limites

- 32 leçons sur 43 n'ont pas encore de scène interactive.
- Le lexique reste très long sur mobile.
- Les onglets de leçon ne sont pas encore en pastilles.
- Aucun test sur appareil réel, Safari, Firefox ou lecteur d'écran réel.

---

# Review design — passe 25 : engagement et envie de revenir

**6 novembre 2026, 06:37 Europe/Paris.** Audit de l'engagement sur trois leçons consécutives, comme débutant, sur mobile et desktop. Détail : [AUDIT-25.md](AUDIT-25.md). **Ni la direction artistique ni l'engagement ne sont déclarés validés** : il faut un test avec de vraies personnes.

## Changements

- **Question de départ** au début de chaque leçon, reprise dans le quiz (« Votre question de départ »). En cas de réussite : « C'est acquis. La question de départ est résolue. »
- **Écran de réussite** : les notions acquises, la progression du domaine et du parcours, puis une carte « La suite » avec la leçon suivante. Sur mobile, l'action principale passe en premier. Les notes sont réduites.
- **Pratique pertinente seulement** : le Lab, les Scénarios, l'Atelier IA ou les Projets ne sont proposés qu'aux 14 leçons qu'ils manipulent vraiment. Avant, « Lire un compte de résultat » menait au calculateur de seuil.
- **Continuité à l'accueil** : « Elle prolonge « Marge et trésorerie », que vous venez de valider », ou « Dernière notion validée : … ».
- **Point d'arrêt serein** : « la suite vous attendra, sans rappel ni compte à rebours ».
- **Défauts corrigés :**
  - « À vous de jouer, Vous. » sans prénom ;
  - libellé « quiz validés » coupé au bord de l'accueil.

## Captures

- `latest-desktop.png` / `latest-mobile.png` : quiz validé (desktop 1440 px, Pixel 7, page entière).
  - Sur la capture mobile pleine page, la barre de navigation fixe apparaît au milieu de l'image : c'est un artefact de capture.
- `engagement-25/` : parcours avant correction (accueil, ouverture, séquences, résultat, suite) sur trois leçons.
- `engagement-25/apres/` : même parcours après correction, mobile sur trois leçons et desktop sur deux.
- Archive `2026-11-06_06-36-49-Europe-Paris`.

## Contrôles

- `npm test` : 213 cas réussis, dont pratique pertinente et raison « Elle prolonge ».
- `npx playwright test` : 78 tests réussis, dont un nouveau test qui enchaîne deux leçons (question de départ, acquis, suite, point d'arrêt, accueil, absence de « série » ou « streak »).
- Build sans avertissement ; Prettier conforme.

## Limites

- 32 leçons sur 43 n'ont pas encore de scène interactive.
- Les quiz restent à deux questions.
- La motivation réelle n'est pas mesurable par des tests automatiques.

---

# Review design — passe 24 : recherche plein texte et simulateur de micro-entreprise

**6 novembre 2026, 06:13 Europe/Paris.** Suite du plan après la passe 23. **La direction artistique n'est pas déclarée validée.**

## Changements

- **Recherche universelle dans le texte des leçons.**
  - Avant, elle ne trouvait que les titres, les résumés et le lexique. Elle trouve désormais les séquences, les cas pratiques et les cartes de révision.
  - Un résultat trouvé dans le texte affiche le passage concerné, pour qu'on comprenne pourquoi il apparaît.
  - Les mots courts (« ia ») doivent commencer un mot, sinon ils remontaient « social » ou « financier ».
  - Synonymes du quotidien : « auto-entrepreneur » trouve la micro-entreprise, « Kbis » l'immatriculation, « phishing » l'hameçonnage.
- **Simulateur de micro-entreprise** (leçon 21, première scène des nouvelles leçons).
  - Choix vente ou services, impôt au barème ou versement libératoire, chiffre d'affaires et charges réelles réglables.
  - Affiche ce qui reste sur l'année, les cotisations et le bénéfice retenu par le fisc, avec les repères TVA et plafond sur la barre.
  - Alertes : plafond dépassé, seuil de TVA dépassé, charges réelles supérieures à l'abattement (le régime réel peut alors coûter moins).
  - Règles 2026 sourcées (12,3 % / 21,2 % ; versement libératoire 1 % / 1,7 % ; abattements 71 % / 50 % ; plafonds 203 100 € / 83 600 € ; franchise de TVA 85 000 € / 37 500 €), marquées « à vérifier ». Activités libérales exclues : leur taux dépend de la caisse.
  - Moteur pur `src/lib/entrepreneurship.ts`, 5 tests unitaires.
- **Défaut corrigé sur toutes les scènes mobiles :** l'étiquette « Cas fictif… » était forcée dans une colonne de 75 px alignée à droite et se cassait sur trois lignes. Elle passe sur sa propre ligne, alignée à gauche.
- **Test fragile corrigé :** la recherche du lexique (investissement) appuyait sur Ctrl+K avant le montage de l'application ; le test attend désormais le focus sur le contenu principal (stable sur 12 répétitions).

## Captures

- `latest-desktop.png` : leçon micro-entreprise, 1440 × 1000 (densité 2).
- `latest-mobile.png` : simulateur, Pixel 7.
- `passe-24/` : simulateur par défaut et avec alertes (desktop, mobile), recherche avec extrait (desktop, mobile), étiquette des scènes sur mobile (micro et crédit).
- Archive `2026-11-06_06-13-47-Europe-Paris`.

## Contrôles

- `npm test` : 212 cas réussis.
- `npx playwright test` : 76 tests réussis, dont un nouveau test e2e recherche + simulateur, et le parcours complet du catalogue.
- Build sans avertissement ; Prettier conforme.

## Limites

- Les 27 autres nouvelles leçons n'ont pas encore de scène interactive.
- Le simulateur ne calcule pas l'impôt au barème : il dépend de tout le foyer. Il ne prend pas en compte l'ACRE, la contribution à la formation professionnelle ni les seuils majorés de TVA.

---

# Review design — passe 23 : balayage de test complet

**6 novembre 2026, 05:47 Europe/Paris.** Toutes les routes et toutes les leçons (chaque séquence, chaque onglet), desktop et mobile, plus les fonctions clés sur la version compilée. Détail : [AUDIT-23.md](AUDIT-23.md). **La direction artistique n'est pas déclarée validée.**

- **Résultat :** environ 900 états parcourus. Après corrections, aucune erreur JavaScript, aucune requête en échec, aucun débordement (y compris à 768 et 1024 px) et aucune violation axe sur l'échantillon.
- **Bug principal corrigé :** les boutons clignotaient quand le pointeur s'arrêtait sur leur bord, parce que le survol les déplaçait d'un pixel. Plus aucun élément cliquable ne se déplace sous le pointeur.
- **Autres corrections :**
  - « / FONDATIONS » sous le numéro des nouvelles leçons ;
  - rôle `progressbar` de la progression du quiz ;
  - « Votre parcours » à la place de « Vos fondations ».
- **Fonctions vérifiées :** hors ligne, quiz et recommandation, lexique au clavier, recherche, export Markdown, « Copier et demander à mon Claude », performance (LCP 220 ms en local).
- **Nouveau test permanent :** `tests/catalogue.spec.ts`, qui parcourt chaque leçon en entier.
- **Vérifications :** `npm test` 207 cas, `npx playwright test` 74 tests, build sans avertissement, archive `2026-11-06_05-47-32-Europe-Paris`.

---

# Review design — passe 22 (vagues 2 à 5) : leçons complètes dans tous les domaines

**6 novembre 2026, 05:19 Europe/Paris.** Suite de la demande « leçons archi-complètes, dans tous les domaines, en prenant le temps des recherches ». Le catalogue passe de 23 à **43 leçons** et le lexique à **165 termes**. **La direction artistique n'est pas déclarée validée.**

## Nouvelles leçons

| Domaine                   | Avant | Après | Leçons ajoutées                                                                                                                       |
| ------------------------- | ----- | ----- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Finance (entreprise)      | 2     | 7     | Compte de résultat et bilan ; BFR et plan de trésorerie ; prévisionnel crédible ; investir et amortir ; indicateurs de pilotage       |
| Entrepreneuriat (vague 1) | 1     | 9     | voir l'entrée précédente                                                                                                              |
| Intelligence artificielle | 3     | 7     | Données et confidentialité (RGPD) ; choisir un cas d'usage ; évaluer et tester une IA ; cadre légal européen (AI Act)                 |
| Finance personnelle       | 4     | 9     | Banque et arnaques ; impôt sur le revenu ; assurances ; louer ou acheter ; préparer sa retraite                                       |
| Investissement            | 5     | 11    | Obligations et taux ; repérer une arnaque ; immobilier et SCPI ; crypto-actifs ; construire son allocation ; fiscalité des placements |

Chaque leçon suit la même structure :

- quatre séquences ;
- un cas fictif ;
- un exercice corrigé avec ses calculs vérifiés ;
- deux questions de quiz ;
- des cartes de révision ;
- des sources officielles.

**Faits récents vérifiés en ligne (sources concordantes), datés et marqués « à vérifier » dans les leçons :**

- **Retraite :** suspension du relèvement de l'âge légal (62 ans et 9 mois, 170 trimestres) pour les départs entre septembre 2026 et fin 2027 (LFSS 2026).
- **Flat tax :** PFU à 31,4 % en 2026 (prélèvements sociaux à 18,6 %), l'assurance-vie restant à 17,2 %.
- **Règlement européen sur l'IA :** obligations « haut risque » reportées au 2 décembre 2027 (annexe III) et au 2 août 2028 (produits réglementés) par l'omnibus numérique de 2026.
- **Assurance emprunteur :** loi Lemoine (résiliation à tout moment).
- **Crédit immobilier :** recommandations du HCSF (35 % de taux d'effort, 25 ans).
- **Crypto-actifs :** fin de la période transitoire MiCA en France en juillet 2026.

Les sites officiels n'étaient pas joignables depuis cette session.

## Corrections techniques de la vague

- **Paquet JavaScript :** les leçons faisaient dépasser 500 kB au paquet principal. Le contenu des cours et React ont désormais leur propre fichier : le paquet principal passe de 596 à 78 kB, sans avertissement.
- **Atlas :** rangées plus hautes pour les libellés sur deux lignes.
- **Tests :** ceux qui comptaient les leçons en dur calculent désormais à partir du catalogue (atlas Finance, nombre de notions).

## Captures

| Écran                           | Desktop                                           | Mobile                                           |
| ------------------------------- | ------------------------------------------------- | ------------------------------------------------ |
| Atlas complet, 43 notions       | [Voir](lecons-22b/desktop-atlas-complet.png)      | [Voir](lecons-22b/mobile-atlas-complet.png)      |
| BFR et trésorerie, séquence 2   | [Voir](lecons-22b/desktop-fin-bfr-tresorerie.png) | [Voir](lecons-22b/mobile-fin-bfr-tresorerie.png) |
| Impôt sur le revenu, séquence 2 | [Voir](lecons-22b/desktop-fp-impot-revenu.png)    | [Voir](lecons-22b/mobile-fp-impot-revenu.png)    |
| Crypto-actifs, séquence 2       | [Voir](lecons-22b/desktop-inv-crypto-actifs.png)  | [Voir](lecons-22b/mobile-inv-crypto-actifs.png)  |
| Cadre légal de l'IA, séquence 2 | [Voir](lecons-22b/desktop-ia-cadre-legal.png)     | [Voir](lecons-22b/mobile-ia-cadre-legal.png)     |

## Vérifications internes

- `npm test` : 207 cas réussis (catalogue cohérent, prérequis sans cycle, identifiants uniques, typographie des chiffres, lexique).
- `npx playwright test` : 72 tests réussis (desktop et Pixel 7 émulé).
- Build sans avertissement. Archive `2026-11-06_05-19-05-Europe-Paris`.

**Limites :**

- Les nouvelles leçons n'ont pas de scène interactive dédiée.
- Les quiz restent à deux questions.
- Les règles fiscales et sociales devront être revues à chaque loi de finances.

---

# Review design — passe 22 (vague 1) : parcours Entrepreneuriat complet

**6 novembre 2026, 04:56 Europe/Paris.** Demande de l'utilisateur : des leçons « archi-complètes » dans tous les domaines, en prenant le temps des recherches. Le travail est livré par vagues ; voici la première. **La direction artistique n'est pas déclarée validée.**

## Infrastructure : des cartes qui grandissent avec le catalogue

- **Mise en page automatique** (`src/lib/mapLayout.ts`, 4 tests) :
  - atlas : une rangée par domaine, la largeur suit la rangée la plus longue ;
  - carte des compétences : une colonne par domaine, la hauteur suit ;
  - trajectoire de l'accueil : un parcours par domaine, en zigzag au-delà de cinq notions.
- **Atlas :**
  - les liens qui sautent des notions s'arquent sans quitter leur rangée ;
  - les libellés passent sur deux lignes ;
  - un fondu signale quand l'atlas défile.

## Entrepreneuriat : de 1 à 9 leçons

Les huit nouvelles leçons, dans l'ordre du parcours :

1. De l'idée au modèle économique (canvas, coût d'acquisition, valeur vie client, MVP).
2. Trouver ses premiers clients (canaux, positionnement, entonnoir, cadre RGPD).
3. Fixer son prix (coût de revient, HT et TTC, tarif d'indépendant, effet des remises).
4. Choisir son statut (EI depuis 2022, micro, EURL, SASU, SAS ; TNS ou assimilé salarié ; IR ou IS).
5. Créer son entreprise, étape par étape (étude, prévisionnel, guichet unique INPI, RNE, SIREN et SIRET, faux courriers officiels).
6. La micro-entreprise de A à Z (plafonds, cotisations, abattements, versement libératoire, franchise de TVA, obligations).
7. Facturer, encaisser, déclarer (mentions, facturation électronique, délais de paiement, TVA collectée et déductible, avoir).
8. Financer son projet (besoin de démarrage, dette ou fonds propres, prêt d'honneur, banque, financement participatif, dilution, caution).

Chaque leçon comprend quatre séquences, un cas fictif, un exercice corrigé, deux questions de quiz, des cartes de révision et des sources officielles. Le lexique gagne 23 termes (114 au total).

**Faits datés, vérifiés en ligne le 6 novembre 2026 sur des sources concordantes :**

- plafonds micro 2026-2028 : 203 100 € et 83 600 € ;
- franchise de TVA : 85 000 € et 37 500 € ;
- cotisations micro : environ 12,3 % (vente) et 21,2 % (services) ;
- ACRE réformée (réduction de 50 % à 25 % à partir de juillet 2026) ;
- facturation électronique : réception obligatoire depuis septembre 2026, émission en septembre 2027 pour les PME et micro-entreprises.

Les sites officiels (economie.gouv.fr, service-public) n'étaient pas accessibles depuis cette session. Chaque chiffre est daté et marqué « à vérifier » dans les leçons, et le taux des activités libérales n'est pas chiffré, faute de concordance entre les sources.

## Captures

| Écran                                    | Desktop                                  | Mobile                                  |
| ---------------------------------------- | ---------------------------------------- | --------------------------------------- |
| Atlas (9 notions en Entrepreneuriat)     | [Voir](lecons-22/desktop-atlas.png)      | [Voir](lecons-22/mobile-atlas.png)      |
| Carte des compétences                    | [Voir](lecons-22/desktop-skills.png)     | [Voir](lecons-22/mobile-skills.png)     |
| Trajectoire « Entreprendre »             | [Voir](lecons-22/desktop-trajectory.png) | [Voir](lecons-22/mobile-trajectory.png) |
| Leçon « Choisir son statut », séquence 2 | [Voir](lecons-22/desktop-statut-2.png)   | [Voir](lecons-22/mobile-statut-2.png)   |

## Vérifications internes

- `npm test` : 207 cas réussis, dont la mise en page et la cohérence du catalogue (23 leçons, prérequis sans cycle, identifiants uniques).
- `npx playwright test` : 72 tests réussis (desktop et Pixel 7 émulé).
- Build sans avertissement. Archive `2026-11-06_04-56-24-Europe-Paris`.
- **Défauts vus à l'écran et corrigés :**
  - arcs de l'atlas qui montaient dans la rangée Finance ;
  - neuvième notion coupée sans signal ;
  - libellés collés ;
  - vide en haut de la carte des compétences ;
  - « l’ » séparé du terme du lexique en fin de ligne.

**Vagues suivantes :** finance d'entreprise, finance personnelle, investissement, IA, puis le balayage de test complet.

---

# Review design — passe 21 : lexique des fondations, cas pratiques reliés

**5 novembre 2026, 17:26 Europe/Paris.** Suite demandée par l'utilisateur (« Vas-y go »). **La direction artistique n'est pas déclarée validée.**

## Changements

- **Lexique des fondations.** 23 termes ajoutés (68 → 91), définis d'après le texte des leçons, sans conseil ni chiffre réglementé. Deux catégories nouvelles :
  - **Entreprise** : chiffre d'affaires, marge sur coûts variables, trésorerie, résultat, créance client, délai de paiement, BFR, seuil de rentabilité, coût variable, hypothèse, proposition de valeur ;
  - **Intelligence artificielle** : LLM, token, contexte, hallucination, inférence, prompt, few-shot, injection de prompt, workflow, agent, moindre privilège, idempotence.
- **Nouveau nom.** Le lexique s'appelle « Lexique de l'Académie », puisqu'il couvre les cinq domaines (lien de l'Académie, titre, recherche).
- **Cas pratiques et exercices reliés.** Le cas pratique (« En situation ») et l'énoncé de l'exercice reconnaissent désormais les termes, comme les séquences. Exemple dans le cas de l'atelier de mobilier : « Marge sur coûts variables », « Charges fixes », « Résultat », « trésorerie ».
- **Quiz : volontairement inchangés.** Un quiz validé n'est reconnu que pour la version de sa leçon (`lesson.version`). Ajouter une question imposerait une nouvelle version, et tous les quiz déjà validés repasseraient « à revoir ». Ce choix reste à l'utilisateur.

## Captures

| Écran                            | Desktop                                     | Mobile                                     |
| -------------------------------- | ------------------------------------------- | ------------------------------------------ |
| Leçon LLM, termes soulignés      | [Voir](parcours-21/desktop-llm-terms.png)   | [Voir](parcours-21/mobile-llm-terms.png)   |
| Définition de « LLM »            | [Voir](parcours-21/desktop-llm-popover.png) | [Voir](parcours-21/mobile-llm-popover.png) |
| Cas pratique relié au lexique    | [Voir](parcours-21/desktop-case.png)        | [Voir](parcours-21/mobile-case.png)        |
| Lexique de l'Académie, 91 termes | [Voir](parcours-21/desktop-lexique.png)     | [Voir](parcours-21/mobile-lexique.png)     |

## Vérifications internes

- `npm test` : 203 cas réussis. Les tests du lexique vérifient l'unicité, les catégories utilisées et les leçons existantes ; le test typographique couvre les nouvelles définitions.
- `npx playwright test` : 72 tests réussis (desktop et Pixel 7 émulé). Les tests visant l'ancien titre du lexique ont été mis à jour.
- Build sans avertissement ; captures enregistrées, archive `2026-11-05_17-26-06-Europe-Paris`, paire principale sur le lexique (`17-lexique-viewport`). Aucun débordement horizontal sur la page du lexique.

**Limites :** le texte des quiz n'est pas relié au lexique, pour ne pas souffler la réponse.

---

# Review design — passe 20 : lexique dans les leçons, point de départ sur 5 domaines

**5 novembre 2026, 17:13 Europe/Paris.** Suite demandée par l'utilisateur (« Vas-y go »), deux idées de la liste de la passe 17. **La direction artistique n'est pas déclarée validée.**

## Les termes du lexique reconnus dans les leçons

- **Termes soulignés.** Dans le texte des leçons, les termes du lexique sont soulignés en pointillé discret. Exemple dans la leçon crédit : « mensualité », « coût total du crédit », « taux nominal », « TAEG ».
- **Définition sur place.** Un clic, ou Entrée au clavier, ouvre une définition courte dans un panneau au premier plan (API `popover` native). On ferme par Échap, un clic à côté ou « Fermer ». Le panneau propose « Ouvrir dans le lexique » et, si le terme est expliqué ailleurs, un lien vers sa leçon.
- **Pas de faux positifs sur les mots courants.** « action », « cours » ou « défaut » ne sont reconnus que dans les leçons qui les définissent ou s'appuient dessus. Les termes de plusieurs mots et les sigles (TAEG, PEA, ETF) le sont partout. Chaque terme n'est souligné qu'une fois par paragraphe ; on garde le terme le plus long (« rendement réel » plutôt que « rendement »).
- **Code :** `src/lib/glossaryLinks.ts` (pur, 4 tests) et `src/components/GlossaryText.tsx`.

## Point de départ sur les 5 domaines

- **Deux questions ajoutées :** Finance personnelle (se payer en premier) et Investissement (effet des frais sur vingt ans). Le titre devient « Cinq questions. Aucun jugement. ».
- **Recommandation :** une réponse manquée ou « Je ne sais pas encore » dans un de vos centres d'intérêt fait passer ce domaine en tête de la leçon proposée. Les profils créés avant comptent ces deux domaines comme « à explorer ».
- **Typographie :** espaces insécables avant « ? », « : » et « % » dans les questions.

## Captures

| Écran                             | Desktop                                               | Mobile                                               |
| --------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| Termes soulignés (leçon crédit)   | [Voir](parcours-20/desktop-termes-soulignes.png)      | [Voir](parcours-20/mobile-termes-soulignes.png)      |
| Définition ouverte                | [Voir](parcours-20/desktop-lexique-dans-la-lecon.png) | [Voir](parcours-20/mobile-lexique-dans-la-lecon.png) |
| Point de départ, questions 4 et 5 | [Voir](parcours-20/desktop-point-de-depart.png)       | [Voir](parcours-20/mobile-point-de-depart.png)       |

## Vérifications internes

- `npm test` : 203 cas réussis. Nouveaux : reconnaissance des termes et recommandation sur les nouveaux domaines.
- `npx playwright test` : 72 tests réussis (desktop et Pixel 7 émulé), dont l'audit axe. Après la retouche typographique, les tests d'onboarding et d'accessibilité ont été relancés (20 réussis).
- Build sans avertissement ; 159 captures, archive `2026-11-05_17-13-14-Europe-Paris`.
- Défaut vu à l'écran et corrigé : « ? » seul en fin de ligne dans la question 4.

**Limites :**

- Le texte des cas pratiques et des quiz n'est pas encore relié au lexique.
- Le lexique ne couvre pas les notions de base (marge, trésorerie, LLM) : il est centré sur la bourse et la finance personnelle.
- Les quiz restent à deux questions. Les allonger changerait leur version, et les quiz validés repasseraient « à revoir ».

---

# Review design — passe 19 : reprise à la séquence exacte, trajectoire sur 5 domaines

**5 novembre 2026, 16:54 Europe/Paris.** Suite demandée par l'utilisateur (« Vas-y go ») : deux points de la liste « ce qui reste imparfait » (`AUDIT-17.md`). **La direction artistique n'est pas déclarée validée.**

## Reprise à la séquence exacte

- **Mémoire de la séquence.** Chaque leçon retient la séquence où elle a été quittée (`lessonPositions`, champ facultatif de la sauvegarde ; les anciennes sauvegardes restent valides).
- **À la réouverture**, la leçon reprend à cette séquence et l'annonce : « Reprise à la séquence 4, là où vous aviez laissé cette leçon. », avec un bouton « Revenir au début ».
- **Sur l'accueil**, le découpage de séance part de cette séquence : « la fin de la leçon, séquences 4 à 7 » ou « les séquences 4 à 5 sur 7 ».

## Trajectoire de l'accueil sur les 5 domaines

- **Trois parcours :** Fondations (finance, entreprise, IA), Finance personnelle et Investissement. Chacun affiche son avancement (« 0/4 »).
- L'accueil s'ouvre sur le parcours de la leçon recommandée.
- **Changer de parcours** sélectionne la notion utile : la recommandation, sa suite ou la première notion à valider.
- **Mobile :** la hauteur réservée à la carte (240 px pour une rangée de 96 px) est supprimée.

## Captures (profil Finance personnelle, 10 min)

| Écran                            | Desktop                                          | Mobile                                          |
| -------------------------------- | ------------------------------------------------ | ----------------------------------------------- |
| Trajectoire, Finance personnelle | [Voir](parcours-19/desktop-trajectory.png)       | [Voir](parcours-19/mobile-trajectory.png)       |
| Trajectoire, Investissement      | [Voir](parcours-19/desktop-trajectory-inv.png)   | [Voir](parcours-19/mobile-trajectory-inv.png)   |
| Accueil après une leçon quittée  | [Voir](parcours-19/desktop-home-after-leave.png) | [Voir](parcours-19/mobile-home-after-leave.png) |
| Leçon reprise à la séquence 4    | [Voir](parcours-19/desktop-lesson-resumed.png)   | [Voir](parcours-19/mobile-lesson-resumed.png)   |

## Vérifications internes

- `npm test` : 198 cas réussis (nouveaux : validation des positions de lecture, découpage depuis une séquence).
- `npx playwright test` : 72 tests réussis (desktop et Pixel 7 émulé), dont un nouveau scénario : quitter une leçon, revenir, retrouver la séquence, revenir au début, recharger.
- Build sans avertissement ; 159 captures, archive `2026-11-05_16-54-17-Europe-Paris`.
- **Défauts vus à l'écran et corrigés :**
  - sélecteur de parcours placé loin de la carte ;
  - formule de reprise genrée (« vous vous étiez arrêté ») ;
  - espace vide sous la trajectoire sur mobile.

**Limites :** la position est enregistrée par leçon pour l'onglet « Comprendre » seulement. La pratique et le quiz repartent du début, comme avant.

---

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

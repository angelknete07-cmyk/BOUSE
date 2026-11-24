# Review design — Les vidéos animées des 43 leçons

**25 novembre 2026.** **La direction artistique n’est pas déclarée validée.** L’utilisateur trouvait les vidéos « trop simples » (le texte qui défile). Maquette `maquette/video-anime.html` (v1 puis v2) montrée : « c’est parfait », puis « Oui, fais-les ». Construit pour les 43 leçons. Paire principale : `21-lecon-video` (lecteur à l’arrêt), plus deux images de scènes : `24-video-animee-desktop.png` (BFR, ordinateur) et `24-video-animee-mobile.png` (budget, téléphone).

- **Moteur** (`src/components/LessonScenes.tsx`, `src/lib/lessonScenes.ts`, `src/lib/sceneArt.ts`, `src/lesson-scenes.css`) : tout se calcule depuis le temps de la voix (on peut avancer, reculer, changer la vitesse). 21 sortes d’éléments : titres et mots colorés, icônes au trait (~80), personnages (7), formules en pastilles, cartes, compteurs, cascades, compte en banque avec pièces qui volent, frise, courbe qui se dessine, jauges, listes, étapes, avant / après, dialogues. Léger zoom de caméra, mouvement réduit respecté.
- **Scénarios** : `public/lecons-scenes/<id>.json`, 43 leçons, 769 scènes, calées sur le minutage de la voix ElevenLabs. Uniquement les chiffres dits par la voix. Sans scénario (ou version différente de la voix), la vidéo reste l’ancienne, simple : rien n’est retiré.
- **Contrôles de l’agent** : `npm test` 350 (dont un test de format par leçon) ; `scripts/check-scenes.mjs` sur les 43 leçons, chaque scène, ordinateur 1280×860 et téléphone 390×844 : rien ne sort de la vidéo, aucun chevauchement (1 538 images regardées par échantillon) ; `npx playwright test` complet : 154 passés, 8 ignorés prévus ; `npm run build`.
- **Limites** : les contenus des scènes (mots illustratifs, dialogues, formes des courbes) sont à relire par l’utilisateur ; quelques scènes ont plus d’une touche lavande (12 sur 769, comme la leçon modèle) ; pas de vrai iPhone ; pas de validation externe.

---

# Review — La vraie voix des 43 leçons (ElevenLabs)

**17 novembre 2026.** **La direction artistique n’est pas déclarée validée.** Aucun changement d’écran : seul le son change. Les 43 vidéos et podcasts passent de la voix gratuite du Mac à la voix « BOUSE » choisie par l’utilisateur sur ElevenLabs (formule Creator), fabriquée et contrôlée dans `~/claude/bouse-voix` (conversation « Voix off des 43 leçons »).

- **Fichiers** : `public/lecons-voix/<id>.m4a` (AAC 64 kbit/s mono, ~2 Mo par leçon, 95 Mo en tout, toujours exclus du pré-téléchargement hors ligne) et `<id>.json` (même minutage phrase par phrase, issu de l’alignement ElevenLabs, donc plus précis). 3 h 21 d’écoute, de 2 à 6 minutes par leçon.
- **Contrôle** : chaque fichier retranscrit par Whisper et comparé au texte dans `bouse-voix` ; un seul doute à écouter à l’oreille (« validation-client » : « je le paierai » entendu « perdrai »). Ici : les 43 minutages valides et à la bonne version, essai réel de lecture dans l’appli (« Faire son budget », 4 min 39, phrase et mots synchronisés).
- **Protection** : `scripts/voix-lecons.ts` (voix du Mac, secours) ne réécrit plus jamais une leçon déjà faite avec ElevenLabs.
- **Contrôles de l’agent** : `npm test` 300 ; `npx playwright test` complet : 152 passés, 8 ignorés prévus ; `npm run build`.
- **Limites** : le doute de « validation-client » n’est pas encore écouté ; pas de vrai iPhone ; pas de validation externe.

---

# Review — Nouveau nom : BOOST

**15 novembre 2026.** **La direction artistique n’est pas déclarée validée.** À la demande de l’utilisateur (« sinon ça fait Booze »), le nom affiché passe de « BOUSE » à **« BOOST »** (choisi dans le widget parmi BOUSSE, BOOSSE, BOOST). Paire principale : l’ouverture animée (`23-ouverture-viewport`), archive `2026-11-15_17-46-27-Europe-Paris-previous`.

- **Changé (42 endroits)** : ouverture animée, barre, en-tête de l’accueil (« BOOST / FINANCE »), titre de l’onglet, nom de l’appli installée (manifeste, écran d’accueil iPhone), guide, dossiers et fiches téléchargés, consignes copiées pour le mentor, avis de mise à jour, lecteur vidéo et écran verrouillé.
- **Pas changé, exprès** : l’adresse `bouse.vercel.app`, le dépôt GitHub, les clés de sauvegarde (`bouse.…`, sinon les données seraient perdues), les variables `BOUSE_…` des scripts, les commentaires du code, le logo B (`BrandLogo.tsx`, intouchable) ; les consignes internes du mentor côté serveur Supabase disent encore « BOUSE » (il faudrait redéployer la fonction).
- **Contrôles de l’agent** : `npm test` 300 ; `npx playwright test` complet : 152 passés, 8 ignorés prévus ; `tsc`.
- **Limites** : pas de nouvelle adresse ni de nouveau logo ; pas de validation externe.

---

# Review design — La leçon en vidéo et en podcast

**15 novembre 2026.** **La direction artistique n’est pas déclarée validée.** Maquette `maquette/video.html` (avec la vraie voix) montrée à l’utilisateur, puis « Oui, fais-les » : construit tel que la maquette pour les 43 leçons. Paire principale : `21-lecon-video-viewport`, archive `2026-11-15_17-31-59-Europe-Paris`.

- **Trois façons d’apprendre** en haut de l’étape « Comprendre » : « Lire » (la leçon comme avant, sans lecteur), « Regarder » (durée réelle, ex. « 3 min 33 ») et « Écouter » (podcast). Le choix est gardé (champ additif `learningMode`, validé dans `storage.ts`). Par défaut : « Regarder ». **La lecture reste toujours en dessous** : rien n’est retiré.
- **Regarder** : image 16:9 animée en direct, qui suit la voix phrase par phrase : barre des parties, « Partie 2 / 4 · titre », la phrase dite qui s’allume mot à mot, la phrase d’avant en gris, les formules (« CA = … ») en carte avec un « = » lavande, les montants en pastilles, la vraie vague `Terrain` en fond (non modifiée). Commandes : lecture, −10 s, barre de position (vrai curseur accessible), temps, vitesse (1 / 1,25 / 1,5 / 0,85), sous-titres. Reprise à l’endroit où on s’était arrêté.
- **La question dans la vidéo** : après la deuxième partie, la vidéo s’arrête sur « La question de départ » de la leçon ; on répond (la bonne réponse ressort, la mauvaise est barrée, l’explication s’affiche) ou on passe, puis « Reprendre la vidéo ». Rien n’est enregistré comme tentative. À la fin : « Passer à l’exercice » ou « Revoir ».
- **Écouter** : la même voix sans l’image, titre de la partie en cours, « Vous pouvez éteindre l’écran » ; titre et nom de la leçon sur l’écran verrouillé (Media Session).
- **La voix** : voix gratuite du Mac « Thomas » (provisoire, l’utilisateur choisira une voix payante plus tard). `scripts/voix-lecons.ts` lit chaque leçon phrase par phrase, dit les signes en français (« = » → « égale », « € », « % », « HT », sigles épelés), assemble un fichier m4a par leçon (~1 Mo) et un minutage JSON. Changer de voix = relancer le script. Les fichiers son ne sont **pas** pré-téléchargés pour le hors-ligne (43 Mo).
- **Téléphone** : image plus haute (10:9), phrase d’avant masquée, question et fin sous l’image, sous-titres gardés.
- **Contrôles de l’agent** : `npm test` 300 ; `npx playwright test` complet : 152 passés, 8 ignorés prévus ; `tsc`, Prettier, `npm run build` (aucun son dans le pré-téléchargement hors ligne). Nouveaux : 7 tests du calcul (phrase au temps t, mots allumés, formules et montants, moment de la question, libellés, voix en français, sauvegarde) + « chaque leçon a sa voix, à jour de sa version » ; 3 cas navigateur × 2 (choix gardé et lecture conservée, fin → exercice, minutage absent → message clair). Essayé à la main dans l’appli : lecture, formule, question, reprise, podcast, téléphone. Corrigé pendant la revue : le titre de la vidéo était un vrai titre de page en double (gênait les lecteurs d’écran et 22 tests), nom accessible du bouton « CC », test de niveau qui lisait la sauvegarde un instant trop tôt, bonne réponse pas mise en avant, chevauchement en podcast, image trop basse sur téléphone, `say` qui se figeait sur une phrase (limite de temps et nouvel essai).
- **Limites** : le Chromium des tests ne lit pas l’AAC (le son est vérifié à la main, pas automatiquement) ; mot à mot approché d’après la durée de la phrase ; voix provisoire ; pas de vrai iPhone ; pas de validation externe.

---

# Review design — Test de niveau

**14 novembre 2026.** **La direction artistique n’est pas déclarée validée.** Maquette `maquette/niveau.html` montrée à l’utilisateur, puis « Oui, construis-le » : construit tel que la maquette. Paire principale : le résultat du test (`20-niveau-resultat-viewport`), archive `2026-11-14_18-02-27-Europe-Paris` ; aussi `20-niveau-question`.

- **L’entrée** : sur la page d’un domaine, une carte « Tu en connais déjà une partie ? » avec « Tester mon niveau → ». Une fois le test fait, elle devient une ligne « Test de niveau fait le … · N compétences déjà sues » avec « Refaire le test ». Après le choix des domaines, « C’est parti » mène à cette page.
- **Les questions** : une par compétence (la première question de son quiz ou de son contrôle), du niveau Découvrir à Expert ; barre des niveaux ; « Je ne sais pas » ; le test s’arrête tout seul après deux ratés dans un même niveau. « Arrêter » ne garde rien.
- **Le résultat** : le point de départ (le premier niveau pas entièrement su), « juste à N questions sur M », l’échelle des niveaux, « Déjà su · sauté » avec « Valider » (ouvre le vrai quiz ou le vrai contrôle), « À apprendre » dans l’ordre (raté / pas testé), « Commencer par « … » → », « Refaire le test ».
- **Honnête** : une bonne réponse ne valide rien et ne crée aucune tentative ; elle saute seulement la compétence dans la suite. Les ratés du test ne vont pas dans « Mes pièges ». Dans le domaine, étiquette « Déjà sue » en pointillés ; dans l’arbre, contour en pointillés argent, ligne de légende et phrase dans le panneau.
- **Code** : `src/lib/placement.ts` (calcul pur), `src/components/Placement.tsx`, `src/placement.css` ; `nextSkill` saute les compétences sues ; sauvegarde : champ additif `placements` validé dans `storage.ts` ; route `placement/<domaine>`.
- **Contrôles de l’agent** : `npm test` 293 ; `npx playwright test` complet : 146 passés, 8 ignorés prévus (deux passages précédents ont dépassé le temps limite sur téléphone, machine chargée ; relancé au calme) ; `tsc`, Prettier. Nouveaux : 5 tests du calcul (ordre, arrêt, résultat, suite qui saute, sauvegarde) ; 2 cas navigateur × 2 (parcours complet avec « Arrêter », enregistrement, suite et étiquettes ; « Valider » ouvre le contrôle) ; écran du test dans le contrôle d’accessibilité. Corrigé pendant la revue : le texte de la colonne « À apprendre » descendait (cartes de même hauteur).
- **Limites** : une seule question par compétence, c’est un sondage, pas une preuve ; pas de vrai iPhone ; pas de validation externe.

---


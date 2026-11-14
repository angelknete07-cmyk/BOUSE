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


# Review design — Mes pièges

**12 novembre 2026.** **La direction artistique n’est pas déclarée validée.** Maquette `maquette/pieges.html` montrée à l’utilisateur, puis « go » : construit tel que la maquette. Paire principale : les Révisions avec le carnet (`11-revisions-viewport`, un profil démo avec deux questions ratées), archive `2026-11-12_22-51-26-Europe-Paris`.

- **Le carnet « Tes pièges »**, en haut des Révisions (caché pendant une séance de révision) : chaque question ratée à un quiz de leçon ou au contrôle d’une compétence courte, avec « Raté N fois », la leçon ou la compétence, la date, **sa dernière mauvaise réponse barrée, la bonne réponse et le pourquoi**. Filtres « À déjouer · N » et « Déjoués · N » ; cinq cartes, puis « Voir les autres ».
- **Déjoué** : quand la dernière réponse à cette question est juste, le piège passe dans « Déjoués » (« ✓ Réussie au dernier quiz… »). Rien n’est inventé : tout vient des vraies tentatives ; sans question ratée, le carnet n’apparaît pas.
- **Boutons** : « Refaire le quiz → » ouvre la leçon directement sur son étape « Démontrer » ; « Refaire le contrôle → » ouvre la compétence directement sur son contrôle ; « Revoir la leçon » / « Revoir l’idée ».
- **Accueil** : une seule ligne « N pièges à déjouer → » sous le bouton principal, seulement s’il y en a.
- **Corrigé en passant** : la vague de tête des pages dépassait de 24 px sur écran moyen (barre de défilement horizontale) ; elle est coupée au bord, la vague n’est pas modifiée. Espaces insécables devant « ? : ; ! » dans les cartes.
- **Code** : `src/lib/traps.ts` (calcul pur), `src/components/useTraps.ts` (charge seulement les contrôles des compétences passées), `src/components/Traps.tsx`, `src/traps.css` ; routes `lesson/<id>/quiz` et `skill/<id>/check`.
- **Contrôles de l’agent** : `npm test` 288 ; `npx playwright test` complet : 142 passés, 8 ignorés prévus ; `tsc`, Prettier. Nouveaux : 7 tests du calcul (raté, déjoué, ordre des dates, ancienne version ignorée, compétences) et 4 cas navigateur × 2 (carnet et filtres avec contrôle d’accessibilité, deux boutons « Refaire », ligne de l’accueil, aucun carnet sans erreur).
- **Limites** : avec des pièges, le bouton « Commencer la révision » descend sous le carnet (choix de la maquette : le bloc en haut) ; pas de vrai iPhone ; pas de validation externe.

---


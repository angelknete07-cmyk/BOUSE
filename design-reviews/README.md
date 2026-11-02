# Revues visuelles

Ce dossier fait partie du dépôt. Les captures proviennent de l’application réellement lancée dans Chromium ; elles utilisent un profil de démonstration, sans donnée personnelle réelle. Elles permettent à une autre personne ou à un autre ChatGPT d’examiner le design avec le code.

## Dernière passe

- [`latest-desktop.png`](latest-desktop.png) et [`latest-mobile.png`](latest-mobile.png) : écran principal choisi pour la dernière passe enregistrée.
- `screens/desktop/` et `screens/mobile/` : autres écrans et états capturés.
- [`LATEST.md`](LATEST.md) : changements, écrans concernés, contrôles, comparaison et statut de review.
- `render-manifest.json` : dimensions, empreintes SHA-256 des images et des sources, date du run et viewports réellement configurés.
- `archive/` : versions antérieures conservées pour comparaison. Les noms datés utilisent le fuseau Europe/Paris.

L’inspection interne et la review design externe sont deux étapes distinctes. Un test réussi, une compilation ou la présence d’une capture ne constitue pas une validation esthétique externe. Consigner explicitement les corrections et l’état de cette validation dans `LATEST.md`.

## Générer et conserver les rendus

Depuis la racine du projet :

```bash
npm run test:e2e
node scripts/save-design-review.mjs --check
node scripts/save-design-review.mjs
# Choisir le nouvel écran de cette passe pour la paire latest-* :
node scripts/save-design-review.mjs --primary=11-revisions-viewport
```

Playwright lance ou réutilise l’application selon `playwright.config.ts`. Dans ce cloud, Vite et Chromium peuvent nécessiter le mécanisme de permissions étendues de l’outil. Voir [`docs/SETUP.md`](../docs/SETUP.md).

Le paramètre `--primary` choisit une capture présente dans les deux viewports pour les fichiers stables. Pour cette passe, il s’agit de `11-revisions-viewport` ; les pages complètes et les états de session restent dans `screens/`.

Le script utilise Node et la configuration Playwright déjà installée ; il ne télécharge aucun paquet. Il exige un dernier run réussi, les captures desktop et mobile de la galerie, et des fichiers d’interface qui n’ont pas changé après les tests. Il refuse les captures manquantes, ambiguës ou antérieures aux dernières sources. L’option `--check` ne modifie aucun fichier.

Les PNG sont copiés à l’identique, sans retouche. Les fichiers stables déjà présents sont archivés avant remplacement ; les archives existantes sont préservées. Le script ne remplace pas `LATEST.md`, n’approuve pas le design et n’effectue ni commit ni push GitHub.

Après la copie :

1. Ouvrir les images desktop et mobile de chaque écran modifié.
2. Vérifier la DA sombre monochrome, la hiérarchie, l’espace, la typographie, la profondeur, le responsive, les interactions, les animations et la densité. Comparer à la passe précédente.
3. Corriger les défauts observés puis relancer les rendus. Les captures fixes ne remplacent pas l’exercice réel des animations et états interactifs.
4. Mettre à jour `LATEST.md` avec les résultats réels et le statut de review externe.
5. Inclure ce dossier dans le workflow GitHub du projet. Ne pas annoncer de synchronisation tant qu’elle n’est pas vérifiée.

Ne pas ajouter de nouvelles fonctionnalités pendant qu’une modification importante attend sa revue visuelle. Le cycle est : **construction → rendus → review externe → corrections → nouveaux rendus → validation → suite**.

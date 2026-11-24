# Vidéos animées des leçons : écrire un scénario

Chaque leçon a une voix (`public/lecons-voix/<id>.m4a`) et son minutage
(`public/lecons-voix/<id>.json`). Le **scénario** `public/lecons-scenes/<id>.json`
dit quoi montrer, et à quel instant de la voix. Le moteur
(`src/components/LessonScenes.tsx`) dessine tout d'après le temps de la voix.
S'il n'y a pas de scénario, la vidéo affiche seulement les phrases.

Modèle complet à imiter : `public/lecons-scenes/ca-marge-tresorerie.json`.

## Ce que l'utilisateur veut

« Une vidéo avec des animations, des exemples qu'on peut visualiser », pas le
texte qui défile : sinon, autant écouter le podcast.

- **Montrer, pas écrire.** Chaque phrase importante de la voix devient une image :
  des objets qui apparaissent, des chiffres qui comptent, des barres qui poussent,
  de l'argent qui entre et sort d'un compte, une courbe qui se dessine, un
  personnage qui parle. Le texte à l'écran reste court : un mot-clé, un
  chiffre, une formule. On ne recopie jamais la phrase de la voix.
- **Les chiffres de la voix, et seulement eux.** Jamais de chiffre inventé : si
  la voix dit « 10 bureaux à 500 € », on montre 10 bureaux et 5 000 €.
- **Calé au mot près.** Un élément apparaît au début de la phrase qui en parle
  (`start` de la ligne, ou un peu après quand le mot arrive en fin de phrase).
- **Une idée par scène**, 6 éléments au plus. Une scène dure en général de 10 à
  30 secondes et commence au début d'une phrase.
- **Sobre** : noir et argent. Une seule touche lavande (`accent`) par scène, sur
  ce qui compte. Vert d'eau (`gain`) pour ce qu'on gagne, rose pâle (`loss`) pour
  ce qu'on perd ou ce qui inquiète, gris (`muted`) pour le secondaire.
- **Des personnages** au trait pour incarner l'exemple (voir plus bas), dans les
  scènes peu chargées.

## Méthode

1. Lire le texte minuté : `node scripts/scene-script.mjs <id>`.
2. Découper en scènes : début 0, chaque scène commence là où finit la
   précédente, la dernière va au moins jusqu'à la durée totale (arrondir au-dessus).
3. Écrire `public/lecons-scenes/<id>.json` avec `"lesson"` et `"version"`
   identiques au minutage.
4. Vérifier le format : `npm test` (test « vidéo animée : <id> »). Il donne la
   raison de chaque refus (texte trop long, instant hors scène, total faux…).
5. Vérifier à l'écran (serveur de dev lancé) :
   `node scripts/check-scenes.mjs <id>` ; il signale ce qui sort de la vidéo ou
   se chevauche, sur ordinateur et téléphone. Corriger jusqu'à « ✔ ».
   `--shots=dossier` enregistre une image par scène pour regarder.

## Format

```json
{
  "lesson": "id-de-la-leçon",
  "version": "1.0.0",
  "scenes": [{ "from": 0, "to": 12.4, "items": [ … ] }]
}
```

Chaque élément a `"type"` et `"at"` (secondes de la voix, entre le début et la
fin de sa scène). Facultatif pour tous : `"out"` (s'efface à cet instant, reste
en retrait ; avec `"hide": true` il disparaît), `"id"` (nom pour les pièces qui
volent). Les éléments s'empilent de haut en bas, centrés.

Dans les textes, `[[mot]]` colore le mot en lavande, `[[mot|gain]]` en vert
d'eau, `[[mot|loss]]` en rose, `[[mot|muted]]` en gris.

| Type | Pour montrer | Champs |
| --- | --- | --- |
| `text` | un titre, un mot-clé, une formule courte | `text`, `size` (`title` ≤ 70 car., `big` ≤ 80, `mid` ≤ 110, `small` ≤ 140), `tone`, `mark: {text, at}` souligne un passage quand la voix le dit |
| `icon` | un objet | `icon`, `label`, `size` (`s`, `m`, `l`), `tone` |
| `icons` | une quantité (10 gâteaux, 3 clients) | `icon`, `count` (1 à 12), `step` (écart, 0,3 s), `label` sous chacun ; avec `id`, chaque icône s'appelle `id-0`, `id-1`… |
| `chips` | une formule qui se construit, des étiquettes | `items: [{text, at, tone}]` (≤ 7, ≤ 42 car.) ; un signe seul `+ − × ÷ = → ≠ < > ≈` s'affiche en opérateur |
| `cards` | 2 à 4 notions côte à côte | `items: [{icon, title (≤ 32), sub (≤ 70), at, subAt, tone, accent}]` |
| `counter` | un montant qui monte ou descend | `label`, `from`, `to`, `at`, `until`, `unit` (« € » par défaut, `" %"`, `""`…), `tone`, `bar: true` + `max` pour une jauge |
| `stats` | 2 à 4 chiffres qui comptent | `items: [{label, value, unit, at, until, tone, accent}]` |
| `bars` | comparer des grandeurs | `items: [{label, value, at, tone}]` (≤ 6), `unit` |
| `waterfall` | un calcul pas à pas (CA → marge → résultat) | `rows: [{label, value, kind, at, tone}]`, `kind` = `start` (première ligne), `plus`, `minus`, `total` (doit valoir le cumul exact) |
| `account` | l'argent qui entre et sort d'un compte (pièces qui volent, solde qui change) | `start`, `label`, `unit`, `flows: [{label, amount, dir: "in"/"out", at, note}]` (≤ 4) |
| `timeline` | des dates, un délai | `points: [{label, sub, pos (0 à 100), at}]`, `span: {label, from, to, at}` |
| `chart` | une évolution, une courbe qui se dessine | `lines: [{label, values: [..], at, until, tone}]` (≤ 3), `baseline: {value, label}` ; les valeurs sont des formes, pas des données inventées : ne pas les afficher |
| `list` | des questions, une liste à cocher | `style` `num`, `check`, `cross`, `dot` ; `items: [{text (≤ 80), at, style}]` (≤ 5) |
| `steps` | un processus en étapes | `items: [{text (≤ 28), icon, at}]` (≤ 5) |
| `split` | un tout qui se partage (50 € = 20 € + 30 €) | `total`, `label`, `unit`, `parts: [{label, value, at, tone}]` (la somme = `total`) |
| `gauge` | un pourcentage | `label`, `value` (0 à 100), `at`, `until`, `tone` |
| `compare` | avant / après, bon / mauvais choix | `left` et `right` : `{title, icon, items: [{text (≤ 48), at}]}` (≤ 4 lignes) |
| `dialog` | une conversation | `items: [{character, name, text (≤ 60), at, side: "left"/"right"}]` (≤ 3) |
| `actor` | un personnage en bas à gauche (ne compte pas dans les 6) | `character`, `name`, `think: {text (1 à 4 caractères, par exemple « ? » ou « ! »), at}` |
| `fly` | des pièces qui volent d'un élément à un autre (ne compte pas dans les 6) | `from`, `to` (des `id` de la scène), `at`, `until`, `count`, `dir` (`out` = rose) |
| `row` | mettre 2 à 5 éléments côte à côte | `items: [ … ]` (pas de `row` dans une `row`) |

**Icônes** : cake, flour, egg, butter, wallet, ticket, invoice, document,
contract, house, building, shop, factory, bank, truck, car, desk, box, cart,
lock, key, shield, umbrella, alert, check, cross, question, hour, clock,
calendar, coin, coins, piggy, card, calculator, percent, chart-up, chart-down,
chart-bar, pie, scale, target, rocket, briefcase, users, person, handshake,
phone, laptop, mail, chat, robot, brain, sparkle, database, eye, search, gear,
bulb, gift, plant, globe, link, flag, ladder, fire, snowball, pencil,
megaphone, fish, thermometer, heart, graduate, layers, basket, sun, euro.

**Personnages** : `toi` (la personne qui apprend, au quotidien), `patissiere`,
`artisan`, `entrepreneuse`, `client` (un client, un ami, un voisin),
`conseiller` (banquier, conseiller, comptable), `robot` (une IA).

## Pièges

- Un élément dont `at` tombe avant le début de la scène est refusé (marge de
  0,6 s) ; un élément après la fin aussi.
- `waterfall` : le `total` doit valoir exactement le cumul calculé.
- `split` : la somme des parts doit valoir `total`.
- Sur téléphone, la vidéo est presque carrée : éviter plus de 4 cartes ou 5
  éléments dans une `row`, et les longues rangées de pastilles.
- Les personnages s'effacent seuls s'ils touchent le contenu : ne pas compter
  sur eux pour une information.

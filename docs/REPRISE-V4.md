# Reprise — mission V4 (design premium, préservation)

Note de passage de relais écrite le 6 novembre 2026 par la session cloud « BOUSE : design V4 », devenue trop longue. **La nouvelle discussion reprend ici, sur le Mac.**

## État au 6 novembre 2026, soir (session Mac)

- **Jalons A, B et C terminés**, voir `design-reviews/V4_INVENTORY.md`, `V4_STYLE_SAMPLES.md`, `V4_HOME_VARIANTS.md`. **Choix de l'utilisateur : accueil B**, devenu la version par défaut avec la palette apaisée et l'Inter affiné (A et C retirés). Jalon D commencé le soir même : couleurs et lumière des planches de l'utilisateur partout, vague discrète en tête des pages d'outils, quiz et Atelier IA plus honnêtes, logo B à l'onboarding, Lab et Scénarios mobiles. Reste : Académie et compétences mobiles, en-tête de leçon compact, onboarding en 2 étapes, paramètres (voir `design-reviews/LATEST.md`). Idées pour plus tard : `docs/IDEES.md`.
- Outils locaux : Chrome installé est utilisé par Playwright (`channel: "chrome"`) pour les captures ; le serveur de dev se lance depuis la config « bouse » de `~/claude/.claude/launch.json`.
- Page interne `#labo-design` (développement seulement) : planche des jetons et contrastes.

## Où on en était (session cloud)

- Dépôt `angelknete07-cmyk/BOUSE`, branche `claude/bouse-development-resume-gktqqs` (PR #2 brouillon, ouverte). Production : https://bouse.vercel.app (déploiement Vercel manuel ou via l'intégration GitHub ; projet `bouse`).
- Dernière passe livrée : **32** (commit `c6ffd8d`) : accueil en tableau de bord, logo B, barre latérale large, accents violet/bleu/émeraude **jugés trop vifs** depuis.
- L'utilisateur a envoyé le **pack V4** (« BOUSE_REVIEW_V4_DA_PREMIUM_PRESERVER ») : sobriété premium 94–97 % neutre, vague `Terrain.tsx` intouchable, travail par jalons avec validation. Le pack n'est pas dans le dépôt ; ses consignes clés sont résumées ci-dessous et dans `docs/MEMOIRE-DESIGN.md`. Demander le ZIP à l'utilisateur si le détail est nécessaire (fichiers 00 à 07 + 2 PNG de référence).
- Mémoire rangée : `CLAUDE.md` (lu automatiquement), `docs/MEMOIRE-DESIGN.md`, règle d'accent V4 dans `AGENTS.md`. Les apprentissages ont aussi été envoyés à la session Mac « Sensibilité visuelle et design » pour le Cerveau.

## Jalons V4

1. **Jalon A — inventaire (EN COURS, aucun CSS modifié)**
   - Fait : captures AVANT au commit `c6ffd8d` dans `design-reviews/v4/avant/` : 14 routes × 6 formats (1440×900, 1440×1000, 768×1024, 390×844, 320×700, Pixel 7), pages entières en 1440×900 et 390×844. Planches-contact de la galerie canonique `design-reviews/screens/` (79 desktop, 80 mobile) examinées en vignettes (2 des 4 planches mobiles restent à regarder).
   - Empreintes de non-régression : `Terrain.tsx` sha256 `2c0c2a6c17356e9825d6783067d28b7e19b66e2f5f93e9fd7a5facce4cd9f7ea`, `BrandLogo.tsx` sha256 `a79231f7aeaf044610b3fcb61592760d5c2ca801420892656d29316aa25a6a38`.
   - Reste : finir l'examen des captures mobiles ; ouvrir en pleine résolution les états clés ; écrire `design-reviews/V4_INVENTORY.md` (matrice des 312 lignes du CSV avec statut vérifié/non vérifié, tableau KEEP / IMPROVE / REWORK / DO NOT TOUCH, registre de préservation, mesures des tokens et contrastes).
2. **Jalon B — système visuel** : cartographier tokens et overrides (`tokens.css`, `styles.css`, `shell.css`, `art-direction.css`, `dashboard-experience.css`, `fusion.css`, `console.css`, `finish.css`) ; 3 essais typographiques (Inter actuel, titres Manrope + Inter, Inter affiné) et 2 saturations (passe 32 vs apaisée : lavande `#9A8AB7`, glacier `#839CAF`, vert d'eau `#7FA69C`) sur de vrais composants ; page de contrôle interne non visible des clients ; contrastes AA. Livrable `design-reviews/V4_STYLE_SAMPLES.md`.
3. **Jalon C — accueil pilote** : 3 variantes **réelles** A (épuré), B (riche professionnel), C (proche de la référence, couleurs atténuées), même vague et mêmes données, activables sans changer le défaut (par exemple `?da=a|b|c`), captures à tous les formats. **Puis s'arrêter et attendre le choix de l'utilisateur** avant de propager.

## Constats déjà relevés (à confirmer dans le code)

| Priorité | Constat                                                                                                                                                                                                                     | Où                                                                                    |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| P1       | Violet `#A78BFA`, bleu `#6BA6F2`, émeraude `#3FCB9B` et halo `0 0 22px` à 45 % trop vifs (graphes, étapes, anneaux, bordure de navigation active, schéma IA à 7 pastilles violettes, aplat violet dans la scène « Risque ») | `src/tokens.css`, `src/console.css`, `src/fusion.css`                                 |
| P1       | 768×1024 : carte de l'accueil écrasée par la colonne « Ma progression », titre sur 3 lignes qui passe sous la vague                                                                                                         | `design-reviews/v4/avant/768x1024/home.png`, `console.css` (`.console-top` 1fr 220px) |
| P1       | 320×700 : bouton de reprise hors du premier écran ; titres d'en-tête (« Vue d'ensemble », « Mes compétences ») sur 2 lignes                                                                                                 | `v4/avant/320x700/home.png`, `skills.png`, `shell.css`                                |
| P1       | 320×700 : les champs des Préférences semblent dépasser à droite                                                                                                                                                             | `v4/avant/320x700/settings.png`                                                       |
| P1       | Colonne « Ma progression » presque vide (anneau 7 % isolé) ; tuiles qui répètent d'autres zones                                                                                                                             | `v4/avant/1440x900/home.png`, `Dashboard.tsx`                                         |
| P2       | Onboarding avec l'ancien logo « b. » au lieu du B argenté                                                                                                                                                                   | `v4/avant/*/onboarding.png`, `Onboarding.tsx`                                         |
| P2       | Mobile : Académie, la reprise arrive après titre, texte, lexique, onglets et recherche                                                                                                                                      | `v4/avant/390x844/academy.png`                                                        |
| P2       | Lab mobile : deux curseurs côte à côte trop étroits                                                                                                                                                                         | `v4/avant/390x844/lab.png`                                                            |
| P2       | Atelier IA : « 100 / 100 » peut se lire comme une note de qualité                                                                                                                                                           | `screens/desktop/06-ai-comparison.png`                                                |
| P2       | Quiz : « 100 % · C'est acquis » après 2 questions                                                                                                                                                                           | `screens/*/04-quiz-valide.png`                                                        |
| P2       | Micro-textes 8–11 px (`--type-coordinate`, `--type-annotation`, `--type-caption`) pour des informations utiles                                                                                                              | `src/tokens.css`                                                                      |

## Outils prêts

- Capture multi-formats : copier le script de la section « Script de capture » ci-dessous dans un fichier et le lancer avec le serveur de dev démarré : `node shots.mjs http://127.0.0.1:5173 design-reviews/v4/<dossier> [?da=a]`.
- Tests : `npm test` (245), `npx playwright test` (86), `npm run build`, `npx prettier --check "src/**/*.{ts,tsx,css}" "tests/**/*.ts" "supabase/**/*.ts"`, puis `node scripts/save-design-review.mjs --primary=<capture>`.
- Règles de commit : se terminer par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` ; ne jamais mettre d'identifiant de modèle dans le code ou la PR.

### Script de capture

```js
// node shots.mjs <base> <outdir> [query] : chaque route à six formats (+ page entière en 1440x900 et 390x844).
import { chromium, devices } from "playwright";
import fs from "node:fs";
const [base, out, query = ""] = process.argv.slice(2);
const b = await chromium.launch();
const at = (d) => new Date(Date.now() - d * 864e5).toISOString();
const att = (lessonId, d, ok = true) => ({
  lessonId,
  lessonVersion: "1.0.0",
  answers: {},
  correct: ok ? 2 : 1,
  total: 2,
  percent: ok ? 100 : 50,
  passed: ok,
  at: at(d),
});
const state = {
  schemaVersion: 1,
  profile: {
    name: "Camille",
    level: "Débutant++",
    goal: "Comprendre et piloter un business",
    interests: ["Finance", "Entrepreneuriat"],
    minutes: 20,
    preference: "Exemples puis pratique",
    diagnostic: { finance: 1, business: 3, ai: 0, personal: 1, investing: 3 },
  },
  attempts: [
    att("ca-marge-tresorerie", 6),
    att("validation-client", 4),
    att("fp-budget", 3),
    att("seuil-rentabilite", 1, false),
  ],
  notes: {
    "ca-marge-tresorerie": "Marge ≠ trésorerie : vérifier les délais clients.",
  },
  projects: [],
  lastLessonId: "seuil-rentabilite",
  lessonPositions: { "seuil-rentabilite": 2 },
};
const routes = process.env.ONLY
  ? process.env.ONLY.split(",")
  : [
      "home",
      "academy",
      "lesson/ca-marge-tresorerie",
      "skills",
      "portfolio",
      "reviews",
      "lab",
      "simulation",
      "ai",
      "incubator",
      "radar",
      "settings",
      "lexique",
      "onboarding",
    ];
const vps = [
  ["1440x900", { viewport: { width: 1440, height: 900 } }, true],
  ["1440x1000", { viewport: { width: 1440, height: 1000 } }, false],
  [
    "768x1024",
    { viewport: { width: 768, height: 1024 }, hasTouch: true },
    false,
  ],
  [
    "390x844",
    { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    true,
  ],
  [
    "320x700",
    { viewport: { width: 320, height: 700 }, isMobile: true, hasTouch: true },
    false,
  ],
  ["pixel7", devices["Pixel 7"], false],
];
for (const [name, o, full] of vps) {
  fs.mkdirSync(`${out}/${name}`, { recursive: true });
  const ctx = await b.newContext({
    ...o,
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  await ctx.addInitScript((s) => {
    if (
      location.hash !== "#onboarding" &&
      !localStorage.getItem("bouse.academy.v1")
    )
      localStorage.setItem("bouse.academy.v1", JSON.stringify(s));
  }, state);
  const p = await ctx.newPage();
  for (const r of routes) {
    const fresh = r === "onboarding";
    if (fresh) {
      await p.goto(`${base}/${query}#onboarding`);
      await p.evaluate(() => localStorage.clear());
      await p.reload();
    } else await p.goto(`${base}/${query}#${r}`);
    await p.waitForSelector("h1", { timeout: 15000 }).catch(() => {});
    await p.waitForTimeout(800);
    const file = r.replace(/\W+/g, "_");
    await p.screenshot({ path: `${out}/${name}/${file}.png` });
    if (full)
      await p.screenshot({
        path: `${out}/${name}/${file}-full.png`,
        fullPage: true,
      });
    if (fresh)
      await p.evaluate(
        (s) => localStorage.setItem("bouse.academy.v1", JSON.stringify(s)),
        state,
      );
  }
  await ctx.close();
}
await b.close();
```

## Autres sujets ouverts

- Supabase : migration `supabase/migrations/20261105120000_learning_state_and_mentor.sql` à appliquer sur le projet `uyrrsiufhynyhwdsyvlg`, puis variables `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` dans Vercel ; la clé Anthropic du mentor va uniquement dans les secrets Supabase, saisie par l'utilisateur.
- PR #2 : ne la fusionner que si l'utilisateur le demande.

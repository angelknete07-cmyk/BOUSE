// node scripts/capture-scenes.mjs <base> <avant|apres> [ids,séparés,par,virgules]
// Capture chaque scène interactive de leçon (desktop, mobile, 320) et mesure débordements + textes SVG < 11 px.
import { chromium } from "playwright";
import fs from "node:fs";

const [base = "http://127.0.0.1:5174", phase = "avant", only] =
  process.argv.slice(2);
const out = `design-reviews/v4/scenes/${phase}`;
fs.mkdirSync(out, { recursive: true });
const src = fs.readFileSync("src/components/LessonScene.tsx", "utf8");
const ids = [...src.matchAll(/lessonId === "([^"]+)"/g)].map((m) => m[1]);
const list = only ? only.split(",") : ids;
const state = {
  schemaVersion: 1,
  profile: {
    name: "Camille",
    level: "Débutant++",
    goal: "Comprendre et piloter un business",
    interests: ["Finance"],
    minutes: 20,
    preference: "Exemples puis pratique",
    diagnostic: { finance: 1, business: 3, ai: 0, personal: 1, investing: 3 },
  },
  attempts: [],
  notes: {},
  projects: [],
  lastLessonId: null,
  reviewEvents: [],
  experiments: [],
  decisions: [],
  simulations: [],
};
const vps = [
  ["desktop", { viewport: { width: 1440, height: 900 } }],
  [
    "mobile",
    {
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    },
  ],
  [
    "320",
    {
      viewport: { width: 320, height: 700 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    },
  ],
];
const report = {};
const b = await chromium
  .launch({ channel: "chrome" })
  .catch(() => chromium.launch());
await Promise.all(
  vps.map(async ([name, opts]) => {
    const ctx = await b.newContext(opts);
    const p = await ctx.newPage();
    await p.addInitScript((s) => {
      try {
        if (!localStorage.getItem("bouse.academy.v1"))
          localStorage.setItem("bouse.academy.v1", JSON.stringify(s));
      } catch {}
    }, state);
    for (const id of list) {
      await p.goto(`${base}/#lesson/${id}`);
      const sec = p.locator("section.scene-workbench").first();
      try {
        await sec.waitFor({ timeout: 8000 });
      } catch {
        report[`${id}/${name}`] = { error: "scène introuvable" };
        continue;
      }
      await p.waitForTimeout(500);
      await sec.scrollIntoViewIfNeeded();
      // Les éléments fixes (barre du bas, lien d'évitement) ne doivent pas recouvrir la capture.
      await p.evaluate(() =>
        document.querySelectorAll("body *").forEach((e) => {
          const c = getComputedStyle(e);
          if (
            (c.position === "fixed" || c.position === "sticky") &&
            !e.closest("section.scene-workbench")
          )
            e.style.visibility = "hidden";
        }),
      );
      await sec.screenshot({ path: `${out}/${id}-${name}.png` });
      report[`${id}/${name}`] = await p.evaluate(() => {
        const s = document.querySelector("section.scene-workbench");
        const vw = document.documentElement.clientWidth;
        const r = s.getBoundingClientRect();
        const over = [];
        s.querySelectorAll("*").forEach((e) => {
          const b = e.getBoundingClientRect();
          if (b.width && (b.right > vw + 1 || b.left < -1) && !e.closest("svg"))
            over.push(
              e.tagName +
                "." +
                String(e.className?.baseVal ?? e.className).slice(0, 40),
            );
        });
        const small = [];
        s.querySelectorAll("svg text").forEach((t) => {
          const m = t.getScreenCTM();
          const fs = parseFloat(getComputedStyle(t).fontSize) * (m ? m.a : 1);
          if (fs < 10.9)
            small.push(
              Math.round(fs * 10) / 10 +
                ":" +
                (t.textContent || "").slice(0, 12),
            );
        });
        const overlaps = [];
        s.querySelectorAll("svg").forEach((sv) => {
          const ts = [...sv.querySelectorAll("text")].map((t) => [
            t,
            t.getBoundingClientRect(),
          ]);
          for (let i = 0; i < ts.length; i++)
            for (let j = i + 1; j < ts.length; j++) {
              const a = ts[i][1],
                c = ts[j][1];
              if (
                a.width &&
                c.width &&
                a.left < c.right - 1 &&
                c.left < a.right - 1 &&
                a.top < c.bottom - 1 &&
                c.top < a.bottom - 1
              )
                overlaps.push(
                  ts[i][0].textContent.slice(0, 12) +
                    " × " +
                    ts[j][0].textContent.slice(0, 12),
                );
            }
        });
        return {
          overlaps,
          docOverflow: document.documentElement.scrollWidth > vw + 1,
          secWidth: Math.round(r.width),
          over: over.slice(0, 5),
          small: small.slice(0, 8),
          nSmall: small.length,
        };
      });
    }
    await ctx.close();
  }),
);
await b.close();
fs.writeFileSync(`${out}/_rapport.json`, JSON.stringify(report, null, 1));
const bad = Object.entries(report).filter(
  ([, v]) =>
    v.error ||
    v.docOverflow ||
    v.over?.length ||
    v.nSmall ||
    v.overlaps?.length,
);
console.log(`${list.length} scènes, ${bad.length} lignes à regarder`);
for (const [k, v] of bad) console.log(k, JSON.stringify(v));

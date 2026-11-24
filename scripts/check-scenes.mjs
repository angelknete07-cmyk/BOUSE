#!/usr/bin/env node
/* Vérifie à l'écran les vidéos animées des leçons : pour chaque scène, se
   place à la fin (tout est apparu) et cherche ce qui sort de la vidéo ou se
   chevauche, sur ordinateur et sur téléphone.
   Le serveur de dev doit tourner (npm run dev -- --port 5173).
   Usage : node scripts/check-scenes.mjs <id> [<id> …] [--shots=dossier] */
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const shots = args.find((a) => a.startsWith("--shots="))?.slice(8);
const ids = args.filter((a) => !a.startsWith("--"));
const url = process.env.BOUSE_TEST_URL ?? "http://localhost:5173";
if (!ids.length) {
  console.error("Usage : node scripts/check-scenes.mjs <id> [<id> …] [--shots=dossier]");
  process.exit(1);
}

const browser = await chromium.launch();
let problems = 0;
for (const [mode, viewport] of [
  ["ordinateur", { width: 1280, height: 860 }],
  ["téléphone", { width: 390, height: 844 }],
]) {
  for (const id of ids) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: shots ? 2 : 1 });
    await page.addInitScript((id) => {
      sessionStorage.setItem("bouse.splash.seen", "1");
      localStorage.setItem("bouse.tour.seen", "1");
      localStorage.setItem("bouse.tours.seen", "home,academy,skills,lesson");
      localStorage.setItem(
        "bouse.academy.v1:guest",
        JSON.stringify({
          schemaVersion: 1,
          profile: { name: "Camille", level: "Débutant", goal: "Comprendre les bases", interests: ["Finance"], minutes: 20, preference: "Exemples puis pratique", diagnostic: {} },
          attempts: [],
          projects: [],
          notes: {},
          lastLessonId: id,
          learningMode: "regarder",
        }),
      );
    }, id);
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(`${url}/#lesson/${id}`);
    const ready = await page
      .waitForSelector(".ls-root", { timeout: 10000 })
      .then(() => true)
      .catch(() => false);
    if (!ready) {
      console.log(`✖ ${id} (${mode}) : la vidéo animée ne s'affiche pas (scénario absent, invalide ou version différente de la voix)`);
      problems++;
      await page.close();
      continue;
    }
    await page.addStyleTag({ content: ".lm-bigplay{display:none!important}" });
    await page.locator(".lm-stage").evaluate((el) => el.scrollIntoView({ block: "center" }));
    const board = await page.evaluate((id) => fetch(`/lecons-scenes/${id}.json`).then((r) => r.json()), id);
    for (const [i, scene] of board.scenes.entries()) {
      const t = Math.max(scene.from, scene.to - 0.25);
      await page.evaluate((t) => {
        const audio = document.querySelector(".lesson-media audio");
        audio.currentTime = t;
        audio.dispatchEvent(new Event("timeupdate"));
      }, t);
      await page.waitForTimeout(900);
      const report = await page.evaluate(() => {
        const stage = document.querySelector(".lm-stage").getBoundingClientRect();
        const cam = document.querySelector(".ls-scene.is-on .ls-cam");
        if (!cam) return ["aucune scène affichée"];
        const out = [];
        const leaves = [...cam.querySelectorAll(".ls-a.is-in:not(.is-hidden):not(.is-gone)")]
          .filter((el) => !el.closest(".ls-side") && !el.closest(".ls-a.is-hidden, .ls-a.is-gone"))
          .flatMap((el) => [...el.querySelectorAll(".ls-text, .ls-chip, .ls-card, .ls-ico, .ls-num, .ls-bubble, .ls-wf-row, .ls-li, .ls-flow, .ls-vault, .ls-chart, .ls-op, .ls-tag")]);
        const unique = [...new Set(leaves)];
        const name = (el) => (el.textContent || el.className || "").trim().slice(0, 28);
        for (const el of unique) {
          const r = el.getBoundingClientRect();
          if (!r.width) continue;
          if (r.left < stage.left - 1 || r.right > stage.right + 1 || r.top < stage.top + stage.height * 0.12 || r.bottom > stage.bottom - 2)
            out.push(`sort de la vidéo : « ${name(el)} »`);
        }
        for (let a = 0; a < unique.length; a++)
          for (let b = a + 1; b < unique.length; b++) {
            const A = unique[a], B = unique[b];
            if (A.contains(B) || B.contains(A)) continue;
            const r = A.getBoundingClientRect(), o = B.getBoundingClientRect();
            const w = Math.min(r.right, o.right) - Math.max(r.left, o.left);
            const h = Math.min(r.bottom, o.bottom) - Math.max(r.top, o.top);
            if (w > 3 && h > 3) out.push(`chevauchement : « ${name(A)} » / « ${name(B)} »`);
          }
        return [...new Set(out)].slice(0, 6);
      });
      if (report.length) {
        problems++;
        console.log(`✖ ${id} (${mode}) scène ${i + 1} (${scene.from}–${scene.to}) :\n   ${report.join("\n   ")}`);
      }
      if (shots)
        await page.locator(".lm-stage").screenshot({ path: `${shots}/${id}-${mode === "ordinateur" ? "d" : "m"}-${String(i + 1).padStart(2, "0")}.png` });
    }
    if (errors.length) {
      problems++;
      console.log(`✖ ${id} (${mode}) erreurs : ${errors.join(" | ")}`);
    }
    await page.close();
  }
}
await browser.close();
console.log(problems ? `\n${problems} problème(s).` : "\n✔ Tout tient dans la vidéo, sans chevauchement.");
process.exit(problems ? 1 : 0);

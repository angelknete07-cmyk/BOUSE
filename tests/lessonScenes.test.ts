import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { lessons } from "../src/data/lessons.ts";
import {
  accountAt,
  checkBoard,
  chartPaths,
  isStoryboard,
  money,
  progress,
  richText,
  waterfallLayout,
  type AccountItem,
  type Storyboard,
} from "../src/lib/lessonScenes.ts";

/* La vidéo animée des leçons (scénarios dans public/lecons-scenes/). */

test("la progression est adoucie et bornée", () => {
  assert.equal(progress(0, 1, 2), 0);
  assert.equal(progress(3, 1, 2), 1);
  assert.ok(progress(1.5, 1, 2) > 0.5);
  assert.equal(progress(2, 2, 2), 1);
});

test("les montants s'écrivent à la française", () => {
  assert.equal(money(12000).replace(/\s/g, " "), "12 000 €");
  assert.equal(money(-300), "−300 €");
  assert.equal(money(4.5, " %"), "4,5 %");
});

test("[[mot]] colore un mot, avec un ton au choix", () => {
  assert.deepEqual(richText("Vendre [[≠]] gagner [[vite|loss]]"), [
    { text: "Vendre " },
    { text: "≠", tone: "accent" },
    { text: " gagner " },
    { text: "vite", tone: "loss" },
  ]);
});

test("la cascade place chaque barre au bon endroit", () => {
  const rows = waterfallLayout([
    { label: "CA", value: 5000, kind: "start", at: 0 },
    { label: "achats", value: 2000, kind: "minus", at: 1 },
    { label: "marge", value: 3000, kind: "total", at: 2 },
  ]);
  assert.deepEqual(
    rows.map((r) => [r.left, r.width]),
    [
      [0, 1],
      [0.6, 0.4],
      [0, 0.6],
    ],
  );
  assert.equal(rows[2]!.running, 3000);
});

test("le compte bouge quand la pièce arrive", () => {
  const item: AccountItem = {
    type: "account",
    at: 0,
    start: 1000,
    flows: [
      { label: "vente", amount: 600, dir: "in", at: 1 },
      { label: "achat", amount: 500, dir: "out", at: 3 },
    ],
  };
  assert.equal(accountAt(item, 1.2), 1000);
  assert.equal(accountAt(item, 2), 1600);
  assert.equal(accountAt(item, 4), 1100);
});

test("une courbe se trace dans sa boîte", () => {
  const { lines, baseline } = chartPaths({
    type: "chart",
    at: 0,
    baseline: { value: 0, label: "0 €" },
    lines: [{ label: "a", values: [0, 10], at: 0, until: 1 }],
  });
  assert.match(lines[0]!.d, /^M0\.0 190\.0 C/);
  assert.equal(baseline, 190);
});

test("un scénario faux est refusé, avec la raison", () => {
  const board: Storyboard = {
    lesson: "x",
    version: "1",
    scenes: [
      {
        from: 0,
        to: 10,
        items: [
          { type: "icon", icon: "licorne", at: 1 },
          { type: "text", text: "Trop tard", at: 12 },
          { type: "fly", from: "a", to: "b", at: 2, until: 3 },
          {
            type: "waterfall",
            at: 1,
            rows: [
              { label: "CA", value: 100, kind: "start", at: 1 },
              { label: "coûts", value: 30, kind: "minus", at: 2 },
              { label: "marge", value: 60, kind: "total", at: 3 },
            ],
          },
        ],
      },
    ],
  };
  const errors = checkBoard(board, {
    lesson: "x",
    version: "1",
    voice: "v",
    duration: 12,
    lines: [],
  });
  const all = errors.join("\n");
  assert.match(all, /icône inconnue « licorne »/);
  assert.match(all, /instant 12 hors de la scène/);
  assert.match(all, /« a » introuvable/);
  assert.match(all, /total « marge » faux/);
  assert.match(all, /jusqu'à la fin \(12\)/);
});

for (const lesson of lessons) {
  test(`vidéo animée : ${lesson.id}`, () => {
    const file = new URL(`../public/lecons-scenes/${lesson.id}.json`, import.meta.url);
    assert.ok(existsSync(file), `scénario manquant : ${lesson.id}`);
    const board = JSON.parse(readFileSync(file, "utf8"));
    assert.ok(isStoryboard(board), "format");
    const track = JSON.parse(
      readFileSync(new URL(`../public/lecons-voix/${lesson.id}.json`, import.meta.url), "utf8"),
    );
    assert.deepEqual(checkBoard(board, track), []);
  });
}

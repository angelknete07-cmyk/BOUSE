import test from "node:test";
import assert from "node:assert/strict";
import {
  glossaryFor,
  glossaryLabel,
  linkGlossary,
} from "../src/lib/glossaryLinks.ts";

const credit = {
  id: "fp-credit-taux",
  prerequisites: ["fp-epargne-precaution"],
};
const llm = { id: "comprendre-llm", prerequisites: [] };

test("a parenthesised gloss is not part of the running-text label", () => {
  assert.equal(glossaryLabel("ETF (tracker)"), "ETF");
  assert.equal(glossaryLabel("Perte maximale (drawdown)"), "Perte maximale");
});

test("terms are linked once per paragraph, longest first, case kept", () => {
  const segments = linkGlossary(
    "Le TAEG dépasse le taux nominal ; comparer le TAEG, pas le taux nominal.",
    glossaryFor(credit),
  );
  const linked = segments.filter((s) => typeof s !== "string");
  assert.deepEqual(
    linked.map((s) => typeof s !== "string" && s.text),
    ["TAEG", "taux nominal"],
  );
  assert.equal(
    segments.map((s) => (typeof s === "string" ? s : s.text)).join(""),
    "Le TAEG dépasse le taux nominal ; comparer le TAEG, pas le taux nominal.",
  );
});

test("a common word is only recognised where it carries its financial meaning", () => {
  const text = "Une action concrète : vérifier chaque affirmation.";
  assert.ok(
    linkGlossary(text, glossaryFor(llm)).every((s) => typeof s === "string"),
  );
  const markets = { id: "inv-marches-financiers", prerequisites: [] };
  assert.ok(
    linkGlossary(
      "Une action est une part du capital.",
      glossaryFor(markets),
    ).some((s) => typeof s !== "string" && s.text === "action"),
  );
});

test("an acronym is not matched inside a word or in lower case", () => {
  const segments = linkGlossary(
    "Une période pea calme, puis le PEA.",
    glossaryFor(llm),
  );
  const linked = segments.filter((s) => typeof s !== "string");
  assert.equal(linked.length, 1);
});

import { glossary } from "../src/data/investingGlossary.ts";
import { simpleDefinitions } from "../src/data/glossarySimple.ts";
import { lessons } from "../src/data/lessons.ts";
import {
  closeBubbles,
  glossaryForDefinition,
  openBubble,
  placeBubble,
  pruneHovered,
} from "../src/lib/glossaryLinks.ts";

const entry = (id: string) => glossary.find((item) => item.id === id)!;
const prerequisitesOf = (id: string) =>
  lessons.find((lesson) => lesson.id === id)?.prerequisites ?? [];
const linkedIn = (text: string, terms: ReturnType<typeof glossaryFor>) =>
  linkGlossary(text, terms).flatMap((s) =>
    typeof s === "string" ? [] : [s.entry.id],
  );

test("every term has a short definition for everyone", () => {
  for (const item of glossary) {
    const simple = simpleDefinitions[item.id];
    assert.ok(simple, `définition simple manquante : ${item.id}`);
    assert.ok(simple.length <= 220, `trop longue : ${item.id}`);
  }
  assert.deepEqual(
    Object.keys(simpleDefinitions).filter(
      (id) => !glossary.some((g) => g.id === id),
    ),
    [],
  );
});

test("a definition links its own technical words, never itself", () => {
  const action = entry("action");
  const terms = glossaryForDefinition(action, llm, prerequisitesOf);
  const linked = linkedIn(simpleDefinitions.action!, terms);
  assert.ok(!linked.includes("action"));
  // « Dividende » is a single word: linked because it belongs to the lesson
  // that explains « Action », even when reading an AI lesson.
  assert.ok(linked.includes("dividende"));
  assert.ok(linkedIn(action.definition, terms).includes("dividende"));
  // A plural finds its term: « ses actions » in « Dividende ».
  assert.ok(
    linkedIn(
      simpleDefinitions.dividende!,
      glossaryForDefinition(entry("dividende"), llm, prerequisitesOf),
    ).includes("action"),
  );
});

test("nested definitions cascade: a term inside a bubble leads further", () => {
  // ETF → indice boursier → CAC 40: two levels deep.
  const etfTerms = glossaryForDefinition(entry("etf"), llm, prerequisitesOf);
  assert.ok(linkedIn(simpleDefinitions.etf!, etfTerms).includes("indice"));
  const indexTerms = glossaryForDefinition(
    entry("indice"),
    llm,
    prerequisitesOf,
  );
  assert.ok(linkedIn(simpleDefinitions.indice!, indexTerms).includes("cac40"));
});

test("bubbles form a stack: deeper ones replace, click pins the chain", () => {
  const a = { key: "a", entryId: "etf", pinned: false };
  const b = { key: "b", entryId: "indice", pinned: true };
  const c = { key: "c", entryId: "cac40", pinned: false };
  let stack = openBubble([], 0, a);
  stack = openBubble(stack, 1, b);
  assert.deepEqual(
    stack.map((item) => [item.key, item.pinned]),
    [
      ["a", true],
      ["b", true],
    ],
  );
  stack = openBubble(stack, 2, c);
  // Another term in the first bubble replaces everything above it.
  const replaced = openBubble(stack, 1, { ...c, key: "d" });
  assert.deepEqual(
    replaced.map((item) => item.key),
    ["a", "d"],
  );
  assert.deepEqual(
    closeBubbles(stack, 1).map((item) => item.key),
    ["a"],
  );
  assert.deepEqual(closeBubbles(stack, 0), []);
  // The pointer leaves the hovered bubble: only the unpinned one above closes.
  assert.deepEqual(
    pruneHovered(stack, 1).map((item) => item.key),
    ["a", "b"],
  );
  assert.equal(pruneHovered(stack, 2), stack);
  assert.deepEqual(pruneHovered([a], -1), []);
});

test("a bubble stays on a 320 px screen and above the mobile dock", () => {
  const viewport = { width: 320, height: 700 };
  // A term at the right edge, near the bottom, with a 76 px dock.
  const spot = placeBubble({
    anchor: { top: 560, left: 280, width: 30, height: 20 },
    bubble: { width: 360, height: 260 },
    viewport,
    bottom: 624,
  });
  assert.equal(spot.width, 296);
  assert.equal(spot.left, 12);
  assert.equal(spot.side, "above");
  assert.ok(spot.top >= 12 && spot.top + 260 <= 560);
  assert.ok(spot.arrow <= spot.width - 18);
  // Room below: it opens under the term, never under the dock.
  const below = placeBubble({
    anchor: { top: 100, left: 20, width: 40, height: 20 },
    bubble: { width: 360, height: 260 },
    viewport,
    bottom: 624,
  });
  assert.equal(below.side, "below");
  assert.equal(below.top, 128);
  assert.ok(below.top + Math.min(260, below.maxHeight) <= 624 - 12);
});

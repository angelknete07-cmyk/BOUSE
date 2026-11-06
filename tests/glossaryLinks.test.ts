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

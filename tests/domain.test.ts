import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateEconomics,
  evaluateQuiz,
  nextProjectStage,
  normalizeSearch,
  projectStages,
  reviewPrompt,
} from "../src/lib/domain.ts";

test("search matches French accents, ligatures, case and extra spaces", () => {
  assert.equal(
    normalizeSearch("  TRÉSORERIE   & Œuvre  "),
    "tresorerie & oeuvre",
  );
  assert.equal(normalizeSearch(""), "");
});

test("unit economics connects sales, variable costs and fixed costs", () => {
  assert.deepEqual(
    calculateEconomics({
      price: 50,
      unitCost: 20,
      units: 100,
      fixedCosts: 2_000,
    }),
    {
      revenue: 5_000,
      variableCosts: 2_000,
      contribution: 3_000,
      contributionRate: 0.6,
      profit: 1_000,
      breakEvenUnits: 67,
    },
  );
});

test("break-even rounds up and actually covers fixed costs", () => {
  const input = { price: 10, unitCost: 4, units: 0, fixedCosts: 100 };
  const result = calculateEconomics(input);
  assert.equal(result.breakEvenUnits, 17);
  assert.ok(
    calculateEconomics({ ...input, units: result.breakEvenUnits! }).profit >= 0,
  );
  assert.ok(
    calculateEconomics({ ...input, units: result.breakEvenUnits! - 1 }).profit <
      0,
  );
});

test("no sales gives a loss equal to fixed costs without an undefined rate", () => {
  const result = calculateEconomics({
    price: 20,
    unitCost: 10,
    units: 0,
    fixedCosts: 200,
  });
  assert.equal(result.profit, -200);
  assert.equal(result.contributionRate, 0.5);
});

test("zero or negative contribution cannot cover fixed costs", () => {
  assert.equal(
    calculateEconomics({ price: 10, unitCost: 10, units: 100, fixedCosts: 20 })
      .breakEvenUnits,
    null,
  );
  const result = calculateEconomics({
    price: 10,
    unitCost: 15,
    units: 100,
    fixedCosts: 20,
  });
  assert.equal(result.breakEvenUnits, null);
  assert.equal(result.profit, -520);
});

test("zero fixed costs needs zero units when contribution is positive", () => {
  assert.equal(
    calculateEconomics({ price: 10, unitCost: 5, units: 0, fixedCosts: 0 })
      .breakEvenUnits,
    0,
  );
});

test("invalid and overflowing economics inputs fail explicitly", () => {
  const base = { price: 10, unitCost: 5, units: 100, fixedCosts: 50 };
  for (const value of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
    for (const key of Object.keys(base))
      assert.throws(
        () => calculateEconomics({ ...base, [key]: value }),
        RangeError,
      );
  }
  assert.throws(() => calculateEconomics({ ...base, price: 0 }), RangeError);
  assert.throws(
    () => calculateEconomics({ ...base, price: Number.MAX_VALUE, units: 100 }),
    RangeError,
  );
});

const questions = Array.from({ length: 5 }, (_, index) => ({
  id: `q${index}`,
  answer: index % 2,
}));

test("quiz accepts exactly 80 percent only when every question was answered", () => {
  assert.deepEqual(
    evaluateQuiz(questions, { q0: 0, q1: 1, q2: 0, q3: 1, q4: 1 }),
    {
      correct: 4,
      total: 5,
      percent: 80,
      passed: true,
    },
  );
  assert.equal(
    evaluateQuiz(questions, { q0: 0, q1: 1, q2: 0, q3: 1 }).passed,
    false,
  );
});

test("quiz has no phantom correct answer for index zero", () => {
  assert.deepEqual(evaluateQuiz([{ id: "a", answer: 0 }], {}), {
    correct: 0,
    total: 1,
    percent: 0,
    passed: false,
  });
});

test("an empty quiz cannot pass and unrelated answers do not increase the score", () => {
  assert.equal(evaluateQuiz([], {}).passed, false);
  assert.equal(
    evaluateQuiz([{ id: "a", answer: 0 }], { a: 1, other: 0 }).percent,
    0,
  );
});

test("invalid quiz definitions and answers are handled", () => {
  assert.throws(() =>
    evaluateQuiz(
      [
        { id: "a", answer: 0 },
        { id: "a", answer: 1 },
      ],
      {},
    ),
  );
  assert.throws(() => evaluateQuiz([{ id: "", answer: 0 }], {}));
  assert.throws(() => evaluateQuiz([{ id: "a", answer: -1 }], {}));
  assert.equal(
    evaluateQuiz([{ id: "a", answer: 0 }], { a: Number.NaN }).passed,
    false,
  );
});

test("quiz evaluation is repeatable and does not mutate answers", () => {
  const answers = Object.freeze({ a: 0 });
  const first = evaluateQuiz([{ id: "a", answer: 0 }], answers);
  assert.deepEqual(evaluateQuiz([{ id: "a", answer: 0 }], answers), first);
});

test("prompt checklist is empty for vague or empty prompts", () => {
  assert.equal(reviewPrompt("").score, 0);
  assert.equal(reviewPrompt("Fais quelque chose de bien.").score, 0);
  assert.equal(reviewPrompt("").checks.length, 6);
});

test("prompt checklist identifies explicit fields without claiming semantic correctness", () => {
  const prompt =
    "Objectif : compare ces offres. Contexte : une entreprise. Données : les devis ci-dessous. Contraintes : maximum 200 mots. Format : tableau. Vérifie les hypothèses.";
  const result = reviewPrompt(prompt);
  assert.equal(result.score, 100);
  assert.ok(result.checks.every((check) => check.passed));
  assert.ok(result.suggestion.includes(prompt));
  assert.ok(result.suggestion.includes("[action précise"));
});

test("project stages advance one step and stop at growth", () => {
  assert.equal(nextProjectStage("Idée"), "Recherche");
  assert.equal(nextProjectStage("Validation"), "Business model");
  assert.equal(nextProjectStage("Croissance"), "Croissance");
  assert.equal(projectStages.length, 9);
  assert.throws(() => nextProjectStage("Publié"), RangeError);
});

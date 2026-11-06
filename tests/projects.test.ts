import test from "node:test";
import assert from "node:assert/strict";
import {
  createDecision,
  createExperiment,
  isDecision,
  isExperiment,
  projectTextLimits,
  recordDecisionOutcome,
  recordExperimentResult,
  type DecisionDraft,
  type ExperimentDraft,
} from "../src/lib/projects.ts";
import type { DecisionOutcome, ExperimentResult } from "../src/lib/types.ts";

const createdAt = new Date("2026-11-02T10:00:00.000Z");
const recordedAt = new Date("2026-11-09T10:00:00.000Z");
const experimentDraft: ExperimentDraft = {
  projectId: "atelier-1",
  title: "Observer le suivi des impayés",
  hypothesis: "Les artisans passent plus d’une heure par semaine à relancer.",
  protocol:
    "Interroger cinq artisans sur leur dernière semaine, sans suggérer de réponse.",
  successCriterion:
    "Au moins trois décrivent un cas récent avec un temps mesuré.",
  reviewOn: "2026-11-09",
};
const resultDraft: Omit<ExperimentResult, "recordedAt"> = {
  observation:
    "Deux artisans sur cinq décrivent un cas récent et un temps mesuré.",
  evidence:
    "Notes anonymisées des cinq entretiens, avec leurs estimations de durée.",
  conclusion: "refuted",
};
const decisionDraft: DecisionDraft = {
  projectId: "atelier-1",
  experimentId: "test-1",
  title: "Tester un segment plus précis",
  context:
    "Le premier test n’a pas atteint son critère, mais deux cas semblent plus douloureux.",
  options:
    "Abandonner cette piste ; approfondir les artisans B2B ; changer de problème.",
  choice:
    "Interroger cinq artisans qui facturent principalement des entreprises.",
  expectedOutcome:
    "Au moins trois décrivent un besoin récurrent et une solution actuelle coûteuse.",
  confidence: 55,
  risk: "Confondre une difficulté rare avec un besoin régulier.",
  reviewOn: "2026-11-16",
};
const outcomeDraft: Omit<DecisionOutcome, "recordedAt"> = {
  observed:
    "Quatre entretiens confirment des difficultés récurrentes ; aucun paiement n’a été demandé.",
  comparison: "mixed",
  learning:
    "Le problème est mieux ciblé, mais la volonté de payer reste à tester.",
};

test("a test records a trimmed plan and an explicit UTC creation instant", () => {
  const draft = Object.freeze({
    ...experimentDraft,
    title: `  ${experimentDraft.title}  `,
  });
  const experiment = createExperiment(draft, " test-1 ", createdAt);
  assert.equal(experiment.id, "test-1");
  assert.equal(experiment.title, experimentDraft.title);
  assert.equal(experiment.createdAt, createdAt.toISOString());
  assert.equal(experiment.result, undefined);
  assert.equal(draft.title, `  ${experimentDraft.title}  `);
  assert.equal(createdAt.toISOString(), "2026-11-02T10:00:00.000Z");
  assert.equal(isExperiment(experiment), true);
});

test("an observed result preserves the original hypothesis, criterion and protocol", () => {
  const experiment = Object.freeze(
    createExperiment(experimentDraft, "test-1", createdAt),
  );
  const completed = recordExperimentResult(
    experiment,
    Object.freeze(resultDraft),
    recordedAt,
  );
  assert.deepEqual(
    { ...completed, result: undefined },
    { ...experiment, result: undefined },
  );
  assert.deepEqual(completed.result, {
    ...resultDraft,
    recordedAt: recordedAt.toISOString(),
  });
  assert.equal(experiment.result, undefined);
  assert.equal(isExperiment(completed), true);
});

test("a result cannot overwrite previously recorded observations", () => {
  const experiment = recordExperimentResult(
    createExperiment(experimentDraft, "test-1", createdAt),
    resultDraft,
    recordedAt,
  );
  assert.throws(
    () =>
      recordExperimentResult(
        experiment,
        { ...resultDraft, conclusion: "supported" },
        new Date("2026-11-10T10:00:00.000Z"),
      ),
    /déjà consigné/,
  );
  assert.equal(experiment.result?.conclusion, "refuted");
});

test("runtime drafts cannot inject a result, ID or creation date", () => {
  const poisoned = {
    ...experimentDraft,
    id: "fake",
    createdAt: "2000-01-01T00:00:00.000Z",
    result: { ...resultDraft, recordedAt: "2000-01-02T00:00:00.000Z" },
  };
  const experiment = createExperiment(poisoned, "actual-test", createdAt);
  assert.equal(experiment.id, "actual-test");
  assert.equal(experiment.createdAt, createdAt.toISOString());
  assert.equal(experiment.result, undefined);
});

test("deadlines are actual calendar dates, including leap-day rules", () => {
  for (const date of ["2024-02-29", "2026-11-09", "2020-01-01", "2030-05-01"]) {
    assert.equal(
      isExperiment(
        createExperiment(
          { ...experimentDraft, reviewOn: date },
          "test-1",
          createdAt,
        ),
      ),
      true,
    );
  }
  for (const date of [
    "2026-02-29",
    "2026-02-30",
    "2026-13-01",
    "2026-00-10",
    "2026-11-00",
    "2026-11-31",
    "02/11/2026",
    "2026-1-2",
    "2026-11-02T00:00:00.000Z",
  ]) {
    assert.throws(() =>
      createExperiment(
        { ...experimentDraft, reviewOn: date },
        "test-1",
        createdAt,
      ),
    );
  }
});

test("the import validators reject ambiguous instants and results preceding the plan", () => {
  const experiment = createExperiment(experimentDraft, "test-1", createdAt);
  for (const createdAt of [
    "2026-11-02",
    "2026-11-02T10:00:00Z",
    "2026-11-02T11:00:00.000+01:00",
    "not-a-date",
  ]) {
    assert.equal(isExperiment({ ...experiment, createdAt }), false);
  }
  assert.throws(() =>
    recordExperimentResult(
      experiment,
      resultDraft,
      new Date("2026-11-01T10:00:00.000Z"),
    ),
  );
  assert.equal(
    isExperiment({
      ...experiment,
      result: { ...resultDraft, recordedAt: "2026-11-01T10:00:00.000Z" },
    }),
    false,
  );
  assert.doesNotThrow(() =>
    recordExperimentResult(experiment, resultDraft, createdAt),
  );
});

test("empty required fields and oversized plans are refused", () => {
  for (const key of [
    "projectId",
    "title",
    "hypothesis",
    "protocol",
    "successCriterion",
    "reviewOn",
  ] as const) {
    assert.throws(() =>
      createExperiment(
        { ...experimentDraft, [key]: " \n " },
        "test-1",
        createdAt,
      ),
    );
  }
  assert.throws(() =>
    createExperiment(
      { ...experimentDraft, title: "a".repeat(projectTextLimits.title + 1) },
      "test-1",
      createdAt,
    ),
  );
  assert.throws(() =>
    createExperiment(
      { ...experimentDraft, protocol: "a".repeat(projectTextLimits.long + 1) },
      "test-1",
      createdAt,
    ),
  );
  assert.throws(() =>
    createExperiment(
      {
        ...experimentDraft,
        hypothesis: "a".repeat(projectTextLimits.short + 1),
      },
      "test-1",
      createdAt,
    ),
  );
  assert.throws(() =>
    createExperiment(
      experimentDraft,
      "a".repeat(projectTextLimits.id + 1),
      createdAt,
    ),
  );
});

test("a result requires concrete observation, evidence and an allowed conclusion", () => {
  const experiment = createExperiment(experimentDraft, "test-1", createdAt);
  for (const invalid of [
    null,
    {},
    [],
    { ...resultDraft, recordedAt: recordedAt.toISOString(), observation: " " },
    { ...resultDraft, recordedAt: recordedAt.toISOString(), evidence: " " },
    {
      ...resultDraft,
      recordedAt: recordedAt.toISOString(),
      conclusion: "proven",
    },
  ]) {
    assert.equal(isExperiment({ ...experiment, result: invalid }), false);
  }
  assert.throws(() =>
    recordExperimentResult(
      experiment,
      { ...resultDraft, evidence: " " },
      recordedAt,
    ),
  );
  assert.throws(() =>
    recordExperimentResult(
      experiment,
      { ...resultDraft, observation: "a".repeat(projectTextLimits.long + 1) },
      recordedAt,
    ),
  );
});

test("decisions retain the alternatives, choice and confidence known before the outcome", () => {
  const draft = Object.freeze({
    ...decisionDraft,
    choice: `  ${decisionDraft.choice}  `,
  });
  const decision = Object.freeze(
    createDecision(draft, "decision-1", createdAt),
  );
  const completed = recordDecisionOutcome(
    decision,
    Object.freeze(outcomeDraft),
    recordedAt,
  );
  assert.equal(decision.choice, decisionDraft.choice);
  assert.equal(draft.choice, `  ${decisionDraft.choice}  `);
  assert.deepEqual(
    { ...completed, outcome: undefined },
    { ...decision, outcome: undefined },
  );
  assert.equal(completed.confidence, 55);
  assert.equal(completed.expectedOutcome, decisionDraft.expectedOutcome);
  assert.equal(completed.outcome?.comparison, "mixed");
  assert.equal(decision.outcome, undefined);
  assert.equal(isDecision(completed), true);
});

test("a decision can stand alone or reference a test without inventing its validity", () => {
  const { experimentId, ...standalone } = decisionDraft;
  assert.equal(
    createDecision(standalone, "decision-1", createdAt).experimentId,
    undefined,
  );
  assert.equal(
    createDecision(decisionDraft, "decision-1", createdAt).experimentId,
    experimentId,
  );
  assert.equal(
    isDecision({
      ...createDecision(standalone, "decision-1", createdAt),
      experimentId: "",
    }),
    false,
  );
});

test("confidence is an integer from zero to one hundred, not a computed truth score", () => {
  for (const confidence of [0, 1, 55, 100])
    assert.equal(
      createDecision({ ...decisionDraft, confidence }, "decision-1", createdAt)
        .confidence,
      confidence,
    );
  for (const confidence of [
    -1,
    101,
    50.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    "55",
    null,
  ]) {
    assert.equal(
      isDecision({
        ...createDecision(decisionDraft, "decision-1", createdAt),
        confidence,
      }),
      false,
    );
  }
});

test("decision narratives are required and bounded before the journal entry is saved", () => {
  for (const key of [
    "projectId",
    "title",
    "context",
    "options",
    "choice",
    "expectedOutcome",
    "risk",
    "reviewOn",
  ] as const) {
    assert.throws(() =>
      createDecision({ ...decisionDraft, [key]: " " }, "decision-1", createdAt),
    );
  }
  assert.throws(() =>
    createDecision(
      { ...decisionDraft, choice: "a".repeat(projectTextLimits.short + 1) },
      "decision-1",
      createdAt,
    ),
  );
  assert.throws(() =>
    createDecision(
      { ...decisionDraft, options: "a".repeat(projectTextLimits.long + 1) },
      "decision-1",
      createdAt,
    ),
  );
});

test("an outcome cannot rewrite an existing retrospective", () => {
  const completed = recordDecisionOutcome(
    createDecision(decisionDraft, "decision-1", createdAt),
    outcomeDraft,
    recordedAt,
  );
  assert.throws(
    () =>
      recordDecisionOutcome(
        completed,
        { ...outcomeDraft, comparison: "better" },
        new Date("2026-11-10T10:00:00.000Z"),
      ),
    /déjà consigné/,
  );
  assert.equal(completed.outcome?.comparison, "mixed");
});

test("a retrospective requires an observed result, a comparison and a lesson", () => {
  const decision = createDecision(decisionDraft, "decision-1", createdAt);
  for (const outcome of [
    null,
    [],
    {},
    { ...outcomeDraft, recordedAt: recordedAt.toISOString(), observed: " " },
    { ...outcomeDraft, recordedAt: recordedAt.toISOString(), learning: " " },
    {
      ...outcomeDraft,
      recordedAt: recordedAt.toISOString(),
      comparison: "right",
    },
    { ...outcomeDraft, recordedAt: "2026-11-01T10:00:00.000Z" },
  ]) {
    assert.equal(isDecision({ ...decision, outcome }), false);
  }
  assert.throws(() =>
    recordDecisionOutcome(
      decision,
      { ...outcomeDraft, learning: " " },
      recordedAt,
    ),
  );
  assert.throws(() =>
    recordDecisionOutcome(
      decision,
      outcomeDraft,
      new Date("2026-11-01T10:00:00.000Z"),
    ),
  );
});

test("malformed roots, invalid clocks and imported null terminal records are refused", () => {
  for (const value of [null, false, [], "test", 42]) {
    assert.equal(isExperiment(value), false);
    assert.equal(isDecision(value), false);
  }
  assert.throws(
    () => createExperiment(experimentDraft, "test-1", new Date("invalid")),
    RangeError,
  );
  assert.throws(
    () => createDecision(decisionDraft, "decision-1", new Date("invalid")),
    RangeError,
  );
  assert.equal(
    isExperiment({
      ...createExperiment(experimentDraft, "test-1", createdAt),
      result: null,
    }),
    false,
  );
  assert.equal(
    isDecision({
      ...createDecision(decisionDraft, "decision-1", createdAt),
      outcome: null,
    }),
    false,
  );
});

test("future and historical records remain importable without relying on the machine clock", () => {
  const future = createExperiment(
    { ...experimentDraft, reviewOn: "2035-03-01" },
    "test-future",
    new Date("2035-02-01T10:00:00.000Z"),
  );
  const historical = createDecision(
    { ...decisionDraft, reviewOn: "2020-01-01" },
    "decision-history",
    new Date("2020-01-02T10:00:00.000Z"),
  );
  assert.equal(isExperiment(future), true);
  assert.equal(isDecision(historical), true);
});

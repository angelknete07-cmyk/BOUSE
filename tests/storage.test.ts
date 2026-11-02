import test from "node:test";
import assert from "node:assert/strict";
import { emptyState, parseState } from "../src/lib/storage.ts";
import type { ReviewEvent } from "../src/lib/types.ts";
import type { ProjectExperiment, ProjectDecision } from "../src/lib/types.ts";

function savedState() {
  return {
    schemaVersion: 1,
    profile: {
      name: "Camille",
      level: "Débutant++",
      goal: "Comprendre les finances de mon projet",
      interests: ["Finance", "Intelligence artificielle"],
      minutes: 20,
      preference: "Pratiquer",
      diagnostic: { marge: 0, tresorerie: 1 },
    },
    attempts: [
      {
        lessonId: "ca-marge-tresorerie",
        answers: { q1: 0, q2: 1 },
        correct: 2,
        total: 2,
        percent: 100,
        passed: true,
        at: "2026-11-02T10:00:00.000Z",
      },
    ],
    projects: [
      {
        id: "projet-1",
        title: "Prévisions de production",
        problem: "Le surplus est jeté.",
        customer: "Boulangeries indépendantes",
        hypothesis: "Une meilleure prévision réduit les invendus.",
        nextAction: "Interroger trois commerces.",
        stage: "Idée",
        lessonIds: ["ca-marge-tresorerie"],
        createdAt: "2026-11-02T10:00:00.000Z",
      },
    ],
    notes: {
      "ca-marge-tresorerie": "La marge ne mesure pas les encaissements.",
    },
    lastLessonId: "ca-marge-tresorerie",
  };
}

const parse = (value: unknown) => parseState(JSON.stringify(value));

const fieldTest: ProjectExperiment = {
  id: "test-1",
  projectId: "projet-1",
  title: "Comparer la prévision aux ventes",
  hypothesis: "Une prévision hebdomadaire évite les achats inutiles.",
  protocol: "Comparer quatre semaines de prévisions avec les ventes observées.",
  successCriterion:
    "L’écart reste inférieur à dix pour cent sur trois semaines.",
  reviewOn: "2026-11-30",
  createdAt: "2026-11-02T10:00:00.000Z",
  result: {
    observation: "L’écart a varié suivant les semaines.",
    evidence: "Tableau des quatre semaines conservé dans le dossier local.",
    conclusion: "inconclusive",
    recordedAt: "2026-12-01T10:00:00.000Z",
  },
};
const projectDecision: ProjectDecision = {
  id: "decision-1",
  projectId: "projet-1",
  experimentId: "test-1",
  title: "Tester avec un second commerce",
  context: "Le premier résultat est ambigu.",
  options: "Arrêter ou refaire un test mieux cadré.",
  choice: "Refaire un test.",
  expectedOutcome: "Comprendre les facteurs qui font varier la demande.",
  confidence: 60,
  risk: "Un petit échantillon peut tromper.",
  reviewOn: "2026-12-15",
  createdAt: "2026-12-01T11:00:00.000Z",
  outcome: {
    observed: "La variabilité était liée aux jours d’ouverture.",
    comparison: "mixed",
    learning: "Fixer les facteurs comparables avant le test.",
    recordedAt: "2026-12-15T15:00:00.000Z",
  },
};

test("legacy backups without project histories stay unchanged", () => {
  const original = savedState();
  const restored = parse(original);
  assert.deepEqual(restored, original);
  assert.equal(restored.experiments, undefined);
  assert.equal(restored.decisions, undefined);
});

test("project plans, evidence and decision expectations survive an export roundtrip", () => {
  const value = {
    ...savedState(),
    experiments: [fieldTest],
    decisions: [projectDecision],
  };
  assert.deepEqual(parse(value), value);
  assert.equal(parse(value).decisions?.[0]?.confidence, 60);
});

test("malformed or orphan experiments cannot enter persisted state", () => {
  for (const experiments of [
    null,
    {},
    [false],
    [{ ...fieldTest, projectId: "absent" }],
    [{ ...fieldTest, reviewOn: "2026-02-30" }],
    [
      {
        ...fieldTest,
        result: { ...fieldTest.result, recordedAt: "2026-01-01T00:00:00.000Z" },
      },
    ],
    [fieldTest, fieldTest],
  ]) {
    assert.throws(() => parse({ ...savedState(), experiments }));
  }
});

test("decisions cannot link missing or foreign-project evidence", () => {
  const original = savedState();
  assert.throws(() => parse({ ...original, decisions: [projectDecision] }));
  const otherProject = { ...original.projects[0]!, id: "other-project" };
  assert.throws(() =>
    parse({
      ...original,
      projects: [...original.projects, otherProject],
      experiments: [fieldTest],
      decisions: [{ ...projectDecision, projectId: otherProject.id }],
    }),
  );
  for (const decisions of [
    null,
    {},
    [false],
    [{ ...projectDecision, projectId: "absent" }],
    [{ ...projectDecision, confidence: 101 }],
    [projectDecision, projectDecision],
  ]) {
    assert.throws(() =>
      parse({ ...original, experiments: [fieldTest], decisions }),
    );
  }
});

test("duplicate project identities are rejected before histories become ambiguous", () => {
  const original = savedState();
  assert.throws(() =>
    parse({
      ...original,
      projects: [...original.projects, ...original.projects],
    }),
  );
});

const reviewEvent: ReviewEvent = {
  id: "recall-1",
  cardId: "ca-marge-tresorerie::1.0.0::0",
  lessonId: "ca-marge-tresorerie",
  lessonVersion: "1.0.0",
  rating: "remembered",
  at: "2026-11-02T10:00:00.000Z",
  dueAt: "2026-11-05T10:00:00.000Z",
  intervalDays: 3,
  step: 1,
};

test("older v1 backups remain compatible without a review history", () => {
  const original = savedState();
  const restored = parse(original);
  assert.deepEqual(restored, original);
  assert.equal(restored.reviewEvents, undefined);
});

test("review history survives backup export and import with quiz evidence unchanged", () => {
  const value = { ...savedState(), reviewEvents: [reviewEvent] };
  const restored = parse(value);
  assert.deepEqual(restored.reviewEvents, [reviewEvent]);
  assert.deepEqual(restored.attempts, value.attempts);
});

test("invalid or duplicated review schedules cannot enter persisted state", () => {
  for (const reviewEvents of [
    null,
    {},
    [false],
    [{ ...reviewEvent, rating: "perfect" }],
    [{ ...reviewEvent, dueAt: reviewEvent.at }],
    [{ ...reviewEvent, cardId: "another-lesson::1.0.0::0" }],
    [reviewEvent, reviewEvent],
  ]) {
    assert.throws(() => parse({ ...savedState(), reviewEvents }));
  }
});

test("an empty state survives JSON export and reimport", () => {
  assert.deepEqual(parse(emptyState), emptyState);
});

test("profile, answers, attempts, projects and notes survive JSON roundtrip", () => {
  const value = savedState();
  assert.deepEqual(parse(value), value);
});

test("unknown harmless fields do not reject an otherwise compatible save", () => {
  const value = {
    ...savedState(),
    exportMetadata: { version: "0.1.0", note: "archive" },
  };
  const result = parse(value);
  assert.equal(result.profile?.name, "Camille");
  assert.equal(result.projects[0]?.title, "Prévisions de production");
});

test("malformed JSON and unsupported root values are rejected", () => {
  assert.throws(() => parseState("{invalid"));
  for (const value of [null, 42, "state", [], true])
    assert.throws(() => parse(value));
});

test("schema version and required state collections are validated", () => {
  const value = savedState();
  for (const bad of [
    { ...value, schemaVersion: 2 },
    { ...value, schemaVersion: "1" },
    { ...value, attempts: null },
    { ...value, attempts: {} },
    { ...value, projects: null },
    { ...value, projects: {} },
    { ...value, notes: null },
    { ...value, notes: [] },
  ])
    assert.throws(() => parse(bad));
});

test("malformed profiles and diagnostic answers are rejected", () => {
  const value = savedState();
  for (const profile of [
    false,
    [],
    {},
    { ...value.profile, name: 17 },
    { ...value.profile, minutes: "20" },
    { ...value.profile, interests: null },
    { ...value.profile, interests: [true] },
    { ...value.profile, diagnostic: null },
    { ...value.profile, diagnostic: [] },
    { ...value.profile, diagnostic: { question: -1 } },
    { ...value.profile, diagnostic: { question: 0.5 } },
  ])
    assert.throws(() => parse({ ...value, profile }));
});

test("profile time must be a positive quantity", () => {
  const value = savedState();
  for (const minutes of [-15, 0]) {
    assert.throws(() =>
      parse({ ...value, profile: { ...value.profile, minutes } }),
    );
  }
});

test("malformed attempts cannot be imported as progress", () => {
  const value = savedState();
  const attempt = value.attempts[0];
  for (const bad of [
    null,
    {},
    { ...attempt, answers: [] },
    { ...attempt, answers: { q1: "0" } },
    { ...attempt, percent: 101 },
    { ...attempt, percent: -1 },
    { ...attempt, correct: 3 },
    { ...attempt, total: -1 },
    { ...attempt, passed: "true" },
    { ...attempt, at: 0 },
    { ...attempt, lessonVersion: 7 },
    { ...attempt, lessonVersion: "" },
  ])
    assert.throws(() => parse({ ...value, attempts: [bad] }));
});

test("a passing attempt must contain at least one answered question", () => {
  const value = savedState();
  const attempt = {
    ...value.attempts[0],
    answers: {},
    correct: 0,
    total: 0,
    percent: 0,
    passed: true,
  };
  assert.throws(() => parse({ ...value, attempts: [attempt] }));
});

test("malformed project fields and lesson references are rejected", () => {
  const value = savedState();
  const project = value.projects[0];
  for (const bad of [
    null,
    {},
    { ...project, title: 7 },
    { ...project, hypothesis: null },
    { ...project, lessonIds: null },
    { ...project, lessonIds: [12] },
    { ...project, stage: 0 },
  ])
    assert.throws(() => parse({ ...value, projects: [bad] }));
});

test("unknown project stages are rejected before project controls use them", () => {
  const value = savedState();
  assert.throws(() =>
    parse({
      ...value,
      projects: [{ ...value.projects[0], stage: "Inconnue" }],
    }),
  );
});

test("notes and last lesson must contain text or the documented null state", () => {
  const value = savedState();
  assert.throws(() =>
    parse({ ...value, notes: { lesson: { richText: true } } }),
  );
  assert.throws(() => parse({ ...value, lastLessonId: 17 }));
  assert.equal(parse({ ...value, lastLessonId: null }).lastLessonId, null);
});

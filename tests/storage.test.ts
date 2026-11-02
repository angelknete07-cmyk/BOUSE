import test from "node:test";
import assert from "node:assert/strict";
import { emptyState, parseState } from "../src/lib/storage.ts";
import type { ReviewEvent } from "../src/lib/types.ts";

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

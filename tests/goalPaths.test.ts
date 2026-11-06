import assert from "node:assert/strict";
import test from "node:test";
import { goalPaths } from "../src/data/goalPaths.ts";
import { glossary } from "../src/data/investingGlossary.ts";
import { lessons } from "../src/data/lessons.ts";
import {
  lessonVerifiedAt,
  verificationStatus,
} from "../src/data/lessonVerification.ts";
import { practiceQuestions } from "../src/lib/practice.ts";
import { practicalSheets } from "../src/lib/practicalSheets.ts";
import { recommendLesson } from "../src/lib/recommendation.ts";
import { emptyState, parseState } from "../src/lib/storage.ts";
import type { AppState } from "../src/lib/types.ts";

const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]));

test("every guided path lists real lessons, each prerequisite before its lesson", () => {
  for (const path of goalPaths) {
    assert.equal(new Set(path.lessonIds).size, path.lessonIds.length, path.id);
    path.lessonIds.forEach((id, index) => {
      const lesson = byId.get(id);
      assert.ok(lesson, `${path.id}: ${id}`);
      for (const prerequisite of lesson.prerequisites)
        assert.ok(
          path.lessonIds.slice(0, index).includes(prerequisite),
          `${path.id}: ${prerequisite} must come before ${id}`,
        );
    });
  }
});

const profile = {
  name: "Profil démo",
  level: "Débutant++",
  goal: "Comprendre et piloter un business",
  interests: ["Finance"],
  minutes: 20,
  preference: "Exemples puis pratique",
  diagnostic: { finance: 1, business: 2, ai: 0, personal: 1, investing: 1 },
};
const passed = (lessonId: string) => ({
  lessonId,
  lessonVersion: "1.0.0",
  answers: {},
  correct: 2,
  total: 2,
  percent: 100,
  passed: true,
  at: "2026-11-06T08:00:00.000Z",
});

test("a chosen path drives the single next lesson, and says which step it is", () => {
  const now = new Date("2026-11-06T09:00:00Z");
  const state = {
    ...emptyState,
    profile,
    activePathId: "gerer-argent",
  } as AppState;
  const first = recommendLesson(state, now);
  assert.equal(first.current.id, "fp-budget");
  assert.match(first.reason, /Étape 1 sur 9 de votre parcours/);
  const after = recommendLesson(
    { ...state, attempts: [passed("fp-budget")] },
    now,
  );
  assert.equal(after.current.id, "fp-epargne-precaution");
  // Without a path, the interests decide again.
  const free = recommendLesson({ ...state, activePathId: null }, now);
  assert.notEqual(free.reason.startsWith("Étape"), true);
});

test("practice questions come from the lexicon and never repeat the answer", () => {
  const lesson = byId.get("inv-marches-financiers")!;
  const questions = practiceQuestions(
    lesson.id,
    lessons
      .filter((item) => item.domain === lesson.domain)
      .map((item) => item.id),
    glossary,
    42,
  );
  assert.equal(questions.length, 4);
  for (const question of questions) {
    const term = glossary.find((entry) => entry.id === question.id)!;
    assert.equal(question.options[question.answer], term.term);
    assert.equal(new Set(question.options).size, question.options.length);
    assert.ok(question.options.length >= 2);
  }
  // Same seed, same series; another seed reshuffles.
  assert.deepEqual(
    practiceQuestions(lesson.id, [], glossary, 7),
    practiceQuestions(lesson.id, [], glossary, 7),
  );
});

test("every lesson can offer some practice", () => {
  for (const lesson of lessons) {
    const related = lessons
      .filter((item) => item.domain === lesson.domain)
      .map((item) => item.id);
    assert.ok(
      practiceQuestions(lesson.id, related, glossary, 1).length >= 2,
      lesson.id,
    );
  }
});

test("dated lessons warn after a year", () => {
  assert.ok(Object.keys(lessonVerifiedAt).every((id) => byId.has(id)));
  const fresh = verificationStatus(
    "fp-impot-revenu",
    new Date("2027-03-01T00:00:00Z"),
  );
  assert.equal(fresh?.stale, false);
  assert.equal(fresh?.label, "novembre 2026");
  assert.equal(
    verificationStatus("fp-impot-revenu", new Date("2027-12-01T00:00:00Z"))
      ?.stale,
    true,
  );
  assert.equal(verificationStatus("comprendre-llm", new Date()), null);
});

test("practical sheets belong to real lessons and are not empty", () => {
  for (const [lessonId, sheet] of Object.entries(practicalSheets)) {
    assert.ok(byId.has(lessonId), lessonId);
    assert.ok(sheet.content.length > 200, lessonId);
    assert.match(sheet.filename, /^bouse-[a-z-]+\.(md|csv)$/);
  }
});

test("the chosen path is validated when a saved state is loaded", () => {
  const base = { ...emptyState, profile };
  assert.equal(
    parseState(JSON.stringify({ ...base, activePathId: "creer-entreprise" }))
      .activePathId,
    "creer-entreprise",
  );
  assert.throws(() =>
    parseState(JSON.stringify({ ...base, activePathId: 42 })),
  );
});

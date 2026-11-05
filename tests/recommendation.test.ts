import test from "node:test";
import assert from "node:assert/strict";
import { lessons } from "../src/data/lessons.ts";
import {
  afterQuizAction,
  canSkipToQuiz,
  recommendLesson,
  sessionPlan,
} from "../src/lib/recommendation.ts";
import { emptyState } from "../src/lib/storage.ts";
import type { AppState, Profile } from "../src/lib/types.ts";

const now = new Date("2026-11-05T12:00:00Z");
// Every answer right: the starting point signals no gap at all.
const profile: Profile = {
  name: "Test",
  level: "Débutant++",
  goal: "Comprendre et piloter un business",
  interests: ["Finance", "Intelligence artificielle"],
  minutes: 20,
  preference: "Exemples puis pratique",
  diagnostic: { finance: 1, business: 2, ai: 0 },
};
const withProfile = (patch: Partial<Profile>): AppState => ({
  ...emptyState,
  profile: { ...profile, ...patch },
});

test("the goal decides between equally interesting accessible notions", () => {
  const business = recommendLesson(withProfile({}), now);
  assert.equal(business.current.domain, "Finance");
  assert.match(business.reason, /Comprendre et piloter un business/);
  const ai = recommendLesson(
    withProfile({ goal: "Construire un projet avec l’IA" }),
    now,
  );
  assert.equal(ai.current.domain, "Intelligence artificielle");
});

test("a gap of the starting point in an interest comes before the goal", () => {
  const result = recommendLesson(
    withProfile({ diagnostic: { finance: 1, business: 2, ai: 3 } }),
    now,
  );
  assert.equal(result.current.domain, "Intelligence artificielle");
  assert.match(result.reason, /point de départ/);
});

test("only accessible notions are recommended, whatever the goal", () => {
  const result = recommendLesson(
    withProfile({
      goal: "Mieux décider dans ma vie professionnelle",
      interests: ["Investissement"],
    }),
    now,
  );
  assert.ok(
    result.current.prerequisites.length === 0,
    "a first recommendation never skips prerequisites",
  );
});

test("only experienced levels are offered to go straight to the quiz", () => {
  assert.equal(canSkipToQuiz("Fondations"), false);
  assert.equal(canSkipToQuiz("Débutant++"), false);
  assert.equal(canSkipToQuiz("Intermédiaire"), true);
  assert.equal(canSkipToQuiz("Avancé"), true);
});

test("the session plan fits the chosen time", () => {
  const lesson = { minutes: 14 };
  assert.match(
    sessionPlan(40, lesson, 0),
    /la leçon en entier et son exercice/,
  );
  assert.match(sessionPlan(20, lesson, 0), /la leçon en entier\./);
  assert.match(sessionPlan(10, lesson, 0), /environ 5 séquences sur 7/);
  assert.match(
    sessionPlan(10, lesson, 2),
    /2 rappels, puis environ 4 séquences/,
  );
});

test("the way of learning chooses what follows a passed quiz", () => {
  const first = lessons.find((item) => item.id === "ca-marge-tresorerie")!;
  const next = lessons.find((item) => item.id === "comprendre-llm")!;
  assert.deepEqual(afterQuizAction(first, "Appliquer à mon projet", next), {
    kind: "apply",
  });
  const practice = afterQuizAction(first, "Exemples puis pratique", next);
  assert.equal(practice.kind === "route" && practice.route, "lab");
  // Moving on follows the app's single next lesson, never a second suggestion.
  const concepts = afterQuizAction(
    first,
    "Concepts puis cas professionnel",
    next,
  );
  assert.equal(
    concepts.kind === "route" && concepts.route,
    "lesson/comprendre-llm",
  );
  assert.deepEqual(
    afterQuizAction(first, "Concepts puis cas professionnel", first),
    { kind: "apply" },
  );
});

test("the session plan starts where the lesson was left", () => {
  const lesson = { minutes: 14 };
  assert.match(
    sessionPlan(10, lesson, 0, 7, 3),
    /la fin de la leçon, séquences 4 à 7\./,
  );
  assert.match(sessionPlan(4, lesson, 0, 7, 3), /les séquences 4 à 5 sur 7/);
});

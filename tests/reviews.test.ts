import test from "node:test";
import assert from "node:assert/strict";
import {
  appendReviewEvent,
  buildReviewDeck,
  dueReviewCards,
  isReviewEvent,
  scheduleReview,
  type ReviewCard,
  type ReviewLesson,
} from "../src/lib/reviews.ts";
import type { AppState, Attempt, ReviewEvent } from "../src/lib/types.ts";

const lessons: ReviewLesson[] = [
  {
    id: "cash",
    title: "Lire le cash",
    domain: "Finance",
    version: "1.0.0",
    flashcards: [
      {
        front: "Résultat = cash ?",
        back: "Non, les règlements ont leur propre calendrier.",
      },
      {
        front: "Que finance une vente ?",
        back: "La contribution finance les charges fixes.",
      },
    ],
  },
  {
    id: "model",
    title: "Comprendre le modèle",
    domain: "IA",
    version: "1.0.0",
    flashcards: [
      {
        front: "Plausible veut dire vrai ?",
        back: "Non, vérifiez les faits importants.",
      },
    ],
  },
];
const now = new Date("2026-11-02T12:00:00.000Z");
const at = (value: string) => new Date(value);
function quiz(
  lessonId = "cash",
  passed = true,
  time = "2026-10-30T12:00:00.000Z",
): Attempt {
  return {
    lessonId,
    passed,
    at: time,
    answers: { a: passed ? 0 : 1 },
    correct: passed ? 1 : 0,
    total: 1,
    percent: passed ? 100 : 0,
  };
}
function state(
  attempts: Attempt[] = [],
  reviewEvents?: ReviewEvent[],
): AppState {
  return {
    schemaVersion: 1,
    profile: null,
    attempts,
    projects: [],
    notes: {},
    lastLessonId: null,
    ...(reviewEvents ? { reviewEvents } : {}),
  };
}
function firstCard(input = state([quiz()])): ReviewCard {
  return buildReviewDeck(lessons, input, now)[0]!;
}

test("untouched lessons create neither cards nor phantom overdue work", () => {
  assert.deepEqual(buildReviewDeck(lessons, state(), now), []);
  const deck = buildReviewDeck(lessons, state([quiz()]), now);
  assert.equal(deck.length, 2);
  assert.ok(deck.every((card) => card.lessonId === "cash"));
  assert.equal(deck[0]!.dueAt, "2026-10-31T12:00:00.000Z");
});

test("a failed quiz prioritizes every card of that lesson, without a made-up card diagnosis", () => {
  const deck = buildReviewDeck(
    lessons,
    state([quiz("model"), quiz("cash", false, "2026-11-02T11:00:00.000Z")]),
    now,
  );
  assert.equal(deck[0]!.reason, "quiz-error");
  assert.equal(deck[1]!.reason, "quiz-error");
  assert.equal(deck[0]!.dueAt, "2026-11-02T11:00:00.000Z");
  assert.equal(deck[2]!.reason, "spaced");
  assert.equal(dueReviewCards(deck, now).length, 3);
});

test("a later passing quiz cannot postpone cards that are already due", () => {
  const before = buildReviewDeck(lessons, state([quiz()]), now);
  const after = buildReviewDeck(
    lessons,
    state([quiz(), quiz("cash", true, now.toISOString())]),
    now,
  );
  assert.deepEqual(after, before);
  const failed = buildReviewDeck(
    lessons,
    state([quiz("cash", false), quiz("cash", true, now.toISOString())]),
    now,
  );
  assert.ok(failed.every((card) => card.reason === "quiz-error"));
  assert.equal(failed[0]!.dueAt, "2026-10-30T12:00:00.000Z");
});

test("a new failed quiz brings a previously planned review forward and resets its step", () => {
  const base = firstCard();
  const reviewed = scheduleReview(
    { ...base, step: 2 },
    "remembered",
    at("2026-11-01T12:00:00.000Z"),
    "review-1",
  );
  const input = state(
    [quiz(), quiz("cash", false, "2026-11-02T11:00:00.000Z")],
    [reviewed],
  );
  const card = buildReviewDeck(lessons, input, now).find(
    (item) => item.id === base.id,
  )!;
  assert.equal(card.reason, "quiz-error");
  assert.equal(card.step, 0);
  assert.equal(card.dueAt, "2026-11-02T11:00:00.000Z");
  assert.equal(card.lastReviewedAt, reviewed.at);
});

test("reviewing after a failure resolves only the reviewed card's priority", () => {
  const input = state([quiz("cash", false)]);
  const first = firstCard(input);
  const reviewed = scheduleReview(
    first,
    "remembered",
    at("2026-11-01T12:00:00.000Z"),
    "review-1",
  );
  const deck = buildReviewDeck(lessons, state(input.attempts, [reviewed]), now);
  assert.equal(deck[0]!.id, "cash::1.0.0::1");
  assert.equal(deck[0]!.reason, "quiz-error");
  assert.equal(deck[1]!.reason, "spaced");
  assert.equal(deck[1]!.dueAt, "2026-11-04T12:00:00.000Z");
});

test("duplicate or unordered attempts never duplicate cards and earliest study remains the anchor", () => {
  const input = state([quiz("cash", true, now.toISOString()), quiz(), quiz()]);
  const deck = buildReviewDeck(lessons, input, now);
  assert.equal(deck.length, 2);
  assert.equal(new Set(deck.map((card) => card.id)).size, 2);
  assert.equal(deck[0]!.dueAt, "2026-10-31T12:00:00.000Z");
});

test("a revised lesson enrolls only after a quiz on that version, preserving older history", () => {
  const reviewed = scheduleReview(
    { ...firstCard(), step: 3 },
    "remembered",
    at("2026-11-01T12:00:00.000Z"),
    "old-version",
  );
  const revised = [{ ...lessons[0]!, version: "2.0.0" }];
  const original = state([quiz("cash", false)], [reviewed]);
  assert.deepEqual(buildReviewDeck(revised, original, now), []);

  const currentQuiz = {
    ...quiz("cash", true, now.toISOString()),
    lessonVersion: "2.0.0",
  };
  const current = state([...original.attempts, currentQuiz], [reviewed]);
  const deck = buildReviewDeck(revised, current, now);
  assert.equal(deck.length, 2);
  assert.equal(deck[0]!.id, "cash::2.0.0::0");
  assert.equal(deck[0]!.step, 0);
  assert.equal(deck[0]!.reason, "spaced");
  assert.equal(deck[0]!.dueAt, "2026-11-03T12:00:00.000Z");
  assert.equal(deck[0]!.lastReviewedAt, undefined);
  assert.equal(dueReviewCards(deck, now).length, 0);
  assert.equal(current.reviewEvents?.[0], reviewed);
  assert.equal(current.attempts[0], original.attempts[0]);

  const failed = buildReviewDeck(
    revised,
    state(
      [
        ...original.attempts,
        { ...currentQuiz, passed: false, correct: 0, percent: 0 },
      ],
      [reviewed],
    ),
    now,
  );
  assert.ok(failed.every((card) => card.reason === "quiz-error"));
  assert.ok(failed.every((card) => card.dueAt === now.toISOString()));
});

test("legacy unversioned attempts apply only to the initial catalogue", () => {
  const legacy = quiz();
  assert.equal(legacy.lessonVersion, undefined);
  assert.equal(buildReviewDeck(lessons, state([legacy]), now).length, 2);
  assert.deepEqual(
    buildReviewDeck(
      [{ ...lessons[0]!, version: "1.0.1" }],
      state([legacy]),
      now,
    ),
    [],
  );
  const explicit = { ...legacy, lessonVersion: "1.0.1" };
  assert.deepEqual(buildReviewDeck(lessons, state([explicit]), now), []);
});

test("future and invalid attempt timestamps cannot enroll a lesson or force a revision", () => {
  assert.deepEqual(
    buildReviewDeck(
      lessons,
      state([
        quiz("cash", false, "invalid"),
        quiz("cash", false, "2026-11-03T12:00:00.000Z"),
        quiz("cash", false, "2026-02-31T12:00:00.000Z"),
      ]),
      now,
    ),
    [],
  );
  const deck = buildReviewDeck(
    lessons,
    state([quiz(), quiz("cash", false, "2026-11-03T12:00:00.000Z")]),
    now,
  );
  assert.equal(deck[0]!.reason, "spaced");
});

test("malformed, future and pre-enrollment review events cannot postpone a valid card", () => {
  const card = firstCard();
  const event = scheduleReview(
    card,
    "remembered",
    at("2026-11-01T12:00:00.000Z"),
    "valid",
  );
  const invalid = { ...event, dueAt: "2030-11-01T12:00:00.000Z" };
  const future = scheduleReview(
    card,
    "remembered",
    at("2026-11-03T12:00:00.000Z"),
    "future",
  );
  const early = scheduleReview(
    card,
    "remembered",
    at("2026-10-29T12:00:00.000Z"),
    "before-enrollment",
  );
  const deck = buildReviewDeck(
    lessons,
    state([quiz()], [invalid, future, early]),
    now,
  );
  assert.equal(deck[0]!.dueAt, "2026-10-31T12:00:00.000Z");
});

test("due filtering includes the exact boundary and does not mutate or reorder the source deck", () => {
  const deck = buildReviewDeck(
    lessons,
    state([quiz("cash", true, "2026-11-01T12:00:00.000Z")]),
    now,
  );
  assert.equal(dueReviewCards(deck, at("2026-11-02T11:59:59.999Z")).length, 0);
  assert.equal(dueReviewCards(deck, now).length, 2);
  assert.equal(deck.length, 2);
});

test("remembered reviews progress through 3, 7, 14 and 30 exact days, then remain capped", () => {
  let card = firstCard();
  for (const [index, days] of [3, 7, 14, 30, 30].entries()) {
    const event = scheduleReview(card, "remembered", now, `r-${index}`);
    assert.equal(event.intervalDays, days);
    assert.equal(event.step, Math.min(index + 1, 4));
    assert.equal(Date.parse(event.dueAt) - now.getTime(), days * 86_400_000);
    assert.ok(isReviewEvent(event));
    card = { ...card, step: event.step };
  }
});

test("again resets the step while hard keeps it, both using exactly 24 hours", () => {
  const card = { ...firstCard(), step: 3 };
  const again = scheduleReview(card, "again", now, "again");
  const hard = scheduleReview(card, "hard", now, "hard");
  assert.equal(again.step, 0);
  assert.equal(hard.step, 3);
  assert.equal(again.intervalDays, 1);
  assert.equal(hard.dueAt, "2026-11-03T12:00:00.000Z");
});

test("UTC intervals stay exactly 24 hours across both Paris clock changes", () => {
  const card = firstCard();
  for (const start of [
    "2026-03-28T12:00:00.000Z",
    "2026-10-24T12:00:00.000Z",
  ]) {
    const event = scheduleReview(card, "again", at(start), `dst-${start}`);
    assert.equal(Date.parse(event.dueAt) - Date.parse(start), 86_400_000);
  }
});

test("the most recent matching event wins independently of array order", () => {
  const card = firstCard();
  const earlier = scheduleReview(
    card,
    "remembered",
    at("2026-10-31T12:00:00.000Z"),
    "earlier",
  );
  const later = scheduleReview(
    { ...card, step: 1 },
    "remembered",
    at("2026-11-01T12:00:00.000Z"),
    "later",
  );
  const deck = buildReviewDeck(lessons, state([quiz()], [later, earlier]), now);
  assert.equal(deck.find((item) => item.id === card.id)!.dueAt, later.dueAt);
});

test("event validation rejects impossible schedules, identifiers, steps and ambiguous dates", () => {
  const event = scheduleReview(firstCard(), "remembered", now, "valid");
  for (const candidate of [
    null,
    [],
    {},
    { ...event, id: " " },
    { ...event, cardId: "different::1.0.0::0" },
    { ...event, cardId: "cash::1.0.0::-1" },
    { ...event, rating: "easy" },
    { ...event, step: 0 },
    { ...event, step: 5 },
    { ...event, step: 0.5 },
    { ...event, intervalDays: 7 },
    { ...event, at: "2026-11-02" },
    { ...event, at: "2026-11-02T12:00:00Z" },
    { ...event, dueAt: "2026-11-05T12:00:00.001Z" },
    {
      ...event,
      rating: "again",
      step: 1,
      intervalDays: 1,
      dueAt: "2026-11-03T12:00:00.000Z",
    },
  ])
    assert.equal(isReviewEvent(candidate), false);
});

test("scheduling rejects invalid dates, IDs, ratings and step values", () => {
  const card = firstCard();
  assert.throws(() => scheduleReview(card, "remembered", new Date("bad"), "a"));
  assert.throws(() => scheduleReview(card, "remembered", now, ""));
  assert.throws(() =>
    scheduleReview({ ...card, step: -1 }, "remembered", now, "a"),
  );
  assert.throws(() =>
    scheduleReview({ ...card, step: 5 }, "remembered", now, "a"),
  );
  assert.throws(() =>
    scheduleReview({ ...card, id: "wrong" }, "remembered", now, "a"),
  );
  assert.throws(() => scheduleReview(card, "unknown" as never, now, "a"));
  assert.throws(() => buildReviewDeck(lessons, state(), new Date("bad")));
  assert.throws(() => dueReviewCards([], new Date("bad")));
});

test("append is immutable and idempotent, leaving quiz attempts and mastery evidence untouched", () => {
  const before = state([quiz("cash", false)]);
  const event = scheduleReview(
    firstCard(before),
    "remembered",
    now,
    "review-1",
  );
  const after = appendReviewEvent(before, event);
  assert.equal(before.reviewEvents, undefined);
  assert.equal(after.attempts, before.attempts);
  assert.equal(after.reviewEvents?.length, 1);
  assert.notEqual(after.reviewEvents?.[0], event);
  assert.equal(appendReviewEvent(after, { ...event }), after);
  assert.throws(() => appendReviewEvent(after, { ...event, intervalDays: 99 }));
});

import type { AppState, ReviewEvent, ReviewRating } from "./types.ts";

export interface ReviewLesson {
  id: string;
  title: string;
  domain: string;
  version: string;
  flashcards: { front: string; back: string }[];
}

export interface ReviewCard {
  id: string;
  lessonId: string;
  lessonVersion: string;
  lessonTitle: string;
  domain: string;
  front: string;
  back: string;
  dueAt: string;
  step: number;
  reason: "quiz-error" | "spaced";
  lastReviewedAt?: string;
}

const dayMs = 24 * 60 * 60 * 1_000;
const rememberedDays = [3, 7, 14, 30] as const;

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Stored instants are canonical UTC ISO strings, never ambiguous local dates. */
function instant(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const time = Date.parse(value);
  return Number.isFinite(time) && new Date(time).toISOString() === value
    ? time
    : null;
}

function clock(date: Date): number {
  const time = date instanceof Date ? date.getTime() : Number.NaN;
  if (!Number.isFinite(time))
    throw new RangeError("Date de révision invalide.");
  return time;
}

function validStep(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 4;
}

function validCardIdentity(
  cardId: unknown,
  lessonId: unknown,
  lessonVersion: unknown,
): boolean {
  if (!isText(cardId) || !isText(lessonId) || !isText(lessonVersion))
    return false;
  const prefix = `${lessonId}::${lessonVersion}::`;
  return (
    cardId.startsWith(prefix) &&
    /^(0|[1-9]\d*)$/.test(cardId.slice(prefix.length))
  );
}

/** Shared with backup validation; history cannot smuggle in an arbitrary schedule. */
export function isReviewEvent(value: unknown): value is ReviewEvent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const event = value as ReviewEvent;
  if (
    !isText(event.id) ||
    !validCardIdentity(event.cardId, event.lessonId, event.lessonVersion) ||
    !validStep(event.step)
  )
    return false;
  const at = instant(event.at);
  const dueAt = instant(event.dueAt);
  if (at === null || dueAt === null) return false;
  let expectedDays: number;
  if (event.rating === "again") {
    if (event.step !== 0) return false;
    expectedDays = 1;
  } else if (event.rating === "hard") {
    expectedDays = 1;
  } else if (event.rating === "remembered") {
    if (event.step === 0) return false;
    expectedDays = rememberedDays[event.step - 1]!;
  } else return false;
  return (
    event.intervalDays === expectedDays && dueAt - at === expectedDays * dayMs
  );
}

/**
 * A quiz enrolls a lesson, not an inferred weakness on one particular flashcard.
 * Passing another quiz never postpones existing recall work; a later failure can
 * bring all the lesson's cards forward. Self-assessments never alter quiz scores.
 * Legacy attempts belong to the initial catalogue, not every future revision.
 */
export function buildReviewDeck(
  lessons: ReviewLesson[],
  state: Pick<AppState, "attempts" | "reviewEvents">,
  now: Date,
): ReviewCard[] {
  const nowMs = clock(now);
  const cards: ReviewCard[] = [];
  const lessonIds = new Set<string>();
  const events = (state.reviewEvents ?? []).filter(
    (event) => isReviewEvent(event) && instant(event.at)! <= nowMs,
  );

  for (const lesson of lessons) {
    if (
      !isText(lesson.id) ||
      !isText(lesson.version) ||
      lessonIds.has(lesson.id)
    ) {
      throw new Error(
        "Chaque leçon doit avoir un identifiant unique et une version.",
      );
    }
    lessonIds.add(lesson.id);
    const attempts = state.attempts.filter(
      (attempt) =>
        attempt.lessonId === lesson.id &&
        (attempt.lessonVersion ?? "1.0.0") === lesson.version &&
        typeof attempt.passed === "boolean" &&
        instant(attempt.at) !== null &&
        instant(attempt.at)! <= nowMs,
    );
    if (attempts.length === 0) continue;

    const firstQuiz = Math.min(
      ...attempts.map((attempt) => instant(attempt.at)!),
    );
    const failures = attempts.filter((attempt) => !attempt.passed);
    const lastFailure = failures.length
      ? Math.max(...failures.map((attempt) => instant(attempt.at)!))
      : null;

    lesson.flashcards.forEach((flashcard, index) => {
      const id = `${lesson.id}::${lesson.version}::${index}`;
      const latest = events.reduce<ReviewEvent | undefined>((found, event) => {
        if (
          event.cardId !== id ||
          event.lessonId !== lesson.id ||
          event.lessonVersion !== lesson.version ||
          instant(event.at)! < firstQuiz
        )
          return found;
        return !found || instant(event.at)! >= instant(found.at)!
          ? event
          : found;
      }, undefined);
      const outstandingFailure =
        lastFailure !== null && (!latest || lastFailure > instant(latest.at)!);
      const dueMs = outstandingFailure
        ? lastFailure!
        : latest
          ? instant(latest.dueAt)!
          : firstQuiz + dayMs;
      if (!Number.isFinite(dueMs) || dueMs > 8.64e15) {
        throw new RangeError("Échéance de révision hors limites.");
      }
      cards.push({
        id,
        lessonId: lesson.id,
        lessonVersion: lesson.version,
        lessonTitle: lesson.title,
        domain: lesson.domain,
        front: flashcard.front,
        back: flashcard.back,
        dueAt: new Date(dueMs).toISOString(),
        step: outstandingFailure ? 0 : (latest?.step ?? 0),
        reason: outstandingFailure ? "quiz-error" : "spaced",
        ...(latest ? { lastReviewedAt: latest.at } : {}),
      });
    });
  }
  return cards.sort(
    (a, b) =>
      Number(b.reason === "quiz-error") - Number(a.reason === "quiz-error") ||
      Date.parse(a.dueAt) - Date.parse(b.dueAt) ||
      a.id.localeCompare(b.id),
  );
}

export function dueReviewCards(deck: ReviewCard[], now: Date): ReviewCard[] {
  const nowMs = clock(now);
  return deck.filter((card) => {
    const dueAt = instant(card.dueAt);
    return dueAt !== null && dueAt <= nowMs;
  });
}

/** Fixed, inspectable intervals. This is not a claim of adaptive mastery. */
export function scheduleReview(
  card: ReviewCard,
  rating: ReviewRating,
  at: Date,
  id: string,
): ReviewEvent {
  const atMs = clock(at);
  if (
    !isText(id) ||
    !validCardIdentity(card.id, card.lessonId, card.lessonVersion) ||
    !validStep(card.step) ||
    instant(card.dueAt) === null
  )
    throw new Error("Carte ou identifiant de révision invalide.");

  let step: number;
  let intervalDays: number;
  if (rating === "again") {
    step = 0;
    intervalDays = 1;
  } else if (rating === "hard") {
    step = card.step;
    intervalDays = 1;
  } else if (rating === "remembered") {
    step = Math.min(card.step + 1, rememberedDays.length);
    intervalDays = rememberedDays[step - 1]!;
  } else throw new RangeError("Autoévaluation de révision inconnue.");

  const dueMs = atMs + intervalDays * dayMs;
  if (!Number.isFinite(dueMs) || dueMs > 8.64e15) {
    throw new RangeError("Échéance de révision hors limites.");
  }
  return {
    id,
    cardId: card.id,
    lessonId: card.lessonId,
    lessonVersion: card.lessonVersion,
    rating,
    at: at.toISOString(),
    dueAt: new Date(dueMs).toISOString(),
    intervalDays,
    step,
  };
}

export function appendReviewEvent(
  state: AppState,
  event: ReviewEvent,
): AppState {
  if (!isReviewEvent(event)) throw new Error("Événement de révision invalide.");
  if (state.reviewEvents?.some((existing) => existing.id === event.id))
    return state;
  return {
    ...state,
    reviewEvents: [...(state.reviewEvents ?? []), { ...event }],
  };
}

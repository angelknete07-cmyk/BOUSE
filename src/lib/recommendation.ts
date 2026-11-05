import { lessons } from "../data/lessons";
import { latestCurrentAttempt } from "./portfolio";
import type { AppState, Attempt } from "./types";

/**
 * The single "next lesson" of the app. Home, Académie and the skills map all
 * open on it, so the learner never sees three different suggestions.
 */
export function recommendLesson(state: AppState, now: Date) {
  const latest = new Map<string, Attempt>();
  for (const lesson of lessons) {
    const attempt = latestCurrentAttempt(lesson, state.attempts, now);
    if (attempt) latest.set(lesson.id, attempt);
  }
  const done = new Set(
    [...latest.values()]
      .filter((attempt) => attempt.passed)
      .map((attempt) => attempt.lessonId),
  );
  const candidates = lessons.filter(
    (lesson) =>
      !done.has(lesson.id) && lesson.prerequisites.every((id) => done.has(id)),
  );
  const diagnostic = state.profile?.diagnostic;
  const gaps = [
    diagnostic?.finance !== 1 ? "Finance" : "",
    diagnostic?.business !== 2 ? "Entrepreneuriat" : "",
    diagnostic?.ai !== 0 ? "Intelligence artificielle" : "",
  ];
  const gapAndInterest = candidates.find(
    (lesson) =>
      gaps.includes(lesson.domain) &&
      state.profile?.interests.includes(lesson.domain),
  );
  const interest = candidates.find((lesson) =>
    state.profile?.interests.includes(lesson.domain),
  );
  const next = gapAndInterest || interest || candidates[0] || lessons[0]!;
  const resumed =
    state.lastLessonId && !done.has(state.lastLessonId)
      ? lessons.find((lesson) => lesson.id === state.lastLessonId)
      : undefined;
  const current = resumed || next;
  // Say why this lesson comes first: a recommendation that explains itself earns trust.
  const reason = resumed
    ? latest.has(resumed.id)
      ? "Votre dernier quiz sur cette notion est à reprendre."
      : "Vous l’avez ouverte en dernier."
    : next === gapAndInterest
      ? `Votre point de départ signale un repère à poser en ${next.domain.toLowerCase()}, l’un de vos centres d’intérêt.`
      : next === interest
        ? `Dans vos centres d’intérêt${next.prerequisites.length ? ", et ses prérequis sont validés" : ", sans prérequis"}.`
        : done.size === lessons.length
          ? "Tout est validé : revoir garde les idées vivantes."
          : "La prochaine notion accessible du parcours.";
  return { latest, done, current, resumed: Boolean(resumed), reason };
}

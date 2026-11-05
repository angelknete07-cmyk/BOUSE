import { lessons, type Lesson } from "../data/lessons.ts";
import { lessonShortLabel } from "../data/lessonLabels.ts";
import { latestCurrentAttempt } from "./portfolio.ts";
import type { AppState, Attempt } from "./types";

/** Each goal names the domains that serve it first, in order. */
export const goalDomains: Record<string, Lesson["domain"][]> = {
  "Comprendre et piloter un business": [
    "Finance",
    "Entrepreneuriat",
    "Intelligence artificielle",
  ],
  "Construire un projet avec l’IA": [
    "Intelligence artificielle",
    "Entrepreneuriat",
    "Finance",
  ],
  "Mieux décider dans ma vie professionnelle": [
    "Finance",
    "Finance personnelle",
    "Investissement",
  ],
};

/** Levels that may check what they already know before reading. */
export const canSkipToQuiz = (level: string | undefined) =>
  level === "Intermédiaire" || level === "Avancé";

/**
 * The single "next lesson" of the app. Home, Académie and the skills map all
 * open on it, so the learner never sees three different suggestions.
 *
 * Order of the criteria, each one only separating what the previous left tied:
 * accessible (prerequisites validated) → gap of the starting point and
 * interest → interest → goal → gentlest level for a first-time learner.
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
  const profile = state.profile;
  const candidates = lessons.filter(
    (lesson) =>
      !done.has(lesson.id) && lesson.prerequisites.every((id) => done.has(id)),
  );
  const diagnostic = profile?.diagnostic;
  const gaps = [
    diagnostic?.finance !== 1 ? "Finance" : "",
    diagnostic?.business !== 2 ? "Entrepreneuriat" : "",
    diagnostic?.ai !== 0 ? "Intelligence artificielle" : "",
    // Profiles created before these questions count them as still to explore.
    diagnostic?.personal !== 1 ? "Finance personnelle" : "",
    diagnostic?.investing !== 1 ? "Investissement" : "",
  ];
  const interested = (lesson: Lesson) =>
    Boolean(profile?.interests.includes(lesson.domain));
  const goalOrder = goalDomains[profile?.goal ?? ""] ?? [];
  const goalRank = (lesson: Lesson) => {
    const index = goalOrder.indexOf(lesson.domain);
    return index === -1 ? goalOrder.length : index;
  };
  const beginner = profile?.level === "Fondations";
  const tier = (lesson: Lesson) =>
    gaps.includes(lesson.domain) && interested(lesson)
      ? 0
      : interested(lesson)
        ? 1
        : 2;
  const ranked = [...candidates].sort(
    (a, b) =>
      tier(a) - tier(b) ||
      goalRank(a) - goalRank(b) ||
      (beginner ? a.level - b.level : 0) ||
      lessons.indexOf(a) - lessons.indexOf(b),
  );
  const next = ranked[0] || lessons[0]!;
  const resumed =
    state.lastLessonId && !done.has(state.lastLessonId)
      ? lessons.find((lesson) => lesson.id === state.lastLessonId)
      : undefined;
  const current = resumed || next;
  const servesGoal = goalOrder.slice(0, 2).includes(current.domain);
  const goalNote = servesGoal
    ? ` Elle sert votre objectif\u00a0: «\u00a0${profile!.goal}\u00a0».`
    : "";
  // Say why this lesson comes first: a recommendation that explains itself earns trust.
  const reason = resumed
    ? latest.has(resumed.id)
      ? "Votre dernier quiz sur cette notion est à reprendre."
      : "Vous l’avez ouverte en dernier."
    : !candidates.length
      ? "Tout est validé : revoir garde les idées vivantes."
      : tier(next) === 0
        ? `Votre point de départ signale une notion à poser en ${next.domain.toLowerCase()}, l’un de vos centres d’intérêt.${goalNote}`
        : tier(next) === 1
          ? `Dans vos centres d’intérêt${next.prerequisites.length ? ", et ses prérequis sont validés" : ", sans prérequis"}.${goalNote}`
          : servesGoal
            ? `Elle sert votre objectif\u00a0: «\u00a0${profile!.goal}\u00a0».`
            : "La prochaine notion accessible du parcours.";
  return { latest, done, current, resumed: Boolean(resumed), reason };
}

/**
 * What fits in one session of the chosen length, starting where the lesson was
 * left. Sequences are equal slices of the lesson's announced duration;
 * reminders take about a minute each.
 */
export function sessionPlan(
  minutes: number,
  lesson: Pick<Lesson, "minutes">,
  dueReminders: number,
  sequences = 7,
  start = 0,
) {
  const reminderMinutes = Math.min(dueReminders, 5);
  const available = Math.max(0, minutes - reminderMinutes);
  const perSequence = lesson.minutes / sequences;
  const left = sequences - start;
  const fits = Math.min(left, Math.floor(available / perSequence));
  const reminders = reminderMinutes
    ? `${reminderMinutes} rappel${reminderMinutes > 1 ? "s" : ""}, puis `
    : "";
  const head = `Votre séance de ${minutes}\u00a0min\u00a0: ${reminders}`;
  if (fits >= left)
    return start
      ? `${head}la fin de la leçon, séquences ${start + 1} à ${sequences}.`
      : `${head}la leçon en entier${available - lesson.minutes >= 8 ? " et son exercice" : ""}.`;
  if (fits <= 0)
    return reminders
      ? `${head.replace(/, puis $/, "")}.`
      : `${head}une séquence, la ${start + 1}.`;
  return start
    ? `${head}les séquences ${start + 1} à ${start + fits} sur ${sequences}. La suite à la prochaine séance.`
    : `${head}environ ${fits} séquence${fits > 1 ? "s" : ""} sur ${sequences}. La suite à la prochaine séance.`;
}

/** Practice spaces that extend a domain, for learners who learn by doing. */
const practiceSpace: Partial<
  Record<Lesson["domain"], { route: string; label: string }>
> = {
  Finance: { route: "lab", label: "S’exercer au Lab financier" },
  "Intelligence artificielle": {
    route: "ai",
    label: "S’exercer à l’Atelier IA",
  },
  Entrepreneuriat: { route: "incubator", label: "Tester sur un projet" },
};

/**
 * The first action offered after a passed quiz, chosen by the way the learner
 * said they learn. Moving on always points to the app's single next lesson,
 * never to a second suggestion. Applying to a project always stays available.
 */
export function afterQuizAction(
  lesson: Lesson,
  preference: string | undefined,
  next: Lesson | undefined,
): { kind: "apply" } | { kind: "route"; route: string; label: string } {
  if (preference === "Appliquer à mon projet") return { kind: "apply" };
  if (preference === "Exemples puis pratique") {
    const space = practiceSpace[lesson.domain];
    if (space) return { kind: "route", ...space };
  }
  return next && next.id !== lesson.id
    ? {
        kind: "route",
        route: `lesson/${next.id}`,
        label: `Votre prochaine leçon : ${lessonShortLabel(next.id, next.title)}`,
      }
    : { kind: "apply" };
}

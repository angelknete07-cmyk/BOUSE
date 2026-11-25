/**
 * Idée 33 : contenu daté et vérifié, avec une alerte quand une règle change.
 * Calcul pur, testé dans tests/ruleWatch.test.ts.
 */
import { DATED_RULES, type DatedRule } from "../data/datedRules.ts";
import type { AppState } from "./types.ts";

const DAY = 86_400_000;
/** Une règle vérifiée il y a plus d'un an est à revérifier (loi de finances). */
export const STALE_DAYS = 365;

const time = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

export const rulesForLesson = (lessonId: string, rules = DATED_RULES) =>
  rules.filter((rule) => rule.lesson === lessonId);

/** « juillet 2026 » → la date de vérification, lisible. */
export function monthLabel(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(time(iso)));
}

export function isStale(rule: DatedRule, now: Date): boolean {
  return (now.getTime() - time(rule.checkedAt)) / DAY > STALE_DAYS;
}

/** La clé d'une alerte : une nouvelle modification de la même règle réalerte. */
export const alertKey = (rule: DatedRule) => `${rule.id}@${rule.changedAt ?? ""}`;

/**
 * Les règles qui ont changé après que la personne a réussi la leçon, et
 * qu'elle n'a pas encore marquées « vu ».
 */
export function ruleAlerts(
  state: Pick<AppState, "attempts" | "seenRules">,
  rules = DATED_RULES,
): DatedRule[] {
  const seen = new Set(state.seenRules ?? []);
  return rules.filter((rule) => {
    if (!rule.changedAt || seen.has(alertKey(rule))) return false;
    const changed = time(rule.changedAt);
    return state.attempts.some(
      (attempt) =>
        attempt.lessonId === rule.lesson &&
        attempt.passed &&
        Date.parse(attempt.at) < changed,
    );
  });
}

/** Les règles changées depuis moins d'un an (bandeau « Mis à jour » d'une leçon). */
export function recentChanges(lessonId: string, now: Date, rules = DATED_RULES) {
  return rulesForLesson(lessonId, rules).filter(
    (rule) =>
      rule.changedAt && (now.getTime() - time(rule.changedAt)) / DAY <= STALE_DAYS,
  );
}

/** Marque des alertes comme vues (gardé borné). */
export function markRulesSeen<S extends Pick<AppState, "seenRules">>(
  state: S,
  rules: DatedRule[],
): S {
  const next = [...new Set([...(state.seenRules ?? []), ...rules.map(alertKey)])];
  return { ...state, seenRules: next.slice(-200) };
}

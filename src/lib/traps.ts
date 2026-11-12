/**
 * Le carnet « Mes pièges » (idée 19) : chaque question ratée à un quiz de
 * leçon ou au contrôle d'une compétence, gardée avec la bonne réponse et le
 * pourquoi. Rien n'est inventé : tout vient des vraies tentatives. Un piège
 * est « déjoué » quand la dernière réponse à cette question est juste.
 * Calcul pur, testé dans tests/traps.test.ts.
 */
import { currentQuizAttempts } from "./portfolio.ts";
import type { Attempt } from "./types.ts";

export type TrapQuestion = {
  /** La clé de la réponse dans une tentative (id de question, ou « q0 »…). */
  key: string;
  question: string;
  options: string[];
  answer: number;
  why: string;
};
export type TrapQuiz = {
  id: string;
  version: string;
  kind: "lesson" | "skill";
  title: string;
  questions: TrapQuestion[];
};
export type Trap = {
  id: string;
  quizId: string;
  kind: "lesson" | "skill";
  title: string;
  question: string;
  options: string[];
  answer: number;
  why: string;
  /** Nombre de fois où la question a été ratée. */
  wrongCount: number;
  /** La dernière mauvaise réponse donnée. */
  lastWrong: number;
  /** Juste à la dernière tentative : le piège est déjoué. */
  solved: boolean;
  /** Date de la dernière tentative qui contenait cette question. */
  at: string;
};

export function buildTraps(
  quizzes: TrapQuiz[],
  attempts: Attempt[],
  now: Date,
): Trap[] {
  const traps: Trap[] = [];
  for (const quiz of quizzes) {
    const history = currentQuizAttempts(quiz, attempts, now);
    if (!history.length) continue;
    for (const q of quiz.questions) {
      let wrongCount = 0;
      let lastWrong = -1;
      let last: number | undefined;
      let at = "";
      for (const attempt of history) {
        const given = attempt.answers[q.key];
        if (given === undefined) continue;
        last = given;
        at = attempt.at;
        if (given !== q.answer) {
          wrongCount += 1;
          lastWrong = given;
        }
      }
      if (!wrongCount || last === undefined) continue;
      traps.push({
        id: `${quiz.id}:${q.key}`,
        quizId: quiz.id,
        kind: quiz.kind,
        title: quiz.title,
        question: q.question,
        options: q.options,
        answer: q.answer,
        why: q.why,
        wrongCount,
        lastWrong,
        solved: last === q.answer,
        at,
      });
    }
  }
  // Les plus ratés d'abord, puis les plus récents.
  return traps.sort(
    (a, b) =>
      b.wrongCount - a.wrongCount || Date.parse(b.at) - Date.parse(a.at),
  );
}

export const trapsToFoil = (traps: Trap[]) => traps.filter((t) => !t.solved);
export const foiledTraps = (traps: Trap[]) => traps.filter((t) => t.solved);

/** « aujourd'hui », « hier », « il y a 3 jours », puis la date. */
export function trapWhen(at: string, now: Date): string {
  const day = (d: Date) =>
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000;
  const days = Math.round(day(now) - day(new Date(at)));
  if (days <= 0) return "aujourd’hui";
  if (days === 1) return "hier";
  if (days < 7) return `il y a ${days} jours`;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
  }).format(new Date(at));
}

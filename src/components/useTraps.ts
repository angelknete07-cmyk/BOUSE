import { useEffect, useMemo, useState } from "react";
import { lessons } from "../data/lessons";
import { loadSkillContent } from "../data/skills";
import { catalogueSkill, SKILL_VERSION } from "../lib/catalogue";
import { buildTraps, type Trap, type TrapQuiz } from "../lib/traps";
import type { AppState } from "../lib/types";

/** Les quiz des leçons longues, toujours disponibles. */
const lessonQuizzes: TrapQuiz[] = lessons.map((lesson) => ({
  id: lesson.id,
  version: lesson.version,
  kind: "lesson",
  title: lesson.title,
  questions: lesson.quiz.map((q) => ({
    key: q.id,
    question: q.question,
    options: q.options,
    answer: q.answer,
    why: q.explanation,
  })),
}));

/**
 * Les pièges de l'utilisateur. Les contrôles des compétences courtes ne sont
 * chargés que pour celles qu'il a vraiment passées.
 */
export function useTraps(state: AppState): Trap[] {
  const skillIds = useMemo(
    () =>
      [
        ...new Set(
          state.attempts
            .filter((a) => a.lessonVersion === SKILL_VERSION)
            .map((a) => a.lessonId),
        ),
      ].sort(),
    [state.attempts],
  );
  const [skillQuizzes, setSkillQuizzes] = useState<TrapQuiz[]>([]);
  const idsKey = skillIds.join("|");

  useEffect(() => {
    let live = true;
    Promise.all(
      skillIds.map(async (id): Promise<TrapQuiz | undefined> => {
        const skill = catalogueSkill(id);
        if (!skill) return undefined;
        const content = await loadSkillContent(skill.domain, id).catch(
          () => undefined,
        );
        if (!content) return undefined;
        return {
          id,
          version: SKILL_VERSION,
          kind: "skill",
          title: skill.title,
          questions: content.check.map((q, i) => ({
            key: `q${i}`,
            question: q.q,
            options: q.options,
            answer: q.answer,
            why: q.why,
          })),
        };
      }),
    ).then((found) => {
      if (live) setSkillQuizzes(found.filter((q): q is TrapQuiz => !!q));
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return useMemo(
    () =>
      buildTraps(
        [...lessonQuizzes, ...skillQuizzes],
        state.attempts,
        new Date(),
      ),
    [skillQuizzes, state.attempts],
  );
}

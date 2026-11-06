import type { GlossaryTerm } from "../data/investingGlossary.ts";

/**
 * Free practice built from the curated lexicon: « which term matches this
 * definition? ». It never records an attempt, so it can never change a
 * validated quiz; questions are reshuffled at each series.
 */
export interface PracticeQuestion {
  id: string;
  definition: string;
  options: string[];
  answer: number;
  lessonId: string;
}

/** A small deterministic generator, so a seed gives the same series. */
function random(seed: number) {
  let value = seed % 2_147_483_647 || 1;
  return () => {
    value = (value * 16_807) % 2_147_483_647;
    return (value - 1) / 2_147_483_646;
  };
}

function shuffle<T>(items: T[], next: () => number) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const other = Math.floor(next() * (index + 1));
    [copy[index], copy[other]] = [copy[other]!, copy[index]!];
  }
  return copy;
}

export function practiceQuestions(
  lessonId: string,
  relatedLessonIds: string[],
  glossary: GlossaryTerm[],
  seed: number,
  count = 4,
): PracticeQuestion[] {
  const next = random(seed);
  const own = glossary.filter((term) => term.lessonId === lessonId);
  const near = glossary.filter(
    (term) =>
      term.lessonId !== lessonId && relatedLessonIds.includes(term.lessonId),
  );
  const pool = shuffle([...own, ...shuffle(near, next)], next)
    .sort(
      (a, b) =>
        Number(b.lessonId === lessonId) - Number(a.lessonId === lessonId),
    )
    .slice(0, count);
  return pool.map((term) => {
    // Distractors from the same category read as plausible answers.
    const sameCategory = glossary.filter(
      (other) => other.id !== term.id && other.category === term.category,
    );
    const others = shuffle(
      sameCategory.length >= 3
        ? sameCategory
        : glossary.filter((other) => other.id !== term.id),
      next,
    )
      .map((other) => other.term)
      .filter(
        (value, index, all) =>
          value !== term.term && all.indexOf(value) === index,
      )
      .slice(0, 3);
    const options = shuffle([term.term, ...others], next);
    return {
      id: term.id,
      definition: term.definition,
      options,
      answer: options.indexOf(term.term),
      lessonId: term.lessonId,
    };
  });
}

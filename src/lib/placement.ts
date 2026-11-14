/**
 * Le test de niveau d'un domaine (idée 16, maquette maquette/niveau.html) :
 * une question par compétence, de la plus simple à la plus avancée ; le test
 * s'arrête quand deux réponses d'un même niveau manquent. Une bonne réponse
 * ne valide rien : la compétence est seulement « déjà sue » et sautée dans
 * la suite. Calcul pur, testé dans tests/placement.test.ts.
 */
import {
  CATALOGUE_SKILLS,
  LEVEL_NAMES,
  type CatalogueLevel,
  type CatalogueSkill,
} from "../data/catalogue.ts";
import type { AppState, PlacementRecord } from "./types.ts";

export type PlacementQuestion = {
  skillId: string;
  level: CatalogueLevel;
  question: string;
  options: string[];
  answer: number;
};
/** Une réponse : l'option choisie, ou null pour « Je ne sais pas ». */
export type PlacementAnswer = number | null;

/** Les compétences d'un domaine dans l'ordre du test : niveau, puis catalogue. */
export function placementSkills(
  domainId: string,
  ready: (skill: CatalogueSkill) => boolean,
): CatalogueSkill[] {
  return CATALOGUE_SKILLS.filter((s) => s.domain === domainId && ready(s))
    .map((skill, index) => ({ skill, index }))
    .sort((a, b) => a.skill.level - b.skill.level || a.index - b.index)
    .map(({ skill }) => skill);
}

const isRight = (q: PlacementQuestion, a: PlacementAnswer) => a === q.answer;

/** Le test est fini : toutes les questions, ou deux ratés dans un niveau. */
export function placementOver(
  questions: PlacementQuestion[],
  answers: PlacementAnswer[],
): boolean {
  if (answers.length >= questions.length) return true;
  const missed = new Map<number, number>();
  answers.forEach((answer, i) => {
    const q = questions[i]!;
    if (!isRight(q, answer))
      missed.set(q.level, (missed.get(q.level) ?? 0) + 1);
  });
  return [...missed.values()].some((n) => n >= 2);
}

export type PlacementResult = {
  known: string[];
  missed: string[];
  untested: string[];
  /** Le niveau où commencer ; null si tout est su. */
  startLevel: CatalogueLevel | null;
  correct: number;
  asked: number;
};

export function placementResult(
  questions: PlacementQuestion[],
  answers: PlacementAnswer[],
): PlacementResult {
  const known: string[] = [];
  const missed: string[] = [];
  const untested: string[] = [];
  questions.forEach((q, i) => {
    if (i >= answers.length) untested.push(q.skillId);
    else if (isRight(q, answers[i]!)) known.push(q.skillId);
    else missed.push(q.skillId);
  });
  const first = questions.find((q) => !known.includes(q.skillId));
  return {
    known,
    missed,
    untested,
    startLevel: first ? first.level : null,
    correct: known.length,
    asked: Math.min(answers.length, questions.length),
  };
}

export const levelName = (level: CatalogueLevel | null) =>
  level === null ? "Tout le domaine" : LEVEL_NAMES[level];

/** Ce qu'on garde : la date, les compétences sues et ratées. */
export function placementRecord(
  result: PlacementResult,
  at: Date,
): PlacementRecord {
  return { at: at.toISOString(), known: result.known, missed: result.missed };
}

/** Toutes les compétences « déjà sues » d'après les tests de niveau. */
export function knownSkills(state: Pick<AppState, "placements">): Set<string> {
  return new Set(
    Object.values(state.placements ?? {}).flatMap((record) => record.known),
  );
}

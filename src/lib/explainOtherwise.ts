/**
 * Idée 17 : « Explique-moi autrement ». Trois façons de réexpliquer un passage
 * d'une leçon : une image du quotidien, un exemple pas à pas, ou plus simple.
 * Le mentor (compte connecté) répond dans la leçon ; sinon, la demande est
 * copiée pour la propre conversation Claude de la personne.
 * Calcul pur, testé dans tests/explainOtherwise.test.ts.
 */
import type { Lesson } from "../data/lessons.ts";
import {
  mentorLimits,
  type MentorContext,
} from "../../supabase/functions/_shared/mentorContract.ts";

export type ExplainMode = "image" | "exemple" | "simple";

export const EXPLAIN_MODES: {
  id: ExplainMode;
  label: string;
  hint: string;
}[] = [
  { id: "image", label: "Avec une image", hint: "une comparaison de la vie de tous les jours" },
  { id: "exemple", label: "Avec un exemple", hint: "un cas concret, pas à pas" },
  { id: "simple", label: "Plus simplement", hint: "des mots courts, sans jargon" },
];

const RULES =
  "Réponds en français, en tutoyant, avec des phrases courtes. Appuie-toi d’abord sur les extraits de la leçon. N’invente aucune règle, aucun taux ni aucun seuil : si tu as besoin de nombres, prends des nombres ronds et dis qu’ils sont fictifs. Pas de conseil d’investissement personnalisé.";

/** La demande envoyée au mentor pour un passage et une façon d'expliquer. */
export function explainQuestion(
  lesson: Lesson,
  sectionIndex: number,
  mode: ExplainMode,
): string {
  const section = lesson.sections[sectionIndex];
  const title = section
    ? sectionIndex === 0
      ? `le concept de la leçon « ${lesson.title} »`
      : `la partie « ${section.title} » de la leçon « ${lesson.title} »`
    : `la leçon « ${lesson.title} »`;
  const how: Record<ExplainMode, string> = {
    image: `Je n’ai pas bien compris ${title}. Réexplique-la-moi avec une seule image tirée de la vie de tous les jours (une comparaison), en 4 à 6 phrases. Termine par une phrase qui dit où la comparaison s’arrête.`,
    exemple: `Je n’ai pas bien compris ${title}. Réexplique-la-moi avec un exemple concret, pas à pas, en 3 à 5 étapes numérotées, puis une phrase qui tire la leçon de l’exemple.`,
    simple: `Je n’ai pas bien compris ${title}. Réexplique-la-moi beaucoup plus simplement, comme à quelqu’un qui découvre le sujet : 3 à 5 phrases courtes, sans jargon. Si un mot technique est indispensable, explique-le entre parenthèses.`,
  };
  return `${how[mode]}\n\n${RULES}`.slice(0, mentorLimits.questionChars);
}

/** Les extraits sur lesquels le mentor s'appuie : ce passage, puis l'exemple. */
export function explainContext(
  lesson: Lesson,
  sectionIndex: number,
): MentorContext[] {
  const section = lesson.sections[sectionIndex];
  const items: MentorContext[] = [];
  if (section)
    items.push({
      title: `${lesson.title} · ${section.title}`,
      excerpt: section.body.join("\n\n").slice(0, mentorLimits.contextChars),
    });
  items.push({
    title: `${lesson.title} · ${lesson.example.title}`,
    excerpt: lesson.example.body.slice(0, mentorLimits.contextChars),
  });
  return items;
}

/** Le texte à coller dans sa propre conversation Claude (sans compte). */
export function explainHandoff(
  lesson: Lesson,
  sectionIndex: number,
  mode: ExplainMode,
): string {
  const excerpts = explainContext(lesson, sectionIndex)
    .map((item) => `### ${item.title}\n${item.excerpt}`)
    .join("\n\n");
  return [
    "Tu es mon mentor pour un cours de l’académie BOOST (business, finance, IA).",
    "## Extraits de la leçon",
    excerpts,
    "## Ma demande",
    explainQuestion(lesson, sectionIndex, mode),
  ].join("\n\n");
}

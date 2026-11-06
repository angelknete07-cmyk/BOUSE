import type { Lesson } from "../data/lessons";
import {
  mentorLimits,
  type MentorContext,
} from "../../supabase/functions/_shared/mentorContract.ts";

/**
 * Lesson excerpts sent as citable documents: each section, then the worked
 * example, within the contract limits. Never includes personal notes.
 */
export function lessonContext(lesson: Lesson): MentorContext[] {
  const items: MentorContext[] = [
    ...lesson.sections.map((section) => ({
      title: `${lesson.title} · ${section.title}`,
      excerpt: section.body.join("\n\n"),
    })),
    {
      title: `${lesson.title} · ${lesson.example.title}`,
      excerpt: lesson.example.body,
    },
  ];
  const result: MentorContext[] = [];
  let total = 0;
  for (const item of items.slice(0, mentorLimits.contextDocuments)) {
    const excerpt = item.excerpt.slice(0, mentorLimits.contextChars).trim();
    if (!excerpt || total + excerpt.length > mentorLimits.contextTotalChars)
      continue;
    total += excerpt.length;
    result.push({ title: item.title, excerpt });
  }
  return result;
}

/**
 * Text for a manual hand-off to the person's own Claude conversation: the
 * course rules, the lesson excerpts and the question. Nothing is sent by the
 * application; the person pastes it themselves.
 */
export function claudeHandoffPrompt(lesson: Lesson, question: string): string {
  const excerpts = lessonContext(lesson)
    .map((item) => `### ${item.title}\n${item.excerpt}`)
    .join("\n\n");
  return [
    "Tu es mon mentor pour un cours de l’académie BOUSE (business, finance, IA).",
    "Explique en français, simplement, en partant de l’intuition puis du vocabulaire. Appuie-toi d’abord sur les extraits de la leçon ci-dessous et cite-les. N’invente aucun chiffre ni règle fiscale. Pour l’investissement : pédagogie uniquement, aucun conseil ni recommandation de titre.",
    `## Leçon : ${lesson.title}`,
    excerpts,
    "## Ma question",
    question.trim(),
  ].join("\n\n");
}

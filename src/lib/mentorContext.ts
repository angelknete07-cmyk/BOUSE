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

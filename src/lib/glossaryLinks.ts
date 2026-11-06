import { glossary, type GlossaryTerm } from "../data/investingGlossary.ts";

export type GlossarySegment = string | { text: string; entry: GlossaryTerm };

/** "ETF (tracker)" is written "ETF" in running text. */
export const glossaryLabel = (term: string) =>
  term.replace(/\s*\(.*\)\s*$/, "").trim();

const isAcronym = (label: string) => /^[A-Z0-9 ]{2,}$/.test(label);

/**
 * Terms worth recognising inside a lesson. A single common word ("action",
 * "cours", "défaut") is only recognised in the lessons that define it or build
 * on it, where it surely carries its financial meaning; multi-word terms and
 * acronyms are recognised everywhere.
 */
export function glossaryFor(lesson: { id: string; prerequisites: string[] }) {
  const near = new Set([lesson.id, ...lesson.prerequisites]);
  return glossary
    .map((entry) => ({ entry, label: glossaryLabel(entry.term) }))
    .filter(
      ({ entry, label }) =>
        near.has(entry.lessonId) || label.includes(" ") || isAcronym(label),
    )
    .sort((a, b) => b.label.length - a.label.length);
}

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Splits a paragraph into plain text and recognised terms, each term linked
 * once per paragraph and longest match first ("Rendement réel" before
 * "Rendement"). Acronyms keep their case; words ignore it.
 */
export function linkGlossary(
  text: string,
  terms: ReturnType<typeof glossaryFor>,
): GlossarySegment[] {
  if (!terms.length) return [text];
  const pattern = new RegExp(
    `(?<![\\p{L}\\p{N}])(${terms.map(({ label }) => escape(label)).join("|")})(?![\\p{L}\\p{N}])`,
    "giu",
  );
  const segments: GlossarySegment[] = [];
  const used = new Set<string>();
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const found = match[0];
    const term = terms.find(({ label }) =>
      isAcronym(label)
        ? label === found
        : label.toLocaleLowerCase("fr") === found.toLocaleLowerCase("fr"),
    );
    if (!term || used.has(term.entry.id)) continue;
    used.add(term.entry.id);
    if (match.index > last) segments.push(text.slice(last, match.index));
    segments.push({ text: found, entry: term.entry });
    last = match.index + found.length;
  }
  if (last < text.length) segments.push(text.slice(last));
  return segments;
}

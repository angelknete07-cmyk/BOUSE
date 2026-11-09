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
    `(?<![\\p{L}\\p{N}])(${terms
      .map(({ label }) => escape(label) + (isAcronym(label) ? "" : "[sx]?"))
      .join("|")})(?![\\p{L}\\p{N}])`,
    "giu",
  );
  const segments: GlossarySegment[] = [];
  const used = new Set<string>();
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const found = match[0];
    // A plural (« actions », « fonds d’investissement ») finds its term too.
    const term = terms.find(({ label }) => {
      if (isAcronym(label)) return label === found;
      const word = found.toLocaleLowerCase("fr");
      const base = label.toLocaleLowerCase("fr");
      return word === base || word === `${base}s` || word === `${base}x`;
    });
    if (!term || used.has(term.entry.id)) continue;
    used.add(term.entry.id);
    if (match.index > last) segments.push(text.slice(last, match.index));
    segments.push({ text: found, entry: term.entry });
    last = match.index + found.length;
  }
  if (last < text.length) segments.push(text.slice(last));
  return segments;
}

/**
 * Terms worth recognising inside a definition shown in a bubble: those of the
 * lesson being read, plus the single words of the lesson that explains the
 * defined term, so a nested word ("dividende" in « Action ») opens its own
 * bubble. The defined term itself is never linked to itself.
 */
export function glossaryForDefinition(
  entry: GlossaryTerm,
  lesson: { id: string; prerequisites: string[] },
  prerequisitesOf: (lessonId: string) => string[] = () => [],
) {
  const near = new Set([
    lesson.id,
    ...lesson.prerequisites,
    entry.lessonId,
    ...prerequisitesOf(entry.lessonId),
  ]);
  return glossaryFor({ id: lesson.id, prerequisites: [...near] }).filter(
    ({ entry: other }) => other.id !== entry.id,
  );
}

/** One open bubble: the trigger that opened it and the term it defines. */
export type BubbleItem = { key: string; entryId: string; pinned: boolean };

/**
 * Bubbles form a stack: a term in the lesson opens level 0, a term inside the
 * bubble at level n opens level n + 1, replacing anything deeper. Opening by
 * click or keyboard pins the bubble and the ones under it; a bubble opened by
 * hover alone closes when the pointer leaves it.
 */
export function openBubble(
  stack: BubbleItem[],
  depth: number,
  item: BubbleItem,
): BubbleItem[] {
  const base = stack.slice(0, depth);
  return [
    ...(item.pinned ? base.map((open) => ({ ...open, pinned: true })) : base),
    item,
  ];
}

/** Closes the bubble at `depth` and everything opened from it. */
export const closeBubbles = (stack: BubbleItem[], depth: number) =>
  stack.slice(0, Math.max(0, depth));

/**
 * The pointer rests at `pointerDepth` (-1 outside every bubble and term):
 * bubbles opened by hover above it close, a pinned one stops the pruning.
 */
export function pruneHovered(stack: BubbleItem[], pointerDepth: number) {
  const first = stack.findIndex(
    (item, index) => index > pointerDepth && !item.pinned,
  );
  return first === -1 ? stack : stack.slice(0, first);
}

type Box = { top: number; left: number; width: number; height: number };

/**
 * Where a bubble goes: under its term when it fits, above otherwise, always
 * inside the screen minus a margin and above the mobile dock (`bottom`). Its
 * height is capped by the larger side so a long definition scrolls inside.
 */
export function placeBubble({
  anchor,
  bubble,
  viewport,
  bottom = viewport.height,
  margin = 12,
  gap = 8,
}: {
  anchor: Box;
  bubble: { width: number; height: number };
  viewport: { width: number; height: number };
  bottom?: number;
  margin?: number;
  gap?: number;
}) {
  const width = Math.min(bubble.width, viewport.width - 2 * margin);
  const center = anchor.left + anchor.width / 2;
  const left = Math.round(
    Math.min(
      Math.max(center - width / 2, margin),
      viewport.width - margin - width,
    ),
  );
  const below = bottom - margin - (anchor.top + anchor.height + gap);
  const above = anchor.top - gap - margin;
  const side: "below" | "above" =
    bubble.height <= below || below >= above ? "below" : "above";
  const maxHeight = Math.max(120, Math.floor(side === "below" ? below : above));
  const height = Math.min(bubble.height, maxHeight);
  const top = Math.round(
    Math.max(
      margin,
      side === "below"
        ? anchor.top + anchor.height + gap
        : anchor.top - gap - height,
    ),
  );
  const arrow = Math.round(Math.min(Math.max(center - left, 18), width - 18));
  return { top, left, width, maxHeight, side, arrow };
}

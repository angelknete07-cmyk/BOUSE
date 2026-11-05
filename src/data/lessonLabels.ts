/**
 * One short name per notion, shared by every graph (home trajectory, Académie
 * atlas, skills map) so the same idea never carries different names.
 */
export const lessonShortLabels: Record<string, string> = {
  "ca-marge-tresorerie": "Marge et trésorerie",
  "seuil-rentabilite": "Seuil de rentabilité",
  "validation-client": "Valider un problème",
  "comprendre-llm": "Comprendre un LLM",
  "prompt-structure": "Structurer un prompt",
  "automatisation-agent": "Automatisation ou agent",
};

export function lessonShortLabel(id: string, fallback: string): string {
  return lessonShortLabels[id] ?? fallback;
}

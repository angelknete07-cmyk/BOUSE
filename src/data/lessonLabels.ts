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
  "fp-budget": "Budget",
  "fp-epargne-precaution": "Épargne de précaution",
  "fp-credit-taux": "Crédit et TAEG",
  "fp-inflation-quotidien": "Inflation et pouvoir d’achat",
  "inv-marches-financiers": "Actions et obligations",
  "inv-interets-composes": "Intérêts composés",
  "inv-risque-diversification": "Risque et diversification",
  "inv-fonds-enveloppes": "Fonds et enveloppes",
  "inv-ordres-biais": "Ordres et biais",
};

export function lessonShortLabel(id: string, fallback: string): string {
  return lessonShortLabels[id] ?? fallback;
}

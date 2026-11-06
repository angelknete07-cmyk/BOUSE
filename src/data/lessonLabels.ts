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
  "ent-modele-economique": "Modèle économique",
  "ent-trouver-clients": "Premiers clients",
  "ent-fixer-prix": "Fixer son prix",
  "ent-statut-juridique": "Choisir son statut",
  "ent-creer-etapes": "Créer, étape par étape",
  "ent-micro-entreprise": "Micro-entreprise",
  "ent-facturer-declarer": "Facturer et déclarer",
  "ent-financer-projet": "Financer son projet",
  "fin-etats-financiers": "Résultat et bilan",
  "fin-bfr-tresorerie": "BFR et trésorerie",
  "fin-previsionnel": "Prévisionnel",
  "fin-investir-amortir": "Investir et amortir",
  "fin-piloter-indicateurs": "Indicateurs de pilotage",
  "fp-banque-arnaques": "Banque et arnaques",
  "fp-impot-revenu": "Impôt sur le revenu",
  "fp-assurances": "Assurances",
  "fp-logement": "Louer ou acheter",
  "fp-retraite": "Préparer sa retraite",
  "inv-obligations-taux": "Obligations et taux",
  "inv-arnaques-placement": "Repérer une arnaque",
  "inv-immobilier-scpi": "Immobilier et SCPI",
  "inv-crypto-actifs": "Crypto-actifs",
  "inv-allocation-profil": "Construire son allocation",
  "inv-fiscalite-placements": "Fiscalité des placements",
  "ia-donnees-confidentialite": "Données et confidentialité",
  "ia-cas-usage": "Choisir un cas d’usage",
  "ia-evaluer-fiabilite": "Évaluer une IA",
  "ia-cadre-legal": "Cadre légal de l’IA",
};

export function lessonShortLabel(id: string, fallback: string): string {
  return lessonShortLabels[id] ?? fallback;
}

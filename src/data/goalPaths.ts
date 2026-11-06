/**
 * Guided paths by goal: an ordered route across domains. Each lesson's
 * prerequisites appear earlier in its path (checked by tests), so following
 * a path never sends the learner to a locked notion.
 */
export interface GoalPath {
  id: string;
  title: string;
  promise: string;
  icon: string;
  lessonIds: string[];
}

export const goalPaths: GoalPath[] = [
  {
    id: "creer-entreprise",
    title: "Créer mon entreprise",
    promise: "De l’idée validée à la première facture, dans l’ordre.",
    icon: "building",
    lessonIds: [
      "validation-client",
      "ent-modele-economique",
      "ent-trouver-clients",
      "ca-marge-tresorerie",
      "seuil-rentabilite",
      "ent-fixer-prix",
      "ent-statut-juridique",
      "ent-creer-etapes",
      "ent-micro-entreprise",
      "ent-facturer-declarer",
      "ent-financer-projet",
    ],
  },
  {
    id: "gerer-argent",
    title: "Gérer mon argent",
    promise: "Budget, réserve, crédit, impôt : reprendre la main.",
    icon: "wallet",
    lessonIds: [
      "fp-budget",
      "fp-epargne-precaution",
      "fp-banque-arnaques",
      "fp-credit-taux",
      "fp-inflation-quotidien",
      "fp-impot-revenu",
      "fp-assurances",
      "fp-logement",
      "fp-retraite",
    ],
  },
  {
    id: "commencer-investir",
    title: "Commencer à investir",
    promise: "Comprendre avant de placer le premier euro.",
    icon: "trend",
    lessonIds: [
      "inv-marches-financiers",
      "inv-arnaques-placement",
      "inv-interets-composes",
      "inv-risque-diversification",
      "inv-fonds-enveloppes",
      "inv-allocation-profil",
      "inv-fiscalite-placements",
      "inv-ordres-biais",
      "inv-obligations-taux",
    ],
  },
  {
    id: "piloter-entreprise",
    title: "Piloter une entreprise",
    promise: "Lire les comptes, anticiper le cash, décider avec des chiffres.",
    icon: "chart",
    lessonIds: [
      "ca-marge-tresorerie",
      "seuil-rentabilite",
      "fin-etats-financiers",
      "fin-bfr-tresorerie",
      "fin-previsionnel",
      "fin-investir-amortir",
      "fin-piloter-indicateurs",
    ],
  },
  {
    id: "travailler-ia",
    title: "Travailler avec l’IA",
    promise: "Confier un vrai travail à l’IA, sans risque pour vos données.",
    icon: "ai",
    lessonIds: [
      "comprendre-llm",
      "prompt-structure",
      "ia-donnees-confidentialite",
      "ia-cas-usage",
      "ia-evaluer-fiabilite",
      "automatisation-agent",
      "ia-cadre-legal",
    ],
  },
];

export const goalPathById = (id: string | null | undefined) =>
  goalPaths.find((path) => path.id === id);

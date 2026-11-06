import type { Domain } from "../data/domains.ts";

/**
 * How each domain presents itself in cards: an icon and one sentence that
 * says what the learner will be able to do. Labels stay the domain names.
 */
export const domainIdentity: Record<
  Domain,
  { icon: string; short: string; promise: string }
> = {
  Finance: {
    icon: "chart",
    short: "Finance",
    promise: "Lire les chiffres d’une entreprise et anticiper le cash.",
  },
  Entrepreneuriat: {
    icon: "building",
    short: "Entreprendre",
    promise: "Valider une idée, choisir un statut, lancer et facturer.",
  },
  "Intelligence artificielle": {
    icon: "ai",
    short: "IA",
    promise: "Confier un vrai travail à l’IA, et vérifier ce qu’elle rend.",
  },
  "Finance personnelle": {
    icon: "wallet",
    short: "Finance perso",
    promise: "Budget, épargne, crédit, impôt : garder la main sur son argent.",
  },
  Investissement: {
    icon: "trend",
    short: "Investir",
    promise: "Comprendre le risque, les frais et le temps avant de placer.",
  },
};

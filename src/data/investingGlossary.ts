/**
 * Lexique de la bourse et de l'investissement. Définitions pédagogiques
 * générales ; les règles fiscales et plafonds ne sont volontairement pas
 * chiffrés (à vérifier à la date d'une décision).
 */
export const glossaryCategories = [
  "Marchés",
  "Produits",
  "Risque",
  "Coûts et rendement",
  "Ordres",
  "Enveloppes",
  "Comportement",
] as const;
export type GlossaryCategory = (typeof glossaryCategories)[number];

export type GlossaryTerm = {
  id: string;
  term: string;
  category: GlossaryCategory;
  definition: string;
  /** Lesson that explains the term in context. */
  lessonId: string;
};

const markets = "inv-marches-financiers";
const interest = "inv-interets-composes";
const risk = "inv-risque-diversification";
const funds = "inv-fonds-enveloppes";
const orders = "inv-ordres-biais";

export const glossary: GlossaryTerm[] = [
  {
    id: "action",
    term: "Action",
    category: "Produits",
    lessonId: markets,
    definition:
      "Part du capital d’une société. Donne en général un droit de vote et un droit au dividende s’il est décidé. N’est jamais remboursée ; sa valeur peut tomber à zéro.",
  },
  {
    id: "obligation",
    term: "Obligation",
    category: "Produits",
    lessonId: markets,
    definition:
      "Titre de dette : un prêt à un État ou une entreprise, rémunéré par des coupons et remboursé à l’échéance si l’émetteur en a la capacité.",
  },
  {
    id: "coupon",
    term: "Coupon",
    category: "Produits",
    lessonId: markets,
    definition: "Intérêt versé périodiquement au détenteur d’une obligation.",
  },
  {
    id: "dividende",
    term: "Dividende",
    category: "Produits",
    lessonId: markets,
    definition:
      "Part du bénéfice distribuée aux actionnaires sur décision de la société. Il n’est jamais garanti.",
  },
  {
    id: "rendement-dividende",
    term: "Rendement du dividende",
    category: "Coûts et rendement",
    lessonId: markets,
    definition:
      "Dividende annuel par action divisé par le cours. Un rendement élevé peut aussi signaler un cours qui a fortement baissé.",
  },
  {
    id: "cours",
    term: "Cours",
    category: "Marchés",
    lessonId: markets,
    definition:
      "Prix auquel s’est fait le dernier échange d’un titre. Ce n’est pas une valeur garantie.",
  },
  {
    id: "capitalisation",
    term: "Capitalisation boursière",
    category: "Marchés",
    lessonId: markets,
    definition:
      "Cours × nombre d’actions : la valeur que le marché attribue aux fonds propres d’une société à un instant donné.",
  },
  {
    id: "marche-primaire",
    term: "Marché primaire",
    category: "Marchés",
    lessonId: markets,
    definition:
      "Marché des émissions de titres (introduction en bourse, nouvel emprunt). L’argent va à l’émetteur.",
  },
  {
    id: "marche-secondaire",
    term: "Marché secondaire",
    category: "Marchés",
    lessonId: markets,
    definition:
      "Marché des échanges entre investisseurs. Lors d’un achat, l’argent va au vendeur, pas à l’entreprise.",
  },
  {
    id: "introduction-bourse",
    term: "Introduction en bourse",
    category: "Marchés",
    lessonId: markets,
    definition:
      "Première mise en vente des actions d’une société sur un marché réglementé ou organisé.",
  },
  {
    id: "indice",
    term: "Indice boursier",
    category: "Marchés",
    lessonId: markets,
    definition:
      "Panier de valeurs qui résume l’évolution d’un marché, comme le CAC 40. Il se calcule et ne s’achète pas directement.",
  },
  {
    id: "cac40",
    term: "CAC 40",
    category: "Marchés",
    lessonId: markets,
    definition:
      "Indice de quarante grandes sociétés cotées à Paris, pondérées par leur capitalisation.",
  },
  {
    id: "liquidite",
    term: "Liquidité",
    category: "Marchés",
    lessonId: orders,
    definition:
      "Facilité à acheter ou vendre un titre rapidement sans faire bouger son prix.",
  },
  {
    id: "per",
    term: "PER (price earning ratio)",
    category: "Marchés",
    lessonId: markets,
    definition:
      "Cours divisé par le bénéfice par action. Indique combien d’années de bénéfices actuels le marché paie ; à comparer avec prudence entre secteurs.",
  },
  {
    id: "interets-composes",
    term: "Intérêts composés",
    category: "Coûts et rendement",
    lessonId: interest,
    definition:
      "Mécanisme par lequel les gains réinvestis produisent eux-mêmes des gains : capital × (1 + taux)^années, à taux constant.",
  },
  {
    id: "regle-72",
    term: "Règle de 72",
    category: "Coûts et rendement",
    lessonId: interest,
    definition:
      "Approximation : à r % par an, un capital double en environ 72 ÷ r années.",
  },
  {
    id: "inflation",
    term: "Inflation",
    category: "Coûts et rendement",
    lessonId: interest,
    definition:
      "Hausse générale des prix qui réduit le pouvoir d’achat d’une somme d’argent.",
  },
  {
    id: "rendement-nominal",
    term: "Rendement nominal",
    category: "Coûts et rendement",
    lessonId: interest,
    definition: "Rendement affiché, avant prise en compte de l’inflation.",
  },
  {
    id: "rendement-reel",
    term: "Rendement réel",
    category: "Coûts et rendement",
    lessonId: interest,
    definition:
      "Rendement corrigé de l’inflation : environ nominal − inflation ; exactement (1 + nominal) ÷ (1 + inflation) − 1.",
  },
  {
    id: "frais-courants",
    term: "Frais courants",
    category: "Coûts et rendement",
    lessonId: funds,
    definition:
      "Frais annuels d’un fonds, exprimés en pourcentage de l’encours et prélevés dans sa valeur.",
  },
  {
    id: "frais-courtage",
    term: "Frais de courtage",
    category: "Coûts et rendement",
    lessonId: orders,
    definition:
      "Frais facturés par l’intermédiaire à chaque ordre de bourse exécuté.",
  },
  {
    id: "volatilite",
    term: "Volatilité",
    category: "Risque",
    lessonId: risk,
    definition:
      "Amplitude des variations du prix d’un actif. Une forte volatilité signifie des hausses et des baisses importantes.",
  },
  {
    id: "perte-maximale",
    term: "Perte maximale (drawdown)",
    category: "Risque",
    lessonId: risk,
    definition:
      "Baisse entre un plus haut et le plus bas suivant. Après −50 %, il faut +100 % pour revenir au départ.",
  },
  {
    id: "diversification",
    term: "Diversification",
    category: "Risque",
    lessonId: risk,
    definition:
      "Répartition entre émetteurs, secteurs, pays et types d’actifs. Réduit le risque propre à un émetteur, pas le risque de marché.",
  },
  {
    id: "correlation",
    term: "Corrélation",
    category: "Risque",
    lessonId: risk,
    definition:
      "Tendance de deux actifs à évoluer ensemble. Des actifs peu corrélés diversifient mieux.",
  },
  {
    id: "horizon",
    term: "Horizon de placement",
    category: "Risque",
    lessonId: risk,
    definition:
      "Durée pendant laquelle l’argent peut rester investi sans en avoir besoin.",
  },
  {
    id: "risque-marche",
    term: "Risque de marché",
    category: "Risque",
    lessonId: risk,
    definition:
      "Risque d’une baisse générale qui touche la plupart des actifs en même temps. La diversification ne le supprime pas.",
  },
  {
    id: "defaut",
    term: "Défaut",
    category: "Risque",
    lessonId: markets,
    definition:
      "Situation où un emprunteur ne peut pas payer les intérêts ou rembourser sa dette.",
  },
  {
    id: "sri",
    term: "Indicateur de risque (1 à 7)",
    category: "Risque",
    lessonId: funds,
    definition:
      "Échelle du document d’informations clés, de 1 (risque plus faible) à 7 (risque plus élevé).",
  },
  {
    id: "epargne-precaution",
    term: "Épargne de précaution",
    category: "Risque",
    lessonId: risk,
    definition:
      "Somme disponible rapidement pour faire face aux imprévus. Elle ne devrait pas dépendre des marchés d’actions.",
  },
  {
    id: "effet-levier",
    term: "Effet de levier",
    category: "Risque",
    lessonId: orders,
    definition:
      "Exposition supérieure à la mise, qui amplifie gains et pertes. Les pertes peuvent dépasser la somme engagée sur certains produits.",
  },
  {
    id: "fonds",
    term: "Fonds d’investissement",
    category: "Produits",
    lessonId: funds,
    definition:
      "Placement collectif qui mutualise l’argent d’épargnants selon une politique définie (OPC, OPCVM, SICAV, FCP).",
  },
  {
    id: "gestion-active",
    term: "Gestion active",
    category: "Produits",
    lessonId: funds,
    definition:
      "Gestion qui sélectionne des titres pour chercher à faire mieux qu’un marché, en général avec des frais plus élevés.",
  },
  {
    id: "gestion-indicielle",
    term: "Gestion indicielle (passive)",
    category: "Produits",
    lessonId: funds,
    definition:
      "Gestion qui cherche à reproduire un indice plutôt qu’à le battre.",
  },
  {
    id: "etf",
    term: "ETF (tracker)",
    category: "Produits",
    lessonId: funds,
    definition:
      "Fonds indiciel coté en bourse, qui s’échange comme une action et suit un indice, y compris dans ses baisses.",
  },
  {
    id: "dic",
    term: "Document d’informations clés (DIC)",
    category: "Produits",
    lessonId: funds,
    definition:
      "Document standardisé présentant l’objectif d’un produit, son indicateur de risque, des scénarios de performance et ses coûts.",
  },
  {
    id: "fonds-euros",
    term: "Fonds en euros",
    category: "Enveloppes",
    lessonId: funds,
    definition:
      "Support d’assurance-vie dont le capital est en principe garanti par l’assureur, hors frais, avec un rendement variable.",
  },
  {
    id: "unite-compte",
    term: "Unité de compte",
    category: "Enveloppes",
    lessonId: funds,
    definition:
      "Support d’assurance-vie investi en actifs financiers (fonds, ETF…). Sa valeur peut baisser : le capital n’est pas garanti.",
  },
  {
    id: "compte-titres",
    term: "Compte-titres ordinaire",
    category: "Enveloppes",
    lessonId: funds,
    definition:
      "Compte qui peut accueillir des titres très variés, sans avantage fiscal spécifique.",
  },
  {
    id: "pea",
    term: "PEA (plan d’épargne en actions)",
    category: "Enveloppes",
    lessonId: funds,
    definition:
      "Enveloppe dédiée aux actions européennes et à certains fonds éligibles, avec plafond de versements et avantage fiscal lié à la durée. Règles à vérifier à la date de la décision.",
  },
  {
    id: "assurance-vie",
    term: "Assurance-vie",
    category: "Enveloppes",
    lessonId: funds,
    definition:
      "Contrat d’assurance combinant fonds en euros et unités de compte, avec une fiscalité et des règles de transmission propres. À vérifier selon la situation.",
  },
  {
    id: "support-enveloppe",
    term: "Support et enveloppe",
    category: "Enveloppes",
    lessonId: funds,
    definition:
      "Le support est ce que l’on détient (action, ETF, fonds) ; l’enveloppe est le cadre fiscal et juridique qui le contient.",
  },
  {
    id: "carnet-ordres",
    term: "Carnet d’ordres",
    category: "Ordres",
    lessonId: orders,
    definition:
      "Liste des prix et quantités auxquels des investisseurs veulent acheter ou vendre un titre.",
  },
  {
    id: "spread",
    term: "Fourchette (spread)",
    category: "Ordres",
    lessonId: orders,
    definition:
      "Écart entre le meilleur prix vendeur et le meilleur prix acheteur. Plus large sur les titres peu liquides.",
  },
  {
    id: "ordre-marche",
    term: "Ordre au marché",
    category: "Ordres",
    lessonId: orders,
    definition:
      "Ordre exécuté au meilleur prix disponible : exécution quasi certaine, prix incertain.",
  },
  {
    id: "ordre-limite",
    term: "Ordre à cours limité",
    category: "Ordres",
    lessonId: orders,
    definition:
      "Ordre avec un prix maximum à l’achat ou minimum à la vente : prix maîtrisé, exécution non garantie.",
  },
  {
    id: "ordre-seuil",
    term: "Ordre à seuil de déclenchement (stop)",
    category: "Ordres",
    lessonId: orders,
    definition:
      "Ordre qui devient un ordre au marché quand un prix est atteint ; il peut s’exécuter bien au-delà du seuil en cas de mouvement rapide.",
  },
  {
    id: "versements-programmes",
    term: "Versements programmés",
    category: "Comportement",
    lessonId: orders,
    definition:
      "Investir une somme régulière à dates fixes. Réduit le risque de mal choisir son moment, sans supprimer le risque de marché.",
  },
  {
    id: "reequilibrage",
    term: "Rééquilibrage",
    category: "Comportement",
    lessonId: orders,
    definition:
      "Ramener périodiquement un portefeuille vers la répartition prévue dans son plan.",
  },
  {
    id: "aversion-perte",
    term: "Aversion à la perte",
    category: "Comportement",
    lessonId: orders,
    definition:
      "Tendance à ressentir une perte plus fortement qu’un gain équivalent, qui pousse à garder trop longtemps un titre en baisse.",
  },
  {
    id: "ancrage",
    term: "Ancrage",
    category: "Comportement",
    lessonId: orders,
    definition:
      "Se fixer sur un prix de référence, comme son prix d’achat, qui n’a aucune importance pour le marché.",
  },
  {
    id: "exces-confiance",
    term: "Excès de confiance",
    category: "Comportement",
    lessonId: orders,
    definition:
      "Surestimer sa capacité à prévoir les marchés et sous-estimer le rôle du hasard.",
  },
  {
    id: "biais-confirmation",
    term: "Biais de confirmation",
    category: "Comportement",
    lessonId: orders,
    definition:
      "Chercher et retenir surtout les informations qui confirment ce que l’on pense déjà.",
  },
];

/** Alphabetical order in French, ignoring accents and case. */
export function sortedGlossary(terms: GlossaryTerm[] = glossary) {
  const collator = new Intl.Collator("fr", { sensitivity: "base" });
  return [...terms].sort((a, b) => collator.compare(a.term, b.term));
}

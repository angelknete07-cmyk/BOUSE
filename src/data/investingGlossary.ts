/**
 * Lexique de l'Académie : entreprise, intelligence artificielle, bourse,
 * investissement, budget et crédit. Définitions pédagogiques
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
  "Budget et crédit",
  "Entreprise",
  "Intelligence artificielle",
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
const budget = "fp-budget";
const reserve = "fp-epargne-precaution";
const credit = "fp-credit-taux";
const prices = "fp-inflation-quotidien";

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
      "Baisse entre un plus haut et le plus bas suivant. Après −50 %, il faut +100 % pour revenir au départ.",
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
  {
    id: "reste-a-vivre",
    term: "Reste à vivre",
    category: "Budget et crédit",
    lessonId: budget,
    definition:
      "Ce qui reste des revenus après les charges fixes, pour les dépenses variables et l’épargne.",
  },
  {
    id: "charges-fixes",
    term: "Charges fixes",
    category: "Budget et crédit",
    lessonId: budget,
    definition:
      "Dépenses qui reviennent chaque mois pour un montant connu : loyer, abonnements, assurances, remboursements.",
  },
  {
    id: "payer-premier",
    term: "Se payer en premier",
    category: "Budget et crédit",
    lessonId: budget,
    definition:
      "Programmer l’épargne en début de mois, puis vivre avec le reste.",
  },
  {
    id: "epargne-precaution-terme",
    term: "Réserve de précaution",
    category: "Budget et crédit",
    lessonId: reserve,
    definition:
      "Épargne disponible et sans risque de perte, souvent dimensionnée en mois de dépenses essentielles, pour faire face aux imprévus.",
  },
  {
    id: "livret-reglemente",
    term: "Livret réglementé",
    category: "Budget et crédit",
    lessonId: reserve,
    definition:
      "Livret d’épargne dont le taux et le plafond sont encadrés par les pouvoirs publics (Livret A, LDDS…). Conditions à vérifier à la date de la décision.",
  },
  {
    id: "mensualite",
    term: "Mensualité",
    category: "Budget et crédit",
    lessonId: credit,
    definition:
      "Somme remboursée chaque mois pour un crédit, qui combine intérêts et capital.",
  },
  {
    id: "taux-nominal",
    term: "Taux nominal",
    category: "Budget et crédit",
    lessonId: credit,
    definition:
      "Taux qui sert à calculer les intérêts d’un crédit, hors frais et assurance.",
  },
  {
    id: "taeg",
    term: "TAEG",
    category: "Budget et crédit",
    lessonId: credit,
    definition:
      "Taux annuel effectif global : inclut intérêts, frais obligatoires et assurance exigée. Indicateur légal pour comparer des offres.",
  },
  {
    id: "cout-total-credit",
    term: "Coût total du crédit",
    category: "Budget et crédit",
    lessonId: credit,
    definition:
      "Somme des mensualités moins le capital emprunté, plus frais et assurance exigée.",
  },
  {
    id: "amortissement",
    term: "Tableau d’amortissement",
    category: "Budget et crédit",
    lessonId: credit,
    definition:
      "Détail de chaque échéance d’un crédit : part d’intérêts, part de capital et capital restant dû.",
  },
  {
    id: "taux-endettement",
    term: "Taux d’endettement",
    category: "Budget et crédit",
    lessonId: credit,
    definition:
      "Part des revenus consacrée aux remboursements de crédits. Les seuils retenus par les banques se vérifient au moment d’emprunter.",
  },
  {
    id: "credit-renouvelable",
    term: "Crédit renouvelable",
    category: "Budget et crédit",
    lessonId: credit,
    definition:
      "Réserve d’argent réutilisable, en général à taux élevé, dont le remboursement peut s’étirer longtemps.",
  },
  {
    id: "pouvoir-achat",
    term: "Pouvoir d’achat",
    category: "Budget et crédit",
    lessonId: prices,
    definition:
      "Quantité de biens et services qu’un revenu permet d’acheter ; il baisse si les prix montent plus vite que le revenu.",
  },
  {
    id: "salaire-reel",
    term: "Salaire réel",
    category: "Budget et crédit",
    lessonId: prices,
    definition:
      "Évolution du salaire corrigée de l’inflation : environ hausse du salaire moins inflation.",
  },
  {
    id: "ipc",
    term: "Indice des prix à la consommation",
    category: "Budget et crédit",
    lessonId: prices,
    definition:
      "Indicateur publié par l’Insee qui mesure l’évolution des prix d’un panier représentatif de dépenses.",
  },
  {
    id: "chiffre-affaires",
    term: "Chiffre d’affaires",
    category: "Entreprise",
    lessonId: "ca-marge-tresorerie",
    definition:
      "Montant des ventes de biens et de services sur une période. Une facture peut compter dans le chiffre d’affaires avant d’être encaissée.",
  },
  {
    id: "marge-couts-variables",
    term: "Marge sur coûts variables",
    category: "Entreprise",
    lessonId: "ca-marge-tresorerie",
    definition:
      "Ce qui reste du chiffre d’affaires après les coûts qui évoluent avec les ventes. Elle doit encore couvrir les charges fixes : ce n’est pas le bénéfice.",
  },
  {
    id: "tresorerie",
    term: "Trésorerie",
    category: "Entreprise",
    lessonId: "ca-marge-tresorerie",
    definition:
      "Argent réellement disponible sur les comptes à un moment donné. Une activité rentable peut en manquer si ses clients paient tard.",
  },
  {
    id: "resultat",
    term: "Résultat",
    category: "Entreprise",
    lessonId: "ca-marge-tresorerie",
    definition:
      "Différence entre le chiffre d’affaires et l’ensemble des charges d’une période. Il mesure ce qui est gagné, pas ce qui est disponible.",
  },
  {
    id: "creance-client",
    term: "Créance client",
    category: "Entreprise",
    lessonId: "ca-marge-tresorerie",
    definition:
      "Somme due par un client pour une vente déjà réalisée mais pas encore réglée.",
  },
  {
    id: "delai-paiement",
    term: "Délai de paiement",
    category: "Entreprise",
    lessonId: "ca-marge-tresorerie",
    definition:
      "Temps entre la facture et son règlement. Il crée un décalage entre l’activité et la trésorerie.",
  },
  {
    id: "bfr",
    term: "Besoin en fonds de roulement (BFR)",
    category: "Entreprise",
    lessonId: "fin-bfr-tresorerie",
    definition:
      "Argent immobilisé notamment dans les stocks et les créances clients, diminué des dettes d’exploitation. Il grandit souvent avec la croissance.",
  },
  {
    id: "seuil-rentabilite",
    term: "Seuil de rentabilité",
    category: "Entreprise",
    lessonId: "seuil-rentabilite",
    definition:
      "Volume ou chiffre d’affaires pour lequel le résultat est nul sur une période : en dessous, l’activité perd de l’argent. On parle aussi de point mort.",
  },
  {
    id: "cout-variable",
    term: "Coût variable",
    category: "Entreprise",
    lessonId: "seuil-rentabilite",
    definition:
      "Coût qui évolue avec le volume vendu : matière, livraison, commission ou sous-traitance liée à chaque vente.",
  },
  {
    id: "hypothese",
    term: "Hypothèse",
    category: "Entreprise",
    lessonId: "validation-client",
    definition:
      "Ce que l’on suppose vrai sur un client ou un problème, formulé pour pouvoir être confirmé ou contredit par une observation.",
  },
  {
    id: "proposition-valeur",
    term: "Proposition de valeur",
    category: "Entreprise",
    lessonId: "validation-client",
    definition:
      "Lien entre un segment de clients précis, un problème important et le résultat que ces clients recherchent.",
  },
  {
    id: "llm",
    term: "LLM (grand modèle de langage)",
    category: "Intelligence artificielle",
    lessonId: "comprendre-llm",
    definition:
      "Modèle qui apprend des régularités dans de grandes quantités de données et génère une réponse en estimant des suites de tokens à partir du contexte.",
  },
  {
    id: "token",
    term: "Token",
    category: "Intelligence artificielle",
    lessonId: "comprendre-llm",
    definition:
      "Unité de texte traitée par un modèle : un mot, un fragment de mot ou un autre symbole.",
  },
  {
    id: "contexte",
    term: "Contexte",
    category: "Intelligence artificielle",
    lessonId: "comprendre-llm",
    definition:
      "Informations transmises au modèle pour une requête : messages, instructions, documents et résultats d’outils. Sa taille est limitée.",
  },
  {
    id: "hallucination",
    term: "Hallucination",
    category: "Intelligence artificielle",
    lessonId: "comprendre-llm",
    definition:
      "Réponse plausible mais incorrecte ou sans fondement suffisant, comme une référence inventée ou un chiffre non sourcé.",
  },
  {
    id: "inference",
    term: "Inférence",
    category: "Intelligence artificielle",
    lessonId: "comprendre-llm",
    definition:
      "Utilisation d’un modèle déjà entraîné pour produire une réponse. Une conversation ordinaire ne le réentraîne pas.",
  },
  {
    id: "prompt",
    term: "Prompt",
    category: "Intelligence artificielle",
    lessonId: "prompt-structure",
    definition:
      "Consigne de travail donnée à un modèle : objectif, contexte, données, contraintes, format et critères de réussite.",
  },
  {
    id: "few-shot",
    term: "Few-shot",
    category: "Intelligence artificielle",
    lessonId: "prompt-structure",
    definition:
      "Consigne accompagnée de quelques exemples d’entrée et de sortie. Sans exemple, on parle de zero-shot.",
  },
  {
    id: "injection-prompt",
    term: "Injection de prompt",
    category: "Intelligence artificielle",
    lessonId: "prompt-structure",
    definition:
      "Texte placé dans un document qui se fait passer pour une instruction afin de détourner le modèle.",
  },
  {
    id: "workflow",
    term: "Workflow",
    category: "Intelligence artificielle",
    lessonId: "automatisation-agent",
    definition:
      "Séquence d’étapes organisée, avec ses branches et ses validations. Il reste souvent déterministe.",
  },
  {
    id: "agent",
    term: "Agent",
    category: "Intelligence artificielle",
    lessonId: "automatisation-agent",
    definition:
      "Système où un modèle choisit une partie des prochaines actions ou des outils selon un objectif, dans des limites fixées.",
  },
  {
    id: "moindre-privilege",
    term: "Moindre privilège",
    category: "Intelligence artificielle",
    lessonId: "automatisation-agent",
    definition:
      "Principe qui consiste à n’accorder à un système que les capacités strictement nécessaires à sa tâche.",
  },
  {
    id: "idempotence",
    term: "Idempotence",
    category: "Intelligence artificielle",
    lessonId: "automatisation-agent",
    definition:
      "Propriété d’une action que l’on peut répéter sans effet supplémentaire : traiter deux fois le même événement ne produit pas deux remboursements.",
  },
  {
    id: "micro-entreprise",
    term: "Micro-entreprise",
    category: "Entreprise",
    lessonId: "ent-micro-entreprise",
    definition:
      "Régime fiscal et social simplifié de l’entreprise individuelle : cotisations calculées sur le chiffre d’affaires encaissé, comptabilité allégée, charges réelles non déduites.",
  },
  {
    id: "entreprise-individuelle",
    term: "Entreprise individuelle",
    category: "Entreprise",
    lessonId: "ent-statut-juridique",
    definition:
      "Activité exercée en son nom propre, sans créer de société. Depuis mai 2022, le patrimoine personnel est en principe séparé du patrimoine professionnel.",
  },
  {
    id: "eurl",
    term: "EURL",
    category: "Entreprise",
    lessonId: "ent-statut-juridique",
    definition:
      "Société à responsabilité limitée à associé unique. Son gérant majoritaire relève du régime des travailleurs indépendants.",
  },
  {
    id: "sasu",
    term: "SASU",
    category: "Entreprise",
    lessonId: "ent-statut-juridique",
    definition:
      "Société par actions simplifiée à associé unique. Son président est assimilé salarié et cotise au régime général, sans assurance chômage.",
  },
  {
    id: "sas",
    term: "SAS",
    category: "Entreprise",
    lessonId: "ent-statut-juridique",
    definition:
      "Société par actions simplifiée à plusieurs associés, aux statuts très libres, souvent choisie pour accueillir des investisseurs.",
  },
  {
    id: "assimile-salarie",
    term: "Assimilé salarié",
    category: "Entreprise",
    lessonId: "ent-statut-juridique",
    definition:
      "Dirigeant (président de SAS ou SASU) affilié au régime général de la sécurité sociale, sans assurance chômage.",
  },
  {
    id: "impot-societes",
    term: "Impôt sur les sociétés (IS)",
    category: "Entreprise",
    lessonId: "ent-statut-juridique",
    definition:
      "Impôt payé par une société sur son bénéfice. Le dirigeant est imposé à part sur ce qu’il perçoit : rémunération et dividendes.",
  },
  {
    id: "franchise-tva",
    term: "Franchise en base de TVA",
    category: "Entreprise",
    lessonId: "ent-micro-entreprise",
    definition:
      "Dispense de facturer la TVA sous certains seuils de chiffre d’affaires ; en contrepartie, la TVA payée sur les achats n’est pas récupérable.",
  },
  {
    id: "versement-liberatoire",
    term: "Versement libératoire",
    category: "Entreprise",
    lessonId: "ent-micro-entreprise",
    definition:
      "Option du micro-entrepreneur, sous condition de revenu du foyer : payer l’impôt sur le revenu en même temps que les cotisations, en pourcentage du chiffre d’affaires.",
  },
  {
    id: "abattement-forfaitaire",
    term: "Abattement forfaitaire",
    category: "Entreprise",
    lessonId: "ent-micro-entreprise",
    definition:
      "Réduction appliquée au chiffre d’affaires d’un micro-entrepreneur pour calculer son revenu imposable, censée représenter ses charges.",
  },
  {
    id: "guichet-unique",
    term: "Guichet unique",
    category: "Entreprise",
    lessonId: "ent-creer-etapes",
    definition:
      "Site officiel opéré par l’INPI où se font, depuis 2023, toutes les formalités de création, modification et cessation d’entreprise.",
  },
  {
    id: "siret",
    term: "SIRET",
    category: "Entreprise",
    lessonId: "ent-creer-etapes",
    definition:
      "Numéro qui identifie chaque établissement d’une entreprise ; il commence par le numéro SIREN de l’entreprise.",
  },
  {
    id: "pret-honneur",
    term: "Prêt d’honneur",
    category: "Entreprise",
    lessonId: "ent-financer-projet",
    definition:
      "Prêt personnel au créateur, sans intérêt ni garantie, accordé par des réseaux d’accompagnement pour renforcer son apport.",
  },
  {
    id: "dilution",
    term: "Dilution",
    category: "Entreprise",
    lessonId: "ent-financer-projet",
    definition:
      "Baisse de la part de capital d’un associé lorsque de nouveaux investisseurs entrent dans la société.",
  },
  {
    id: "cout-acquisition",
    term: "Coût d’acquisition client",
    category: "Entreprise",
    lessonId: "ent-modele-economique",
    definition:
      "Dépense moyenne nécessaire pour obtenir un nouveau client : publicité, temps commercial, remises de bienvenue.",
  },
  {
    id: "valeur-vie-client",
    term: "Valeur vie client",
    category: "Entreprise",
    lessonId: "ent-modele-economique",
    definition:
      "Marge totale qu’un client laisse pendant toute sa relation avec l’entreprise ; à comparer au coût d’acquisition.",
  },
  {
    id: "produit-minimum-viable",
    term: "Produit minimum viable",
    category: "Entreprise",
    lessonId: "ent-modele-economique",
    definition:
      "Plus petite version d’une offre qui permet d’apprendre si les clients l’utilisent et la paient.",
  },
  {
    id: "taux-conversion",
    term: "Taux de conversion",
    category: "Entreprise",
    lessonId: "ent-trouver-clients",
    definition:
      "Part des personnes qui passent d’une étape du parcours d’achat à la suivante, par exemple de la visite à la demande de devis.",
  },
  {
    id: "cout-revient",
    term: "Coût de revient",
    category: "Entreprise",
    lessonId: "ent-fixer-prix",
    definition:
      "Coûts variables d’une unité vendue, auxquels s’ajoute sa part des charges fixes.",
  },
  {
    id: "tva-collectee",
    term: "TVA collectée",
    category: "Entreprise",
    lessonId: "ent-facturer-declarer",
    definition:
      "TVA facturée aux clients et encaissée pour le compte de l’État.",
  },
  {
    id: "tva-deductible",
    term: "TVA déductible",
    category: "Entreprise",
    lessonId: "ent-facturer-declarer",
    definition:
      "TVA payée sur les achats professionnels, que l’entreprise assujettie déduit de la TVA collectée avant de reverser la différence.",
  },
  {
    id: "avoir",
    term: "Avoir",
    category: "Entreprise",
    lessonId: "ent-facturer-declarer",
    definition:
      "Document qui annule ou corrige tout ou partie d’une facture déjà émise ; une facture émise ne se supprime pas.",
  },
  {
    id: "facture-electronique",
    term: "Facture électronique",
    category: "Entreprise",
    lessonId: "ent-facturer-declarer",
    definition:
      "Facture émise, transmise et reçue sous forme de données structurées via une plateforme agréée, obligatoire progressivement entre entreprises.",
  },
  {
    id: "compte-resultat",
    term: "Compte de résultat",
    category: "Entreprise",
    lessonId: "fin-etats-financiers",
    definition:
      "Document qui compare les produits et les charges d’une période pour en déduire le bénéfice ou la perte.",
  },
  {
    id: "bilan",
    term: "Bilan",
    category: "Entreprise",
    lessonId: "fin-etats-financiers",
    definition:
      "Photographie à une date de ce que l’entreprise possède (actif) et de la façon dont c’est financé (capitaux propres et dettes).",
  },
  {
    id: "capitaux-propres",
    term: "Capitaux propres",
    category: "Entreprise",
    lessonId: "fin-etats-financiers",
    definition:
      "Ressources qui appartiennent aux associés : capital apporté, réserves et résultat de l’exercice.",
  },
  {
    id: "ebe",
    term: "Excédent brut d’exploitation (EBE)",
    category: "Entreprise",
    lessonId: "fin-etats-financiers",
    definition:
      "Ce que dégage le métier avant amortissements, intérêts et impôt ; un repère de la capacité à produire de la trésorerie.",
  },
  {
    id: "plan-tresorerie",
    term: "Plan de trésorerie",
    category: "Entreprise",
    lessonId: "fin-bfr-tresorerie",
    definition:
      "Tableau mensuel des encaissements et décaissements prévus, à leur date réelle et TVA comprise.",
  },
  {
    id: "fonds-roulement",
    term: "Fonds de roulement",
    category: "Entreprise",
    lessonId: "fin-bfr-tresorerie",
    definition:
      "Excédent des ressources durables (capitaux propres, emprunts longs) sur les immobilisations.",
  },
  {
    id: "analyse-sensibilite",
    term: "Analyse de sensibilité",
    category: "Entreprise",
    lessonId: "fin-previsionnel",
    definition:
      "Faire varier une hypothèse à la fois pour voir laquelle menace le plus le projet.",
  },
  {
    id: "immobilisation",
    term: "Immobilisation",
    category: "Entreprise",
    lessonId: "fin-investir-amortir",
    definition:
      "Bien destiné à servir durablement à l’entreprise, inscrit à l’actif du bilan plutôt qu’en charge immédiate.",
  },
  {
    id: "amortissement-comptable",
    term: "Amortissement",
    category: "Entreprise",
    lessonId: "fin-investir-amortir",
    definition:
      "Répartition du coût d’une immobilisation sur sa durée d’utilisation ; en linéaire, coût ÷ durée chaque année.",
  },
  {
    id: "caf",
    term: "Capacité d’autofinancement (CAF)",
    category: "Entreprise",
    lessonId: "fin-investir-amortir",
    definition:
      "Trésorerie potentielle dégagée par l’activité ; simplement, résultat net plus dotations aux amortissements.",
  },
  {
    id: "delai-recuperation",
    term: "Délai de récupération",
    category: "Entreprise",
    lessonId: "fin-investir-amortir",
    definition:
      "Temps nécessaire pour que les gains d’un investissement remboursent son coût.",
  },
  {
    id: "taux-marge",
    term: "Taux de marge",
    category: "Entreprise",
    lessonId: "fin-piloter-indicateurs",
    definition: "Marge rapportée au chiffre d’affaires hors taxes.",
  },
  {
    id: "agios",
    term: "Agios",
    category: "Budget et crédit",
    lessonId: "fp-banque-arnaques",
    definition:
      "Intérêts et frais payés sur un découvert, qu’il soit autorisé ou non.",
  },
  {
    id: "hameconnage",
    term: "Hameçonnage",
    category: "Budget et crédit",
    lessonId: "fp-banque-arnaques",
    definition:
      "Fraude par message (SMS, courriel) qui imite un organisme connu pour récupérer identifiants ou données bancaires.",
  },
  {
    id: "taux-marginal",
    term: "Taux marginal d’imposition",
    category: "Budget et crédit",
    lessonId: "fp-impot-revenu",
    definition:
      "Taux de la dernière tranche du barème atteinte ; il ne s’applique qu’aux euros situés au-dessus du seuil de cette tranche.",
  },
  {
    id: "taux-moyen",
    term: "Taux moyen d’imposition",
    category: "Budget et crédit",
    lessonId: "fp-impot-revenu",
    definition:
      "Impôt total divisé par le revenu imposable ; toujours inférieur au taux marginal.",
  },
  {
    id: "quotient-familial",
    term: "Quotient familial",
    category: "Budget et crédit",
    lessonId: "fp-impot-revenu",
    definition:
      "Revenu imposable divisé par le nombre de parts du foyer, auquel s’applique le barème.",
  },
  {
    id: "prelevement-source",
    term: "Prélèvement à la source",
    category: "Budget et crédit",
    lessonId: "fp-impot-revenu",
    definition:
      "Paiement de l’impôt sur le revenu chaque mois, sur le salaire ou par acomptes, depuis 2019 ; la déclaration annuelle reste obligatoire.",
  },
  {
    id: "credit-impot",
    term: "Crédit d’impôt",
    category: "Budget et crédit",
    lessonId: "fp-impot-revenu",
    definition:
      "Avantage fiscal déduit de l’impôt et remboursé s’il dépasse le montant dû, contrairement à une réduction d’impôt.",
  },
  {
    id: "franchise-assurance",
    term: "Franchise",
    category: "Budget et crédit",
    lessonId: "fp-assurances",
    definition:
      "Part de chaque sinistre qui reste à la charge de l’assuré, déduite de l’indemnisation.",
  },
  {
    id: "frais-acquisition",
    term: "Frais d’acquisition",
    category: "Budget et crédit",
    lessonId: "fp-logement",
    definition:
      "Droits et frais payés lors d’un achat immobilier, souvent appelés « frais de notaire ».",
  },
  {
    id: "repartition",
    term: "Retraite par répartition",
    category: "Budget et crédit",
    lessonId: "fp-retraite",
    definition:
      "Système où les cotisations des actifs financent les pensions des retraités de la même période.",
  },
  {
    id: "taux-plein",
    term: "Taux plein",
    category: "Budget et crédit",
    lessonId: "fp-retraite",
    definition:
      "Pension de base calculée sans décote, avec le nombre de trimestres requis ou à partir de l’âge d’annulation de la décote.",
  },
  {
    id: "plan-epargne-retraite",
    term: "PER (plan d’épargne retraite)",
    category: "Budget et crédit",
    lessonId: "fp-retraite",
    definition:
      "Épargne bloquée jusqu’à la retraite, sauf exceptions ; les versements volontaires sont en principe déductibles et l’impôt est payé à la sortie.",
  },
  {
    id: "duration",
    term: "Duration",
    category: "Risque",
    lessonId: "inv-obligations-taux",
    definition:
      "Mesure de la sensibilité du prix d’une obligation aux variations de taux : plus elle est longue, plus le prix réagit.",
  },
  {
    id: "spread-credit",
    term: "Spread de crédit",
    category: "Risque",
    lessonId: "inv-obligations-taux",
    definition:
      "Écart de rendement entre une obligation risquée et un emprunt d’État de référence, qui rémunère le risque de défaut.",
  },
  {
    id: "notation",
    term: "Notation financière",
    category: "Risque",
    lessonId: "inv-obligations-taux",
    definition:
      "Évaluation par une agence de la capacité d’un émetteur à rembourser ses dettes, de la catégorie « investissement » à « spéculative ».",
  },
  {
    id: "liste-noire",
    term: "Liste noire de l’AMF",
    category: "Comportement",
    lessonId: "inv-arnaques-placement",
    definition:
      "Liste publique des sites et entités non autorisés à proposer des placements en France, à consulter avant tout versement.",
  },
  {
    id: "orias",
    term: "ORIAS",
    category: "Comportement",
    lessonId: "inv-arnaques-placement",
    definition:
      "Registre officiel des intermédiaires en assurance, banque et finance, où vérifier qu’un conseiller est enregistré.",
  },
  {
    id: "scpi",
    term: "SCPI",
    category: "Produits",
    lessonId: "inv-immobilier-scpi",
    definition:
      "Société civile de placement immobilier : parts d’un parc d’immeubles géré, frais d’entrée élevés, capital non garanti.",
  },
  {
    id: "rendement-locatif",
    term: "Rendement locatif net",
    category: "Coûts et rendement",
    lessonId: "inv-immobilier-scpi",
    definition:
      "Loyers annuels diminués des charges, taxe foncière et vacance, rapportés au coût total d’achat.",
  },
  {
    id: "micro-foncier",
    term: "Micro-foncier",
    category: "Coûts et rendement",
    lessonId: "inv-immobilier-scpi",
    definition:
      "Régime des petits revenus fonciers de location nue : abattement forfaitaire de 30 % sur les loyers.",
  },
  {
    id: "blockchain",
    term: "Blockchain",
    category: "Produits",
    lessonId: "inv-crypto-actifs",
    definition:
      "Registre partagé, tenu par un réseau d’ordinateurs, qui enregistre des transactions de façon difficile à falsifier.",
  },
  {
    id: "crypto-actif",
    term: "Crypto-actif",
    category: "Produits",
    lessonId: "inv-crypto-actifs",
    definition:
      "Actif numérique enregistré sur une blockchain, sans bénéfice ni revenu sous-jacent, au prix très volatil.",
  },
  {
    id: "stablecoin",
    term: "Stablecoin",
    category: "Produits",
    lessonId: "inv-crypto-actifs",
    definition:
      "Crypto-actif qui vise une valeur stable en suivant une monnaie, grâce à des réserves dont la qualité varie.",
  },
  {
    id: "mica",
    term: "MiCA",
    category: "Produits",
    lessonId: "inv-crypto-actifs",
    definition:
      "Règlement européen qui encadre les prestataires de services sur crypto-actifs et l’émission de certains jetons.",
  },
  {
    id: "profil-risque",
    term: "Profil de risque",
    category: "Risque",
    lessonId: "inv-allocation-profil",
    definition:
      "Combinaison de l’horizon, de la capacité à supporter une perte et de la tolérance aux baisses d’un épargnant.",
  },
  {
    id: "allocation-actifs",
    term: "Allocation d’actifs",
    category: "Risque",
    lessonId: "inv-allocation-profil",
    definition:
      "Répartition de l’épargne entre grandes catégories (liquidités, obligations, actions, immobilier).",
  },
  {
    id: "pfu",
    term: "Prélèvement forfaitaire unique (PFU)",
    category: "Enveloppes",
    lessonId: "inv-fiscalite-placements",
    definition:
      "Imposition par défaut des revenus du capital : impôt sur le revenu à 12,8 % plus prélèvements sociaux, soit 31,4 % en 2026 selon les sources.",
  },
  {
    id: "prelevements-sociaux",
    term: "Prélèvements sociaux",
    category: "Enveloppes",
    lessonId: "inv-fiscalite-placements",
    definition:
      "CSG, CRDS et prélèvement de solidarité appliqués aux revenus du capital, en plus de l’impôt sur le revenu.",
  },
  {
    id: "rgpd",
    term: "RGPD",
    category: "Intelligence artificielle",
    lessonId: "ia-donnees-confidentialite",
    definition:
      "Règlement général sur la protection des données : règles européennes applicables à toute information sur une personne identifiable.",
  },
  {
    id: "minimisation",
    term: "Minimisation des données",
    category: "Intelligence artificielle",
    lessonId: "ia-donnees-confidentialite",
    definition:
      "Principe du RGPD : ne traiter que les données strictement nécessaires à la finalité poursuivie.",
  },
  {
    id: "pseudonymisation",
    term: "Pseudonymisation",
    category: "Intelligence artificielle",
    lessonId: "ia-donnees-confidentialite",
    definition:
      "Remplacement des éléments identifiants par des étiquettes ; les données restent personnelles si l’on peut retrouver la personne.",
  },
  {
    id: "cas-usage",
    term: "Cas d’usage",
    category: "Intelligence artificielle",
    lessonId: "ia-cas-usage",
    definition:
      "Tâche précise pour laquelle on envisage d’utiliser un outil d’IA, évaluée sur sa fréquence, sa vérifiabilité et le risque d’erreur.",
  },
  {
    id: "projet-pilote",
    term: "Projet pilote",
    category: "Intelligence artificielle",
    lessonId: "ia-cas-usage",
    definition:
      "Essai limité dans le temps, avec une mesure de départ et des critères de succès, avant de généraliser un outil.",
  },
  {
    id: "jeu-cas-test",
    term: "Jeu de cas de test",
    category: "Intelligence artificielle",
    lessonId: "ia-evaluer-fiabilite",
    definition:
      "Ensemble d’exemples réels, avec résultat attendu, utilisé pour mesurer la fiabilité d’un outil ou d’une consigne.",
  },
  {
    id: "biais",
    term: "Biais algorithmique",
    category: "Intelligence artificielle",
    lessonId: "ia-evaluer-fiabilite",
    definition:
      "Différence de traitement injustifiée entre des cas comparables, selon un critère non pertinent comme le genre ou l’origine.",
  },
  {
    id: "supervision-humaine",
    term: "Supervision humaine",
    category: "Intelligence artificielle",
    lessonId: "ia-evaluer-fiabilite",
    definition:
      "Contrôle par une personne compétente, qui a le temps et l’autorité de corriger ou refuser le résultat d’une IA.",
  },
  {
    id: "ai-act",
    term: "AI Act",
    category: "Intelligence artificielle",
    lessonId: "ia-cadre-legal",
    definition:
      "Règlement européen sur l’intelligence artificielle, entré en vigueur en 2024, qui encadre les usages selon leur niveau de risque.",
  },
  {
    id: "haut-risque",
    term: "IA à haut risque",
    category: "Intelligence artificielle",
    lessonId: "ia-cadre-legal",
    definition:
      "Usage de l’IA ayant un effet important sur les personnes (emploi, crédit, éducation, santé), soumis à des obligations renforcées.",
  },
  {
    id: "hypertrucage",
    term: "Hypertrucage",
    category: "Intelligence artificielle",
    lessonId: "ia-cadre-legal",
    definition:
      "Contenu (image, son, vidéo) généré ou manipulé par IA pour paraître authentique ; il doit être signalé comme tel.",
  },
];

/** Alphabetical order in French, ignoring accents and case. */
export function sortedGlossary(terms: GlossaryTerm[] = glossary) {
  const collator = new Intl.Collator("fr", { sensitivity: "base" });
  return [...terms].sort((a, b) => collator.compare(a.term, b.term));
}

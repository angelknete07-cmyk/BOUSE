/**
 * Les missions réelles (idée 14) : un vrai projet devient une suite de
 * missions ; chaque mission remplit une partie d'un vrai dossier. Les
 * calculs sont purs et testés (tests/missions.test.ts). Aucun barème légal
 * en dur : quand un taux compte, c'est la personne qui le saisit.
 */

export type MissionField = {
  id: string;
  label: string;
  /** Exemple montré en gris dans le champ. */
  example: string;
  /** money : un montant en euros ; number : un nombre ; long : un texte. */
  kind?: "text" | "long" | "money" | "number";
  /** Sur la même ligne que le champ voisin (ex. prestation + prix). */
  inline?: boolean;
  /** Peut rester vide. */
  optional?: boolean;
};

export type MissionLine = { label: string; value: string };

export type MissionStep = {
  id: string;
  title: string;
  minutes: number;
  /** L'idée de la mission, en deux phrases. */
  hint: string;
  fields: MissionField[];
  /** Additionne les montants de l'étape sous ce libellé. */
  total?: string;
  /** Lignes calculées à partir de tous les nombres de la mission. */
  compute?: (n: (fieldId: string) => number | null) => MissionLine[];
  /** Les compétences du catalogue qu'elle met en pratique. */
  uses: string[];
};

export type Mission = {
  id: string;
  title: string;
  /** Ce qu'on a en main à la fin. */
  outcome: string;
  domains: string[];
  caution?: string;
  steps: MissionStep[];
};

/** « 1 650 € » ; « — » quand il manque un nombre. */
export function euro(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return `${Math.round(value).toLocaleString("fr-FR")} €`;
}
const plain = (value: number | null, unit = "") =>
  value === null || !Number.isFinite(value)
    ? "—"
    : `${(Math.round(value * 10) / 10).toLocaleString("fr-FR")}${unit}`;
const sum = (...values: (number | null)[]) =>
  values.every((v) => v === null)
    ? null
    : values.reduce<number>((a, v) => a + (v ?? 0), 0);

const FIXED = ["loyer", "energie", "assurances", "transport", "abonnements"];
const LIFE = ["courses", "loisirs", "divers"];

export const MISSIONS: Mission[] = [
  {
    id: "budget-annee",
    title: "Mon budget de l’année",
    outcome: "ton budget sur 12 mois et ton épargne de précaution",
    domains: ["Ton argent au quotidien"],
    steps: [
      {
        id: "revenus",
        title: "Ce qui rentre chaque mois",
        minutes: 8,
        hint: "On part de ce qui arrive vraiment sur ton compte, pas du brut. Prends ta dernière fiche de paie ou ton relevé.",
        fields: [
          {
            id: "salaire",
            label: "Ton salaire net (ou tes revenus)",
            example: "1 650",
            kind: "money",
          },
          {
            id: "autres",
            label: "Autres rentrées (aides, extras)",
            example: "0",
            kind: "money",
          },
        ],
        total: "Total des rentrées",
        uses: ["fp-fiche-paie", "fp-budget"],
      },
      {
        id: "fixes",
        title: "Tes dépenses fixes",
        minutes: 10,
        hint: "Les fixes reviennent chaque mois, quoi qu’il arrive. Ouvre tes trois derniers relevés et fais la moyenne.",
        fields: [
          {
            id: "loyer",
            label: "Logement (loyer ou crédit)",
            example: "620",
            kind: "money",
          },
          {
            id: "energie",
            label: "Énergie, internet, téléphone",
            example: "95",
            kind: "money",
          },
          {
            id: "assurances",
            label: "Assurances",
            example: "40",
            kind: "money",
          },
          { id: "transport", label: "Transport", example: "75", kind: "money" },
          {
            id: "abonnements",
            label: "Abonnements",
            example: "30",
            kind: "money",
          },
        ],
        total: "Total des dépenses fixes",
        uses: ["fp-budget", "fp-assurances"],
      },
      {
        id: "vie",
        title: "Tes dépenses de la vie",
        minutes: 8,
        hint: "Celles-là bougent d’un mois à l’autre. Mets un montant réaliste, pas idéal : un budget trop serré ne tient pas.",
        fields: [
          { id: "courses", label: "Courses", example: "280", kind: "money" },
          {
            id: "loisirs",
            label: "Sorties et loisirs",
            example: "120",
            kind: "money",
          },
          {
            id: "divers",
            label: "Imprévus et divers",
            example: "60",
            kind: "money",
          },
        ],
        total: "Total de la vie courante",
        uses: ["fp-budget"],
      },
      {
        id: "reste",
        title: "Ce qui reste, et où il va",
        minutes: 8,
        hint: "Ce qui reste n’est utile que si tu décides où il va. Le plus simple : un virement automatique le lendemain de la paie.",
        fields: [
          {
            id: "epargne",
            label: "Ce que tu mets de côté chaque mois",
            example: "200",
            kind: "money",
          },
          {
            id: "jour",
            label: "Le jour du virement automatique",
            example: "le 2 du mois",
          },
        ],
        compute: (n) => {
          const rest =
            n("salaire") === null
              ? null
              : (sum(n("salaire"), n("autres")) ?? 0) -
                (sum(...FIXED.map(n)) ?? 0) -
                (sum(...LIFE.map(n)) ?? 0);
          const save = n("epargne");
          return [
            { label: "Reste chaque mois", value: euro(rest) },
            {
              label: "Mis de côté sur 12 mois",
              value: euro(save === null ? null : save * 12),
            },
            {
              label: "Reste libre après l’épargne",
              value: euro(rest === null || save === null ? null : rest - save),
            },
          ];
        },
        uses: ["fp-comptes-auto", "fp-budget"],
      },
      {
        id: "precaution",
        title: "Ton épargne de précaution",
        minutes: 8,
        hint: "C’est le matelas pour une panne, une perte d’emploi, un imprévu. On compte en mois de dépenses, sur un livret disponible à tout moment.",
        fields: [
          {
            id: "deja",
            label: "Ce que tu as déjà de côté",
            example: "800",
            kind: "money",
          },
          {
            id: "mois",
            label: "Combien de mois de dépenses tu vises",
            example: "3",
            kind: "number",
          },
        ],
        compute: (n) => {
          const monthly = sum(...FIXED.map(n), ...LIFE.map(n));
          const months = n("mois");
          const goal =
            monthly === null || months === null ? null : monthly * months;
          const missing =
            goal === null ? null : Math.max(0, goal - (n("deja") ?? 0));
          const save = n("epargne");
          return [
            { label: "Ton objectif", value: euro(goal) },
            { label: "Ce qu’il manque", value: euro(missing) },
            {
              label: "Atteint en",
              value:
                missing === null
                  ? "—"
                  : missing === 0
                    ? "c’est fait"
                    : save
                      ? `${Math.ceil(missing / save)} mois`
                      : "— (ajoute une épargne mensuelle)",
            },
          ];
        },
        uses: ["fp-epargne-precaution", "inv-livrets"],
      },
    ],
  },
  {
    id: "micro-entreprise",
    title: "Lancer ma micro-entreprise",
    outcome:
      "ton premier devis, ton prix, ta facture et ton plan des démarches",
    domains: ["Entreprendre", "Vendre"],
    caution:
      "Les règles (taux, mentions, plafonds) changent : vérifie-les sur autoentrepreneur.urssaf.fr et service-public.fr avant d’envoyer un vrai document.",
    steps: [
      {
        id: "idee",
        title: "Ton idée en une phrase",
        minutes: 10,
        hint: "Une bonne idée tient en une phrase : ce que tu fais, pour qui, et le problème que tu règles.",
        fields: [
          {
            id: "offre",
            label: "Ce que tu proposes",
            example: "Des photos pour les commerces du quartier",
          },
          {
            id: "pour-qui",
            label: "Pour qui",
            example: "Cafés, boutiques et artisans de ma ville",
          },
          {
            id: "probleme",
            label: "Le problème que ça règle",
            example:
              "Leurs photos en ligne sont sombres et ne donnent pas envie d’entrer",
            kind: "long",
          },
        ],
        uses: ["ent-idee", "validation-client"],
      },
      {
        id: "prix",
        title: "Ton prix",
        minutes: 15,
        hint: "On part de ce que tu veux gagner, on ajoute tes frais et tes cotisations, puis on divise par les heures vraiment facturées.",
        fields: [
          {
            id: "net",
            label: "Ce que tu veux gagner par mois",
            example: "1 500",
            kind: "money",
          },
          {
            id: "frais",
            label: "Tes frais par mois (matériel, logiciels…)",
            example: "150",
            kind: "money",
          },
          {
            id: "taux",
            label: "Tes cotisations, en % du chiffre d’affaires",
            example: "le taux de ton activité, sur urssaf.fr",
            kind: "number",
          },
          {
            id: "heures",
            label: "Heures facturées par mois",
            example: "60",
            kind: "number",
          },
        ],
        compute: (n) => {
          const net = n("net");
          const rate = n("taux");
          const ca =
            net === null || rate === null || rate >= 100
              ? null
              : (net + (n("frais") ?? 0)) / (1 - rate / 100);
          const hours = n("heures");
          return [
            {
              label: "Chiffre d’affaires nécessaire par mois",
              value: euro(ca),
            },
            {
              label: "Ton prix de l’heure, au minimum",
              value: euro(ca === null || !hours ? null : ca / hours),
            },
          ];
        },
        uses: ["ent-fixer-prix", "ent-modele-economique"],
      },
      {
        id: "devis",
        title: "Ton premier devis",
        minutes: 10,
        hint: "Un devis dit quoi, combien et jusqu’à quand. Remplis-le avec un vrai client, ou un client imaginé.",
        fields: [
          { id: "client", label: "Ton client", example: "Café Lumière" },
          {
            id: "p1",
            label: "Prestation 1",
            example: "Séance photo (2 h)",
            inline: true,
          },
          {
            id: "m1",
            label: "Prix",
            example: "90",
            kind: "money",
            inline: true,
          },
          {
            id: "p2",
            label: "Prestation 2",
            example: "Retouche de 20 photos",
            inline: true,
            optional: true,
          },
          {
            id: "m2",
            label: "Prix",
            example: "120",
            kind: "money",
            inline: true,
            optional: true,
          },
          {
            id: "validite",
            label: "Valable jusqu’au",
            example: "30 novembre 2026",
          },
        ],
        total: "Total du devis",
        uses: ["ent-devis", "ent-fixer-prix"],
      },
      {
        id: "statut",
        title: "Ton statut et tes démarches",
        minutes: 10,
        hint: "Le statut décide de tes cotisations et de tes papiers. Note ton choix et pourquoi : tu pourras en changer plus tard.",
        fields: [
          {
            id: "statut",
            label: "Le statut choisi",
            example: "Micro-entreprise",
          },
          {
            id: "pourquoi",
            label: "Pourquoi celui-là",
            example:
              "Peu de frais, démarches simples, je teste avant de grandir",
            kind: "long",
          },
          {
            id: "ou",
            label: "Où tu déclares ton activité",
            example: "Le guichet unique : formalites.entreprises.gouv.fr",
          },
          {
            id: "tva",
            label: "Ta mention TVA sur tes documents",
            example:
              "La mention de ta situation, vérifiée sur service-public.fr",
          },
        ],
        uses: [
          "ent-statut-juridique",
          "ent-micro-entreprise",
          "ent-creer-etapes",
        ],
      },
      {
        id: "facture",
        title: "Ta première facture",
        minutes: 10,
        hint: "Une facture se numérote sans trou, porte une date et dit quand on doit te payer. Garde-les toutes.",
        fields: [
          { id: "numero", label: "Numéro", example: "2026-001", inline: true },
          {
            id: "date",
            label: "Date",
            example: "12 novembre 2026",
            inline: true,
          },
          { id: "f-client", label: "Client", example: "Café Lumière" },
          {
            id: "f-presta",
            label: "Prestation",
            example: "Séance photo et retouches",
            inline: true,
          },
          {
            id: "f-montant",
            label: "Montant",
            example: "210",
            kind: "money",
            inline: true,
          },
          {
            id: "echeance",
            label: "Paiement attendu le",
            example: "12 décembre 2026",
          },
        ],
        uses: ["ent-facturer-declarer", "ent-relancer-impayes"],
      },
      {
        id: "plan",
        title: "Ton plan des 3 premiers mois",
        minutes: 15,
        hint: "Trois mois, un objectif chiffré, une action par mois. Assez précis pour savoir, à la fin, si ça marche.",
        fields: [
          {
            id: "mois1",
            label: "Mois 1",
            example:
              "Déclarer l’activité, faire 3 séances à prix d’ami contre un avis",
            kind: "long",
          },
          {
            id: "mois2",
            label: "Mois 2",
            example: "Montrer ces photos à 20 commerces, en vrai",
            kind: "long",
          },
          {
            id: "mois3",
            label: "Mois 3",
            example: "Relancer, demander des recommandations",
            kind: "long",
          },
          {
            id: "objectif",
            label: "Ton objectif au bout de 3 mois",
            example: "5 clients payants",
          },
        ],
        uses: ["ent-trouver-clients", "mkt-cible"],
      },
    ],
  },
  {
    id: "premier-placement",
    title: "Préparer mon premier placement",
    outcome:
      "ta fiche de réflexion : horizon, risque, frais et règles de conduite",
    domains: ["Investir"],
    caution:
      "Une fiche pour réfléchir, pas un conseil : aucun produit ni aucun titre n’est recommandé. Les règles fiscales se vérifient sur impots.gouv.fr.",
    steps: [
      {
        id: "avant",
        title: "Avant de placer",
        minutes: 8,
        hint: "On ne place que l’argent dont on n’a pas besoin bientôt. D’abord le matelas de précaution, et pas de dette chère.",
        fields: [
          {
            id: "matelas",
            label: "Ton épargne de précaution est-elle faite ?",
            example: "Oui, 3 mois de dépenses sur un livret",
          },
          {
            id: "dettes",
            label: "Tes dettes chères (crédit conso, découvert)",
            example: "Aucune",
          },
        ],
        uses: ["fp-epargne-precaution", "fp-dettes"],
      },
      {
        id: "horizon",
        title: "Ton horizon",
        minutes: 10,
        hint: "Plus tu as de temps, plus tu peux traverser les mauvaises années. L’horizon décide presque tout le reste.",
        fields: [
          {
            id: "but",
            label: "Pour quoi faire, cet argent",
            example: "Un apport pour un appartement",
          },
          {
            id: "annees",
            label: "Dans combien d’années tu en auras besoin",
            example: "10",
            kind: "number",
          },
          {
            id: "plus-tot",
            label: "Ce qui se passe si tu en as besoin plus tôt",
            example:
              "J’attends ou je réduis l’apport, sans vendre en catastrophe",
            kind: "long",
          },
        ],
        uses: ["inv-interets-composes", "inv-marches-financiers"],
      },
      {
        id: "risque",
        title: "Ton risque",
        minutes: 10,
        hint: "Le vrai test : ce que tu ferais si ça baissait fort. Réponds honnêtement, pas comme tu aimerais réagir.",
        fields: [
          {
            id: "baisse",
            label: "Si ton placement perdait 20 % en un an, tu ferais quoi ?",
            example:
              "J’attendrais sans vendre : je n’ai pas besoin de cet argent avant 10 ans",
            kind: "long",
          },
          {
            id: "part",
            label: "La part que tu acceptes de voir bouger, en %",
            example: "50",
            kind: "number",
          },
          {
            id: "diversif",
            label: "Ta règle de diversification",
            example: "Jamais plus de 10 % sur une seule entreprise",
          },
        ],
        uses: ["inv-risque-diversification", "inv-allocation-profil"],
      },
      {
        id: "enveloppe",
        title: "L’enveloppe et les frais",
        minutes: 12,
        hint: "Les frais se paient chaque année, que ça monte ou que ça baisse. Un petit pourcentage devient une grosse somme sur dix ans.",
        fields: [
          {
            id: "env",
            label: "L’enveloppe qui te semble adaptée, et pourquoi",
            example: "Un PEA, pour un horizon long (à vérifier)",
            kind: "long",
          },
          {
            id: "montant",
            label: "Le montant que tu comptes placer",
            example: "5 000",
            kind: "money",
          },
          {
            id: "frais-pct",
            label: "Les frais par an que tu acceptes au maximum, en %",
            example: "0,5",
            kind: "number",
          },
        ],
        compute: (n) => {
          const amount = n("montant");
          const fees = n("frais-pct");
          const perYear =
            amount === null || fees === null ? null : (amount * fees) / 100;
          const years = n("annees");
          return [
            { label: "Frais la première année", value: euro(perYear) },
            {
              label: `Frais sur ${years ? plain(years, " ans") : "ton horizon"} (à montant constant)`,
              value: euro(perYear === null || !years ? null : perYear * years),
            },
          ];
        },
        uses: ["inv-fonds-enveloppes", "inv-fiscalite-placements"],
      },
      {
        id: "regles",
        title: "Tes règles de conduite",
        minutes: 10,
        hint: "Des règles écrites à froid te protègent des décisions à chaud. Trois suffisent.",
        fields: [
          {
            id: "versement",
            label: "Combien tu verses, et quand",
            example: "100 € le 5 de chaque mois",
          },
          {
            id: "regarder",
            label: "Quand tu regardes ton placement",
            example: "Une fois par trimestre, pas plus",
          },
          {
            id: "jamais",
            label: "Ce que tu ne feras jamais",
            example:
              "Placer sur un conseil reçu par message ; vendre dans la panique",
            kind: "long",
          },
        ],
        uses: ["inv-ordres-biais", "inv-arnaques-placement"],
      },
    ],
  },
  {
    id: "premiers-clients",
    title: "Trouver mes premiers clients",
    outcome: "ta liste de prospects, ton message d’approche et ton suivi",
    domains: ["Vendre", "Se faire connaître"],
    steps: [
      {
        id: "cible",
        title: "Ton client idéal",
        minutes: 10,
        hint: "Viser tout le monde, c’est ne toucher personne. Décris une personne précise que tu pourrais aller voir demain.",
        fields: [
          {
            id: "qui",
            label: "Qui il est",
            example: "Gérant d’un café indépendant, 30-45 ans",
          },
          {
            id: "ou-trouver",
            label: "Où tu le trouves",
            example: "Dans son café, le matin avant le rush ; sur Instagram",
          },
          {
            id: "declic",
            label: "Ce qui le fait acheter",
            example:
              "Voir que la boutique d’à côté a plus de clients grâce à ses photos",
            kind: "long",
          },
        ],
        uses: ["mkt-cible", "vente-besoin"],
      },
      {
        id: "message",
        title: "Ton message en 30 secondes",
        minutes: 10,
        hint: "Ce que tu fais, une preuve, et une petite proposition facile à accepter.",
        fields: [
          {
            id: "phrase",
            label: "Ce que tu fais, en une phrase",
            example:
              "Je fais des photos qui donnent envie d’entrer dans ton café",
          },
          {
            id: "preuve",
            label: "Ta preuve",
            example: "J’ai refait les photos de deux boutiques de la rue",
          },
          {
            id: "proposition",
            label: "Ta petite proposition",
            example: "Un essai de 30 minutes, offert",
          },
        ],
        uses: ["mkt-message", "vente-pitch"],
      },
      {
        id: "liste",
        title: "Tes 5 premiers prospects",
        minutes: 15,
        hint: "Des vrais noms, avec la prochaine action. Une liste sans action reste une liste.",
        fields: [1, 2, 3, 4, 5].map((i) => ({
          id: `prospect-${i}`,
          label: `Prospect ${i}`,
          example: [
            "Café Lumière — passer mardi matin",
            "Boulangerie Martin — appeler jeudi",
            "Fleuriste du marché — message Instagram",
            "Atelier vélo — y aller samedi",
            "Épicerie bio — recommandée par Léa",
          ][i - 1]!,
          optional: i > 3,
        })),
        uses: ["vente-process"],
      },
      {
        id: "approche",
        title: "Ton message d’approche",
        minutes: 15,
        hint: "Court, personnel, une seule question à la fin. Et la relance est prête avant même d’envoyer.",
        fields: [
          {
            id: "accroche",
            label: "Ton accroche",
            example: "Bonjour, je suis passé devant votre café ce matin…",
          },
          {
            id: "corps",
            label: "Ton message complet",
            example:
              "Je fais des photos pour les commerces du quartier. J’ai vu que vos photos en ligne datent un peu : je vous propose un essai de 30 minutes, offert. Mardi ou jeudi ?",
            kind: "long",
          },
          {
            id: "relance",
            label: "Ta relance, une semaine après",
            example:
              "Je me permets de revenir vers vous : l’essai tient toujours, mardi prochain ?",
            kind: "long",
          },
        ],
        uses: ["vente-pitch", "vente-objections"],
      },
      {
        id: "suivi",
        title: "Ton suivi de la semaine",
        minutes: 8,
        hint: "Ce qui se mesure s’améliore. Fixe un rythme de contacts et regarde ce qui répond.",
        fields: [
          {
            id: "contacts",
            label: "Contacts par semaine",
            example: "10",
            kind: "number",
          },
          {
            id: "reponse",
            label: "Ton taux de réponse espéré, en %",
            example: "20",
            kind: "number",
          },
          {
            id: "noter",
            label: "Ce que tu notes après chaque contact",
            example: "Date, réponse, prochaine étape",
          },
        ],
        compute: (n) => {
          const contacts = n("contacts");
          const rate = n("reponse");
          const perWeek =
            contacts === null || rate === null ? null : (contacts * rate) / 100;
          return [
            { label: "Réponses espérées par semaine", value: plain(perWeek) },
            {
              label: "Sur un mois",
              value: plain(perWeek === null ? null : perWeek * 4),
            },
          ];
        },
        uses: ["vente-process", "mkt-mesurer"],
      },
    ],
  },
];

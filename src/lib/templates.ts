/**
 * Idée 22 : la boîte à modèles. Un devis, une facture, un budget et un
 * prévisionnel à remplir dans l'appli, avec les calculs faits en direct, puis
 * à garder en PDF (impression) ou en Excel (vrai classeur, formules comprises).
 * Calcul pur, testé dans tests/templates.test.ts.
 */
import { parseNumber } from "./missions.ts";
import type { Cell, Sheet } from "./xlsx.ts";

export type FieldKind = "text" | "long" | "money" | "number" | "date" | "choice";
export interface TemplateField {
  id: string;
  label: string;
  kind: FieldKind;
  example: string;
  optional?: boolean;
  /** Pour « choice » : [valeur, libellé]. */
  options?: [string, string][];
  /** Demi-largeur dans le formulaire. */
  inline?: boolean;
}
export interface TemplateSection {
  title: string;
  fields: TemplateField[];
}
/** Lignes répétables (devis, facture) : clés « l0.designation », etc. */
export interface TemplateLines {
  title: string;
  max: number;
  columns: TemplateField[];
  examples: string[][];
}
/** Tableau fixe (prévisionnel) : clés « ca.1 », « ca.2 », « ca.3 ». */
export interface TemplateGrid {
  title: string;
  columns: string[];
  rows: { id: string; label: string; hint: string; examples: string[] }[];
}
export interface TemplateDef {
  id: string;
  title: string;
  /** Une phrase : à quoi il sert. */
  what: string;
  icon: string;
  /** Leçons qui l'expliquent (liens « Revoir la leçon »). */
  lessons: string[];
  sections: TemplateSection[];
  lines?: TemplateLines;
  grid?: TemplateGrid;
  /** Rappel affiché sous le document. */
  caution: string;
}

/** Un document prêt à afficher, imprimer ou exporter. */
export interface DocModel {
  heading: string;
  subtitle: string;
  meta: [string, string][];
  parties: { title: string; lines: string[] }[];
  table?: { head: string[]; rows: string[][]; numeric: boolean[]; strong?: number[] };
  totals: { label: string; value: string; strong?: boolean; tone?: "gain" | "loss" }[];
  notes: string[];
}

export type Values = Record<string, string>;

const VAT_OPTIONS: [string, string][] = [
  ["franchise", "Sans TVA (micro)"],
  ["20", "TVA 20 %"],
  ["10", "TVA 10 %"],
  ["5.5", "TVA 5,5 %"],
];

const SELLER: TemplateSection = {
  title: "Toi (qui vend)",
  fields: [
    { id: "vendeur.nom", label: "Nom ou entreprise", kind: "text", example: "Atelier Exemple" },
    { id: "vendeur.adresse", label: "Adresse", kind: "text", example: "12 rue Fictive, 75000 Paris" },
    { id: "vendeur.siren", label: "SIREN", kind: "text", example: "000 000 000", inline: true },
    { id: "vendeur.contact", label: "Courriel ou téléphone", kind: "text", example: "contact@exemple.fr", optional: true, inline: true },
  ],
};
const CLIENT: TemplateSection = {
  title: "Le client",
  fields: [
    { id: "client.nom", label: "Nom ou entreprise", kind: "text", example: "SARL Démo" },
    { id: "client.adresse", label: "Adresse", kind: "text", example: "3 avenue Modèle, 69000 Lyon" },
  ],
};
const LINES: TemplateLines = {
  title: "Ce que tu vends",
  max: 10,
  columns: [
    { id: "designation", label: "Désignation", kind: "text", example: "Refonte du site vitrine" },
    { id: "quantite", label: "Quantité", kind: "number", example: "1" },
    { id: "prix", label: "Prix unitaire HT", kind: "money", example: "1000" },
  ],
  examples: [
    ["Refonte du site vitrine", "1", "1000"],
    ["Formation à l’outil (heure)", "2", "100"],
  ],
};

export const TEMPLATES: TemplateDef[] = [
  {
    id: "devis",
    title: "Devis",
    what: "Proposer un prix avant de travailler, que le client signe « bon pour accord ».",
    icon: "document",
    lessons: ["ent-fixer-prix", "ent-facturer-declarer"],
    sections: [
      SELLER,
      CLIENT,
      {
        title: "Le devis",
        fields: [
          { id: "numero", label: "Numéro", kind: "text", example: "D-2026-001", inline: true },
          { id: "date", label: "Date", kind: "date", example: "2026-11-25", inline: true },
          { id: "validite", label: "Valable (jours)", kind: "number", example: "30", inline: true },
          { id: "tva", label: "TVA", kind: "choice", example: "franchise", options: VAT_OPTIONS, inline: true },
          { id: "objet", label: "Objet", kind: "text", example: "Site vitrine et formation", optional: true },
        ],
      },
    ],
    lines: LINES,
    caution:
      "Modèle d’apprentissage. Les mentions obligatoires dépendent de ton activité : vérifie sur entreprendre.service-public.gouv.fr.",
  },
  {
    id: "facture",
    title: "Facture",
    what: "Demander le paiement, avec les mentions obligatoires et la date limite.",
    icon: "invoice",
    lessons: ["ent-facturer-declarer"],
    sections: [
      SELLER,
      CLIENT,
      {
        title: "La facture",
        fields: [
          { id: "numero", label: "Numéro (suite sans trou)", kind: "text", example: "2026-0042", inline: true },
          { id: "date", label: "Date d’émission", kind: "date", example: "2026-11-25", inline: true },
          { id: "delai", label: "Paiement à (jours)", kind: "number", example: "30", inline: true },
          { id: "tva", label: "TVA", kind: "choice", example: "franchise", options: VAT_OPTIONS, inline: true },
          { id: "objet", label: "Nature de l’opération", kind: "text", example: "Prestation de services", optional: true },
        ],
      },
    ],
    lines: LINES,
    caution:
      "Modèle d’apprentissage. Depuis septembre 2026, les entreprises doivent pouvoir recevoir des factures électroniques ; l’émission suit le calendrier officiel. Vérifie ta situation sur entreprendre.service-public.gouv.fr.",
  },
  {
    id: "budget",
    title: "Budget du mois",
    what: "Voir où part l’argent, et ce qui reste une fois l’épargne mise de côté.",
    icon: "wallet",
    lessons: ["fp-budget", "fp-epargne-precaution"],
    sections: [
      {
        title: "Ce qui entre",
        fields: [
          { id: "revenu", label: "Salaire net (ou revenu)", kind: "money", example: "1800", inline: true },
          { id: "autres", label: "Autres revenus", kind: "money", example: "0", optional: true, inline: true },
        ],
      },
      {
        title: "Mettre de côté d’abord",
        fields: [
          { id: "epargne", label: "Épargne programmée", kind: "money", example: "150", inline: true },
        ],
      },
      {
        title: "Les dépenses fixes",
        fields: [
          { id: "logement", label: "Loyer et charges", kind: "money", example: "700", inline: true },
          { id: "energie", label: "Énergie, internet, téléphone", kind: "money", example: "150", inline: true },
          { id: "transports", label: "Transports", kind: "money", example: "120", inline: true },
          { id: "assurances", label: "Assurances", kind: "money", example: "60", inline: true },
          { id: "abonnements", label: "Abonnements", kind: "money", example: "40", optional: true, inline: true },
          { id: "credits", label: "Crédits", kind: "money", example: "0", optional: true, inline: true },
        ],
      },
      {
        title: "La vie courante",
        fields: [
          { id: "courses", label: "Courses", kind: "money", example: "300", inline: true },
          { id: "loisirs", label: "Loisirs et imprévus", kind: "money", example: "200", inline: true },
        ],
      },
    ],
    caution: "Exemple à adapter : les montants sont les tiens, rien n’est envoyé.",
  },
  {
    id: "previsionnel",
    title: "Prévisionnel sur 3 ans",
    what: "Vérifier, avant de se lancer, que l’activité peut payer ses charges et te payer.",
    icon: "chart-up",
    lessons: ["fin-previsionnel", "seuil-rentabilite"],
    sections: [
      {
        title: "Le projet",
        fields: [
          { id: "projet", label: "Nom du projet", kind: "text", example: "Atelier de réparation de vélos" },
        ],
      },
    ],
    grid: {
      title: "Les chiffres, année par année",
      columns: ["Année 1", "Année 2", "Année 3"],
      rows: [
        { id: "ca", label: "Chiffre d’affaires", hint: "Ce que tu vends sur l’année (HT).", examples: ["40000", "55000", "65000"] },
        { id: "achats", label: "Achats liés aux ventes", hint: "Pièces, marchandises : ils suivent les ventes.", examples: ["12000", "16000", "19000"] },
        { id: "fixes", label: "Charges fixes", hint: "Loyer, assurance, logiciel… même sans vente.", examples: ["9000", "9500", "10000"] },
        { id: "remuneration", label: "Ta rémunération", hint: "Ce que tu te verses sur l’année.", examples: ["15000", "22000", "27000"] },
      ],
    },
    caution:
      "Prévisionnel simplifié (sans impôts, cotisations ni investissements détaillés) : un banquier demandera aussi un plan de financement et de trésorerie.",
  },
];

export const findTemplate = (id: string) => TEMPLATES.find((t) => t.id === id);

/** Toutes les valeurs d'exemple, pour « Remplir avec un exemple ». */
export function exampleValues(def: TemplateDef): Values {
  const values: Values = {};
  for (const section of def.sections)
    for (const field of section.fields) values[field.id] = field.example;
  def.lines?.examples.forEach((row, i) =>
    def.lines!.columns.forEach((col, c) => {
      values[`l${i}.${col.id}`] = row[c] ?? "";
    }),
  );
  def.grid?.rows.forEach((row) =>
    row.examples.forEach((value, c) => {
      values[`${row.id}.${c + 1}`] = value;
    }),
  );
  return values;
}

const num = (values: Values, key: string) => parseNumber(values[key]) ?? 0;
const text = (values: Values, key: string) => values[key]?.trim() ?? "";

/** « 1 234,50 € » (deux décimales seulement si besoin). */
export function euros(value: number): string {
  const cents = Math.round(value * 100) / 100;
  return `${new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: Number.isInteger(cents) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents)} €`.replace(/[\u00a0\u202f]/g, " ");
}

const pct = (value: number) =>
  `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(value * 100)} %`;

/** Date ISO « 2026-11-25 » → « 25 novembre 2026 » ; illisible → texte brut. */
export function frenchDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const date = new Date(Date.UTC(+match[1]!, +match[2]! - 1, +match[3]!));
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Ajoute des jours à une date ISO (pour l'échéance, la fin de validité). */
export function addDays(iso: string, days: number): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match || !Number.isFinite(days)) return null;
  const date = new Date(Date.UTC(+match[1]!, +match[2]! - 1, +match[3]! + days));
  return date.toISOString().slice(0, 10);
}

/** Les lignes remplies (désignation, quantité, prix, total). */
export function filledLines(values: Values, max = 10) {
  const rows: { designation: string; quantite: number; prix: number; total: number }[] = [];
  for (let i = 0; i < max; i++) {
    const designation = text(values, `l${i}.designation`);
    const quantite = parseNumber(values[`l${i}.quantite`]);
    const prix = parseNumber(values[`l${i}.prix`]);
    if (!designation && quantite === null && prix === null) continue;
    const q = quantite ?? 1;
    rows.push({ designation, quantite: q, prix: prix ?? 0, total: q * (prix ?? 0) });
  }
  return rows;
}

/** Nombre de lignes affichées dans le formulaire (au moins une). */
export function lineCount(values: Values, max = 10): number {
  let last = 0;
  for (let i = 0; i < max; i++)
    if (Object.keys(values).some((k) => k.startsWith(`l${i}.`) && values[k]?.trim()))
      last = i + 1;
  return Math.max(1, last);
}

export function invoiceTotals(values: Values) {
  const ht = filledLines(values).reduce((sum, line) => sum + line.total, 0);
  const rate = values.tva && values.tva !== "franchise" ? Number(values.tva) / 100 : 0;
  const tva = Math.round(ht * rate * 100) / 100;
  return { ht, rate, tva, ttc: ht + tva, franchise: !values.tva || values.tva === "franchise" };
}

export function budgetTotals(values: Values) {
  const income = num(values, "revenu") + num(values, "autres");
  const saving = num(values, "epargne");
  const fixed = ["logement", "energie", "transports", "assurances", "abonnements", "credits"].reduce(
    (sum, key) => sum + num(values, key),
    0,
  );
  const daily = num(values, "courses") + num(values, "loisirs");
  return {
    income,
    saving,
    fixed,
    daily,
    left: income - saving - fixed - daily,
    savingRate: income > 0 ? saving / income : 0,
  };
}

export function forecastYears(values: Values) {
  return [1, 2, 3].map((y) => {
    const ca = num(values, `ca.${y}`);
    const achats = num(values, `achats.${y}`);
    const fixes = num(values, `fixes.${y}`);
    const remuneration = num(values, `remuneration.${y}`);
    const marge = ca - achats;
    const tauxMarge = ca > 0 ? marge / ca : 0;
    const resultat = marge - fixes - remuneration;
    const seuil = tauxMarge > 0 ? (fixes + remuneration) / tauxMarge : null;
    return { ca, achats, fixes, remuneration, marge, tauxMarge, resultat, seuil };
  });
}

/** Ce qui manque pour que le document soit sérieux (jamais bloquant). */
export function templateProblems(def: TemplateDef, values: Values): string[] {
  const missing = (keys: [string, string][]) =>
    keys.filter(([key]) => !text(values, key)).map(([, label]) => label);
  if (def.id === "devis" || def.id === "facture") {
    const list = missing([
      ["vendeur.nom", "ton nom"],
      ["vendeur.adresse", "ton adresse"],
      ["vendeur.siren", "ton SIREN"],
      ["client.nom", "le nom du client"],
      ["numero", "le numéro"],
      ["date", "la date"],
    ]);
    const problems = list.length ? [`Il manque ${list.join(", ")}.`] : [];
    if (!filledLines(values).length) problems.push("Ajoute au moins une ligne.");
    if (filledLines(values).some((l) => !l.designation))
      problems.push("Chaque ligne doit dire ce qui est vendu.");
    return problems;
  }
  if (def.id === "budget") {
    const t = budgetTotals(values);
    if (!t.income) return ["Indique ce qui entre chaque mois."];
    return t.left < 0
      ? [`Il manque ${euros(-t.left)} chaque mois : baisse une dépense ou l’épargne.`]
      : [];
  }
  if (def.id === "previsionnel") {
    const years = forecastYears(values);
    if (!years[0]!.ca) return ["Indique au moins le chiffre d’affaires de l’année 1."];
    return years
      .map((y, i) =>
        y.ca && y.resultat < 0
          ? `Année ${i + 1} : il manque ${euros(-y.resultat)} pour tout payer.`
          : "",
      )
      .filter(Boolean);
  }
  return [];
}

const dash = (value: string) => value || "—";

/** Le document tel qu'il s'affiche, s'imprime et s'exporte. */
export function buildDoc(def: TemplateDef, values: Values): DocModel {
  if (def.id === "devis" || def.id === "facture") {
    const t = invoiceTotals(values);
    const lines = filledLines(values);
    const date = text(values, "date");
    const isQuote = def.id === "devis";
    const days = parseNumber(values[isQuote ? "validite" : "delai"]);
    const until = date && days !== null ? addDays(date, days) : null;
    const meta: [string, string][] = [
      [isQuote ? "Devis n°" : "Facture n°", dash(text(values, "numero"))],
      ["Date", date ? frenchDate(date) : "—"],
    ];
    if (until) meta.push([isQuote ? "Valable jusqu’au" : "À payer avant le", frenchDate(until)]);
    if (text(values, "objet")) meta.push([isQuote ? "Objet" : "Nature", text(values, "objet")]);
    const notes = isQuote
      ? [
          days !== null ? `Devis valable ${days} jours.` : "Durée de validité à préciser.",
          "Bon pour accord : date, signature et mention « Bon pour accord » du client.",
        ]
      : [
          days !== null
            ? `Paiement à ${days} jours${until ? `, au plus tard le ${frenchDate(until)}` : ""}. Escompte pour paiement anticipé : néant.`
            : "Date de paiement à préciser.",
          "En cas de retard : pénalités au taux de trois fois le taux d’intérêt légal, et indemnité forfaitaire de 40 € pour frais de recouvrement (clients professionnels).",
        ];
    if (t.franchise) notes.unshift("TVA non applicable, article 293 B du CGI.");
    return {
      heading: isQuote ? "Devis" : "Facture",
      subtitle: text(values, "vendeur.nom"),
      meta,
      parties: [
        {
          title: isQuote ? "Prestataire" : "Vendeur",
          lines: [
            dash(text(values, "vendeur.nom")),
            text(values, "vendeur.adresse"),
            text(values, "vendeur.siren") ? `SIREN ${text(values, "vendeur.siren")}` : "",
            text(values, "vendeur.contact"),
          ].filter(Boolean),
        },
        {
          title: "Client",
          lines: [dash(text(values, "client.nom")), text(values, "client.adresse")].filter(Boolean),
        },
      ],
      table: {
        head: ["Désignation", "Qté", "Prix unitaire HT", "Total HT"],
        rows: lines.map((l) => [
          dash(l.designation),
          new Intl.NumberFormat("fr-FR").format(l.quantite),
          euros(l.prix),
          euros(l.total),
        ]),
        numeric: [false, true, true, true],
      },
      totals: t.franchise
        ? [{ label: "Total à payer", value: euros(t.ht), strong: true }]
        : [
            { label: "Total HT", value: euros(t.ht) },
            { label: `TVA ${pct(t.rate)}`, value: euros(t.tva) },
            { label: "Total TTC", value: euros(t.ttc), strong: true },
          ],
      notes,
    };
  }
  if (def.id === "budget") {
    const t = budgetTotals(values);
    const fieldsOf = (index: number) => def.sections[index]!.fields;
    const rows: string[][] = [];
    const strong: number[] = [];
    const block = (title: string, total: number, fields: TemplateField[]) => {
      strong.push(rows.length);
      rows.push([title, euros(total)]);
      for (const f of fields)
        if (num(values, f.id) > 0) rows.push([f.label, euros(num(values, f.id))]);
    };
    block("Revenus du mois", t.income, fieldsOf(0));
    strong.push(rows.length);
    rows.push(["Épargne mise de côté", euros(t.saving)]);
    block("Dépenses fixes", t.fixed, fieldsOf(2));
    block("Vie courante", t.daily, fieldsOf(3));
    return {
      heading: "Budget du mois",
      subtitle: "Se payer en premier",
      meta: [],
      parties: [],
      table: { head: ["Poste", "Montant"], rows, numeric: [false, true], strong },
      totals: [
        { label: "Épargne", value: `${euros(t.saving)} · ${pct(t.savingRate)} des revenus` },
        {
          label: "Reste à la fin du mois",
          value: euros(t.left),
          strong: true,
          tone: t.left < 0 ? "loss" : "gain",
        },
      ],
      notes: [
        "Reste = revenus − épargne − dépenses fixes − vie courante.",
        "Les dépenses de l’année (cadeaux, réparations) se lissent : divise par 12 et ajoute-les ici.",
      ],
    };
  }
  // prévisionnel
  const years = forecastYears(values);
  const line = (label: string, pick: (y: (typeof years)[number]) => string) => [
    label,
    ...years.map(pick),
  ];
  return {
    heading: "Prévisionnel sur 3 ans",
    subtitle: text(values, "projet"),
    meta: [],
    parties: [],
    table: {
      head: ["", "Année 1", "Année 2", "Année 3"],
      rows: [
        line("Chiffre d’affaires", (y) => euros(y.ca)),
        line("− Achats liés aux ventes", (y) => euros(y.achats)),
        line("= Marge", (y) => euros(y.marge)),
        line("Taux de marge", (y) => (y.ca ? pct(y.tauxMarge) : "—")),
        line("− Charges fixes", (y) => euros(y.fixes)),
        line("− Ta rémunération", (y) => euros(y.remuneration)),
        line("= Résultat", (y) => euros(y.resultat)),
        line("Seuil de rentabilité", (y) => (y.seuil === null ? "—" : euros(y.seuil))),
      ],
      numeric: [false, true, true, true],
      strong: [2, 6],
    },
    totals: [],
    notes: [
      "Seuil de rentabilité = (charges fixes + rémunération) ÷ taux de marge : le chiffre d’affaires à atteindre pour tout payer.",
    ],
  };
}

/** Le même document en classeur Excel, avec de vraies formules. */
export function buildSheet(def: TemplateDef, values: Values): Sheet {
  const money = (value: number, formula?: string): Cell => ({ value, style: "money", formula });
  const bold = (value: string): Cell => ({ value, style: "bold" });
  if (def.id === "devis" || def.id === "facture") {
    const doc = buildDoc(def, values);
    const t = invoiceTotals(values);
    const lines = filledLines(values);
    const rows: Cell[][] = [[bold(doc.heading)], []];
    for (const [label, value] of doc.meta) rows.push([label, value]);
    rows.push([]);
    for (const party of doc.parties) rows.push([bold(party.title), party.lines.join(" · ")]);
    rows.push([]);
    rows.push([bold("Désignation"), bold("Quantité"), bold("Prix unitaire HT"), bold("Total HT")]);
    const first = rows.length + 1;
    for (const l of lines) {
      const r = rows.length + 1;
      rows.push([l.designation, l.quantite, money(l.prix), money(l.total, `B${r}*C${r}`)]);
    }
    const last = rows.length;
    rows.push([]);
    const htRow = rows.length + 1;
    const sum = last >= first ? `SUM(D${first}:D${last})` : "0";
    rows.push(["", "", bold(t.franchise ? "Total à payer" : "Total HT"), { value: t.ht, style: "moneyBold", formula: sum }]);
    if (!t.franchise) {
      rows.push(["", "", `TVA ${pct(t.rate)}`, money(t.tva, `ROUND(D${htRow}*${t.rate},2)`)]);
      rows.push(["", "", bold("Total TTC"), { value: t.ttc, style: "moneyBold", formula: `D${htRow}+D${htRow + 1}` }]);
    }
    rows.push([]);
    for (const note of doc.notes) rows.push([note]);
    return { name: doc.heading, widths: [38, 12, 20, 16], rows };
  }
  if (def.id === "budget") {
    const t = budgetTotals(values);
    const rows: Cell[][] = [[bold("Budget du mois")], [], [bold("Poste"), bold("Montant")]];
    const block = (title: string, ids: string[]) => {
      rows.push([bold(title)]);
      const start = rows.length + 1;
      for (const id of ids) {
        const field = def.sections.flatMap((s) => s.fields).find((f) => f.id === id)!;
        rows.push([field.label, money(num(values, id))]);
      }
      return `SUM(B${start}:B${rows.length})`;
    };
    const income = block("Ce qui entre", ["revenu", "autres"]);
    const saving = block("Épargne", ["epargne"]);
    const fixed = block("Dépenses fixes", ["logement", "energie", "transports", "assurances", "abonnements", "credits"]);
    const daily = block("Vie courante", ["courses", "loisirs"]);
    rows.push([]);
    rows.push([bold("Reste à la fin du mois"), { value: t.left, style: "moneyBold", formula: `${income}-${saving}-${fixed}-${daily}` }]);
    rows.push(["Part épargnée", { value: t.savingRate, style: "percent", formula: `IF(${income}=0,0,${saving}/(${income}))` }]);
    return { name: "Budget", widths: [34, 16], rows };
  }
  const years = forecastYears(values);
  const rows: Cell[][] = [
    [bold("Prévisionnel sur 3 ans"), text(values, "projet")],
    [],
    ["", bold("Année 1"), bold("Année 2"), bold("Année 3")],
  ];
  const cols = ["B", "C", "D"];
  const keys: [string, keyof (typeof years)[number]][] = [
    ["Chiffre d’affaires", "ca"],
    ["Achats liés aux ventes", "achats"],
    ["Charges fixes", "fixes"],
    ["Ta rémunération", "remuneration"],
  ];
  for (const [label, key] of keys) rows.push([label, ...years.map((y) => money(y[key] as number))]);
  // Lignes 4 à 7 : CA, achats, fixes, rémunération.
  rows.push(["Marge", ...years.map((y, i) => money(y.marge, `${cols[i]}4-${cols[i]}5`))]);
  rows.push(["Taux de marge", ...years.map((y, i) => ({ value: y.tauxMarge, style: "percent" as const, formula: `IF(${cols[i]}4=0,0,${cols[i]}8/${cols[i]}4)` }))]);
  rows.push(["Résultat", ...years.map((y, i) => ({ value: y.resultat, style: "moneyBold" as const, formula: `${cols[i]}8-${cols[i]}6-${cols[i]}7` }))]);
  rows.push(["Seuil de rentabilité", ...years.map((y, i) => ({ value: y.seuil ?? 0, style: "money" as const, formula: `IF(${cols[i]}9<=0,0,(${cols[i]}6+${cols[i]}7)/${cols[i]}9)` }))]);
  rows.push([]);
  rows.push(["Seuil = (charges fixes + rémunération) ÷ taux de marge."]);
  return { name: "Prévisionnel", widths: [28, 16, 16, 16], rows };
}

/** Nom de fichier propre : « boost-facture-2026-0042 ». */
export function fileStem(def: TemplateDef, values: Values): string {
  const tag = (text(values, "numero") || text(values, "projet") || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 40);
  return `boost-${def.id}${tag ? `-${tag}` : ""}`;
}

/** Les modèles d'une leçon (lien depuis la leçon). */
export const templatesForLesson = (lessonId: string) =>
  TEMPLATES.filter((t) => t.lessons.includes(lessonId));

/** A deterministic six-month teaching model, independent of browser and storage. */
export const SIMULATION_VERSION = "1.0.0" as const;
export const SIMULATION_MONTHS = 6;

export interface SimulationBase {
  price: number;
  unitCost: number;
  units: number;
  fixedCosts: number;
  openingCash: number;
  collectionDelayMonths: number;
}
export interface SimulationChange {
  priceChangePct: number;
  volumeChangePct: number;
  unitCostChangePct: number;
  additionalFixedCosts: number;
  collectionDelayMonths: number;
}
export interface SimulationInput {
  baseline: SimulationBase;
  change: SimulationChange;
}
export interface SimulationMonth {
  month: number;
  revenue: number;
  variableCosts: number;
  fixedCosts: number;
  profit: number;
  collections: number;
  closingCash: number;
  receivables: number;
}
export interface SimulationProjection {
  months: SimulationMonth[];
  totalRevenue: number;
  totalProfit: number;
  totalCollections: number;
  endingReceivables: number;
  closingCash: number;
  minimumCash: number;
  financingNeed: number;
  firstNegativeMonth: number | null;
}
export interface SimulationComparison {
  baseline: SimulationProjection;
  scenario: SimulationProjection;
  scenarioBase: SimulationBase;
}
export interface SimulationSnapshot {
  id: string;
  title: string;
  createdAt: string;
  modelVersion: typeof SIMULATION_VERSION;
  input: SimulationInput;
}

export const defaultSimulationInput: SimulationInput = Object.freeze({
  baseline: Object.freeze({
    price: 100,
    unitCost: 40,
    units: 120,
    fixedCosts: 5_000,
    openingCash: 12_000,
    collectionDelayMonths: 1,
  }),
  change: Object.freeze({
    priceChangePct: 0,
    volumeChangePct: 0,
    unitCostChangePct: 0,
    additionalFixedCosts: 0,
    collectionDelayMonths: 3,
  }),
});

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function bounded(
  value: unknown,
  minimum: number,
  maximum: number,
  label: string,
  integer = false,
): asserts value is number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < minimum ||
    value > maximum ||
    (integer && !Number.isInteger(value))
  )
    throw new RangeError(
      `${label} : indiquez un nombre ${integer ? "entier " : ""}entre ${minimum} et ${maximum}.`,
    );
}

/** Copies only the model's actual assumptions, never supplied cached results. */
function validatedInput(value: unknown): SimulationInput {
  if (!record(value) || !record(value.baseline) || !record(value.change))
    throw new TypeError("Les hypothèses de simulation sont incomplètes.");
  const base = value.baseline;
  const change = value.change;
  bounded(base.price, 0, 1_000_000, "Prix unitaire");
  if (base.price === 0)
    throw new RangeError("Le prix unitaire doit être strictement positif.");
  bounded(base.unitCost, 0, 1_000_000, "Coût variable unitaire");
  bounded(base.units, 0, 1_000_000, "Volume mensuel moyen");
  bounded(base.fixedCosts, 0, 1_000_000_000, "Charges fixes mensuelles");
  bounded(base.openingCash, 0, 1_000_000_000_000, "Trésorerie initiale");
  bounded(base.collectionDelayMonths, 0, 3, "Délai client de référence", true);
  bounded(change.priceChangePct, -90, 200, "Variation du prix (%)");
  bounded(change.volumeChangePct, -100, 200, "Variation du volume (%)");
  bounded(
    change.unitCostChangePct,
    -100,
    200,
    "Variation du coût variable (%)",
  );
  bounded(
    change.additionalFixedCosts,
    0,
    1_000_000_000,
    "Charges fixes supplémentaires",
  );
  bounded(change.collectionDelayMonths, 0, 3, "Délai client du scénario", true);
  return {
    baseline: {
      price: base.price,
      unitCost: base.unitCost,
      units: base.units,
      fixedCosts: base.fixedCosts,
      openingCash: base.openingCash,
      collectionDelayMonths: base.collectionDelayMonths,
    },
    change: {
      priceChangePct: change.priceChangePct,
      volumeChangePct: change.volumeChangePct,
      unitCostChangePct: change.unitCostChangePct,
      additionalFixedCosts: change.additionalFixedCosts,
      collectionDelayMonths: change.collectionDelayMonths,
    },
  };
}

function safe(value: number): number {
  if (!Number.isSafeInteger(value))
    throw new RangeError("Ces hypothèses dépassent la précision du modèle.");
  return value;
}

interface Decimal {
  coefficient: bigint;
  scale: number;
}

/** Interpret each supplied Number's decimal spelling before doing arithmetic. */
function decimal(value: number): Decimal {
  const [mantissa, exponent = "0"] = value.toString().split("e");
  const [whole, fraction = ""] = mantissa!.split(".");
  const coefficient = BigInt(`${whole}${fraction}`);
  const scale = fraction.length - Number(exponent);
  return scale < 0
    ? { coefficient: coefficient * 10n ** BigInt(-scale), scale: 0 }
    : { coefficient, scale };
}

function plus(left: Decimal, right: Decimal): Decimal {
  const scale = Math.max(left.scale, right.scale);
  return {
    coefficient:
      left.coefficient * 10n ** BigInt(scale - left.scale) +
      right.coefficient * 10n ** BigInt(scale - right.scale),
    scale,
  };
}

function times(left: Decimal, right: Decimal): Decimal {
  return {
    coefficient: left.coefficient * right.coefficient,
    scale: left.scale + right.scale,
  };
}

function changed(value: number, percentage: number): Decimal {
  const factor = plus(decimal(100), decimal(percentage));
  return times(decimal(value), {
    coefficient: factor.coefficient,
    scale: factor.scale + 2,
  });
}

/** Round nonnegative monetary flows half-up only after all decimal products. */
function cents(value: Decimal): number {
  if (value.coefficient < 0n)
    throw new RangeError(
      "Un flux monétaire du modèle ne peut pas être négatif.",
    );
  if (value.scale <= 2)
    return safe(Number(value.coefficient * 10n ** BigInt(2 - value.scale)));
  const divisor = 10n ** BigInt(value.scale - 2);
  const rounded =
    value.coefficient / divisor +
    ((value.coefficient % divisor) * 2n >= divisor ? 1n : 0n);
  return safe(Number(rounded));
}

const asNumber = (value: Decimal) =>
  Number(`${value.coefficient}e-${value.scale}`);

function quantities(base: SimulationBase, change?: SimulationChange) {
  return {
    price: changed(base.price, change?.priceChangePct ?? 0),
    unitCost: changed(base.unitCost, change?.unitCostChangePct ?? 0),
    units: changed(base.units, change?.volumeChangePct ?? 0),
    fixedCosts: plus(
      decimal(base.fixedCosts),
      decimal(change?.additionalFixedCosts ?? 0),
    ),
    openingCash: decimal(base.openingCash),
    collectionDelayMonths:
      change?.collectionDelayMonths ?? base.collectionDelayMonths,
  };
}

function project(base: ReturnType<typeof quantities>): SimulationProjection {
  const revenue = cents(times(base.price, base.units));
  const variableCosts = cents(times(base.unitCost, base.units));
  const fixedCosts = cents(base.fixedCosts);
  const expenses = safe(variableCosts + fixedCosts);
  const profit = safe(revenue - expenses);
  const openingCash = cents(base.openingCash);
  let cash = openingCash;
  let minimumCash = openingCash;
  let totalRevenue = 0;
  let totalProfit = 0;
  let totalCollections = 0;
  let receivables = 0;
  let firstNegativeMonth: number | null = null;
  const months: SimulationMonth[] = [];
  for (let month = 1; month <= SIMULATION_MONTHS; month += 1) {
    // No sales existed before M1. Each complete invoice is paid after n months.
    const collections = month > base.collectionDelayMonths ? revenue : 0;
    totalRevenue = safe(totalRevenue + revenue);
    totalProfit = safe(totalProfit + profit);
    totalCollections = safe(totalCollections + collections);
    receivables = safe(receivables + revenue - collections);
    cash = safe(cash + collections - expenses);
    minimumCash = Math.min(minimumCash, cash);
    if (cash < 0 && firstNegativeMonth === null) firstNegativeMonth = month;
    // A negative balance is left visible; the model does not inject financing.
    months.push({
      month,
      revenue: revenue / 100,
      variableCosts: variableCosts / 100,
      fixedCosts: fixedCosts / 100,
      profit: profit / 100,
      collections: collections / 100,
      closingCash: cash / 100,
      receivables: receivables / 100,
    });
  }
  return {
    months,
    totalRevenue: totalRevenue / 100,
    totalProfit: totalProfit / 100,
    totalCollections: totalCollections / 100,
    endingReceivables: receivables / 100,
    closingCash: cash / 100,
    minimumCash: minimumCash / 100,
    financingNeed: Math.max(0, -minimumCash) / 100,
    firstNegativeMonth,
  };
}

export function calculateSimulation(
  input: SimulationInput,
): SimulationComparison {
  const { baseline, change } = validatedInput(input);
  const scenarioQuantities = quantities(baseline, change);
  const scenarioBase: SimulationBase = {
    price: asNumber(scenarioQuantities.price),
    unitCost: asNumber(scenarioQuantities.unitCost),
    units: asNumber(scenarioQuantities.units),
    fixedCosts: asNumber(scenarioQuantities.fixedCosts),
    openingCash: baseline.openingCash,
    collectionDelayMonths: change.collectionDelayMonths,
  };
  return {
    baseline: project(quantities(baseline)),
    scenario: project(scenarioQuantities),
    scenarioBase,
  };
}

function text(value: unknown, maximum: number): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maximum
  );
}

function canonicalInstant(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const time = Date.parse(value);
  return Number.isFinite(time) && new Date(time).toISOString() === value;
}

export function isSimulationSnapshot(
  value: unknown,
): value is SimulationSnapshot {
  if (
    !record(value) ||
    !text(value.id, 160) ||
    !text(value.title, 140) ||
    !canonicalInstant(value.createdAt) ||
    value.modelVersion !== SIMULATION_VERSION
  )
    return false;
  try {
    calculateSimulation(value.input as SimulationInput);
    return true;
  } catch {
    return false;
  }
}

export function createSimulationSnapshot(
  input: SimulationInput,
  title: string,
  id: string,
  at: Date,
): SimulationSnapshot {
  if (!(at instanceof Date) || !Number.isFinite(at.getTime()))
    throw new RangeError("La date de la simulation est invalide.");
  if (typeof title !== "string" || typeof id !== "string")
    throw new TypeError("Le titre et l’identifiant de simulation sont requis.");
  const snapshot: SimulationSnapshot = {
    id: id.trim(),
    title: title.trim(),
    createdAt: at.toISOString(),
    modelVersion: SIMULATION_VERSION,
    input: validatedInput(input),
  };
  if (!isSimulationSnapshot(snapshot))
    throw new Error("Le titre ou l’identifiant de simulation est invalide.");
  return snapshot;
}

const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const number = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 4 });
const signed = (value: number) =>
  `${value >= 0 ? "+" : ""}${number.format(value)}`;
const markdownText = (value: string) =>
  value
    .trim()
    .replace(/[\r\n]+/g, " ")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/[\\`*_[\]#|]/g, "\\$&");

export function simulationMarkdown(
  input: SimulationInput,
  title: string,
): string {
  if (!text(title, 140))
    throw new Error(
      "Donnez un titre de 140 caractères maximum à la simulation.",
    );
  const validated = validatedInput(input);
  const comparison = calculateSimulation(validated);
  const { baseline, change } = validated;
  const assumptions = [
    ["Prix unitaire HT", money.format(baseline.price)],
    ["Coût variable unitaire HT", money.format(baseline.unitCost)],
    ["Volume mensuel moyen", number.format(baseline.units)],
    ["Charges fixes mensuelles", money.format(baseline.fixedCosts)],
    ["Trésorerie initiale", money.format(baseline.openingCash)],
    ["Délai client de référence", `${baseline.collectionDelayMonths} mois`],
  ];
  const lines = [
    `# ${markdownText(title)}`,
    "",
    `Simulation fictive · modèle ${SIMULATION_VERSION} · ${SIMULATION_MONTHS} mois`,
    "",
    "Ce calcul est un exercice pédagogique, pas une observation terrain ni une prévision garantie.",
    "",
    "## Hypothèses de référence",
    "",
    "| Hypothèse | Valeur |",
    "| --- | ---: |",
    ...assumptions.map(([label, value]) => `| ${label} | ${value} |`),
    "",
    "## Changements appliqués dès le mois 1",
    "",
    `- Prix : ${signed(change.priceChangePct)} %.`,
    `- Volume mensuel moyen : ${signed(change.volumeChangePct)} %.`,
    `- Coût variable unitaire : ${signed(change.unitCostChangePct)} %.`,
    `- Charges fixes supplémentaires : ${money.format(change.additionalFixedCosts)} par mois.`,
    `- Délai client du scénario : ${change.collectionDelayMonths} mois entiers.`,
    "",
    "## Hypothèses exactes à reproduire",
    "",
    "Les tableaux sont formatés pour la lecture. Ces valeurs numériques exactes permettent de reproduire les calculs, y compris les hypothèses avec plus de deux décimales.",
    "",
    "```json",
    JSON.stringify(validated, null, 2),
    "```",
    "",
    "## Résultats comparés",
    "",
    "| Indicateur sur six mois | Référence | Scénario |",
    "| --- | ---: | ---: |",
  ];
  for (const [label, key] of [
    ["Chiffre d’affaires", "totalRevenue"],
    ["Résultat simplifié cumulé", "totalProfit"],
    ["Encaissements", "totalCollections"],
    ["Créances finales", "endingReceivables"],
    ["Trésorerie finale", "closingCash"],
    ["Trésorerie minimale (ouverture et fins de mois)", "minimumCash"],
    ["Besoin de financement aux fins de mois", "financingNeed"],
  ] as const)
    lines.push(
      `| ${label} | ${money.format(comparison.baseline[key])} | ${money.format(comparison.scenario[key])} |`,
    );
  for (const [label, projection] of [
    ["Référence", comparison.baseline],
    ["Scénario", comparison.scenario],
  ] as const) {
    lines.push(
      "",
      `## ${label} — détail mensuel`,
      "",
      "| Mois | Ventes HT | Coûts variables | Charges fixes | Résultat | Encaissements | Trésorerie finale | Créances |",
      "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
      ...projection.months.map(
        (month) =>
          `| M${month.month} | ${money.format(month.revenue)} | ${money.format(month.variableCosts)} | ${money.format(month.fixedCosts)} | ${money.format(month.profit)} | ${money.format(month.collections)} | ${money.format(month.closingCash)} | ${money.format(month.receivables)} |`,
      ),
    );
  }
  lines.push(
    "",
    "## Comment le modèle calcule",
    "",
    "- Ventes mensuelles = prix × volume ; les deux restent constants pendant les six mois.",
    "- Résultat simplifié = ventes − coûts variables − charges fixes.",
    "- Encaissements du mois = ventes du mois situé n mois plus tôt, où n est le délai client.",
    "- Trésorerie finale = trésorerie initiale + résultat cumulé − créances finales.",
    "- Le besoin de financement est l’opposé du solde minimal négatif, mesuré à l’ouverture et aux fins de mois. Aucun financement n’est automatiquement ajouté.",
    "",
    "## Hypothèses et limites",
    "",
    "L’activité commence en M1, sans créance antérieure. Les charges variables et fixes sont payées le mois de la vente. Chaque facture est encaissée intégralement après un délai de zéro à trois mois entiers. La trésorerie initiale et les montants mensuels sont arrondis au centime, à la moitié supérieure, avant accumulation. Les produits et variations sont calculés en décimal avant cet arrondi.",
    "",
    "Aucun effet de prix sur la demande n’est inventé : le volume est une hypothèse indépendante. Le modèle ne couvre ni TVA, impôts, stocks, investissements, emprunts, intérêts, impayés, capacité ni mouvements à l’intérieur du mois. Un solde négatif indique un besoin théorique de financement, pas une probabilité de faillite ni une autorisation de continuer sans fonds.",
    "",
  );
  return lines.join("\n");
}

import test from "node:test";
import assert from "node:assert/strict";
import {
  SIMULATION_MONTHS,
  SIMULATION_VERSION,
  calculateSimulation,
  createSimulationSnapshot,
  defaultSimulationInput,
  isSimulationSnapshot,
  simulationMarkdown,
  type SimulationInput,
} from "../src/lib/simulation.ts";

const input = (): SimulationInput => structuredClone(defaultSimulationInput);
const createdAt = new Date("2026-11-02T10:00:00.000Z");

test("the default profitable business runs out of cash when collections take three months", () => {
  const comparison = calculateSimulation(input());
  assert.equal(SIMULATION_MONTHS, 6);
  assert.equal(comparison.baseline.totalRevenue, 72_000);
  assert.equal(comparison.baseline.totalProfit, 13_200);
  assert.equal(comparison.baseline.closingCash, 13_200);
  assert.equal(comparison.baseline.financingNeed, 0);
  assert.equal(comparison.baseline.firstNegativeMonth, null);
  assert.equal(comparison.scenario.totalProfit, 13_200);
  assert.deepEqual(
    comparison.scenario.months.map((month) => month.closingCash),
    [2_200, -7_600, -17_400, -15_200, -13_000, -10_800],
  );
  assert.equal(comparison.scenario.financingNeed, 17_400);
  assert.equal(comparison.scenario.minimumCash, -17_400);
  assert.equal(comparison.scenario.firstNegativeMonth, 2);
  assert.equal(comparison.scenario.endingReceivables, 36_000);
});

test("cash payment records all sales immediately and leaves no receivables", () => {
  const assumptions = input();
  assumptions.baseline.collectionDelayMonths = 0;
  assumptions.change.collectionDelayMonths = 0;
  const comparison = calculateSimulation(assumptions);
  assert.deepEqual(comparison.scenario, comparison.baseline);
  assert.deepEqual(
    comparison.baseline.months.map((month) => month.collections),
    [12_000, 12_000, 12_000, 12_000, 12_000, 12_000],
  );
  assert.equal(comparison.baseline.totalCollections, 72_000);
  assert.equal(comparison.baseline.endingReceivables, 0);
  assert.equal(comparison.baseline.closingCash, 25_200);
  assert.equal(comparison.baseline.minimumCash, 12_000);
});

test("a one-month lag starts without imaginary pre-M1 invoices", () => {
  const projection = calculateSimulation(input()).baseline;
  assert.equal(projection.months[0]!.collections, 0);
  assert.equal(projection.months[0]!.receivables, 12_000);
  assert.equal(projection.months[0]!.closingCash, 2_200);
  assert.equal(projection.months[1]!.collections, 12_000);
  assert.equal(projection.totalCollections, 60_000);
  assert.equal(projection.endingReceivables, 12_000);
});

test("each allowed lag changes cash timing without changing invoiced profit", () => {
  for (const delay of [0, 1, 2, 3]) {
    const assumptions = input();
    assumptions.change.collectionDelayMonths = delay;
    const scenario = calculateSimulation(assumptions).scenario;
    assert.equal(scenario.totalProfit, 13_200);
    assert.equal(scenario.totalCollections, (6 - delay) * 12_000);
    assert.equal(scenario.endingReceivables, delay * 12_000);
    assert.equal(
      scenario.closingCash,
      12_000 + scenario.totalProfit - scenario.endingReceivables,
    );
  }
});

test("losing forty percent of sales does not invent compensation in price or demand", () => {
  const assumptions = input();
  assumptions.change.volumeChangePct = -40;
  assumptions.change.collectionDelayMonths = 0;
  const comparison = calculateSimulation(assumptions);
  assert.equal(comparison.scenarioBase.units, 72);
  assert.equal(comparison.scenarioBase.price, 100);
  assert.equal(comparison.scenario.totalRevenue, 43_200);
  assert.equal(comparison.scenario.totalProfit, -4_080);
  assert.equal(comparison.scenario.closingCash, 7_920);
  assert.equal(comparison.baseline.totalRevenue, 72_000);
});

test("price, supplier cost and additional fixed charges have explicit separate effects", () => {
  const assumptions = input();
  assumptions.change = {
    priceChangePct: 15,
    volumeChangePct: 0,
    unitCostChangePct: 25,
    additionalFixedCosts: 2_000,
    collectionDelayMonths: 0,
  };
  const comparison = calculateSimulation(assumptions);
  assert.ok(Math.abs(comparison.scenarioBase.price - 115) < 1e-10);
  assert.equal(comparison.scenarioBase.unitCost, 50);
  assert.equal(comparison.scenarioBase.fixedCosts, 7_000);
  assert.equal(comparison.scenarioBase.units, 120);
  assert.equal(comparison.scenario.months[0]!.revenue, 13_800);
  assert.equal(comparison.scenario.months[0]!.variableCosts, 6_000);
  assert.equal(comparison.scenario.months[0]!.profit, 800);
  assert.equal(comparison.scenario.totalProfit, 4_800);
});

test("zero sales keep fixed costs visible and do not collect imaginary invoices", () => {
  const assumptions = input();
  assumptions.change.volumeChangePct = -100;
  const scenario = calculateSimulation(assumptions).scenario;
  assert.equal(scenario.totalRevenue, 0);
  assert.equal(scenario.totalCollections, 0);
  assert.equal(scenario.endingReceivables, 0);
  assert.equal(scenario.totalProfit, -30_000);
  assert.equal(scenario.closingCash, -18_000);
  assert.equal(scenario.financingNeed, 18_000);
  assert.equal(scenario.firstNegativeMonth, 3);
});

test("a negative contribution produces losses rather than a success score", () => {
  const assumptions = input();
  assumptions.baseline.unitCost = 140;
  assumptions.change.collectionDelayMonths = 0;
  const scenario = calculateSimulation(assumptions).scenario;
  assert.equal(scenario.totalProfit, -58_800);
  assert.equal(scenario.closingCash, -46_800);
  assert.equal(scenario.financingNeed, 46_800);
  assert.equal(scenario.firstNegativeMonth, 2);
});

test("zero cash is not labelled negative and opening cash participates in the minimum", () => {
  const assumptions = input();
  assumptions.baseline.openingCash = 0;
  assumptions.baseline.fixedCosts = 0;
  assumptions.baseline.unitCost = 0;
  assumptions.baseline.collectionDelayMonths = 0;
  assumptions.change.collectionDelayMonths = 0;
  const scenario = calculateSimulation(assumptions).scenario;
  assert.equal(scenario.minimumCash, 0);
  assert.equal(scenario.financingNeed, 0);
  assert.equal(scenario.firstNegativeMonth, null);
  const exactZero = input();
  exactZero.baseline.openingCash = 9_800;
  assert.equal(
    calculateSimulation(exactZero).scenario.months[0]!.closingCash,
    0,
  );
  assert.equal(calculateSimulation(exactZero).scenario.firstNegativeMonth, 2);
});

test("monthly amounts round to cents before accumulating profit, cash and receivables", () => {
  const assumptions = input();
  assumptions.baseline = {
    price: 1.005,
    unitCost: 0.335,
    units: 1,
    fixedCosts: 0.335,
    openingCash: 10.005,
    collectionDelayMonths: 1,
  };
  assumptions.change.collectionDelayMonths = 1;
  const projection = calculateSimulation(assumptions).baseline;
  assert.equal(projection.months[0]!.revenue, 1.01);
  assert.equal(projection.months[0]!.variableCosts, 0.34);
  assert.equal(projection.months[0]!.fixedCosts, 0.34);
  assert.equal(projection.months[0]!.profit, 0.33);
  assert.equal(projection.totalRevenue, 6.06);
  assert.equal(projection.totalProfit, 1.98);
  assert.equal(projection.totalCollections, 5.05);
  assert.equal(projection.endingReceivables, 1.01);
  assert.equal(projection.closingCash, 10.98);
});

test("decimal products round after multiplying rather than inheriting binary floating errors", () => {
  const assumptions = input();
  assumptions.baseline.price = 1.005;
  assumptions.baseline.units = 3;
  assumptions.baseline.unitCost = 0.335;
  assumptions.baseline.fixedCosts = 0;
  const month = calculateSimulation(assumptions).baseline.months[0]!;
  assert.equal(month.revenue, 3.02);
  assert.equal(month.variableCosts, 1.01);
  assert.equal(month.profit, 2.01);
});

test("percentage changes keep decimal half-cents exact until the final monthly rounding", () => {
  for (const [price, priceChangePct, revenue] of [
    [0.05, -30, 0.04],
    [0.05, -90, 0.01],
    [0.06, 175, 0.17],
  ]) {
    const assumptions = input();
    assumptions.baseline.price = price!;
    assumptions.baseline.units = 1;
    assumptions.baseline.unitCost = 0;
    assumptions.baseline.fixedCosts = 0;
    assumptions.change.priceChangePct = priceChangePct!;
    assert.equal(
      calculateSimulation(assumptions).scenario.months[0]!.revenue,
      revenue,
    );
  }
  const fractionalVolume = input();
  fractionalVolume.baseline.price = 0.01;
  fractionalVolume.baseline.units = 1;
  fractionalVolume.baseline.unitCost = 0.05;
  fractionalVolume.baseline.fixedCosts = 0.1;
  fractionalVolume.change.volumeChangePct = 50;
  fractionalVolume.change.unitCostChangePct = -30;
  fractionalVolume.change.additionalFixedCosts = 0.205;
  const month = calculateSimulation(fractionalVolume).scenario.months[0]!;
  assert.equal(month.revenue, 0.02);
  assert.equal(month.variableCosts, 0.05);
  assert.equal(month.fixedCosts, 0.31);
});

test("accounting identities hold in cents for every month and scenario", () => {
  const assumptions = input();
  assumptions.baseline.price = 19.99;
  assumptions.baseline.unitCost = 8.235;
  assumptions.baseline.units = 13.5;
  assumptions.baseline.fixedCosts = 125.555;
  assumptions.change.priceChangePct = -8;
  assumptions.change.volumeChangePct = 17;
  assumptions.change.unitCostChangePct = 3;
  assumptions.change.additionalFixedCosts = 42.335;
  const result = calculateSimulation(assumptions);
  for (const projection of [result.baseline, result.scenario]) {
    let cash = 1_200_000;
    let profit = 0;
    let receivables = 0;
    for (const month of projection.months) {
      const cents = (value: number) => Math.round(value * 100);
      assert.equal(
        cents(month.profit),
        cents(month.revenue) -
          cents(month.variableCosts) -
          cents(month.fixedCosts),
      );
      cash +=
        cents(month.collections) -
        cents(month.variableCosts) -
        cents(month.fixedCosts);
      profit += cents(month.profit);
      receivables += cents(month.revenue) - cents(month.collections);
      assert.equal(cents(month.closingCash), cash);
      assert.equal(cents(month.receivables), receivables);
      assert.equal(cash, 1_200_000 + profit - receivables);
    }
  }
});

test("bounded assumptions still produce finite safe amounts at their supported maxima", () => {
  const assumptions: SimulationInput = {
    baseline: {
      price: 1_000_000,
      unitCost: 1_000_000,
      units: 1_000_000,
      fixedCosts: 1_000_000_000,
      openingCash: 1_000_000_000_000,
      collectionDelayMonths: 3,
    },
    change: {
      priceChangePct: 200,
      volumeChangePct: 200,
      unitCostChangePct: 200,
      additionalFixedCosts: 1_000_000_000,
      collectionDelayMonths: 3,
    },
  };
  const result = calculateSimulation(assumptions);
  assert.equal(result.scenario.totalRevenue, 54_000_000_000_000);
  assert.equal(result.scenario.totalProfit, -12_000_000_000);
  for (const month of result.scenario.months)
    for (const value of Object.values(month))
      assert.equal(Number.isFinite(value), true);
});

test("malformed structures and missing fields are refused without numeric coercion", () => {
  for (const invalid of [null, [], false, "input", 10, {}, { baseline: {} }])
    assert.throws(() => calculateSimulation(invalid as SimulationInput));
  for (const invalid of [
    null,
    "100",
    Number.NaN,
    Number.POSITIVE_INFINITY,
    undefined,
  ]) {
    const assumptions = input();
    assumptions.baseline.price = invalid as number;
    assert.throws(() => calculateSimulation(assumptions));
  }
  const missing = input();
  delete (missing.change as Partial<SimulationInput["change"]>).volumeChangePct;
  assert.throws(() => calculateSimulation(missing));
});

test("each parameter rejects unsupported boundaries and fractional payment months", () => {
  for (const [key, values] of [
    ["price", [0, -1, 1_000_001]],
    ["unitCost", [-1, 1_000_001]],
    ["units", [-1, 1_000_001]],
    ["fixedCosts", [-1, 1_000_000_001]],
    ["openingCash", [-1, 1_000_000_000_001]],
    ["collectionDelayMonths", [-1, 0.5, 4]],
  ] as const) {
    for (const value of values) {
      const assumptions = input();
      assumptions.baseline[key] = value;
      assert.throws(() => calculateSimulation(assumptions));
    }
  }
  for (const [key, values] of [
    ["priceChangePct", [-90.001, 200.001]],
    ["volumeChangePct", [-100.001, 200.001]],
    ["unitCostChangePct", [-100.001, 200.001]],
    ["additionalFixedCosts", [-1, 1_000_000_001]],
    ["collectionDelayMonths", [-1, 0.5, 4]],
  ] as const) {
    for (const value of values) {
      const assumptions = input();
      assumptions.change[key] = value;
      assert.throws(() => calculateSimulation(assumptions));
    }
  }
});

test("calculating and saving copy assumptions without modifying the caller or retaining aliases", () => {
  const assumptions = input();
  const before = structuredClone(assumptions);
  Object.freeze(assumptions.baseline);
  Object.freeze(assumptions.change);
  Object.freeze(assumptions);
  calculateSimulation(assumptions);
  const saved = createSimulationSnapshot(
    assumptions,
    "  Paiement retardé  ",
    " sim-1 ",
    createdAt,
  );
  assert.deepEqual(assumptions, before);
  assert.equal(saved.title, "Paiement retardé");
  assert.equal(saved.id, "sim-1");
  assert.equal(saved.createdAt, "2026-11-02T10:00:00.000Z");
  assert.equal(saved.modelVersion, SIMULATION_VERSION);
  assert.notEqual(saved.input, assumptions);
  assert.notEqual(saved.input.baseline, assumptions.baseline);
  saved.input.change.collectionDelayMonths = 0;
  assert.equal(assumptions.change.collectionDelayMonths, 3);
});

test("saved inputs never accept injected cached outcomes and round-trip through JSON", () => {
  const assumptions = {
    ...input(),
    result: { profit: 1_000_000 },
    baseline: { ...input().baseline, profit: 1_000_000 },
    change: { ...input().change, guaranteedSurvival: true },
  };
  const saved = createSimulationSnapshot(
    assumptions,
    "Comparaison",
    "sim-1",
    createdAt,
  );
  assert.deepEqual(Object.keys(saved.input).sort(), ["baseline", "change"]);
  assert.equal("profit" in saved.input.baseline, false);
  assert.equal("guaranteedSurvival" in saved.input.change, false);
  const restored: unknown = JSON.parse(JSON.stringify(saved));
  assert.equal(isSimulationSnapshot(restored), true);
  assert.deepEqual(restored, saved);
});

test("snapshot validation recognizes versions, nonempty bounded titles, IDs and canonical instants", () => {
  const saved = createSimulationSnapshot(
    input(),
    "Scénario",
    "sim-1",
    createdAt,
  );
  for (const invalid of [
    null,
    [],
    {},
    { ...saved, id: " " },
    { ...saved, id: "a".repeat(161) },
    { ...saved, title: " " },
    { ...saved, title: "a".repeat(141) },
    { ...saved, modelVersion: "2.0.0" },
    { ...saved, createdAt: "2026-11-02" },
    { ...saved, createdAt: "2026-11-02T10:00:00Z" },
    { ...saved, createdAt: "2026-11-02T11:00:00.000+01:00" },
    { ...saved, createdAt: "2026-02-30T10:00:00.000Z" },
    { ...saved, input: { baseline: null, change: {} } },
  ])
    assert.equal(isSimulationSnapshot(invalid), false);
  assert.throws(() =>
    createSimulationSnapshot(input(), " ", "sim-1", createdAt),
  );
  assert.throws(() =>
    createSimulationSnapshot(input(), "Scénario", " ", createdAt),
  );
  assert.throws(
    () =>
      createSimulationSnapshot(
        input(),
        "Scénario",
        "sim-1",
        new Date("invalid"),
      ),
    RangeError,
  );
  assert.equal(
    isSimulationSnapshot(
      createSimulationSnapshot(
        input(),
        "Historique",
        "old",
        new Date("2020-01-01T00:00:00.000Z"),
      ),
    ),
    true,
  );
  assert.equal(
    isSimulationSnapshot(
      createSimulationSnapshot(
        input(),
        "Futur",
        "future",
        new Date("2035-01-01T00:00:00.000Z"),
      ),
    ),
    true,
  );
});

test("the Markdown dossier exposes assumptions, both ledgers, formulas and model limits", () => {
  const markdown = simulationMarkdown(input(), "Paiement retardé");
  assert.match(markdown, /^# Paiement retardé\n/);
  assert.ok(markdown.includes("modèle 1.0.0"));
  assert.ok(markdown.includes("Simulation fictive"));
  assert.ok(markdown.includes("Délai client de référence | 1 mois"));
  assert.ok(markdown.includes("Délai client du scénario : 3 mois"));
  assert.ok(markdown.includes("13\u202f200,00"));
  assert.ok(markdown.includes("-10\u202f800,00"));
  assert.equal(markdown.match(/^\| M\d \|/gm)?.length, 12);
  assert.ok(markdown.includes("résultat cumulé − créances finales"));
  assert.ok(
    markdown.includes("Aucun financement n’est automatiquement ajouté"),
  );
  assert.ok(markdown.includes("ni TVA, impôts, stocks"));
  assert.ok(markdown.includes("pas une observation terrain"));
});

test("export rejects invalid assumptions and keeps user titles inside a single escaped heading", () => {
  assert.throws(() => simulationMarkdown(input(), " "));
  assert.throws(() => simulationMarkdown(input(), "a".repeat(141)));
  const invalid = input();
  invalid.change.collectionDelayMonths = 12;
  assert.throws(() => simulationMarkdown(invalid, "Test"));
  const markdown = simulationMarkdown(input(), "# Référence\n<script>|[x]");
  assert.match(markdown, /^# \\# Référence &lt;script&gt;\\\|\\\[x\\\]\n/);
  assert.equal(markdown.includes("<script>"), false);
});

test("export includes exact numeric assumptions so rounded display values remain reproducible", () => {
  const assumptions = input();
  assumptions.baseline.price = 1.005;
  assumptions.baseline.units = 10.000001;
  assumptions.change.priceChangePct = 0.000001;
  const markdown = simulationMarkdown(assumptions, "Décimales exactes");
  const exactBlock = markdown.match(/```json\n([\s\S]*?)\n```/);
  assert.ok(exactBlock);
  const restored = JSON.parse(exactBlock[1]!) as SimulationInput;
  assert.deepEqual(restored, assumptions);
  assert.deepEqual(
    calculateSimulation(restored),
    calculateSimulation(assumptions),
  );
  assert.ok(
    markdown.includes("Trésorerie minimale (ouverture et fins de mois)"),
  );
});

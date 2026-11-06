/**
 * Small, pure models behind the lesson scenes (passe 27). Each one teaches a
 * mechanism with simplified, dated assumptions; none is personal advice.
 */

const cents = (value: number) => Math.round(value * 100) / 100;

function assertAmounts(input: Record<string, number>) {
  for (const [name, value] of Object.entries(input)) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(`${name} doit être un nombre fini positif ou nul.`);
    }
  }
}

/* ---------- Impôt sur le revenu ---------- */

/**
 * Barème 2026 (revenus 2025), loi de finances pour 2026, seuils revalorisés de
 * 0,9 %. Concordant across secondary sources in November 2026; to check on
 * impots.gouv.fr at each finance law.
 */
export const INCOME_TAX_2026 = [
  { upTo: 11_600, rate: 0 },
  { upTo: 29_579, rate: 0.11 },
  { upTo: 84_577, rate: 0.3 },
  { upTo: 181_917, rate: 0.41 },
  { upTo: Infinity, rate: 0.45 },
] as const;

export interface IncomeTaxSlice {
  from: number;
  to: number;
  rate: number;
  /** Part of the income per share taxed in this slice. */
  taxed: number;
  /** Tax for the whole household in this slice. */
  tax: number;
}

/**
 * Gross tax by the progressive scale and family quotient, before the
 * quotient cap, the décote, reductions and credits.
 */
export function incomeTax(taxableIncome: number, parts: number) {
  assertAmounts({ taxableIncome });
  if (!(parts >= 1) || !Number.isFinite(parts)) {
    throw new RangeError("Le nombre de parts doit être au moins 1.");
  }
  const perPart = taxableIncome / parts;
  let from = 0;
  const slices: IncomeTaxSlice[] = INCOME_TAX_2026.map(({ upTo, rate }) => {
    const taxed = Math.max(0, Math.min(perPart, upTo) - from);
    const slice = {
      from,
      to: upTo,
      rate,
      taxed: cents(taxed),
      tax: cents(taxed * rate * parts),
    };
    from = upTo;
    return slice;
  });
  const tax = Math.round(slices.reduce((sum, slice) => sum + slice.tax, 0));
  const marginalRate =
    [...slices].reverse().find((slice) => slice.taxed > 0)?.rate ?? 0;
  return {
    tax,
    perPart: cents(perPart),
    marginalRate,
    averageRate: taxableIncome ? tax / taxableIncome : 0,
    slices,
  };
}

/** What a raise really changes: more tax, but always more left in hand. */
export function raiseEffect(
  taxableIncome: number,
  parts: number,
  raise: number,
) {
  assertAmounts({ raise });
  const before = incomeTax(taxableIncome, parts).tax;
  const after = incomeTax(taxableIncome + raise, parts).tax;
  return { extraTax: after - before, kept: raise - (after - before) };
}

/* ---------- Besoin en fonds de roulement ---------- */

export interface WorkingCapitalInput {
  /** Monthly sales, excluding VAT. */
  monthlySales: number;
  /** Purchases as a share of sales, between 0 and 1. */
  purchaseShare: number;
  clientDays: number;
  supplierDays: number;
  stockDays: number;
}

/**
 * Simplified working capital need: money waiting with clients and in stock,
 * minus what suppliers lend by being paid later (30-day months).
 */
export function workingCapital(input: WorkingCapitalInput) {
  assertAmounts({ ...input });
  if (input.purchaseShare > 1) {
    throw new RangeError("La part des achats ne peut pas dépasser 100 %.");
  }
  const purchases = input.monthlySales * input.purchaseShare;
  const clients = (input.monthlySales * input.clientDays) / 30;
  const stock = (purchases * input.stockDays) / 30;
  const suppliers = (purchases * input.supplierDays) / 30;
  const need = clients + stock - suppliers;
  return {
    clients: Math.round(clients),
    stock: Math.round(stock),
    suppliers: Math.round(suppliers),
    need: Math.round(need),
    /** Extra need if sales grow by 20 %, all delays unchanged. */
    needIfGrowth20: Math.round(need * 1.2),
  };
}

/* ---------- Louer ou acheter ---------- */

export interface RentOrBuyInput {
  price: number;
  monthlyRent: number;
  downPayment: number;
  /** Nominal loan rate, in % per year. */
  loanRate: number;
  loanYears: number;
  years: number;
  /** Yearly change of the home's value, in %, can be negative. */
  priceGrowth: number;
  /** Yearly return of the down payment if invested instead, in %. */
  savingsReturn: number;
}

/** Notary fees in an older home, about 7.5 % (order of magnitude). */
export const NOTARY_RATE = 0.075;
/** Property tax, upkeep and insurance, per year, as a share of the price. */
export const OWNER_COSTS_RATE = 0.015;
/** Yearly rent increase. */
export const RENT_GROWTH = 0.02;

/**
 * Net cost of each path after `years`: money spent that does not come back.
 * Buying counts fees, interest and owner costs, minus the value gained;
 * renting counts rent, minus what the down payment would have earned.
 */
export function rentOrBuy(input: RentOrBuyInput) {
  const { priceGrowth, ...amounts } = input;
  assertAmounts(amounts);
  if (!Number.isFinite(priceGrowth))
    throw new RangeError("Évolution invalide.");
  const capital = Math.max(
    0,
    input.price * (1 + NOTARY_RATE) - input.downPayment,
  );
  const months = Math.max(1, Math.round(input.loanYears * 12));
  const rate = input.loanRate / 100 / 12;
  const payment =
    capital === 0
      ? 0
      : rate === 0
        ? capital / months
        : (capital * rate) / (1 - Math.pow(1 + rate, -months));
  const costAt = (year: number) => {
    // Interest actually paid during the first `year` years.
    let balance = capital;
    let interest = 0;
    for (let month = 0; month < Math.min(year * 12, months); month++) {
      const due = balance * rate;
      interest += due;
      balance -= payment - due;
    }
    const value = input.price * Math.pow(1 + priceGrowth / 100, year);
    const buy =
      input.price * NOTARY_RATE +
      interest +
      input.price * OWNER_COSTS_RATE * year -
      (value - input.price);
    let rent = 0;
    for (let y = 0; y < year; y++)
      rent += input.monthlyRent * 12 * Math.pow(1 + RENT_GROWTH, y);
    const missedReturn =
      input.downPayment * (Math.pow(1 + input.savingsReturn / 100, year) - 1);
    return { buy: Math.round(buy), rent: Math.round(rent - missedReturn) };
  };
  const result = costAt(input.years);
  let breakEvenYear: number | null = null;
  for (let year = 1; year <= 30; year++) {
    const at = costAt(year);
    if (at.buy <= at.rent) {
      breakEvenYear = year;
      break;
    }
  }
  return {
    monthlyPayment: Math.round(payment),
    buyCost: result.buy,
    rentCost: result.rent,
    breakEvenYear,
  };
}

/* ---------- Rééquilibrage ---------- */

/**
 * A portfolio split between shares and bonds drifts after a market move.
 * Rebalancing sells what rose and buys what fell, back to the target.
 */
export function rebalance(
  total: number,
  targetShares: number,
  sharesMove: number,
  bondsMove: number,
) {
  assertAmounts({ total });
  if (!(targetShares >= 0 && targetShares <= 1)) {
    throw new RangeError("La cible doit être comprise entre 0 et 100 %.");
  }
  if (sharesMove <= -1 || bondsMove <= -1) {
    throw new RangeError("Une baisse ne peut pas dépasser 100 %.");
  }
  const shares = total * targetShares * (1 + sharesMove);
  const bonds = total * (1 - targetShares) * (1 + bondsMove);
  const after = shares + bonds;
  const sharesWeight = after ? shares / after : 0;
  const tradeShares = after * targetShares - shares;
  return {
    shares: Math.round(shares),
    bonds: Math.round(bonds),
    total: Math.round(after),
    sharesWeight,
    /** Positive: buy shares (and sell bonds); negative: sell shares. */
    tradeShares: Math.round(tradeShares),
  };
}

/* ---------- Choisir un statut ---------- */

export interface StatusNeeds {
  /** Several founders from the start. */
  partners: boolean;
  /** Expected yearly revenue is above the micro ceiling for services. */
  highRevenue: boolean;
  /** Real expenses are high compared with revenue. */
  highExpenses: boolean;
  /** The founder wants the protection of an employee-like regime. */
  employeeProtection: boolean;
  /** Investors or fundraising are planned. */
  investors: boolean;
}

export type StatusId = "micro" | "ei-reel" | "eurl" | "sasu" | "sas";

export const statusLabels: Record<StatusId, string> = {
  micro: "Entreprise individuelle, régime micro",
  "ei-reel": "Entreprise individuelle, régime réel",
  eurl: "EURL (SARL à associé unique)",
  sasu: "SASU",
  sas: "SAS",
};

/**
 * A teaching rule set, not legal advice: it shows which criteria push toward
 * which form, with the reason for each push.
 */
export function suggestStatus(needs: StatusNeeds) {
  const reasons: string[] = [];
  let status: StatusId;
  if (needs.partners || needs.investors) {
    status = "sas";
    reasons.push(
      needs.investors
        ? "Des investisseurs entrent plus facilement au capital d’une SAS, aux statuts souples."
        : "À plusieurs, une société organise le partage du capital et des pouvoirs.",
    );
  } else if (needs.employeeProtection) {
    status = "sasu";
    reasons.push(
      "Le président de SASU est assimilé salarié : meilleure protection sociale, mais des cotisations plus élevées sur sa rémunération.",
    );
  } else if (needs.highRevenue || needs.highExpenses) {
    status = needs.highExpenses ? "ei-reel" : "eurl";
    reasons.push(
      needs.highExpenses
        ? "Avec des charges élevées, le régime réel déduit les charges réelles au lieu d’un abattement forfaitaire."
        : "Au-delà du plafond micro, une EURL permet de choisir l’impôt sur les sociétés et de séparer le patrimoine dans une société.",
    );
  } else {
    status = "micro";
    reasons.push(
      "Seul, avec un chiffre d’affaires sous les plafonds et peu de charges, la micro-entreprise est la plus simple à créer et à gérer.",
    );
  }
  if (status !== "micro" && !needs.highExpenses && !needs.partners)
    reasons.push(
      "En contrepartie : comptabilité complète et coûts de gestion plus élevés que la micro.",
    );
  return { status, label: statusLabels[status], reasons };
}

/* ---------- Obligations : prix et taux en sens inverse ---------- */

/**
 * Present value of a fixed-coupon bond: each coupon and the nominal are
 * discounted at the market rate of comparable new bonds.
 */
export function bondPrice(
  nominal: number,
  couponRate: number,
  yearsLeft: number,
  marketRate: number,
) {
  assertAmounts({ nominal, couponRate, yearsLeft, marketRate });
  const coupon = nominal * couponRate;
  const years = Math.round(yearsLeft);
  let price = 0;
  for (let year = 1; year <= years; year++)
    price += coupon / Math.pow(1 + marketRate, year);
  price += nominal / Math.pow(1 + marketRate, years);
  return {
    price: Math.round(price),
    coupon: cents(coupon),
    /** Coupon divided by the market price. */
    currentYield: price ? coupon / price : 0,
  };
}

/* ---------- Prévisionnel : trois scénarios ---------- */

export interface ForecastInput {
  /** Customers in the first year, central scenario. */
  customers: number;
  /** Average yearly basket per customer. */
  basket: number;
  /** Variable costs as a share of revenue. */
  variableShare: number;
  fixedCosts: number;
}

/**
 * The same plan under three assumptions on the number of customers:
 * a forecast is a set of scenarios, not a promise.
 */
export function forecastScenarios(input: ForecastInput) {
  assertAmounts({ ...input });
  if (input.variableShare > 1) {
    throw new RangeError("Les coûts variables ne peuvent dépasser 100 %.");
  }
  const build = (factor: number) => {
    const revenue = input.customers * factor * input.basket;
    const result = revenue * (1 - input.variableShare) - input.fixedCosts;
    return { revenue: Math.round(revenue), result: Math.round(result) };
  };
  const margin = input.basket * (1 - input.variableShare);
  return {
    pessimistic: build(0.6),
    central: build(1),
    optimistic: build(1.3),
    /** Customers needed to cover fixed costs. */
    breakEvenCustomers:
      margin > 0 ? Math.ceil(input.fixedCosts / margin) : null,
  };
}

/* ---------- Bilan : chaque opération garde l'équilibre ---------- */

export interface BalanceSheet {
  fixedAssets: number;
  stock: number;
  cash: number;
  equity: number;
  debt: number;
  suppliers: number;
}

export type BalanceOperation =
  "creation" | "loan" | "machine" | "stockOnCredit" | "sale" | "repay";

/** What each operation changes, in a fictitious company. */
export const balanceOperations: Record<
  BalanceOperation,
  {
    label: string;
    apply: (sheet: BalanceSheet) => BalanceSheet;
    explain: string;
  }
> = {
  creation: {
    label: "Apport de 10 000 €",
    apply: (s) => ({ ...s, cash: s.cash + 10_000, equity: s.equity + 10_000 }),
    explain:
      "Les associés apportent de l’argent : la trésorerie et les capitaux propres montent ensemble.",
  },
  loan: {
    label: "Emprunt de 20 000 €",
    apply: (s) => ({ ...s, cash: s.cash + 20_000, debt: s.debt + 20_000 }),
    explain:
      "La banque prête : plus de trésorerie à l’actif, autant de dette au passif.",
  },
  machine: {
    label: "Achat d’une machine 15 000 €",
    apply: (s) => ({
      ...s,
      cash: s.cash - 15_000,
      fixedAssets: s.fixedAssets + 15_000,
    }),
    explain:
      "L’argent devient une machine : l’actif change de forme, le total ne bouge pas.",
  },
  stockOnCredit: {
    label: "Stock acheté à crédit 6 000 €",
    apply: (s) => ({
      ...s,
      stock: s.stock + 6_000,
      suppliers: s.suppliers + 6_000,
    }),
    explain:
      "Le fournisseur sera payé plus tard : le stock monte, la dette fournisseur aussi.",
  },
  sale: {
    label: "Vente de ce stock 9 000 €",
    apply: (s) => {
      const sold = Math.min(6_000, s.stock);
      return {
        ...s,
        stock: s.stock - sold,
        cash: s.cash + 9_000,
        equity: s.equity + 9_000 - sold,
      };
    },
    explain:
      "Le stock sort, la trésorerie entre : la marge de la vente augmente les capitaux propres (le résultat).",
  },
  repay: {
    label: "Remboursement de 5 000 €",
    apply: (s) => {
      const paid = Math.min(5_000, s.debt, Math.max(0, s.cash));
      return { ...s, cash: s.cash - paid, debt: s.debt - paid };
    },
    explain:
      "Rembourser n’est pas une charge : la trésorerie et la dette baissent ensemble.",
  },
};

export const emptySheet: BalanceSheet = {
  fixedAssets: 0,
  stock: 0,
  cash: 0,
  equity: 0,
  debt: 0,
  suppliers: 0,
};

export function sheetTotals(sheet: BalanceSheet) {
  const assets = sheet.fixedAssets + sheet.stock + sheet.cash;
  const liabilities = sheet.equity + sheet.debt + sheet.suppliers;
  return { assets, liabilities, balanced: assets === liabilities };
}

/* ---------- Jeux de repérage : arnaques et test d'une IA ---------- */

/** Share of correct answers and the misses that matter most. */
export function scoreSorting<
  T extends { id: string; answer: boolean; serious?: boolean },
>(items: T[], choices: Record<string, boolean | undefined>) {
  const answered = items.filter((item) => choices[item.id] !== undefined);
  const correct = answered.filter((item) => choices[item.id] === item.answer);
  const seriousMisses = answered.filter(
    (item) => item.serious && choices[item.id] !== item.answer,
  );
  return {
    answered: answered.length,
    correct: correct.length,
    seriousMisses: seriousMisses.length,
    done: answered.length === items.length,
  };
}

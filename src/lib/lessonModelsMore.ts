/**
 * Pure models behind the passe 29 scenes. Simplified, fictitious cases that
 * teach one mechanism each; none is personal advice.
 */

const round = (value: number) => Math.round(value);

function assertAmounts(input: Record<string, number>) {
  for (const [name, value] of Object.entries(input)) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(`${name} doit être un nombre fini positif ou nul.`);
    }
  }
}

/** Emergency fund: target, what is missing, months to get there. */
export function emergencyFund(
  monthlyExpenses: number,
  months: number,
  saved: number,
  monthlySaving: number,
) {
  assertAmounts({ monthlyExpenses, months, saved, monthlySaving });
  const target = monthlyExpenses * months;
  const missing = Math.max(0, target - saved);
  return {
    target: round(target),
    missing: round(missing),
    monthsToReach:
      missing === 0
        ? 0
        : monthlySaving > 0
          ? Math.ceil(missing / monthlySaving)
          : null,
  };
}

/** What a sum buys after years of constant inflation, and a raise in real terms. */
export function inflationEffect(
  amount: number,
  inflation: number,
  years: number,
  raise: number,
) {
  assertAmounts({ amount, inflation, years, raise });
  const value = amount / Math.pow(1 + inflation, years);
  return {
    value: round(value),
    lost: round(amount - value),
    /** Real raise for one year: (1 + raise) / (1 + inflation) − 1. */
    realRaise: (1 + raise) / (1 + inflation) - 1,
  };
}

/** Same gross return, two fee levels, compounded. */
export function feeDrag(
  initial: number,
  grossReturn: number,
  years: number,
  lowFee: number,
  highFee: number,
) {
  assertAmounts({ initial, grossReturn, years, lowFee, highFee });
  const grow = (fee: number) =>
    initial * Math.pow(1 + grossReturn - fee, years);
  const low = grow(lowFee);
  const high = grow(highFee);
  return { low: round(low), high: round(high), gap: round(low - high) };
}

/** Customer lifetime value against acquisition cost. */
export function unitEconomicsLtv(
  basket: number,
  marginRate: number,
  purchasesPerYear: number,
  years: number,
  acquisitionCost: number,
) {
  assertAmounts({
    basket,
    marginRate,
    purchasesPerYear,
    years,
    acquisitionCost,
  });
  const yearlyMargin = basket * marginRate * purchasesPerYear;
  const lifetime = yearlyMargin * years;
  return {
    lifetimeValue: round(lifetime),
    ratio: acquisitionCost ? lifetime / acquisitionCost : null,
    paybackMonths:
      yearlyMargin > 0
        ? Math.ceil((acquisitionCost / yearlyMargin) * 12)
        : null,
  };
}

/** Visitors to contacts to customers. */
export function funnel(visitors: number, toLead: number, toCustomer: number) {
  assertAmounts({ visitors, toLead, toCustomer });
  const leads = visitors * toLead;
  return { leads: round(leads), customers: round(leads * toCustomer) };
}

/** From cost price to excluding-VAT and including-VAT price. */
export function priceFromCost(
  cost: number,
  marginRate: number,
  vatRate: number,
  vatExempt: boolean,
) {
  assertAmounts({ cost, marginRate, vatRate });
  if (marginRate >= 1)
    throw new RangeError("Le taux de marge doit rester sous 100 %.");
  // Margin on the selling price: price = cost / (1 − margin rate).
  const excludingVat = cost / (1 - marginRate);
  const vat = vatExempt ? 0 : excludingVat * vatRate;
  return {
    excludingVat: Math.round(excludingVat * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    includingVat: Math.round((excludingVat + vat) * 100) / 100,
    margin: Math.round((excludingVat - cost) * 100) / 100,
  };
}

/** A financing plan: needs on one side, resources on the other. */
export function financingPlan(input: {
  investments: number;
  workingCapital: number;
  cashCushion: number;
  equity: number;
  loan: number;
  grant: number;
}) {
  assertAmounts(input);
  const needs = input.investments + input.workingCapital + input.cashCushion;
  const resources = input.equity + input.loan + input.grant;
  return {
    needs: round(needs),
    resources: round(resources),
    gap: round(resources - needs),
    /** Share of the needs covered by the founders' own money. */
    equityShare: needs ? input.equity / needs : 0,
  };
}

/** Straight-line depreciation and simple payback of an investment. */
export function investmentPayback(
  price: number,
  years: number,
  yearlyGain: number,
) {
  assertAmounts({ price, years, yearlyGain });
  if (!(years >= 1))
    throw new RangeError("La durée doit être d’au moins un an.");
  const depreciation = price / years;
  return {
    depreciation: round(depreciation),
    /** Yearly accounting effect: gain minus depreciation. */
    yearlyResult: round(yearlyGain - depreciation),
    paybackYears: yearlyGain > 0 ? price / yearlyGain : null,
    /** Return over the depreciation period, relative to the price. */
    returnOnInvestment: price ? (yearlyGain * years - price) / price : 0,
  };
}

/** Three dashboard ratios, with simple alert thresholds. */
export function dashboardRatios(input: {
  revenue: number;
  grossMarginRate: number;
  fixedCosts: number;
  debt: number;
  equity: number;
}) {
  assertAmounts(input);
  const grossMargin = input.revenue * input.grossMarginRate;
  const result = grossMargin - input.fixedCosts;
  return {
    grossMargin: round(grossMargin),
    result: round(result),
    netMarginRate: input.revenue ? result / input.revenue : 0,
    debtRatio: input.equity ? input.debt / input.equity : null,
    alerts: {
      loss: result < 0,
      heavyDebt: input.equity ? input.debt / input.equity > 1 : input.debt > 0,
    },
  };
}

/** Regular saving for retirement, compounded monthly. */
export function retirementSaving(
  monthly: number,
  years: number,
  yearlyReturn: number,
) {
  assertAmounts({ monthly, years, yearlyReturn });
  const rate = yearlyReturn / 12;
  const months = Math.round(years * 12);
  const capital =
    rate === 0
      ? monthly * months
      : monthly * ((Math.pow(1 + rate, months) - 1) / rate);
  const paid = monthly * months;
  return {
    capital: round(capital),
    paid: round(paid),
    gains: round(capital - paid),
  };
}

/** Gross and net rental yield on a fictitious flat. */
export function rentalYield(input: {
  price: number;
  /** Purchase fees as a share of the price. */
  feesRate: number;
  monthlyRent: number;
  yearlyCharges: number;
  vacantMonths: number;
}) {
  assertAmounts(input);
  const cost = input.price * (1 + input.feesRate);
  const grossRent = input.monthlyRent * 12;
  const netRent =
    input.monthlyRent * Math.max(0, 12 - input.vacantMonths) -
    input.yearlyCharges;
  return {
    gross: input.price ? grossRent / input.price : 0,
    net: cost ? netRent / cost : 0,
    netRent: round(netRent),
  };
}

/** The gain needed to recover from a loss: losing 50 % needs +100 %. */
export function recoveryGain(loss: number) {
  if (!(loss >= 0 && loss < 1)) throw new RangeError("Perte entre 0 et 99 %.");
  return 1 / (1 - loss) - 1;
}

/**
 * Tax on a capital gain in 2026 (to check): flat tax of 31.4 % on a
 * securities account (12.8 % income tax + 18.6 % social charges); a PEA held
 * more than five years pays the social charges only.
 */
export const FLAT_TAX_2026 = 0.314;
export const SOCIAL_CHARGES_2026 = 0.186;

export function gainAfterTax(gain: number) {
  assertAmounts({ gain });
  return {
    securitiesAccount: round(gain * (1 - FLAT_TAX_2026)),
    peaAfterFiveYears: round(gain * (1 - SOCIAL_CHARGES_2026)),
  };
}

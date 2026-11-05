/**
 * Pedagogical projection at a constant rate. It illustrates compounding,
 * fees and inflation; it is neither a forecast nor a promise. No browser,
 * network or storage dependency.
 */
export type ProjectionInput = {
  /** Initial amount, euros. */
  initial: number;
  /** Contribution at the end of each month, euros. */
  monthly: number;
  /** Fictitious gross annual return, percent (e.g. 5 for 5 %). */
  annualReturn: number;
  /** Annual fees on the invested amount, percent. */
  annualFees: number;
  /** Annual inflation used for the real value, percent. */
  inflation: number;
  /** Whole years, 1 to 50. */
  years: number;
};

export type ProjectionYear = {
  year: number;
  contributed: number;
  value: number;
  valueWithoutFees: number;
};

export type Projection = {
  years: ProjectionYear[];
  contributed: number;
  finalValue: number;
  finalWithoutFees: number;
  /** Euros lost to fees over the period, compared with the same path without fees. */
  feeCost: number;
  /** Gain over contributions, after fees (may be negative). */
  gain: number;
  /** Final value expressed in today's purchasing power. */
  realFinalValue: number;
};

export const projectionLimits = {
  initial: { min: 0, max: 10_000_000 },
  monthly: { min: 0, max: 100_000 },
  annualReturn: { min: -20, max: 20 },
  annualFees: { min: 0, max: 10 },
  inflation: { min: -5, max: 20 },
  years: { min: 1, max: 50 },
} as const;

export function validateProjection(input: ProjectionInput): string | null {
  for (const key of Object.keys(
    projectionLimits,
  ) as (keyof ProjectionInput)[]) {
    const value = input[key];
    const { min, max } = projectionLimits[key];
    if (!Number.isFinite(value))
      return `Valeur manquante ou invalide : ${key}.`;
    if (value < min || value > max)
      return `Valeur hors limites : ${key} doit rester entre ${min} et ${max}.`;
  }
  if (!Number.isInteger(input.years))
    return "La durée doit être un nombre entier d’années.";
  return null;
}

const cents = (value: number) => Math.round(value * 100) / 100;

/** Monthly compounding of an annual rate: (1 + r)^(1/12). */
function monthlyFactor(annualPercent: number) {
  return Math.pow(1 + annualPercent / 100, 1 / 12);
}

export function projectInvestment(input: ProjectionInput): Projection {
  const error = validateProjection(input);
  if (error) throw new RangeError(error);
  const gross = monthlyFactor(input.annualReturn);
  // Fees are a yearly percentage of the invested amount, taken monthly.
  const net = gross * Math.pow(1 - input.annualFees / 100, 1 / 12);
  let value = input.initial;
  let withoutFees = input.initial;
  let contributed = input.initial;
  const years: ProjectionYear[] = [
    {
      year: 0,
      contributed: cents(contributed),
      value: cents(value),
      valueWithoutFees: cents(withoutFees),
    },
  ];
  for (let year = 1; year <= input.years; year++) {
    for (let month = 0; month < 12; month++) {
      value = value * net + input.monthly;
      withoutFees = withoutFees * gross + input.monthly;
      contributed += input.monthly;
    }
    years.push({
      year,
      contributed: cents(contributed),
      value: cents(value),
      valueWithoutFees: cents(withoutFees),
    });
  }
  const last = years[years.length - 1]!;
  const realFinalValue =
    value / Math.pow(1 + input.inflation / 100, input.years);
  return {
    years,
    contributed: last.contributed,
    finalValue: last.value,
    finalWithoutFees: last.valueWithoutFees,
    feeCost: cents(last.valueWithoutFees - last.value),
    gain: cents(last.value - last.contributed),
    realFinalValue: cents(realFinalValue),
  };
}

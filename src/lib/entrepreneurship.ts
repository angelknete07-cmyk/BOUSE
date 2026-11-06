/**
 * Micro-entreprise estimates for the lesson scene. Values are the 2026 figures
 * found in concordant secondary sources (November 2026): they change with
 * each finance law and must be checked on autoentrepreneur.urssaf.fr.
 * Liberal professions are left out: their rate depends on the pension fund.
 */
export type MicroActivity = "vente" | "services";

export interface MicroRule {
  /** Social contributions, share of collected revenue. */
  contribution: number;
  /** Flat allowance used to compute the taxable profit. */
  allowance: number;
  /** Optional flat income tax paid with the contributions. */
  liberatoire: number;
  /** Annual revenue ceiling of the micro regime. */
  ceiling: number;
  /** VAT exemption threshold (franchise en base). */
  vatThreshold: number;
}

export const MICRO_RULES_2026: Record<MicroActivity, MicroRule> = {
  vente: {
    contribution: 0.123,
    allowance: 0.71,
    liberatoire: 0.01,
    ceiling: 203_100,
    vatThreshold: 85_000,
  },
  services: {
    contribution: 0.212,
    allowance: 0.5,
    liberatoire: 0.017,
    ceiling: 83_600,
    vatThreshold: 37_500,
  },
};

export interface MicroInput {
  /** Annual revenue collected, excluding VAT. */
  revenue: number;
  activity: MicroActivity;
  /** Real annual business expenses (purchases, tools, travel…). */
  realCharges: number;
  /** Whether the optional flat income tax is chosen. */
  liberatoire: boolean;
}

export interface MicroEstimate {
  contributions: number;
  /** Profit the tax office retains: revenue minus the flat allowance. */
  taxableProfit: number;
  /** Flat income tax when chosen, else 0 (income tax then follows the household scale). */
  liberatoireTax: number;
  /** What remains after contributions, real charges and the flat tax if chosen. */
  remaining: number;
  /** Real charges are higher than the allowance: the micro regime taxes a profit that does not exist. */
  chargesExceedAllowance: boolean;
  overVatThreshold: boolean;
  overCeiling: boolean;
}

const cents = (value: number) => Math.round(value * 100) / 100;

export function microEstimate(input: MicroInput): MicroEstimate {
  for (const name of ["revenue", "realCharges"] as const) {
    const value = input[name];
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(`${name} doit être un nombre fini positif ou nul.`);
    }
  }
  const rule = MICRO_RULES_2026[input.activity];
  if (!rule) throw new RangeError("Activité inconnue.");
  const contributions = cents(input.revenue * rule.contribution);
  const liberatoireTax = input.liberatoire
    ? cents(input.revenue * rule.liberatoire)
    : 0;
  return {
    contributions,
    taxableProfit: cents(input.revenue * (1 - rule.allowance)),
    liberatoireTax,
    remaining: cents(
      input.revenue - contributions - input.realCharges - liberatoireTax,
    ),
    chargesExceedAllowance: input.realCharges > input.revenue * rule.allowance,
    overVatThreshold: input.revenue > rule.vatThreshold,
    overCeiling: input.revenue > rule.ceiling,
  };
}

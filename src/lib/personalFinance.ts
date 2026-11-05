/**
 * Pedagogical personal-finance calculations. Fixed-rate amortising loan with
 * constant monthly payments, no insurance or fees (those belong in the TAEG
 * and are shown separately in the lessons). Not a loan offer or simulation of
 * any lender's conditions.
 */

export type LoanInput = {
  /** Borrowed amount, euros. */
  capital: number;
  /** Nominal annual rate, percent. */
  annualRate: number;
  /** Duration in months. */
  months: number;
};

export type LoanResult = {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
};

export const loanLimits = {
  capital: { min: 100, max: 1_000_000 },
  annualRate: { min: 0, max: 25 },
  months: { min: 1, max: 420 },
} as const;

const cents = (value: number) => Math.round(value * 100) / 100;

export function validateLoan(input: LoanInput): string | null {
  for (const key of Object.keys(loanLimits) as (keyof LoanInput)[]) {
    const value = input[key];
    const { min, max } = loanLimits[key];
    if (!Number.isFinite(value)) return `Valeur invalide : ${key}.`;
    if (value < min || value > max)
      return `Valeur hors limites : ${key} doit rester entre ${min} et ${max}.`;
  }
  if (!Number.isInteger(input.months))
    return "La durée doit être un nombre entier de mois.";
  return null;
}

/** Constant payment: C × r / (1 − (1 + r)^−n), with r the monthly rate. */
export function loanPayment(input: LoanInput): LoanResult {
  const error = validateLoan(input);
  if (error) throw new RangeError(error);
  const rate = input.annualRate / 100 / 12;
  const payment =
    rate === 0
      ? input.capital / input.months
      : (input.capital * rate) / (1 - Math.pow(1 + rate, -input.months));
  const totalPaid = payment * input.months;
  return {
    monthlyPayment: cents(payment),
    totalPaid: cents(totalPaid),
    totalInterest: cents(totalPaid - input.capital),
  };
}

export type BudgetInput = {
  income: number;
  fixedCharges: number;
  variableSpending: number;
  /** Amount set aside first, at the start of the month. */
  savings: number;
};

/** What remains after paying yourself first and covering all spending. */
export function budgetBalance(input: BudgetInput): {
  remaining: number;
  savingsRate: number;
  fixedShare: number;
} {
  for (const value of Object.values(input))
    if (!Number.isFinite(value) || value < 0)
      throw new RangeError("Les montants doivent être positifs ou nuls.");
  const remaining =
    input.income - input.fixedCharges - input.variableSpending - input.savings;
  return {
    remaining: cents(remaining),
    savingsRate: input.income ? cents((input.savings / input.income) * 100) : 0,
    fixedShare: input.income
      ? cents((input.fixedCharges / input.income) * 100)
      : 0,
  };
}

/** Emergency fund target: monthly essential spending × months of cover. */
export function emergencyFundTarget(monthlySpending: number, months: number) {
  if (!Number.isFinite(monthlySpending) || monthlySpending < 0)
    throw new RangeError("Dépenses invalides.");
  if (!Number.isInteger(months) || months < 1 || months > 24)
    throw new RangeError("Nombre de mois invalide.");
  return cents(monthlySpending * months);
}

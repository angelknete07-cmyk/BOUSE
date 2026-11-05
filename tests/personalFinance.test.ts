import test from "node:test";
import assert from "node:assert/strict";
import {
  budgetBalance,
  emergencyFundTarget,
  loanPayment,
  validateLoan,
} from "../src/lib/personalFinance.ts";

test("a fixed-rate loan matches the textbook constant payment", () => {
  const result = loanPayment({ capital: 10_000, annualRate: 5, months: 60 });
  assert.equal(result.monthlyPayment, 188.71);
  assert.equal(result.totalInterest, 1322.74);
  assert.equal(result.totalPaid, 11322.74);
});

test("the lesson example: 3 000 € over 12 months at 6 % costs about 98 €", () => {
  const result = loanPayment({ capital: 3000, annualRate: 6, months: 12 });
  assert.equal(result.monthlyPayment, 258.2);
  assert.equal(result.totalInterest, 98.39);
});

test("a zero rate splits the capital evenly with no interest", () => {
  const result = loanPayment({ capital: 1200, annualRate: 0, months: 12 });
  assert.equal(result.monthlyPayment, 100);
  assert.equal(result.totalInterest, 0);
});

test("a longer duration lowers the payment but raises the total cost", () => {
  const short = loanPayment({ capital: 15_000, annualRate: 4, months: 48 });
  const long = loanPayment({ capital: 15_000, annualRate: 4, months: 84 });
  assert.ok(long.monthlyPayment < short.monthlyPayment);
  assert.ok(long.totalInterest > short.totalInterest);
});

test("invalid loans are refused instead of computed", () => {
  assert.match(
    validateLoan({ capital: 50, annualRate: 5, months: 12 }) ?? "",
    /limites/,
  );
  assert.match(
    validateLoan({ capital: 1000, annualRate: 5, months: 12.5 }) ?? "",
    /entier/,
  );
  assert.match(
    validateLoan({ capital: Number.NaN, annualRate: 5, months: 12 }) ?? "",
    /invalide/,
  );
  assert.throws(
    () => loanPayment({ capital: 1000, annualRate: 40, months: 12 }),
    RangeError,
  );
});

test("the budget pays yourself first, then shows what remains", () => {
  const result = budgetBalance({
    income: 1800,
    fixedCharges: 1100,
    variableSpending: 450,
    savings: 150,
  });
  assert.equal(result.remaining, 100);
  assert.equal(result.savingsRate, 8.33);
  assert.equal(result.fixedShare, 61.11);
  assert.equal(
    budgetBalance({
      income: 1000,
      fixedCharges: 900,
      variableSpending: 200,
      savings: 0,
    }).remaining,
    -100,
    "an overspent month is shown as negative, not hidden",
  );
  assert.throws(() =>
    budgetBalance({
      income: -1,
      fixedCharges: 0,
      variableSpending: 0,
      savings: 0,
    }),
  );
});

test("the emergency fund target multiplies essential spending by months of cover", () => {
  assert.equal(emergencyFundTarget(1500, 3), 4500);
  assert.equal(emergencyFundTarget(1500, 6), 9000);
  assert.throws(() => emergencyFundTarget(1500, 0));
  assert.throws(() => emergencyFundTarget(-1, 3));
});

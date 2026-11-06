import assert from "node:assert/strict";
import test from "node:test";
import {
  incomeTax,
  raiseEffect,
  rebalance,
  rentOrBuy,
  suggestStatus,
  workingCapital,
} from "../src/lib/lessonModels.ts";

test("income tax applies each slice of the 2026 scale only to its own euros", () => {
  // 30 000 € for one share: (29 579 − 11 600) × 11 % + (30 000 − 29 579) × 30 %.
  const single = incomeTax(30_000, 1);
  assert.equal(single.tax, Math.round(17_979 * 0.11 + 421 * 0.3));
  assert.equal(single.marginalRate, 0.3);
  assert.ok(single.averageRate < single.marginalRate);
  // The family quotient divides then multiplies.
  const couple = incomeTax(60_000, 2);
  assert.equal(couple.tax, single.tax * 2);
  assert.equal(incomeTax(11_000, 1).tax, 0);
  assert.equal(incomeTax(0, 1).averageRate, 0);
});

test("a raise always leaves more money in hand", () => {
  for (const income of [10_000, 29_000, 84_000, 181_000]) {
    const effect = raiseEffect(income, 1, 1_000);
    assert.ok(effect.kept > 0, `${income}`);
    assert.ok(effect.extraTax <= 450);
  }
});

test("invalid tax inputs are refused", () => {
  assert.throws(() => incomeTax(-1, 1), RangeError);
  assert.throws(() => incomeTax(1_000, 0.5), RangeError);
});

test("working capital: clients and stock minus supplier credit", () => {
  const result = workingCapital({
    monthlySales: 30_000,
    purchaseShare: 0.5,
    clientDays: 60,
    supplierDays: 30,
    stockDays: 30,
  });
  assert.equal(result.clients, 60_000);
  assert.equal(result.stock, 15_000);
  assert.equal(result.suppliers, 15_000);
  assert.equal(result.need, 60_000);
  assert.equal(result.needIfGrowth20, 72_000);
  assert.throws(
    () =>
      workingCapital({
        ...{ monthlySales: 1, clientDays: 0, supplierDays: 0, stockDays: 0 },
        purchaseShare: 2,
      }),
    RangeError,
  );
});

test("rent or buy: buying gets cheaper with time, renting does not", () => {
  const base = {
    price: 250_000,
    monthlyRent: 900,
    downPayment: 30_000,
    loanRate: 3.5,
    loanYears: 25,
    priceGrowth: 1,
    savingsReturn: 3,
  };
  const short = rentOrBuy({ ...base, years: 2 });
  const long = rentOrBuy({ ...base, years: 20 });
  assert.ok(short.buyCost > short.rentCost, "fees weigh on a short stay");
  assert.ok(long.buyCost < long.rentCost, "a long stay favours buying here");
  assert.ok(short.breakEvenYear !== null && short.breakEvenYear > 2);
  assert.ok(short.monthlyPayment > 1_000);
  // A falling market can make buying lose at every horizon tested.
  const falling = rentOrBuy({ ...base, years: 10, priceGrowth: -3 });
  assert.ok(falling.buyCost > rentOrBuy({ ...base, years: 10 }).buyCost);
});

test("rebalancing sells what rose and returns to the target", () => {
  const result = rebalance(10_000, 0.6, 0.3, 0);
  assert.equal(result.shares, 7_800);
  assert.equal(result.bonds, 4_000);
  assert.equal(result.total, 11_800);
  assert.ok(result.sharesWeight > 0.6);
  assert.equal(result.tradeShares, Math.round(11_800 * 0.6 - 7_800));
  assert.ok(rebalance(10_000, 0.6, -0.3, 0).tradeShares > 0);
  assert.throws(() => rebalance(10_000, 1.2, 0, 0), RangeError);
});

test("status suggestion follows the criteria and says why", () => {
  const none = {
    partners: false,
    highRevenue: false,
    highExpenses: false,
    employeeProtection: false,
    investors: false,
  };
  assert.equal(suggestStatus(none).status, "micro");
  assert.equal(suggestStatus({ ...none, partners: true }).status, "sas");
  assert.equal(suggestStatus({ ...none, investors: true }).status, "sas");
  assert.equal(
    suggestStatus({ ...none, employeeProtection: true }).status,
    "sasu",
  );
  assert.equal(
    suggestStatus({ ...none, highExpenses: true }).status,
    "ei-reel",
  );
  assert.equal(suggestStatus({ ...none, highRevenue: true }).status, "eurl");
  assert.ok(suggestStatus({ ...none, highRevenue: true }).reasons.length >= 1);
});

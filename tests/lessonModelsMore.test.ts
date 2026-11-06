import assert from "node:assert/strict";
import test from "node:test";
import {
  dashboardRatios,
  emergencyFund,
  feeDrag,
  financingPlan,
  funnel,
  gainAfterTax,
  inflationEffect,
  investmentPayback,
  priceFromCost,
  recoveryGain,
  rentalYield,
  retirementSaving,
  unitEconomicsLtv,
} from "../src/lib/lessonModelsMore.ts";

test("emergency fund: target, gap and months to reach it", () => {
  assert.deepEqual(emergencyFund(1_500, 4, 2_000, 200), {
    target: 6_000,
    missing: 4_000,
    monthsToReach: 20,
  });
  assert.equal(emergencyFund(1_500, 3, 9_000, 0).monthsToReach, 0);
  assert.equal(emergencyFund(1_500, 3, 0, 0).monthsToReach, null);
});

test("inflation erodes a sum and a raise below inflation loses in real terms", () => {
  const result = inflationEffect(1_000, 0.02, 10, 0.01);
  assert.equal(result.value, Math.round(1_000 / 1.02 ** 10));
  assert.ok(result.realRaise < 0);
  assert.ok(inflationEffect(1_000, 0.02, 1, 0.03).realRaise > 0);
});

test("fees compound: 2 % instead of 0.2 % costs a lot over 20 years", () => {
  const result = feeDrag(10_000, 0.05, 20, 0.002, 0.02);
  assert.ok(result.gap > 5_000);
  assert.equal(result.low, Math.round(10_000 * 1.048 ** 20));
});

test("lifetime value against acquisition cost", () => {
  const result = unitEconomicsLtv(50, 0.4, 4, 2, 60);
  assert.equal(result.lifetimeValue, 160);
  assert.ok(Math.abs(result.ratio! - 160 / 60) < 1e-9);
  assert.equal(result.paybackMonths, Math.ceil((60 / 80) * 12));
});

test("funnel multiplies its rates", () => {
  assert.deepEqual(funnel(2_000, 0.05, 0.2), { leads: 100, customers: 20 });
});

test("price from cost: margin on the selling price, then VAT unless exempt", () => {
  const priced = priceFromCost(60, 0.4, 0.2, false);
  assert.equal(priced.excludingVat, 100);
  assert.equal(priced.vat, 20);
  assert.equal(priced.includingVat, 120);
  assert.equal(priced.margin, 40);
  assert.equal(priceFromCost(60, 0.4, 0.2, true).includingVat, 100);
  assert.throws(() => priceFromCost(60, 1, 0.2, false), RangeError);
});

test("financing plan compares needs and resources", () => {
  const plan = financingPlan({
    investments: 20_000,
    workingCapital: 8_000,
    cashCushion: 2_000,
    equity: 6_000,
    loan: 20_000,
    grant: 2_000,
  });
  assert.equal(plan.needs, 30_000);
  assert.equal(plan.resources, 28_000);
  assert.equal(plan.gap, -2_000);
  assert.equal(plan.equityShare, 0.2);
});

test("investment: depreciation, payback and return", () => {
  const result = investmentPayback(15_000, 5, 5_000);
  assert.equal(result.depreciation, 3_000);
  assert.equal(result.yearlyResult, 2_000);
  assert.equal(result.paybackYears, 3);
  assert.ok(Math.abs(result.returnOnInvestment - 10_000 / 15_000) < 1e-9);
});

test("dashboard ratios raise alerts on losses and heavy debt", () => {
  const ok = dashboardRatios({
    revenue: 200_000,
    grossMarginRate: 0.5,
    fixedCosts: 80_000,
    debt: 30_000,
    equity: 60_000,
  });
  assert.equal(ok.result, 20_000);
  assert.equal(ok.netMarginRate, 0.1);
  assert.equal(ok.debtRatio, 0.5);
  assert.deepEqual(ok.alerts, { loss: false, heavyDebt: false });
  const bad = dashboardRatios({
    revenue: 100_000,
    grossMarginRate: 0.3,
    fixedCosts: 40_000,
    debt: 90_000,
    equity: 30_000,
  });
  assert.deepEqual(bad.alerts, { loss: true, heavyDebt: true });
});

test("retirement saving grows with time more than with effort", () => {
  const result = retirementSaving(100, 30, 0.04);
  assert.equal(result.paid, 36_000);
  assert.ok(result.gains > 30_000);
  assert.equal(retirementSaving(100, 10, 0).capital, 12_000);
});

test("net rental yield is well below the gross yield", () => {
  const result = rentalYield({
    price: 150_000,
    feesRate: 0.08,
    monthlyRent: 700,
    yearlyCharges: 2_000,
    vacantMonths: 1,
  });
  assert.equal(result.gross, 8_400 / 150_000);
  assert.equal(result.netRent, 700 * 11 - 2_000);
  assert.ok(result.net < result.gross);
});

test("recovering from a loss needs a larger gain", () => {
  assert.equal(recoveryGain(0.5), 1);
  assert.ok(Math.abs(recoveryGain(0.8) - 4) < 1e-9);
  assert.throws(() => recoveryGain(1), RangeError);
});

test("a gain keeps more in a PEA after five years than on a securities account", () => {
  assert.deepEqual(gainAfterTax(10_000), {
    securitiesAccount: 6_860,
    peaAfterFiveYears: 8_140,
  });
});

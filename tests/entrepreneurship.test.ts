import assert from "node:assert/strict";
import test from "node:test";
import { microEstimate } from "../src/lib/entrepreneurship.ts";

test("micro services: contributions, taxable profit and what remains", () => {
  assert.deepEqual(
    microEstimate({
      revenue: 30_000,
      activity: "services",
      realCharges: 3_000,
      liberatoire: false,
    }),
    {
      contributions: 6_360,
      taxableProfit: 15_000,
      liberatoireTax: 0,
      remaining: 20_640,
      chargesExceedAllowance: false,
      overVatThreshold: false,
      overCeiling: false,
    },
  );
});

test("micro vente with the flat income tax", () => {
  const result = microEstimate({
    revenue: 100_000,
    activity: "vente",
    realCharges: 60_000,
    liberatoire: true,
  });
  assert.equal(result.contributions, 12_300);
  assert.equal(result.liberatoireTax, 1_000);
  assert.equal(result.taxableProfit, 29_000);
  assert.equal(result.remaining, 26_700);
  assert.equal(result.overVatThreshold, true);
  assert.equal(result.overCeiling, false);
  assert.equal(result.chargesExceedAllowance, false);
});

test("real charges above the allowance and revenue above the ceiling are flagged", () => {
  const result = microEstimate({
    revenue: 90_000,
    activity: "services",
    realCharges: 50_000,
    liberatoire: false,
  });
  assert.equal(result.chargesExceedAllowance, true);
  assert.equal(result.overCeiling, true);
  assert.equal(result.overVatThreshold, true);
});

test("zero revenue means zero contributions", () => {
  const result = microEstimate({
    revenue: 0,
    activity: "services",
    realCharges: 0,
    liberatoire: true,
  });
  assert.equal(result.contributions, 0);
  assert.equal(result.remaining, 0);
});

test("invalid amounts are refused", () => {
  assert.throws(
    () =>
      microEstimate({
        revenue: -1,
        activity: "vente",
        realCharges: 0,
        liberatoire: false,
      }),
    RangeError,
  );
  assert.throws(
    () =>
      microEstimate({
        revenue: 1_000,
        activity: "vente",
        realCharges: Number.NaN,
        liberatoire: false,
      }),
    RangeError,
  );
});

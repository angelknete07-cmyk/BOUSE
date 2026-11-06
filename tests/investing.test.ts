import test from "node:test";
import assert from "node:assert/strict";
import {
  projectInvestment,
  validateProjection,
  type ProjectionInput,
} from "../src/lib/investing.ts";

const base: ProjectionInput = {
  initial: 10_000,
  monthly: 0,
  annualReturn: 5,
  annualFees: 0,
  inflation: 0,
  years: 20,
};

test("a lump sum compounds to the textbook value at a constant rate", () => {
  const result = projectInvestment(base);
  assert.equal(result.finalValue, 26532.98);
  assert.equal(result.contributed, 10_000);
  assert.equal(result.feeCost, 0);
  assert.equal(result.years.length, 21);
  assert.equal(result.years[0]!.value, 10_000);
});

test("annual fees compound against the saver, matching the lesson example", () => {
  const onePercent = projectInvestment({ ...base, annualFees: 1 });
  const twoPercent = projectInvestment({ ...base, annualFees: 2 });
  assert.equal(onePercent.finalValue, 21701.51);
  assert.equal(twoPercent.finalValue, 17713.63);
  assert.equal(onePercent.finalWithoutFees, 26532.98);
  assert.equal(onePercent.feeCost, 4831.47);
});

test("inflation gives the value in today's purchasing power", () => {
  const result = projectInvestment({ ...base, inflation: 2 });
  assert.equal(result.realFinalValue, 17855.93);
  assert.equal(result.finalValue, 26532.98, "nominal value is unchanged");
});

test("a zero return only accumulates contributions", () => {
  const result = projectInvestment({
    ...base,
    initial: 1000,
    monthly: 100,
    annualReturn: 0,
    years: 3,
  });
  assert.equal(result.contributed, 4600);
  assert.equal(result.finalValue, 4600);
  assert.equal(result.gain, 0);
});

test("a negative return can lose money and is reported as a negative gain", () => {
  const result = projectInvestment({ ...base, annualReturn: -10, years: 2 });
  assert.equal(result.finalValue, 8100);
  assert.equal(result.gain, -1900);
});

test("contributions grow year after year and values stay ordered", () => {
  const result = projectInvestment({ ...base, monthly: 200, annualFees: 0.5 });
  for (let index = 1; index < result.years.length; index++) {
    assert.ok(
      result.years[index]!.contributed > result.years[index - 1]!.contributed,
    );
    assert.ok(
      result.years[index]!.valueWithoutFees >= result.years[index]!.value,
    );
  }
});

test("invalid or out-of-range inputs are refused instead of projected", () => {
  assert.match(validateProjection({ ...base, years: 0 }) ?? "", /limites/);
  assert.match(validateProjection({ ...base, years: 2.5 }) ?? "", /entier/);
  assert.match(
    validateProjection({ ...base, annualFees: Number.NaN }) ?? "",
    /invalide/,
  );
  assert.match(validateProjection({ ...base, initial: -1 }) ?? "", /limites/);
  assert.equal(validateProjection(base), null);
  assert.throws(
    () => projectInvestment({ ...base, annualReturn: 50 }),
    RangeError,
  );
});

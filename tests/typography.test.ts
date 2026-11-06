import test from "node:test";
import assert from "node:assert/strict";
import { glossary } from "../src/data/investingGlossary.ts";
import { lessons } from "../src/data/lessons.ts";

/** Every string reachable from the course content, however deeply nested. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object")
    return Object.values(value).flatMap(strings);
  return [];
}

test("a figure never wraps away from its unit or its thousands", () => {
  const breakable = strings([lessons, glossary]).filter(
    (text) => /\d [€%]/.test(text) || /\d \d{3}(?!\d)/.test(text),
  );
  assert.deepEqual(breakable, []);
});

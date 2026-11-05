import test from "node:test";
import assert from "node:assert/strict";
import {
  createLocalAdapter,
  createMemoryAdapter,
  readStateFrom,
} from "../src/lib/persistence.ts";
import { emptyState, storageKey } from "../src/lib/storage.ts";

function fakeStorage() {
  const values = new Map<string, string>();
  return {
    values,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
    removeItem: (key: string) => void values.delete(key),
  };
}

test("an empty adapter starts from a fresh state without error", () => {
  const result = readStateFrom(createMemoryAdapter());
  assert.deepEqual(result.state, emptyState);
  assert.equal(result.error, null);
  result.state.notes.x = "copie";
  assert.deepEqual(emptyState.notes, {}, "the template is never mutated");
});

test("a written state reads back identically through the local adapter", () => {
  const storage = fakeStorage();
  const adapter = createLocalAdapter(storage);
  const state = { ...structuredClone(emptyState), notes: { a: "Note" } };
  adapter.write(state);
  assert.ok(storage.values.has(storageKey), "uses the versioned key");
  assert.deepEqual(readStateFrom(adapter).state, state);
  adapter.clear();
  assert.equal(adapter.readRaw(), null);
});

test("an unreadable save is reported and preserved, never cleared", () => {
  const adapter = createMemoryAdapter("{ pas du json");
  const result = readStateFrom(adapter);
  assert.deepEqual(result.state, emptyState);
  assert.match(result.error ?? "", /conservée/);
  assert.equal(adapter.snapshot(), "{ pas du json");
});

test("an incompatible schema is refused like an unreadable save", () => {
  const adapter = createMemoryAdapter(
    JSON.stringify({ ...emptyState, schemaVersion: 2 }),
  );
  assert.notEqual(readStateFrom(adapter).error, null);
});

test("a storage that refuses reads yields an error instead of throwing", () => {
  const adapter = createLocalAdapter({
    getItem: () => {
      throw new Error("SecurityError");
    },
    setItem: () => undefined,
    removeItem: () => undefined,
  });
  assert.notEqual(readStateFrom(adapter).error, null);
});

test("a refused write surfaces to the caller", () => {
  const adapter = createLocalAdapter({
    getItem: () => null,
    setItem: () => {
      throw new Error("QuotaExceededError");
    },
    removeItem: () => undefined,
  });
  assert.throws(() => adapter.write(structuredClone(emptyState)));
});

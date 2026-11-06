import test from "node:test";
import assert from "node:assert/strict";
import {
  canonicalJson,
  isEmptyState,
  planInitialSync,
  type RemoteCopy,
} from "../src/lib/sync.ts";
import { emptyState } from "../src/lib/storage.ts";
import type { AppState } from "../src/lib/types.ts";

const withNote = (text: string): AppState => ({
  ...structuredClone(emptyState),
  notes: { "ca-marge-tresorerie": text },
});
const remote = (state: AppState): RemoteCopy => ({
  state,
  revision: 3,
  updatedAt: "2026-11-05T10:00:00.000Z",
});

test("an empty state carries nothing to protect; a note or attempt does", () => {
  assert.equal(isEmptyState(structuredClone(emptyState)), true);
  assert.equal(isEmptyState(withNote("   ")), true);
  assert.equal(isEmptyState(withNote("Une idée")), false);
});

test("the first sync pushes a non-empty local state when the server has none", () => {
  assert.deepEqual(planInitialSync(withNote("A"), null), {
    kind: "push-first",
  });
  assert.deepEqual(planInitialSync(structuredClone(emptyState), null), {
    kind: "nothing",
  });
});

test("an empty device adopts the server copy", () => {
  assert.deepEqual(
    planInitialSync(structuredClone(emptyState), remote(withNote("A"))),
    { kind: "pull" },
  );
});

test("identical content is in sync even when keys are ordered differently", () => {
  const local = withNote("A");
  const reordered = JSON.parse(
    JSON.stringify({ notes: local.notes, ...local }),
  ) as AppState;
  assert.deepEqual(planInitialSync(local, remote(reordered)), {
    kind: "in-sync",
  });
});

test("different non-empty states are a conflict, never a silent overwrite", () => {
  assert.deepEqual(planInitialSync(withNote("A"), remote(withNote("B"))), {
    kind: "conflict",
  });
});

test("canonical JSON ignores key order and undefined fields", () => {
  assert.equal(
    canonicalJson({ b: 1, a: [1, { d: undefined, c: 2 }] }),
    canonicalJson({ a: [1, { c: 2 }], b: 1 }),
  );
});

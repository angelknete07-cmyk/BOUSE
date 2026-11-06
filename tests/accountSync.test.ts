import test from "node:test";
import assert from "node:assert/strict";
import { accountPersistence, accountKey } from "../src/lib/accountStorage.ts";
import { emptyState, storageKey } from "../src/lib/storage.ts";
import {
  SyncEngine,
  type RemoteStore,
  type SyncView,
} from "../src/lib/syncEngine.ts";
import type { AppState } from "../src/lib/types.ts";
import type { RemoteCopy } from "../src/lib/sync.ts";
const fresh = () => structuredClone(emptyState);
const note = (value: string) => ({ ...fresh(), notes: { lesson: value } });
function storage() {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    key: (i: number) => [...values.keys()][i] ?? null,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
}
function server() {
  const rows = new Map<string, RemoteCopy>();
  const api: RemoteStore = {
    pull: async (id) => structuredClone(rows.get(id) ?? null),
    push: async (id, state, revision) => {
      const old = rows.get(id);
      if ((old?.revision ?? null) !== revision)
        throw new Error("Revision conflict");
      const row = {
        state: structuredClone(state),
        revision: (revision ?? 0) + 1,
        updatedAt: new Date().toISOString(),
      };
      rows.set(id, row);
      return row;
    },
  };
  return { rows, api };
}
function device(id: string, remote: RemoteStore, diskStorage = storage()) {
  const disk = accountPersistence(diskStorage, id);
  let state: AppState = JSON.parse(disk.readRaw() ?? JSON.stringify(fresh()));
  let view: SyncView | null = null;
  const engine = new SyncEngine(
    id,
    remote,
    disk,
    () => state,
    (s) => {
      state = s;
    },
    (v) => {
      view = v;
    },
  );
  return {
    engine,
    disk,
    get state() {
      return state;
    },
    get view() {
      return view as SyncView | null;
    },
    edit(s: AppState) {
      state = s;
      disk.write(s);
    },
  };
}
test("A/C: guest and legacy data never enter A or B; switch back restores A", async () => {
  const local = storage();
  local.setItem(storageKey, JSON.stringify(note("legacy")));
  const guest = accountPersistence(local, null);
  assert.equal(JSON.parse(guest.readRaw()!).notes.lesson, "legacy");
  const remote = server();
  const a = device("A", remote.api, local);
  a.edit(note("private A"));
  await a.engine.sync();
  a.engine.dispose();
  const b = device("B", remote.api, local);
  assert.deepEqual(b.state, fresh());
  b.edit(note("private B"));
  await b.engine.sync();
  assert.equal(remote.rows.get("A")?.state.notes.lesson, "private A");
  assert.equal(remote.rows.get("B")?.state.notes.lesson, "private B");
  assert.equal(device("A", remote.api, local).state.notes.lesson, "private A");
  assert.equal(JSON.parse(local.getItem(storageKey)!).notes.lesson, "legacy");
});
test("B/E: same account on two devices, reload baseline then pull newer remote", async () => {
  const remote = server();
  const diskA = storage();
  let a = device("A", remote.api, diskA);
  const b = device("A", remote.api);
  a.edit(note("phone"));
  await a.engine.sync();
  await b.engine.sync();
  assert.equal(b.state.notes.lesson, "phone");
  b.edit({
    ...b.state,
    notes: { lesson: "PC" },
    lastLessonId: "lesson",
    lessonPositions: { lesson: 3 },
  });
  await b.engine.sync();
  a.engine.dispose();
  a = device("A", remote.api, diskA);
  await a.engine.sync();
  assert.equal(a.state.notes.lesson, "PC");
  assert.equal(a.state.lessonPositions?.lesson, 3);
});
test("D: offline edits survive restart and retry", async () => {
  const remote = server();
  const disk = storage();
  const a = device("A", remote.api, disk);
  a.edit(note("before"));
  await a.engine.sync();
  a.engine.dispose();
  const offline = device(
    "A",
    {
      ...remote.api,
      pull: async () => {
        throw new Error("offline");
      },
    },
    disk,
  );
  offline.edit(note("offline edit"));
  await offline.engine.sync();
  assert.equal(offline.view?.status, "error");
  offline.engine.dispose();
  const online = device("A", remote.api, disk);
  await online.engine.sync();
  assert.equal(remote.rows.get("A")?.state.notes.lesson, "offline edit");
});
test("simultaneous edits produce a conflict, both copies recoverable after explicit choice", async () => {
  const remote = server();
  const a = device("A", remote.api);
  const b = device("A", remote.api);
  a.edit(note("base"));
  await a.engine.sync();
  await b.engine.sync();
  a.edit(note("phone edit"));
  b.edit(note("PC edit"));
  await a.engine.sync();
  await b.engine.sync();
  assert.equal(b.view?.status, "conflict");
  assert.equal(b.state.notes.lesson, "PC edit");
  await b.engine.choose("remote");
  assert.equal(b.state.notes.lesson, "phone edit");
  assert.equal(b.disk.recoveries().length, 2);
});
test("late response after logout cannot replace data or save a checkpoint", async () => {
  let release!: (r: RemoteCopy | null) => void;
  const delayed = new Promise<RemoteCopy | null>((r) => {
    release = r;
  });
  const d = device("A", {
    pull: () => delayed,
    push: async () => {
      throw Error("must not push");
    },
  });
  const task = d.engine.sync();
  d.engine.dispose();
  release({
    state: note("secret"),
    revision: 1,
    updatedAt: new Date().toISOString(),
  });
  await task;
  assert.deepEqual(d.state, fresh());
  assert.equal(d.disk.checkpoint(), null);
});
test("editing while pull is pending preserves local change as a conflict", async () => {
  let release!: (r: RemoteCopy | null) => void;
  const delayed = new Promise<RemoteCopy | null>((r) => {
    release = r;
  });
  const d = device("A", {
    pull: () => delayed,
    push: async () => {
      throw Error("must not push");
    },
  });
  const task = d.engine.sync();
  d.edit(note("new local"));
  release({
    state: note("remote"),
    revision: 1,
    updatedAt: new Date().toISOString(),
  });
  await task;
  assert.equal(d.view?.status, "conflict");
  assert.equal(d.state.notes.lesson, "new local");
});
test("two tabs cannot silently overwrite the same local account", () => {
  const local = storage();
  const a = accountPersistence(local, "A");
  const b = accountPersistence(local, "A");
  a.readRaw();
  b.readRaw();
  a.write(note("a"));
  assert.throws(() => b.write(note("b")), /onglet/);
  assert.equal(JSON.parse(local.getItem(accountKey("A"))!).notes.lesson, "a");
  assert.equal(b.recoveries().length, 1);
});
test("corrupt and future saves are preserved during guest migration", () => {
  for (const raw of [
    "{invalid",
    JSON.stringify({ ...fresh(), schemaVersion: 999 }),
  ]) {
    const local = storage();
    local.setItem(storageKey, raw);
    assert.equal(accountPersistence(local, null).readRaw(), raw);
    assert.equal(local.getItem(storageKey), raw);
  }
});
test("delete device account copies leaves guest and other accounts intact", () => {
  const local = storage();
  const a = accountPersistence(local, "A");
  const b = accountPersistence(local, "B");
  a.write(note("a"));
  b.write(note("b"));
  a.preserve(note("backup"));
  local.setItem(storageKey, "legacy");
  a.deleteDeviceCopy();
  assert.equal(a.readRaw(), null);
  assert.equal(a.recoveries().length, 0);
  assert.ok(b.readRaw());
  assert.equal(local.getItem(storageKey), "legacy");
});

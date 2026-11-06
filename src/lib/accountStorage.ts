import type { AppState } from "./types";
import { emptyState, parseState, storageKey } from "./storage.ts";
import { createLocalAdapter, type PersistenceAdapter } from "./persistence.ts";

export type SyncCheckpoint = {
  json: string;
  revision: number;
  updatedAt: string;
};
type StorageLike = Pick<
  Storage,
  "getItem" | "setItem" | "removeItem" | "key" | "length"
>;
export const accountKey = (id: string | null) =>
  `${storageKey}:${id ? `user:${id}` : "guest"}`;

/** Legacy saves are copied only to the guest area and are never deleted. */
export function accountPersistence(storage: StorageLike, id: string | null) {
  const key = accountKey(id);
  let head: string | null;
  let initialized = false;
  const adapter = createLocalAdapter(storage, key);
  const readRaw = () => {
    let raw = adapter.readRaw();
    if (!id && raw === null) {
      const legacy = storage.getItem(storageKey);
      if (legacy !== null) {
        storage.setItem(key, legacy); // Preserve even an unreadable legacy save.
        raw = legacy;
      }
    }
    head = raw;
    initialized = true;
    return raw;
  };
  return {
    ...adapter,
    readRaw,
    write(state: AppState) {
      if (!initialized) readRaw();
      const raw = JSON.stringify(state);
      if (storage.getItem(key) !== head && storage.getItem(key) !== raw) {
        // Another tab changed this account. Save this tab's version separately.
        storage.setItem(`${key}:recovery:${crypto.randomUUID()}`, raw);
        throw new Error(
          "Un autre onglet a modifié cet espace. Votre version est conservée en récupération. Exportez-la puis rechargez la page.",
        );
      }
      adapter.write(state);
      head = raw;
    },
    clear() {
      adapter.clear();
      head = null;
      initialized = true;
    },
    checkpoint(): SyncCheckpoint | null {
      const raw = storage.getItem(`${key}:sync`);
      if (!raw) return null;
      const value = JSON.parse(raw) as SyncCheckpoint;
      if (
        typeof value.json !== "string" ||
        !Number.isSafeInteger(value.revision) ||
        value.revision < 1 ||
        !Number.isFinite(Date.parse(value.updatedAt))
      )
        throw new Error(
          "Métadonnées de synchronisation invalides. Exportez vos données avant de réparer cet espace.",
        );
      parseState(value.json);
      return value;
    },
    saveCheckpoint(value: SyncCheckpoint) {
      storage.setItem(`${key}:sync`, JSON.stringify(value));
    },
    preserve(state: AppState) {
      storage.setItem(
        `${key}:recovery:${crypto.randomUUID()}`,
        JSON.stringify(state),
      );
    },
    recoveries() {
      const copies: unknown[] = [];
      for (let i = 0; i < storage.length; i++) {
        const entry = storage.key(i);
        if (entry?.startsWith(`${key}:recovery:`))
          copies.push({ key: entry, raw: storage.getItem(entry) });
      }
      return copies;
    },
    deleteDeviceCopy() {
      const keys: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const entry = storage.key(i);
        if (entry === key || entry?.startsWith(`${key}:`)) keys.push(entry);
      }
      keys.forEach((entry) => storage.removeItem(entry));
      head = null;
    },
  } satisfies PersistenceAdapter & Record<string, unknown>;
}
export type AccountPersistence = ReturnType<typeof accountPersistence>;
export function emptyAccount(): AppState {
  return structuredClone(emptyState);
}

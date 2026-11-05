import type { AppState } from "./types";
import { emptyState, parseState, storageKey } from "./storage.ts";

/**
 * Where the application state lives. The interface is synchronous and
 * local-first: the browser copy stays the source the screens read. A future
 * account sync (roadmap step 2) will replicate this copy to a server instead
 * of replacing it, so a network failure never blocks learning.
 */
export interface PersistenceAdapter {
  /** Short, user-facing name of the storage, e.g. for the status badge. */
  readonly label: string;
  /** Raw saved text, or null when nothing is saved. May throw if blocked. */
  readRaw(): string | null;
  /** Persists a full state. Throws when the storage refuses the write. */
  write(state: AppState): void;
  /** Deletes the saved state. Throws when the storage refuses it. */
  clear(): void;
}

export function createLocalAdapter(
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem">,
  key = storageKey,
): PersistenceAdapter {
  return {
    label: "Données locales",
    readRaw: () => storage.getItem(key),
    write: (state) => storage.setItem(key, JSON.stringify(state)),
    clear: () => storage.removeItem(key),
  };
}

/** In-memory adapter for tests and for browsers that refuse storage. */
export function createMemoryAdapter(initial: string | null = null) {
  let raw = initial;
  const adapter: PersistenceAdapter & { snapshot(): string | null } = {
    label: "Session en mémoire",
    readRaw: () => raw,
    write: (state) => {
      raw = JSON.stringify(state);
    },
    clear: () => {
      raw = null;
    },
    snapshot: () => raw,
  };
  return adapter;
}

/**
 * Reads and validates the saved state. An unreadable save is preserved (never
 * cleared here) so the person can export it before deciding to reset.
 */
export function readStateFrom(adapter: PersistenceAdapter): {
  state: AppState;
  error: string | null;
} {
  try {
    const raw = adapter.readRaw();
    return {
      state: raw ? parseState(raw) : structuredClone(emptyState),
      error: null,
    };
  } catch {
    return {
      state: structuredClone(emptyState),
      error:
        "La sauvegarde locale est inaccessible ou illisible. Elle a été conservée ; exportez-la avant de réinitialiser. Les changements restent en mémoire.",
    };
  }
}

/** The browser adapter, created lazily so non-browser code can import this module. */
let browserAdapter: PersistenceAdapter | null = null;
export function browserPersistence(): PersistenceAdapter {
  browserAdapter ??= createLocalAdapter(localStorage);
  return browserAdapter;
}

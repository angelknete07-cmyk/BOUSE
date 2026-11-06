import type { AppState } from "./types";

/** The server copy of the learning state, as last read. */
export type RemoteCopy = {
  state: AppState;
  revision: number;
  updatedAt: string;
};

export type SyncPlan =
  /** Nothing on the server yet: the local state becomes the first copy. */
  | { kind: "push-first" }
  /** Nothing worth keeping locally: adopt the server copy. */
  | { kind: "pull" }
  /** Both sides hold the same content. */
  | { kind: "in-sync" }
  /** Nothing anywhere: wait for the first real change. */
  | { kind: "nothing" }
  /** Both sides differ: the person decides, nothing is overwritten silently. */
  | { kind: "conflict" };

/** A state with no profile and no learning trace carries nothing to protect. */
export function isEmptyState(state: AppState): boolean {
  return (
    state.profile === null &&
    state.attempts.length === 0 &&
    state.projects.length === 0 &&
    Object.values(state.notes).every((note) => !note.trim()) &&
    !state.reviewEvents?.length &&
    !state.experiments?.length &&
    !state.decisions?.length &&
    !state.simulations?.length
  );
}

/** Stable serialisation, so key order never fakes a difference. */
export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => item !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

/**
 * First reconciliation after sign-in. Local-first: the server never replaces
 * a non-empty local state without an explicit choice.
 */
export function planInitialSync(
  local: AppState,
  remote: RemoteCopy | null,
): SyncPlan {
  const localEmpty = isEmptyState(local);
  if (!remote) return localEmpty ? { kind: "nothing" } : { kind: "push-first" };
  if (localEmpty) return { kind: "pull" };
  return canonicalJson(local) === canonicalJson(remote.state)
    ? { kind: "in-sync" }
    : { kind: "conflict" };
}

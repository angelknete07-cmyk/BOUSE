import { useCallback, useEffect, useRef, useState } from "react";
import type { AppState } from "./types";
import {
  clearSignInCode,
  currentUser,
  deleteAccount,
  hasSignInCode,
  isCloudConfigured,
  onAuthChange,
  pullRemote,
  pushRemote,
  sendSignInLink,
  signOut,
  SyncConflictError,
} from "./cloud";
import { canonicalJson, planInitialSync, type RemoteCopy } from "./sync";

export type CloudStatus =
  | "off"
  | "signed-out"
  | "checking"
  | "synced"
  | "saving"
  | "conflict"
  | "error";

export type CloudSync = {
  status: CloudStatus;
  email: string | null;
  lastSyncedAt: string | null;
  message: string | null;
  conflict: RemoteCopy | null;
  sendLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  syncNow: () => Promise<void>;
  keepLocal: () => Promise<void>;
  keepRemote: () => void;
  deleteAccount: () => Promise<void>;
};

const PUSH_DELAY_MS = 1500;
const describe = (error: unknown) =>
  error instanceof Error ? error.message : "Erreur inconnue.";

/**
 * Local-first account sync. The browser state stays authoritative for the
 * screens; the server copy is replicated after each change and never
 * overwrites a non-empty local state without an explicit choice.
 */
export function useCloudSync(
  state: AppState,
  replaceState: (next: AppState) => void,
): CloudSync {
  const configured = isCloudConfigured();
  const [status, setStatus] = useState<CloudStatus>(
    configured ? "checking" : "off",
  );
  const [email, setEmail] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [conflict, setConflict] = useState<RemoteCopy | null>(null);
  const userId = useRef<string | null>(null);
  const revision = useRef<number | null>(null);
  const syncedJson = useRef<string | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const markSynced = useCallback(
    (json: string, rev: number | null, at: string | null) => {
      syncedJson.current = json;
      revision.current = rev;
      setLastSyncedAt(at);
      setConflict(null);
      setMessage(null);
      setStatus("synced");
    },
    [],
  );

  const reconcile = useCallback(
    async (id: string) => {
      setStatus("checking");
      try {
        const local = stateRef.current;
        const remote = await pullRemote(id);
        const plan = planInitialSync(local, remote);
        if (plan.kind === "push-first") {
          const written = await pushRemote(id, local, null);
          markSynced(canonicalJson(local), written.revision, written.updatedAt);
        } else if (plan.kind === "pull" && remote) {
          replaceState(remote.state);
          markSynced(
            canonicalJson(remote.state),
            remote.revision,
            remote.updatedAt,
          );
        } else if (plan.kind === "in-sync" && remote) {
          markSynced(canonicalJson(local), remote.revision, remote.updatedAt);
        } else if (plan.kind === "nothing") {
          markSynced(canonicalJson(local), null, null);
        } else if (remote) {
          setConflict(remote);
          revision.current = remote.revision;
          setStatus("conflict");
        }
      } catch (error) {
        setMessage(describe(error));
        setStatus("error");
      }
    },
    [markSynced, replaceState],
  );

  // Session discovery, sign-in link exchange and cross-tab auth changes.
  useEffect(() => {
    if (!configured) return;
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    const apply = (user: { id: string; email?: string } | null) => {
      if (cancelled) return;
      if (!user) {
        userId.current = null;
        setEmail(null);
        setStatus("signed-out");
        return;
      }
      if (userId.current === user.id) return;
      userId.current = user.id;
      setEmail(user.email ?? null);
      void reconcile(user.id);
    };
    (async () => {
      try {
        const fromLink = hasSignInCode();
        apply(await currentUser());
        if (fromLink) clearSignInCode();
        unsubscribe = await onAuthChange(apply);
      } catch (error) {
        setMessage(describe(error));
        setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [configured, reconcile]);

  const push = useCallback(async () => {
    const id = userId.current;
    if (!id) return;
    const local = stateRef.current;
    const json = canonicalJson(local);
    if (json === syncedJson.current) return;
    setStatus("saving");
    try {
      const written = await pushRemote(id, local, revision.current);
      markSynced(json, written.revision, written.updatedAt);
    } catch (error) {
      if (error instanceof SyncConflictError) {
        try {
          const remote = await pullRemote(id);
          if (remote) {
            setConflict(remote);
            revision.current = remote.revision;
          }
          setMessage(error.message);
          setStatus("conflict");
        } catch (pullError) {
          setMessage(describe(pullError));
          setStatus("error");
        }
      } else {
        setMessage(describe(error));
        setStatus("error");
      }
    }
  }, [markSynced]);

  // Replicate local changes after a short pause, only while in sync.
  useEffect(() => {
    if (status !== "synced" || !userId.current) return;
    if (canonicalJson(state) === syncedJson.current) return;
    const timer = setTimeout(() => void push(), PUSH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [state, status, push]);

  return {
    status,
    email,
    lastSyncedAt,
    message,
    conflict,
    sendLink: async (address) => {
      setMessage(null);
      await sendSignInLink(address);
    },
    signOut: async () => {
      await signOut();
      userId.current = null;
      syncedJson.current = null;
      revision.current = null;
      setEmail(null);
      setConflict(null);
      setStatus("signed-out");
    },
    syncNow: async () => {
      const id = userId.current;
      if (!id) return;
      if (status === "error") await reconcile(id);
      else await push();
    },
    keepLocal: async () => {
      // Overwrite the server copy, checked against the revision just read.
      syncedJson.current = null;
      await push();
    },
    keepRemote: () => {
      if (!conflict) return;
      replaceState(conflict.state);
      markSynced(
        canonicalJson(conflict.state),
        conflict.revision,
        conflict.updatedAt,
      );
    },
    deleteAccount: async () => {
      await deleteAccount();
      userId.current = null;
      syncedJson.current = null;
      revision.current = null;
      setEmail(null);
      setConflict(null);
      setStatus("signed-out");
      setMessage(
        "Compte et copie en ligne supprimés. Les données de ce navigateur sont conservées.",
      );
    },
  };
}

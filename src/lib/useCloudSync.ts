import { useEffect, useRef, useState } from "react";
import type { AppState } from "./types";
import {
  deleteAccount,
  isCloudConfigured,
  pullRemote,
  pushRemote,
  sendSignInLink,
  signOut,
} from "./cloud";
import { SyncEngine, type SyncView } from "./syncEngine";
import type { AccountPersistence } from "./accountStorage";
import type { AccountUser } from "../components/AccountBoundary";
import type { RemoteCopy } from "./sync";
import { downloadFile } from "./storage";

export type CloudStatus = SyncView["status"] | "off" | "signed-out" | "offline";
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
  keepRemote: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  exportRecoveries: () => void;
};
export function useCloudSync(
  state: AppState,
  replaceState: (state: AppState) => void,
  user: AccountUser | null,
  disk: AccountPersistence,
  storageError: string | null,
): CloudSync {
  const [view, setView] = useState<SyncView>({
    status: "checking",
    message: null,
    conflict: null,
    lastSyncedAt: null,
  });
  const [online, setOnline] = useState(navigator.onLine);
  const stateRef = useRef(state);
  stateRef.current = state;
  const engine = useRef<SyncEngine | null>(null);
  const blocked = useRef(storageError);
  blocked.current = storageError;
  useEffect(() => {
    if (!user) return;
    const instance = new SyncEngine(
      user.id,
      { pull: pullRemote, push: pushRemote },
      disk,
      () => stateRef.current,
      (next) => {
        stateRef.current = next;
        replaceState(next);
      },
      setView,
    );
    engine.current = instance;
    const sync = () => {
      setOnline(navigator.onLine);
      if (navigator.onLine && !blocked.current) void instance.sync();
    };
    sync();
    const interval = setInterval(sync, 15000);
    addEventListener("online", sync);
    addEventListener("offline", sync);
    addEventListener("focus", sync);
    const visible = () => {
      if (document.visibilityState === "visible") sync();
    };
    document.addEventListener("visibilitychange", visible);
    return () => {
      instance.dispose();
      engine.current = null;
      clearInterval(interval);
      removeEventListener("online", sync);
      removeEventListener("offline", sync);
      removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [user?.id, disk, replaceState]);
  useEffect(() => {
    if (!user || storageError || !online || view.status === "conflict") return;
    const timer = setTimeout(() => void engine.current?.sync(), 1000);
    return () => clearTimeout(timer);
  }, [state, user?.id, online, storageError]);
  return {
    ...view,
    status: !isCloudConfigured()
      ? "off"
      : !user
        ? "signed-out"
        : storageError
          ? "error"
          : !online
            ? "offline"
            : view.status,
    message:
      storageError ??
      (!online && user
        ? "Hors connexion. Les changements restent sur cet appareil et seront synchronisés au retour du réseau."
        : view.message),
    email: user?.email ?? null,
    sendLink: sendSignInLink,
    signOut: async () => {
      disk.write(stateRef.current);
      await signOut();
    },
    syncNow: async () => {
      if (storageError) throw new Error(storageError);
      await engine.current?.sync();
    },
    keepLocal: async () => {
      await engine.current?.choose("local");
    },
    keepRemote: async () => {
      await engine.current?.choose("remote");
    },
    deleteAccount: async () => {
      // The confirmation in the UI explicitly includes this device's account copies.
      await deleteAccount();
      engine.current?.dispose();
      disk.deleteDeviceCopy();
      await signOut();
    },
    exportRecoveries: () =>
      downloadFile(
        "bouse-copies-recuperation.json",
        JSON.stringify(disk.recoveries(), null, 2),
      ),
  };
}

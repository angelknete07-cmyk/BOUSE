import type { AppState } from "./types";
import type { AccountPersistence, SyncCheckpoint } from "./accountStorage.ts";
import { canonicalJson, isEmptyState, type RemoteCopy } from "./sync.ts";

export type SyncStatus =
  "checking" | "synced" | "saving" | "conflict" | "error";
export type SyncView = {
  status: SyncStatus;
  message: string | null;
  conflict: RemoteCopy | null;
  lastSyncedAt: string | null;
};
export type RemoteStore = {
  pull(id: string): Promise<RemoteCopy | null>;
  push(
    id: string,
    state: AppState,
    revision: number | null,
  ): Promise<{ revision: number; updatedAt: string }>;
};
/** One engine per mounted account. No asynchronous result survives dispose(). */
export class SyncEngine {
  private active = true;
  private running: Promise<void> | null = null;
  private conflict: RemoteCopy | null = null;
  private base: SyncCheckpoint | null = null;
  private checkpointError: unknown = null;
  private id: string;
  private remote: RemoteStore;
  private disk: AccountPersistence;
  private read: () => AppState;
  private replace: (state: AppState) => void;
  private notify: (view: SyncView) => void;
  constructor(
    id: string,
    remote: RemoteStore,
    disk: AccountPersistence,
    read: () => AppState,
    replace: (state: AppState) => void,
    notify: (view: SyncView) => void,
  ) {
    this.id = id;
    this.remote = remote;
    this.disk = disk;
    this.read = read;
    this.replace = replace;
    this.notify = notify;
    try {
      this.base = disk.checkpoint();
    } catch (error) {
      this.checkpointError = error;
    }
  }
  dispose() {
    this.active = false;
  }
  private view(status: SyncStatus, message: string | null = null) {
    if (this.active)
      this.notify({
        status,
        message,
        conflict: this.conflict,
        lastSyncedAt: this.base?.updatedAt ?? null,
      });
  }
  private mark(state: AppState, revision: number, updatedAt: string) {
    if (!this.active) return;
    const checkpoint = { json: canonicalJson(state), revision, updatedAt };
    this.disk.saveCheckpoint(checkpoint);
    this.base = checkpoint;
    this.conflict = null;
    this.view("synced");
  }
  sync(): Promise<void> {
    if (!this.active) return Promise.resolve();
    if (this.running) return this.running;
    this.running = this.reconcile()
      .catch((error) =>
        this.view(
          "error",
          error instanceof Error
            ? error.message
            : "Synchronisation interrompue.",
        ),
      )
      .finally(() => {
        this.running = null;
      });
    return this.running;
  }
  private async reconcile() {
    if (this.checkpointError) throw this.checkpointError;
    this.view("checking");
    const remote = await this.remote.pull(this.id);
    if (!this.active) return;
    // Read AFTER the await: the learner may have edited while the network was slow.
    const local = structuredClone(this.read());
    this.disk.write(local); // Never acknowledge a remote copy without durable local data.
    const json = canonicalJson(local);
    const remoteJson = remote && canonicalJson(remote.state);
    if (remote && json === remoteJson) {
      this.mark(local, remote.revision, remote.updatedAt);
      return;
    }
    if (remote && (this.base ? json === this.base.json : isEmptyState(local))) {
      this.disk.write(remote.state);
      this.replace(remote.state);
      this.mark(remote.state, remote.revision, remote.updatedAt);
      return;
    }
    if (remote && (!this.base || remoteJson !== this.base.json)) {
      this.conflict = remote;
      this.view(
        "conflict",
        "Les deux appareils ont changé. Choisissez une version ; aucune fusion automatique.",
      );
      return;
    }
    if (!remote && this.base)
      throw new Error(
        "La copie en ligne a disparu. Aucun renvoi automatique : exportez votre sauvegarde et reconnectez-vous.",
      );
    if (!remote && isEmptyState(local)) {
      this.view("synced");
      return;
    }
    await this.push(local, remote?.revision ?? null);
  }
  private async push(local: AppState, revision: number | null) {
    this.view("saving");
    const written = await this.remote.push(this.id, local, revision);
    if (this.active) this.mark(local, written.revision, written.updatedAt);
  }
  async choose(which: "local" | "remote") {
    if (!this.active || !this.conflict || this.running) return;
    const selected = this.conflict;
    const local = structuredClone(this.read());
    // Both versions remain recoverable before either explicit replacement.
    this.disk.preserve(local);
    this.disk.preserve(selected.state);
    if (which === "remote") {
      this.disk.write(selected.state);
      this.replace(selected.state);
      this.mark(selected.state, selected.revision, selected.updatedAt);
    } else {
      this.running = this.push(local, selected.revision)
        .catch((error) => {
          this.view("error", String(error));
        })
        .finally(() => {
          this.running = null;
        });
      await this.running;
    }
  }
}

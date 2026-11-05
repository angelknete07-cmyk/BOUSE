import { useState, type FormEvent } from "react";
import type { CloudSync } from "../lib/useCloudSync";
import { downloadFile } from "../lib/storage";
import type { AppState } from "../lib/types";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Paris",
});

const statusText: Record<CloudSync["status"], string> = {
  off: "Non configurée",
  "signed-out": "Non connecté",
  checking: "Vérification…",
  synced: "Synchronisé",
  saving: "Enregistrement en ligne…",
  conflict: "Deux versions différentes",
  error: "Synchronisation interrompue",
};

/** Account and sync controls. Honest when the installation has no backend. */
export function CloudPanel({
  cloud,
  state,
}: {
  cloud: CloudSync;
  state: AppState;
}) {
  const [address, setAddress] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmRemote, setConfirmRemote] = useState(false);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setLocalError(null);
    try {
      await action();
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "Erreur inconnue.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    await run(async () => {
      await cloud.sendLink(address.trim());
      setSent(true);
    });
  }

  return (
    <section className="panel cloud-panel" aria-labelledby="cloud-title">
      <div className="cloud-heading">
        <h2 id="cloud-title">Compte et synchronisation</h2>
        <span className={`cloud-status is-${cloud.status}`}>
          <i aria-hidden="true" />
          {statusText[cloud.status]}
        </span>
      </div>

      {cloud.status === "off" && (
        <p className="muted">
          La synchronisation n’est pas configurée sur cette installation. Vos
          données restent uniquement dans ce navigateur ; l’export JSON reste
          votre sauvegarde.
        </p>
      )}

      {cloud.status === "signed-out" && (
        <form className="cloud-form" onSubmit={submit}>
          <p className="muted">
            Connectez-vous pour retrouver votre progression sur un autre
            appareil. Vos données restent d’abord dans ce navigateur, puis une
            copie est enregistrée dans votre compte.
          </p>
          <label className="field">
            Adresse e-mail
            <input
              type="email"
              required
              autoComplete="email"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </label>
          <button className="button primary" type="submit" disabled={busy}>
            Recevoir un lien de connexion
          </button>
          {sent && (
            <p className="muted" role="status">
              Lien envoyé. Ouvrez-le depuis cet appareil pour vous connecter.
            </p>
          )}
        </form>
      )}

      {cloud.email && cloud.status !== "signed-out" && (
        <div className="cloud-account">
          <p>
            Connecté : <strong>{cloud.email}</strong>
          </p>
          <p className="muted">
            {cloud.lastSyncedAt
              ? `Dernière copie en ligne : ${dateFormat.format(new Date(cloud.lastSyncedAt))}.`
              : "Aucune copie en ligne pour l’instant : elle sera créée au prochain changement."}
          </p>
        </div>
      )}

      {cloud.status === "conflict" && cloud.conflict && (
        <div className="cloud-conflict" role="alert">
          <p>
            Ce navigateur et votre compte contiennent deux versions différentes.
            Rien n’a été remplacé. Copie en ligne du{" "}
            {dateFormat.format(new Date(cloud.conflict.updatedAt))}.
          </p>
          <div className="actions">
            <button
              className="button secondary"
              type="button"
              onClick={() =>
                downloadFile(
                  "bouse-sauvegarde-avant-choix.json",
                  JSON.stringify(state, null, 2),
                )
              }
            >
              Exporter ce navigateur d’abord
            </button>
            <button
              className="button secondary"
              type="button"
              disabled={busy}
              onClick={() => run(cloud.keepLocal)}
            >
              Garder ce navigateur
            </button>
            {confirmRemote ? (
              <button
                className="button danger"
                type="button"
                onClick={() => {
                  cloud.keepRemote();
                  setConfirmRemote(false);
                }}
              >
                Confirmer : remplacer ce navigateur
              </button>
            ) : (
              <button
                className="button secondary"
                type="button"
                onClick={() => setConfirmRemote(true)}
              >
                Garder la copie en ligne
              </button>
            )}
          </div>
        </div>
      )}

      {(cloud.message || localError) && (
        <p className="cloud-message" role="alert">
          {localError ?? cloud.message}
        </p>
      )}

      {cloud.email && cloud.status !== "signed-out" && (
        <div className="actions">
          <button
            className="button secondary"
            type="button"
            disabled={busy || cloud.status === "conflict"}
            onClick={() => run(cloud.syncNow)}
          >
            Synchroniser maintenant
          </button>
          <button
            className="button secondary"
            type="button"
            disabled={busy}
            onClick={() => run(cloud.signOut)}
          >
            Se déconnecter
          </button>
          {confirmDelete ? (
            <button
              className="button danger"
              type="button"
              disabled={busy}
              onClick={() => run(cloud.deleteAccount)}
            >
              Confirmer la suppression du compte
            </button>
          ) : (
            <button
              className="button secondary"
              type="button"
              onClick={() => setConfirmDelete(true)}
            >
              Supprimer mon compte en ligne
            </button>
          )}
        </div>
      )}
      {confirmDelete && (
        <p className="muted">
          Supprime le compte et la copie en ligne. Les données de ce navigateur
          sont conservées.
        </p>
      )}
    </section>
  );
}

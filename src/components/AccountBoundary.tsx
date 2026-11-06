import { PwaUpdateNotice } from "./PwaUpdateNotice";
import { useEffect, useState, type ReactNode } from "react";
import {
  cloudClient,
  isCloudConfigured,
  clearSignInCode,
  hasSignInCode,
} from "../lib/cloud";
import {
  accountPersistence,
  type AccountPersistence,
} from "../lib/accountStorage";

export type AccountUser = { id: string; email?: string };
export function AccountBoundary({
  children,
}: {
  children: (user: AccountUser | null, disk: AccountPersistence) => ReactNode;
}) {
  const [session, setSession] = useState<{
    user: AccountUser | null;
    disk: AccountPersistence;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    let stop: (() => void) | undefined;
    const apply = (user: AccountUser | null) => {
      if (!active) return;
      setSession((previous) =>
        previous && previous.user?.id === user?.id
          ? previous
          : {
              user,
              disk: accountPersistence(
                {
                  getItem: (key) => localStorage.getItem(key),
                  setItem: (key, value) => localStorage.setItem(key, value),
                  removeItem: (key) => localStorage.removeItem(key),
                  key: (index) => localStorage.key(index),
                  get length() {
                    return localStorage.length;
                  },
                },
                user?.id ?? null,
              ),
            },
      );
    };
    if (!isCloudConfigured()) {
      apply(null);
      return () => {
        active = false;
      };
    }
    void (async () => {
      const client = await cloudClient();
      if (!active) return;
      // INITIAL_SESSION is emitted by the SDK after PKCE URL processing.
      const { data } = client.auth.onAuthStateChange((_event, value) =>
        apply(value?.user ?? null),
      );
      stop = () => data.subscription.unsubscribe();
      const { error: sessionError } = await client.auth.getSession();
      if (!active) return;
      if (hasSignInCode()) clearSignInCode();
      if (sessionError)
        setError(
          "Le lien de connexion est invalide ou expiré. Demandez un nouveau lien depuis ce navigateur.",
        );
    })().catch(() => {
      if (active)
        setError(
          "Impossible de charger la session. Rechargez la page pour réessayer.",
        );
    });
    return () => {
      active = false;
      stop?.();
    };
  }, []);
  return (
    <>
      <PwaUpdateNotice />
      {error && (
        <p className="storage-banner" role="alert">
          {error}
        </p>
      )}
      {session ? (
        children(session.user, session.disk)
      ) : (
        <main className="panel" aria-busy="true">
          <p>Ouverture de votre espace…</p>
          <button
            className="button secondary"
            onClick={() => location.reload()}
          >
            Réessayer
          </button>
        </main>
      )}
    </>
  );
}

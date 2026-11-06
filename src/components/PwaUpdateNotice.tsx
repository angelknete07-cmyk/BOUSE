import { useEffect, useState } from "react";

/** Let the browser activate after all old tabs close: never reload an editor. */
export function PwaUpdateNotice() {
  const [waiting, setWaiting] = useState(false);
  useEffect(() => {
    if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
    let active = true;
    const check = () => {
      void navigator.serviceWorker.getRegistration().then((registration) => {
        if (active) setWaiting(Boolean(registration?.waiting));
      });
    };
    const interval = setInterval(check, 30000);
    check();
    addEventListener("focus", check);
    return () => {
      active = false;
      clearInterval(interval);
      removeEventListener("focus", check);
    };
  }, []);
  return waiting ? (
    <p className="storage-banner" role="status">
      Une mise à jour est prête. Terminez votre saisie, puis fermez tous les
      onglets BOUSE et rouvrez l’application. Vos sauvegardes sont conservées.
    </p>
  ) : null;
}

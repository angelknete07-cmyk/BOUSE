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
    // Revenir sur l'appli (iPhone : la rouvrir) va chercher la nouvelle version.
    const lookForUpdate = () => {
      void navigator.serviceWorker
        .getRegistration()
        .then((registration) => registration?.update())
        .catch(() => {})
        .then(check);
    };
    lookForUpdate();
    addEventListener("focus", lookForUpdate);
    document.addEventListener("visibilitychange", lookForUpdate);
    return () => {
      active = false;
      clearInterval(interval);
      removeEventListener("focus", lookForUpdate);
      document.removeEventListener("visibilitychange", lookForUpdate);
    };
  }, []);
  // Sur demande seulement : la nouvelle version prend la main, puis la page
  // se recharge. Rien n'est rechargé pendant une saisie sans ce clic.
  async function updateNow() {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration?.waiting) return location.reload();
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => location.reload(),
      { once: true },
    );
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
  }
  return waiting ? (
    <p className="storage-banner" role="status">
      Une nouvelle version de BOUSE est prête. Tes sauvegardes sont conservées.{" "}
      <button
        type="button"
        className="text-button"
        onClick={() => void updateNow()}
      >
        Mettre à jour maintenant
      </button>
    </p>
  ) : null;
}

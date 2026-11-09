import { useEffect, useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { Terrain } from "./Terrain";
import { Icon } from "./Icon";

/*
 * Trois conforts pour un vrai débutant (idées 8, 10 et 31 du 9 novembre 2026) :
 * une phrase simple qui dit à quoi sert chaque page, un mode lecture facile,
 * et une courte ouverture animée au lancement.
 */

const read = (key: string, store: () => Storage) => {
  try {
    return store().getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, value: string | null, store: () => Storage) => {
  try {
    if (value === null) store().removeItem(key);
    else store().setItem(key, value);
  } catch {
    /* Réglage de confort : sans stockage, il dure le temps de la visite. */
  }
};

/** À quoi sert chaque page, ce qu'on y apprend et comment s'en servir. */
export const pageGuides: Record<string, { what: string; how: string }> = {
  home: {
    what: "Ton point de départ : la prochaine leçon à faire et où tu en es.",
    how: "Appuie sur le bouton blanc pour reprendre là où tu t’étais arrêté.",
  },
  academy: {
    what: "Toutes les leçons, rangées par domaine (argent perso, entreprise, IA, bourse…).",
    how: "Choisis un domaine puis une leçon ; chacune se fait en une vingtaine de minutes.",
  },
  reviews: {
    what: "Des petites questions pour ne pas oublier ce que tu as appris.",
    how: "Reviens ici quand des révisions sont prêtes : réponds de mémoire, puis dis si c’était facile.",
  },
  skills: {
    what: "La carte de ce que tu sais faire, et les preuves que tu l’as appris (quiz, notes).",
    how: "Touche une compétence pour voir les leçons qui la construisent.",
  },
  portfolio: {
    what: "Tout ce que tu as produit : quiz réussis, notes, projets.",
    how: "Exporte-le pour le garder ou le montrer.",
  },
  lab: {
    what: "Un bac à sable de chiffres : prix, coûts et ventes, pour voir si une activité gagne de l’argent.",
    how: "Bouge les curseurs : le résultat et le seuil de rentabilité changent tout de suite.",
  },
  simulation: {
    what: "« Et si… ? » : vois l’argent sur ton compte mois par mois pendant six mois.",
    how: "Choisis un cas, change une hypothèse (un client qui paie en retard, par exemple) et compare.",
  },
  ai: {
    what: "Apprends à bien demander quelque chose à une IA comme ChatGPT ou Claude.",
    how: "Écris ta demande ; l’atelier te montre ce qu’il manque pour une réponse utile.",
  },
  incubator: {
    what: "Transforme ce que tu apprends en vrai projet, étape par étape.",
    how: "Crée un projet, puis teste tes idées sur le terrain et note ce que tu observes.",
  },
  radar: {
    what: "Les sites officiels et sérieux pour vérifier une information.",
    how: "Ouvre la source qui correspond à ta question avant de prendre une décision.",
  },
  lexique: {
    what: "Le dictionnaire de l’appli : tous les mots techniques expliqués simplement.",
    how: "Cherche un mot ou parcours une catégorie ; chaque mot renvoie à sa leçon.",
  },
  settings: {
    what: "Ton profil, ton confort de lecture et la sauvegarde de tes données.",
    how: "Change ce que tu veux : tout est enregistré tout de suite.",
  },
};

const GUIDES_HIDDEN = "bouse.guides.hidden";

/** Un bandeau court en tête de page : à quoi elle sert, comment s'en servir. */
export function PageGuide({ route }: { route: string }) {
  const guide = pageGuides[route];
  const [hidden, setHidden] = useState(
    () => read(GUIDES_HIDDEN, () => localStorage) === "1",
  );
  if (!guide) return null;
  const toggle = (value: boolean) => {
    setHidden(value);
    write(GUIDES_HIDDEN, value ? "1" : null, () => localStorage);
  };
  if (hidden)
    return (
      <button
        type="button"
        className="page-guide-show"
        onClick={() => toggle(false)}
      >
        <Icon name="idea" size={15} /> À quoi sert cette page ?
      </button>
    );
  return (
    <aside className="page-guide" aria-label="À quoi sert cette page">
      <Icon name="idea" size={18} />
      <p>
        <strong>{guide.what}</strong>
        <span>{guide.how}</span>
      </p>
      <button
        type="button"
        className="page-guide-hide"
        onClick={() => toggle(true)}
        aria-label="Masquer les explications des pages"
        title="Masquer les explications des pages"
      >
        <Icon name="close" size={15} />
      </button>
    </aside>
  );
}

const EASY = "bouse.reading.easy";
const applyEasy = (on: boolean) => {
  if (on) document.documentElement.dataset.reading = "easy";
  else delete document.documentElement.dataset.reading;
};
/** Applique le mode lecture facile dès l'ouverture, avant le premier rendu. */
export function restoreEasyReading() {
  applyEasy(read(EASY, () => localStorage) === "1");
}

/** Interrupteur du mode lecture facile (préférences). */
export function EasyReadingToggle() {
  const [on, setOn] = useState(() => read(EASY, () => localStorage) === "1");
  useEffect(() => applyEasy(on), [on]);
  return (
    <label className="easy-reading">
      <span>
        <strong>Lecture facile</strong>
        <small>Texte plus grand, lignes plus aérées et plus courtes.</small>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={on}
        onChange={(event) => {
          setOn(event.target.checked);
          write(EASY, event.target.checked ? "1" : null, () => localStorage);
        }}
      />
    </label>
  );
}

const SPLASH = "bouse.splash.seen";
/**
 * Ouverture animée (1,6 s) : la vague s'allume, le B et « BOUSE » apparaissent,
 * puis tout s'efface. Une fois par visite, jamais si l'on a demandé moins
 * d'animations ; un clic ou une touche la passe.
 */
export function SplashIntro() {
  const [phase, setPhase] = useState<"on" | "out" | "off">(() => {
    if (typeof window === "undefined") return "off";
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || read(SPLASH, () => sessionStorage)) return "off";
    write(SPLASH, "1", () => sessionStorage);
    return "on";
  });
  useEffect(() => {
    if (phase === "off") return;
    if (phase === "out") {
      const timer = window.setTimeout(() => setPhase("off"), 420);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setPhase("out"), 1250);
    const skip = () => setPhase("out");
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [phase]);
  if (phase === "off") return null;
  return (
    <div className="splash" data-phase={phase} aria-hidden="true">
      <div className="splash-wave">
        <Terrain />
      </div>
      <div className="splash-mark">
        <BrandLogo size={64} />
        <span>BOUSE</span>
      </div>
    </div>
  );
}

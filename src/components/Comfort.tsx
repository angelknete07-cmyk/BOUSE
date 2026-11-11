import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { Terrain } from "./Terrain";
import { Icon } from "./Icon";
import { hasTour, startTour, useTourIsNew } from "./Guide";

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
  const isNew = useTourIsNew(route);
  if (!guide) return null;
  const toggle = (value: boolean) => {
    setHidden(value);
    write(GUIDES_HIDDEN, value ? "1" : null, () => localStorage);
  };
  const tour = hasTour(route) ? (
    <button
      type="button"
      className="page-guide-tour"
      data-new={isNew ? "" : undefined}
      onClick={() => startTour(route)}
    >
      Me montrer
    </button>
  ) : null;
  if (hidden)
    return (
      <div className="page-guide-row">
        <button
          type="button"
          className="page-guide-show"
          onClick={() => toggle(false)}
        >
          <Icon name="idea" size={15} /> À quoi sert cette page ?
        </button>
        {tour}
      </div>
    );
  return (
    <aside className="page-guide" aria-label="À quoi sert cette page">
      <Icon name="idea" size={18} />
      <p>
        <strong>{guide.what}</strong>
        <span>{guide.how}</span>
      </p>
      {tour}
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
let splashDecision: boolean | null = null;
/** Une fois par visite, jamais si l'on a demandé moins d'animations. */
function shouldPlaySplash() {
  if (splashDecision !== null) return splashDecision;
  splashDecision = false;
  if (typeof window === "undefined" || document.hidden) return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
    return false;
  if (read(SPLASH, () => sessionStorage)) return false;
  write(SPLASH, "1", () => sessionStorage);
  splashDecision = true;
  return true;
}

const visible = (rect: DOMRect) =>
  rect.width > 0 &&
  rect.height > 0 &&
  rect.right > 0 &&
  rect.bottom > 0 &&
  rect.left < innerWidth &&
  rect.top < innerHeight;

/** Le rectangle du texte seul, sans l'espace qui le suit. */
const textRect = (node: Node | null | undefined) => {
  if (!node) return null;
  const range = document.createRange();
  if (node.nodeType === Node.TEXT_NODE) {
    range.setStart(node, 0);
    range.setEnd(node, (node.textContent ?? "").trimEnd().length);
  } else range.selectNodeContents(node);
  return range.getBoundingClientRect();
};

/** Déplacement d'un rectangle vers un autre, depuis le coin haut gauche. */
const flip = (from: DOMRect, to: DOMRect, keepRatio = true) => {
  const sx = to.width / from.width;
  const sy = keepRatio ? sx : to.height / from.height;
  return `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${sx}, ${sy})`;
};

const WORD = "BOUSE";
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";

/**
 * Ouverture animée (≈ 3 s). Sur fond noir, une lumière balaie la vague et
 * l'allume de violet puis de cyan ; le B se dessine ruban par ruban ;
 * « BOUSE » apparaît lettre à lettre. Puis le B et le nom s'envolent se poser
 * à leur vraie place dans la barre de gauche, la vague glisse jusqu'au décor
 * de la page, et l'appli sort du noir. Une fois par visite ; un clic ou une
 * touche la passe ; rien si l'on a demandé moins d'animations.
 */
export function SplashIntro() {
  const [on, setOn] = useState(shouldPlaySplash);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!on || !layer) return;
    const veil = layer.querySelector<HTMLElement>(".splash-veil")!;
    const wave = layer.querySelector<HTMLElement>(".splash-wave")!;
    const lights = layer.querySelectorAll<HTMLElement>(
      ".splash-wave .wave-light",
    );
    const mark = layer.querySelector<HTMLElement>(".splash-mark")!;
    const logo = layer.querySelector<SVGSVGElement>(".splash-mark svg")!;
    const word = layer.querySelector<HTMLElement>(".splash-word")!;
    const letters = word.querySelectorAll<HTMLElement>("span");
    const animations: Animation[] = [];
    const reveals: Animation[] = [];
    let stopped = false;
    let skip = () => {};
    const skipped = new Promise<void>((resolve) => (skip = resolve));
    const run = (
      target: Element,
      keyframes: Keyframe[],
      options: KeyframeAnimationOptions,
    ) => {
      const animation = target.animate(keyframes, { fill: "both", ...options });
      animations.push(animation);
      return animation;
    };
    const wait = (ms: number) =>
      new Promise<void>((resolve) => window.setTimeout(resolve, ms));
    const hurry = () => {
      layer.dataset.fast = "";
      animations.forEach((animation) => animation.finish());
      reveals.forEach((animation) => animation.finish());
      skip();
    };
    window.addEventListener("keydown", hurry);
    layer.addEventListener("pointerdown", hurry);

    // 1. La lumière balaie la vague, puis l'éclaire de violet et de cyan.
    run(
      wave,
      [
        { maskPosition: "100% 0", opacity: 0.2 },
        { maskPosition: "0% 0", opacity: 1 },
      ],
      { duration: 1500, easing: EASE_OUT },
    );
    lights.forEach((light, index) =>
      run(light, [{ opacity: 0 }, { opacity: 1 }], {
        duration: 900,
        delay: 650 + index * 300,
        easing: "ease-out",
      }),
    );

    // 2. Le B se dessine ruban par ruban, s'allume doucement, se pose.
    logo.querySelectorAll("path").forEach((path, index) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      run(path, [{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
        duration: 760,
        delay: 250 + index * 130,
        easing: EASE_IN_OUT,
      });
    });
    run(
      logo,
      [
        {
          transform: "scale(0.88)",
          filter: "drop-shadow(0 0 0 rgb(155 135 245 / 0))",
        },
        {
          transform: "scale(1.02)",
          filter: "drop-shadow(0 0 18px rgb(155 135 245 / 0.34))",
          offset: 0.6,
        },
        {
          transform: "scale(1)",
          filter: "drop-shadow(0 4px 10px rgb(0 0 0 / 0.6))",
        },
      ],
      { duration: 1500, delay: 250, easing: EASE_OUT },
    );

    // 3. « BOUSE » lettre à lettre, qui sort du flou.
    letters.forEach((letter, index) =>
      run(
        letter,
        [
          { opacity: 0, transform: "translateY(0.35em)", filter: "blur(8px)" },
          { opacity: 1, transform: "none", filter: "blur(0)" },
        ],
        { duration: 640, delay: 900 + index * 65, easing: EASE_OUT },
      ),
    );

    // 4. Tout s'envole à sa place et l'appli sort du noir.
    const land = async () => {
      await Promise.race([wait(2050), skipped]);
      if (stopped) return;
      const fast = "fast" in layer.dataset;
      const flight = fast ? 560 : 1000;
      layer.dataset.leaving = "";
      const landed = new Promise<void>((resolve) => (skip = resolve));

      const brand = [
        ...document.querySelectorAll<HTMLElement>(
          ".sidebar .brand, .onboarding-brand",
        ),
      ].find((node) => visible(node.getBoundingClientRect()));
      const brandLogo = brand?.querySelector<SVGSVGElement>(".brand-logo");
      const brandWord = brand?.querySelector("span")?.firstChild;
      const logoTo = brandLogo?.getBoundingClientRect();
      const wordTo = textRect(brandWord);
      const decor = [
        ...document.querySelectorAll<SVGSVGElement>(
          ".page-view .terrain-artwork",
        ),
      ].find(
        (svg) =>
          !svg.closest(".wave-light") && visible(svg.getBoundingClientRect()),
      );

      if (brand && logoTo && wordTo && visible(logoTo)) {
        // Ordinateur : le B et le nom se posent pile sur ceux de la barre.
        brand.style.visibility = "hidden";
        run(
          logo,
          [
            { transform: "none" },
            { transform: flip(logo.getBoundingClientRect(), logoTo) },
          ],
          {
            duration: flight,
            easing: EASE_IN_OUT,
          },
        );
        const wordFrom = textRect(word)!;
        run(
          word,
          [{ transform: "none" }, { transform: flip(wordFrom, wordTo) }],
          {
            duration: flight,
            easing: EASE_IN_OUT,
          },
        );
      } else {
        // Téléphone : la marque monte et se fond dans la page.
        run(
          mark,
          [
            { opacity: 1, transform: "none", filter: "blur(0)" },
            {
              opacity: 0,
              transform: "translateY(-48px) scale(0.6)",
              filter: "blur(6px)",
            },
          ],
          { duration: flight * 0.8, easing: EASE_IN_OUT },
        );
      }

      if (decor) {
        // La vague glisse jusqu'au décor de la page et s'y fond.
        run(
          wave,
          [
            { transform: "none", opacity: 1 },
            { opacity: 0.85, offset: 0.55 },
            {
              transform: flip(
                wave.getBoundingClientRect(),
                decor.getBoundingClientRect(),
                false,
              ),
              opacity: 0,
            },
          ],
          { duration: flight * 1.1, easing: EASE_IN_OUT },
        );
      } else {
        run(
          wave,
          [
            { transform: "none", opacity: 1 },
            { transform: "translateY(12%)", opacity: 0 },
          ],
          { duration: flight, easing: EASE_IN_OUT },
        );
      }

      run(veil, [{ opacity: 1 }, { opacity: 0 }], {
        duration: flight * 0.9,
        delay: flight * 0.1,
        easing: "ease-in-out",
      });
      const reveal = (selector: string, from: Keyframe, delay: number) => {
        const node = document.querySelector(selector);
        if (!node || !visible(node.getBoundingClientRect())) return;
        reveals.push(
          node.animate([from, { opacity: 1, transform: "none" }], {
            duration: flight,
            delay: flight * delay,
            easing: EASE_OUT,
            fill: "backwards",
          }),
        );
      };
      reveal(".sidebar", { opacity: 0, transform: "translateX(-14px)" }, 0.15);
      reveal(".topbar", { opacity: 0, transform: "translateY(-8px)" }, 0.25);
      reveal(
        ".page-view",
        { opacity: 0, transform: "translateY(16px) scale(0.985)" },
        0.3,
      );
      reveal(
        ".mobile-bottom-nav",
        { opacity: 0, transform: "translateY(24px)" },
        0.35,
      );
      reveal(
        ".account-entry",
        { opacity: 0, transform: "translateY(-8px)" },
        0.2,
      );
      reveal(
        ".onboarding-layout",
        { opacity: 0, transform: "translateY(16px) scale(0.985)" },
        0.3,
      );

      await Promise.race([wait(flight * 1.1 + 40), landed]);
      if (brand) brand.style.visibility = "";
      if (!stopped) setOn(false);
    };
    const guard = window.setTimeout(() => setOn(false), 7000);
    land();

    return () => {
      stopped = true;
      window.clearTimeout(guard);
      window.removeEventListener("keydown", hurry);
      layer.removeEventListener("pointerdown", hurry);
      animations.forEach((animation) => animation.cancel());
      document
        .querySelectorAll<HTMLElement>(".sidebar .brand, .onboarding-brand")
        .forEach((node) => (node.style.visibility = ""));
    };
  }, [on]);

  if (!on) return null;
  return (
    <div className="splash" ref={layerRef} aria-hidden="true">
      <div className="splash-veil" />
      <div className="splash-wave">
        <Terrain />
        <span className="wave-light wave-light-violet">
          <Terrain />
        </span>
        <span className="wave-light wave-light-cyan">
          <Terrain />
        </span>
      </div>
      <div className="splash-mark">
        <BrandLogo size={72} />
        <span className="splash-word">
          {[...WORD].map((letter, index) => (
            <span key={index}>{letter}</span>
          ))}
        </span>
      </div>
    </div>
  );
}

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { AppState } from "../lib/types";

/*
 * Le didacticiel (idée d'Angel, maquette validée le 11 novembre 2026) :
 * – une visite guidée de l'accueil, juste après le questionnaire ;
 * – une petite visite par espace (« Me montrer »), pour comprendre à quoi sert
 *   chaque onglet et comment s'en servir ;
 * – « Tes premiers pas » : cinq gestes qui se cochent tout seuls.
 * Rien ici ne touche aux données d'apprentissage : seuls des réglages de
 * confort sont gardés dans le navigateur.
 */

// --- Petit magasin : réglages du navigateur + visite en cours ---------------

const memory = new Map<string, string | null>();
const listeners = new Set<() => void>();
let version = 0;
const bump = () => {
  version += 1;
  listeners.forEach((listener) => listener());
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const useGuideVersion = () => useSyncExternalStore(subscribe, () => version);

const get = (key: string) => {
  if (memory.has(key)) return memory.get(key) ?? null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const set = (key: string, value: string | null) => {
  memory.set(key, value);
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* Sans stockage, le réglage dure le temps de la visite. */
  }
  bump();
};

const TOUR_SEEN = "bouse.tour.seen";
const TOURS_SEEN = "bouse.tours.seen";
const WORD = "bouse.firststeps.word";
const STEPS_SEEN = "bouse.firststeps.seen";
const STEPS_HIDDEN = "bouse.firststeps.hidden";

// --- Les visites ------------------------------------------------------------

type Step = {
  /** Sélecteurs essayés dans l'ordre ; sans cible, la bulle est centrée. */
  targets?: string[];
  title: string;
  text: string;
  phoneText?: string;
  demo?: boolean;
};

const tours: Record<string, Step[]> = {
  home: [
    {
      targets: [".sidebar nav", ".mobile-bottom-nav"],
      title: "Tes espaces",
      text: "Tout est rangé ici. Pour débuter, deux suffisent : Vue d’ensemble et Académie. Chaque espace a sa petite visite : le bouton « Me montrer », en haut de sa page.",
      phoneText:
        "Tout est rangé ici, en bas de l’écran : apprendre, réviser, tes projets. Chaque espace a sa petite visite : le bouton « Me montrer », en haut de sa page.",
    },
    {
      targets: [".console-hero"],
      title: "Commence ici",
      text: "BOUSE te propose toujours ta prochaine leçon. Un seul geste : le bouton blanc.",
    },
    {
      demo: true,
      title: "Un mot que tu ne connais pas ?",
      text: "Dans les leçons, les mots difficiles sont soulignés. Touche-en un : sa définition s’ouvre.",
    },
    {
      targets: [
        '.sidebar a[href="#reviews"]',
        '.mobile-bottom-nav a[href="#reviews"]',
      ],
      title: "Pour ne rien oublier",
      text: "Après une leçon, BOUSE te repose quelques questions, au bon moment. Ça se passe ici.",
    },
    {
      targets: [".search-trigger", ".topbar-search"],
      title: "Tu cherches quelque chose ?",
      text: "Tape un mot : une leçon, une définition, un outil. BOUSE te l’ouvre.",
    },
  ],
  academy: [
    {
      targets: [".academy-start-card"],
      title: "Ta prochaine leçon",
      text: "BOUSE a choisi pour toi la leçon à faire maintenant. Le bouton blanc l’ouvre.",
    },
    {
      targets: [".academy-path"],
      title: "Le chemin",
      text: "Les leçons d’un même sujet, dans le bon ordre. Touche-en une pour l’ouvrir.",
    },
    {
      targets: [".academy-goals"],
      title: "Tu as un but précis ?",
      text: "Choisis un objectif : BOUSE te prépare la suite de leçons qui y mène.",
    },
    {
      targets: [".atlas-toolbar"],
      title: "Chercher ou changer de vue",
      text: "Tape un mot pour trouver une leçon, ou change la façon de les afficher.",
    },
  ],
  reviews: [
    {
      targets: [".reviews-experience > section"],
      title: "Tes rappels",
      text: "Quand une révision est prête, sa question s’affiche ici. Réponds de tête, puis regarde la réponse.",
    },
    {
      title: "Dis si c’était facile",
      text: "Après chaque réponse, tu dis si tu t’en souvenais. BOUSE te reposera la question plus tôt ou plus tard, selon ce que tu as dit.",
    },
    {
      targets: [".review-method"],
      title: "Pourquoi ça marche",
      text: "Revoir une idée juste avant de l’oublier, c’est ce qui la fait rester. Ouvre ce bloc pour en savoir plus.",
    },
  ],
  skills: [
    {
      targets: [".skills-summary"],
      title: "Où tu en es",
      text: "Acquis : ce que tu sais. En cours : ce que tu apprends. Ensuite : ce que BOUSE te conseille.",
    },
    {
      targets: [".knowledge-atlas"],
      title: "La carte",
      text: "Chaque rond est une notion. Les traits montrent ce qu’il faut savoir avant. Touche un rond.",
    },
    {
      targets: [".knowledge-details"],
      title: "Le détail",
      text: "La notion choisie s’affiche ici : ce qu’elle t’apprend, et le bouton pour ouvrir sa leçon.",
    },
  ],
  lab: [
    {
      targets: [".unit-economy"],
      title: "Une seule vente",
      text: "Le prix, moins ce que la vente te coûte : ce qui reste, c’est ta marge. Bouge les curseurs pour essayer.",
    },
    {
      targets: [".financial-levers"],
      title: "Tes leviers",
      text: "Ici, le nombre de ventes par mois et tes charges fixes. Tout se recalcule tout de suite.",
    },
    {
      targets: [".financial-chart"],
      title: "Le point d’équilibre",
      text: "Le graphique montre combien de ventes il faut pour ne plus perdre d’argent.",
    },
    {
      targets: [".monthly-economy"],
      title: "Sur un mois",
      text: "Le résultat du mois entier, avec tes chiffres.",
    },
  ],
  simulation: [
    {
      targets: [".simulation-cases"],
      title: "Choisis un cas",
      text: "Chaque bouton est une petite entreprise d’exemple.",
    },
    {
      targets: [".simulation-console"],
      title: "Change une hypothèse",
      text: "Par exemple : un client qui paie en retard. Ça se règle ici.",
    },
    {
      targets: [".simulation-stage"],
      title: "Regarde ton compte",
      text: "La courbe montre l’argent sur le compte, mois par mois. Si elle passe sous zéro, il manque de l’argent.",
    },
    {
      targets: [".simulation-keep"],
      title: "Garde la comparaison",
      text: "Enregistre ton essai pour le retrouver plus tard.",
    },
  ],
  ai: [
    {
      targets: [".prompt-writing"],
      title: "Écris ta demande",
      text: "Remplis les cases : ce que tu veux, pour qui, sous quelle forme.",
    },
    {
      targets: [".prompt-observatory", ".prompt-mobile-views"],
      title: "Ce qu’il manque",
      text: "BOUSE te montre ce qui manque à ta demande pour obtenir une bonne réponse d’une IA.",
      phoneText:
        "Touche « Structure » : BOUSE te montre ce qui manque à ta demande pour obtenir une bonne réponse d’une IA.",
    },
  ],
  incubator: [
    {
      targets: [".page-view .stack .button.primary"],
      title: "Crée un projet",
      text: "Un projet, c’est une idée que tu veux tester pour de vrai. Donne-lui un nom et dis quel problème il règle.",
    },
    {
      targets: [".project-empty-steps", ".page-view .stack .panel"],
      title: "Étape par étape",
      text: "BOUSE te guide : une hypothèse, un test sur le terrain, puis ce que tu as observé.",
    },
    {
      title: "Relie tes leçons",
      text: "Dans un projet, tu peux noter les leçons à apprendre pour avancer. Tes projets restent rangés sur cette page.",
    },
  ],
  radar: [
    {
      targets: [".page-view .notice"],
      title: "Avant de décider",
      text: "BOUSE t’apprend les bases. Pour une vraie décision, vérifie toujours à la source.",
    },
    {
      targets: [".catalog-card"],
      title: "Une carte, un site officiel",
      text: "Touche une carte : le site s’ouvre dans un nouvel onglet.",
    },
  ],
};

export const hasTour = (route: string) => route in tours;

let active: { id: string; index: number } | null = null;
let closing = 0;
let pendingWelcome = false;

/** Lance la visite d'un espace (« home » = la visite de bienvenue). */
export function startTour(id: string) {
  if (!tours[id] || active) return;
  if (id === "home") pendingWelcome = false;
  if (id === "home") {
    set(TOUR_SEEN, "1");
    set(STEPS_HIDDEN, null);
    if (location.hash !== "#home" && location.hash !== "") {
      location.hash = "#home";
      setTimeout(() => startTour("home"), 350);
      return;
    }
  }
  const seen = new Set((get(TOURS_SEEN) || "").split(",").filter(Boolean));
  seen.add(id);
  set(TOURS_SEEN, [...seen].join(","));
  active = { id, index: 0 };
  bump();
}
/** À appeler quand le questionnaire se termine : la visite suivra l'accueil. */
export function queueWelcomeTour() {
  if (get(TOUR_SEEN) !== "1") pendingWelcome = true;
}
/** Vrai tant que la visite de cet espace n'a jamais été lancée. */
export function useTourIsNew(id: string) {
  useGuideVersion();
  return !(get(TOURS_SEEN) || "").split(",").includes(id);
}

const findTarget = (selectors: string[] | undefined) => {
  for (const selector of selectors || [])
    for (const element of document.querySelectorAll<HTMLElement>(selector)) {
      const rect = element.getBoundingClientRect();
      if (
        rect.width > 4 &&
        rect.height > 4 &&
        rect.right > 0 &&
        rect.left < innerWidth
      )
        return element;
    }
  return null;
};

/** Le menu déborde un peu de sa boîte (libellés longs) : on entoure ses liens. */
const outline = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const box = {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
  };
  if (element.matches("nav"))
    for (const link of element.querySelectorAll("a, button")) {
      const item = link.getBoundingClientRect();
      if (!item.width) continue;
      box.left = Math.min(box.left, item.left);
      box.right = Math.max(box.right, item.right);
      box.top = Math.min(box.top, item.top);
      box.bottom = Math.max(box.bottom, item.bottom);
    }
  return box;
};

/** À monter une fois dans l'appli : affiche la visite en cours. */
export function TourHost() {
  useGuideVersion();
  const tour = active;
  const steps = tour ? tours[tour.id]! : [];
  const step = tour ? steps[tour.index] : undefined;
  const holeRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const opened = useRef(false);
  const restore = useRef<HTMLElement | null>(null);
  const [definition, setDefinition] = useState(false);
  const [phone] = useState(() => matchMedia("(max-width: 700px)").matches);

  // Le mot souligné : premier pas coché dès qu'on en touche un, où que ce soit.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const term = (event.target as Element | null)?.closest?.(
        ".glossary-inline-term",
      );
      if (term && !term.closest(".tour-card") && get(WORD) !== "1")
        set(WORD, "1");
    };
    document.addEventListener("click", onClick);
    let timer = 0;
    // Le signal n'est effacé qu'au vrai lancement : React peut jouer cet
    // effet deux fois au démarrage (mode strict).
    if (pendingWelcome) timer = window.setTimeout(() => startTour("home"), 700);
    return () => {
      document.removeEventListener("click", onClick);
      clearTimeout(timer);
    };
  }, []);

  const finish = () => {
    if (!active || closing) return;
    const id = active.id;
    const hole = holeRef.current;
    const card = cardRef.current;
    card?.removeAttribute("data-in");
    if (hole) {
      hole.removeAttribute("data-blank");
      hole.setAttribute("data-open", "");
      Object.assign(hole.style, {
        left: "0px",
        top: "0px",
        width: `${innerWidth}px`,
        height: `${innerHeight}px`,
      });
    }
    closing = window.setTimeout(() => {
      closing = 0;
      active = null;
      opened.current = false;
      bump();
      restore.current?.focus?.({ preventScroll: true });
      restore.current = null;
      window.dispatchEvent(new CustomEvent("bouse:tour-end", { detail: id }));
    }, 420);
  };
  const go = (index: number) => {
    if (!active) return;
    if (index >= steps.length) return finish();
    if (index < 0) return;
    active = { id: active.id, index };
    bump();
  };

  const key = tour ? `${tour.id}:${tour.index}` : "";
  useLayoutEffect(() => {
    if (!tour || !step) return;
    const hole = holeRef.current!;
    const card = cardRef.current!;
    setDefinition(false);
    let cancelled = false;
    const timers: number[] = [];
    const later = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(() => !cancelled && fn(), ms));

    const place = () => {
      const vw = innerWidth;
      const vh = innerHeight;
      const m = 12;
      const dock = findTarget([".mobile-bottom-nav"]) ? 76 : 0;
      const target = findTarget(step.targets);
      const cw = card.offsetWidth;
      const ch = card.offsetHeight;
      let x: number;
      let y: number;
      if (!target) {
        hole.setAttribute("data-blank", "");
        Object.assign(hole.style, {
          left: `${vw / 2}px`,
          top: `${vh / 2}px`,
          width: "0px",
          height: "0px",
        });
        x = (vw - cw) / 2;
        y = Math.max(m, (vh - ch) / 2 - 20);
      } else {
        hole.removeAttribute("data-blank");
        const r = outline(target);
        const pad = 6;
        const tx = Math.max(4, r.left - pad);
        const ty = Math.max(4, r.top - pad);
        const tw = Math.min(vw - 4, r.right + pad) - tx;
        let th = Math.max(0, Math.min(vh - 4, r.bottom + pad) - ty);
        const gap = 16;
        const beside = tx + tw + gap + cw <= vw - m && th > tw;
        const room = vh - m - dock - gap - ch - ty;
        // Bloc plus grand que l'écran : on n'éclaire que son haut, la bulle
        // se pose juste dessous au lieu de le recouvrir.
        if (!beside && th > room && ty - gap - ch < m && room >= 48) th = room;
        Object.assign(hole.style, {
          left: `${tx}px`,
          top: `${ty}px`,
          width: `${tw}px`,
          height: `${th}px`,
        });
        if (beside) {
          // À droite d'une cible haute (le menu).
          x = tx + tw + gap;
          y =
            th < 120
              ? Math.min(Math.max(m, ty + th / 2 - 56), vh - ch - m)
              : Math.min(Math.max(m, ty + Math.min(40, th / 4)), vh - ch - m);
        } else {
          x = Math.min(Math.max(m, tx + tw / 2 - cw / 2), vw - cw - m);
          if (ty + th + gap + ch <= vh - m - dock) y = ty + th + gap;
          else if (ty - gap - ch >= m) y = ty - gap - ch;
          else y = vh - ch - m - dock;
        }
      }
      card.style.setProperty("--x", `${Math.round(x)}px`);
      card.style.setProperty("--y", `${Math.round(y)}px`);
    };

    const show = () => {
      // Amener la cible à l'écran avant d'y poser la lumière.
      const target = findTarget(step.targets);
      if (target) {
        const rect = target.getBoundingClientRect();
        if (rect.top < 64 || rect.bottom > innerHeight - 96) {
          if (rect.height > innerHeight * 0.45)
            scrollBy({ top: rect.top - 72, behavior: "instant" });
          else target.scrollIntoView({ block: "center", behavior: "instant" });
        }
      }
      card.style.transition = "none";
      place();
      void card.offsetWidth;
      card.style.transition = "";
      later(opened.current ? 200 : 260, () => {
        opened.current = true;
        card.setAttribute("data-in", "");
        card.focus({ preventScroll: true });
      });
    };

    if (!opened.current) {
      // Ouverture : la lumière part de toute la page et se resserre.
      restore.current = document.activeElement as HTMLElement | null;
      if (tour.id === "home") scrollTo(0, 0);
      Object.assign(hole.style, {
        left: "0px",
        top: "0px",
        width: `${innerWidth}px`,
        height: `${innerHeight}px`,
      });
      hole.setAttribute("data-open", "");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (cancelled) return;
          hole.removeAttribute("data-open");
          show();
        }),
      );
    } else {
      card.removeAttribute("data-in");
      later(150, show);
    }

    const replace = () => place();
    addEventListener("resize", replace);
    addEventListener("scroll", replace, true);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      removeEventListener("resize", replace);
      removeEventListener("scroll", replace, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // La définition qui s'ouvre change la hauteur de la bulle : on la replace.
  useLayoutEffect(() => {
    if (definition) dispatchEvent(new Event("resize"));
  }, [definition]);

  if (!tour || !step) return null;
  const last = tour.index === steps.length - 1;
  return (
    <div className="tour" data-on="">
      <div className="tour-block" />
      <div className="tour-hole" ref={holeRef} />
      <section
        ref={cardRef}
        className="tour-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            finish();
          } else if (event.key === "ArrowRight") go(tour.index + 1);
          else if (event.key === "ArrowLeft") go(tour.index - 1);
          else if (
            event.key === "Enter" &&
            event.target === event.currentTarget
          )
            go(tour.index + 1);
          else if (event.key === "Tab") {
            // La bulle garde le clavier tant que la visite est ouverte.
            const items = [
              ...event.currentTarget.querySelectorAll<HTMLElement>("button"),
            ].filter((item) => item.offsetParent !== null);
            const first = items[0];
            const final = items[items.length - 1];
            const current = document.activeElement;
            if (
              event.shiftKey &&
              (current === first || current === event.currentTarget)
            ) {
              event.preventDefault();
              final?.focus();
            } else if (!event.shiftKey && current === final) {
              event.preventDefault();
              first?.focus();
            }
          }
        }}
      >
        <div className="tour-top">
          <span className="tour-dots" aria-hidden="true">
            {steps.map((_, index) => (
              <i
                key={index}
                data-s={
                  index < tour.index
                    ? "done"
                    : index === tour.index
                      ? "now"
                      : "todo"
                }
              />
            ))}
          </span>
          <span className="tour-count">
            {tour.index + 1} sur {steps.length}
          </span>
        </div>
        <div aria-live="polite">
          <p className="tour-title" id="tour-title">
            {step.title}
          </p>
          <p className="tour-text">{(phone && step.phoneText) || step.text}</p>
        </div>
        {step.demo && (
          <div className="tour-demo">
            <p className="tour-demo-line">
              « Un{" "}
              <button
                type="button"
                className="glossary-inline-term"
                aria-expanded={definition}
                onClick={() => setDefinition(true)}
              >
                ETF
              </button>{" "}
              est un panier d’actions qu’on achète en une seule fois. »
            </p>
            {definition && (
              <p className="tour-def">
                <strong>ETF</strong>Un panier tout prêt qui contient des
                centaines d’actions. Tu achètes le panier, pas chaque action une
                par une.
              </p>
            )}
            <p className="tour-hint" data-ok={definition ? "" : undefined}>
              {definition
                ? "Voilà. Ça marche pareil dans toutes les leçons."
                : "Essaie : touche le mot souligné."}
            </p>
          </div>
        )}
        <div className="tour-actions">
          <button type="button" className="tour-skip" onClick={finish}>
            {last ? "Fermer" : "Passer"}
          </button>
          <button
            type="button"
            className="tour-next"
            onClick={() => go(tour.index + 1)}
          >
            {last
              ? tour.id === "home"
                ? "C’est parti"
                : "J’ai compris"
              : "Suivant"}
          </button>
        </div>
      </section>
    </div>
  );
}

// --- Tes premiers pas -------------------------------------------------------

const PAS = [
  {
    id: "lesson",
    label: "Première leçon",
    now: "Ouvre ta première leçon : c’est le bouton blanc, juste en dessous.",
  },
  {
    id: "word",
    label: "Mot souligné",
    now: "Dans la leçon, touche un mot souligné pour voir sa définition.",
  },
  {
    id: "quiz",
    label: "Quiz réussi",
    now: "Va au bout de la leçon et réussis son quiz.",
  },
  {
    id: "review",
    label: "Révision",
    now: "Fais ta première révision, dans l’espace Révisions.",
  },
  {
    id: "project",
    label: "Premier projet",
    now: "Crée ton premier projet : une idée à toi, dans Projets.",
  },
] as const;

/** Les pas déjà faits, d'après ce que l'apprenant a réellement fait. */
export function firstStepsDone(state: AppState): string[] {
  const done: string[] = [];
  if (state.lastLessonId || state.attempts.length) done.push("lesson");
  if (get(WORD) === "1") done.push("word");
  if (state.attempts.some((attempt) => attempt.passed)) done.push("quiz");
  if (state.reviewEvents?.length) done.push("review");
  if (state.projects.length) done.push("project");
  return done;
}

/** Vrai tant que la carte « Tes premiers pas » a quelque chose à montrer. */
export function useFirstStepsActive(state: AppState) {
  useGuideVersion();
  if (get(STEPS_HIDDEN) === "1") return false;
  const done = firstStepsDone(state);
  // Tout était déjà fait avant l'arrivée de la carte : rien à fêter.
  return !(done.length === PAS.length && get(STEPS_SEEN) === null);
}

export function FirstSteps({
  state,
  lessonId,
  onNavigate,
}: {
  state: AppState;
  lessonId: string | undefined;
  onNavigate: (route: string) => void;
}) {
  const visible = useFirstStepsActive(state);
  const real = firstStepsDone(state);
  const ref = useRef<HTMLElement>(null);
  // On part de ce que l'apprenant avait vu la dernière fois : les nouveaux pas
  // se cochent sous ses yeux à son retour sur l'accueil.
  const [shown, setShown] = useState<string[]>(() => {
    const seen = get(STEPS_SEEN);
    return seen === null
      ? real
      : seen.split(",").filter((id) => real.includes(id));
  });
  const [fresh, setFresh] = useState<string[]>([]);
  const [hello, setHello] = useState(0);
  const realKey = real.join(",");

  useEffect(() => {
    if (!visible) return;
    if (get(STEPS_SEEN) === null) set(STEPS_SEEN, realKey);
    if (shown.join(",") === realKey) return;
    const timer = window.setTimeout(() => {
      setFresh(real.filter((id) => !shown.includes(id)));
      setShown(real);
      set(STEPS_SEEN, realKey);
    }, 650);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realKey, visible]);

  useEffect(() => {
    const onEnd = (event: Event) => {
      if ((event as CustomEvent).detail === "home") setHello((n) => n + 1);
    };
    addEventListener("bouse:tour-end", onEnd);
    return () => removeEventListener("bouse:tour-end", onEnd);
  }, []);

  const fold = () => {
    const element = ref.current;
    const hide = () => set(STEPS_HIDDEN, "1");
    if (
      !element?.animate ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return hide();
    element.style.overflow = "hidden";
    element
      .animate(
        [
          {
            height: `${element.offsetHeight}px`,
            opacity: 1,
            marginBottom: getComputedStyle(element).marginBottom,
          },
          {
            height: "0px",
            opacity: 0,
            marginBottom: "0px",
            paddingTop: "0px",
            paddingBottom: "0px",
            borderWidth: "0px",
          },
        ],
        {
          duration: 520,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          fill: "forwards",
        },
      )
      .finished.then(hide, hide);
  };

  const complete = shown.length === PAS.length;
  useEffect(() => {
    if (!visible || !complete) return;
    const timer = window.setTimeout(fold, 3200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete, visible]);

  if (!visible) return null;
  const next = PAS.find((pas) => !shown.includes(pas.id));
  // Le trait se remplit jusqu'au dernier pas fait sans trou depuis le début.
  let streak = 0;
  while (streak < PAS.length && shown.includes(PAS[streak]!.id)) streak += 1;
  const goNext = () => {
    if (!next) return;
    if (next.id === "review") onNavigate("reviews");
    else if (next.id === "project") onNavigate("incubator");
    else onNavigate(lessonId ? `lesson/${lessonId}` : "academy");
  };
  return (
    <section
      ref={ref}
      className="first-steps"
      aria-label="Tes premiers pas"
      data-hello={hello % 2 ? "a" : hello ? "b" : undefined}
    >
      <header className="fs-head">
        <h2 className="fs-title">Tes premiers pas</h2>
        <p className="fs-sub">Ils se cochent tout seuls, quand tu les fais.</p>
        <span className="fs-count">
          <b>{shown.length}</b> sur {PAS.length}
        </span>
        <button
          type="button"
          className="fs-hide"
          onClick={fold}
          aria-label="Masquer les premiers pas"
          title="Masquer les premiers pas"
        >
          ×
        </button>
      </header>
      <ol
        className="fs-path"
        style={
          {
            "--line":
              Math.max(0, Math.min(streak, PAS.length) - 1) / (PAS.length - 1),
          } as React.CSSProperties
        }
      >
        {PAS.map((pas, index) => {
          const status = shown.includes(pas.id)
            ? "done"
            : pas === next
              ? "now"
              : "todo";
          return (
            <li
              key={pas.id}
              data-s={status}
              data-just={fresh.includes(pas.id) ? "" : undefined}
            >
              <span className="fs-node" aria-hidden="true">
                <em>{index + 1}</em>
                <svg viewBox="0 0 16 16">
                  <path d="M3 8.5l3.2 3.2L13 4.8" />
                </svg>
              </span>
              <span className="fs-label">
                {pas.label}
                <span className="sr-only">
                  {status === "done"
                    ? " : fait"
                    : status === "now"
                      ? " : à faire maintenant"
                      : " : à faire"}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
      <p
        className="fs-now"
        key={next?.id || "bravo"}
        data-swap={fresh.length ? "" : undefined}
      >
        {next ? (
          <>
            <span>Maintenant</span>
            {next.now}
            <button type="button" className="fs-go" onClick={goNext}>
              Y aller <i aria-hidden="true">→</i>
            </button>
          </>
        ) : (
          <>
            <span>Bravo</span>
            Tu connais les bases de BOUSE. La suite, c’est toi qui choisis.
          </>
        )}
      </p>
      <button
        type="button"
        className="fs-tour text-button"
        onClick={() => startTour("home")}
      >
        Revoir la visite guidée
      </button>
    </section>
  );
}

/** Dans les préférences : relancer la visite de bienvenue. */
export function TourReplay() {
  return (
    <div className="tour-replay">
      <p className="muted">
        Une visite de deux minutes pour revoir où tout se trouve. Chaque espace
        a aussi sa petite visite : le bouton « Me montrer », en haut de sa page.
      </p>
      <button
        type="button"
        className="button secondary"
        onClick={() => startTour("home")}
      >
        Revoir la visite guidée
      </button>
    </div>
  );
}

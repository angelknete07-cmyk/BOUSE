import {
  Fragment,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { lessons } from "./data/lessons";
import { glossary } from "./data/investingGlossary";
import type { AppState, Profile, StateUpdater } from "./lib/types";
import {
  goalOptions,
  interestOptions,
  levelLabel,
  levelOptions,
  minuteOptions,
  preferenceOptions,
  withCurrent,
} from "./data/profileOptions";
import { downloadFile, emptyState, parseState } from "./lib/storage";
import { browserPersistence, readStateFrom } from "./lib/persistence";
import { useCloudSync, type CloudSync } from "./lib/useCloudSync";
import { CloudPanel } from "./components/CloudPanel";
import { normalizeSearch, rankSearchResults } from "./lib/domain";
import { Icon } from "./components/Icon";
import { Dashboard } from "./components/Dashboard";
import { Onboarding } from "./components/Onboarding";
import { latestCurrentAttempt } from "./lib/portfolio";

// Secondary screens load on demand; home and onboarding stay in the entry chunk.
const Academy = lazy(() =>
  import("./components/Academy").then((m) => ({ default: m.Academy })),
);
const KnowledgeMap = lazy(() =>
  import("./components/KnowledgeMap").then((m) => ({
    default: m.KnowledgeMap,
  })),
);
const LessonView = lazy(() =>
  import("./components/LessonView").then((m) => ({ default: m.LessonView })),
);
const Reviews = lazy(() =>
  import("./components/Reviews").then((m) => ({ default: m.Reviews })),
);
const ProjectWorkbench = lazy(() =>
  import("./components/ProjectWorkbench").then((m) => ({
    default: m.ProjectWorkbench,
  })),
);
const SimulationLab = lazy(() =>
  import("./components/SimulationLab").then((m) => ({
    default: m.SimulationLab,
  })),
);
const LearningPortfolio = lazy(() =>
  import("./components/LearningPortfolio").then((m) => ({
    default: m.LearningPortfolio,
  })),
);
const AILab = lazy(() =>
  import("./components/Tools").then((m) => ({ default: m.AILab })),
);
const Incubator = lazy(() =>
  import("./components/Tools").then((m) => ({ default: m.Incubator })),
);
const Glossary = lazy(() =>
  import("./components/Glossary").then((m) => ({ default: m.Glossary })),
);
const Lab = lazy(() =>
  import("./components/Tools").then((m) => ({ default: m.Lab })),
);

// Three verbs organise the nine spaces; each says in a few words what it holds.
const navigation = [
  {
    id: "home",
    label: "Vue d’ensemble",
    icon: "home",
    group: "Apprendre",
    hint: "Votre prochaine action",
  },
  {
    id: "academy",
    label: "Académie",
    icon: "book",
    group: "Apprendre",
    hint: "Toutes les leçons et le lexique",
  },
  {
    id: "reviews",
    label: "Révisions",
    icon: "clock",
    group: "Apprendre",
    hint: "Rappels pour retenir",
  },
  {
    id: "skills",
    label: "Mes compétences",
    icon: "node",
    group: "Apprendre",
    hint: "Votre carte et vos preuves",
  },
  {
    id: "lab",
    label: "Lab financier",
    icon: "lab",
    group: "S’exercer",
    hint: "Prix, coûts et seuil de rentabilité",
  },
  {
    id: "simulation",
    label: "Scénarios",
    icon: "chart",
    group: "S’exercer",
    hint: "« Et si ? » : la trésorerie sur six mois",
  },
  {
    id: "ai",
    label: "Atelier IA",
    icon: "ai",
    group: "S’exercer",
    hint: "Structurer une demande à une IA",
  },
  {
    id: "incubator",
    label: "Projets",
    icon: "idea",
    group: "Construire",
    hint: "Du savoir au terrain",
  },
  {
    id: "radar",
    label: "Sources",
    icon: "radar",
    group: "Construire",
    hint: "Sites de référence à consulter",
  },
];
const getRoute = () => {
  try {
    return decodeURI(location.hash.slice(1)) || "home";
  } catch {
    return "home";
  }
};
const projectIdForRoute = (route: string) =>
  route.startsWith("project-plan/")
    ? route.slice(13)
    : route.startsWith("project/")
      ? route.slice(8)
      : null;
function useRoute() {
  const [route, setRoute] = useState(getRoute);
  useEffect(() => {
    const handle = () => setRoute(getRoute());
    addEventListener("hashchange", handle);
    return () => removeEventListener("hashchange", handle);
  }, []);
  function navigate(next: string) {
    location.hash = next;
    setRoute(next);
    window.scrollTo({ top: 0 });
  }
  return [route, navigate] as const;
}
function passedIds(state: AppState) {
  const now = new Date();
  return new Set(
    lessons
      .filter(
        (lesson) => latestCurrentAttempt(lesson, state.attempts, now)?.passed,
      )
      .map((lesson) => lesson.id),
  );
}
function restoreFocus(target: Element | null) {
  const available =
    target instanceof HTMLElement &&
    target.isConnected &&
    !target.closest("[inert]") &&
    target.getClientRects().length > 0;
  (available ? target : document.getElementById("main-content"))?.focus({
    preventScroll: true,
  });
}
function App() {
  const [loaded, setLoaded] = useState(() =>
    readStateFrom(browserPersistence()),
  );
  const [state, setState] = useState(loaded.state);
  const replaceState = useCallback((next: AppState) => setState(next), []);
  const cloud = useCloudSync(state, replaceState);
  const [storageError, setStorageError] = useState<string | null>(loaded.error);
  const [route, navigate] = useRoute();
  const projectId = projectIdForRoute(route);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => matchMedia("(max-width: 700px)").matches,
  );
  const [resetCorrupt, setResetCorrupt] = useState(false);
  const titleRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const mobileReturnFocus = useRef<HTMLElement | null>(null);
  const searchReturnFocus = useRef<HTMLElement | null>(null);
  function openSearch() {
    searchReturnFocus.current = mobileOpen
      ? mobileReturnFocus.current
      : document.activeElement instanceof HTMLElement
        ? document.activeElement
        : titleRef.current;
    setMobileOpen(false);
    setSearchOpen(true);
  }
  const update: StateUpdater = (updater) => {
    setState((current) => {
      const next = updater(current);
      return next;
    });
  };
  useEffect(() => {
    if (loaded.error) return;
    try {
      browserPersistence().write(state);
      setStorageError(null);
    } catch {
      setStorageError(
        "Le navigateur ne peut pas enregistrer vos changements. Exportez vos données avant de fermer cette page.",
      );
    }
  }, [state, loaded.error]);
  useEffect(() => {
    const media = matchMedia("(max-width: 700px)");
    const change = () => {
      setIsMobile(media.matches);
      if (!media.matches) setMobileOpen(false);
    };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.activeElement;
    mobileReturnFocus.current =
      previous instanceof HTMLElement ? previous : null;
    const controls = () =>
      [
        ...(sidebarRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not(:disabled)",
        ) || []),
      ].filter((el) => el.offsetParent !== null);
    controls()[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const list = controls();
      const first = list[0];
      const last = list.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = previousOverflow;
      restoreFocus(previous);
    };
  }, [mobileOpen]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        !e.isComposing &&
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "k"
      ) {
        e.preventDefault();
        if (searchOpen) setSearchOpen(false);
        else openSearch();
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [mobileOpen, searchOpen]);
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    window.scrollTo({ top: 0 });
    // Wait until closed overlays have removed inert and restored their opener.
    const frame = requestAnimationFrame(() =>
      titleRef.current?.focus({ preventScroll: true }),
    );
    const routeTitle = route.startsWith("lesson/")
      ? lessons.find((item) => item.id === route.slice(7))?.title
      : route === "lexique" || route.startsWith("lexique/")
        ? "Lexique de la finance"
        : projectId !== null
          ? state.projects.find((item) => item.id === projectId)?.title
          : navigation.find((item) => item.id === route)?.label;
    document.title = `${routeTitle || (route === "portfolio" ? "Portfolio" : route === "settings" ? "Profil et paramètres" : "Mon espace")} — BOUSE`;
    return () => cancelAnimationFrame(frame);
  }, [route, !!state.profile]);
  const done = passedIds(state);
  function go(next: string) {
    navigate(next);
  }
  if (!state.profile)
    return (
      <>
        {storageError && (
          <div role="alert" className="storage-banner">
            {storageError}
            <button
              className="text-button"
              onClick={() => {
                try {
                  downloadFile(
                    "bouse-sauvegarde-brute.json",
                    browserPersistence().readRaw() || "{}",
                  );
                } catch {
                  setStorageError(
                    "Le navigateur interdit aussi la lecture de la sauvegarde. Exportez la session après votre inscription.",
                  );
                }
              }}
            >
              Exporter la sauvegarde
            </button>
            {loaded.error && (
              <button
                className="text-button"
                onClick={() => {
                  if (!resetCorrupt) {
                    setResetCorrupt(true);
                    return;
                  }
                  try {
                    browserPersistence().clear();
                    setLoaded({
                      state: structuredClone(emptyState),
                      error: null,
                    });
                    setStorageError(null);
                    setResetCorrupt(false);
                  } catch {
                    setStorageError(
                      "Le navigateur interdit le stockage. Autorisez les données du site ou continuez en mémoire avec des exports réguliers.",
                    );
                  }
                }}
              >
                {resetCorrupt
                  ? "Confirmer la suppression de la sauvegarde illisible"
                  : "Réinitialiser la sauvegarde illisible"}
              </button>
            )}
          </div>
        )}
        <Onboarding
          onComplete={(profile) => update((s) => ({ ...s, profile }))}
        />
      </>
    );
  const inGlossary = route === "lexique" || route.startsWith("lexique/");
  const lesson = route.startsWith("lesson/")
    ? lessons.find((l) => l.id === route.slice(7))
    : undefined;
  const project =
    projectId !== null
      ? state.projects.find((item) => item.id === projectId)
      : undefined;
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          titleRef.current?.focus();
        }}
      >
        Aller au contenu
      </a>
      {mobileOpen && (
        <button
          className="nav-backdrop"
          aria-label="Fermer la navigation"
          tabIndex={-1}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        id="main-navigation"
        ref={sidebarRef}
        role={isMobile && mobileOpen ? "dialog" : undefined}
        aria-modal={isMobile && mobileOpen ? true : undefined}
        aria-label={
          isMobile && mobileOpen ? "Navigation des espaces" : undefined
        }
        inert={isMobile && !mobileOpen ? true : undefined}
        className={`sidebar ${mobileOpen ? "open" : ""}`}
      >
        <button
          className="icon-button mobile-nav-close"
          aria-label="Replier le menu"
          onClick={() => setMobileOpen(false)}
        >
          <Icon name="close" size={18} />
        </button>
        <a className="brand" href="#home" onClick={() => setMobileOpen(false)}>
          <span className="brand-mark">
            b<span className="brand-dot">.</span>
          </span>
          <span>
            BOUSE<small>ACADÉMIE BUSINESS & IA</small>
          </span>
        </a>
        <button
          className="search-trigger"
          aria-label="Rechercher ⌘ K"
          aria-keyshortcuts="Control+K Meta+K"
          onClick={openSearch}
        >
          <Icon name="search" size={16} />
          <span>Rechercher</span>
          <kbd>⌘ K</kbd>
        </button>
        <nav aria-label="Navigation principale">
          {navigation.map((n, index) => (
            <Fragment key={n.id}>
              {navigation[index - 1]?.group !== n.group && (
                <p className="nav-group" aria-hidden="true">
                  {n.group}
                </p>
              )}
              <a
                aria-describedby={`nav-hint-${n.id}`}
                title={`${n.label} : ${n.hint}`}
                href={`#${n.id}`}
                onClick={() => setMobileOpen(false)}
                aria-current={
                  route === n.id ||
                  (n.id === "academy" && (lesson || inGlossary)) ||
                  (n.id === "skills" && route === "portfolio") ||
                  (n.id === "incubator" && projectId !== null)
                    ? "page"
                    : undefined
                }
                className={
                  route === n.id ||
                  (n.id === "academy" && (lesson || inGlossary)) ||
                  (n.id === "skills" && route === "portfolio") ||
                  (n.id === "incubator" && projectId !== null)
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <Icon name={n.icon} size={19} />
                <span className="nav-label">
                  {n.label}
                  <small
                    className="nav-hint"
                    id={`nav-hint-${n.id}`}
                    aria-hidden="true"
                  >
                    {n.hint}
                  </small>
                </span>
              </a>
            </Fragment>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-progress">
            <div>
              <span>Vos fondations</span>
              <span>
                {done.size}/{lessons.length}
              </span>
            </div>
            <progress
              aria-label="Quiz de fondations validés"
              value={done.size}
              max={lessons.length}
            />
            <small>Des preuves, une étape à la fois.</small>
          </div>
          <a
            href="#settings"
            onClick={() => setMobileOpen(false)}
            className={`profile-link ${route === "settings" ? "active" : ""}`}
          >
            <span className="avatar">
              {state.profile.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="profile-meta">
              {state.profile.name}
              <small>Espace personnel · local</small>
            </span>
            <span className="sr-only">Profil et paramètres</span>
            <Icon name="settings" size={17} />
          </a>
        </div>
      </aside>
      <div className="workspace" inert={mobileOpen ? true : undefined}>
        <header className="topbar">
          <div>
            <button
              className="icon-button mobile-menu"
              aria-label="Ouvrir la navigation"
              aria-expanded={mobileOpen}
              aria-controls="main-navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Icon name="menu" />
            </button>
            <span className="topbar-parent">Mon espace</span>
            <span className="breadcrumb-separator">/</span>
            <span>
              {lesson || inGlossary
                ? "Académie"
                : route === "portfolio"
                  ? "Portfolio"
                  : projectId !== null
                    ? "Projets"
                    : navigation.find((n) => n.id === route)?.label ||
                      (route === "settings"
                        ? "Préférences"
                        : "Page introuvable")}
            </span>
          </div>
          <div>
            <span className="local-status">
              <i />
              {cloud.status === "synced"
                ? "Synchronisé"
                : cloud.status === "saving"
                  ? "Synchronisation…"
                  : "Données locales"}
            </span>
            <button
              className="icon-button"
              aria-label="Ouvrir la recherche"
              aria-keyshortcuts="Control+K Meta+K"
              onClick={openSearch}
            >
              <Icon name="search" size={18} />
            </button>
          </div>
        </header>
        <main
          id="main-content"
          ref={titleRef}
          tabIndex={-1}
          className="main-content"
        >
          {storageError && (
            <div role="alert" className="storage-banner">
              {storageError}
              <button
                className="text-button"
                onClick={() =>
                  downloadFile(
                    "bouse-export.json",
                    JSON.stringify(state, null, 2),
                  )
                }
              >
                Exporter
              </button>
            </div>
          )}
          <div className="page-view" key={route}>
            <Suspense
              fallback={
                <p className="page-loading" role="status">
                  Chargement…
                </p>
              }
            >
              {route === "home" ? (
                <Dashboard state={state} onNavigate={go} />
              ) : route === "academy" ? (
                <Academy state={state} onNavigate={go} />
              ) : lesson ? (
                <LessonView
                  key={lesson.id}
                  lesson={lesson}
                  state={state}
                  update={update}
                  onNavigate={go}
                />
              ) : route === "skills" ? (
                <KnowledgeMap state={state} onNavigate={go} />
              ) : route === "portfolio" ? (
                <LearningPortfolio state={state} onNavigate={go} />
              ) : route === "reviews" ? (
                <Reviews state={state} update={update} onNavigate={go} />
              ) : route === "lab" ? (
                <Lab onNavigate={go} />
              ) : route === "simulation" ? (
                <SimulationLab state={state} update={update} onNavigate={go} />
              ) : route === "ai" ? (
                <AILab />
              ) : route === "incubator" ? (
                <Incubator state={state} update={update} onNavigate={go} />
              ) : project ? (
                <ProjectWorkbench
                  key={project.id}
                  project={project}
                  state={state}
                  update={update}
                  onNavigate={go}
                  initialTab={
                    route.startsWith("project-plan/") ? "reperes" : "terrain"
                  }
                />
              ) : projectId !== null ? (
                <div className="empty-state">
                  <h1>Projet introuvable.</h1>
                  <p>
                    Ce projet n’est pas présent dans cette sauvegarde. Retrouvez
                    vos fiches dans Projets.
                  </p>
                  <button
                    className="button primary"
                    onClick={() => go("incubator")}
                  >
                    Retrouver mes projets
                  </button>
                </div>
              ) : inGlossary ? (
                <Glossary
                  focusId={route.startsWith("lexique/") ? route.slice(8) : null}
                  onNavigate={go}
                />
              ) : route === "radar" ? (
                <Radar />
              ) : route === "settings" ? (
                <Settings state={state} update={update} cloud={cloud} />
              ) : (
                <div className="empty-state not-found">
                  <h1>Cette page n’existe pas.</h1>
                  <p>
                    Le lien est peut-être ancien ou incomplet. Votre progression
                    n’est pas touchée.
                  </p>
                  <div className="not-found-actions">
                    <button
                      className="button primary"
                      onClick={() => go("home")}
                    >
                      Revenir à mon espace
                    </button>
                    <button
                      className="button secondary"
                      onClick={() => go("academy")}
                    >
                      Voir toutes les leçons
                    </button>
                    <button
                      className="button secondary"
                      onClick={() => setSearchOpen(true)}
                    >
                      Rechercher
                    </button>
                  </div>
                </div>
              )}
            </Suspense>
          </div>
        </main>
        <footer className="page-footer">
          <span>BOUSE / Apprendre pour agir.</span>
          <span>Version fondations · 0.1</span>
        </footer>
      </div>
      <nav
        className="mobile-bottom-nav"
        aria-label="Navigation mobile"
        inert={mobileOpen ? true : undefined}
      >
        {[
          { id: "home", label: "Accueil", icon: "home" },
          { id: "academy", label: "Apprendre", icon: "book" },
          { id: "reviews", label: "Réviser", icon: "clock" },
          { id: "incubator", label: "Projets", icon: "idea" },
        ].map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={
              route === item.id ||
              (item.id === "academy" && (lesson || inGlossary)) ||
              (item.id === "incubator" && projectId !== null)
                ? "page"
                : undefined
            }
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </a>
        ))}
        <button
          aria-label="Explorer tous les espaces"
          aria-expanded={mobileOpen}
          aria-controls="main-navigation"
          onClick={() => setMobileOpen(true)}
        >
          <Icon name="menu" size={20} />
          <span>Explorer</span>
        </button>
      </nav>
      {searchOpen && (
        <Search
          state={state}
          returnFocusRef={searchReturnFocus}
          onClose={() => setSearchOpen(false)}
          onNavigate={(next) => {
            searchReturnFocus.current = titleRef.current;
            go(next);
            setSearchOpen(false);
          }}
        />
      )}
    </div>
  );
}

function Radar() {
  const sources = [
    {
      title: "Banque de France · ABC de l’économie",
      category: "ÉCONOMIE",
      description:
        "Des repères pédagogiques pour comprendre les mécanismes économiques.",
      url: "https://www.banque-france.fr/fr/abc-de-leconomie",
    },
    {
      title: "Bpifrance Création",
      category: "ENTREPRENEURIAT",
      description:
        "Méthodes et ressources pour passer d’une idée à une entreprise.",
      url: "https://bpifrance-creation.fr/",
    },
    {
      title: "CNIL · Intelligence artificielle",
      category: "IA & DONNÉES",
      description:
        "Comprendre les enjeux de protection des données dans les projets IA.",
      url: "https://www.cnil.fr/fr/intelligence-artificielle",
    },
    {
      title: "ANSSI · Guides et essentiels",
      category: "SÉCURITÉ",
      description: "Développer de bons réflexes de sécurité numérique.",
      url: "https://cyber.gouv.fr/les-guides-essentiels",
    },
  ];
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">RADAR / BIBLIOTHÈQUE DE SOURCES</p>
        <h1>Garder un regard ouvert.</h1>
        <p>
          Une sélection de points d’entrée institutionnels. La veille
          automatisée sera construite dans une prochaine étape.
        </p>
      </div>
      <div className="notice">
        <Icon name="radar" />
        <p>
          Ce Radar ne récupère pas d’actualités en direct. Les pages externes
          évoluent : vérifiez leur date et leur périmètre avant toute décision.
        </p>
      </div>
      <div className="catalog-grid">
        {sources.map((s) => (
          <a
            className="catalog-card panel external-card"
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            key={s.url}
          >
            <span className="eyebrow">{s.category}</span>
            <h2>{s.title}</h2>
            <p className="muted">{s.description}</p>
            <span className="text-button">
              Consulter la source <Icon name="arrow" size={16} />
            </span>
          </a>
        ))}
      </div>
    </>
  );
}

function Settings({
  state,
  update,
  cloud,
}: {
  state: AppState;
  update: StateUpdater;
  cloud: CloudSync;
}) {
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [pending, setPending] = useState<AppState | null>(null);
  const profile = state.profile!;
  const patchProfile = (changes: Partial<Profile>) =>
    update((s) => ({
      ...s,
      profile: s.profile ? { ...s.profile, ...changes } : null,
    }));
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">VOTRE ESPACE PERSONNEL</p>
        <h1>Vous gardez la main.</h1>
        <p>Profil, confidentialité et sauvegarde de vos apprentissages.</p>
      </div>
      <div className="settings-layout">
        <section className="panel">
          <h2>Votre cap</h2>
          <label className="field">
            Prénom ou pseudo
            <input
              maxLength={40}
              value={profile.name}
              onChange={(e) => patchProfile({ name: e.target.value })}
            />
          </label>
          <div className="field-grid">
            <label className="field">
              Niveau
              <select
                value={profile.level}
                onChange={(e) => patchProfile({ level: e.target.value })}
              >
                {withCurrent(levelOptions, profile.level).map((option) => (
                  <option key={option} value={option}>
                    {levelLabel(option)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Temps par session
              <select
                value={profile.minutes}
                onChange={(e) =>
                  patchProfile({ minutes: Number(e.target.value) })
                }
              >
                {withCurrent<number>(minuteOptions, profile.minutes).map(
                  (option) => (
                    <option key={option} value={option}>
                      {option} minutes
                    </option>
                  ),
                )}
              </select>
            </label>
          </div>
          <label className="field">
            Objectif
            <select
              value={profile.goal}
              onChange={(e) => patchProfile({ goal: e.target.value })}
            >
              {withCurrent(goalOptions, profile.goal).map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <fieldset className="interest-fields">
            <legend>Centres d’intérêt</legend>
            {interestOptions.map((interest) => (
              <label key={interest}>
                <input
                  type="checkbox"
                  checked={profile.interests.includes(interest)}
                  onChange={(e) =>
                    patchProfile({
                      interests: e.target.checked
                        ? [...profile.interests, interest]
                        : profile.interests.filter((x) => x !== interest),
                    })
                  }
                />
                {interest}
              </label>
            ))}
          </fieldset>
          <label className="field">
            Façon d’apprendre
            <select
              value={profile.preference}
              onChange={(e) => patchProfile({ preference: e.target.value })}
            >
              {withCurrent(preferenceOptions, profile.preference).map(
                (option) => (
                  <option key={option}>{option}</option>
                ),
              )}
            </select>
          </label>
          <p className="muted settings-note">
            Aujourd’hui, vos centres d’intérêt orientent la leçon proposée à
            l’accueil et le temps par session s’y affiche. Le niveau, l’objectif
            et la façon d’apprendre sont enregistrés mais ne modifient pas
            encore le parcours. Rien de tout cela ne change vos quiz, vos
            révisions ou vos projets, et tout le contenu reste accessible.
          </p>
        </section>
        <section className="panel">
          <h2>Vos données, ici.</h2>
          <p className="muted">
            Votre profil, vos réponses, notes et projets restent dans le
            stockage local de ce navigateur, sans date d’expiration automatique.
            Aucune analyse d’audience n’est activée.{" "}
            {cloud.status === "off"
              ? "Aucun compte, synchronisation ni appel IA n’est configuré sur cette installation."
              : "Une copie en ligne et le mentor IA ne s’activent qu’après votre connexion."}
          </p>
          <p className="muted">
            Une suppression des données du navigateur peut effacer votre
            progression. Exportez régulièrement votre sauvegarde JSON et
            conservez-la en lieu sûr. Les liens externes appliquent leur propre
            politique.
          </p>
          <div className="actions">
            <button
              className="button primary"
              onClick={() =>
                downloadFile(
                  "bouse-sauvegarde.json",
                  JSON.stringify(state, null, 2),
                )
              }
            >
              Exporter mes données
            </button>
            <label className="button secondary file-label">
              Importer une sauvegarde
              <input
                type="file"
                accept="application/json,.json"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  setPending(null);
                  if (!f) return;
                  try {
                    if (f.size > 5_000_000)
                      throw new Error(
                        "Fichier trop volumineux (5 Mo maximum).",
                      );
                    setPending(parseState(await f.text()));
                    setMessage(
                      "Sauvegarde reconnue. Son import remplacera les données de ce navigateur.",
                    );
                  } catch (error) {
                    setMessage(
                      error instanceof Error
                        ? error.message
                        : "Import impossible.",
                    );
                  }
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          {pending && (
            <div className="notice">
              <p>
                {pending.profile?.name || "Sans profil"} ·{" "}
                {pending.attempts.length} tentatives · {pending.projects.length}{" "}
                projets
              </p>
              <button
                className="button primary"
                onClick={() => {
                  update(() => pending);
                  setPending(null);
                  setMessage("Sauvegarde importée.");
                }}
              >
                Confirmer le remplacement
              </button>
              <button
                className="button secondary"
                onClick={() => setPending(null)}
              >
                Annuler
              </button>
            </div>
          )}
          <p role="status">{message}</p>
        </section>
        <CloudPanel cloud={cloud} state={state} />
        <section className="panel danger-panel">
          <h2>Repartir de zéro</h2>
          <p className="muted">
            Supprime le profil, les notes, les projets et la progression de ce
            navigateur.
          </p>
          {confirm ? (
            <div className="actions">
              <button
                className="button danger"
                onClick={() => {
                  try {
                    browserPersistence().clear();
                    update(() => structuredClone(emptyState));
                  } catch {
                    setMessage(
                      "Le navigateur interdit la suppression du stockage. Utilisez ses paramètres pour effacer les données du site ; votre session est conservée.",
                    );
                  }
                }}
              >
                Supprimer définitivement mes données locales
              </button>
              <button
                className="button secondary"
                onClick={() => setConfirm(false)}
              >
                Annuler
              </button>
            </div>
          ) : (
            <button
              className="button secondary"
              onClick={() => setConfirm(true)}
            >
              Réinitialiser mon espace
            </button>
          )}
        </section>
      </div>
    </>
  );
}

function Search({
  state,
  returnFocusRef,
  onClose,
  onNavigate,
}: {
  state: AppState;
  returnFocusRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  onNavigate: (route: string) => void;
}) {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      restoreFocus(returnFocusRef.current);
    };
  }, [returnFocusRef]);
  const searchable = (text: string) =>
    normalizeSearch(text)
      .replace(/\b(cash|liquidite)\b/g, "tresorerie")
      .replace(/\b(ai|llm)\b/g, "ia");
  const q = searchable(query);
  const entries = [
    {
      title: "Portfolio d’apprentissage",
      detail: "Mes compétences",
      route: "portfolio",
      search:
        "portfolio preuves dossier apprentissage Obsidian export Markdown notes",
    },
    ...navigation.map((n) => ({
      title: n.label,
      detail: "Espace",
      route: n.id,
      search:
        n.id === "simulation"
          ? `${n.label} et si simulation simulateur scénarios trésorerie cash délais clients`
          : n.id === "radar"
            ? `${n.label} radar sources références veille`
            : `${n.label} ${n.hint}`,
    })),
    ...lessons.map((l) => ({
      title: l.title,
      detail: `Leçon · ${l.domain}`,
      route: `lesson/${l.id}`,
      search: `${l.title} ${l.summary} ${l.skills.join(" ")} ${l.id.includes("llm") ? "ia" : ""}`,
    })),
    {
      title: "Lexique de la finance",
      detail: "Académie · Bourse et finance personnelle",
      route: "lexique",
      search:
        "lexique glossaire vocabulaire bourse budget crédit termes définitions",
    },
    ...glossary.map((entry) => ({
      title: entry.term,
      detail: `Lexique · ${entry.category}`,
      route: `lexique/${entry.id}`,
      search: `${entry.term} ${entry.definition}`,
    })),
    ...state.projects.map((p) => ({
      title: p.title,
      detail: "Projet",
      route: `project/${p.id}`,
      search: `${p.title} ${p.problem} ${p.customer}`,
    })),
    ...Object.entries(state.notes)
      .filter(([, note]) => note.trim())
      .map(([id, note]) => ({
        title: `Note · ${lessons.find((l) => l.id === id)?.title || id}`,
        detail: lessons.some((lesson) => lesson.id === id)
          ? "Note personnelle"
          : "Note hors catalogue · Portfolio",
        route: lessons.some((lesson) => lesson.id === id)
          ? `lesson/${id}`
          : "portfolio",
        search: note,
        // A note is found by its own text, not by the title of its lesson.
        rankTitle: note,
      })),
  ];
  const items = rankSearchResults(entries, q, (entry) => ({
    title: searchable(
      "rankTitle" in entry ? String(entry.rankTitle) : entry.title,
    ),
    description: searchable(entry.search),
  }));
  function focusResult(index: number) {
    const buttons =
      resultsRef.current?.querySelectorAll<HTMLButtonElement>("button");
    if (!buttons?.length) return;
    const button = buttons[Math.max(0, Math.min(index, buttons.length - 1))];
    button?.focus({ preventScroll: true });
    button?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }
  return (
    <dialog
      ref={ref}
      className="command-palette"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label="Recherche universelle"
    >
      <div className="palette-search">
        <Icon name="search" />
        <input
          autoFocus
          ref={inputRef}
          aria-label="Chercher une leçon, un projet ou une note"
          aria-describedby="search-result-count search-keyboard-hint"
          placeholder="Une notion, un projet, une prochaine étape…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              focusResult(event.key === "ArrowDown" ? 0 : items.length - 1);
            } else if (event.key === "Enter" && items[0]) {
              event.preventDefault();
              onNavigate(items[0].route);
            }
          }}
        />
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Fermer la recherche"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
      <div
        className="palette-results"
        ref={resultsRef}
        role="group"
        aria-labelledby="search-results-title"
      >
        <div className="palette-results-heading">
          <p className="eyebrow" id="search-results-title">
            {query ? "RÉSULTATS" : "ALLER QUELQUE PART"}
          </p>
          <span id="search-result-count" role="status" aria-atomic="true">
            {items.length} résultat{items.length > 1 ? "s" : ""}
          </span>
        </div>
        {items.map((i, index) => (
          <button
            key={`${i.route}-${index}`}
            onClick={() => onNavigate(i.route)}
            onKeyDown={(event) => {
              if (event.key === "ArrowUp" && index === 0) {
                event.preventDefault();
                inputRef.current?.focus();
                return;
              }
              const next =
                event.key === "ArrowDown"
                  ? index + 1
                  : event.key === "ArrowUp"
                    ? index - 1
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? items.length - 1
                        : null;
              if (next !== null) {
                event.preventDefault();
                focusResult(next);
              }
            }}
          >
            <span>
              <strong>{i.title}</strong>
              <small>{i.detail}</small>
            </span>
            <Icon name="arrow" size={17} />
          </button>
        ))}
        {items.length === 0 && (
          <p className="empty-state">
            Aucun résultat. Essayez « marge », « trésorerie » ou « prompt ».
          </p>
        )}
      </div>
      <div className="palette-footer" id="search-keyboard-hint">
        ↑ ↓ pour parcourir · Entrée pour ouvrir · Échap pour fermer
      </div>
    </dialog>
  );
}
export default App;

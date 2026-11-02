import { useEffect, useRef, useState } from "react";
import { lessons } from "./data/lessons";
import type { AppState, StateUpdater } from "./lib/types";
import {
  downloadFile,
  emptyState,
  parseState,
  readState,
  storageKey,
} from "./lib/storage";
import { normalizeSearch } from "./lib/domain";
import { Icon } from "./components/Icon";
import { Dashboard } from "./components/Dashboard";
import { KnowledgeMap } from "./components/KnowledgeMap";
import { Onboarding } from "./components/Onboarding";
import { AILab, Incubator, Lab } from "./components/Tools";
import { LessonView } from "./components/LessonView";
import { Reviews } from "./components/Reviews";

const navigation = [
  { id: "home", label: "Vue d’ensemble", icon: "home" },
  { id: "academy", label: "Academy", icon: "book" },
  { id: "skills", label: "Mes compétences", icon: "node" },
  { id: "reviews", label: "Révisions", icon: "clock" },
  { id: "lab", label: "Lab financier", icon: "lab" },
  { id: "incubator", label: "Incubator", icon: "idea" },
  { id: "ai", label: "AI Lab", icon: "ai" },
  { id: "radar", label: "Radar", icon: "radar" },
];
const getRoute = () => {
  try {
    return decodeURI(location.hash.slice(1)) || "home";
  } catch {
    return "home";
  }
};
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
  const latest = new Map(state.attempts.map((a) => [a.lessonId, a]));
  return new Set(
    [...latest.values()].filter((a) => a.passed).map((a) => a.lessonId),
  );
}
function App() {
  const [loaded, setLoaded] = useState(readState);
  const [state, setState] = useState(loaded.state);
  const [storageError, setStorageError] = useState<string | null>(loaded.error);
  const [route, navigate] = useRoute();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => matchMedia("(max-width: 700px)").matches,
  );
  const [resetCorrupt, setResetCorrupt] = useState(false);
  const titleRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const update: StateUpdater = (updater) => {
    setState((current) => {
      const next = updater(current);
      return next;
    });
  };
  useEffect(() => {
    if (loaded.error) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
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
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [mobileOpen]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
    titleRef.current?.focus({ preventScroll: true });
    document.title = `${navigation.find((n) => n.id === route)?.label || (route.startsWith("lesson/") ? "Leçon" : "Mon espace")} — BOUSE`;
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
                    localStorage.getItem(storageKey) || "{}",
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
                    localStorage.removeItem(storageKey);
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
  const lesson = route.startsWith("lesson/")
    ? lessons.find((l) => l.id === route.slice(7))
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
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        id="main-navigation"
        ref={sidebarRef}
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
          <span className="brand-mark">b.</span>
          <span>
            BOUSE<small>BUSINESS & AI ACADEMY</small>
          </span>
        </a>
        <button
          className="search-trigger"
          aria-label="Rechercher dans l’Academy"
          onClick={() => {
            setMobileOpen(false);
            setSearchOpen(true);
          }}
        >
          <Icon name="search" size={16} />
          <span>Rechercher</span>
          <kbd>⌘ K</kbd>
        </button>
        <p className="nav-section">VOTRE ESPACE</p>
        <nav aria-label="Navigation principale">
          {navigation.map((n) => (
            <a
              key={n.id}
              aria-label={n.label}
              href={`#${n.id}`}
              onClick={() => setMobileOpen(false)}
              aria-current={
                route === n.id || (n.id === "academy" && lesson)
                  ? "page"
                  : undefined
              }
              className={
                route === n.id || (n.id === "academy" && lesson)
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <Icon name={n.icon} size={19} />
              <span className="nav-label">{n.label}</span>
            </a>
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
            <progress value={done.size} max={lessons.length} />
            <small>Des preuves, une étape à la fois.</small>
          </div>
          <a
            href="#settings"
            aria-label="Profil et paramètres"
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
              {lesson
                ? "Academy"
                : navigation.find((n) => n.id === route)?.label ||
                  "Préférences"}
            </span>
          </div>
          <div>
            <span className="local-status">
              <i />
              Données locales
            </span>
            <button
              className="icon-button"
              aria-label="Ouvrir la recherche"
              onClick={() => setSearchOpen(true)}
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
            ) : route === "reviews" ? (
              <Reviews state={state} update={update} onNavigate={go} />
            ) : route === "lab" ? (
              <Lab />
            ) : route === "ai" ? (
              <AILab />
            ) : route === "incubator" ? (
              <Incubator state={state} update={update} />
            ) : route === "radar" ? (
              <Radar />
            ) : route === "settings" ? (
              <Settings state={state} update={update} />
            ) : (
              <div className="empty-state">
                <h1>Cette page n’existe pas.</h1>
                <button className="button primary" onClick={() => go("home")}>
                  Revenir à mon espace
                </button>
              </div>
            )}
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
              route === item.id || (item.id === "academy" && lesson)
                ? "page"
                : undefined
            }
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </a>
        ))}
        <button
          aria-label="Tous les espaces"
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
          onClose={() => setSearchOpen(false)}
          onNavigate={(next) => {
            go(next);
            setSearchOpen(false);
          }}
        />
      )}
    </div>
  );
}

function Academy({
  state,
  onNavigate,
}: {
  state: AppState;
  onNavigate: (route: string) => void;
}) {
  const [filter, setFilter] = useState("Tous");
  const [query, setQuery] = useState("");
  const done = passedIds(state);
  const visible = lessons.filter(
    (l) =>
      (filter === "Tous" || l.domain === filter) &&
      normalizeSearch(`${l.title} ${l.summary} ${l.skills.join(" ")}`).includes(
        normalizeSearch(query),
      ),
  );
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">APPRENDRE → FAIRE → PROUVER → APPLIQUER</p>
        <h1>Des fondations qui tiennent.</h1>
        <p>
          Six leçons approfondies pour commencer. Une progression qui relie les
          idées.
        </p>
      </div>
      <div className="catalog-toolbar">
        <div className="filter-tabs" aria-label="Domaines">
          {[
            "Tous",
            "Finance",
            "Entrepreneuriat",
            "Intelligence artificielle",
          ].map((d) => (
            <button
              key={d}
              aria-pressed={filter === d}
              className={filter === d ? "active" : ""}
              onClick={() => setFilter(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Icon name="search" size={17} />
          <input
            aria-label="Rechercher une leçon"
            placeholder="Une notion à explorer…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="catalog-grid">
        {visible.map((l, i) => (
          <article className="catalog-card panel" key={l.id}>
            <div className="panel-header">
              <span className="catalog-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`tag ${done.has(l.id) ? "success-tag" : ""}`}>
                {done.has(l.id) ? "Quiz validé" : `Niveau ${l.level}`}
              </span>
            </div>
            <p className="eyebrow">{l.domain}</p>
            <h2>{l.title}</h2>
            <p className="muted">{l.summary}</p>
            <div className="skills-tags">
              {l.skills.slice(0, 2).map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
            {l.prerequisites.length > 0 && (
              <p className="prerequisite">
                Repère conseillé :{" "}
                {lessons.find((x) => x.id === l.prerequisites[0])?.title}
              </p>
            )}
            <button
              className="text-button"
              onClick={() => onNavigate(`lesson/${l.id}`)}
            >
              {done.has(l.id) ? "Revoir" : "Explorer"} · {l.minutes} min
              <Icon name="arrow" size={16} />
            </button>
          </article>
        ))}
      </div>
      {visible.length === 0 && (
        <div className="empty-state">
          <h2>Aucune leçon pour cette recherche.</h2>
          <p>Essayez « marge », « client » ou « IA ».</p>
          <button
            className="button secondary"
            onClick={() => {
              setQuery("");
              setFilter("Tous");
            }}
          >
            Voir toutes les leçons
          </button>
        </div>
      )}
    </>
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
}: {
  state: AppState;
  update: StateUpdater;
}) {
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [pending, setPending] = useState<AppState | null>(null);
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
              value={state.profile!.name}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  profile: s.profile
                    ? { ...s.profile, name: e.target.value }
                    : null,
                }))
              }
            />
          </label>
          <label className="field">
            Temps par session
            <select
              value={state.profile!.minutes}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  profile: s.profile
                    ? { ...s.profile, minutes: Number(e.target.value) }
                    : null,
                }))
              }
            >
              <option value={10}>10 minutes</option>
              <option value={20}>20 minutes</option>
              <option value={40}>40 minutes</option>
            </select>
          </label>
          <p className="muted">Objectif : {state.profile!.goal}</p>
          <p className="muted">Préférence : {state.profile!.preference}</p>
        </section>
        <section className="panel">
          <h2>Vos données, ici.</h2>
          <p className="muted">
            Votre profil, vos réponses, notes et projets restent dans le
            stockage local de ce navigateur, sans date d’expiration automatique.
            Aucun compte, synchronisation cloud, analyse d’audience ou appel IA
            n’est activé.
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
                    localStorage.removeItem(storageKey);
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
  onClose,
  onNavigate,
}: {
  state: AppState;
  onClose: () => void;
  onNavigate: (route: string) => void;
}) {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);
  const searchable = (text: string) =>
    normalizeSearch(text)
      .replace(/\b(cash|liquidite)\b/g, "tresorerie")
      .replace(/\b(ai|llm)\b/g, "ia");
  const q = searchable(query);
  const items = [
    ...navigation.map((n) => ({
      title: n.label,
      detail: "Espace",
      route: n.id,
      search: n.label,
    })),
    ...lessons.map((l) => ({
      title: l.title,
      detail: `Leçon · ${l.domain}`,
      route: `lesson/${l.id}`,
      search: `${l.title} ${l.summary} ${l.skills.join(" ")} ${l.id.includes("llm") ? "ia" : ""}`,
    })),
    ...state.projects.map((p) => ({
      title: p.title,
      detail: "Projet · Incubator",
      route: "incubator",
      search: `${p.title} ${p.problem} ${p.customer}`,
    })),
    ...Object.entries(state.notes)
      .filter(([, note]) => note.trim())
      .map(([id, note]) => ({
        title: `Note · ${lessons.find((l) => l.id === id)?.title || id}`,
        detail: "Note personnelle",
        route: `lesson/${id}`,
        search: note,
      })),
  ].filter((i) => !q || searchable(i.search).includes(q));
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
          aria-label="Chercher une leçon, un projet ou une note"
          placeholder="Une notion, un projet, une prochaine étape…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Fermer la recherche"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
      <div className="palette-results">
        <p className="eyebrow">{query ? "RÉSULTATS" : "ALLER QUELQUE PART"}</p>
        {items.map((i, index) => (
          <button
            key={`${i.route}-${index}`}
            onClick={() => onNavigate(i.route)}
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
      <div className="palette-footer">
        Tab pour naviguer · Entrée pour ouvrir · Échap pour fermer
      </div>
    </dialog>
  );
}
export default App;

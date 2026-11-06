import { useState } from "react";
import { lessons } from "../data/lessons";
import { domains } from "../data/domains";
import { normalizeSearch } from "../lib/domain";
import { latestCurrentAttempt } from "../lib/portfolio";
import { useClock } from "../lib/useClock";
import { recommendLesson } from "../lib/recommendation";
import type { AppState, StateUpdater } from "../lib/types";
import { goalPathById, goalPaths } from "../data/goalPaths";
import { KnowledgeAtlas } from "./KnowledgeAtlas";
import { Icon } from "./Icon";
import { ProgressBar } from "./ProgressRing";
import { Terrain } from "./Terrain";
import { domainIdentity } from "../lib/domainIdentity";
import { lessonShortLabel } from "../data/lessonLabels";
import type { Domain } from "../data/domains";

export function Academy({
  state,
  update,
  onNavigate,
}: {
  state: AppState;
  update?: StateUpdater;
  onNavigate: (route: string) => void;
}) {
  const now = useClock();
  const [filter, setFilter] = useState("Tous");
  const [query, setQuery] = useState("");
  // A beginner starts with one guided path; the full atlas is one click away.
  const [view, setView] = useState<"start" | "atlas" | "catalog">("start");
  const recommendation = recommendLesson(state, now);
  const [selectedId, setSelectedId] = useState(() => recommendation.current.id);
  // The path shown: a chosen guided path, else the domain of the next lesson.
  const [pathDomain, setPathDomain] = useState<string>(
    () => state.activePathId ?? recommendation.current.domain,
  );
  const done = new Set(
    lessons
      .filter((l) => latestCurrentAttempt(l, state.attempts, now)?.passed)
      .map((l) => l.id),
  );
  const visible = lessons.filter(
    (l) =>
      (filter === "Tous" || l.domain === filter) &&
      normalizeSearch(`${l.title} ${l.summary} ${l.skills.join(" ")}`).includes(
        normalizeSearch(query),
      ),
  );
  const selected = visible.find((l) => l.id === selectedId) ?? visible[0];
  const shown = view === "catalog" ? visible : selected ? [selected] : [];
  return (
    <div className="academy-atlas art-page">
      <header className="art-heading">
        <div>
          <span className="instrument-index">
            Académie <i /> Tous les domaines
          </span>
          <h1>
            {lessons.length} notions, {domains.length} domaines.
          </h1>
        </div>
        <div className="financial-heading-side">
          <p>
            {view === "start"
              ? "Commencez par la leçon proposée, ou choisissez un domaine : le chemin s’affiche dans l’ordre."
              : "Chaque ligne relie une notion à ses prérequis. Choisissez un point d’entrée."}
          </p>
          <button className="text-button" onClick={() => onNavigate("lexique")}>
            Lexique de l’Académie <Icon name="arrow" size={16} />
          </button>
        </div>
      </header>
      <div className="atlas-toolbar">
        <div
          className="atlas-views"
          role="group"
          aria-label="Présentation de l’Académie"
        >
          <button
            aria-pressed={view === "start"}
            onClick={() => setView("start")}
          >
            <Icon name="play" size={16} />
            Commencer ici
          </button>
          <button
            aria-pressed={view === "atlas"}
            onClick={() => setView("atlas")}
          >
            <Icon name="node" size={16} />
            Atlas
          </button>
          <button
            aria-pressed={view === "catalog"}
            onClick={() => setView("catalog")}
          >
            <Icon name="book" size={16} />
            Catalogue
          </button>
        </div>
        <label className="search-field">
          <Icon name="search" size={16} />
          <input
            aria-label="Rechercher une leçon"
            placeholder="Une notion à explorer…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              // Searching means looking for something precise: show the list.
              if (view === "start" && e.target.value) setView("catalog");
            }}
          />
        </label>
      </div>
      {view === "start" && (
        <AcademyStart
          state={state}
          done={done}
          recommendation={recommendation}
          pathDomain={pathDomain}
          onPathDomain={setPathDomain}
          activePathId={state.activePathId ?? null}
          onFollow={
            update
              ? (id) => {
                  update((previous) => ({ ...previous, activePathId: id }));
                  if (id) setPathDomain(id);
                }
              : undefined
          }
          onNavigate={onNavigate}
          onAtlas={() => setView("atlas")}
        />
      )}
      {view !== "start" && (
        <div
          className="filter-tabs atlas-filters"
          role="group"
          aria-label="Domaines"
        >
          {["Tous", ...domains].map((d) => (
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
      )}
      {view === "atlas" && selected && (
        <KnowledgeAtlas
          selectedId={selected.id}
          onSelect={setSelectedId}
          done={done}
          visibleIds={new Set(visible.map((l) => l.id))}
        />
      )}
      {view !== "start" && (
        <div className={view === "atlas" ? "atlas-focus" : "atlas-catalog"}>
          {shown.map((l) => (
            <article className="catalog-card atlas-lesson" key={l.id}>
              <span className="atlas-lesson-index" aria-hidden="true">
                {String(lessons.indexOf(l) + 1).padStart(2, "0")}
              </span>
              <div className="atlas-lesson-main">
                <span className="instrument-index">
                  {l.domain} · Niveau {l.level}{" "}
                  {done.has(l.id) ? "· Quiz validé" : ""}
                </span>
                <h2>{l.title}</h2>
                <p>{l.summary}</p>
              </div>
              <div className="atlas-lesson-action">
                <span>{l.minutes} min de découverte</span>
                <button
                  className="button primary"
                  onClick={() => onNavigate(`lesson/${l.id}`)}
                >
                  {done.has(l.id) ? "Revoir" : "Explorer"} · {l.minutes} min{" "}
                  <Icon name="arrow" size={16} />
                </button>
                {l.prerequisites.length > 0 && (
                  <small>
                    Après{" "}
                    {l.prerequisites
                      .map((id) => lessons.find((x) => x.id === id)?.title)
                      .join(" · ")}
                  </small>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      {view !== "start" && !visible.length && (
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
      <footer className="atlas-foot">
        <span>
          {String(done.size).padStart(2, "0")} / {lessons.length} quiz validés
        </span>
        <button className="text-button" onClick={() => onNavigate("skills")}>
          Voir mes connaissances <Icon name="arrow" size={16} />
        </button>
      </footer>
    </div>
  );
}

/**
 * « Commencer ici » : the recommended lesson, its path in order, and the five
 * domains to switch path. Nothing here is hidden elsewhere: the atlas and the
 * catalogue show everything.
 */
function AcademyStart({
  done,
  recommendation,
  pathDomain,
  onPathDomain,
  activePathId,
  onFollow,
  onNavigate,
  onAtlas,
}: {
  state: AppState;
  done: Set<string>;
  recommendation: ReturnType<typeof recommendLesson>;
  pathDomain: string;
  onPathDomain: (key: string) => void;
  activePathId: string | null;
  onFollow?: (id: string | null) => void;
  onNavigate: (route: string) => void;
  onAtlas: () => void;
}) {
  const { current, reason, resumed } = recommendation;
  const goal = goalPathById(pathDomain);
  const path = goal
    ? goal.lessonIds.map((id) => lessons.find((lesson) => lesson.id === id)!)
    : lessons.filter((lesson) => lesson.domain === pathDomain);
  const firstOpen = path.find(
    (lesson) =>
      !done.has(lesson.id) && lesson.prerequisites.every((id) => done.has(id)),
  );
  return (
    <div className="academy-start">
      <section
        className="academy-start-card"
        aria-labelledby="academy-start-title"
      >
        <span className="academy-start-relief" aria-hidden="true">
          <Terrain />
        </span>
        <span className="eyebrow">
          {resumed ? "REPRENDRE ICI" : "COMMENCER ICI"}
        </span>
        <span className="academy-start-meta">
          {current.domain} · Niveau {current.level} · {current.minutes}
          {"\u00a0"}min
        </span>
        <h2 id="academy-start-title">{current.title}</h2>
        <p>{current.summary}</p>
        <p className="academy-start-reason">
          <Icon name="node" size={14} />
          <span>{reason}</span>
        </p>
        <button
          className="button primary"
          onClick={() => onNavigate(`lesson/${current.id}`)}
        >
          Ouvrir la leçon <Icon name="arrow" size={16} />
        </button>
      </section>
      <section className="academy-path" aria-labelledby="academy-path-title">
        <div className="academy-path-heading">
          <h2 id="academy-path-title">
            Le chemin ·{" "}
            {goal ? goal.title : domainIdentity[pathDomain as Domain].short}
          </h2>
          <small>
            {path.filter((lesson) => done.has(lesson.id)).length} /{" "}
            {path.length} validées
          </small>
        </div>
        <ol>
          {path.map((lesson, index) => {
            const isDone = done.has(lesson.id);
            const ready = lesson.prerequisites.every((id) => done.has(id));
            const isNext =
              lesson.id === current.id ||
              (!path.some((item) => item.id === current.id) &&
                lesson.id === firstOpen?.id);
            const status = isDone
              ? "Validée"
              : isNext
                ? "À faire maintenant"
                : ready
                  ? "Accessible"
                  : "Après ses prérequis";
            return (
              <li key={lesson.id}>
                <button
                  className={`academy-path-step ${isDone ? "is-done" : ""} ${isNext ? "is-next" : ""} ${!isDone && !ready ? "is-later" : ""}`}
                  onClick={() => onNavigate(`lesson/${lesson.id}`)}
                >
                  <span className="academy-path-mark" aria-hidden="true">
                    {isDone ? (
                      <Icon name="check" size={15} />
                    ) : isNext ? (
                      <Icon name="play" size={13} />
                    ) : ready ? (
                      index + 1
                    ) : (
                      <Icon name="lock" size={13} />
                    )}
                  </span>
                  <span className="academy-path-title">
                    {lessonShortLabel(lesson.id, lesson.title)}
                    {!isNext && <span className="sr-only">, {status}</span>}
                  </span>
                  <small>
                    {isNext ? status : `${lesson.minutes}\u00a0min`}
                  </small>
                </button>
              </li>
            );
          })}
        </ol>
        <button className="text-button" onClick={onAtlas}>
          Voir comment les notions se relient <Icon name="arrow" size={15} />
        </button>
      </section>
      <section
        className="academy-domains academy-goals"
        aria-labelledby="academy-goals-title"
      >
        <h2 id="academy-goals-title">Parcours par objectif</h2>
        <div className="academy-domain-grid">
          {goalPaths.map((item) => {
            const validated = item.lessonIds.filter((id) =>
              done.has(id),
            ).length;
            const following = activePathId === item.id;
            return (
              <div
                key={item.id}
                className={`academy-domain academy-goal ${following ? "is-following" : ""}`}
              >
                <button
                  type="button"
                  className="academy-goal-main"
                  aria-pressed={pathDomain === item.id}
                  onClick={() => onPathDomain(item.id)}
                >
                  <span className="academy-domain-icon">
                    <Icon name={item.icon} size={20} />
                  </span>
                  <strong>{item.title}</strong>
                  <span className="academy-domain-promise">{item.promise}</span>
                  <span className="academy-domain-count">
                    <ProgressBar value={validated / item.lessonIds.length} />
                    <small>
                      {validated} / {item.lessonIds.length} étapes
                    </small>
                  </span>
                </button>
                {onFollow && (
                  <button
                    type="button"
                    className="text-button academy-goal-follow"
                    aria-pressed={following}
                    onClick={() => onFollow(following ? null : item.id)}
                  >
                    {following
                      ? "Parcours suivi · arrêter"
                      : "Suivre ce parcours"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <section
        className="academy-domains"
        aria-labelledby="academy-domains-title"
      >
        <h2 id="academy-domains-title">Choisir un autre chemin</h2>
        <div className="academy-domain-grid">
          {(Object.keys(domainIdentity) as Domain[]).map((domain) => {
            const inDomain = lessons.filter(
              (lesson) => lesson.domain === domain,
            );
            const validated = inDomain.filter((lesson) =>
              done.has(lesson.id),
            ).length;
            const identity = domainIdentity[domain];
            return (
              <button
                key={domain}
                className="academy-domain"
                aria-pressed={pathDomain === domain}
                onClick={() => onPathDomain(domain)}
              >
                <span className="academy-domain-icon">
                  <Icon name={identity.icon} size={20} />
                </span>
                <strong>{domain}</strong>
                <span className="academy-domain-promise">
                  {identity.promise}
                </span>
                <span className="academy-domain-count">
                  <ProgressBar value={validated / inDomain.length} />
                  <small>
                    {validated} / {inDomain.length} notions
                  </small>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

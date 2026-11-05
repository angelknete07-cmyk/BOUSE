import { useState } from "react";
import { lessons } from "../data/lessons";
import { domains } from "../data/domains";
import { normalizeSearch } from "../lib/domain";
import { latestCurrentAttempt } from "../lib/portfolio";
import { useClock } from "../lib/useClock";
import type { AppState } from "../lib/types";
import { KnowledgeAtlas } from "./KnowledgeAtlas";
import { Icon } from "./Icon";

export function Academy({
  state,
  onNavigate,
}: {
  state: AppState;
  onNavigate: (route: string) => void;
}) {
  const now = useClock();
  const [filter, setFilter] = useState("Tous");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"atlas" | "catalog">("atlas");
  const [selectedId, setSelectedId] = useState(lessons[0]!.id);
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
            Académie <i /> Fondations
          </span>
          <h1>
            {lessons.length} notions, {domains.length} domaines.
          </h1>
        </div>
        <div className="financial-heading-side">
          <p>
            Chaque ligne relie une notion à ses prérequis. Choisissez un point
            d’entrée.
          </p>
          <button className="text-button" onClick={() => onNavigate("lexique")}>
            Lexique de la finance <Icon name="arrow" size={16} />
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
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
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
      {view === "atlas" && selected && (
        <KnowledgeAtlas
          selectedId={selected.id}
          onSelect={setSelectedId}
          done={done}
          visibleIds={new Set(visible.map((l) => l.id))}
        />
      )}
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
      {!visible.length && (
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
        <span>{String(done.size).padStart(2, "0")} / 06 quiz validés</span>
        <button className="text-button" onClick={() => onNavigate("skills")}>
          Voir mes connaissances <Icon name="arrow" size={16} />
        </button>
      </footer>
    </div>
  );
}

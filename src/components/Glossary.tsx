import { useEffect, useState } from "react";
import {
  glossary,
  glossaryCategories,
  sortedGlossary,
  type GlossaryCategory,
} from "../data/investingGlossary";
import { lessons } from "../data/lessons";
import { normalizeSearch } from "../lib/domain";
import { Icon } from "./Icon";

/** Dictionary of market vocabulary, linked back to the lesson that explains each term. */
export function Glossary({
  focusId,
  onNavigate,
}: {
  focusId: string | null;
  onNavigate: (route: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GlossaryCategory | "Tous">("Tous");
  // On a phone, definitions open on demand; the targeted term is open.
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(focusId ? [focusId] : []),
  );
  const q = normalizeSearch(query);
  const visible = sortedGlossary(glossary).filter(
    (entry) =>
      (category === "Tous" || entry.category === category) &&
      (!q || normalizeSearch(`${entry.term} ${entry.definition}`).includes(q)),
  );
  // Looking a term up means reading it: a search or a short list opens everything.
  const isOpen = (id: string) =>
    open.has(id) || Boolean(q) || visible.length <= 3;
  const groups = new Map<string, typeof visible>();
  for (const entry of visible) {
    const letter = normalizeSearch(entry.term).charAt(0).toUpperCase();
    groups.set(letter, [...(groups.get(letter) ?? []), entry]);
  }

  useEffect(() => {
    if (!focusId) return;
    setOpen((current) => new Set(current).add(focusId));
    const target = document.getElementById(`terme-${focusId}`);
    target?.scrollIntoView({ block: "center" });
    target?.focus({ preventScroll: true });
  }, [focusId]);

  return (
    <div className="glossary art-page">
      <header className="art-heading">
        <div>
          <span className="instrument-index">
            Académie <i /> Cinq domaines
          </span>
          <h1>Lexique de l’Académie.</h1>
        </div>
        <p>
          {glossary.length} termes, chacun relié à la leçon qui l’explique.
          Définitions générales, sans conseil ni règle fiscale chiffrée.
        </p>
      </header>
      <div className="glossary-toolbar">
        <label className="search-field">
          <Icon name="search" size={16} />
          <input
            aria-label="Chercher un terme"
            placeholder="Un terme, une définition…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div
          className="filter-tabs glossary-filters"
          role="group"
          aria-label="Catégories du lexique"
        >
          {(["Tous", ...glossaryCategories] as const).map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={category === name}
              className={category === name ? "active" : ""}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <p className="glossary-count" role="status">
        {visible.length} terme{visible.length > 1 ? "s" : ""}
      </p>
      {groups.size > 3 && (
        <nav className="glossary-index" aria-label="Aller à une lettre">
          {[...groups.keys()].map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => {
                const target = document.getElementById(`lettre-${letter}`);
                target?.scrollIntoView({
                  block: "start",
                  behavior: matchMedia("(prefers-reduced-motion: reduce)")
                    .matches
                    ? "instant"
                    : "smooth",
                });
              }}
            >
              {letter}
            </button>
          ))}
        </nav>
      )}
      {visible.length ? (
        <div className="glossary-groups">
          {[...groups].map(([letter, entries]) => (
            <section
              key={letter}
              className="glossary-group"
              aria-labelledby={`lettre-${letter}`}
            >
              <h2 id={`lettre-${letter}`} className="glossary-letter">
                {letter}
              </h2>
              <dl>
                {entries.map((entry) => {
                  const lesson = lessons.find(
                    (item) => item.id === entry.lessonId,
                  );
                  return (
                    <div
                      key={entry.id}
                      id={`terme-${entry.id}`}
                      tabIndex={-1}
                      className={`glossary-entry ${focusId === entry.id ? "is-focused" : ""}`}
                    >
                      <dt>
                        {entry.term}
                        <span>{entry.category}</span>
                      </dt>
                      <dd
                        className={
                          open.has(entry.id)
                            ? "is-open"
                            : isOpen(entry.id)
                              ? "is-open is-forced"
                              : ""
                        }
                      >
                        <p id={`definition-${entry.id}`}>{entry.definition}</p>
                        <button
                          type="button"
                          className="glossary-toggle"
                          aria-expanded={isOpen(entry.id)}
                          aria-controls={`definition-${entry.id}`}
                          onClick={() =>
                            setOpen((current) => {
                              const next = new Set(current);
                              if (next.has(entry.id)) next.delete(entry.id);
                              else next.add(entry.id);
                              return next;
                            })
                          }
                        >
                          {open.has(entry.id)
                            ? "Replier"
                            : "Lire la définition"}
                        </button>
                        {lesson && (
                          <button
                            type="button"
                            className="text-button"
                            onClick={() => onNavigate(`lesson/${lesson.id}`)}
                          >
                            Leçon : {lesson.title}
                            <Icon name="arrow" size={14} />
                          </button>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          ))}
        </div>
      ) : (
        <p className="glossary-empty">
          Aucun terme ne correspond. Essayez un mot plus court ou une autre
          catégorie.
        </p>
      )}
    </div>
  );
}

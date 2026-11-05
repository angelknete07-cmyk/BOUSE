import { useEffect, useRef, type CSSProperties } from "react";
import { lessons } from "../data/lessons";
import { Icon } from "./Icon";

const positions: Record<string, { x: number; y: number; short: string }> = {
  "ca-marge-tresorerie": { x: 16, y: 22, short: "Lire les chiffres" },
  "seuil-rentabilite": { x: 53, y: 22, short: "Trouver l’équilibre" },
  "validation-client": { x: 29, y: 53, short: "Comprendre le client" },
  "comprendre-llm": { x: 16, y: 83, short: "Comprendre le modèle" },
  "prompt-structure": { x: 53, y: 83, short: "Structurer la demande" },
  "automatisation-agent": { x: 86, y: 60, short: "Orchestrer l’action" },
};
export function KnowledgeAtlas({
  selectedId,
  onSelect,
  done,
  visibleIds,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  done: Set<string>;
  visibleIds: Set<string>;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const region = scrollRef.current;
    const node = region?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!region || !node) return;
    const bounds = region.getBoundingClientRect();
    const point = node.getBoundingClientRect();
    if (point.left < bounds.left || point.right > bounds.right) {
      region.scrollTo({
        left:
          region.scrollLeft +
          point.left -
          bounds.left -
          (bounds.width - point.width) / 2,
        behavior: "instant",
      });
    }
  }, [selectedId]);
  return (
    <div
      ref={scrollRef}
      className="atlas-scroll"
      role="region"
      aria-label="Atlas des connaissances, domaines et prérequis"
      tabIndex={0}
    >
      <div className="academy-map-canvas">
        <div className="atlas-levels" aria-hidden="true">
          <span>01 / Fondations</span>
          <span>02 / Relations</span>
          <span>03 / Application</span>
        </div>
        <svg
          viewBox="0 0 1000 480"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="atlas-light">
              <stop stopColor="var(--accent)" stopOpacity="0" />
              <stop offset=".5" stopColor="var(--accent)" stopOpacity=".16" />
              <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.2, 0.5, 0.8].map((y) => (
            <path key={y} className="atlas-guide" d={`M0 ${y * 480}H1000`} />
          ))}
          {[0.16, 0.53, 0.86].map((x) => (
            <path
              key={x}
              className="atlas-guide vertical"
              d={`M${x * 1000} 35V470`}
            />
          ))}
          {lessons.flatMap((lesson) =>
            lesson.prerequisites.map((id) => {
              const a = positions[id],
                b = positions[lesson.id];
              if (!a || !b || !visibleIds.has(id) || !visibleIds.has(lesson.id))
                return null;
              const active = selectedId === id || selectedId === lesson.id;
              return (
                <path
                  key={`${id}-${lesson.id}`}
                  className={`atlas-link ${active ? "is-active" : ""}`}
                  d={`M${a.x * 10} ${a.y * 4.8} C${(a.x + b.x) * 5} ${a.y * 4.8},${(a.x + b.x) * 5} ${b.y * 4.8},${b.x * 10} ${b.y * 4.8}`}
                />
              );
            }),
          )}
        </svg>
        <span className="atlas-domain atlas-finance">Finance</span>
        <span className="atlas-domain atlas-business">Entrepreneuriat</span>
        <span className="atlas-domain atlas-ai">Intelligence artificielle</span>
        {lessons.map((lesson, index) => {
          const point = positions[lesson.id]!;
          return (
            <button
              key={lesson.id}
              type="button"
              className={`atlas-node ${visibleIds.has(lesson.id) ? "" : "is-filtered"} ${done.has(lesson.id) ? "is-complete" : ""}`}
              aria-describedby={`atlas-description-${lesson.id}`}
              aria-pressed={selectedId === lesson.id}
              onClick={() => onSelect(lesson.id)}
              hidden={!visibleIds.has(lesson.id)}
              style={
                {
                  "--atlas-x": `${point.x}%`,
                  "--atlas-y": `${point.y}%`,
                } as CSSProperties
              }
            >
              <span className="atlas-node-orbit">
                <span>
                  {done.has(lesson.id) ? (
                    <Icon name="check" size={18} />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </span>
              </span>
              <strong>{point.short}</strong>
              <span hidden id={`atlas-description-${lesson.id}`}>
                {lesson.title}
              </span>
              <small>
                {done.has(lesson.id)
                  ? "Quiz validé"
                  : `${lesson.minutes} min · niveau ${lesson.level}`}
              </small>
            </button>
          );
        })}
        <span className="atlas-caption">
          Une ligne relie une notion à son prérequis.
        </span>
      </div>
    </div>
  );
}

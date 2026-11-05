import { useId, useRef, useState, type CSSProperties } from "react";
import { lessonShortLabel } from "../data/lessonLabels";
import { lessons, type Lesson } from "../data/lessons";
import type { AppState, Attempt } from "../lib/types";
import { Icon } from "./Icon";
import { currentQuizAttempts, latestCurrentAttempt } from "../lib/portfolio";
import { useClock } from "../lib/useClock";

type Props = {
  state: AppState;
  onNavigate: (route: string) => void;
};

type Position = { x: number; y: number };
const positions: Record<string, Position> = {
  "ca-marge-tresorerie": { x: 12.5, y: 23 },
  "seuil-rentabilite": { x: 12.5, y: 56 },
  "validation-client": { x: 37.5, y: 23 },
  "comprendre-llm": { x: 62.5, y: 23 },
  "prompt-structure": { x: 62.5, y: 51 },
  "automatisation-agent": { x: 62.5, y: 78 },
  "inv-marches-financiers": { x: 87.5, y: 14 },
  "inv-interets-composes": { x: 87.5, y: 32 },
  "inv-risque-diversification": { x: 87.5, y: 50 },
  "inv-fonds-enveloppes": { x: 87.5, y: 68 },
  "inv-ordres-biais": { x: 87.5, y: 86 },
};

function latestAttempt(state: AppState, id: string, now: Date) {
  const lesson = lessons.find((entry) => entry.id === id);
  return lesson ? latestCurrentAttempt(lesson, state.attempts, now) : undefined;
}

function statusLabel(attempt: Attempt | undefined) {
  return attempt
    ? attempt.passed
      ? "Quiz validé"
      : "À reprendre"
    : "À explorer";
}

/** A prerequisite map, not a percentage estimate of professional mastery. */
export function KnowledgeMap({ state, onNavigate }: Props) {
  const now = useClock();
  const [selectedId, setSelectedId] = useState(
    lessons.some((lesson) => lesson.id === state.lastLessonId)
      ? state.lastLessonId!
      : lessons[0]!.id,
  );
  const detailRef = useRef<HTMLElement>(null);
  const markerId = `knowledge-arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const selected = lessons.find((lesson) => lesson.id === selectedId)!;
  const latest = latestAttempt(state, selected.id, now);
  const attempts = currentQuizAttempts(selected, state.attempts, now);
  const prerequisites = selected.prerequisites
    .map((id) => lessons.find((lesson) => lesson.id === id))
    .filter((lesson): lesson is Lesson => !!lesson);
  const following = lessons.filter((lesson) =>
    lesson.prerequisites.includes(selected.id),
  );
  const verified = lessons.filter(
    (lesson) => latestAttempt(state, lesson.id, now)?.passed,
  ).length;
  const toReview = lessons.filter((lesson) => {
    const attempt = latestAttempt(state, lesson.id, now);
    return attempt && !attempt.passed;
  }).length;
  const edges = lessons.flatMap((lesson) =>
    lesson.prerequisites.map((prerequisite) => ({
      from: prerequisite,
      to: lesson.id,
    })),
  );
  const linkedProjects = state.projects.filter((project) =>
    project.lessonIds.includes(selected.id),
  );
  const learningProjects = state.projects.filter((project) =>
    project.learningGoalIds?.includes(selected.id),
  );

  function select(id: string) {
    setSelectedId(id);
    if (matchMedia("(max-width: 700px)").matches) {
      requestAnimationFrame(() => {
        detailRef.current?.scrollIntoView({
          block: "nearest",
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      });
    }
  }

  return (
    <>
      <header className="page-heading knowledge-heading">
        <div>
          <p className="eyebrow">VOTRE CARTE DE CONNAISSANCES</p>
          <h1>Relier les idées. Trouver la suite.</h1>
          <p>
            Les notions se construisent les unes sur les autres. Sélectionnez un
            point pour voir vos preuves et le prochain pas.
          </p>
        </div>
        <button className="text-button" onClick={() => onNavigate("portfolio")}>
          Ouvrir mon portfolio <Icon name="arrow" size={16} />
        </button>
      </header>
      <div
        className="knowledge-summary"
        role="group"
        aria-label="Vos repères actuels"
      >
        <p>
          <strong>{verified}</strong> quiz validé{verified > 1 ? "s" : ""}
        </p>
        <p>
          <strong>{toReview}</strong> notion{toReview > 1 ? "s" : ""} à
          reprendre
        </p>
        <p>
          <strong>{lessons.length}</strong> notions reliées
        </p>
      </div>
      <div className="knowledge-explorer">
        <section className="knowledge-atlas" aria-label="Carte des prérequis">
          <div className="knowledge-map-key" role="group" aria-label="Légende">
            <span>
              <i className="knowledge-key-point" /> À explorer
            </span>
            <span>
              <Icon name="check" size={12} /> Quiz validé
            </span>
            <span>
              <span aria-hidden="true">↺</span> À reprendre
            </span>
          </div>
          <div
            className="knowledge-canvas"
            role="group"
            aria-label="Notions à explorer sur la carte"
          >
            <div className="knowledge-lanes" aria-hidden="true">
              <span>Finance</span>
              <span>Entrepreneuriat</span>
              <span>Intelligence artificielle</span>
              <span>Investissement</span>
            </div>
            <svg
              className="knowledge-connections"
              viewBox="0 0 1000 560"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id={markerId}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M 1 1 L 8 5 L 1 9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </marker>
              </defs>
              {edges.map((edge) => {
                const from = positions[edge.from];
                const to = positions[edge.to];
                if (!from || !to) return null;
                const bypass =
                  edge.from === "comprendre-llm" &&
                  edge.to === "automatisation-agent";
                const fromX = from.x * 10;
                const fromY = from.y * 5.6;
                const toX = to.x * 10;
                const toY = to.y * 5.6;
                const d = bypass
                  ? `M ${fromX - 18} ${fromY} C ${fromX - 160} ${fromY + 40}, ${toX - 160} ${toY - 40}, ${toX - 20} ${toY}`
                  : `M ${fromX} ${fromY + 19} L ${toX} ${toY - 23}`;
                const active =
                  edge.from === selectedId || edge.to === selectedId;
                return (
                  <path
                    key={`${edge.from}-${edge.to}`}
                    d={d}
                    className={active ? "is-related" : ""}
                    markerEnd={`url(#${markerId})`}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </svg>
            {lessons.map((lesson) => {
              const position = positions[lesson.id];
              if (!position) return null;
              const attempt = latestAttempt(state, lesson.id, now);
              return (
                <button
                  key={lesson.id}
                  type="button"
                  className={`knowledge-node ${selectedId === lesson.id ? "is-selected" : ""} ${attempt?.passed ? "is-verified" : ""}`}
                  style={
                    {
                      "--node-x": `${position.x}%`,
                      "--node-y": `${position.y}%`,
                    } as CSSProperties
                  }
                  aria-describedby={`knowledge-description-${lesson.id}`}
                  aria-pressed={selectedId === lesson.id}
                  aria-controls="knowledge-details"
                  onClick={() => select(lesson.id)}
                >
                  <span className="knowledge-node-point" aria-hidden="true">
                    {attempt?.passed ? (
                      <Icon name="check" size={14} />
                    ) : attempt ? (
                      <Icon name="clock" size={14} />
                    ) : (
                      <span className="knowledge-node-core" />
                    )}
                  </span>
                  <span className="knowledge-node-label">
                    {lessonShortLabel(lesson.id, lesson.title)}
                  </span>
                  <span hidden id={`knowledge-description-${lesson.id}`}>
                    {lesson.title}
                  </span>
                  <span className="knowledge-node-status">
                    {statusLabel(attempt)}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="knowledge-map-caption">
            <Icon name="arrow" size={14} /> Une flèche relie un prérequis à la
            notion suivante. Les liens ne bloquent pas votre exploration.
          </p>
        </section>
        <article
          className="knowledge-details"
          id="knowledge-details"
          ref={detailRef}
          aria-labelledby="knowledge-detail-title"
        >
          <div key={selected.id} className="knowledge-detail-content">
            <p className="eyebrow">
              {selected.domain} · NIVEAU {selected.level}
            </p>
            <h2 id="knowledge-detail-title">{selected.title}</h2>
            <p className="knowledge-proof" role="status">
              {latest
                ? latest.passed
                  ? "Compréhension vérifiée au dernier quiz"
                  : `À reprendre · dernier score ${latest.percent} %`
                : "À explorer · aucune preuve pour le moment"}
            </p>
            {latest && (
              <p className="knowledge-proof-detail">
                {latest.correct}/{latest.total} réponses correctes à la dernière
                tentative · {attempts.length} tentative
                {attempts.length > 1 ? "s" : ""}.
              </p>
            )}
            <p className="knowledge-detail-summary">{selected.summary}</p>
            <section className="knowledge-detail-section">
              <h3>Les compétences travaillées</h3>
              <ul className="knowledge-skill-list">
                {selected.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </section>
            <section className="knowledge-detail-section">
              <h3>
                {prerequisites.length
                  ? "Avant cette notion"
                  : "Un point de départ"}
              </h3>
              {prerequisites.length ? (
                prerequisites.map((lesson) => (
                  <button
                    className="knowledge-related"
                    type="button"
                    key={lesson.id}
                    onClick={() => select(lesson.id)}
                  >
                    <span>
                      {lesson.title}
                      <small>
                        {statusLabel(latestAttempt(state, lesson.id, now))}
                      </small>
                    </span>
                    <Icon name="arrow" size={15} />
                  </button>
                ))
              ) : (
                <p>
                  Cette notion ne demande aucun prérequis dans votre parcours.
                </p>
              )}
            </section>
            {following.length > 0 && (
              <section className="knowledge-detail-section">
                <h3>Ce que cela vous ouvre</h3>
                {following.map((lesson) => (
                  <button
                    className="knowledge-related"
                    type="button"
                    key={lesson.id}
                    onClick={() => select(lesson.id)}
                  >
                    <span>{lesson.title}</span>
                    <Icon name="arrow" size={15} />
                  </button>
                ))}
              </section>
            )}
            {learningProjects.length > 0 && (
              <section className="knowledge-detail-section">
                <h3>Objectif dans vos projets</h3>
                {learningProjects.map((project) => (
                  <button
                    className="knowledge-related"
                    key={project.id}
                    onClick={() => onNavigate(`project-plan/${project.id}`)}
                  >
                    <span>
                      {project.title}
                      <small>Voir le parcours d’apprentissage</small>
                    </span>
                    <Icon name="arrow" size={15} />
                  </button>
                ))}
              </section>
            )}
            {linkedProjects.length > 0 && (
              <section className="knowledge-detail-section">
                <h3>Déjà reliée à vos projets</h3>
                <p>
                  {linkedProjects.map((project) => project.title).join(" · ")}
                </p>
                <button
                  className="text-button"
                  type="button"
                  onClick={() => onNavigate("incubator")}
                >
                  Revenir à mes projets <Icon name="arrow" size={15} />
                </button>
              </section>
            )}
            <button
              className="button primary knowledge-lesson-action"
              type="button"
              onClick={() => onNavigate(`lesson/${selected.id}`)}
            >
              {latest && !latest.passed
                ? "Réviser cette notion"
                : "Travailler cette compétence"}
              <Icon name="arrow" size={16} />
            </button>
            <p className="knowledge-evidence-note">
              Un quiz apporte un repère de compréhension. La maîtrise se
              confirme dans des situations réelles.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}

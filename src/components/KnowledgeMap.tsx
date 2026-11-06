import { useId, useRef, useState, type CSSProperties } from "react";
import { lessonShortLabel } from "../data/lessonLabels";
import { lessons, type Lesson } from "../data/lessons";
import type { AppState, Attempt } from "../lib/types";
import { Icon } from "./Icon";
import { currentQuizAttempts, latestCurrentAttempt } from "../lib/portfolio";
import { useClock } from "../lib/useClock";
import { recommendLesson } from "../lib/recommendation";
import { columnLayout } from "../lib/mapLayout";

type Props = {
  state: AppState;
  onNavigate: (route: string) => void;
};

// One column per domain, laid out from the catalogue: new lessons find their place.
const { positions, height: canvasHeight } = columnLayout(lessons);
const columnStep = (88 / canvasHeight) * 100;

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
  // What you just worked on first (its proofs), otherwise the shared next lesson.
  const [selectedId, setSelectedId] = useState(() =>
    lessons.some((lesson) => lesson.id === state.lastLessonId)
      ? state.lastLessonId!
      : recommendLesson(state, now).current.id,
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
            D’abord où vous en êtes. Ensuite, la carte complète relie chaque
            notion à ses prérequis : sélectionnez un point pour voir vos
            preuves.
          </p>
        </div>
        <button className="text-button" onClick={() => onNavigate("portfolio")}>
          Ouvrir mon portfolio <Icon name="arrow" size={16} />
        </button>
      </header>
      <SkillsSummary state={state} now={now} onNavigate={onNavigate} />
      <h2 className="knowledge-full-title">
        La carte complète{" "}
        <small>
          {verified} validée{verified > 1 ? "s" : ""} · {toReview} à reprendre ·{" "}
          {lessons.length} notions reliées
        </small>
      </h2>
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
          <div className="knowledge-scroll">
            <div
              className="knowledge-canvas"
              style={{ "--map-height": `${canvasHeight}px` } as CSSProperties}
              role="group"
              aria-label="Notions à explorer sur la carte"
            >
              <div className="knowledge-lanes" aria-hidden="true">
                <span>Finance</span>
                <span>Entrepreneuriat</span>
                <span>Intelligence artificielle</span>
                <span>Finance personnelle</span>
                <span>Investissement</span>
              </div>
              <svg
                className="knowledge-connections"
                viewBox={`0 0 1000 ${canvasHeight}`}
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
                  const scale = canvasHeight / 100;
                  // A link that skips notions in its column bows around them.
                  const bypass =
                    from.x === to.x &&
                    Math.abs(to.y - from.y) > columnStep * 1.5;
                  const fromX = from.x * 10;
                  const fromY = from.y * scale;
                  const toX = to.x * 10;
                  const toY = to.y * scale;
                  const d = bypass
                    ? `M ${fromX - 18} ${fromY} C ${fromX - 160} ${fromY + 40}, ${toX - 160} ${toY - 40}, ${toX - 20} ${toY}`
                    : from.x === to.x
                      ? `M ${fromX} ${fromY + 19} L ${toX} ${toY - 23}`
                      : `M ${fromX + 20} ${fromY} C ${(fromX + toX) / 2} ${fromY}, ${(fromX + toX) / 2} ${toY}, ${toX - 22} ${toY}`;
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
              Un quiz apporte une indication de compréhension. La maîtrise se
              confirme dans des situations réelles.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}

/**
 * Where you stand before the map: what is acquired, what is in progress, and
 * what comes next. The map below keeps every relation.
 */
function SkillsSummary({
  state,
  now,
  onNavigate,
}: {
  state: AppState;
  now: Date;
  onNavigate: (route: string) => void;
}) {
  const { done, latest, current } = recommendLesson(state, now);
  const acquired = lessons.filter((lesson) => done.has(lesson.id));
  const inProgress = lessons.filter(
    (lesson) =>
      !done.has(lesson.id) &&
      (latest.has(lesson.id) || (state.lessonPositions?.[lesson.id] ?? 0) > 0),
  );
  // « Ensuite » never repeats what is already in progress.
  const nextUp = [
    ...(inProgress.includes(current) ? [] : [current]),
    ...lessons.filter(
      (lesson) =>
        lesson.id !== current.id &&
        !done.has(lesson.id) &&
        !inProgress.includes(lesson) &&
        lesson.prerequisites.length > 0 &&
        lesson.prerequisites.every((id) => done.has(id)),
    ),
  ].slice(0, 3);
  const column = (
    title: string,
    count: number,
    items: Lesson[],
    note: (lesson: Lesson) => string,
    empty: string,
    icon: string,
  ) => (
    <section className="skills-summary-card">
      <h2>
        <span className="skills-summary-icon">
          <Icon name={icon} size={16} />
        </span>
        {title} <strong>{count}</strong>
      </h2>
      {items.length ? (
        <ul>
          {items.slice(0, 4).map((lesson) => (
            <li key={lesson.id}>
              <button onClick={() => onNavigate(`lesson/${lesson.id}`)}>
                <span>{lessonShortLabel(lesson.id, lesson.title)}</span>
                <small>{note(lesson)}</small>
              </button>
            </li>
          ))}
          {items.length > 4 && (
            <li className="skills-summary-more">
              et {items.length - 4} autre{items.length - 4 > 1 ? "s" : ""} sur
              la carte
            </li>
          )}
        </ul>
      ) : (
        <p>{empty}</p>
      )}
    </section>
  );
  return (
    <div className="skills-summary" role="group" aria-label="Où vous en êtes">
      {column(
        "Acquis",
        acquired.length,
        [...acquired].reverse(),
        (lesson) => lesson.domain,
        "Votre premier quiz réussi apparaîtra ici.",
        "check",
      )}
      {column(
        "En cours",
        inProgress.length,
        inProgress,
        (lesson) =>
          latest.has(lesson.id)
            ? "Quiz à reprendre"
            : `Séquence ${(state.lessonPositions?.[lesson.id] ?? 0) + 1}`,
        "Rien en suspens : tout ce que vous avez ouvert est validé.",
        "clock",
      )}
      {column(
        "Ensuite",
        nextUp.length,
        nextUp,
        (lesson) =>
          lesson.id === current.id ? "Votre prochaine leçon" : "Accessible",
        "Tout est validé.",
        "arrow",
      )}
    </div>
  );
}

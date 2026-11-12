import { useMemo, useRef, useState } from "react";
import { lessonShortLabel } from "../data/lessonLabels";
import { practicedSkills } from "../lib/missions";
import { lessons, type Lesson } from "../data/lessons";
import type { AppState, Attempt } from "../lib/types";
import { Icon } from "./Icon";
import { currentQuizAttempts, latestCurrentAttempt } from "../lib/portfolio";
import { useClock } from "../lib/useClock";
import { recommendLesson } from "../lib/recommendation";
import { SkillTree } from "./SkillTree";
import { CATALOGUE_SKILLS } from "../data/catalogue";
import {
  DOMAIN_NAMES,
  chosenDomainIds,
  quizTarget,
  skillStatuses,
  treeNodes,
} from "../lib/catalogue";

type Props = {
  state: AppState;
  onNavigate: (route: string) => void;
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
  // What you just worked on first (its proofs), otherwise the shared next lesson.
  const [selectedId, setSelectedId] = useState(() =>
    lessons.some((lesson) => lesson.id === state.lastLessonId)
      ? state.lastLessonId!
      : recommendLesson(state, now).current.id,
  );
  const detailRef = useRef<HTMLElement>(null);
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
  // L'arbre montre les compétences des domaines choisis ; l'état de chacune
  // vient du dernier quiz courant de sa leçon (« bientôt » sans leçon).
  const domainKey = chosenDomainIds(state).join(",");
  const items = useMemo(() => treeNodes(domainKey.split(",")), [domainKey]);
  const practiced = useMemo(() => practicedSkills(state), [state.missions]);
  const statuses = skillStatuses(
    CATALOGUE_SKILLS.filter((skill) => items.some((i) => i.id === skill.id)),
    (id) => {
      const attempt = latestCurrentAttempt(quizTarget(id), state.attempts, now);
      return attempt ? (attempt.passed ? "passed" : "failed") : undefined;
    },
  );
  const recommended = recommendLesson(state, now).current.id;
  const nextId =
    !statuses[recommended] || statuses[recommended] === "done"
      ? null
      : recommended;
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
            D’abord où vous en êtes. Ensuite, l’arbre range chaque notion dans
            sa branche, des bases vers la suite : agrandissez-le et touchez une
            leçon pour voir vos preuves.
          </p>
        </div>
        <button className="text-button" onClick={() => onNavigate("portfolio")}>
          Ouvrir mon portfolio <Icon name="arrow" size={16} />
        </button>
      </header>
      <SkillsSummary state={state} now={now} onNavigate={onNavigate} />
      <h2 className="knowledge-full-title">
        L’arbre complet{" "}
        <small>
          {verified} validée{verified > 1 ? "s" : ""} · {toReview} à reprendre ·{" "}
          {items.length} compétences reliées
        </small>
      </h2>
      <div className="knowledge-explorer">
        <section
          className="knowledge-atlas"
          aria-label="L’arbre des compétences"
        >
          <SkillTree
            items={items}
            laneNames={DOMAIN_NAMES}
            statuses={statuses}
            practiced={practiced}
            nextId={nextId}
            onSelect={(id) => {
              // La fiche de la page suit les compétences qui ont leur leçon.
              if (lessons.some((lesson) => lesson.id === id)) setSelectedId(id);
            }}
            onNavigate={onNavigate}
          />
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

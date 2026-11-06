import { useState, type CSSProperties } from "react";
import { lessons, type Lesson } from "../data/lessons";
import type { AppState } from "../lib/types";
import {
  practiceFor,
  recommendLesson,
  sessionPlan,
} from "../lib/recommendation";
import { domains } from "../data/domains";
import { goalPathById } from "../data/goalPaths";
import { domainIdentity } from "../lib/domainIdentity";
import { ProgressBar, ProgressRing } from "./ProgressRing";
import { byDomain, trackLayout, trackWindow } from "../lib/mapLayout";
import { Icon } from "./Icon";
import { lessonShortLabel } from "../data/lessonLabels";
import { buildReviewDeck, dueReviewCards } from "../lib/reviews";
import { useClock } from "../lib/useClock";
import { Terrain } from "./Terrain";

type Props = { state: AppState; onNavigate: (route: string) => void };

type TrackNode = { id: string; x: number; y: number; icon: string };
const trackIcons = ["chart", "lab", "idea", "node", "book", "clock", "ai"];
const trackLabels: Record<string, string> = {
  Finance: "Finance",
  Entrepreneuriat: "Entreprendre",
  "Intelligence artificielle": "IA",
  "Finance personnelle": "Finance personnelle",
  Investissement: "Investissement",
};
// One track per domain, built from the catalogue: a new lesson joins its track.
const tracks: { id: string; label: string; nodes: TrackNode[] }[] = byDomain(
  lessons,
)
  .filter((group) => group.length)
  .map((group) => ({
    id: group[0]!.domain,
    label: trackLabels[group[0]!.domain] ?? group[0]!.domain,
    nodes: trackLayout(group.map((lesson) => lesson.id)).map(
      (point, index) => ({
        ...point,
        icon: trackIcons[index % trackIcons.length]!,
      }),
    ),
  }));
const trackLinks = (nodes: TrackNode[]) =>
  nodes.flatMap((node) => {
    const lesson = lessons.find((item) => item.id === node.id);
    return (lesson?.prerequisites || []).flatMap((id) => {
      const from = nodes.find((item) => item.id === id);
      if (!from) return [];
      const mid = (from.x + node.x) / 2;
      return [
        `M${from.x} ${from.y}C${mid} ${from.y},${mid} ${node.y},${node.x} ${node.y}`,
      ];
    });
  });
const trackOf = (lessonId: string) =>
  tracks.find((track) => track.nodes.some((node) => node.id === lessonId)) ||
  tracks[0]!;

export function Dashboard({ state, onNavigate }: Props) {
  const now = useClock();
  const reviewDeck = buildReviewDeck(lessons, state, now);
  const due = dueReviewCards(reviewDeck, now);
  const { latest, done, current, resumed, reason, lastValidated } =
    recommendLesson(state, now);
  // « Vous » is the stand-in for an empty name: never greet « À vous de jouer, Vous ».
  const name = state.profile?.name?.trim();
  const greetingName = name && name.toLowerCase() !== "vous" ? name : "";
  // The hero already presents the current lesson: the trajectory opens on what follows it.
  const following =
    lessons.find(
      (lesson) =>
        !done.has(lesson.id) && lesson.prerequisites.includes(current.id),
    ) ||
    lessons.find(
      (lesson) => lesson.id !== current.id && !done.has(lesson.id),
    ) ||
    current;
  const [selectedId, setSelectedId] = useState(following.id);
  const [trackId, setTrackId] = useState(trackOf(current.id).id);
  const track = tracks.find((item) => item.id === trackId) || tracks[0]!;
  // A long track shows a readable window of seven notions around the next one.
  const windowFocus =
    [current.id, following.id].find((id) =>
      track.nodes.some((node) => node.id === id),
    ) || track.nodes.find((node) => !done.has(node.id))?.id;
  const shown = trackWindow(
    track.nodes.map((node) => node.id),
    windowFocus,
  );
  const mapNodes = trackLayout(shown.ids).map((point) => ({
    ...point,
    icon: track.nodes.find((node) => node.id === point.id)!.icon,
  }));
  const mapLinks = trackLinks(mapNodes);
  function chooseTrack(id: string) {
    const nodes = tracks.find((item) => item.id === id)!.nodes;
    setTrackId(id);
    // Open on what matters in that track: the recommendation, what follows it,
    // or its first notion still to validate.
    setSelectedId(
      [current.id, following.id].find((lessonId) =>
        nodes.some((node) => node.id === lessonId),
      ) ||
        nodes.find((node) => !done.has(node.id))?.id ||
        nodes[0]!.id,
    );
  }
  const selected =
    lessons.find((lesson) => lesson.id === selectedId) || current;
  const selectedAttempt = latest.get(selected.id);
  const revisions = lessons.filter(
    (lesson) => latest.has(lesson.id) && !latest.get(lesson.id)!.passed,
  );
  const percentDone = Math.round((done.size / lessons.length) * 100);
  // V4 jalon C : variante d'accueil demandée par l'adresse (?da=a|b|c), sinon aucune.
  const da =
    typeof document === "undefined"
      ? undefined
      : document.documentElement.dataset.da;
  const practice = practiceFor(current.id);
  const currentIndex =
    lessons.findIndex((lesson) => lesson.id === current.id) + 1;
  const date = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  }).format(new Date());
  const openLesson = (lesson: Lesson) => onNavigate(`lesson/${lesson.id}`);
  // The first notion still open in a territory, prerequisites first.
  const nextFor = (...wanted: Lesson["domain"][]) => {
    const inDomain = lessons.filter((lesson) => wanted.includes(lesson.domain));
    return (
      inDomain.find(
        (lesson) =>
          !done.has(lesson.id) &&
          lesson.prerequisites.every((id) => done.has(id)),
      ) ||
      inDomain.find((lesson) => !done.has(lesson.id)) ||
      inDomain[0]!
    );
  };

  const activePath = goalPathById(state.activePathId);
  // « Mon parcours » : the followed goal path, else the five domains in order.
  const pathSteps = activePath
    ? (() => {
        const ids = activePath.lessonIds;
        const at = Math.max(0, ids.indexOf(current.id));
        const from = Math.max(0, Math.min(at - 1, ids.length - 5));
        return ids.slice(from, from + 5).flatMap((id) => {
          const lesson = lessons.find((item) => item.id === id);
          if (!lesson) return [];
          const status: "done" | "current" | "next" = done.has(id)
            ? "done"
            : id === current.id
              ? "current"
              : "next";
          return [
            {
              id,
              lesson,
              label: lessonShortLabel(lesson.id, lesson.title),
              icon: domainIdentity[lesson.domain].icon,
              status,
              statusLabel:
                status === "done"
                  ? "Validée"
                  : status === "current"
                    ? "En cours"
                    : "À venir",
            },
          ];
        });
      })()
    : domains.map((domain) => {
        const inDomain = lessons.filter((lesson) => lesson.domain === domain);
        const validated = inDomain.filter((lesson) => done.has(lesson.id));
        const status: "done" | "current" | "next" =
          validated.length === inDomain.length
            ? "done"
            : domain === current.domain
              ? "current"
              : "next";
        return {
          id: domain,
          lesson: domain === current.domain ? current : nextFor(domain),
          label: domainIdentity[domain].short,
          icon: domainIdentity[domain].icon,
          status,
          statusLabel:
            status === "done"
              ? "Terminé"
              : status === "current"
                ? "En cours"
                : validated.length
                  ? `${validated.length} / ${inDomain.length}`
                  : "À venir",
        };
      });

  return (
    <div className="learning-home art-home">
      <header className="console-greeting">
        <div>
          <h1>
            {`${state.attempts.length || state.lastLessonId ? "Bon retour" : "Bienvenue"}${greetingName ? `, ${greetingName}` : ""}\u00a0!`}
          </h1>
          <p>
            {activePath ? (
              <>
                Vous progressez vers votre objectif{"\u00a0"}:{" "}
                <strong>{activePath.title}</strong>.
              </>
            ) : (
              <>
                {date.charAt(0).toUpperCase() + date.slice(1)} ·{" "}
                {state.profile?.minutes || 20} min pour faire un pas.
              </>
            )}
          </p>
          {lastValidated && !reason.startsWith("Elle prolonge") && (
            <p className="home-last-step">
              <Icon name="check" size={14} />
              <span>
                Dernière notion validée{"\u00a0"}:{" "}
                <button
                  type="button"
                  className="text-button inline"
                  onClick={() => openLesson(lastValidated)}
                >
                  {lastValidated.title}
                </button>
                .
              </span>
            </p>
          )}
        </div>
      </header>

      <div className="learning-stage">
        <div className="console-top">
          <section
            className="console-hero"
            aria-labelledby="current-lesson-title"
          >
            <div className="console-hero-art" aria-hidden="true">
              <Terrain />
            </div>
            <span className="learning-coordinate console-coordinate">
              BOUSE / {current.domain.toUpperCase()}
            </span>
            <div className="console-hero-content">
              <span className="console-badge">
                <Icon name="play" size={12} />
                {resumed
                  ? "Reprendre le fil"
                  : state.attempts.length || state.lastLessonId
                    ? "Continuer ma progression"
                    : "Commencer la traversée"}
              </span>
              <p className="console-hero-meta">
                {current.domain} · Leçon {String(currentIndex).padStart(2, "0")}
              </p>
              <h2 id="current-lesson-title">{current.title}</h2>
              <p className="console-hero-summary">{current.summary}</p>
              <p className="learning-hero-reason">
                <Icon name="node" size={14} />
                <span>
                  <strong>Pourquoi celle-ci ?</strong> {reason}
                </span>
              </p>
              <p className="learning-hero-reason">
                <Icon name="clock" size={14} />
                <span>
                  {sessionPlan(
                    state.profile?.minutes || 20,
                    current,
                    due.length,
                    current.sections.length + 3,
                    state.lessonPositions?.[current.id] ?? 0,
                  )}
                </span>
              </p>
              <div className="console-hero-actions">
                <button
                  className="button primary console-play"
                  onClick={() => openLesson(current)}
                >
                  <Icon name="play" size={14} />
                  {done.size === lessons.length
                    ? "Revoir la leçon"
                    : state.lessonPositions?.[current.id] ||
                        latest.has(current.id)
                      ? "Continuer la leçon"
                      : "Commencer la leçon"}
                  <small>· {current.minutes} min</small>
                </button>
                {due.length > 0 && (
                  <button
                    className="button secondary console-reviews"
                    onClick={() => onNavigate("reviews")}
                  >
                    {due.length} rappel{due.length > 1 ? "s" : ""} prêt
                    {due.length > 1 ? "s" : ""} avant de continuer
                  </button>
                )}
              </div>
              <div
                className="home-progress console-hero-progress"
                role="progressbar"
                aria-label="Votre parcours"
                aria-valuemin={0}
                aria-valuemax={lessons.length}
                aria-valuenow={done.size}
                aria-valuetext={`${done.size} notions validées sur ${lessons.length}`}
              >
                <span className="home-progress-label">Votre parcours</span>
                <ProgressBar value={done.size / lessons.length} />
                <span className="home-progress-value">
                  <strong>
                    {percentDone}
                    {"\u00a0"}%
                  </strong>
                  <small>
                    {done.size} / {lessons.length} notions
                  </small>
                </span>
              </div>
            </div>
          </section>

          {da === "b" ? (
            <section
              className="console-session"
              aria-labelledby="console-session-title"
            >
              <div className="console-session-head">
                <h2 id="console-session-title">Votre séance</h2>
                <small>{state.profile?.minutes || 20} min</small>
              </div>
              <button
                type="button"
                className="console-session-progress"
                onClick={() => onNavigate("skills")}
              >
                <ProgressRing
                  value={done.size / lessons.length}
                  size={76}
                  stroke={5}
                  tone="violet"
                  label={`${percentDone}\u00a0%`}
                />
                <span>
                  <strong>
                    {done.size} / {lessons.length} notions validées
                  </strong>
                  <small>Voir mes compétences</small>
                </span>
                <Icon name="chevron" size={16} />
              </button>
              <ol className="console-session-plan">
                {due.length > 0 && (
                  <li>
                    <button type="button" onClick={() => onNavigate("reviews")}>
                      <span className="console-session-step">1</span>
                      <span>
                        <strong>
                          {due.length} rappel{due.length > 1 ? "s" : ""} prêt
                          {due.length > 1 ? "s" : ""}
                        </strong>
                        <small>
                          ≈{"\u00a0"}
                          {Math.max(1, Math.min(due.length, 5))}
                          {"\u00a0"}min · rappel espacé
                        </small>
                      </span>
                      <Icon name="chevron" size={16} />
                    </button>
                  </li>
                )}
                <li className="is-current">
                  <button type="button" onClick={() => openLesson(current)}>
                    <span className="console-session-step">
                      {due.length > 0 ? 2 : 1}
                    </span>
                    <span>
                      <strong>
                        {lessonShortLabel(current.id, current.title)}
                      </strong>
                      <small>
                        En cours · {current.minutes}
                        {"\u00a0"}min
                      </small>
                    </span>
                    <Icon name="chevron" size={16} />
                  </button>
                </li>
                {following.id !== current.id && (
                  <li>
                    <button type="button" onClick={() => openLesson(following)}>
                      <span className="console-session-step">
                        {due.length > 0 ? 3 : 2}
                      </span>
                      <span>
                        <strong>
                          {lessonShortLabel(following.id, following.title)}
                        </strong>
                        <small>
                          Ensuite · {following.minutes}
                          {"\u00a0"}min
                        </small>
                      </span>
                      <Icon name="chevron" size={16} />
                    </button>
                  </li>
                )}
              </ol>
            </section>
          ) : (
            <button
              type="button"
              className="console-progress"
              onClick={() => onNavigate("skills")}
            >
              <ProgressRing
                value={done.size / lessons.length}
                size={112}
                stroke={7}
                tone="spectrum"
                label={`${percentDone}\u00a0%`}
              />
              <span className="console-progress-text">
                <strong>Ma progression</strong>
                <small>
                  {done.size} / {lessons.length} leçons
                </small>
                <span className="sr-only">
                  {percentDone} %. Voir mes compétences.
                </span>
              </span>
              <Icon name="chevron" size={16} />
            </button>
          )}
        </div>

        <ConsoleTiles
          state={state}
          done={done}
          due={due.length}
          onNavigate={onNavigate}
        />

        <div className="console-row">
          <section
            className="console-path"
            aria-labelledby="console-path-title"
          >
            <div className="console-card-head">
              <h2 id="console-path-title">Mon parcours</h2>
              <button
                type="button"
                className="text-button"
                onClick={() => onNavigate("academy")}
              >
                Voir le plan complet <Icon name="arrow" size={14} />
              </button>
            </div>
            <ol className="console-steps">
              {pathSteps.map((step) => (
                <li key={step.id} className={`console-step is-${step.status}`}>
                  <button type="button" onClick={() => openLesson(step.lesson)}>
                    <span className="console-step-mark" aria-hidden="true">
                      <Icon
                        name={
                          step.status === "done"
                            ? "check"
                            : step.status === "current"
                              ? "play"
                              : step.icon
                        }
                        size={step.status === "current" ? 14 : 16}
                      />
                    </span>
                    <strong>{step.label}</strong>
                    <small>{step.statusLabel}</small>
                    <span className="sr-only">
                      . Ouvrir « {step.lesson.title} »
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </section>
          <ActivityCard state={state} now={now} />
        </div>

        <section className="home-objectives" aria-labelledby="objectives-title">
          <h2 id="objectives-title">Vos prochains objectifs</h2>
          <div className="home-objective-grid">
            <button
              className="home-objective"
              onClick={() => onNavigate("reviews")}
            >
              <span className="home-objective-icon">
                <Icon name="clock" size={20} />
              </span>
              <span className="home-objective-text">
                <strong>
                  {revisions.length
                    ? `Consolider ${revisions.length} notion${revisions.length > 1 ? "s" : ""}`
                    : due.length
                      ? `Revoir ${due.length} carte${due.length > 1 ? "s" : ""}`
                      : reviewDeck.length
                        ? "Révisions à jour"
                        : "Votre premier rappel"}
                </strong>
                <small>
                  {due.length
                    ? `≈\u00a0${Math.max(1, Math.min(due.length, 5))}\u00a0min · rappel espacé`
                    : reviewDeck.length
                      ? "Le prochain rappel est planifié"
                      : "Après votre premier quiz"}
                </small>
              </span>
              <Icon name="arrow" size={16} />
            </button>
            <button
              className="home-objective"
              onClick={() => openLesson(following)}
            >
              <span className="home-objective-icon">
                <Icon name="book" size={20} />
              </span>
              <span className="home-objective-text">
                <strong>
                  Ensuite : {lessonShortLabel(following.id, following.title)}
                </strong>
                <small>
                  {following.minutes}
                  {"\u00a0"}min · {domainIdentity[following.domain].short}
                </small>
              </span>
              <Icon name="arrow" size={16} />
            </button>
            {practice ? (
              <button
                className="home-objective"
                onClick={() => onNavigate(practice.route)}
              >
                <span className="home-objective-icon">
                  <Icon name="lab" size={20} />
                </span>
                <span className="home-objective-text">
                  <strong>{practice.label}</strong>
                  <small>
                    Manipuler «{"\u00a0"}
                    {lessonShortLabel(current.id, current.title)}
                    {"\u00a0"}»
                  </small>
                </span>
                <Icon name="arrow" size={16} />
              </button>
            ) : (
              <button
                className="home-objective"
                onClick={() => onNavigate("incubator")}
              >
                <span className="home-objective-icon">
                  <Icon name="idea" size={20} />
                </span>
                <span className="home-objective-text">
                  <strong>
                    {state.projects.length
                      ? `${state.projects.length} projet${state.projects.length > 1 ? "s" : ""} en cours`
                      : "Lancer un premier projet"}
                  </strong>
                  <small>
                    {state.projects.length
                      ? "Relier une leçon à une action"
                      : "Une hypothèse, un client, un test"}
                  </small>
                </span>
                <Icon name="arrow" size={16} />
              </button>
            )}
          </div>
        </section>

        <section className="home-domains" aria-labelledby="domains-title">
          <div className="home-section-heading">
            <h2 id="domains-title">Vos cinq domaines</h2>
            <button
              className="text-button"
              onClick={() => onNavigate("academy")}
            >
              Toute l’Académie <Icon name="arrow" size={15} />
            </button>
          </div>
          <div className="home-domain-grid">
            {domains.map((domain) => {
              const inDomain = lessons.filter(
                (lesson) => lesson.domain === domain,
              );
              const validated = inDomain.filter((lesson) =>
                done.has(lesson.id),
              ).length;
              const next = nextFor(domain);
              const identity = domainIdentity[domain];
              return (
                <button
                  key={domain}
                  className="home-domain"
                  onClick={() => openLesson(next)}
                >
                  <span className="home-domain-top">
                    <span className="home-domain-icon">
                      <Icon name={identity.icon} size={22} />
                    </span>
                    <ProgressRing
                      value={validated / inDomain.length}
                      size={46}
                      label={`${Math.round((validated / inDomain.length) * 100)}%`}
                    />
                  </span>
                  <strong>{domain}</strong>
                  <span className="home-domain-promise">
                    {identity.promise}
                  </span>
                  <span className="home-domain-foot">
                    <small>
                      {validated} / {inDomain.length} notions
                    </small>
                    <span className="home-domain-next">
                      {done.size && validated === inDomain.length
                        ? "Tout est validé"
                        : lessonShortLabel(next.id, next.title)}
                      <Icon name="arrow" size={14} />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section
          className="learning-trajectory"
          aria-labelledby="trajectory-title"
        >
          <div className="trajectory-heading">
            <div>
              <p className="trajectory-intro">Les idées se relient.</p>
              <h2 id="trajectory-title">Votre trajectoire.</h2>
              <div
                className="trajectory-tracks"
                role="group"
                aria-label="Parcours affiché"
              >
                {tracks.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={item.id === track.id}
                    onClick={() => chooseTrack(item.id)}
                  >
                    {item.label}
                    <small>
                      {item.nodes.filter((node) => done.has(node.id)).length}/
                      {item.nodes.length}
                    </small>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div
            className={`trajectory-map track-${track.id}`}
            role="group"
            aria-label={`Carte interactive : ${track.label.toLowerCase()}, ${mapNodes.length} notions et leurs prérequis`}
            key={track.id}
          >
            <svg
              className="trajectory-connections"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {mapLinks.map((d) => (
                <path key={d} d={d} />
              ))}
            </svg>
            {mapNodes.map((node, index) => {
              const lesson = lessons.find((item) => item.id === node.id)!;
              const attempt = latest.get(node.id);
              const isDone = done.has(node.id);
              return (
                <button
                  key={node.id}
                  className={`trajectory-node ${selectedId === node.id ? "selected" : ""} ${isDone ? "completed" : ""} ${lesson.prerequisites.length ? "has-prerequisite" : "root-node"}`}
                  style={
                    {
                      "--node-x": `${node.x}%`,
                      "--node-y": `${node.y}%`,
                    } as CSSProperties
                  }
                  aria-pressed={selectedId === node.id}
                  aria-describedby={`trajectory-description-${node.id}`}
                  onFocus={() => setSelectedId(node.id)}
                  onClick={() => setSelectedId(node.id)}
                >
                  <span className="trajectory-node-core">
                    {isDone ? (
                      <Icon name="check" size={17} />
                    ) : (
                      <Icon name={node.icon} size={17} />
                    )}
                  </span>
                  <span className="trajectory-node-label">
                    {lessonShortLabel(node.id, lesson.title)}
                  </span>
                  <span className="trajectory-node-index">
                    {String(shown.start + index + 1).padStart(2, "0")}
                  </span>
                  <span hidden id={`trajectory-description-${node.id}`}>
                    {lesson.domain}, {lesson.minutes} minutes.{" "}
                    {attempt
                      ? `Dernier quiz ${attempt.percent} %.`
                      : "Aucune tentative."}{" "}
                    Afficher cette notion.
                  </span>
                </button>
              );
            })}
          </div>
          <div className="trajectory-detail" key={selected.id}>
            <div>
              <span className="eyebrow">
                {selectedAttempt
                  ? selectedAttempt.passed
                    ? "VÉRIFIÉE AU QUIZ"
                    : "UNE NOTION À REPRENDRE"
                  : selected.id === current.id
                    ? "VOTRE PROCHAINE LEÇON"
                    : selected.id === following.id
                      ? "ENSUITE"
                      : "UNE NOTION À EXPLORER"}
              </span>
              <h3>{selected.title}</h3>
              <p>
                {selected.id === following.id &&
                selected.prerequisites.includes(current.id)
                  ? `Après « ${lessonShortLabel(current.id, current.title)} » : son quiz ouvre la suite.`
                  : selected.prerequisites.length
                    ? `S’appuie sur ${selected.prerequisites.length} notion${selected.prerequisites.length > 1 ? "s" : ""} préalable${selected.prerequisites.length > 1 ? "s" : ""}.`
                    : "Un point d’entrée. Aucun prérequis."}
              </p>
            </div>
            <button
              className="icon-button"
              aria-label={`Ouvrir ${selected.title}`}
              onClick={() => openLesson(selected)}
            >
              <Icon name="arrow" size={19} />
            </button>
          </div>
          <button
            className="text-button trajectory-full-map"
            onClick={() => onNavigate("skills")}
          >
            {shown.total > shown.ids.length
              ? `Notions ${shown.start + 1} à ${shown.start + shown.ids.length} sur ${shown.total} · voir toute la carte`
              : "Explorer mes compétences"}
            <Icon name="arrow" size={15} />
          </button>
        </section>
      </div>
    </div>
  );
}

/** Four figures to read at a glance, each one opening the space it counts. */
function ConsoleTiles({
  state,
  done,
  due,
  onNavigate,
}: {
  state: AppState;
  done: Set<string>;
  due: number;
  onNavigate: (route: string) => void;
}) {
  const skillsAcquired = lessons
    .filter((lesson) => done.has(lesson.id))
    .reduce((sum, lesson) => sum + lesson.skills.length, 0);
  const saved = state.simulations?.length ?? 0;
  const projects = state.projects.length;
  const tiles = [
    {
      id: "skills",
      label: "Compétences",
      value: String(skillsAcquired),
      unit: skillsAcquired > 1 ? "acquises" : "acquise",
      icon: "bars",
      tone: "violet",
    },
    {
      id: "simulation",
      label: "Simulations",
      value: saved ? String(saved) : "2",
      unit: saved
        ? saved > 1
          ? "enregistrées"
          : "enregistrée"
        : "instruments",
      icon: "layers",
      tone: "neutral",
    },
    {
      id: "reviews",
      label: "Révisions",
      value: String(due),
      unit: "à faire",
      icon: "calendar",
      tone: "blue",
    },
    {
      id: "incubator",
      label: "Projets",
      value: String(projects),
      unit: "en cours",
      icon: "target",
      tone: "emerald",
    },
  ];
  return (
    <ul className="console-tiles" aria-label="Vos chiffres">
      {tiles.map((tile) => (
        <li key={tile.id}>
          <button
            type="button"
            className={`console-tile tone-${tile.tone}`}
            onClick={() => onNavigate(tile.id)}
          >
            <span className="console-tile-text">
              <small>{tile.label}</small>
              <strong>
                {tile.value} <span>{tile.unit}</span>
              </strong>
            </span>
            <span className="console-tile-icon" aria-hidden="true">
              <Icon name={tile.icon} size={22} />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * The days you actually came back over the last week, from recorded quizzes
 * and reviews only. No streak to keep.
 */
function ActivityCard({ state, now }: { state: AppState; now: Date }) {
  // Calendar days in the learner's own time zone.
  const dayKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(now);
    day.setHours(12, 0, 0, 0);
    day.setDate(day.getDate() - (6 - index));
    return day;
  });
  const eventDays = [
    ...state.attempts.map((attempt) => attempt.at),
    ...(state.reviewEvents ?? []).map((event) => event.at),
  ].map((at) => dayKey(new Date(at)));
  const counts = days.map(
    (day) => eventDays.filter((key) => key === dayKey(day)).length,
  );
  const activeDays = counts.filter(Boolean).length;
  const peak = Math.max(1, ...counts);
  const points = counts.map((count, index) => [
    10 + index * (280 / 6),
    70 - (count / peak) * 54,
  ]);
  // A smooth curve through the seven days.
  const line = points
    .map(([x, y], index) => {
      if (!index) return `M${x} ${y}`;
      const [px, py] = points[index - 1]!;
      const mid = (px! + x!) / 2;
      return `C${mid} ${py} ${mid} ${y} ${x} ${y}`;
    })
    .join(" ");
  const last = points.findLastIndex((_, index) => counts[index]! > 0);
  const weekday = new Intl.DateTimeFormat("fr-FR", { weekday: "narrow" });
  return (
    <section className="console-activity" aria-labelledby="activity-title">
      <div className="console-card-head">
        <h2 id="activity-title">
          Mon activité <small>(7 jours)</small>
        </h2>
        <span className="console-activity-count">
          {activeDays} jour{activeDays > 1 ? "s" : ""} actif
          {activeDays > 1 ? "s" : ""}
        </span>
      </div>
      <svg viewBox="0 0 300 92" aria-hidden="true">
        <defs>
          <linearGradient id="activity-fill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0"
              stopColor="var(--accent-violet)"
              stopOpacity="0.32"
            />
            <stop offset="1" stopColor="var(--accent-violet)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="home-activity-base" d="M10 72H290" />
        {activeDays > 0 && (
          <>
            <path
              className="home-activity-area"
              d={`${line} L290 72 L10 72 Z`}
              fill="url(#activity-fill)"
            />
            <path className="home-activity-line" d={line} />
          </>
        )}
        {last >= 0 && (
          <circle
            cx={points[last]![0]}
            cy={points[last]![1]}
            r="4"
            className="home-activity-dot"
          />
        )}
        {points.map(([x], index) => (
          <text key={dayKey(days[index]!)} x={x} y="88" textAnchor="middle">
            {weekday.format(days[index])}
          </text>
        ))}
      </svg>
      <p>Quiz et révisions enregistrés, sans série à tenir.</p>
    </section>
  );
}

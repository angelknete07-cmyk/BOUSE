import { useState, type CSSProperties } from "react";
import { lessons, type Lesson } from "../data/lessons";
import type { AppState } from "../lib/types";
import {
  practiceFor,
  recommendLesson,
  sessionPlan,
} from "../lib/recommendation";
import { domains } from "../data/domains";
import { domainIdentity } from "../lib/domainIdentity";
import { ProgressBar, ProgressRing } from "./ProgressRing";
import { byDomain, trackLayout } from "../lib/mapLayout";
import { Icon } from "./Icon";
import { lessonShortLabel } from "../data/lessonLabels";
import { Terrain } from "./Terrain";
import { buildReviewDeck, dueReviewCards } from "../lib/reviews";
import { useClock } from "../lib/useClock";

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
  const mapNodes = track.nodes;
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

  return (
    <div className="learning-home art-home">
      <header className="learning-greeting">
        <div>
          <p className="home-dateline">
            Votre atelier personnel <span>/</span> {date}
          </p>
          <h1>
            {greetingName
              ? `À vous de jouer, ${greetingName}.`
              : "À vous de jouer."}
          </h1>
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
        <span className="learning-session">
          <Icon name="clock" size={15} />
          <span>
            {state.profile?.minutes || 20} min <small>pour faire un pas</small>
          </span>
        </span>
      </header>

      <div className="learning-stage">
        <section
          className="hero-card learning-hero"
          aria-labelledby="current-lesson-title"
        >
          <div className="hero-visual learning-matter" aria-hidden="true">
            <Terrain />
          </div>
          <div className="learning-hero-top">
            <span className="scene-label">
              {resumed
                ? "Reprendre le fil"
                : state.attempts.length || state.lastLessonId
                  ? "Votre prochaine leçon"
                  : "Commencer la traversée"}
            </span>
            <span className="learning-coordinate">
              BOUSE / {current.domain.toUpperCase()}
            </span>
          </div>
          <div className="hero-main learning-hero-content">
            <span className="tag">
              {current.domain} <span>·</span> Leçon{" "}
              {String(currentIndex).padStart(2, "0")}
            </span>
            <h2 id="current-lesson-title">{current.title}</h2>
            <p>{current.summary}</p>
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
            <div className="learning-hero-actions">
              <button
                className="button primary"
                onClick={() => openLesson(current)}
              >
                {done.size === lessons.length
                  ? "Revoir la leçon"
                  : "Ouvrir la leçon"}
                <Icon name="arrow" size={17} />
              </button>
              <span>
                {current.minutes} min<small>pour faire un pas</small>
              </span>
              {due.length > 0 && (
                <button
                  className="text-button learning-hero-reviews"
                  onClick={() => onNavigate("reviews")}
                >
                  {due.length} rappel{due.length > 1 ? "s" : ""} prêt
                  {due.length > 1 ? "s" : ""} avant de continuer
                  <Icon name="arrow" size={15} />
                </button>
              )}
            </div>
          </div>
          <div className="home-scene-footer">
            <div
              className="home-progress"
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
                  <span className="trajectory-node-index">0{index + 1}</span>
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
            Explorer mes compétences
            <Icon name="arrow" size={15} />
          </button>
        </section>
      </div>
    </div>
  );
}

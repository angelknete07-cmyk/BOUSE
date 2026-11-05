import { useState, type CSSProperties } from "react";
import { lessons, type Lesson } from "../data/lessons";
import type { AppState, Attempt } from "../lib/types";
import { latestCurrentAttempt } from "../lib/portfolio";
import { Icon } from "./Icon";
import { lessonShortLabel } from "../data/lessonLabels";
import { Terrain } from "./Terrain";
import { buildReviewDeck, dueReviewCards } from "../lib/reviews";
import { useClock } from "../lib/useClock";

type Props = { state: AppState; onNavigate: (route: string) => void };

// Columns follow the depth of prerequisites, rows follow the domains — the same
// grammar as the Académie atlas. Links are drawn from the real prerequisites.
const mapNodes = [
  {
    id: "ca-marge-tresorerie",
    x: 12,
    y: 16,
    icon: "chart",
  },
  { id: "seuil-rentabilite", x: 50, y: 16, icon: "lab" },
  { id: "validation-client", x: 12, y: 50, icon: "idea" },
  { id: "comprendre-llm", x: 12, y: 84, icon: "ai" },
  { id: "prompt-structure", x: 50, y: 84, icon: "book" },
  { id: "automatisation-agent", x: 88, y: 50, icon: "node" },
];
const mapLinks = mapNodes.flatMap((node) => {
  const lesson = lessons.find((item) => item.id === node.id);
  return (lesson?.prerequisites || []).flatMap((id) => {
    const from = mapNodes.find((item) => item.id === id);
    if (!from) return [];
    const mid = (from.x + node.x) / 2;
    return [
      `M${from.x} ${from.y}C${mid} ${from.y},${mid} ${node.y},${node.x} ${node.y}`,
    ];
  });
});

function getProgress(state: AppState, now: Date) {
  const latest = new Map<string, Attempt>();
  for (const lesson of lessons) {
    const attempt = latestCurrentAttempt(lesson, state.attempts, now);
    if (attempt) latest.set(lesson.id, attempt);
  }
  const done = new Set(
    [...latest.values()]
      .filter((attempt) => attempt.passed)
      .map((attempt) => attempt.lessonId),
  );
  const candidates = lessons.filter(
    (lesson) =>
      !done.has(lesson.id) && lesson.prerequisites.every((id) => done.has(id)),
  );
  const diagnostic = state.profile?.diagnostic;
  const gaps = [
    diagnostic?.finance !== 1 ? "Finance" : "",
    diagnostic?.business !== 2 ? "Entrepreneuriat" : "",
    diagnostic?.ai !== 0 ? "Intelligence artificielle" : "",
  ];
  const next =
    candidates.find(
      (lesson) =>
        gaps.includes(lesson.domain) &&
        state.profile?.interests.includes(lesson.domain),
    ) ||
    candidates.find((lesson) =>
      state.profile?.interests.includes(lesson.domain),
    ) ||
    candidates[0] ||
    lessons[0]!;
  const current =
    state.lastLessonId && !done.has(state.lastLessonId)
      ? lessons.find((lesson) => lesson.id === state.lastLessonId) || next
      : next;
  return { latest, done, current };
}

export function Dashboard({ state, onNavigate }: Props) {
  const now = useClock();
  const reviewDeck = buildReviewDeck(lessons, state, now);
  const due = dueReviewCards(reviewDeck, now);
  const { latest, done, current } = getProgress(state, now);
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
  const selected =
    lessons.find((lesson) => lesson.id === selectedId) || current;
  const selectedAttempt = latest.get(selected.id);
  const revisions = lessons.filter(
    (lesson) => latest.has(lesson.id) && !latest.get(lesson.id)!.passed,
  );
  const currentIndex =
    lessons.findIndex((lesson) => lesson.id === current.id) + 1;
  const date = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  }).format(new Date());
  const openLesson = (lesson: Lesson) => onNavigate(`lesson/${lesson.id}`);
  const domainCount = (domain: Lesson["domain"]) => {
    const inDomain = lessons.filter((lesson) => lesson.domain === domain);
    const validated = inDomain.filter((lesson) => done.has(lesson.id)).length;
    return `${validated} / ${inDomain.length} repères`;
  };
  const nextFor = (domain: string) =>
    lessons.find(
      (lesson) => lesson.domain === domain && !done.has(lesson.id),
    ) || lessons.find((lesson) => lesson.domain === domain)!;

  return (
    <div className="learning-home art-home">
      <header className="learning-greeting">
        <div>
          <p className="home-dateline">
            Votre atelier personnel <span>/</span> {date}
          </p>
          <h1>À vous de jouer, {state.profile?.name || "vous"}.</h1>
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
              {state.lastLessonId
                ? "Reprendre le fil"
                : "Commencer la traversée"}
            </span>
            <span className="learning-coordinate">BOUSE / FONDATIONS</span>
          </div>
          <div className="hero-main learning-hero-content">
            <span className="tag">
              {current.domain} <span>·</span> Leçon{" "}
              {String(currentIndex).padStart(2, "0")}
            </span>
            <h2 id="current-lesson-title">{current.title}</h2>
            <p>{current.summary}</p>
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
            </div>
          </div>
          <div className="home-scene-footer">
            <div
              className="home-progress"
              role="progressbar"
              aria-label="Quiz validés"
              aria-valuemin={0}
              aria-valuemax={lessons.length}
              aria-valuenow={done.size}
              aria-valuetext={`${done.size} quiz validés sur ${lessons.length}`}
            >
              <span>
                <strong>{String(done.size).padStart(2, "0")}</strong> /{" "}
                {String(lessons.length).padStart(2, "0")}
              </span>
              <div aria-hidden="true">
                {lessons.map((l) => (
                  <i
                    key={l.id}
                    className={
                      done.has(l.id)
                        ? "complete"
                        : l.id === current.id
                          ? "current"
                          : ""
                    }
                  />
                ))}
              </div>
              <small>quiz validés</small>
            </div>
            <span>Comprendre. Manipuler. Appliquer.</span>
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
            </div>
          </div>
          <div
            className="trajectory-map"
            role="group"
            aria-label="Carte interactive des six compétences et de leurs prérequis"
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
                    Afficher ce repère.
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
                    ? "REPÈRE VÉRIFIÉ AU QUIZ"
                    : "UNE NOTION À REPRENDRE"
                  : "UN REPÈRE À EXPLORER"}
              </span>
              <h3>{selected.title}</h3>
              <p>
                {selected.prerequisites.length
                  ? `S’appuie sur ${selected.prerequisites.length} repère${selected.prerequisites.length > 1 ? "s" : ""} conseillé${selected.prerequisites.length > 1 ? "s" : ""}.`
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

      <div className="learning-universes-heading">
        <div>
          <p className="territory-caption">Choisir un territoire</p>
          <h2>Trois territoires. Un même horizon.</h2>
        </div>
        <button className="text-button" onClick={() => onNavigate("academy")}>
          Toute l’Académie
          <Icon name="arrow" size={16} />
        </button>
      </div>
      <div className="learning-universes">
        <button
          className="path-card domain-folio domain-finance"
          onClick={() => openLesson(nextFor("Finance"))}
        >
          <div className="domain-kicker">
            <span className="eyebrow">01 / FINANCE</span>
            <span>{domainCount("Finance")}</span>
          </div>
          <div className="finance-signature" aria-hidden="true">
            <svg viewBox="0 0 440 200">
              <path className="finance-axis" d="M20 160H420M20 40V160" />
              <path
                className="finance-curve-result"
                d="M20 145C95 143 130 70 200 68S310 38 420 32"
              />
              <path
                className="finance-curve-cash"
                d="M20 154H115V121H210V95H310V61H420"
              />
              <circle cx="210" cy="95" r="4" />
              <text x="22" y="190">
                TEMPS
              </text>
              <text x="323" y="22">
                RÉSULTAT
              </text>
              <text x="340" y="85">
                TRÉSORERIE
              </text>
            </svg>
          </div>
          <div className="domain-copy">
            <h3>
              Les chiffres ont
              <br />
              plus d’une histoire.
            </h3>
            <p>
              Lire l’activité, comprendre la marge,
              <br className="desktop-break" /> anticiper le cash.
            </p>
          </div>
          <span className="domain-link">
            Comprendre l’entreprise <Icon name="arrow" size={18} />
          </span>
        </button>
        <button
          className="path-card domain-folio domain-intelligence"
          onClick={() => openLesson(nextFor("Intelligence artificielle"))}
        >
          <div className="domain-kicker">
            <span className="eyebrow">02 / INTELLIGENCE ARTIFICIELLE</span>
            <span>{domainCount("Intelligence artificielle")}</span>
          </div>
          <div className="intelligence-signature" aria-hidden="true">
            <svg viewBox="0 0 310 180">
              <path d="M40 90 140 35 250 90 140 145 40 90M140 35V145M40 90H250" />
              <circle cx="40" cy="90" r="4" />
              <circle cx="140" cy="35" r="4" />
              <circle cx="250" cy="90" r="4" />
              <circle cx="140" cy="145" r="4" />
            </svg>
            <span className="intelligence-word word-context">CONTEXTE</span>
            <span className="intelligence-model">
              <Icon name="ai" size={29} />
            </span>
            <span className="intelligence-word word-verification">
              VÉRIFIER
            </span>
          </div>
          <div className="domain-copy">
            <h3>
              De l’intention
              <br />à l’action.
            </h3>
            <p>
              Comprendre les modèles.
              <br className="desktop-break" /> Construire des usages qui
              tiennent.
            </p>
          </div>
          <span className="domain-link">
            Penser avec l’IA <Icon name="arrow" size={18} />
          </span>
        </button>
        <button
          className="path-card domain-folio domain-investing"
          onClick={() => openLesson(nextFor("Investissement"))}
        >
          <div className="domain-kicker">
            <span className="eyebrow">03 / INVESTISSEMENT</span>
            <span>{domainCount("Investissement")}</span>
          </div>
          <div className="finance-signature" aria-hidden="true">
            <svg viewBox="0 0 440 200">
              <path className="finance-axis" d="M20 160H420M20 40V160" />
              <path
                className="finance-curve-result"
                d="M20 150C120 146 220 128 300 98S390 50 420 36"
              />
              <path
                className="finance-curve-cash"
                d="M20 150C120 148 220 136 300 116S390 86 420 76"
              />
              <text x="22" y="190">
                TEMPS
              </text>
              <text x="318" y="28">
                SANS FRAIS
              </text>
              <text x="330" y="110">
                AVEC FRAIS
              </text>
            </svg>
          </div>
          <div className="domain-copy">
            <h3>
              Le temps, le risque,
              <br />
              les frais.
            </h3>
            <p>
              Comprendre la bourse
              <br className="desktop-break" /> avant d’y placer un euro.
            </p>
          </div>
          <span className="domain-link">
            Apprendre à investir <Icon name="arrow" size={18} />
          </span>
        </button>
      </div>

      <section
        className="learning-next-actions"
        aria-label="Votre atelier en mouvement"
      >
        <button
          className="learning-next-action"
          onClick={() => onNavigate("reviews")}
        >
          <span className="learning-action-icon">
            <Icon name="clock" size={21} />
          </span>
          <span>
            <small>FAIRE DURER CE QUE VOUS APPRENEZ</small>
            <strong>
              {revisions.length
                ? `${String(revisions.length).padStart(2, "0")} repère${revisions.length > 1 ? "s" : ""} à consolider`
                : due.length
                  ? `${String(due.length).padStart(2, "0")} carte${due.length > 1 ? "s" : ""} à revoir`
                  : reviewDeck.length
                    ? "Vos prochaines révisions sont planifiées."
                    : "Un premier repère, puis un rappel."}
            </strong>
            <span>
              {due.length
                ? `${due.length} carte${due.length > 1 ? "s" : ""} disponible${due.length > 1 ? "s" : ""} · une courte session de rappel.`
                : "Quiz, rappel, espacement : chaque étape garde sa propre preuve."}
            </span>
          </span>
          <Icon name="arrow" size={18} />
        </button>
        <button
          className="learning-next-action"
          onClick={() => onNavigate("incubator")}
        >
          <span className="learning-action-icon">
            <Icon name="idea" size={21} />
          </span>
          <span>
            <small>DU SAVOIR AU TERRAIN</small>
            <strong>
              {state.projects.length
                ? `${state.projects.length} projet${state.projects.length > 1 ? "s" : ""} en construction`
                : "Votre premier projet commence ici."}
            </strong>
            <span>
              {state.projects.length
                ? "Reliez un apprentissage à votre prochaine action."
                : "Une hypothèse. Un client. Un premier test."}
            </span>
          </span>
          <Icon name="arrow" size={18} />
        </button>
      </section>
    </div>
  );
}

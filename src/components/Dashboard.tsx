import { useState, type CSSProperties } from "react";
import { lessons, type Lesson } from "../data/lessons";
import type { AppState, Attempt } from "../lib/types";
import { latestCurrentAttempt } from "../lib/portfolio";
import { Icon } from "./Icon";
import { Terrain } from "./Terrain";
import { buildReviewDeck, dueReviewCards } from "../lib/reviews";
import { useClock } from "../lib/useClock";
import "../dashboard-experience.css";

type Props = { state: AppState; onNavigate: (route: string) => void };

const mapNodes = [
  {
    id: "ca-marge-tresorerie",
    label: "Les chiffres",
    x: 20,
    y: 17,
    icon: "chart",
  },
  { id: "seuil-rentabilite", label: "L’équilibre", x: 80, y: 17, icon: "lab" },
  { id: "validation-client", label: "Le client", x: 50, y: 43, icon: "idea" },
  { id: "comprendre-llm", label: "Le modèle", x: 15, y: 77, icon: "ai" },
  { id: "prompt-structure", label: "Le prompt", x: 50, y: 77, icon: "book" },
  { id: "automatisation-agent", label: "L’action", x: 85, y: 77, icon: "node" },
];

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
  const [selectedId, setSelectedId] = useState(current.id);
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
  const nextFor = (domain: string) =>
    lessons.find(
      (lesson) => lesson.domain === domain && !done.has(lesson.id),
    ) || lessons.find((lesson) => lesson.domain === domain)!;

  return (
    <div className="learning-home">
      <header className="learning-greeting">
        <div>
          <p className="eyebrow">L’ATELIER PERSONNEL / {date}</p>
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
            <span className="eyebrow">
              {state.lastLessonId
                ? "LE FIL DE VOTRE APPRENTISSAGE"
                : "VOTRE PROCHAINE TRAVERSÉE"}
            </span>
            <span className="learning-coordinate">
              {String(currentIndex).padStart(2, "0")} /{" "}
              {String(lessons.length).padStart(2, "0")}
            </span>
          </div>
          <div className="hero-main learning-hero-content">
            <span className="tag">
              {current.domain} <span>·</span> Fondations
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
                {current.minutes} min
                <small>une notion, une mise en pratique</small>
              </span>
            </div>
          </div>
          <div className="learning-method" aria-label="Méthode pédagogique">
            <span>
              <i>01</i>Comprendre
            </span>
            <span>
              <i>02</i>Manipuler
            </span>
            <span>
              <i>03</i>Démontrer
            </span>
            <span>
              <i>04</i>Appliquer
            </span>
          </div>
        </section>

        <section
          className="learning-trajectory"
          aria-labelledby="trajectory-title"
        >
          <div className="trajectory-heading">
            <div>
              <p className="eyebrow">LA CARTE, PAS UNE LIGNE DROITE</p>
              <h2 id="trajectory-title">Votre trajectoire.</h2>
            </div>
            <span className="trajectory-count">
              <strong>{String(done.size).padStart(2, "0")}</strong>
              <small>/ {String(lessons.length).padStart(2, "0")}</small>
            </span>
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
              <path d="M20 17H80M15 77H85M15 77C15 49 85 49 85 77" />
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
                  aria-label={`${node.label} — ${lesson.domain}, ${lesson.minutes} minutes. ${attempt ? `Dernier quiz ${attempt.percent} %.` : "Aucune tentative."} Afficher ce repère.`}
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
                  <span className="trajectory-node-label">{node.label}</span>
                  <span className="trajectory-node-index">0{index + 1}</span>
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
          <p className="eyebrow">DEUX LANGAGES POUR CONSTRUIRE</p>
          <h2>Comprendre le monde. Agir dessus.</h2>
        </div>
        <button className="text-button" onClick={() => onNavigate("academy")}>
          Toute l’Academy
          <Icon name="arrow" size={16} />
        </button>
      </div>
      <div className="learning-universes">
        <button
          className="path-card domain-folio domain-finance"
          onClick={() => openLesson(nextFor("Finance"))}
          aria-label="Explorer le parcours Finance"
        >
          <div className="domain-kicker">
            <span className="eyebrow">01 / FINANCE</span>
            <span>
              {
                lessons.filter(
                  (lesson) =>
                    lesson.domain === "Finance" && done.has(lesson.id),
                ).length
              }{" "}
              / 2 repères
            </span>
          </div>
          <div className="finance-signature" aria-hidden="true">
            <span className="finance-ledger">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="finance-equation">
              € <span>≠</span> €
            </span>
            <span className="finance-caption">
              résultat <i /> trésorerie
            </span>
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
          aria-label="Explorer le parcours Intelligence artificielle"
        >
          <div className="domain-kicker">
            <span className="eyebrow">02 / INTELLIGENCE ARTIFICIELLE</span>
            <span>
              {
                lessons.filter(
                  (lesson) =>
                    lesson.domain === "Intelligence artificielle" &&
                    done.has(lesson.id),
                ).length
              }{" "}
              / 3 repères
            </span>
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

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { lessons } from "../data/lessons";
import { buildPortfolio, portfolioMarkdown } from "../lib/portfolio";
import type { AppState, Attempt } from "../lib/types";
import { downloadFile } from "../lib/storage";
import { useClock } from "../lib/useClock";
import { Icon } from "./Icon";
import "../learning-portfolio.css";

type Props = { state: AppState; onNavigate: (route: string) => void };
type Tab = "notions" | "projects" | "notes";
const tabs: { id: Tab; label: string }[] = [
  { id: "notions", label: "Notions" },
  { id: "projects", label: "Projets & explorations" },
  { id: "notes", label: "Notes" },
];
const labels = {
  untried: "À explorer",
  passed: "Quiz validé",
  revisit: "À reprendre",
};
const date = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});
function displayDate(value: string) {
  const time = Date.parse(value);
  return Number.isFinite(time) && new Date(time).toISOString() === value
    ? date.format(new Date(time))
    : "Date non exploitable";
}
function plural(value: number, one: string, many = `${one}s`) {
  return `${value} ${value === 1 ? one : many}`;
}
function excerpt(text: string, length = 320) {
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}
function QuizRecord({
  attempt,
  archived = false,
}: {
  attempt: Attempt;
  archived?: boolean;
}) {
  return (
    <li>
      <span>
        <strong>{attempt.percent} %</strong>
        <span>
          {archived
            ? "Hors état courant"
            : attempt.passed
              ? "Quiz validé"
              : "À reprendre"}
        </span>
      </span>
      <small>
        Version {attempt.lessonVersion ?? "1.0.0"} · {displayDate(attempt.at)}
      </small>
    </li>
  );
}

export function LearningPortfolio({ state, onNavigate }: Props) {
  const now = useClock();
  const portfolio = buildPortfolio(lessons, state, now);
  const { summary } = portfolio;
  const [tab, setTab] = useState<Tab>("notions");
  const [selectedId, setSelectedId] = useState(
    () =>
      portfolio.lessons.find((entry) => entry.lesson.id === state.lastLessonId)
        ?.lesson.id ??
      portfolio.lessons.find(
        (entry) => entry.latest || entry.note || entry.projects.length,
      )?.lesson.id ??
      portfolio.lessons[0]?.lesson.id ??
      "",
  );
  const [message, setMessage] = useState<{
    text: string;
    error: boolean;
  } | null>(null);
  const detailRef = useRef<HTMLElement>(null);
  const panelId = useId().replace(/:/g, "");
  const selected =
    portfolio.lessons.find((entry) => entry.lesson.id === selectedId) ??
    portfolio.lessons[0];
  const empty =
    summary.quizPassed +
      summary.quizToRevisit +
      summary.notes +
      summary.projects +
      summary.simulations +
      summary.reviewSelfAssessments +
      portfolio.archivedAttempts.length ===
    0;

  function select(id: string) {
    setSelectedId(id);
    if (matchMedia("(max-width: 950px)").matches) {
      requestAnimationFrame(() => {
        detailRef.current?.focus({ preventScroll: true });
        detailRef.current?.scrollIntoView({
          block: "nearest",
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      });
    }
  }
  function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setTab(tabs[next]!.id);
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>("[role=tab]")
      [next]?.focus();
  }
  function exportPortfolio() {
    try {
      downloadFile(
        "bouse-portfolio.md",
        portfolioMarkdown(lessons, state, now),
        "text/markdown;charset=utf-8",
      );
      setMessage({
        text: "Fichier Markdown préparé pour le téléchargement. Vous pouvez l’ouvrir dans Obsidian ou dans votre éditeur.",
        error: false,
      });
    } catch (cause) {
      setMessage({
        text:
          cause instanceof Error
            ? cause.message
            : "Le portfolio n’a pas pu être exporté.",
        error: true,
      });
    }
  }

  return (
    <div className="learning-portfolio">
      <div className="portfolio-topline">
        <button className="text-button" onClick={() => onNavigate("skills")}>
          <Icon name="back" size={16} /> Revenir à la carte
        </button>
        <button className="button secondary" onClick={exportPortfolio}>
          Exporter mon portfolio <Icon name="external" size={15} />
        </button>
      </div>
      <header className="portfolio-heading">
        <div>
          <p className="eyebrow">
            MES COMPÉTENCES / LE DOSSIER D’APPRENTISSAGE
          </p>
          <h1>Ce que vous pouvez montrer.</h1>
          <p>
            Reliez vos repères, vos idées et ce que vous avez observé. Des
            traces d’apprentissage, pas un diplôme.
          </p>
        </div>
        <div className="portfolio-index-mark" aria-hidden="true">
          <span>LES TRACES</span>
          <strong>
            {String(summary.quizPassed + summary.quizToRevisit).padStart(
              2,
              "0",
            )}
            <i>/</i>
            {String(summary.totalLessons).padStart(2, "0")}
          </strong>
          <small>notions travaillées au quiz</small>
        </div>
      </header>
      <div className="portfolio-thread" aria-label="Repères de votre dossier">
        <p>
          <strong>{summary.quizPassed}</strong>
          <span>
            {summary.quizPassed === 1
              ? "quiz courant validé"
              : "quiz courants validés"}
          </span>
        </p>
        <span className="portfolio-thread-link" aria-hidden="true" />
        <p>
          <strong>{summary.notes}</strong>
          <span>
            {summary.notes === 1 ? "note personnelle" : "notes personnelles"}
          </span>
        </p>
        <span className="portfolio-thread-link" aria-hidden="true" />
        <p>
          <strong>{summary.observedTests}</strong>
          <span>
            {summary.observedTests === 1
              ? "test avec observations"
              : "tests avec observations"}
          </span>
        </p>
      </div>
      {empty && (
        <div className="portfolio-first-step">
          <Icon name="book" size={23} />
          <div>
            <h2>Votre dossier commence ici.</h2>
            <p>
              Un quiz, une note ou un projet fera apparaître vos premières
              traces. Aucun parcours n’est prérempli.
            </p>
          </div>
          <button className="text-button" onClick={() => onNavigate("academy")}>
            Choisir une leçon <Icon name="arrow" size={16} />
          </button>
        </div>
      )}
      <div
        className="portfolio-tabs"
        role="tablist"
        aria-label="Explorer votre portfolio"
      >
        {tabs.map((item, index) => (
          <button
            key={item.id}
            id={`${panelId}-tab-${item.id}`}
            role="tab"
            aria-selected={tab === item.id}
            aria-controls={`${panelId}-panel-${item.id}`}
            tabIndex={tab === item.id ? 0 : -1}
            onClick={() => setTab(item.id)}
            onKeyDown={(event) => tabKey(event, index)}
          >
            <small aria-hidden="true">0{index + 1}</small>
            {item.label}
          </button>
        ))}
      </div>
      <div
        className="portfolio-content"
        key={tab}
        id={`${panelId}-panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`${panelId}-tab-${tab}`}
      >
        {tab === "notions" && (
          <div className="portfolio-atlas">
            <section
              className="portfolio-register"
              aria-label="Registre des notions"
            >
              <div className="portfolio-register-heading">
                <p className="eyebrow">
                  LE REGISTRE / {String(summary.totalLessons).padStart(2, "0")}{" "}
                  NOTIONS
                </p>
                <span>Choisissez une notion</span>
              </div>
              <div className="portfolio-column-headings" aria-hidden="true">
                <span>Notion</span>
                <span>Quiz courant</span>
                <span>Note</span>
                <span>Projets</span>
                <span />
              </div>
              {portfolio.lessons.map((entry, index) => (
                <button
                  key={entry.lesson.id}
                  className="portfolio-notion-row"
                  aria-label={`Voir les traces : ${entry.lesson.title}`}
                  aria-pressed={selected?.lesson.id === entry.lesson.id}
                  aria-describedby={`${panelId}-status-${index}`}
                  onClick={() => select(entry.lesson.id)}
                >
                  <span className="portfolio-notion-name">
                    <small aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </small>
                    <span>
                      <strong>{entry.lesson.title}</strong>
                      <small>{entry.lesson.domain}</small>
                    </span>
                  </span>
                  <span
                    className={`portfolio-quiz-state ${entry.status}`}
                    id={`${panelId}-status-${index}`}
                  >
                    <Icon
                      name={
                        entry.status === "passed"
                          ? "check"
                          : entry.status === "revisit"
                            ? "clock"
                            : "node"
                      }
                      size={13}
                    />
                    {labels[entry.status]}
                  </span>
                  <span className="portfolio-presence">
                    <small>Note</small>
                    {entry.note.trim() ? (
                      <Icon name="book" size={14} />
                    ) : (
                      <span aria-label="Aucune note">—</span>
                    )}
                  </span>
                  <span className="portfolio-presence">
                    <small>Projets</small>
                    {entry.projects.length || "—"}
                  </span>
                  <Icon name="arrow" size={14} />
                </button>
              ))}
              <p className="portfolio-register-note">
                Le dernier quiz daté de la version courante fait foi. Une
                tentative plus ancienne reste dans l’historique.
              </p>
            </section>
            {selected && (
              <section
                className="portfolio-detail"
                aria-label="Traces de la notion"
                ref={detailRef}
                tabIndex={-1}
                key={selected.lesson.id}
              >
                <div className="portfolio-detail-meta">
                  <span className="eyebrow">LES PIÈCES DU DOSSIER</span>
                  <span>V. {selected.lesson.version}</span>
                </div>
                <h2>{selected.lesson.title}</h2>
                <p className={`portfolio-detail-status ${selected.status}`}>
                  <Icon
                    name={selected.status === "passed" ? "check" : "clock"}
                    size={15}
                  />
                  {labels[selected.status]}
                </p>
                {selected.latest ? (
                  <div className="portfolio-latest-quiz">
                    <strong>
                      {selected.latest.percent}
                      <small>%</small>
                    </strong>
                    <div>
                      <span>Dernier quiz courant</span>
                      <small>
                        {displayDate(selected.latest.at)} · version{" "}
                        {selected.latest.lessonVersion ?? "1.0.0"}
                      </small>
                    </div>
                  </div>
                ) : (
                  <p className="portfolio-detail-empty">
                    Aucun quiz exploitable sur cette version. Vous pouvez
                    commencer par la leçon.
                  </p>
                )}
                <div className="portfolio-concepts">
                  <span>Les repères associés</span>
                  <p>{selected.lesson.skills.join(" · ")}</p>
                </div>
                <div className="portfolio-detail-note">
                  <div>
                    <h3>Votre note</h3>
                    {selected.note.trim() && (
                      <button
                        className="text-button"
                        onClick={() => setTab("notes")}
                      >
                        Lire mes notes <Icon name="arrow" size={13} />
                      </button>
                    )}
                  </div>
                  <p>
                    {selected.note.trim()
                      ? excerpt(selected.note)
                      : "Aucune note pour cette notion."}
                  </p>
                </div>
                <div className="portfolio-detail-projects">
                  <h3>Applications reliées</h3>
                  {selected.projects.length ? (
                    selected.projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => onNavigate(`project/${project.id}`)}
                      >
                        <span>{project.title}</span>
                        <Icon name="arrow" size={14} />
                      </button>
                    ))
                  ) : (
                    <p>Pas encore de projet relié à cette notion.</p>
                  )}
                </div>
                {(selected.currentAttempts.length > 0 ||
                  selected.archivedAttempts.length > 0) && (
                  <details className="portfolio-quiz-history">
                    <summary>
                      Historique des quiz{" "}
                      <span>
                        {selected.currentAttempts.length +
                          selected.archivedAttempts.length}
                      </span>
                      <Icon name="plus" size={14} />
                    </summary>
                    <ul>
                      {selected.currentAttempts
                        .slice()
                        .reverse()
                        .map((attempt, index) => (
                          <QuizRecord
                            key={`current-${index}`}
                            attempt={attempt}
                          />
                        ))}
                      {selected.archivedAttempts.map((attempt, index) => (
                        <QuizRecord
                          key={`archived-${index}`}
                          attempt={attempt}
                          archived
                        />
                      ))}
                    </ul>
                    {selected.archivedAttempts.length > 0 && (
                      <p>
                        Les autres versions et les dates futures ou invalides
                        restent conservées sans déterminer l’état courant.
                      </p>
                    )}
                  </details>
                )}
                <button
                  className="button primary portfolio-open-lesson"
                  onClick={() => onNavigate(`lesson/${selected.lesson.id}`)}
                >
                  Ouvrir la leçon <Icon name="arrow" size={15} />
                </button>
              </section>
            )}
          </div>
        )}
        {tab === "projects" && (
          <div className="portfolio-applications">
            <section aria-label="Dossiers de projets">
              <div className="portfolio-section-heading">
                <div>
                  <p className="eyebrow">PASSER AU TERRAIN</p>
                  <h2>Des idées mises à l’épreuve.</h2>
                </div>
                <span>{plural(summary.projects, "dossier")}</span>
              </div>
              <p className="portfolio-section-intro">
                Une fiche et un stade sont des déclarations. Les observations et
                bilans gardent la trace du travail consigné.
              </p>
              {portfolio.projects.length ? (
                portfolio.projects.map((entry, index) => (
                  <article className="portfolio-project" key={entry.project.id}>
                    <header>
                      <small aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </small>
                      <div>
                        <p>{entry.project.stage}</p>
                        <h3>{entry.project.title}</h3>
                      </div>
                      <button
                        className="text-button"
                        aria-label={`Ouvrir le dossier : ${entry.project.title}`}
                        onClick={() =>
                          onNavigate(`project/${entry.project.id}`)
                        }
                      >
                        Ouvrir le dossier <Icon name="arrow" size={15} />
                      </button>
                    </header>
                    <p className="portfolio-project-problem">
                      {entry.project.problem}
                    </p>
                    <div className="portfolio-project-counts">
                      <span>
                        {plural(
                          entry.experiments.length,
                          "test préparé",
                          "tests préparés",
                        )}
                      </span>
                      <span>
                        {plural(
                          entry.experiments.filter((test) => test.result)
                            .length,
                          "observation",
                          "observations",
                        )}
                      </span>
                      <span>
                        {plural(
                          entry.decisions.filter((decision) => decision.outcome)
                            .length,
                          "bilan de décision",
                          "bilans de décisions",
                        )}
                      </span>
                    </div>
                    {(entry.experiments.length > 0 ||
                      entry.decisions.length > 0) && (
                      <details className="portfolio-evidence-fold">
                        <summary>
                          Traces du dossier <Icon name="plus" size={15} />
                        </summary>
                        <div>
                          {entry.experiments.map((test) => (
                            <div
                              className="portfolio-field-trace"
                              key={test.id}
                            >
                              <p className="eyebrow">
                                TEST TERRAIN /{" "}
                                {test.result
                                  ? "OBSERVATIONS CONSIGNÉES"
                                  : "PLAN PRÉPARÉ"}
                              </p>
                              <h4>{test.title}</h4>
                              <dl>
                                <div>
                                  <dt>Hypothèse de départ</dt>
                                  <dd>{test.hypothesis}</dd>
                                </div>
                                {test.result && (
                                  <>
                                    <div>
                                      <dt>Observation déclarée</dt>
                                      <dd>{test.result.observation}</dd>
                                    </div>
                                    <div>
                                      <dt>Éléments de preuve saisis</dt>
                                      <dd>{test.result.evidence}</dd>
                                    </div>
                                  </>
                                )}
                              </dl>
                            </div>
                          ))}
                          {entry.decisions.map((decision) => (
                            <div
                              className="portfolio-field-trace"
                              key={decision.id}
                            >
                              <p className="eyebrow">
                                DÉCISION /{" "}
                                {decision.outcome
                                  ? "BILAN CONSIGNÉ"
                                  : "ATTENTE CONSERVÉE"}
                              </p>
                              <h4>{decision.title}</h4>
                              <dl>
                                <div>
                                  <dt>Choix enregistré</dt>
                                  <dd>{decision.choice}</dd>
                                </div>
                                <div>
                                  <dt>Résultat attendu au départ</dt>
                                  <dd>{decision.expectedOutcome}</dd>
                                </div>
                                {decision.outcome && (
                                  <>
                                    <div>
                                      <dt>Ce qui s’est passé</dt>
                                      <dd>{decision.outcome.observed}</dd>
                                    </div>
                                    <div>
                                      <dt>Apprentissage déclaré</dt>
                                      <dd>{decision.outcome.learning}</dd>
                                    </div>
                                  </>
                                )}
                              </dl>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </article>
                ))
              ) : (
                <div className="portfolio-empty-section">
                  <h3>Aucun dossier de projet.</h3>
                  <p>
                    Reliez une idée à vos leçons dans l’Incubator, puis
                    documentez vos tests.
                  </p>
                  <button
                    className="text-button"
                    onClick={() => onNavigate("incubator")}
                  >
                    Ouvrir l’Incubator <Icon name="arrow" size={15} />
                  </button>
                </div>
              )}
            </section>
            <section
              className="portfolio-explorations"
              aria-label="Explorations fictives"
            >
              <div className="portfolio-section-heading">
                <div>
                  <p className="eyebrow">EXPLORER LES HYPOTHÈSES</p>
                  <h2>Ce que vous avez simulé.</h2>
                </div>
                <span>{plural(summary.simulations, "comparaison")}</span>
              </div>
              <p className="portfolio-section-intro">
                Ces comparaisons sont fictives. Elles documentent des
                hypothèses, sans prouver un résultat terrain ni une compétence
                certifiée.
              </p>
              {portfolio.simulations.length ? (
                <div className="portfolio-simulation-list">
                  {portfolio.simulations.map((simulation) => (
                    <div key={simulation.id}>
                      <span
                        className="portfolio-exploration-icon"
                        aria-hidden="true"
                      >
                        <Icon name="chart" size={22} />
                      </span>
                      <div>
                        <strong>{simulation.title}</strong>
                        <small>
                          Exploration fictive · modèle {simulation.modelVersion}{" "}
                          · {displayDate(simulation.createdAt)}
                        </small>
                      </div>
                      <button
                        className="text-button"
                        onClick={() => onNavigate("simulation")}
                      >
                        Ouvrir « Et si ? » <Icon name="arrow" size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="portfolio-empty-section">
                  <h3>Aucune comparaison conservée.</h3>
                  <p>
                    Le laboratoire permet d’explorer un changement de prix, de
                    coût ou de délai client.
                  </p>
                  <button
                    className="text-button"
                    onClick={() => onNavigate("simulation")}
                  >
                    Explorer « Et si ? » <Icon name="arrow" size={15} />
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
        {tab === "notes" && (
          <section className="portfolio-notes" aria-label="Notes personnelles">
            <div className="portfolio-section-heading">
              <div>
                <p className="eyebrow">GARDER VOTRE RAISONNEMENT</p>
                <h2>Vos mots, vos repères.</h2>
              </div>
              <span>{plural(summary.notes, "note")}</span>
            </div>
            <p className="portfolio-section-intro">
              Les notes sont conservées telles que saisies, sans date de
              rédaction inventée. L’export inclut aussi celles d’anciennes
              leçons.
            </p>
            {portfolio.notes.length ? (
              portfolio.notes.map((note, index) => (
                <article className="portfolio-note" key={note.lessonId}>
                  <header>
                    <span aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p>
                        {note.catalogued
                          ? "NOTE PERSONNELLE"
                          : "ANCIENNE LEÇON / NOTE CONSERVÉE"}
                      </p>
                      <h3>{note.title}</h3>
                    </div>
                    {note.catalogued && (
                      <button
                        className="text-button"
                        onClick={() => onNavigate(`lesson/${note.lessonId}`)}
                      >
                        Relire la leçon <Icon name="arrow" size={15} />
                      </button>
                    )}
                  </header>
                  <p className="portfolio-note-body">{note.body}</p>
                </article>
              ))
            ) : (
              <div className="portfolio-empty-section">
                <h3>Pas encore de note personnelle.</h3>
                <p>
                  Gardez une explication, un doute ou un exemple dans les notes
                  d’une leçon. Vos mots apparaîtront ici.
                </p>
                <button
                  className="text-button"
                  onClick={() => onNavigate("academy")}
                >
                  Choisir une leçon <Icon name="arrow" size={15} />
                </button>
              </div>
            )}
          </section>
        )}
      </div>
      {message && (
        <p
          role={message.error ? "alert" : "status"}
          className={`portfolio-export-feedback${message.error ? " error" : ""}`}
        >
          {message.text}
        </p>
      )}
      <footer className="portfolio-footnote">
        <Icon name="node" size={17} />
        <div>
          <p>Des traces distinctes. Aucun score de maîtrise globale.</p>
          <p>
            {plural(
              summary.reviewSelfAssessments,
              "autoévaluation de rappel",
              "autoévaluations de rappel",
            )}{" "}
            conservée{summary.reviewSelfAssessments === 1 ? "" : "s"} ; les
            rappels ne changent pas les notes de quiz. Les exercices et
            teach-back non enregistrés ne sont pas présentés comme réalisés. Le
            fichier Markdown s’ouvre dans Obsidian ; aucune synchronisation de
            coffre n’est effectuée.
          </p>
          {portfolio.archivedAttempts.length > 0 && (
            <p>
              {plural(
                portfolio.archivedAttempts.length,
                "tentative",
                "tentatives",
              )}{" "}
              hors état courant, conservée
              {portfolio.archivedAttempts.length === 1 ? "" : "s"} dans
              l’historique et l’export.
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}

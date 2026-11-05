import { useEffect, useRef, useState, type FormEvent } from "react";
import { lessons } from "../data/lessons";
import type {
  AppState,
  DecisionOutcome,
  ExperimentResult,
  Project,
  ProjectDecision,
  ProjectExperiment,
  StateUpdater,
} from "../lib/types";
import {
  createDecision,
  createExperiment,
  projectTextLimits,
  recordDecisionOutcome,
  recordExperimentResult,
} from "../lib/projects";
import { downloadFile } from "../lib/storage";
import { Icon } from "./Icon";
import { ProjectLearningPlan } from "./ProjectLearningPlan";
import { projectLearningMarkdown } from "../lib/projectLearning";

type Props = {
  project: Project;
  state: AppState;
  update: StateUpdater;
  onNavigate: (route: string) => void;
  initialTab?: "terrain" | "decisions" | "reperes";
};
type Tab = "terrain" | "decisions" | "reperes";
type TestDraft = Omit<ProjectExperiment, "id" | "createdAt" | "result">;
type DecisionDraft = Omit<
  ProjectDecision,
  "id" | "createdAt" | "outcome" | "confidence"
> & { confidence: string };
const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "terrain", label: "Terrain", icon: "lab" },
  { id: "decisions", label: "Décisions", icon: "node" },
  { id: "reperes", label: "Notions", icon: "book" },
];
const conclusions = {
  supported: "Hypothèse confortée",
  refuted: "Hypothèse fragilisée",
  inconclusive: "Résultat non concluant",
};
const comparisons = {
  better: "Mieux que prévu",
  "as-expected": "Conforme à l’attendu",
  worse: "Moins bien que prévu",
  mixed: "Résultat contrasté",
};
const dateTime = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});
const dateOnly = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
});
const displayDate = (value: string) =>
  dateOnly.format(new Date(`${value}T12:00:00.000Z`));
const isoDay = (date: Date) =>
  new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Europe/Paris",
  }).format(date);
const nextWeek = () => isoDay(new Date(Date.now() + 7 * 86_400_000));
const testDraft = (project: Project): TestDraft => ({
  projectId: project.id,
  title: "",
  hypothesis: project.hypothesis,
  protocol: "",
  successCriterion: "",
  reviewOn: nextWeek(),
});
const decisionDraft = (project: Project): DecisionDraft => ({
  projectId: project.id,
  title: "",
  context: "",
  options: "",
  choice: "",
  expectedOutcome: "",
  confidence: "",
  risk: "",
  reviewOn: nextWeek(),
  experimentId: "",
});

function Field({
  label,
  value,
  onChange,
  multiline = false,
  maxLength = projectTextLimits.long,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  maxLength?: number;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          aria-label={label}
          required
          rows={3}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          aria-label={label}
          required
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

export function ProjectWorkbench({
  project,
  state,
  update,
  onNavigate,
  initialTab = "terrain",
}: Props) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [newTestOpen, setNewTestOpen] = useState(false);
  const [newDecisionOpen, setNewDecisionOpen] = useState(false);
  const [test, setTest] = useState(() => testDraft(project));
  const [decision, setDecision] = useState(() => decisionDraft(project));
  const [resultFor, setResultFor] = useState<string | null>(null);
  const [outcomeFor, setOutcomeFor] = useState<string | null>(null);
  const [result, setResult] = useState<Omit<ExperimentResult, "recordedAt">>({
    observation: "",
    evidence: "",
    conclusion: "inconclusive",
  });
  const [outcome, setOutcome] = useState<Omit<DecisionOutcome, "recordedAt">>({
    observed: "",
    comparison: "mixed",
    learning: "",
  });
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(
    null,
  );
  const creating = useRef({ test: false, decision: false });
  const completed = useRef(new Set<string>());
  const formRef = useRef<HTMLElement>(null);
  const resultFormRef = useRef<HTMLFormElement>(null);
  const experiments = (state.experiments ?? [])
    .filter((entry) => entry.projectId === project.id)
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const decisions = (state.decisions ?? [])
    .filter((entry) => entry.projectId === project.id)
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const observed = experiments.filter((entry) => entry.result).length;
  const compared = decisions.filter((entry) => entry.outcome).length;
  const linkedLessons = lessons.filter((lesson) =>
    project.lessonIds.includes(lesson.id),
  );

  useEffect(() => {
    setTab(initialTab);
    setNewTestOpen(false);
    setNewDecisionOpen(false);
    setTest(testDraft(project));
    setDecision(decisionDraft(project));
    setResultFor(null);
    setOutcomeFor(null);
    setNotice(null);
    creating.current = { test: false, decision: false };
    completed.current = new Set();
    // A project owns its drafts; state updates inside the project must not reset them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id, initialTab]);

  function showError(error: unknown) {
    setNotice({
      text:
        error instanceof Error
          ? error.message
          : "L’enregistrement n’a pas abouti. Vérifiez les champs puis réessayez.",
      error: true,
    });
  }
  function focusForm() {
    requestAnimationFrame(() => {
      formRef.current?.focus({ preventScroll: true });
      formRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }
  function focusResultForm() {
    requestAnimationFrame(() => {
      resultFormRef.current?.focus({ preventScroll: true });
      resultFormRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "instant",
      });
    });
  }
  function openTest() {
    creating.current.test = false;
    setTest(testDraft(project));
    setNewTestOpen(true);
    setResultFor(null);
    setNotice(null);
    focusForm();
  }
  function openDecision(experiment?: ProjectExperiment) {
    creating.current.decision = false;
    setDecision({
      ...decisionDraft(project),
      ...(experiment
        ? {
            experimentId: experiment.id,
            context: (experiment.result
              ? `Observation du test « ${experiment.title} » : ${experiment.result.observation}`
              : `Test préparé : ${experiment.title}`
            ).slice(0, projectTextLimits.long),
          }
        : {}),
    });
    setTab("decisions");
    setNewDecisionOpen(true);
    setOutcomeFor(null);
    setNotice(null);
    focusForm();
  }
  function saveTest(event: FormEvent) {
    event.preventDefault();
    if (creating.current.test) return;
    try {
      const entry = createExperiment(
        {
          ...test,
          title: test.title.trim(),
          hypothesis: test.hypothesis.trim(),
          protocol: test.protocol.trim(),
          successCriterion: test.successCriterion.trim(),
        },
        crypto.randomUUID(),
        new Date(),
      );
      creating.current.test = true;
      update((previous) =>
        previous.experiments?.some((item) => item.id === entry.id)
          ? previous
          : {
              ...previous,
              experiments: [...(previous.experiments ?? []), entry],
            },
      );
      setNewTestOpen(false);
      setNotice({
        text: "Test préparé. Le plan de départ est conservé ; vous pourrez lui ajouter vos observations.",
        error: false,
      });
    } catch (error) {
      showError(error);
    }
  }
  function saveResult(event: FormEvent, experiment: ProjectExperiment) {
    event.preventDefault();
    if (completed.current.has(`test:${experiment.id}`)) return;
    try {
      const entry = recordExperimentResult(
        experiment,
        {
          observation: result.observation.trim(),
          evidence: result.evidence.trim(),
          conclusion: result.conclusion,
        },
        new Date(),
      );
      completed.current.add(`test:${experiment.id}`);
      update((previous) => ({
        ...previous,
        experiments: (previous.experiments ?? []).map((item) =>
          item.id === experiment.id && !item.result ? entry : item,
        ),
      }));
      setResultFor(null);
      setNotice({
        text: "Résultat consigné avec le plan initial. La conclusion reste votre appréciation des éléments observés.",
        error: false,
      });
    } catch (error) {
      showError(error);
    }
  }
  function saveDecision(event: FormEvent) {
    event.preventDefault();
    if (creating.current.decision) return;
    try {
      const { experimentId, confidence, ...rest } = decision;
      if (confidence.trim() === "")
        throw new Error("Indiquez votre confiance initiale entre 0 et 100 %.");
      const entry = createDecision(
        {
          ...rest,
          title: rest.title.trim(),
          context: rest.context.trim(),
          options: rest.options.trim(),
          choice: rest.choice.trim(),
          expectedOutcome: rest.expectedOutcome.trim(),
          risk: rest.risk.trim(),
          confidence: Number(confidence),
          ...(experimentId ? { experimentId } : {}),
        },
        crypto.randomUUID(),
        new Date(),
      );
      creating.current.decision = true;
      update((previous) =>
        previous.decisions?.some((item) => item.id === entry.id)
          ? previous
          : { ...previous, decisions: [...(previous.decisions ?? []), entry] },
      );
      setNewDecisionOpen(false);
      setNotice({
        text: "Décision enregistrée. Le contexte, le choix et l’attente initiale sont conservés pour la comparaison future.",
        error: false,
      });
    } catch (error) {
      showError(error);
    }
  }
  function saveOutcome(event: FormEvent, entry: ProjectDecision) {
    event.preventDefault();
    if (completed.current.has(`decision:${entry.id}`)) return;
    try {
      const updated = recordDecisionOutcome(
        entry,
        {
          observed: outcome.observed.trim(),
          comparison: outcome.comparison,
          learning: outcome.learning.trim(),
        },
        new Date(),
      );
      completed.current.add(`decision:${entry.id}`);
      update((previous) => ({
        ...previous,
        decisions: (previous.decisions ?? []).map((item) =>
          item.id === entry.id && !item.outcome ? updated : item,
        ),
      }));
      setOutcomeFor(null);
      setNotice({
        text: "Bilan enregistré. L’attente de départ et le résultat observé restent côte à côte.",
        error: false,
      });
    } catch (error) {
      showError(error);
    }
  }
  function exportDossier() {
    const text = [
      "---",
      `title: ${JSON.stringify(project.title)}`,
      'type: "project-workbench"',
      `exported_at: ${JSON.stringify(new Date().toISOString())}`,
      "---",
      `# ${project.title}`,
      "## Le projet",
      `Problème : ${project.problem}`,
      `Client : ${project.customer}`,
      `Hypothèse : ${project.hypothesis}`,
      `Prochaine action : ${project.nextAction}`,
      `Étape déclarée : ${project.stage}`,
      "## Tests terrain",
      ...experiments.flatMap((entry) => [
        `### ${entry.title}`,
        `Préparé le : ${entry.createdAt}`,
        `Revue prévue : ${entry.reviewOn}`,
        `Hypothèse : ${entry.hypothesis}`,
        `Protocole : ${entry.protocol}`,
        `Critère de réussite : ${entry.successCriterion}`,
        ...(entry.result
          ? [
              `Observation : ${entry.result.observation}`,
              `Éléments de preuve : ${entry.result.evidence}`,
              `Conclusion personnelle : ${conclusions[entry.result.conclusion]}`,
              `Consigné le : ${entry.result.recordedAt}`,
            ]
          : ["Résultat : à observer."]),
      ]),
      "## Journal de décisions",
      ...decisions.flatMap((entry) => [
        `### ${entry.title}`,
        `Décidée le : ${entry.createdAt}`,
        `Contexte : ${entry.context}`,
        `Alternatives : ${entry.options}`,
        `Choix : ${entry.choice}`,
        `Attendu : ${entry.expectedOutcome}`,
        `Confiance initiale : ${entry.confidence} %`,
        `Risque : ${entry.risk}`,
        `Revue prévue : ${entry.reviewOn}`,
        ...(entry.experimentId
          ? [
              `Test associé : ${experiments.find((test) => test.id === entry.experimentId)?.title ?? entry.experimentId}`,
            ]
          : []),
        ...(entry.outcome
          ? [
              `Observé : ${entry.outcome.observed}`,
              `Comparaison personnelle : ${comparisons[entry.outcome.comparison]}`,
              `Apprentissage : ${entry.outcome.learning}`,
              `Bilan le : ${entry.outcome.recordedAt}`,
            ]
          : ["Bilan : à comparer au réel."]),
      ]),
      "## Apprentissages associés",
      ...linkedLessons.map(
        (lesson) => `- ${lesson.title} (version ${lesson.version})`,
      ),
      projectLearningMarkdown(lessons, project, state, new Date()),
      "\nLes observations et conclusions sont déclarées par l’utilisateur. Elles ne constituent pas une validation externe du marché.",
    ].join("\n\n");
    downloadFile(
      `projet-${project.id.replace(/[^a-zA-Z0-9-]/g, "-")}.md`,
      text,
      "text/markdown;charset=utf-8",
    );
  }

  return (
    <div
      className={`project-workbench${tab === "reperes" ? " workbench-plan-view" : ""}`}
    >
      <div className="workbench-topline">
        <button className="text-button" onClick={() => onNavigate("incubator")}>
          <Icon name="back" size={16} /> Tous mes projets
        </button>
        <button className="text-button" onClick={exportDossier}>
          Exporter le dossier <Icon name="external" size={14} />
        </button>
      </div>
      <header className="workbench-heading">
        <p className="eyebrow">PROJETS / L’ATELIER DU PROJET</p>
        <h1>{project.title}</h1>
        <p>
          {project.problem ||
            "Donnez une forme concrète à l’hypothèse de votre projet."}
        </p>
        <div className="workbench-context">
          <span>
            <Icon name="idea" size={15} />
            {project.stage}
          </span>
          <span>
            {experiments.length} test{experiments.length > 1 ? "s" : ""} ·{" "}
            {observed} observé{observed > 1 ? "s" : ""}
          </span>
          <span>
            {decisions.length} décision{decisions.length > 1 ? "s" : ""} ·{" "}
            {compared} bilan{compared > 1 ? "s" : ""}
          </span>
        </div>
      </header>
      <div
        className="workbench-tabs"
        role="tablist"
        aria-label="Espaces de l’atelier"
      >
        {tabs.map((item, index) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={tab === item.id}
            tabIndex={tab === item.id ? 0 : -1}
            id={`workbench-tab-${item.id}`}
            aria-controls="workbench-panel"
            onClick={() => {
              setTab(item.id);
              setNotice(null);
            }}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
              else if (event.key === "ArrowLeft")
                next = (index + tabs.length - 1) % tabs.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = tabs.length - 1;
              else return;
              event.preventDefault();
              setTab(tabs[next]!.id);
              document
                .getElementById(`workbench-tab-${tabs[next]!.id}`)
                ?.focus();
            }}
          >
            <Icon name={item.icon} size={17} />
            <span>{item.label}</span>
            <small aria-hidden="true">0{index + 1}</small>
          </button>
        ))}
      </div>
      {notice && (
        <p
          className={
            notice.error ? "error workbench-notice" : "workbench-notice"
          }
          role={notice.error ? "alert" : "status"}
        >
          {notice.text}
        </p>
      )}
      <section
        id="workbench-panel"
        role="tabpanel"
        aria-labelledby={`workbench-tab-${tab}`}
      >
        {tab === "terrain" && (
          <>
            <div className="workbench-section-heading">
              <div>
                <p className="eyebrow">DE L’HYPOTHÈSE À L’OBSERVATION</p>
                <h2>Faire parler le terrain.</h2>
                <p>
                  Fixez le critère avant le résultat. Notez ensuite ce qui s’est
                  réellement passé.
                </p>
              </div>
              <button className="button primary" onClick={openTest}>
                Préparer un test <Icon name="plus" size={16} />
              </button>
            </div>
            {newTestOpen && (
              <section
                className="workbench-form"
                ref={formRef}
                tabIndex={-1}
                aria-label="Préparer un test terrain"
              >
                <div className="workbench-form-heading">
                  <span className="eyebrow">LE PLAN DE DÉPART</span>
                  <h3>Que voulez-vous apprendre ?</h3>
                </div>
                <form onSubmit={saveTest}>
                  <Field
                    label="Nom du test"
                    value={test.title}
                    maxLength={projectTextLimits.title}
                    onChange={(title) =>
                      setTest((prev) => ({ ...prev, title }))
                    }
                  />
                  <Field
                    label="Hypothèse à vérifier"
                    multiline
                    maxLength={projectTextLimits.short}
                    value={test.hypothesis}
                    onChange={(hypothesis) =>
                      setTest((prev) => ({ ...prev, hypothesis }))
                    }
                  />
                  <div className="workbench-form-grid">
                    <Field
                      label="Protocole de test"
                      multiline
                      value={test.protocol}
                      onChange={(protocol) =>
                        setTest((prev) => ({ ...prev, protocol }))
                      }
                    />
                    <Field
                      label="Critère de réussite"
                      multiline
                      maxLength={projectTextLimits.short}
                      value={test.successCriterion}
                      onChange={(successCriterion) =>
                        setTest((prev) => ({ ...prev, successCriterion }))
                      }
                    />
                  </div>
                  <label className="field workbench-date-field">
                    Date de revue du test
                    <input
                      aria-label="Date de revue du test"
                      type="date"
                      required
                      value={test.reviewOn}
                      onChange={(e) =>
                        setTest((prev) => ({
                          ...prev,
                          reviewOn: e.target.value,
                        }))
                      }
                    />
                  </label>
                  <p className="workbench-footnote">
                    Le plan sera daté et conservé tel quel. Le résultat viendra
                    s’ajouter ensuite ; ce critère ne sera pas réécrit après
                    coup.
                  </p>
                  <div className="workbench-form-actions">
                    <button className="button primary" type="submit">
                      Enregistrer le test <Icon name="arrow" size={16} />
                    </button>
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => setNewTestOpen(false)}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </section>
            )}
            {!experiments.length && !newTestOpen && (
              <div className="workbench-empty">
                <div className="workbench-path" aria-hidden="true">
                  <span>01</span>
                  <i />
                  <span>02</span>
                  <i />
                  <span>03</span>
                </div>
                <h3>
                  Une petite expérience vaut mieux qu’une grande certitude.
                </h3>
                <p>
                  Choisissez une hypothèse risquée, un protocole simple et un
                  signe observable. Définissez ce qui pourrait conforter ou
                  fragiliser votre idée.
                </p>
                <dl>
                  <div>
                    <dt>Votre point de départ</dt>
                    <dd>
                      {project.hypothesis ||
                        "Quelle hypothèse pourrait remettre ce projet en question ?"}
                    </dd>
                  </div>
                  <div>
                    <dt>Le prochain geste</dt>
                    <dd>
                      {project.nextAction ||
                        "Définissez une action courte et mesurable."}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
            <div className="workbench-ledger">
              {experiments.map((entry, index) => (
                <article
                  className="workbench-entry project-test-entry"
                  key={entry.id}
                >
                  <div className="workbench-entry-top">
                    <span className="workbench-entry-number">
                      {String(experiments.length - index).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="eyebrow">
                        TEST TERRAIN · REVUE {displayDate(entry.reviewOn)}
                      </p>
                      <h3>{entry.title}</h3>
                    </div>
                    <span className="workbench-status">
                      <Icon name={entry.result ? "check" : "clock"} size={14} />
                      {entry.result
                        ? conclusions[entry.result.conclusion]
                        : "À observer"}
                    </span>
                  </div>
                  <blockquote>{entry.hypothesis}</blockquote>
                  <div className="workbench-plan-columns">
                    <div>
                      <span className="workbench-label">
                        Ce que vous allez faire
                      </span>
                      <p>{entry.protocol}</p>
                    </div>
                    <div>
                      <span className="workbench-label">Le signe attendu</span>
                      <p>{entry.successCriterion}</p>
                    </div>
                  </div>
                  <p className="workbench-timestamp">
                    Plan fixé le {dateTime.format(new Date(entry.createdAt))} ·
                    heure de Paris
                  </p>
                  {entry.result ? (
                    <div className="workbench-observation">
                      <span className="eyebrow">CE QUI A ÉTÉ OBSERVÉ</span>
                      <p>{entry.result.observation}</p>
                      <details>
                        <summary>
                          Éléments de preuve <Icon name="plus" size={14} />
                        </summary>
                        <p>{entry.result.evidence}</p>
                      </details>
                      <div className="workbench-observation-footer">
                        <span>
                          Conclusion personnelle ·{" "}
                          {conclusions[entry.result.conclusion]}
                        </span>
                        <button
                          className="text-button"
                          onClick={() => openDecision(entry)}
                        >
                          Éclairer une décision <Icon name="arrow" size={15} />
                        </button>
                      </div>
                      <small>
                        Consigné le{" "}
                        {dateTime.format(new Date(entry.result.recordedAt))}
                      </small>
                    </div>
                  ) : resultFor === entry.id ? (
                    <form
                      className="workbench-result-form"
                      ref={resultFormRef}
                      tabIndex={-1}
                      aria-label="Consigner le résultat du test"
                      onSubmit={(event) => saveResult(event, entry)}
                    >
                      <p className="eyebrow">DÉCRIRE AVANT DE CONCLURE</p>
                      <Field
                        label="Observation"
                        multiline
                        value={result.observation}
                        onChange={(observation) =>
                          setResult((prev) => ({ ...prev, observation }))
                        }
                      />
                      <Field
                        label="Éléments de preuve"
                        multiline
                        value={result.evidence}
                        onChange={(evidence) =>
                          setResult((prev) => ({ ...prev, evidence }))
                        }
                      />
                      <label className="field">
                        Conclusion
                        <select
                          aria-label="Conclusion"
                          value={result.conclusion}
                          onChange={(e) =>
                            setResult((prev) => ({
                              ...prev,
                              conclusion: e.target
                                .value as ExperimentResult["conclusion"],
                            }))
                          }
                        >
                          <option value="inconclusive">
                            Résultat non concluant
                          </option>
                          <option value="supported">Hypothèse confortée</option>
                          <option value="refuted">Hypothèse fragilisée</option>
                        </select>
                      </label>
                      <p className="workbench-footnote">
                        Votre conclusion décrit ce test. Elle ne certifie pas un
                        marché ou une réussite future. Le bilan sera conservé
                        avec le plan initial.
                      </p>
                      <div className="workbench-form-actions">
                        <button className="button primary" type="submit">
                          Enregistrer le résultat
                        </button>
                        <button
                          type="button"
                          className="button secondary"
                          onClick={() => setResultFor(null)}
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      className="text-button"
                      onClick={() => {
                        setResultFor(entry.id);
                        setResult({
                          observation: "",
                          evidence: "",
                          conclusion: "inconclusive",
                        });
                        setNotice(null);
                        focusResultForm();
                      }}
                    >
                      Consigner le résultat <Icon name="arrow" size={15} />
                    </button>
                  )}
                </article>
              ))}
            </div>
            <p className="workbench-method-note">
              Un résultat est un indice, pas une validation automatique. Un test
              contradictoire ou non concluant peut vous apprendre davantage
              qu’un avis positif.
            </p>
          </>
        )}
        {tab === "decisions" && (
          <>
            <div className="workbench-section-heading">
              <div>
                <p className="eyebrow">
                  DÉCIDER AVEC LES INFORMATIONS DU MOMENT
                </p>
                <h2>Ce que vous saviez. Ce qui est arrivé.</h2>
                <p>
                  Gardez le contexte de départ, puis comparez votre attente aux
                  faits.
                </p>
              </div>
              <button className="button primary" onClick={() => openDecision()}>
                Noter une décision <Icon name="plus" size={16} />
              </button>
            </div>
            {newDecisionOpen && (
              <section
                className="workbench-form"
                ref={formRef}
                tabIndex={-1}
                aria-label="Noter une décision"
              >
                <div className="workbench-form-heading">
                  <span className="eyebrow">AVANT DE CONNAÎTRE LA SUITE</span>
                  <h3>Posez votre raisonnement.</h3>
                </div>
                <form onSubmit={saveDecision}>
                  <Field
                    label="Titre de la décision"
                    maxLength={projectTextLimits.title}
                    value={decision.title}
                    onChange={(title) =>
                      setDecision((prev) => ({ ...prev, title }))
                    }
                  />
                  <label className="field">
                    Test terrain associé (facultatif)
                    <select
                      aria-label="Test terrain associé (facultatif)"
                      value={decision.experimentId}
                      onChange={(e) =>
                        setDecision((prev) => ({
                          ...prev,
                          experimentId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Aucun test associé</option>
                      {experiments.map((entry) => (
                        <option value={entry.id} key={entry.id}>
                          {entry.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Field
                    label="Contexte disponible"
                    multiline
                    value={decision.context}
                    onChange={(context) =>
                      setDecision((prev) => ({ ...prev, context }))
                    }
                  />
                  <div className="workbench-form-grid">
                    <Field
                      label="Options envisagées"
                      multiline
                      value={decision.options}
                      onChange={(options) =>
                        setDecision((prev) => ({ ...prev, options }))
                      }
                    />
                    <Field
                      label="Choix retenu"
                      multiline
                      maxLength={projectTextLimits.short}
                      value={decision.choice}
                      onChange={(choice) =>
                        setDecision((prev) => ({ ...prev, choice }))
                      }
                    />
                  </div>
                  <Field
                    label="Résultat attendu"
                    multiline
                    maxLength={projectTextLimits.short}
                    value={decision.expectedOutcome}
                    onChange={(expectedOutcome) =>
                      setDecision((prev) => ({ ...prev, expectedOutcome }))
                    }
                  />
                  <Field
                    label="Risque principal"
                    multiline
                    maxLength={projectTextLimits.short}
                    value={decision.risk}
                    onChange={(risk) =>
                      setDecision((prev) => ({ ...prev, risk }))
                    }
                  />
                  <div className="workbench-form-grid">
                    <label className="field">
                      Confiance initiale (%)
                      <input
                        aria-label="Confiance initiale (%)"
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        required
                        value={decision.confidence}
                        onChange={(e) =>
                          setDecision((prev) => ({
                            ...prev,
                            confidence: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="field">
                      Date de revue de la décision
                      <input
                        aria-label="Date de revue de la décision"
                        type="date"
                        required
                        value={decision.reviewOn}
                        onChange={(e) =>
                          setDecision((prev) => ({
                            ...prev,
                            reviewOn: e.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>
                  <p className="workbench-footnote">
                    La confiance exprime votre estimation personnelle. Ce
                    contexte et cette attente seront conservés pour éviter de
                    les reconstruire après coup.
                  </p>
                  <div className="workbench-form-actions">
                    <button type="submit" className="button primary">
                      Enregistrer la décision <Icon name="arrow" size={16} />
                    </button>
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() => setNewDecisionOpen(false)}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </section>
            )}
            {!decisions.length && !newDecisionOpen && (
              <div className="workbench-empty">
                <Icon name="node" size={34} />
                <h3>Une décision mérite son contexte.</h3>
                <p>
                  Notez une action, ses alternatives et ce que vous en attendez.
                  Plus tard, vous pourrez comparer sans réécrire l’histoire.
                </p>
              </div>
            )}
            <div className="workbench-ledger">
              {decisions.map((entry, index) => (
                <article
                  className="workbench-entry project-decision-entry"
                  key={entry.id}
                >
                  <div className="workbench-entry-top">
                    <span className="workbench-entry-number">
                      {String(decisions.length - index).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="eyebrow">
                        DÉCISION DU {dateTime.format(new Date(entry.createdAt))}
                      </p>
                      <h3>{entry.title}</h3>
                    </div>
                    <span className="workbench-status">
                      <Icon
                        name={entry.outcome ? "check" : "clock"}
                        size={14}
                      />
                      {entry.outcome
                        ? "Bilan consigné"
                        : "À confronter au réel"}
                    </span>
                  </div>
                  <div className="workbench-choice">
                    <span className="workbench-label">Votre choix</span>
                    <p>{entry.choice}</p>
                  </div>
                  <div className="workbench-decision-meta">
                    <span>
                      <strong>{entry.confidence} %</strong> confiance initiale
                    </span>
                    <span>Revue prévue le {displayDate(entry.reviewOn)}</span>
                  </div>
                  {entry.experimentId && (
                    <p className="workbench-test-link">
                      <Icon name="lab" size={14} />
                      Test associé :{" "}
                      {experiments.find(
                        (test) => test.id === entry.experimentId,
                      )?.title ?? "Test archivé"}
                    </p>
                  )}
                  <details className="workbench-baseline">
                    <summary>
                      Le raisonnement de départ <Icon name="plus" size={14} />
                    </summary>
                    <dl>
                      <div>
                        <dt>Contexte disponible</dt>
                        <dd>{entry.context}</dd>
                      </div>
                      <div>
                        <dt>Options envisagées</dt>
                        <dd>{entry.options}</dd>
                      </div>
                      <div>
                        <dt>Risque principal</dt>
                        <dd>{entry.risk}</dd>
                      </div>
                    </dl>
                  </details>
                  <div className="workbench-comparison">
                    <div>
                      <span className="workbench-label">
                        Ce que vous attendiez
                      </span>
                      <p>{entry.expectedOutcome}</p>
                    </div>
                    <div>
                      <span className="workbench-label">
                        Ce qui s’est passé
                      </span>
                      <p>
                        {entry.outcome?.observed ??
                          "Le résultat n’est pas encore consigné."}
                      </p>
                    </div>
                  </div>
                  {entry.outcome ? (
                    <div className="workbench-learning">
                      <span className="eyebrow">
                        {comparisons[entry.outcome.comparison]}
                      </span>
                      <h4>Ce que vous en retenez</h4>
                      <p>{entry.outcome.learning}</p>
                      <small>
                        Bilan du{" "}
                        {dateTime.format(new Date(entry.outcome.recordedAt))}
                      </small>
                    </div>
                  ) : outcomeFor === entry.id ? (
                    <form
                      className="workbench-result-form"
                      ref={resultFormRef}
                      tabIndex={-1}
                      aria-label="Comparer la décision au réel"
                      onSubmit={(event) => saveOutcome(event, entry)}
                    >
                      <p className="eyebrow">
                        COMPARER SANS RÉÉCRIRE LE DÉPART
                      </p>
                      <Field
                        label="Ce qui s’est passé"
                        multiline
                        value={outcome.observed}
                        onChange={(observed) =>
                          setOutcome((prev) => ({ ...prev, observed }))
                        }
                      />
                      <label className="field">
                        Comparaison
                        <select
                          aria-label="Comparaison"
                          value={outcome.comparison}
                          onChange={(e) =>
                            setOutcome((prev) => ({
                              ...prev,
                              comparison: e.target
                                .value as DecisionOutcome["comparison"],
                            }))
                          }
                        >
                          <option value="mixed">Résultat contrasté</option>
                          <option value="better">Mieux que prévu</option>
                          <option value="as-expected">
                            Conforme à l’attendu
                          </option>
                          <option value="worse">Moins bien que prévu</option>
                        </select>
                      </label>
                      <Field
                        label="Ce que j’en retiens"
                        multiline
                        value={outcome.learning}
                        onChange={(learning) =>
                          setOutcome((prev) => ({ ...prev, learning }))
                        }
                      />
                      <div className="workbench-form-actions">
                        <button className="button primary" type="submit">
                          Enregistrer le bilan
                        </button>
                        <button
                          className="button secondary"
                          type="button"
                          onClick={() => setOutcomeFor(null)}
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      className="text-button"
                      onClick={() => {
                        setOutcomeFor(entry.id);
                        setOutcome({
                          observed: "",
                          comparison: "mixed",
                          learning: "",
                        });
                        setNotice(null);
                        focusResultForm();
                      }}
                    >
                      Comparer au réel <Icon name="arrow" size={15} />
                    </button>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
        {tab === "reperes" && (
          <>
            <ProjectLearningPlan
              project={project}
              state={state}
              update={update}
              onNavigate={onNavigate}
            />
            <details className="workbench-project-brief">
              <summary>
                Le cap du projet <Icon name="plus" size={15} />
              </summary>
              <p className="eyebrow">Étape déclarée : {project.stage}</p>
              <p>{project.problem}</p>
              <h3>{project.customer || "Un client à préciser"}</h3>
              <p>
                {project.nextAction ||
                  "Définir la prochaine action observable dans la fiche du projet."}
              </p>
            </details>
          </>
        )}
      </section>
      <footer className="workbench-footer">
        <Icon name="lock" size={14} />
        <p>
          Plans, décisions et bilans sont conservés dans votre navigateur et
          dans l’export de vos données. Les échéances sont des repères de
          travail ; aucun contact ni rappel extérieur n’est envoyé.
        </p>
      </footer>
    </div>
  );
}

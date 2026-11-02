import { useState, type FormEvent } from "react";
import { Icon } from "./Icon";
import { lessons } from "../data/lessons";
import {
  calculateEconomics,
  nextProjectStage,
  projectStages,
  reviewPrompt,
} from "../lib/domain";
import type { AppState, Project, StateUpdater } from "../lib/types";

const euros = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const number = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

export function Lab() {
  const [values, setValues] = useState({
    price: "45",
    unitCost: "18",
    units: "120",
    fixedCosts: "2400",
  });
  const [savedScenario, setSavedScenario] = useState<ReturnType<
    typeof calculateEconomics
  > | null>(null);
  let result: ReturnType<typeof calculateEconomics> | null = null;
  let error = "";
  try {
    if (Object.values(values).some((value) => value.trim() === ""))
      throw new Error(
        "Complétez les quatre hypothèses pour calculer le scénario.",
      );
    result = calculateEconomics({
      price: Number(values.price),
      unitCost: Number(values.unitCost),
      units: Number(values.units),
      fixedCosts: Number(values.fixedCosts),
    });
  } catch (cause) {
    error =
      cause instanceof Error
        ? cause.message
        : "Vérifiez vos hypothèses : utilisez des nombres positifs, avec un prix supérieur à zéro.";
  }
  const controls = [
    {
      key: "price" as const,
      label: "Prix de vente unitaire HT",
      unit: "€",
      max: 200,
      step: "0.5",
    },
    {
      key: "unitCost" as const,
      label: "Coût variable unitaire HT",
      unit: "€",
      max: 200,
      step: "0.5",
    },
    {
      key: "units" as const,
      label: "Quantité vendue par mois",
      unit: "unités",
      max: 1000,
      step: "1",
    },
    {
      key: "fixedCosts" as const,
      label: "Charges fixes mensuelles",
      unit: "€",
      max: 20000,
      step: "50",
    },
  ];
  return (
    <div className="stack">
      <header className="page-heading">
        <p className="eyebrow">Lab · Finance appliquée</p>
        <h1>Les chiffres prennent vie.</h1>
        <p className="muted">
          Changez une hypothèse. Observez l’effet sur votre modèle économique.
        </p>
      </header>
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Scénario fictif</p>
            <h2>Un produit, un mois d’activité</h2>
          </div>
          <span className="tag">Calcul en direct</span>
        </div>
        <div className="field-grid">
          {controls.map((control) => (
            <div className="field" key={control.key}>
              <label htmlFor={`economics-${control.key}`}>
                {control.label} <span className="muted">({control.unit})</span>
              </label>
              <input
                id={`economics-${control.key}`}
                type="number"
                min={control.key === "price" ? "0.01" : "0"}
                step="any"
                value={values[control.key]}
                onChange={(event) =>
                  setValues((previous) => ({
                    ...previous,
                    [control.key]: event.target.value,
                  }))
                }
              />
              <input
                type="range"
                aria-label={`Ajuster : ${control.label}`}
                min={control.key === "price" ? "0.5" : "0"}
                max={Math.max(control.max, Number(values[control.key]) || 0)}
                step={control.step}
                value={Number(values[control.key]) || 0}
                onChange={(event) =>
                  setValues((previous) => ({
                    ...previous,
                    [control.key]: event.target.value,
                  }))
                }
              />
            </div>
          ))}
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </section>
      {result && (
        <>
          <section
            className="metrics"
            aria-label="Résultats du scénario"
            aria-live="polite"
          >
            <div className="metric">
              <span className="muted">Chiffre d’affaires mensuel</span>
              <strong>{euros.format(result.revenue)}</strong>
              <small>Prix × quantité vendue</small>
            </div>
            <div className="metric">
              <span className="muted">Marge sur coûts variables</span>
              <strong>{euros.format(result.contribution)}</strong>
              <small>
                {number.format(result.contributionRate * 100)} % du chiffre
                d’affaires
              </small>
            </div>
            <div className="metric">
              <span className="muted">Résultat simplifié mensuel</span>
              <strong>{euros.format(result.profit)}</strong>
              <small>Avant impôt et financement</small>
            </div>
          </section>
          <section className="panel">
            <p className="eyebrow">Le point de bascule</p>
            <h2>
              {result.breakEvenUnits === null
                ? "Ce modèle ne couvre pas ses charges."
                : `${number.format(result.breakEvenUnits)} unités pour atteindre l’équilibre`}
            </h2>
            <p>
              {result.breakEvenUnits === null
                ? "Le prix ne dépasse pas le coût variable unitaire. Vendre davantage ne finance pas les charges fixes : travaillez d’abord le prix, les coûts ou le modèle."
                : `Chaque vente contribue à hauteur de ${euros.format(Number(values.price) - Number(values.unitCost))} aux charges fixes, puis au résultat. Le seuil est arrondi à l’unité supérieure.`}
            </p>
            <button
              className="button secondary"
              onClick={() => setSavedScenario(result)}
            >
              Garder comme référence
            </button>
            {savedScenario && (
              <p className="success" role="status">
                Référence de cette session : résultat{" "}
                {euros.format(savedScenario.profit)}. Écart actuel :{" "}
                {euros.format(result.profit - savedScenario.profit)}.
              </p>
            )}
          </section>
        </>
      )}
      <aside className="panel">
        <h3>Un modèle pour réfléchir, pas une prévision.</h3>
        <p className="muted">
          Exemple pédagogique fictif, hors TVA. Prix et coûts restent constants
          ; toute la production est vendue. Stocks, délais de paiement,
          financement, impôts, capacité et variation de la demande ne sont pas
          modélisés. Le résultat ne représente donc pas la trésorerie
          disponible.
        </p>
      </aside>
    </div>
  );
}

export function AILab() {
  const [prompt, setPrompt] = useState("");
  const [analysis, setAnalysis] = useState<ReturnType<
    typeof reviewPrompt
  > | null>(null);
  const [feedback, setFeedback] = useState("");
  function analyse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAnalysis(reviewPrompt(prompt));
    setFeedback("");
  }
  async function copySuggestion() {
    if (!analysis) return;
    try {
      await navigator.clipboard.writeText(analysis.suggestion);
      setFeedback(
        "Trame copiée. Remplacez les indications entre crochets par votre contexte.",
      );
    } catch {
      setFeedback(
        "La copie automatique est indisponible. Sélectionnez le texte de la trame et copiez-le manuellement.",
      );
    }
  }
  return (
    <div className="stack">
      <header className="page-heading">
        <p className="eyebrow">AI Lab · Prompt studio</p>
        <h1>De l’intention à l’instruction.</h1>
        <p className="muted">
          Construisez une demande plus précise, puis testez-la dans le modèle de
          votre choix.
        </p>
      </header>
      <section className="panel">
        <div className="panel-header">
          <h2>Votre espace d’expérimentation</h2>
          <span className="tag">Grille locale</span>
        </div>
        <p className="muted">
          Aucun modèle IA connecté. Cette grille recherche des indices de
          structure dans le texte ; elle ne juge ni la véracité ni la qualité
          future de la réponse. Votre prompt reste dans cette session.
        </p>
        <form className="stack" onSubmit={analyse}>
          <div className="field">
            <label htmlFor="prompt-text">
              Quel travail voulez-vous confier à l’IA ?
            </label>
            <textarea
              id="prompt-text"
              value={prompt}
              required
              minLength={20}
              maxLength={12000}
              rows={9}
              placeholder="Objectif : comparer trois offres pour mon projet…&#10;Contexte : …&#10;Données : …&#10;Contraintes : …&#10;Format attendu : …&#10;Critères de réussite : …"
              onChange={(event) => {
                setPrompt(event.target.value);
                setAnalysis(null);
                setFeedback("");
              }}
            />
            <small className="muted">
              20 caractères minimum. Évitez de saisir des données
              confidentielles dans vos futurs outils IA.
            </small>
          </div>
          <div>
            <button className="button primary" type="submit">
              Examiner la structure <Icon name="arrow" size={16} />
            </button>
          </div>
        </form>
      </section>
      {analysis && (
        <section
          className="panel"
          aria-label="Analyse de la structure"
          aria-live="polite"
        >
          <div className="panel-header">
            <div>
              <p className="eyebrow">Indices détectés</p>
              <h2>{analysis.score} / 100</h2>
            </div>
            <span className="muted">Un repère, pas une note de qualité</span>
          </div>
          <ul className="stack">
            {analysis.checks.map((check) => (
              <li key={check.label}>
                <strong>
                  {check.passed ? "✓" : "○"} {check.label}
                </strong>
                <p className="muted">{check.tip}</p>
              </li>
            ))}
          </ul>
          <h3>Une trame à adapter</h3>
          <pre>{analysis.suggestion}</pre>
          <button
            className="button secondary"
            type="button"
            onClick={() => void copySuggestion()}
          >
            Copier la trame
          </button>
          {feedback && (
            <p role="status" className="muted">
              {feedback}
            </p>
          )}
        </section>
      )}
      <aside className="panel">
        <p className="eyebrow">Une habitude professionnelle</p>
        <h3>Définissez comment reconnaître une bonne réponse.</h3>
        <p className="muted">
          Avant de modifier le prompt, conservez un même jeu d’exemples et vos
          critères de réussite. Comparez les résultats, identifiez les erreurs
          et vérifiez les faits dans les sources. Une formulation élégante n’est
          pas une preuve de fiabilité.
        </p>
      </aside>
    </div>
  );
}

type ProjectDraft = Pick<
  Project,
  "title" | "problem" | "customer" | "hypothesis" | "nextAction"
>;
const emptyDraft: ProjectDraft = {
  title: "",
  problem: "",
  customer: "",
  hypothesis: "",
  nextAction: "",
};

export function Incubator({
  state,
  update,
  onNavigate,
}: {
  state: AppState;
  update: StateUpdater;
  onNavigate: (route: string) => void;
}) {
  const [draft, setDraft] = useState<ProjectDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackKind, setFeedbackKind] = useState<"success" | "error">(
    "success",
  );
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = Object.fromEntries(
      Object.entries(draft).map(([key, value]) => [key, value.trim()]),
    ) as ProjectDraft;
    if (Object.values(cleaned).some((value) => !value)) {
      setFeedbackKind("error");
      setFeedback("Complétez chaque champ avec du texte avant d’enregistrer.");
      return;
    }
    if (editingId) {
      update((previous) => ({
        ...previous,
        projects: previous.projects.map((project) =>
          project.id === editingId ? { ...project, ...cleaned } : project,
        ),
      }));
    } else {
      const project: Project = {
        ...cleaned,
        id: crypto.randomUUID(),
        stage: projectStages[0],
        lessonIds: [],
        createdAt: new Date().toISOString(),
      };
      update((previous) => ({
        ...previous,
        projects: [...previous.projects, project],
      }));
    }
    setDraft(emptyDraft);
    setEditingId(null);
    setFormOpen(false);
    setFeedbackKind("success");
    setFeedback(
      editingId
        ? "Projet mis à jour."
        : "Projet créé. Commencez par tester votre hypothèse avec des clients potentiels.",
    );
  }
  function edit(project: Project) {
    setDraft({
      title: project.title,
      problem: project.problem,
      customer: project.customer,
      hypothesis: project.hypothesis,
      nextAction: project.nextAction,
    });
    setEditingId(project.id);
    setFormOpen(true);
    setFeedback("");
  }
  function advance(project: Project) {
    setFeedbackKind("success");
    const next = nextProjectStage(project.stage);
    update((previous) => ({
      ...previous,
      projects: previous.projects.map((item) =>
        item.id === project.id ? { ...item, stage: next } : item,
      ),
    }));
    setFeedback(
      `${project.title} : étape « ${next} ». Ce changement est une déclaration personnelle, pas une validation externe.`,
    );
  }
  return (
    <div className="stack">
      <header className="page-heading">
        <p className="eyebrow">Incubator · De la connaissance au terrain</p>
        <h1>Donnez une suite à vos idées.</h1>
        <p className="muted">
          Un client précis. Une hypothèse à vérifier. Une prochaine action
          concrète.
        </p>
      </header>
      <div>
        <button
          className="button primary"
          onClick={() => {
            setDraft(emptyDraft);
            setEditingId(null);
            setFormOpen(true);
            setFeedback("");
          }}
        >
          Créer un projet <Icon name="plus" size={16} />
        </button>
      </div>
      {feedback && (
        <p
          role={feedbackKind === "error" ? "alert" : "status"}
          className={feedbackKind}
        >
          {feedback}
        </p>
      )}
      {formOpen && (
        <section className="panel">
          <h2>
            {editingId
              ? "Affiner le projet"
              : "Votre prochain terrain d’apprentissage"}
          </h2>
          <form className="stack" onSubmit={save}>
            <div className="field">
              <label htmlFor="project-title">Nom du projet</label>
              <input
                id="project-title"
                autoFocus
                required
                maxLength={100}
                value={draft.title}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    title: event.target.value,
                  }))
                }
              />
            </div>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="project-problem">
                  Quel problème concret résoudre ?
                </label>
                <textarea
                  id="project-problem"
                  required
                  maxLength={1200}
                  rows={3}
                  value={draft.problem}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      problem: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="project-customer">
                  Pour quel client ou utilisateur ?
                </label>
                <textarea
                  id="project-customer"
                  required
                  maxLength={1200}
                  rows={3}
                  value={draft.customer}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      customer: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="project-hypothesis">
                L’hypothèse la plus risquée à tester
              </label>
              <textarea
                id="project-hypothesis"
                required
                maxLength={1200}
                rows={3}
                placeholder="Par exemple : cinq commerces sur dix accepteraient un essai à 40 € par mois."
                value={draft.hypothesis}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    hypothesis: event.target.value,
                  }))
                }
              />
            </div>
            <div className="field">
              <label htmlFor="project-action">
                La prochaine action observable
              </label>
              <textarea
                id="project-action"
                required
                maxLength={1200}
                rows={3}
                placeholder="Par exemple : contacter cinq commerçants et noter leurs pratiques actuelles."
                value={draft.nextAction}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    nextAction: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <button type="submit" className="button primary">
                Enregistrer le projet
              </button>{" "}
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setFormOpen(false);
                  setEditingId(null);
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        </section>
      )}
      {!state.projects.length && !formOpen && (
        <section className="panel empty-state">
          <span className="eyebrow">
            Votre premier projet commence par une question
          </span>
          <h2>Quel problème aimeriez-vous mieux comprendre ?</h2>
          <p className="muted">
            Créez une fiche ou sauvegardez une idée depuis une leçon. Vos
            apprentissages pourront ensuite enrichir ce projet, étape par étape.
          </p>
        </section>
      )}
      {state.projects.map((project) => (
        <article className="panel project-card" key={project.id}>
          <div className="panel-header">
            <div>
              <span className="eyebrow">Projet personnel</span>
              <h2>{project.title}</h2>
            </div>
            <span className="tag">{project.stage}</span>
          </div>
          <div className="field-grid">
            <div>
              <h3>Le problème</h3>
              <p>{project.problem || "À préciser dans la fiche projet."}</p>
            </div>
            <div>
              <h3>Le client</h3>
              <p>{project.customer || "À préciser avant les entretiens."}</p>
            </div>
          </div>
          <h3>Hypothèse à tester</h3>
          <p>
            {project.hypothesis ||
              "Quelle hypothèse pourrait remettre le projet en question ?"}
          </p>
          <h3>Prochaine action</h3>
          <p>
            {project.nextAction ||
              "Définissez une action mesurable et réalisable cette semaine."}
          </p>
          {!!project.lessonIds.length && (
            <div>
              <h3>Apprentissages associés</h3>
              <ul>
                {project.lessonIds.map((id) => (
                  <li key={id}>
                    {lessons.find((lesson) => lesson.id === id)?.title ??
                      "Leçon archivée"}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="muted">
            Étape{" "}
            {Math.max(
              1,
              projectStages.findIndex((stage) => stage === project.stage) + 1,
            )}{" "}
            sur {projectStages.length} · {projectStages.join(" → ")}
          </p>
          <div>
            <button
              className="button primary"
              onClick={() => onNavigate(`project/${project.id}`)}
            >
              Ouvrir l’atelier <Icon name="arrow" size={16} />
            </button>{" "}
            <button className="button secondary" onClick={() => edit(project)}>
              Modifier la fiche
            </button>{" "}
            {projectStages.some((stage) => stage === project.stage) &&
              project.stage !== projectStages[projectStages.length - 1] && (
                <button
                  className="button secondary"
                  onClick={() => advance(project)}
                >
                  Passer à « {nextProjectStage(project.stage)} »
                </button>
              )}
          </div>
        </article>
      ))}
      <p className="muted">
        Les fiches suivent le stockage de votre progression dans ce navigateur.
        Vous pouvez les exporter dans les paramètres.
      </p>
    </div>
  );
}

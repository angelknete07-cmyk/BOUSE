import { useState, type FormEvent } from "react";
import { Icon } from "./Icon";
import { lessons } from "../data/lessons";
import { nextProjectStage, projectStages } from "../lib/domain";
import type { AppState, Project, StateUpdater } from "../lib/types";

export { Lab } from "./FinancialInstrument";
export { AILab } from "./PromptInstrument";

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

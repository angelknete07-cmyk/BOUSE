import { useRef, useState, type FormEvent } from "react";
import { lessons } from "../data/lessons";
import type { AppState, Project, StateUpdater } from "../lib/types";
import {
  buildProjectLearningPlan,
  setProjectLearningGoals,
} from "../lib/projectLearning";
import { useClock } from "../lib/useClock";
import { Icon } from "./Icon";

type Props = {
  project: Project;
  state: AppState;
  update: StateUpdater;
  onNavigate: (route: string) => void;
};
const states = {
  passed: "Quiz validé",
  ready: "Disponible",
  revisit: "À reprendre",
  blocked: "Prérequis à travailler",
};
const date = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Europe/Paris",
});
const lessonTitle = (id: string) =>
  lessons.find((lesson) => lesson.id === id)?.title ?? id;
const plural = (count: number, singular: string, multiple: string) =>
  count === 1 ? singular : multiple;

export function ProjectLearningPlan({
  project,
  state,
  update,
  onNavigate,
}: Props) {
  const now = useClock();
  const plan = buildProjectLearningPlan(lessons, project, state, now);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string[]>([]);
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const saving = useRef(false);
  const unknownDraft = draft.filter(
    (id) => !lessons.some((lesson) => lesson.id === id),
  );
  const associated = [...new Set(project.lessonIds)];
  const hasGoals = plan.goalIds.length > 0;
  const hasIssues =
    plan.missingGoalIds.length > 0 ||
    plan.missingPrerequisiteIds.length > 0 ||
    plan.cycleIds.length > 0;

  function openEditor() {
    setDraft([...(project.learningGoalIds ?? [])]);
    saving.current = false;
    setEditing(true);
    setNotice(null);
    requestAnimationFrame(() => {
      formRef.current?.focus({ preventScroll: true });
      formRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "instant",
      });
    });
  }
  function closeEditor() {
    setEditing(false);
    requestAnimationFrame(() =>
      editButtonRef.current?.focus({ preventScroll: true }),
    );
  }
  function toggleGoal(id: string) {
    setDraft((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );
  }
  function saveGoals(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving.current) return;
    try {
      const validated = setProjectLearningGoals(project, draft);
      const ids = [...(validated.learningGoalIds ?? [])];
      saving.current = true;
      update((previous) => ({
        ...previous,
        projects: previous.projects.map((entry) =>
          entry.id === project.id ? setProjectLearningGoals(entry, ids) : entry,
        ),
      }));
      setNotice({
        text: ids.length
          ? "Objectifs enregistrés."
          : "Objectifs retirés. Les apprentissages associés et le reste du projet sont conservés.",
        error: false,
      });
      closeEditor();
    } catch (cause) {
      saving.current = false;
      setNotice({
        text:
          cause instanceof Error
            ? cause.message
            : "Les objectifs n’ont pas pu être enregistrés.",
        error: true,
      });
    }
  }

  return (
    <section
      className={"project-learning-plan" + (hasGoals ? " has-goals" : "")}
      aria-label="Parcours d’apprentissage du projet"
    >
      <header className="project-plan-heading">
        <div>
          {!hasGoals && (
            <p className="eyebrow">LES NOTIONS QUI SERVENT VOTRE PROJET</p>
          )}
          <h3>
            {hasGoals ? "Votre parcours" : "Un parcours, à votre mesure."}
          </h3>
          {!hasGoals && (
            <p>
              Choisissez les notions utiles au projet ; leurs prérequis
              dessinent le parcours.
            </p>
          )}
        </div>
        <button
          ref={editButtonRef}
          className="button secondary"
          onClick={openEditor}
          aria-label={
            hasGoals ? "Modifier les objectifs" : "Choisir mes objectifs"
          }
          aria-expanded={editing}
          aria-controls="project-plan-editor"
        >
          {hasGoals ? "Modifier" : "Choisir mes objectifs"}
          <Icon name={hasGoals ? "settings" : "plus"} size={16} />
        </button>
      </header>

      {editing && (
        <form
          id="project-plan-editor"
          className="project-plan-editor"
          ref={formRef}
          tabIndex={-1}
          aria-label="Choisir les objectifs d’apprentissage"
          onSubmit={saveGoals}
        >
          <div className="project-plan-editor-heading">
            <div>
              <p className="eyebrow">CE QUE VOUS VOULEZ APPRENDRE</p>
              <h4>Choisir une destination.</h4>
            </div>
            <span>
              {draft.length} {plural(draft.length, "objectif", "objectifs")}
            </span>
          </div>
          <p>
            Sélectionnez les notions utiles à ce projet. Leurs prérequis sont
            ajoutés au parcours, sans modifier vos liens d’application.
          </p>
          <div className="project-plan-choices">
            {lessons.map((lesson) => (
              <label
                className="project-plan-choice"
                key={lesson.id}
                data-selected={draft.includes(lesson.id)}
              >
                <input
                  type="checkbox"
                  aria-label={"Objectif : " + lesson.title}
                  checked={draft.includes(lesson.id)}
                  onChange={() => toggleGoal(lesson.id)}
                />
                <span className="project-plan-choice-marker" aria-hidden="true">
                  {draft.includes(lesson.id) ? (
                    <Icon name="check" size={13} />
                  ) : null}
                </span>
                <span>
                  <strong>{lesson.title}</strong>
                  <small>
                    {lesson.domain} · {lesson.minutes} min
                    {lesson.prerequisites.length > 0 ? " · avec prérequis" : ""}
                  </small>
                </span>
              </label>
            ))}
          </div>
          {unknownDraft.length > 0 && (
            <div className="project-plan-unavailable-draft">
              <h5>Objectifs indisponibles dans ce catalogue</h5>
              <p>
                Leur identifiant est conservé tant que vous ne le retirez pas.
              </p>
              {unknownDraft.map((id) => (
                <div key={id}>
                  <code>{id}</code>
                  <button
                    className="text-button"
                    type="button"
                    aria-label={"Retirer l’objectif indisponible : " + id}
                    onClick={() =>
                      setDraft((current) =>
                        current.filter((entry) => entry !== id),
                      )
                    }
                  >
                    Retirer <Icon name="close" size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="project-plan-editor-actions">
            <button className="button primary" type="submit">
              Enregistrer les objectifs <Icon name="arrow" size={15} />
            </button>
            <button
              className="button secondary"
              type="button"
              onClick={closeEditor}
            >
              Annuler
            </button>
          </div>
          <p className="project-plan-editor-note">
            Un objectif n’est pas une compétence acquise. Enregistrer ce choix
            ne change ni les quiz, ni le stade du projet.
          </p>
        </form>
      )}

      {notice && (
        <p
          className={"project-plan-notice" + (notice.error ? " error" : "")}
          role={notice.error ? "alert" : "status"}
        >
          {notice.text}
        </p>
      )}

      {!hasGoals && !editing && (
        <div className="project-plan-empty">
          <div className="project-plan-empty-path" aria-hidden="true">
            <span>
              <Icon name="node" size={18} />
            </span>
            <i />
            <span />
            <i />
            <span />
          </div>
          <h3>Donnez un cap à votre apprentissage.</h3>
          <p>
            Aucune notion n’a encore été choisie comme objectif pour ce projet.
            Votre parcours apparaîtra ici, avec les prérequis et le prochain pas
            accessible.
          </p>
        </div>
      )}

      {hasGoals && (
        <>
          <div
            className="project-plan-summary"
            role="group"
            aria-label="Notions du parcours"
          >
            <div className="project-plan-count">
              <strong>{String(plan.passedCount).padStart(2, "0")}</strong>
              <span aria-hidden="true">/</span>
              <strong>{String(plan.steps.length).padStart(2, "0")}</strong>
              <span>
                {plural(
                  plan.passedCount,
                  "quiz courant validé",
                  "quiz courants validés",
                )}
              </span>
            </div>
            <p>
              <span>
                {plan.goalIds.length}{" "}
                {plural(plan.goalIds.length, "objectif", "objectifs")}
                {" · "}
                {plan.remainingMinutes} min restantes
              </span>
              <small>Durée indicative du contenu.</small>
            </p>
          </div>

          {plan.next ? (
            <div className="project-plan-next">
              <span className="project-plan-next-icon" aria-hidden="true">
                <Icon
                  name={plan.next.status === "revisit" ? "clock" : "book"}
                  size={23}
                />
              </span>
              <div>
                <p className="eyebrow">VOTRE PROCHAIN PAS</p>
                <h4>{plan.next.lesson.title}</h4>
                <p>
                  {plan.next.status === "revisit"
                    ? "Une notion à reprendre"
                    : plan.next.lesson.prerequisites.length === 0
                      ? "Aucun prérequis requis"
                      : "Prérequis validés au quiz"}
                  {" · "}
                  {plan.next.lesson.minutes} min
                </p>
              </div>
              <button
                className="button primary"
                aria-label={"Étudier : " + plan.next.lesson.title}
                onClick={() => onNavigate("lesson/" + plan.next!.lesson.id)}
              >
                Étudier <Icon name="arrow" size={16} />
              </button>
            </div>
          ) : plan.allCurrentQuizzesPassed ? (
            <div className="project-plan-complete" role="status">
              <span aria-hidden="true">
                <Icon name="check" size={22} />
              </span>
              <div>
                <h3>Quiz du parcours validés.</h3>
                <p>
                  Vos notions sont validées au quiz. Leur application au projet
                  et la validation du marché restent à éprouver.
                </p>
              </div>
            </div>
          ) : (
            <p className="project-plan-hold">
              Aucune prochaine notion accessible dans ce parcours pour le
              moment. Consultez les éléments indisponibles ci-dessous ou ajustez
              vos objectifs.
            </p>
          )}

          {hasIssues && (
            <div className="project-plan-issues">
              {plan.missingGoalIds.length > 0 && (
                <div>
                  <h4>Objectifs indisponibles</h4>
                  <p>
                    Ces identifiants sont conservés ; vous pouvez les retirer en
                    modifiant les objectifs.
                  </p>
                  <ul>
                    {plan.missingGoalIds.map((id) => (
                      <li key={id}>
                        <code>{id}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {plan.missingPrerequisiteIds.length > 0 && (
                <div>
                  <h4>Prérequis absents du catalogue</h4>
                  <ul>
                    {plan.missingPrerequisiteIds.map((id) => (
                      <li key={id}>
                        <code>{id}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {plan.cycleIds.length > 0 && (
                <div>
                  <h4>Parcours à clarifier</h4>
                  <p>
                    Ces notions se renvoient mutuellement leurs prérequis :{" "}
                    {plan.cycleIds.map(lessonTitle).join(" · ")}.
                  </p>
                </div>
              )}
            </div>
          )}

          {plan.steps.length > 0 && (
            <ol className="project-plan-steps" aria-label="Étapes du parcours">
              {plan.steps.map((step, index) => (
                <li key={step.lesson.id} data-status={step.status}>
                  <div className="project-plan-step-marker" aria-hidden="true">
                    {step.status === "passed" ? (
                      <Icon name="check" size={14} />
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </div>
                  <div className="project-plan-step-content">
                    <div className="project-plan-step-meta">
                      <span>
                        {step.isGoal
                          ? "Objectif choisi"
                          : "Prérequis du parcours"}
                      </span>
                      <span>
                        {step.lesson.domain} · {step.lesson.minutes} min
                      </span>
                    </div>
                    <h4>{step.lesson.title}</h4>
                    <p className="project-plan-step-state">
                      <Icon
                        name={
                          step.status === "passed"
                            ? "check"
                            : step.status === "blocked"
                              ? "lock"
                              : step.status === "revisit"
                                ? "clock"
                                : "book"
                        }
                        size={14}
                      />
                      {states[step.status]}
                    </p>
                    {step.latest && (
                      <p className="project-plan-step-evidence">
                        Dernier quiz courant : {step.latest.percent} % ·{" "}
                        {date.format(new Date(step.latest.at))} · version{" "}
                        {step.lesson.version}
                      </p>
                    )}
                    {step.unmetPrerequisiteIds.length > 0 && (
                      <p className="project-plan-step-dependencies">
                        {step.status === "passed"
                          ? "Prérequis à reprendre avant la suite : "
                          : "Avant cette notion : "}
                        {step.unmetPrerequisiteIds.map(lessonTitle).join(" · ")}
                        .
                      </p>
                    )}
                    {step.requiredBy.length > 1 && (
                      <small className="project-plan-shared">
                        Une même notion pour {step.requiredBy.length} objectifs.
                      </small>
                    )}
                  </div>
                  {step.status !== "blocked" && (
                    <button
                      className="text-button project-plan-step-action"
                      aria-label={"Ouvrir la leçon : " + step.lesson.title}
                      onClick={() => onNavigate("lesson/" + step.lesson.id)}
                    >
                      {step.status === "passed" ? "Revoir" : "Ouvrir"}
                      <Icon name="arrow" size={15} />
                    </button>
                  )}
                </li>
              ))}
            </ol>
          )}
        </>
      )}

      <section
        className="project-plan-associated"
        aria-label="Apprentissages associés"
      >
        <div className="project-plan-associated-heading">
          <h3>Apprentissages associés</h3>
          <span>{String(associated.length).padStart(2, "0")}</span>
        </div>
        <p>
          Ces liens viennent de vos applications dans les leçons. Ils restent
          distincts des objectifs à apprendre et ne valident pas un quiz.
        </p>
        {associated.length ? (
          <div className="project-plan-associated-list">
            {associated.map((id) => {
              const lesson = lessons.find((entry) => entry.id === id);
              return lesson ? (
                <button
                  key={id}
                  onClick={() => onNavigate("lesson/" + lesson.id)}
                >
                  <span>
                    <small>
                      {lesson.domain} · {lesson.minutes} min
                    </small>
                    <strong>{lesson.title}</strong>
                  </span>
                  <Icon name="arrow" size={16} />
                </button>
              ) : (
                <div key={id} className="project-plan-archived-link">
                  <small>Leçon indisponible dans ce catalogue</small>
                  <code>{id}</code>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="project-plan-associated-empty">
            Aucune leçon associée. Depuis « Apply » dans une leçon, reliez une
            application à ce projet.
          </p>
        )}
      </section>
      <p className="project-plan-footnote">
        Le parcours reflète vos choix et les quiz de la version courante. Il ne
        prédit ni la durée de réalisation du projet, ni sa réussite.
      </p>
    </section>
  );
}

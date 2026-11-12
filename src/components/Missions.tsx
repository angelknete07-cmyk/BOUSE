import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from "react";
import { catalogueSkill, quizTarget } from "../lib/catalogue";
import { MISSIONS, euro, type Mission } from "../data/missions";
import {
  completeStep,
  currentStepIndex,
  findMission,
  isFinished,
  missionDocument,
  missionMinutes,
  parseNumber,
  practicedSkills,
  restartMission,
  reviewPrompt,
  saveAnswers,
  stepLines,
  stepProblems,
} from "../lib/missions";
import { latestCurrentAttempt } from "../lib/portfolio";
import { downloadFile } from "../lib/storage";
import type { AppState, StateUpdater } from "../lib/types";

/**
 * Les missions réelles (maquette maquette/missions.html) : un vrai projet,
 * des missions qui remplissent un vrai dossier, visible en direct.
 */

type Props = {
  state: AppState;
  update: StateUpdater;
  onNavigate: (route: string) => void;
};

const duration = (minutes: number) =>
  minutes < 60
    ? `≈ ${minutes} min`
    : `≈ ${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${String(minutes % 60).padStart(2, "0")}` : ""}`;

function useFocusTitle(key: string) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, [key]);
  return ref;
}

/** Route « missions » : choisir un projet de sa vie. */
export function MissionList({ state, onNavigate }: Omit<Props, "update">) {
  const titleRef = useFocusTitle("missions");
  return (
    <div className="cat-page ms-page">
      <p className="eyebrow">Projets · Missions réelles</p>
      <h1 className="cat-title" ref={titleRef} tabIndex={-1}>
        Apprends en faisant ton vrai dossier
      </h1>
      <p className="cat-lead">
        Choisis un projet de ta vie. Chaque mission te fait remplir une partie
        d’un vrai document. À la fin, tu as appris <em>et</em> tu repars avec
        ton dossier prêt.
      </p>
      <ul className="ms-grid">
        {MISSIONS.map((mission) => {
          const record = state.missions?.[mission.id];
          const done = record?.done.length ?? 0;
          const finished = isFinished(mission, record);
          return (
            <li key={mission.id}>
              <button
                type="button"
                className="ms-card"
                onClick={() => onNavigate(`mission/${mission.id}`)}
              >
                <b>{mission.title}</b>
                <span className="ms-chips">
                  <span className="cat-tag">
                    {mission.steps.length} missions
                  </span>
                  <span className="cat-tag">
                    {duration(missionMinutes(mission))}
                  </span>
                  <span className="cat-tag">{mission.domains.join(" · ")}</span>
                </span>
                <span className="ms-out">
                  Tu repars avec : <strong>{mission.outcome}</strong>.
                </span>
                {record && (
                  <span className="ms-state" data-done={finished || undefined}>
                    {finished
                      ? "Dossier prêt"
                      : `En cours · ${done} / ${mission.steps.length}`}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="cat-note">
        Tes réponses restent enregistrées avec le reste de ta progression. Tu
        peux suivre plusieurs missions et revenir quand tu veux.
      </p>
    </div>
  );
}

/** Route « mission/<id> » : une mission en cours, ou le dossier prêt. */
export function MissionPage({
  id,
  state,
  update,
  onNavigate,
}: Props & { id: string }) {
  const mission = findMission(id);
  const record = mission ? state.missions?.[mission.id] : undefined;
  const [view, setView] = useState<number | "final">(() =>
    mission && isFinished(mission, record)
      ? "final"
      : mission
        ? currentStepIndex(mission, record)
        : 0,
  );
  const [draft, setDraft] = useState<Record<string, string>>(
    () => record?.answers ?? {},
  );
  const [tried, setTried] = useState(false);
  const [flash, setFlash] = useState(0);
  const titleRef = useFocusTitle(`${id}-${view}`);
  const pending = useRef<Record<string, string>>({});

  // Le brouillon s'enregistre un instant après la frappe.
  useEffect(() => {
    if (!mission || !Object.keys(pending.current).length) return;
    const timer = window.setTimeout(() => {
      const changes = pending.current;
      pending.current = {};
      update((s) => saveAnswers(s, mission.id, changes, new Date()));
    }, 400);
    return () => window.clearTimeout(timer);
  }, [draft]);

  if (!mission)
    return (
      <div className="empty-state">
        <h1>Mission introuvable.</h1>
        <button
          className="button primary"
          onClick={() => onNavigate("missions")}
        >
          Voir les missions
        </button>
      </div>
    );

  const done = record?.done ?? [];
  const go = (next: number | "final") => {
    setTried(false);
    setView(next);
    window.scrollTo({ top: 0 });
  };

  if (view === "final")
    return (
      <MissionFinal
        mission={mission}
        state={state}
        update={update}
        onNavigate={onNavigate}
        onEdit={(index) => go(index)}
        titleRef={titleRef}
      />
    );

  const step = mission.steps[view]!;
  const problems = stepProblems(step, draft);
  const reachable = (index: number) =>
    index <= currentStepIndex(mission, record) ||
    done.includes(mission.steps[index]!.id);

  function validate() {
    setTried(true);
    if (problems.length) return;
    pending.current = {};
    update((s) =>
      completeStep(
        saveAnswers(s, mission!.id, draft, new Date()),
        mission!.id,
        step.id,
        new Date(),
      ),
    );
    const after = mission!.steps.findIndex(
      (s, i) => i > (view as number) && !done.includes(s.id),
    );
    go(after === -1 ? "final" : after);
  }

  const passed = (skillId: string) => {
    const skill = catalogueSkill(skillId);
    if (!skill) return false;
    const target = quizTarget(skill.lesson ?? skill.id);
    return !!latestCurrentAttempt(target, state.attempts, new Date())?.passed;
  };

  return (
    <div className="cat-page ms-page">
      <p className="eyebrow">
        {mission.title} · mission {view + 1} sur {mission.steps.length}
      </p>
      <h1 className="cat-title" ref={titleRef} tabIndex={-1}>
        {step.title}
      </h1>
      <div className="ms-work">
        <ol className="ms-steps" aria-label="Les missions">
          {mission.steps.map((s, i) => {
            const isDone = done.includes(s.id);
            return (
              <li key={s.id} aria-current={i === view ? "step" : undefined}>
                <button
                  type="button"
                  disabled={!reachable(i)}
                  data-done={isDone || undefined}
                  onClick={() => go(i)}
                >
                  <span className="ms-dot" aria-hidden="true">
                    {isDone ? "✓" : i + 1}
                  </span>
                  <span>
                    {s.title}
                    <small>
                      {isDone ? "Fait" : i === view ? "En cours" : "À venir"} ·{" "}
                      {s.minutes} min
                    </small>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <section className="cat-card ms-form" aria-label="À remplir">
          <p className="ms-hint">{step.hint}</p>
          <div className="ms-fields">
            {step.fields.map((field) => {
              const value = draft[field.id] ?? "";
              const common = {
                value,
                placeholder: `Ex. : ${field.example}`,
                onChange: (
                  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
                ) => {
                  const next = e.target.value;
                  pending.current[field.id] = next;
                  setDraft((d) => ({ ...d, [field.id]: next }));
                  setFlash((n) => n + 1);
                },
              };
              return (
                <label key={field.id} data-inline={field.inline || undefined}>
                  <span>
                    {field.label}
                    {field.kind === "money" ? " (€)" : ""}
                    {field.optional ? " · facultatif" : ""}
                  </span>
                  {field.kind === "long" ? (
                    <textarea rows={3} {...common} />
                  ) : (
                    <input
                      {...common}
                      inputMode={
                        field.kind === "money" || field.kind === "number"
                          ? "decimal"
                          : undefined
                      }
                    />
                  )}
                </label>
              );
            })}
          </div>
          <div className="ms-uses">
            <span>Compétences utilisées :</span>
            {step.uses.map((skillId) => (
              <button
                type="button"
                key={skillId}
                className="ms-use"
                data-ok={passed(skillId) || undefined}
                onClick={() => onNavigate(`skill/${skillId}`)}
              >
                {catalogueSkill(skillId)?.title}
                {passed(skillId) ? " ✓" : ""}
              </button>
            ))}
          </div>
          {tried && problems.length > 0 && (
            <ul className="ms-problems" role="alert">
              {problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
          <div className="cat-actions">
            <button type="button" className="button primary" onClick={validate}>
              {done.includes(step.id) ? "Enregistrer" : "Valider la mission"} →
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => onNavigate(`skill/${step.uses[0]}`)}
            >
              Revoir la compétence
            </button>
          </div>
        </section>
        <Dossier
          mission={mission}
          answers={draft}
          done={done}
          live={step.id}
          flash={flash}
        />
      </div>
      {mission.caution && <p className="cat-note">{mission.caution}</p>}
    </div>
  );
}

/** Le dossier, comme une feuille, qui se remplit en direct. */
function Dossier({
  mission,
  answers,
  done,
  live,
  flash,
}: {
  mission: Mission;
  answers: Record<string, string>;
  done: string[];
  live?: string;
  flash?: number;
}) {
  return (
    <aside className="ms-paper" aria-label="Ton dossier, en direct">
      <h2>Dossier · {mission.title}</h2>
      {mission.steps.map((step, i) => {
        const shown = done.includes(step.id) || step.id === live;
        if (!shown)
          return (
            <div key={step.id} className="ms-sec" data-todo="">
              {i + 1}. {step.title} — à venir
            </div>
          );
        const lines = stepLines(mission, step, answers);
        return (
          <div
            key={step.id === live ? `${step.id}-${flash ?? 0}` : step.id}
            className="ms-sec"
            data-live={step.id === live && flash ? "" : undefined}
          >
            <b>
              {i + 1}. {step.title}
            </b>
            <table>
              <tbody>
                {step.fields.map((field) => {
                  const value = answers[field.id]?.trim();
                  if (!value) return null;
                  return (
                    <tr key={field.id}>
                      <td>{field.label}</td>
                      <td>
                        {field.kind === "money"
                          ? euro(parseNumber(value))
                          : value}
                      </td>
                    </tr>
                  );
                })}
                {lines.map((line) => (
                  <tr key={line.label} className="ms-total">
                    <td>{line.label}</td>
                    <td>{line.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
      <small>
        Document d’apprentissage, à vérifier avant tout usage officiel.
      </small>
    </aside>
  );
}

function MissionFinal({
  mission,
  state,
  update,
  onNavigate,
  onEdit,
  titleRef,
}: Props & {
  mission: Mission;
  onEdit: (index: number) => void;
  titleRef: RefObject<HTMLHeadingElement | null>;
}) {
  const record = state.missions?.[mission.id];
  const [copied, setCopied] = useState<"idle" | "copied" | "manual">("idle");
  const [confirm, setConfirm] = useState(false);
  const practiced = practicedSkills(state);
  const used = [...new Set(mission.steps.flatMap((s) => s.uses))].filter((s) =>
    practiced.has(s),
  );
  const prompt = reviewPrompt(mission, record);

  async function review() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied("copied");
    } catch {
      setCopied("manual");
    }
    window.open("https://claude.ai/new", "_blank", "noopener,noreferrer");
  }

  return (
    <div className="cat-page ms-page">
      <p className="eyebrow">{mission.title} · terminé</p>
      <h1 className="cat-title" ref={titleRef} tabIndex={-1}>
        Ton dossier est prêt
      </h1>
      <p className="cat-lead">
        {mission.steps.length} missions faites. Voilà ce que tu as construit et
        ce que tu sais faire maintenant.
      </p>
      <div className="ms-final">
        <section className="cat-card">
          <h2 className="sp-sub">Ce que tu repars avec</h2>
          <ul className="ms-check">
            {mission.steps.map((step, i) => (
              <li key={step.id}>
                <span>{step.title}</span>
                <button
                  type="button"
                  className="text-button inline"
                  onClick={() => onEdit(i)}
                >
                  Modifier
                </button>
              </li>
            ))}
          </ul>
          <div className="cat-actions">
            <button
              type="button"
              className="button primary"
              onClick={() =>
                downloadFile(
                  `dossier-${mission.id}.md`,
                  missionDocument(mission, record),
                  "text/markdown",
                )
              }
            >
              Télécharger mon dossier
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => void review()}
            >
              Le faire relire par mon Claude
            </button>
          </div>
          <p className="cat-note">
            « Le faire relire » copie ton dossier avec une consigne de relecture
            et ouvre claude.ai : tu colles et tu envoies avec ton abonnement.
            BOUSE n’envoie rien lui-même.
          </p>
          {copied === "copied" && (
            <p className="cat-note" role="status">
              Copié. Colle-le dans la nouvelle conversation Claude.
            </p>
          )}
          {copied === "manual" && (
            <label className="field">
              Copie refusée par le navigateur : sélectionne ce texte
              <textarea readOnly rows={6} value={prompt} />
            </label>
          )}
        </section>
        <section className="cat-card">
          <h2 className="sp-sub">Dans ton arbre</h2>
          <p>
            Les {used.length} compétences utilisées sont marquées{" "}
            <b>« mise en pratique »</b> :
          </p>
          <div className="ms-uses">
            {used.map((skillId) => (
              <button
                type="button"
                key={skillId}
                className="ms-use"
                data-ok=""
                onClick={() => onNavigate(`skill/${skillId}`)}
              >
                {catalogueSkill(skillId)?.title}
              </button>
            ))}
          </div>
          <p className="cat-note">
            Le contrôle d’une compétence reste sa preuve ; la mission ajoute «
            je l’ai fait pour de vrai ». Les deux se voient dans l’arbre.
          </p>
          <div className="cat-actions">
            <button
              type="button"
              className="button secondary"
              onClick={() => onNavigate("missions")}
            >
              Une autre mission
            </button>
            {!confirm ? (
              <button
                type="button"
                className="text-button"
                onClick={() => setConfirm(true)}
              >
                Recommencer cette mission
              </button>
            ) : (
              <span className="ms-confirm" role="group" aria-label="Confirmer">
                Effacer les réponses de cette mission ?
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => {
                    update((s) => restartMission(s, mission.id));
                    onNavigate("missions");
                  }}
                >
                  Oui, effacer
                </button>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setConfirm(false)}
                >
                  Non
                </button>
              </span>
            )}
          </div>
        </section>
        <Dossier
          mission={mission}
          answers={record?.answers ?? {}}
          done={record?.done ?? []}
        />
      </div>
    </div>
  );
}

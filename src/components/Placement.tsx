import { useEffect, useRef, useState } from "react";
import {
  CATALOGUE_SKILLS,
  LEVEL_NAMES,
  type CatalogueLevel,
  type CatalogueSkill,
} from "../data/catalogue";
import { lessons } from "../data/lessons";
import { loadSkillContent } from "../data/skills";
import { catalogueDomain, isReady } from "../lib/catalogue";
import {
  levelName,
  placementOver,
  placementRecord,
  placementResult,
  placementSkills,
  type PlacementAnswer,
  type PlacementQuestion,
} from "../lib/placement";
import type { AppState, StateUpdater } from "../lib/types";
import { Missing, skillRoute, useStatuses } from "./Catalogue";

type Props = {
  id: string;
  state: AppState;
  update: StateUpdater;
  onNavigate: (route: string) => void;
};

/** La première question du quiz de la leçon, ou du contrôle de la compétence. */
async function questionFor(
  skill: CatalogueSkill,
): Promise<PlacementQuestion | undefined> {
  if (skill.lesson) {
    const q = lessons.find((l) => l.id === skill.lesson)?.quiz[0];
    return q
      ? {
          skillId: skill.id,
          level: skill.level,
          question: q.question,
          options: q.options,
          answer: q.answer,
        }
      : undefined;
  }
  const content = await loadSkillContent(skill.domain, skill.id).catch(
    () => undefined,
  );
  const q = content?.check[0];
  return q
    ? {
        skillId: skill.id,
        level: skill.level,
        question: q.q,
        options: q.options,
        answer: q.answer,
      }
    : undefined;
}

/** Espace insécable devant ? ! : ; » et après « (pas de signe seul en fin de ligne). */
const fr = (text: string) =>
  text.replace(/ ([?!:;»])/g, " $1").replace(/« /g, "« ");
const LETTERS = "ABCDEF";
const SHOWN = 4;

/** Route « placement/<domaine> » : le test de niveau (idée 16). */
export function Placement({ id, state, update, onNavigate }: Props) {
  const domain = catalogueDomain(id);
  const statuses = useStatuses(state);
  const [questions, setQuestions] = useState<PlacementQuestion[] | null>();
  const [answers, setAnswers] = useState<PlacementAnswer[]>([]);
  const [run, setRun] = useState(0);
  const saved = useRef(-1);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let live = true;
    Promise.all(placementSkills(id, isReady).map(questionFor)).then((list) => {
      if (!live) return;
      const found = list.filter((q): q is PlacementQuestion => !!q);
      setQuestions(found.length ? found : null);
    });
    return () => {
      live = false;
    };
  }, [id]);

  const over = !!questions && placementOver(questions, answers);

  // Enregistré une seule fois, à la fin du test (rien avant).
  useEffect(() => {
    if (!questions || !over || saved.current === run) return;
    saved.current = run;
    const record = placementRecord(
      placementResult(questions, answers),
      new Date(),
    );
    update((s) => ({
      ...s,
      placements: { ...(s.placements ?? {}), [id]: record },
    }));
  }, [over, questions, answers, run, id, update]);

  useEffect(() => {
    const target = over ? resultRef.current : questionRef.current;
    target?.focus({ preventScroll: true });
    if (answers.length || over) target?.scrollIntoView({ block: "nearest" });
  }, [answers.length, over]);

  if (!domain) return <Missing onNavigate={onNavigate} />;
  if (questions === undefined)
    return (
      <p className="page-loading" role="status">
        Chargement…
      </p>
    );
  if (questions === null)
    return (
      <div className="cat-page">
        <p className="cat-card">
          Le test de ce domaine n’a pas pu se charger. Réessaie plus tard ; ta
          progression n’est pas touchée.
        </p>
      </div>
    );

  const levels = [...new Set(questions.map((q) => q.level))].sort();
  const back = () => onNavigate(`domain/${id}`);

  if (!over) {
    const index = answers.length;
    const q = questions[index]!;
    const skill = CATALOGUE_SKILLS.find((s) => s.id === q.skillId)!;
    const answer = (value: PlacementAnswer) =>
      setAnswers((list) => [...list, value]);
    return (
      <div className="cat-page pl-page">
        <p className="eyebrow">Test de niveau · {domain.name}</p>
        <section className="pl-card" aria-labelledby="pl-question" key={index}>
          <div className="pl-top">
            <p className="eyebrow">
              Niveau {q.level + 1} · {LEVEL_NAMES[q.level]}
            </p>
            <span className="pl-count">Question {index + 1}</span>
          </div>
          <div
            className="pl-ladder"
            role="img"
            aria-label={`Niveau ${levels.indexOf(q.level) + 1} sur ${levels.length}`}
          >
            {levels.map((level) => (
              <span
                key={level}
                data-s={
                  level < q.level
                    ? "past"
                    : level === q.level
                      ? "on"
                      : undefined
                }
              />
            ))}
          </div>
          <p className="pl-skill">Compétence · {skill.title}</p>
          <h1 className="pl-q" id="pl-question" ref={questionRef} tabIndex={-1}>
            {fr(q.question)}
          </h1>
          <div className="pl-opts">
            {q.options.map((option, o) => (
              <button
                type="button"
                className="pl-opt"
                key={option}
                onClick={() => answer(o)}
              >
                <span className="pl-k" aria-hidden="true">
                  {LETTERS[o]}
                </span>
                <span>{fr(option)}</span>
              </button>
            ))}
            <button
              type="button"
              className="pl-opt is-idk"
              onClick={() => answer(null)}
            >
              <span className="pl-k" aria-hidden="true">
                ?
              </span>
              <span>Je ne sais pas</span>
            </button>
          </div>
          <p className="pl-hint">
            Pas de piège : si tu ne sais pas, dis-le. Ça évite de sauter une
            compétence que tu n’as pas.
          </p>
        </section>
        <div className="pl-row">
          <button type="button" className="button secondary" onClick={back}>
            Arrêter
          </button>
          <span className="pl-muted">Rien n’est enregistré avant la fin.</span>
        </div>
      </div>
    );
  }

  const result = placementResult(questions, answers);
  const known = new Set(result.known);
  const missed = new Set(result.missed);
  const order = questions
    .map((q) => CATALOGUE_SKILLS.find((s) => s.id === q.skillId)!)
    .filter((s) => !known.has(s.id) && statuses[s.id] !== "done");
  const first = order[0];
  const stoppedAt = questions[result.asked - 1]?.level;
  const knownSkills = result.known.map((sid) =>
    CATALOGUE_SKILLS.find((s) => s.id === sid)!,
  );
  const prove = (skill: CatalogueSkill) =>
    skill.lesson ? `lesson/${skill.lesson}/quiz` : `skill/${skill.id}/check`;

  return (
    <div className="cat-page pl-page">
      <p className="eyebrow">Test de niveau · {domain.name}</p>
      <section className="pl-card pl-result" aria-labelledby="pl-start">
        <div className="pl-result-head">
          <div>
            <p className="eyebrow">Ton point de départ</p>
            <h1 id="pl-start" ref={resultRef} tabIndex={-1}>
              {levelName(result.startLevel)}
            </h1>
            <p>
              Tu as répondu juste à <b>{result.correct}</b>{" "}
              {result.asked > 1 ? "questions" : "question"} sur {result.asked}.{" "}
              {result.untested.length && stoppedAt !== undefined
                ? `Le test s’est arrêté au niveau ${stoppedAt + 1}, quand deux réponses ont manqué.`
                : result.startLevel === null
                  ? "Tout le domaine est déjà su : valide les compétences quand tu veux."
                  : "Toutes les questions du domaine ont été posées."}
            </p>
          </div>
          {first ? (
            <button
              type="button"
              className="button primary"
              onClick={() => onNavigate(skillRoute(first))}
            >
              Commencer par «&nbsp;{first.title}&nbsp;» →
            </button>
          ) : (
            <button type="button" className="button primary" onClick={back}>
              Voir le domaine →
            </button>
          )}
        </div>
        <ol className="pl-scale" aria-label="Ton niveau dans ce domaine">
          {levels.map((level) => {
            const state =
              result.startLevel === null || level < result.startLevel
                ? "got"
                : level === result.startLevel
                  ? "here"
                  : undefined;
            return (
              <li key={level} data-s={state}>
                {LEVEL_NAMES[level as CatalogueLevel]}
                {state === "got"
                  ? " · su"
                  : state === "here"
                    ? " · en cours"
                    : ""}
              </li>
            );
          })}
        </ol>
      </section>

      <div className="pl-cols">
        <section className="pl-card" aria-labelledby="pl-known">
          <h2 id="pl-known">Déjà su · sauté</h2>
          <p className="pl-muted">
            {knownSkills.length
              ? "On ne te les propose plus. Pour les valider dans l’arbre, fais leur contrôle complet (1 min)."
              : "Aucune pour l’instant : tout le domaine est à apprendre, dans l’ordre."}
          </p>
          {knownSkills.length > 0 && (
            <ul className="pl-list">
              {knownSkills.map((skill) => (
                <li key={skill.id}>
                  <span className="pl-dot is-known" aria-hidden="true" />
                  <b>{skill.title}</b>
                  {statuses[skill.id] === "done" ? (
                    <span className="pl-muted">Validée</span>
                  ) : (
                    <button
                      type="button"
                      className="pl-link"
                      onClick={() => onNavigate(prove(skill))}
                      aria-label={`Valider ${skill.title}`}
                    >
                      Valider
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="pl-card" aria-labelledby="pl-todo">
          <h2 id="pl-todo">À apprendre</h2>
          <p className="pl-muted">
            {order.length
              ? "Ta suite dans ce domaine, dans l’ordre."
              : "Rien : tout est su ou validé."}
          </p>
          {order.length > 0 && (
            <ul className="pl-list">
              {order.slice(0, SHOWN).map((skill, i) => (
                <li key={skill.id}>
                  <span
                    className={`pl-dot${i === 0 ? " is-next" : ""}`}
                    aria-hidden="true"
                  />
                  <b>{skill.title}</b>
                  <span className="pl-muted">
                    {missed.has(skill.id) ? "raté" : "pas testé"}
                  </span>
                </li>
              ))}
              {order.length > SHOWN && (
                <li>
                  <span className="pl-dot" aria-hidden="true" />
                  <b>
                    … et {order.length - SHOWN}{" "}
                    {order.length - SHOWN > 1 ? "autres" : "autre"}
                  </b>
                  <span />
                </li>
              )}
            </ul>
          )}
        </section>
      </div>
      <div className="pl-row">
        <button
          type="button"
          className="button secondary"
          onClick={() => {
            setRun((n) => n + 1);
            setAnswers([]);
          }}
        >
          Refaire le test
        </button>
        <button type="button" className="text-button" onClick={back}>
          Retour au domaine
        </button>
      </div>
      <p className="pl-note">
        Une bonne réponse au test ne valide pas une compétence : elle la saute
        seulement dans ta suite. Seul le contrôle complet la valide. Dans
        l’arbre, les compétences « déjà sues » ont un contour en pointillés.
      </p>
    </div>
  );
}

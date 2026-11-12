import { useEffect, useRef, useState } from "react";
import type { CatalogueSkill } from "../data/catalogue";
import { loadSkillContent } from "../data/skills";
import type { SkillContent } from "../data/skills/types";
import { SKILL_VERSION, type SkillStatus } from "../lib/catalogue";
import { downloadFile } from "../lib/storage";
import type { StateUpdater } from "../lib/types";

/**
 * Une compétence courte du catalogue, en trois temps : l'idée, le geste (un
 * vrai modèle à remplir et à garder), le contrôle (trois questions). Trois
 * bonnes réponses la valident dans l'arbre.
 */

const STEPS = [
  ["1. L’idée", "2 min · ce qu’il faut comprendre"],
  ["2. Le geste", "6 min · ton modèle à remplir"],
  ["3. Le contrôle", "2 min · trois questions"],
] as const;

export function SkillPractice({
  skill,
  status,
  update,
  startOnCheck = false,
}: {
  skill: CatalogueSkill;
  status: SkillStatus;
  update: StateUpdater;
  /** Ouvrir directement le contrôle (depuis « Mes pièges »). */
  startOnCheck?: boolean;
}) {
  const [content, setContent] = useState<SkillContent | null | undefined>();
  const [step, setStep] = useState(startOnCheck ? 2 : 0);
  const [values, setValues] = useState<Record<number, string>>({});
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (startOnCheck && content)
      panelRef.current?.scrollIntoView({ block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!content]);

  useEffect(() => {
    let live = true;
    loadSkillContent(skill.domain, skill.id).then(
      (found) => live && setContent(found ?? null),
      () => live && setContent(null),
    );
    return () => {
      live = false;
    };
  }, [skill.domain, skill.id]);

  // Passer d'un temps à l'autre amène le clavier et la vue sur le nouveau.
  useEffect(() => {
    if (!moved.current) return;
    panelRef.current?.focus({ preventScroll: true });
    panelRef.current?.scrollIntoView({ block: "nearest" });
  }, [step]);
  const go = (next: number) => {
    moved.current = true;
    setStep(next);
  };

  if (content === undefined)
    return (
      <p className="page-loading" role="status">
        Chargement…
      </p>
    );
  if (content === null)
    return (
      <p className="cat-card">
        Le contenu de cette compétence n’a pas pu se charger. Réessaie plus tard
        ; ta progression n’est pas touchée.
      </p>
    );

  const correct = content.check.filter(
    (q, i) => answers[i] === q.answer,
  ).length;
  const total = content.check.length;
  const complete = Object.keys(answers).length === total;

  function verify() {
    setChecked(true);
    const percent = Math.round((correct / total) * 100);
    update((s) => ({
      ...s,
      attempts: [
        ...s.attempts,
        {
          lessonId: skill.id,
          lessonVersion: SKILL_VERSION,
          answers: Object.fromEntries(
            Object.entries(answers).map(([i, v]) => [`q${i}`, v]),
          ),
          correct,
          total,
          percent,
          passed: correct / total >= 0.8,
          at: new Date().toISOString(),
        },
      ],
    }));
  }

  function keep() {
    const lines = [
      skill.title,
      "",
      ...content!.gesture.fields.map(
        (field, i) => `${field.label} : ${values[i]?.trim() || "…"}`,
      ),
      "",
      "Fait avec BOUSE — Académie business & IA.",
    ];
    downloadFile(`${skill.id}.txt`, lines.join("\n"), "text/plain");
  }

  return (
    <div className="sp">
      <ol className="cat-steps sp-steps" aria-label="Les trois temps">
        {STEPS.map(([title, sub], i) => (
          <li key={title} aria-current={i === step ? "step" : undefined}>
            <button type="button" onClick={() => go(i)}>
              <b>{title}</b>
              <small>{sub}</small>
            </button>
          </li>
        ))}
      </ol>
      <div
        className="cat-card sp-panel"
        ref={panelRef}
        tabIndex={-1}
        aria-label={STEPS[step]![0]}
        role="region"
        key={step}
      >
        {step === 0 && (
          <>
            {content.idea.map((text) => (
              <p className="sp-idea" key={text}>
                {text}
              </p>
            ))}
            <h2 className="sp-sub">À retenir</h2>
            <ul className="sp-keys">
              {content.keys.map((key) => (
                <li key={key}>{key}</li>
              ))}
            </ul>
            <div className="cat-actions">
              <button
                type="button"
                className="button primary"
                onClick={() => go(1)}
              >
                Passer au geste →
              </button>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <p className="sp-idea">{content.gesture.intro}</p>
            <div className="sp-form">
              {content.gesture.fields.map((field, i) => (
                <label key={field.label}>
                  {field.label}
                  <input
                    value={values[i] ?? ""}
                    placeholder={`Ex. : ${field.example}`}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [i]: e.target.value }))
                    }
                  />
                </label>
              ))}
            </div>
            {content.gesture.tip && (
              <p className="sp-tip">
                <b>Conseil</b> {content.gesture.tip}
              </p>
            )}
            <div className="cat-actions">
              <button
                type="button"
                className="button primary"
                onClick={() => go(2)}
              >
                Passer au contrôle →
              </button>
              <button type="button" className="button secondary" onClick={keep}>
                Garder mon modèle (texte)
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            {content.check.map((question, i) => {
              const picked = answers[i];
              const right = picked === question.answer;
              return (
                <fieldset
                  className="sp-q"
                  key={question.q}
                  data-result={checked ? (right ? "ok" : "ko") : undefined}
                >
                  <legend>
                    {i + 1}. {question.q}
                  </legend>
                  {question.options.map((option, o) => (
                    <label key={option}>
                      <input
                        type="radio"
                        name={`${skill.id}-q${i}`}
                        checked={picked === o}
                        onChange={() => {
                          setChecked(false);
                          setAnswers((a) => ({ ...a, [i]: o }));
                        }}
                      />
                      {option}
                    </label>
                  ))}
                  {checked && (
                    <p className="sp-why">
                      <b>{right ? "Juste." : "Pas tout à fait."}</b>{" "}
                      {question.why}
                    </p>
                  )}
                </fieldset>
              );
            })}
            <div className="cat-actions">
              <button
                type="button"
                className="button primary"
                disabled={!complete}
                onClick={verify}
              >
                Vérifier mes réponses
              </button>
            </div>
            <p className="sp-result" role="status">
              {checked
                ? correct === total
                  ? `${correct}/${total} · Compétence validée : elle s’allume dans l’arbre.`
                  : `${correct}/${total} · Relis l’explication et réessaie : il faut les trois.`
                : status === "done"
                  ? "Déjà validée. Tu peux refaire le contrôle quand tu veux."
                  : complete
                    ? ""
                    : "Réponds aux trois questions, puis vérifie."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

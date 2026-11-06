import { useState } from "react";
import { glossary } from "../data/investingGlossary";
import { lessons, type Lesson } from "../data/lessons";
import { verificationStatus } from "../data/lessonVerification";
import { practiceQuestions } from "../lib/practice";
import { practicalSheets } from "../lib/practicalSheets";
import { downloadFile } from "../lib/storage";
import { Icon } from "./Icon";

/** « Règles vérifiées en novembre 2026 », and a warning after a year. */
export function VerificationBadge({ lessonId }: { lessonId: string }) {
  const status = verificationStatus(lessonId, new Date());
  if (!status) return null;
  return (
    <span
      className={`lesson-verified ${status.stale ? "is-stale" : ""}`}
      title={
        status.stale
          ? "Plus d’un an : seuils et taux ont pu changer avec une nouvelle loi de finances."
          : "Seuils, taux et calendriers vérifiés à cette date sur des sources concordantes."
      }
    >
      {status.stale
        ? `Règles vérifiées en ${status.label} · à revérifier`
        : `Règles vérifiées en ${status.label}`}
    </span>
  );
}

/**
 * Free practice from the lexicon. It records nothing: a validated quiz can
 * never become « à revoir » because of it.
 */
export function PracticeDrill({ lesson }: { lesson: Lesson }) {
  const [seed, setSeed] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const related = lessons
    .filter((item) => item.domain === lesson.domain)
    .map((item) => item.id);
  const questions = practiceQuestions(lesson.id, related, glossary, seed);
  const answered = questions.filter((q) => answers[q.id] !== undefined);
  const right = answered.filter((q) => answers[q.id] === q.answer).length;
  if (questions.length < 2) return null;
  return (
    <section className="practice-drill" aria-labelledby="practice-drill-title">
      <div className="practice-drill-heading">
        <div>
          <span className="eyebrow">ENTRAÎNEMENT LIBRE</span>
          <h3 id="practice-drill-title">Quel terme correspond ?</h3>
        </div>
        <small>Rien n’est enregistré : vos quiz validés ne changent pas.</small>
      </div>
      <ol>
        {questions.map((question, index) => {
          const choice = answers[question.id];
          return (
            <li key={question.id}>
              <p>
                <span aria-hidden="true">{index + 1}. </span>
                {question.definition}
              </p>
              <div role="group" aria-label={`Question ${index + 1}`}>
                {question.options.map((option, optionIndex) => (
                  <button
                    key={option}
                    type="button"
                    disabled={choice !== undefined}
                    aria-pressed={choice === optionIndex}
                    className={
                      choice === undefined
                        ? ""
                        : optionIndex === question.answer
                          ? "is-right"
                          : choice === optionIndex
                            ? "is-wrong"
                            : ""
                    }
                    onClick={() =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: optionIndex,
                      }))
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
              {choice !== undefined && (
                <small role="status">
                  {choice === question.answer
                    ? "Bien vu."
                    : `La réponse : ${question.options[question.answer]}.`}
                </small>
              )}
            </li>
          );
        })}
      </ol>
      <div className="practice-drill-foot">
        <span aria-live="polite">
          {answered.length === questions.length
            ? `${right} / ${questions.length} · ${right === questions.length ? "parfait." : "une nouvelle série pour consolider ?"}`
            : `${answered.length} / ${questions.length} répondues`}
        </span>
        <button
          type="button"
          className="button secondary"
          onClick={() => {
            setSeed((value) => value + 1);
            setAnswers({});
          }}
        >
          Nouvelle série <Icon name="arrow" size={15} />
        </button>
      </div>
    </section>
  );
}

/** A checklist, template or spreadsheet to keep, when the lesson has one. */
export function PracticalSheetButton({ lessonId }: { lessonId: string }) {
  const sheet = practicalSheets[lessonId];
  const [done, setDone] = useState(false);
  if (!sheet) return null;
  return (
    <div className="practical-sheet">
      <div>
        <span className="eyebrow">FICHE PRATIQUE</span>
        <strong>{sheet.title}</strong>
        <small>
          {sheet.filename.endsWith(".csv")
            ? "Tableau à ouvrir dans un tableur."
            : "Document Markdown, lisible partout."}
        </small>
      </div>
      <button
        type="button"
        className="button secondary"
        onClick={() => {
          downloadFile(sheet.filename, sheet.content, sheet.mime);
          setDone(true);
        }}
      >
        Télécharger <Icon name="external" size={15} />
      </button>
      {done && (
        <small role="status" className="practical-sheet-done">
          Fichier préparé : {sheet.filename}.
        </small>
      )}
    </div>
  );
}

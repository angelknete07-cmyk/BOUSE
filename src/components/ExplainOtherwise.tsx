import { useState } from "react";
import type { Lesson } from "../data/lessons";
import {
  EXPLAIN_MODES,
  explainContext,
  explainHandoff,
  explainQuestion,
  type ExplainMode,
} from "../lib/explainOtherwise";
import { askMentor, mentorAvailability, type MentorAvailability } from "../lib/mentor";

/**
 * Idée 17 : sous chaque partie d'une leçon, « Pas clair ? Explique-moi
 * autrement » : une image, un exemple, ou plus simple. Le mentor répond ici
 * (compte connecté) ; sinon, la demande part dans ta propre conversation Claude.
 */
export function ExplainOtherwise({
  lesson,
  sectionIndex,
  onNavigate,
}: {
  lesson: Lesson;
  sectionIndex: number;
  onNavigate: (route: string) => void;
}) {
  const [mode, setMode] = useState<ExplainMode | null>(null);
  const [availability, setAvailability] = useState<MentorAvailability | null>(null);
  const [pending, setPending] = useState(false);
  const [answer, setAnswer] = useState<{ mode: ExplainMode; text: string; truncated: boolean } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"idle" | "copied" | "manual">("idle");

  async function choose(next: ExplainMode) {
    setMode(next);
    setError("");
    setCopied("idle");
    const state = availability ?? (await mentorAvailability());
    setAvailability(state);
    if (state !== "ready") return;
    setPending(true);
    try {
      const response = await askMentor({
        lessonId: lesson.id,
        question: explainQuestion(lesson, sectionIndex, next),
        history: [],
        context: explainContext(lesson, sectionIndex),
      });
      setAnswer({ mode: next, text: response.answer, truncated: response.truncated });
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Le mentor est indisponible.");
    } finally {
      setPending(false);
    }
  }

  async function handOff() {
    if (!mode) return;
    try {
      await navigator.clipboard.writeText(explainHandoff(lesson, sectionIndex, mode));
      setCopied("copied");
    } catch {
      setCopied("manual");
    }
    window.open("https://claude.ai/new", "_blank", "noopener,noreferrer");
  }

  const chosen = EXPLAIN_MODES.find((m) => m.id === mode);
  return (
    <section className="xo" aria-label="Explique-moi autrement">
      <div className="xo-ask">
        <p>
          <span>Pas clair ?</span> Explique-moi autrement :
        </p>
        <div className="xo-modes" role="group" aria-label="Façon d’expliquer">
          {EXPLAIN_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className="xo-mode"
              aria-pressed={mode === m.id}
              disabled={pending}
              title={m.hint}
              onClick={() => void choose(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode && pending && (
        <p className="xo-wait" role="status">
          Le mentor cherche {chosen?.hint}…
        </p>
      )}

      {mode && !pending && availability === "ready" && answer && (
        <article className="xo-answer" key={answer.mode + answer.text.length}>
          <span className="xo-badge">
            {EXPLAIN_MODES.find((m) => m.id === answer.mode)?.label} · brouillon du mentor, non vérifié
          </span>
          {answer.text.split(/\n{2,}/).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          {answer.truncated && <small>Réponse coupée par la limite de longueur.</small>}
        </article>
      )}

      {mode && !pending && error && (
        <p className="xo-note" role="alert">
          {error}
        </p>
      )}

      {mode && !pending && availability && availability !== "ready" && (
        <div className="xo-off">
          <p>
            {availability === "signed-out"
              ? "Le mentor de BOOST répond quand tu es connecté à ton compte."
              : "Le mentor de BOOST n’est pas branché sur cette installation."}{" "}
            Tu peux aussi demander à ton propre Claude : la demande « {chosen?.label.toLowerCase()} » et
            le passage de la leçon sont copiés, tu n’as qu’à coller.
          </p>
          <div className="xo-actions">
            <button type="button" className="button secondary" onClick={() => void handOff()}>
              Copier et demander à mon Claude
            </button>
            {availability === "signed-out" && (
              <button type="button" className="text-button" onClick={() => onNavigate("settings")}>
                Me connecter
              </button>
            )}
          </div>
          {copied === "copied" && (
            <small role="status">Copié. Colle dans la nouvelle conversation Claude.</small>
          )}
          {copied === "manual" && (
            <label className="field">
              Copie refusée par le navigateur : sélectionne ce texte
              <textarea readOnly rows={6} value={explainHandoff(lesson, sectionIndex, mode)} />
            </label>
          )}
        </div>
      )}
    </section>
  );
}

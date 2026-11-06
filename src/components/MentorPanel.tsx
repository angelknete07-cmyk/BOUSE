import { useEffect, useState, type FormEvent } from "react";
import type { Lesson } from "../data/lessons";
import {
  askMentor,
  mentorAvailability,
  type MentorAvailability,
} from "../lib/mentor";
import { claudeHandoffPrompt, lessonContext } from "../lib/mentorContext";
import {
  mentorLimits,
  type MentorCitation,
  type MentorTurn,
} from "../../supabase/functions/_shared/mentorContract.ts";

type Exchange = {
  question: string;
  answer: string;
  citations: MentorCitation[];
  truncated: boolean;
};

/**
 * Questions about the open lesson. No simulated answer: without a configured
 * backend and a signed-in person, the panel says so. Exchanges live only for
 * this session and are never stored.
 */
function IntegratedMentor({
  lesson,
  onNavigate,
}: {
  lesson: Lesson;
  onNavigate: (route: string) => void;
}) {
  const [availability, setAvailability] = useState<MentorAvailability | null>(
    null,
  );
  const [question, setQuestion] = useState("");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void mentorAvailability().then((value) => {
      if (!cancelled) setAvailability(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const asked = question.trim();
    if (!asked || pending) return;
    setPending(true);
    setError(null);
    const history: MentorTurn[] = exchanges
      .slice(-mentorLimits.historyTurns / 2)
      .flatMap((item) => [
        { role: "user" as const, text: item.question },
        {
          role: "mentor" as const,
          text: item.answer.slice(0, mentorLimits.historyChars),
        },
      ]);
    try {
      const response = await askMentor({
        lessonId: lesson.id,
        question: asked,
        history,
        context: lessonContext(lesson),
      });
      setExchanges((previous) => [
        ...previous,
        {
          question: asked,
          answer: response.answer,
          citations: response.citations,
          truncated: response.truncated,
        },
      ]);
      setRemaining(response.usage.remainingToday);
      setQuestion("");
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Le mentor est indisponible.",
      );
    } finally {
      setPending(false);
    }
  }

  if (availability === null)
    return <p className="learning-footnote">Vérification du mentor…</p>;

  if (availability === "not-configured")
    return (
      <p className="learning-footnote mentor-off">
        Mentor intégré non connecté sur cette installation : aucune réponse
        n’est simulée.
      </p>
    );

  if (availability === "signed-out")
    return (
      <div className="mentor-off">
        <p className="learning-footnote">
          Le mentor demande un compte : connectez-vous dans les préférences.
        </p>
        <button
          className="text-button"
          type="button"
          onClick={() => onNavigate("settings")}
        >
          Ouvrir les préférences
        </button>
      </div>
    );

  return (
    <div className="mentor-panel">
      <p className="learning-footnote">
        Votre question et le texte de cette leçon sont envoyés au fournisseur
        d’IA (Anthropic) par le serveur de BOUSE. N’y mettez pas de données
        personnelles. Les échanges ne sont pas conservés.
      </p>
      {exchanges.map((item, index) => (
        <article className="mentor-exchange" key={index}>
          <p className="mentor-question">{item.question}</p>
          <span className="mentor-draft">
            Brouillon du mentor · non vérifié
          </span>
          <p className="mentor-answer">{item.answer}</p>
          {item.truncated && (
            <p className="learning-footnote">
              Réponse interrompue par la limite de longueur.
            </p>
          )}
          {item.citations.length > 0 && (
            <ul
              className="mentor-citations"
              aria-label="Passages de la leçon cités"
            >
              {item.citations.map((citation) => (
                <li key={`${citation.title}-${citation.quote}`}>
                  <q>{citation.quote}</q>
                  <small>{citation.title}</small>
                </li>
              ))}
            </ul>
          )}
        </article>
      ))}
      <form className="mentor-form" onSubmit={submit}>
        <label className="field">
          Votre question sur cette leçon
          <textarea
            rows={3}
            maxLength={mentorLimits.questionChars}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ce que je n’ai pas compris…"
          />
        </label>
        <button
          className="button secondary"
          type="submit"
          disabled={pending || !question.trim()}
        >
          {pending ? "Le mentor réfléchit…" : "Demander au mentor"}
        </button>
      </form>
      {error && (
        <p className="learning-footnote" role="alert">
          {error}
        </p>
      )}
      {remaining !== null && (
        <p className="learning-footnote" role="status">
          {remaining} question{remaining > 1 ? "s" : ""} restante
          {remaining > 1 ? "s" : ""} aujourd’hui.
        </p>
      )}
    </div>
  );
}

/** Free hand-off: copy the lesson and the question, then open claude.ai. */
function AskMyClaude({ lesson }: { lesson: Lesson }) {
  const [question, setQuestion] = useState("");
  const [copied, setCopied] = useState<"idle" | "copied" | "manual">("idle");
  const prompt = claudeHandoffPrompt(lesson, question);

  async function handOff() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied("copied");
    } catch {
      setCopied("manual");
    }
    window.open("https://claude.ai/new", "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mentor-handoff">
      <label className="field">
        Votre question
        <textarea
          rows={3}
          maxLength={mentorLimits.questionChars}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ce que je n’ai pas compris…"
        />
      </label>
      <button
        className="button secondary"
        type="button"
        disabled={!question.trim()}
        onClick={() => void handOff()}
      >
        Copier et demander à mon Claude
      </button>
      <p className="learning-footnote">
        Copie votre question avec le texte de la leçon, puis ouvre claude.ai :
        collez et envoyez avec votre propre abonnement. BOUSE n’envoie rien
        lui-même.
      </p>
      {copied === "copied" && (
        <p className="learning-footnote" role="status">
          Copié. Collez dans la nouvelle conversation Claude.
        </p>
      )}
      {copied === "manual" && (
        <label className="field">
          Copie automatique refusée par le navigateur : sélectionnez ce texte
          <textarea readOnly rows={6} value={prompt} />
        </label>
      )}
    </div>
  );
}

export function MentorPanel(props: {
  lesson: Lesson;
  onNavigate: (route: string) => void;
}) {
  return (
    <div className="mentor-options">
      <AskMyClaude lesson={props.lesson} />
      <IntegratedMentor {...props} />
    </div>
  );
}

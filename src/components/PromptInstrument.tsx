import { useRef, useState, type CSSProperties, type FormEvent } from "react";
import { normalizeSearch, reviewPrompt } from "../lib/domain";
import { Icon } from "./Icon";

// Reading aids only: the existing six-rule assessment remains unchanged.
const parts = [
  {
    name: "Objectif",
    x: 50,
    y: 9,
    check: 0,
    hint: "L’action et le résultat attendu.",
  },
  {
    name: "Contexte",
    x: 82,
    y: 25,
    check: 1,
    hint: "La situation et le destinataire.",
  },
  {
    name: "Données",
    x: 85,
    y: 63,
    check: 2,
    hint: "La matière sur laquelle travailler.",
  },
  {
    name: "Contraintes",
    x: 64,
    y: 88,
    check: 3,
    hint: "Les limites à respecter.",
  },
  {
    name: "Format",
    x: 28,
    y: 88,
    check: 4,
    hint: "La forme de la réponse utile.",
  },
  {
    name: "Critères",
    x: 12,
    y: 61,
    check: 5,
    hint: "Ce qui rendra la réponse réussie.",
    signal: /\b(criteres?|mesurables?|reussite)\b/,
  },
  {
    name: "Vérification",
    x: 18,
    y: 25,
    check: 5,
    hint: "Les faits, les sources et les incertitudes à vérifier.",
    signal:
      /\b(verifie[rz]?|verification|incertitudes?|hypotheses?|n.invente|citations?)\b/,
  },
];
function hasSignal(text: string, index: number) {
  const part = parts[index]!;
  return part.signal
    ? part.signal.test(normalizeSearch(text))
    : reviewPrompt(text).checks[part.check]!.passed;
}

export function AILab() {
  const [prompt, setPrompt] = useState("");
  const [mobilePane, setMobilePane] = useState<"structure" | "writing">(
    "structure",
  );
  const [selected, setSelected] = useState(0);
  const [analysis, setAnalysis] = useState<ReturnType<
    typeof reviewPrompt
  > | null>(null);
  const [feedback, setFeedback] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);
  const observatoryRef = useRef<HTMLElement>(null);
  const found = parts.map((_, index) => hasSignal(prompt, index));
  const count = found.filter(Boolean).length;
  const excerpts = prompt
    .split(/(\n|(?<=[.!?])\s+)/u)
    .filter((fragment) => hasSignal(fragment, selected));
  const active = parts[selected]!;
  function analyse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAnalysis(reviewPrompt(prompt));
    setFeedback("");
    setMobilePane("structure");
    requestAnimationFrame(() =>
      observatoryRef.current?.focus({ preventScroll: true }),
    );
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
  function selectPart(index: number) {
    setSelected(index);
    const fragment = prompt
      .split(/(\n|(?<=[.!?])\s+)/u)
      .find((value) => hasSignal(value, index));
    if (fragment) {
      const start = prompt.indexOf(fragment);
      textRef.current?.setSelectionRange(start, start + fragment.length);
    }
  }
  return (
    <div className="prompt-instrument art-page">
      <header className="art-heading">
        <div>
          <span className="instrument-index">
            Atelier IA <i /> Instrument 02
          </span>
          <h1>De l’intention à l’instruction.</h1>
        </div>
        <p>
          Sept repères pour structurer une demande. Lecture locale, sans modèle
          connecté.
        </p>
      </header>
      <div
        className="prompt-mobile-views"
        role="group"
        aria-label="Vue de l’instrument"
      >
        <button
          type="button"
          aria-pressed={mobilePane === "structure"}
          aria-controls="prompt-observatory"
          onClick={() => setMobilePane("structure")}
        >
          <Icon name="node" size={16} /> Structure <span>{count}/7</span>
        </button>
        <button
          type="button"
          aria-pressed={mobilePane === "writing"}
          aria-controls="prompt-writing"
          onClick={() => setMobilePane("writing")}
        >
          <Icon name="edit" size={16} /> Écrire
        </button>
      </div>
      <div className="prompt-desk" data-mobile-pane={mobilePane}>
        <form id="prompt-writing" className="prompt-writing" onSubmit={analyse}>
          <div className="instrument-caption">
            <span>01 / Votre matière</span>
            <span>{prompt.length.toLocaleString("fr-FR")} car.</span>
          </div>
          <label htmlFor="prompt-text">
            Quel travail voulez-vous confier à l’IA ?
          </label>
          <textarea
            id="prompt-text"
            ref={textRef}
            value={prompt}
            required
            minLength={20}
            maxLength={12000}
            rows={10}
            placeholder={
              "Je veux…\n\nObjectif : comparer trois offres.\nContexte : mon entreprise…\nDonnées : …\nContraintes : …\nFormat : …\nCritères et vérification : …"
            }
            onChange={(event) => {
              setPrompt(event.target.value);
              setAnalysis(null);
              setFeedback("");
            }}
          />
          <div className="prompt-meter" aria-hidden="true">
            {parts.map((part, index) => (
              <i
                key={part.name}
                className={found[index] ? "is-found" : ""}
                title={part.name}
              />
            ))}
            <span>
              {found.filter(Boolean).length} / {parts.length} repères dans le
              texte
            </span>
          </div>
          <div className="prompt-writing-footer">
            <span>20 caractères minimum · brouillon de session</span>
            <button className="button primary" type="submit">
              Examiner la structure <Icon name="arrow" size={16} />
            </button>
          </div>
        </form>
        <section
          id="prompt-observatory"
          ref={observatoryRef}
          tabIndex={-1}
          className="prompt-observatory"
          aria-label="Structure visuelle du prompt"
        >
          <div className="instrument-caption">
            <span>02 / Architecture de l’instruction</span>
            <span>{String(count).padStart(2, "0")} / 07 repères</span>
          </div>
          <div className="prompt-constellation">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <ellipse
                cx="50"
                cy="49"
                rx="36"
                ry="39"
                className="prompt-orbit"
              />
              <ellipse
                cx="50"
                cy="49"
                rx="23"
                ry="24"
                className="prompt-orbit inner"
              />
              {parts.map((part, index) => (
                <path
                  key={part.name}
                  className={`${found[index] ? "found" : ""} ${selected === index ? "selected" : ""}`}
                  /* The top spoke stops under its label instead of crossing it. */
                  d={`M50 49 Q${50 + (part.x - 50) * 0.15} ${part.y} ${part.x} ${part.y < 25 ? part.y + 13 : part.y}`}
                />
              ))}
              <path
                className="prompt-crosshair"
                d="M48 49h4M50 47v4M2 49h3M95 49h3"
              />
            </svg>
            <div className="prompt-core" aria-hidden="true">
              <span>{String(count).padStart(2, "0")}</span>
              <small>liens de sens</small>
            </div>
            {parts.map((part, index) => (
              <button
                type="button"
                key={part.name}
                className={`prompt-part ${found[index] ? "is-found" : ""}`}
                aria-pressed={selected === index}
                onClick={() => selectPart(index)}
                style={
                  {
                    "--part-x": `${part.x}%`,
                    "--part-y": `${part.y}%`,
                  } as CSSProperties
                }
              >
                <span className="prompt-part-dot">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong>{part.name}</strong>
                {/* Only the gaps are shown; a found cue stays announced, not repeated seven times. */}
                {found[index] ? (
                  <small className="sr-only">indice repéré</small>
                ) : (
                  <small>à préciser</small>
                )}
              </button>
            ))}
          </div>
          <div className="prompt-lens" key={selected}>
            <span className="prompt-lens-index">
              {String(selected + 1).padStart(2, "0")}
            </span>
            <div>
              <h2>{active.name}</h2>
              <p>{active.hint}</p>
              {excerpts.length ? (
                <blockquote>
                  <mark>{excerpts.join(" ")}</mark>
                </blockquote>
              ) : (
                <p className="prompt-absence">
                  Aucun indice repéré dans votre texte.
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            className="button primary prompt-mobile-write"
            onClick={() => setMobilePane("writing")}
          >
            {prompt ? "Revenir à mon texte" : "Écrire mon instruction"}{" "}
            <Icon name="arrow" size={16} />
          </button>
        </section>
      </div>
      <p className="instrument-disclosure">
        <Icon name="lock" size={14} />
        <span>
          Aucun modèle IA connecté. Lecture locale par mots-clés : les liens
          signalent des indices de structure, sans évaluer la qualité ni les
          faits.
        </span>
      </p>
      {analysis && (
        <section
          className="prompt-comparison"
          aria-label="Analyse de la structure"
          aria-live="polite"
        >
          <header>
            <div>
              <span className="instrument-index">03 / Recomposer</span>
              <h2>
                La même intention.
                <br />
                Une structure plus explicite.
              </h2>
            </div>
            <div className="prompt-assessment">
              <h3>{analysis.score} / 100</h3>
              <span>Un repère, pas une note de qualité</span>
            </div>
          </header>
          <div className="prompt-comparison-columns">
            <section>
              <h3>
                <span>A</span> Original
              </h3>
              <p className="prompt-original">{prompt}</p>
            </section>
            <section>
              <h3>
                <span>B</span> Trame à compléter
              </h3>
              <pre>
                {analysis.suggestion.split("\n\nPROMPT À RETRAVAILLER :")[0]}
              </pre>
              <button
                className="text-button"
                type="button"
                onClick={() => void copySuggestion()}
              >
                Copier la trame <Icon name="copy" size={15} />
              </button>
              {feedback && <p role="status">{feedback}</p>}
            </section>
          </div>
        </section>
      )}
      <footer className="instrument-principle">
        <span>Le réflexe à garder</span>
        <p>
          Une instruction précise ouvre des possibilités.
          <br />
          <strong>La vérification leur donne de la valeur.</strong>
        </p>
      </footer>
    </div>
  );
}

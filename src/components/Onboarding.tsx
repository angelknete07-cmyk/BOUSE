import { useEffect, useRef, useState } from "react";
import type { Profile } from "../lib/types";
import { Icon } from "./Icon";

const diagnostic = [
  {
    id: "finance",
    question:
      "Une vente de 1 000 € est facturée, mais le client paiera dans 60 jours. Que peut-on affirmer ?",
    options: [
      "Le compte bancaire a reçu 1 000 €.",
      "La vente et l’encaissement n’ont pas lieu au même moment.",
      "Le bénéfice est forcément de 1 000 €.",
    ],
    answer: 1,
  },
  {
    id: "business",
    question:
      "Quelle preuve est la plus utile pour valider un problème client ?",
    options: [
      "Un proche trouve l’idée intéressante.",
      "Un marché semble à la mode.",
      "Des clients décrivent une difficulté récente et une solution qu’ils paient déjà.",
    ],
    answer: 2,
  },
  {
    id: "ai",
    question:
      "Un modèle de langage fournit une réponse très convaincante. Est-elle forcément exacte ?",
    options: [
      "Non, il faut vérifier les affirmations importantes.",
      "Oui, si la réponse est détaillée.",
      "Oui, si deux formulations donnent la même réponse.",
    ],
    answer: 0,
  },
];
export function Onboarding({
  onComplete,
}: {
  onComplete: (profile: Profile) => void;
}) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>({
    name: "",
    level: "Débutant++",
    goal: "Comprendre et piloter un business",
    interests: ["Finance", "Intelligence artificielle"],
    minutes: 20,
    preference: "Exemples puis pratique",
    diagnostic: {},
  });
  const [showResult, setShowResult] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef({ step, showResult });
  useEffect(() => {
    if (
      previousStep.current.step === step &&
      previousStep.current.showResult === showResult
    )
      return;
    previousStep.current = { step, showResult };
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "nearest" });
  }, [step, showResult]);
  const patch = (p: Partial<Profile>) =>
    setProfile((prev) => ({ ...prev, ...p }));
  const score = diagnostic.filter(
    (q) => profile.diagnostic[q.id] === q.answer,
  ).length;
  return (
    <main className="onboarding">
      <div className="onboarding-brand">
        <span className="brand-mark">b.</span>
        <span>
          BOUSE <small>BUSINESS & AI ACADEMY</small>
        </span>
      </div>
      <div className="onboarding-layout">
        <div className="onboarding-intro">
          <span className="eyebrow">VOTRE PROCHAINE VERSION COMMENCE ICI</span>
          <h1>
            Comprendre.
            <br />
            Décider.
            <br />
            <em>Construire.</em>
          </h1>
          <p>
            Le business et l’IA deviennent des compétences. Une notion, une
            preuve, un projet à la fois.
          </p>
          <div className="intro-foot">
            <span>01 / Fondations</span>
            <span>
              À votre rythme <Icon name="arrow" size={16} />
            </span>
          </div>
        </div>
        <section className="onboarding-form panel">
          <div className="step-indicator">
            <span className={step === 0 ? "active" : ""}>01 Votre cap</span>
            <span className={step === 1 ? "active" : ""}>
              02 Point de départ
            </span>
          </div>
          {step === 0 ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(1);
              }}
            >
              <h2 ref={headingRef} tabIndex={-1}>
                Faisons connaissance.
              </h2>
              <p className="muted">
                Quelques repères pour choisir votre prochaine action.
              </p>
              <label className="field">
                Votre prénom ou pseudo
                <input
                  maxLength={40}
                  placeholder="Comment vous appeler ?"
                  value={profile.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  required
                  autoComplete="given-name"
                />
              </label>
              <div className="field-grid">
                <label className="field">
                  Votre niveau
                  <select
                    value={profile.level}
                    onChange={(e) => patch({ level: e.target.value })}
                  >
                    <option>Fondations</option>
                    <option>Débutant++</option>
                    <option>Intermédiaire</option>
                    <option>Avancé</option>
                  </select>
                </label>
                <label className="field">
                  Temps par session
                  <select
                    value={profile.minutes}
                    onChange={(e) => patch({ minutes: Number(e.target.value) })}
                  >
                    <option value={10}>10 minutes</option>
                    <option value={20}>20 minutes</option>
                    <option value={40}>40 minutes</option>
                  </select>
                </label>
              </div>
              <label className="field">
                Votre objectif
                <select
                  value={profile.goal}
                  onChange={(e) => patch({ goal: e.target.value })}
                >
                  <option>Comprendre et piloter un business</option>
                  <option>Construire un projet avec l’IA</option>
                  <option>Mieux décider dans ma vie professionnelle</option>
                </select>
              </label>
              <fieldset className="interest-fields">
                <legend>Vos centres d’intérêt</legend>
                {[
                  "Finance",
                  "Entrepreneuriat",
                  "Intelligence artificielle",
                ].map((i) => (
                  <label key={i}>
                    <input
                      type="checkbox"
                      checked={profile.interests.includes(i)}
                      onChange={(e) =>
                        patch({
                          interests: e.target.checked
                            ? [...profile.interests, i]
                            : profile.interests.filter((x) => x !== i),
                        })
                      }
                    />
                    {i}
                  </label>
                ))}
              </fieldset>
              <label className="field">
                Votre façon d’apprendre
                <select
                  value={profile.preference}
                  onChange={(e) => patch({ preference: e.target.value })}
                >
                  <option>Exemples puis pratique</option>
                  <option>Concepts puis cas professionnel</option>
                  <option>Appliquer à mon projet</option>
                </select>
              </label>
              <button className="button primary full" type="submit">
                Trouver mon point de départ <Icon name="arrow" size={18} />
              </button>
              <p className="privacy-note">
                Stockage dans ce navigateur · sans compte · aucun envoi de
                données
              </p>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (showResult)
                  onComplete({
                    ...profile,
                    name: profile.name.trim() || "Vous",
                  });
                else setShowResult(true);
              }}
            >
              <h2 ref={headingRef} tabIndex={-1}>
                {showResult
                  ? "Votre point de départ est posé."
                  : "Trois questions. Aucun jugement."}
              </h2>
              <p className="muted">
                {showResult
                  ? `${score}/3 repères identifiés. Ce diagnostic oriente le parcours ; il ne certifie pas un niveau.`
                  : "Répondez spontanément. Ne pas savoir fait partie du chemin."}
              </p>
              {diagnostic.map((q, index) => (
                <fieldset className="question" key={q.id}>
                  <legend>
                    <span className="question-number">0{index + 1}</span>
                    {q.question}
                  </legend>
                  {q.options.map((option, i) => (
                    <label
                      className={`choice ${showResult && i === q.answer ? "correct" : ""}`}
                      key={option}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        required
                        checked={profile.diagnostic[q.id] === i}
                        disabled={showResult}
                        onChange={() =>
                          patch({
                            diagnostic: { ...profile.diagnostic, [q.id]: i },
                          })
                        }
                      />
                      {option}
                    </label>
                  ))}
                  {showResult && (
                    <p className="feedback">
                      {profile.diagnostic[q.id] === q.answer
                        ? "Repère identifié."
                        : `À explorer : ${q.options[q.answer]}`}
                    </p>
                  )}
                </fieldset>
              ))}
              <div className="actions">
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => {
                    setStep(0);
                    setShowResult(false);
                  }}
                >
                  Retour
                </button>
                <button className="button primary" type="submit">
                  {showResult
                    ? "Entrer dans l’Académie"
                    : "Voir mon point de départ"}
                  <Icon name="arrow" size={18} />
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

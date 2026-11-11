import { BrandLogo } from "./BrandLogo";
import { useEffect, useRef, useState } from "react";
import {
  goalOptions,
  interestOptions,
  levelLabel,
  levelOptions,
  minuteOptions,
  preferenceOptions,
} from "../data/profileOptions";
import type { Profile } from "../lib/types";
import { Icon } from "./Icon";
import { DomainPicker } from "./DomainPicker";
import { CORE_DOMAIN_IDS, toggleDomain } from "../lib/catalogue";

/** Not knowing is a valid answer: it never blocks and never counts as an error. */
const UNKNOWN = 3;
const diagnostic = [
  {
    id: "finance",
    question:
      "Une vente de 1 000 € est facturée, mais le client paiera dans 60 jours. Que peut-on affirmer\u00a0?",
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
      "Quelle preuve est la plus utile pour valider un problème client\u00a0?",
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
      "Un modèle de langage fournit une réponse très convaincante. Est-elle forcément exacte\u00a0?",
    options: [
      "Non, il faut vérifier les affirmations importantes.",
      "Oui, si la réponse est détaillée.",
      "Oui, si deux formulations donnent la même réponse.",
    ],
    answer: 0,
  },
  {
    id: "personal",
    question:
      "Votre salaire arrive en début de mois. Quelle habitude protège le mieux votre épargne\u00a0?",
    options: [
      "Épargner ce qui reste à la fin du mois.",
      "Programmer un virement vers l’épargne dès que le salaire arrive.",
      "Épargner seulement les mois sans imprévu.",
    ],
    answer: 1,
  },
  {
    id: "investing",
    question:
      "Deux placements ont le même rendement avant frais. L’un prélève 2\u00a0% par an, l’autre 0,2\u00a0%. Sur vingt ans\u00a0:",
    options: [
      "les frais comptent peu si le rendement est le même ;",
      "l’écart de frais se cumule chaque année et pèse nettement sur le capital final ;",
      "le placement le plus cher est forcément le mieux géré.",
    ],
    answer: 1,
  },
];
export function Onboarding({
  onComplete,
}: {
  onComplete: (profile: Profile, domains: string[]) => void;
}) {
  const [step, setStep] = useState(0);
  // Les domaines du catalogue : ceux des premières leçons, cochés d'office.
  const [domains, setDomains] = useState<string[]>(() => [...CORE_DOMAIN_IDS]);
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
        <BrandLogo size={40} />
        <span>
          BOUSE <small>ACADÉMIE BUSINESS & IA</small>
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
            <span>À votre rythme</span>
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
                Quelques questions pour choisir votre prochaine action.
              </p>
              <label className="field">
                Votre prénom ou pseudo <small>(facultatif)</small>
                <input
                  maxLength={40}
                  placeholder="Comment vous appeler ?"
                  value={profile.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  autoComplete="given-name"
                />
              </label>
              <label className="field">
                Votre objectif
                <select
                  value={profile.goal}
                  onChange={(e) => patch({ goal: e.target.value })}
                >
                  {goalOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <div className="field-grid">
                <label className="field">
                  Temps par session
                  <select
                    value={profile.minutes}
                    onChange={(e) => patch({ minutes: Number(e.target.value) })}
                  >
                    {minuteOptions.map((option) => (
                      <option key={option} value={option}>
                        {option} minutes
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <fieldset className="onboarding-domains">
                <legend>
                  Ce qui t’intéresse{" "}
                  <small>(tu pourras changer dans l’Académie)</small>
                </legend>
                <DomainPicker
                  compact
                  chosen={domains}
                  onToggle={(id) => setDomains((d) => toggleDomain(d, id))}
                />
              </fieldset>
              <details className="onboarding-more">
                <summary>Préciser mon profil (facultatif)</summary>
                <label className="field">
                  Votre niveau
                  <select
                    value={profile.level}
                    onChange={(e) => patch({ level: e.target.value })}
                  >
                    {levelOptions.map((option) => (
                      <option key={option} value={option}>
                        {levelLabel(option)}
                      </option>
                    ))}
                  </select>
                </label>
                <fieldset className="interest-fields">
                  <legend>Vos centres d’intérêt</legend>
                  {interestOptions.map((i) => (
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
                    {preferenceOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </details>
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
                if (!showResult) {
                  const filled = { ...profile.diagnostic };
                  for (const q of diagnostic)
                    if (filled[q.id] === undefined) filled[q.id] = UNKNOWN;
                  patch({ diagnostic: filled });
                }
                if (showResult)
                  onComplete(
                    { ...profile, name: profile.name.trim() || "Vous" },
                    domains,
                  );
                else setShowResult(true);
              }}
            >
              <h2 ref={headingRef} tabIndex={-1}>
                {showResult
                  ? "Votre point de départ est posé."
                  : "Cinq questions. Aucun jugement."}
              </h2>
              <p className="muted">
                {showResult
                  ? `${score}/${diagnostic.length} bonnes réponses. Ce diagnostic oriente le parcours ; il ne certifie pas un niveau.`
                  : "Répondez spontanément. « Je ne sais pas encore » est une réponse utile : elle oriente aussi le parcours."}
              </p>
              {diagnostic.map((q, index) => (
                <fieldset className="question" key={q.id}>
                  <legend>
                    <span className="question-number">0{index + 1}</span>
                    {q.question}
                  </legend>
                  {[...q.options, "Je ne sais pas encore"].map((option, i) => (
                    <label
                      className={`choice ${showResult && i === q.answer ? "correct" : ""} ${i === UNKNOWN ? "choice-unknown" : ""}`}
                      key={option}
                    >
                      <input
                        type="radio"
                        name={q.id}
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
                        ? "Bonne réponse."
                        : profile.diagnostic[q.id] === UNKNOWN
                          ? `Une bonne question pour commencer. La réponse : ${q.options[q.answer]}`
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

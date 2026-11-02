import { useEffect, useRef, useState } from "react";
import { lessons } from "../data/lessons";
import type { AppState, ReviewRating, StateUpdater } from "../lib/types";
import {
  appendReviewEvent,
  buildReviewDeck,
  dueReviewCards,
  scheduleReview,
  type ReviewCard,
} from "../lib/reviews";
import { Icon } from "./Icon";
import "../reviews.css";

type Props = {
  state: AppState;
  update: StateUpdater;
  onNavigate: (route: string) => void;
};
type RatedCard = { cardId: string; rating: ReviewRating; dueAt: string };
type Session = {
  cards: ReviewCard[];
  index: number;
  rated: RatedCard[];
  skipped: string[];
  ended: boolean;
};

const choices: { rating: ReviewRating; label: string; hint: string }[] = [
  { rating: "again", label: "À reprendre", hint: "Le repère m’a échappé." },
  {
    rating: "hard",
    label: "Encore fragile",
    hint: "J’ai hésité ou oublié une nuance.",
  },
  {
    rating: "remembered",
    label: "Retrouvé sans aide",
    hint: "Je pouvais l’expliquer avant de révéler.",
  },
];
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});
const formatDate = (date: string) => dateFormatter.format(new Date(date));
const intervalLabel = (days: number) =>
  days === 1 ? "Dans 24 h" : `Dans ${days} jours`;
const plural = (count: number, singular: string, multiple: string) =>
  count === 1 ? singular : multiple;

export function Reviews({ state, update, onNavigate }: Props) {
  const [now, setNow] = useState(() => new Date());
  const [session, setSession] = useState<Session | null>(null);
  const [revealedFor, setRevealedFor] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const handledCards = useRef(new Set<string>());
  const questionRef = useRef<HTMLHeadingElement>(null);
  const answerRef = useRef<HTMLElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const deck = buildReviewDeck(lessons, state, now);
  const due = dueReviewCards(deck, now);
  const upcoming = deck
    .filter((card) => Date.parse(card.dueAt) > now.getTime())
    .sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt));
  const urgentLessons = new Set(
    due
      .filter((card) => card.reason === "quiz-error")
      .map((card) => card.lessonId),
  );
  const groups = lessons
    .map((lesson) => {
      const cards = deck.filter((card) => card.lessonId === lesson.id);
      const dueCount = due.filter((card) => card.lessonId === lesson.id).length;
      return {
        lesson,
        cards,
        dueCount,
        next: cards
          .slice()
          .sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt))[0],
      };
    })
    .filter((group) => group.cards.length);
  const finished =
    !!session && (session.ended || session.index >= session.cards.length);
  const card = !finished ? session?.cards[session.index] : undefined;
  const revealed = !!card && revealedFor === card.id;

  useEffect(() => {
    const refresh = () => setNow(new Date());
    const visible = () => {
      if (!document.hidden) refresh();
    };
    const interval = setInterval(refresh, 60_000);
    addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", visible);
    return () => {
      clearInterval(interval);
      removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", visible);
    };
  }, []);

  useEffect(() => {
    if (!session) return;
    const target = finished ? resultRef.current : questionRef.current;
    target?.focus({ preventScroll: true });
    if (target)
      target.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [session?.index, session?.ended, finished]);

  function start() {
    const currentTime = new Date();
    const cards = dueReviewCards(
      buildReviewDeck(lessons, state, currentTime),
      currentTime,
    ).slice(0, 5);
    setNow(currentTime);
    if (!cards.length) return;
    handledCards.current = new Set();
    setSession({ cards, index: 0, rated: [], skipped: [], ended: false });
    setRevealedFor(null);
    setDraft("");
    setError("");
  }
  function reveal() {
    if (!card) return;
    setRevealedFor(card.id);
    requestAnimationFrame(() => {
      answerRef.current?.focus({ preventScroll: true });
      answerRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "instant",
      });
    });
  }
  function rate(rating: ReviewRating) {
    if (!card || !revealed || handledCards.current.has(card.id)) return;
    try {
      const at = new Date();
      const event = scheduleReview(card, rating, at, crypto.randomUUID());
      handledCards.current.add(card.id);
      update((previous) => appendReviewEvent(previous, event));
      setSession((previous) =>
        !previous || previous.cards[previous.index]?.id !== card.id
          ? previous
          : {
              ...previous,
              index: previous.index + 1,
              rated: [
                ...previous.rated,
                { cardId: card.id, rating, dueAt: event.dueAt },
              ],
            },
      );
      setNow(at);
      setRevealedFor(null);
      setDraft("");
      setError("");
    } catch {
      setError(
        "Ce rappel n’a pas pu être planifié. Votre carte reste disponible ; réessayez votre choix.",
      );
    }
  }
  function skip() {
    if (!card || handledCards.current.has(card.id)) return;
    handledCards.current.add(card.id);
    setSession((previous) =>
      !previous || previous.cards[previous.index]?.id !== card.id
        ? previous
        : {
            ...previous,
            index: previous.index + 1,
            skipped: [...previous.skipped, card.id],
          },
    );
    setRevealedFor(null);
    setDraft("");
    setError("");
  }
  function returnToOverview() {
    setSession(null);
    setNow(new Date());
    setError("");
  }

  return (
    <div className={`reviews-experience ${session ? "is-in-session" : ""}`}>
      <header className="review-page-heading">
        <p className="eyebrow">LAISSER UNE TRACE / RÉVISIONS</p>
        <h1>Faire revenir les idées.</h1>
        <p>Ce que vous retrouvez sans relire commence à vous appartenir.</p>
      </header>

      {session ? (
        finished ? (
          <section
            className="review-session-result"
            aria-labelledby="review-result-title"
          >
            <span className="review-result-mark" aria-hidden="true">
              <Icon name="check" size={32} />
            </span>
            <p className="eyebrow">VOTRE POINT D’ÉTAPE</p>
            <h2 id="review-result-title" ref={resultRef} tabIndex={-1}>
              Une pause qui compte.
            </h2>
            <p className="review-result-count" role="status">
              {session.rated.length}{" "}
              {plural(session.rated.length, "carte revue", "cartes revues")}
            </p>
            <p className="review-result-description">
              {session.rated.length
                ? "Vos choix ont donné une prochaine échéance à ces repères. Le score de vos quiz reste inchangé."
                : "Aucune autoévaluation enregistrée. Vos repères restent disponibles pour une autre session."}
            </p>
            <div className="review-session-account">
              <span>
                <strong>{session.rated.length}</strong>{" "}
                {plural(
                  session.rated.length,
                  "autoévaluation",
                  "autoévaluations",
                )}
              </span>
              <span>
                <strong>{session.skipped.length}</strong>{" "}
                {plural(
                  session.skipped.length,
                  "carte passée",
                  "cartes passées",
                )}
              </span>
              {session.index < session.cards.length && (
                <span>
                  <strong>{session.cards.length - session.index}</strong> non{" "}
                  {plural(
                    session.cards.length - session.index,
                    "parcourue",
                    "parcourues",
                  )}
                </span>
              )}
            </div>
            {session.skipped.length > 0 && (
              <p className="review-footnote">
                Passer une carte ne valide rien et ne déplace pas son échéance.
              </p>
            )}
            <div className="review-next-appointment">
              <Icon name="clock" size={18} />
              <div>
                <span>
                  {due.length ? "Encore disponibles" : "Prochain rappel"}
                </span>
                <strong>
                  {due.length
                    ? `${due.length} ${plural(due.length, "carte à revoir", "cartes à revoir")}`
                    : upcoming[0]
                      ? formatDate(upcoming[0].dueAt)
                      : "Votre prochain quiz ouvrira de nouveaux repères."}
                </strong>
              </div>
            </div>
            <div className="actions">
              {due.length > 0 && (
                <button className="button primary" onClick={start}>
                  Une autre courte session <Icon name="arrow" size={17} />
                </button>
              )}
              <button
                className={`button ${due.length ? "secondary" : "primary"}`}
                onClick={returnToOverview}
              >
                Retour à mes révisions
              </button>
              <button
                className="text-button"
                onClick={() => onNavigate("academy")}
              >
                Continuer le parcours <Icon name="arrow" size={16} />
              </button>
            </div>
          </section>
        ) : (
          card && (
            <section
              className="review-workbench"
              aria-labelledby="review-question-title"
            >
              <div className="review-session-top">
                <div>
                  <span className="eyebrow">
                    CARTE {String(session.index + 1).padStart(2, "0")} /{" "}
                    {String(session.cards.length).padStart(2, "0")}
                  </span>
                  <small>
                    {session.rated.length}{" "}
                    {plural(session.rated.length, "évaluée", "évaluées")} ·{" "}
                    {session.skipped.length}{" "}
                    {plural(session.skipped.length, "passée", "passées")}
                  </small>
                </div>
                <button
                  className="text-button"
                  onClick={() =>
                    setSession((previous) =>
                      previous ? { ...previous, ended: true } : previous,
                    )
                  }
                >
                  Quitter la session <Icon name="close" size={15} />
                </button>
              </div>
              <progress
                className="review-session-progress"
                value={session.index}
                max={session.cards.length}
                aria-label="Progression de cette session"
              />
              <div className="review-card-context">
                <span>{card.domain}</span>
                <button
                  className="text-button"
                  onClick={() => onNavigate(`lesson/${card.lessonId}`)}
                >
                  {card.lessonTitle}
                  <Icon name="external" size={13} />
                </button>
              </div>
              <p className="review-reason">
                {card.reason === "quiz-error"
                  ? "Les repères de cette leçon reviennent après un quiz à reprendre."
                  : "Une révision planifiée pour faire revenir cette notion."}
              </p>
              <h2 id="review-question-title" ref={questionRef} tabIndex={-1}>
                {card.front}
              </h2>
              <p className="review-prompt">
                Avant de révéler, formulez votre réponse de mémoire. Une
                hésitation est une information utile.
              </p>
              <label className="field review-recall-field">
                Votre rappel{" "}
                <span className="review-field-detail" id="review-recall-hint">
                  Facultatif · un brouillon pour comparer
                </span>
                <textarea
                  aria-label="Votre rappel"
                  aria-describedby="review-recall-hint"
                  rows={3}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Je m’en souviens comme ceci…"
                  disabled={revealed}
                />
              </label>
              {!revealed ? (
                <div className="review-reveal-actions">
                  <button className="button primary" onClick={reveal}>
                    Voir les repères <Icon name="arrow" size={17} />
                  </button>
                  <button className="text-button" onClick={skip}>
                    Passer cette carte
                  </button>
                </div>
              ) : (
                <>
                  <section
                    className="review-answer"
                    ref={answerRef}
                    tabIndex={-1}
                    aria-label="Les repères à comparer"
                  >
                    <span className="eyebrow">COMPARER AVEC VOTRE RAPPEL</span>
                    <p>{card.back}</p>
                  </section>
                  <fieldset className="review-rating">
                    <legend>Avant de révéler, où en étiez-vous ?</legend>
                    <p>
                      Votre autoévaluation règle la prochaine échéance. Elle ne
                      change ni votre quiz ni votre niveau.
                    </p>
                    <div className="review-rating-choices">
                      {choices.map((choice) => {
                        const preview = scheduleReview(
                          card,
                          choice.rating,
                          now,
                          "preview",
                        );
                        return (
                          <button
                            key={choice.rating}
                            type="button"
                            aria-label={choice.label}
                            onClick={() => rate(choice.rating)}
                          >
                            <span
                              className="review-rating-symbol"
                              aria-hidden="true"
                            >
                              <Icon
                                name={
                                  choice.rating === "again"
                                    ? "back"
                                    : choice.rating === "hard"
                                      ? "clock"
                                      : "check"
                                }
                                size={18}
                              />
                            </span>
                            <strong>{choice.label}</strong>
                            <span className="review-rating-hint">
                              {choice.hint}
                            </span>
                            <small aria-hidden="true">
                              {intervalLabel(preview.intervalDays)}
                              <Icon name="arrow" size={13} />
                            </small>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                  <div className="review-after-reveal">
                    <span className="review-footnote">
                      Brouillon de session · aucun modèle IA ne l’évalue.
                    </span>
                    <button className="text-button" onClick={skip}>
                      Passer cette carte
                    </button>
                  </div>
                </>
              )}
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
            </section>
          )
        )
      ) : (
        <>
          {deck.length ? (
            <div className="review-overview">
              <section
                className="review-invitation"
                aria-labelledby="review-availability-title"
              >
                <div className="review-invitation-top">
                  <span className="eyebrow">
                    UN RENDEZ-VOUS AVEC CE QUE VOUS SAVEZ
                  </span>
                  <Icon name="node" size={20} />
                </div>
                <div className="review-due-number">
                  <strong>{String(due.length).padStart(2, "0")}</strong>
                  <span>
                    {plural(
                      due.length,
                      "repère disponible",
                      "repères disponibles",
                    )}
                    <small>Maintenant, à votre rythme.</small>
                  </span>
                </div>
                <h2 id="review-availability-title">
                  {due.length
                    ? "Retrouver, avant de relire."
                    : "À jour pour le moment."}
                </h2>
                <p>
                  {due.length
                    ? urgentLessons.size
                      ? `${urgentLessons.size === 1 ? "Les repères de cette leçon reviennent" : `Les repères de ces ${urgentLessons.size} leçons reviennent`} après un quiz à reprendre. Ce rappel ne présume pas de l’erreur précise.`
                      : "Quelques rappels planifiés vous attendent. Une session courte suffit pour faire revenir l’essentiel."
                    : "Vos cartes ont déjà leur rendez-vous. Revenez à leur échéance ; poursuivez votre parcours entre-temps."}
                </p>
                <div className="review-invitation-actions">
                  {due.length ? (
                    <button className="button primary" onClick={start}>
                      Commencer la révision <Icon name="arrow" size={17} />
                    </button>
                  ) : (
                    <button
                      className="button primary"
                      onClick={() => onNavigate("academy")}
                    >
                      Poursuivre l’apprentissage <Icon name="arrow" size={17} />
                    </button>
                  )}
                  <span>
                    5 cartes maximum.
                    <br /> Aucune note à gagner.
                  </span>
                </div>
              </section>
              <aside
                className="review-calendar"
                aria-labelledby="review-next-title"
              >
                <p className="eyebrow">LA DISTANCE QUI SE CONSTRUIT</p>
                <svg
                  className="review-spacing-art"
                  viewBox="0 0 340 150"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M20 100C50 100 60 50 90 50S140 100 170 100S235 30 260 30S300 85 320 85" />
                  <circle cx="20" cy="100" r="4" />
                  <circle cx="90" cy="50" r="4" />
                  <circle cx="170" cy="100" r="4" />
                  <circle cx="260" cy="30" r="4" />
                  <circle cx="320" cy="85" r="4" />
                  <text x="18" y="126">
                    24 h
                  </text>
                  <text x="78" y="30">
                    3 j
                  </text>
                  <text x="158" y="126">
                    7 j
                  </text>
                  <text x="245" y="12">
                    14 j
                  </text>
                  <text x="301" y="111">
                    30 j
                  </text>
                </svg>
                <h2 id="review-next-title">
                  {upcoming[0]
                    ? "Le prochain rendez-vous."
                    : "Ce rendez-vous, c’est maintenant."}
                </h2>
                {upcoming[0] ? (
                  <>
                    <p className="review-next-date">
                      {formatDate(upcoming[0].dueAt)}
                    </p>
                    <span className="review-footnote">
                      Heure de Paris · {upcoming[0].lessonTitle}
                    </span>
                  </>
                ) : (
                  <p className="review-footnote">
                    Une autoévaluation placera le prochain rappel. Les cartes
                    passées gardent leur échéance.
                  </p>
                )}
                <p className="review-calendar-note">
                  Les intervalles s’allongent lorsque vous retrouvez la réponse
                  sans aide. Le calendrier reste une règle explicite de
                  l’application.
                </p>
              </aside>
            </div>
          ) : (
            <section
              className="review-empty"
              aria-labelledby="review-empty-title"
            >
              <div className="review-empty-art" aria-hidden="true">
                <Icon name="node" size={64} />
                <span />
                <span />
              </div>
              <p className="eyebrow">AUCUN RETARD À RATTRAPER</p>
              <h2 id="review-empty-title">
                Le premier rappel commence par une leçon.
              </h2>
              <p>
                Après votre premier quiz, les repères de la leçon rejoindront
                cet espace. Une erreur les rend prioritaires ; une réussite
                prévoit un rappel un peu plus tard.
              </p>
              <button
                className="button primary"
                onClick={() => onNavigate("academy")}
              >
                Choisir une leçon <Icon name="arrow" size={17} />
              </button>
            </section>
          )}
          {groups.length > 0 && (
            <section
              className="review-lesson-index"
              aria-labelledby="review-enrolled-title"
            >
              <div className="review-index-heading">
                <span className="eyebrow">LE FIL DE VOS RÉVISIONS</span>
                <h2 id="review-enrolled-title">
                  Des repères reliés à leurs leçons.
                </h2>
              </div>
              <div>
                {groups.map(({ lesson, cards, dueCount, next }) => (
                  <button
                    className="review-lesson-row"
                    key={lesson.id}
                    onClick={() => onNavigate(`lesson/${lesson.id}`)}
                  >
                    <span className="review-lesson-point" aria-hidden="true">
                      <Icon name={dueCount ? "node" : "clock"} size={18} />
                    </span>
                    <span>
                      <small>
                        {lesson.domain} · {cards.length}{" "}
                        {plural(cards.length, "repère", "repères")}
                      </small>
                      <strong>{lesson.title}</strong>
                      <span>
                        {dueCount
                          ? `${dueCount} ${plural(dueCount, "repère à revoir", "repères à revoir")}`
                          : next
                            ? `Prévu le ${formatDate(next.dueAt)}`
                            : "Aucun rappel planifié"}
                      </span>
                    </span>
                    <Icon name="arrow" size={18} />
                  </button>
                ))}
              </div>
            </section>
          )}
          <details className="review-method">
            <summary>
              Comment les rendez-vous sont-ils choisis ?{" "}
              <Icon name="plus" size={16} />
            </summary>
            <div>
              <p>
                Un quiz ouvre les cartes de sa leçon. S’il faut le reprendre,
                tous les repères de cette leçon deviennent prioritaires :
                l’application ne déduit pas quelle carte explique votre erreur.
              </p>
              <p>
                Après révélation, « À reprendre » revient au premier palier et «
                Encore fragile » garde le palier actuel : nouveau rappel dans 24
                h. « Retrouvé sans aide » allonge les rappels à 3, 7, 14 puis 30
                jours.
              </p>
              <p>
                Un jour correspond ici à 24 heures. Les dates sont affichées à
                l’heure de Paris. Ces intervalles sont une règle de
                l’application, pas une promesse de mémorisation personnalisée.
                Les autoévaluations restent séparées des résultats de quiz.
              </p>
            </div>
          </details>
        </>
      )}
    </div>
  );
}

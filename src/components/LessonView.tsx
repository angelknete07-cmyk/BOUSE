import { useEffect, useRef, useState } from "react";
import { lessons, type Lesson } from "../data/lessons";
import { evaluateQuiz } from "../lib/domain";
import { downloadFile } from "../lib/storage";
import type { AppState, Attempt, StateUpdater } from "../lib/types";
import { Icon } from "./Icon";
import { LessonScene } from "./LessonScene";
import { latestCurrentAttempt } from "../lib/portfolio";
import { useClock } from "../lib/useClock";
import "../lesson-experience.css";

type Props = {
  lesson: Lesson;
  state: AppState;
  update: StateUpdater;
  onNavigate: (route: string) => void;
};
const stages = [
  { label: "Learn", subtitle: "Comprendre" },
  { label: "Do", subtitle: "Pratiquer" },
  { label: "Prove", subtitle: "Démontrer" },
  { label: "Apply", subtitle: "Construire" },
];

export function LessonView({ lesson, state, update, onNavigate }: Props) {
  const now = useClock();
  const [tab, setTab] = useState(0);
  const [sequence, setSequence] = useState(0);
  const [exerciseText, setExerciseText] = useState("");
  const [hintVisible, setHintVisible] = useState(false);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerConfirmed, setAnswerConfirmed] = useState(false);
  const [result, setResult] = useState<Attempt | null>(null);
  const [note, setNote] = useState(state.notes[lesson.id] || "");
  const [notice, setNotice] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [teachBack, setTeachBack] = useState("");
  const [showTeachBack, setShowTeachBack] = useState(false);
  const [selfReview, setSelfReview] = useState<string[]>([]);
  const submitted = useRef(false);
  const stageRef = useRef<HTMLElement>(null);
  const latest = latestCurrentAttempt(lesson, state.attempts, now);
  const linkedProjects = state.projects.filter((project) =>
    project.lessonIds.includes(lesson.id),
  );
  const sequences = [
    ...lesson.sections.map((section, index) => ({
      title: index === 0 ? "Le concept" : section.title,
      type: "section",
      sectionIndex: index,
    })),
    { title: "En situation", type: "example", sectionIndex: -1 },
    { title: "À vous d’expliquer", type: "teachback", sectionIndex: -1 },
    { title: "L’essentiel", type: "summary", sectionIndex: -1 },
  ];
  const current = sequences[sequence]!;
  const section = lesson.sections[current.sectionIndex];
  const question = lesson.quiz[questionIndex]!;
  const selected = answers[question.id];
  const selectionIsCorrect = selected === question.answer;

  useEffect(() => {
    setTab(0);
    setSequence(0);
    setExerciseText("");
    setHintVisible(false);
    setSolutionVisible(false);
    setAnswers({});
    setQuestionIndex(0);
    setAnswerConfirmed(false);
    setResult(null);
    setNote(state.notes[lesson.id] || "");
    setNotice("");
    setSelectedProject("");
    setTeachBack("");
    setShowTeachBack(false);
    setSelfReview([]);
    submitted.current = false;
    update((previous) =>
      previous.lastLessonId === lesson.id
        ? previous
        : { ...previous, lastLessonId: lesson.id },
    );
    // A lesson owns its temporary work; saving notes must not reset this workspace.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  function focusStage() {
    requestAnimationFrame(() => {
      stageRef.current?.focus({ preventScroll: true });
      stageRef.current?.scrollIntoView({ block: "start" });
    });
  }
  function advanceTo(next: number) {
    setTab(next);
    focusStage();
  }
  function jumpSequence(next: number) {
    setSequence(next);
    focusStage();
  }
  function submitQuiz(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selected === undefined || submitted.current) return;
    if (questionIndex < lesson.quiz.length - 1) {
      setAnswerConfirmed(true);
      return;
    }
    if (lesson.quiz.some((item) => answers[item.id] === undefined)) return;
    submitted.current = true;
    const attempt: Attempt = {
      lessonId: lesson.id,
      lessonVersion: lesson.version,
      answers: { ...answers },
      ...evaluateQuiz(lesson.quiz, answers),
      at: new Date().toISOString(),
    };
    setResult(attempt);
    update((previous) => ({
      ...previous,
      attempts: [...previous.attempts, attempt],
      lastLessonId: lesson.id,
    }));
    focusStage();
  }
  function saveIdea() {
    const existing = state.projects.find(
      (project) => project.title === lesson.idea.title,
    );
    if (existing) {
      update((previous) => ({
        ...previous,
        projects: previous.projects.map((project) =>
          project.id === existing.id
            ? {
                ...project,
                lessonIds: [...new Set([...project.lessonIds, lesson.id])],
              }
            : project,
        ),
      }));
      setNotice(
        "Cette idée est déjà dans votre incubateur. La compétence y est maintenant reliée.",
      );
      return;
    }
    update((previous) => ({
      ...previous,
      projects: [
        ...previous.projects,
        {
          id: crypto.randomUUID(),
          title: lesson.idea.title,
          problem: lesson.idea.description,
          customer: "",
          hypothesis: "",
          nextAction: lesson.application,
          stage: "Idée",
          lessonIds: [lesson.id],
          createdAt: new Date().toISOString(),
        },
      ],
    }));
    setNotice(
      "Idée enregistrée dans votre incubateur. Complétez le client et l’hypothèse à tester.",
    );
  }
  function exportMarkdown() {
    const text = [
      "---",
      `title: ${JSON.stringify(lesson.title)}`,
      `domain: ${JSON.stringify(lesson.domain)}`,
      `level: ${lesson.level}`,
      `version: ${JSON.stringify(lesson.version)}`,
      'status: "contenu pédagogique local"',
      "---",
      `# ${lesson.title}`,
      lesson.summary,
      ...lesson.sections.flatMap((item) => [`## ${item.title}`, ...item.body]),
      `## ${lesson.example.title}`,
      lesson.example.body,
      "## Exercice",
      lesson.exercise.prompt,
      "### Indice",
      lesson.exercise.hint,
      "### Solution",
      lesson.exercise.answer,
      lesson.exercise.explanation,
      "## Appliquer",
      lesson.application,
      "## Sources de référence",
      ...lesson.sources.map((source) => `- [${source.title}](${source.url})`),
      "## Mes notes",
      note || "Aucune note.",
    ].join("\n\n");
    downloadFile(`${lesson.id}.md`, text, "text/markdown;charset=utf-8");
  }

  return (
    <div className="learning-experience">
      <div className="learning-topline">
        <button
          className="text-button"
          type="button"
          onClick={() => onNavigate("academy")}
        >
          <Icon name="back" size={16} /> Tous les parcours
        </button>
        <button
          className="learning-export"
          type="button"
          onClick={exportMarkdown}
        >
          Exporter en Markdown <Icon name="external" size={14} />
        </button>
      </div>
      <header className="learning-header">
        <div className="learning-kicker">
          <span>{lesson.domain}</span>
          <span>Niveau {lesson.level}</span>
          <span>{lesson.minutes} min</span>
        </div>
        <h1>{lesson.title}</h1>
        <p>{lesson.summary}</p>
      </header>
      <div
        className="learning-journey"
        role="tablist"
        aria-label="Étapes de la leçon"
      >
        {stages.map((stage, index) => (
          <button
            key={stage.label}
            id={`lesson-tab-${index}`}
            role="tab"
            type="button"
            className={`learning-stage-tab ${tab === index ? "is-active" : ""}`}
            aria-selected={tab === index}
            aria-controls="lesson-panel"
            tabIndex={tab === index ? 0 : -1}
            onClick={() => advanceTo(index)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === "ArrowRight")
                next = (index + 1) % stages.length;
              else if (event.key === "ArrowLeft")
                next = (index + stages.length - 1) % stages.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = stages.length - 1;
              else return;
              event.preventDefault();
              setTab(next);
              document.getElementById(`lesson-tab-${next}`)?.focus();
            }}
          >
            <span className="learning-stage-number">0{index + 1}</span>
            <span>
              <strong>{stage.label}</strong>
              <small>{stage.subtitle}</small>
            </span>
            {(index < tab || (index === 2 && latest?.passed)) && (
              <Icon name="check" size={15} />
            )}
          </button>
        ))}
      </div>
      <div className="learning-workspace">
        <section
          className="learning-stage"
          id="lesson-panel"
          ref={stageRef}
          role="tabpanel"
          tabIndex={-1}
          aria-labelledby={`lesson-tab-${tab}`}
        >
          {tab === 0 && (
            <>
              <div className="learning-sequence-top">
                <span className="eyebrow">
                  SÉQUENCE {String(sequence + 1).padStart(2, "0")}{" "}
                  <span className="learning-dim">
                    / {String(sequences.length).padStart(2, "0")}
                  </span>
                </span>
                <label className="learning-mobile-sequences">
                  <span className="sr-only">Choisir une séquence</span>
                  <select
                    value={sequence}
                    onChange={(event) =>
                      jumpSequence(Number(event.target.value))
                    }
                  >
                    {sequences.map((item, index) => (
                      <option key={index} value={index}>
                        {index + 1}. {item.title}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="learning-sequence-dots" aria-hidden="true">
                  {sequences.map((_, index) => (
                    <i
                      key={index}
                      className={index <= sequence ? "is-complete" : ""}
                    />
                  ))}
                </div>
              </div>
              <div className="learning-sequence" key={sequence}>
                {current.type === "section" && section && (
                  <>
                    <div className="learning-concept-heading">
                      <span className="learning-section-label">
                        {sequence === 0
                          ? "UNE IDÉE À COMPRENDRE"
                          : /piège|limite|erreur/i.test(section.title)
                            ? "LE POINT DE VIGILANCE"
                            : "ALLER UN CRAN PLUS LOIN"}
                      </span>
                      <h2>
                        {sequence === 0
                          ? lesson.skills.slice(0, 3).join(". ") + "."
                          : section.title}
                      </h2>
                      <p className="learning-lead">{section.body[0]}</p>
                    </div>
                    {sequence === 0 ? (
                      <>
                        <LessonScene lessonId={lesson.id} />
                        {section.body.length > 1 && (
                          <details className="learning-depth">
                            <summary>
                              Pourquoi ce repère change les décisions{" "}
                              <Icon name="plus" size={15} />
                            </summary>
                            {section.body.slice(1).map((paragraph, index) => (
                              <p key={index}>{paragraph}</p>
                            ))}
                          </details>
                        )}
                      </>
                    ) : (
                      <div className="learning-insights">
                        {section.body.slice(1).map((paragraph, index) => (
                          <div className="learning-insight" key={index}>
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <p>{paragraph}</p>
                          </div>
                        ))}
                        <div className="learning-recall">
                          <Icon name="idea" size={20} />
                          <p>
                            Avant de continuer : comment ce repère changerait-il
                            une décision dans votre projet ?
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {current.type === "example" && (
                  <div className="learning-case">
                    <span className="learning-section-label">
                      DÉCIDER DANS UNE SITUATION CONCRÈTE
                    </span>
                    <h2>{lesson.example.title}</h2>
                    <div className="learning-case-body">
                      <span className="learning-case-mark" aria-hidden="true">
                        “
                      </span>
                      <p>{lesson.example.body}</p>
                    </div>
                    <div className="learning-recall">
                      <Icon name="node" size={20} />
                      <p>
                        Repérez les hypothèses, la décision et sa conséquence.
                        Cet exemple est pédagogique et fictif.
                      </p>
                    </div>
                    <button
                      className="text-button"
                      type="button"
                      onClick={() => advanceTo(1)}
                    >
                      Tester mon raisonnement <Icon name="arrow" size={16} />
                    </button>
                  </div>
                )}
                {current.type === "teachback" && (
                  <div className="learning-teachback">
                    <span className="learning-section-label">
                      TEACH-BACK / EXPLIQUER POUR COMPRENDRE
                    </span>
                    <h2>À vous de faire passer l’idée.</h2>
                    <p className="learning-lead">
                      Expliquez cette notion à une personne qui la découvre.
                      Ajoutez un exemple et une limite importante.
                    </p>
                    <label className="field">
                      Mon explication
                      <textarea
                        rows={5}
                        value={teachBack}
                        onChange={(event) => setTeachBack(event.target.value)}
                        placeholder="Je l’expliquerais comme ceci…"
                      />
                    </label>
                    <div className="actions">
                      <button
                        className="button primary"
                        disabled={teachBack.trim().length < 20}
                        onClick={() => setShowTeachBack(true)}
                      >
                        Comparer avec les repères{" "}
                        <Icon name="arrow" size={16} />
                      </button>
                      <span className="learning-footnote">
                        Brouillon de session · aucun modèle IA ne l’évalue.
                      </span>
                    </div>
                    {showTeachBack && (
                      <div className="learning-self-review">
                        <span className="eyebrow">
                          RELIRE AVEC UN REGARD CRITIQUE
                        </span>
                        {lesson.flashcards.map((card) => (
                          <details key={card.front}>
                            <summary>{card.front}</summary>
                            <p>{card.back}</p>
                          </details>
                        ))}
                        <fieldset>
                          <legend>Dans mon explication, j’ai…</legend>
                          {[
                            "défini la notion avec mes propres mots",
                            "donné un exemple qui tient debout",
                            "nommé une limite ou un piège",
                          ].map((item) => (
                            <label key={item}>
                              <input
                                type="checkbox"
                                checked={selfReview.includes(item)}
                                onChange={(event) =>
                                  setSelfReview((previous) =>
                                    event.target.checked
                                      ? [...previous, item]
                                      : previous.filter(
                                          (value) => value !== item,
                                        ),
                                  )
                                }
                              />
                              {item}
                            </label>
                          ))}
                        </fieldset>
                        <p className="learning-footnote">
                          Autoévaluation : ces cases ne modifient pas votre
                          score ni votre niveau.
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {current.type === "summary" && (
                  <div className="learning-summary">
                    <span className="learning-section-label">
                      CE QUE VOUS EMPORTEZ
                    </span>
                    <h2>
                      Quelques repères.
                      <br />
                      De meilleures décisions.
                    </h2>
                    <div className="learning-summary-skills">
                      {lesson.skills.map((skill, index) => (
                        <div key={skill}>
                          <span>0{index + 1}</span>
                          <strong>{skill}</strong>
                        </div>
                      ))}
                    </div>
                    <div className="learning-summary-cards">
                      {lesson.flashcards.map((card) => (
                        <details key={card.front}>
                          <summary>
                            {card.front}
                            <Icon name="plus" size={17} />
                          </summary>
                          <p>{card.back}</p>
                        </details>
                      ))}
                    </div>
                    <button
                      className="button primary"
                      onClick={() => advanceTo(1)}
                    >
                      Passer à la pratique <Icon name="arrow" size={17} />
                    </button>
                  </div>
                )}
              </div>
              <div className="learning-sequence-footer">
                <button
                  className="learning-previous"
                  type="button"
                  disabled={sequence === 0}
                  onClick={() => jumpSequence(sequence - 1)}
                >
                  <Icon name="back" size={16} />
                  <span>Séquence précédente</span>
                </button>
                {sequence < sequences.length - 1 ? (
                  <button
                    type="button"
                    className="button primary"
                    onClick={() => jumpSequence(sequence + 1)}
                  >
                    Séquence suivante <Icon name="arrow" size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="button primary"
                    onClick={() => advanceTo(1)}
                  >
                    Passer à la pratique <Icon name="arrow" size={16} />
                  </button>
                )}
              </div>
            </>
          )}
          {tab === 1 && (
            <div className="learning-practice">
              <div className="learning-sequence-top">
                <span className="eyebrow">
                  MANIPULER / OBSERVER / EXPLIQUER
                </span>
                <Icon name="lab" size={22} />
              </div>
              <h2>
                Votre raisonnement compte
                <br />
                autant que le résultat.
              </h2>
              <p className="learning-lead">{lesson.exercise.prompt}</p>
              <label className="field">
                Votre raisonnement
                <textarea
                  rows={5}
                  value={exerciseText}
                  onChange={(event) => setExerciseText(event.target.value)}
                  placeholder="Mes hypothèses, ma méthode, mon résultat…"
                />
              </label>
              <p className="learning-footnote">
                Brouillon conservé pendant cette leçon. Votre réponse libre
                n’est pas évaluée automatiquement.
              </p>
              <div className="actions">
                <button
                  type="button"
                  className="button secondary"
                  disabled={hintVisible}
                  onClick={() => setHintVisible(true)}
                >
                  Un indice
                </button>
                <button
                  type="button"
                  className="text-button"
                  disabled={solutionVisible}
                  onClick={() => {
                    setHintVisible(true);
                    setSolutionVisible(true);
                  }}
                >
                  Comparer avec la solution <Icon name="arrow" size={16} />
                </button>
              </div>
              {hintVisible && (
                <section className="learning-answer-reveal">
                  <span className="eyebrow">INDICE 01</span>
                  <h3>Le premier repère</h3>
                  <p>{lesson.exercise.hint}</p>
                </section>
              )}
              {solutionVisible && (
                <section className="learning-answer-reveal">
                  <span className="eyebrow">COMPARER SA MÉTHODE</span>
                  <h3>Une solution expliquée</h3>
                  <strong className="learning-answer-number">
                    {lesson.exercise.answer}
                  </strong>
                  <p>{lesson.exercise.explanation}</p>
                </section>
              )}
              <div className="learning-practice-next">
                <button className="button primary" onClick={() => advanceTo(2)}>
                  Vérifier ma compréhension <Icon name="arrow" size={17} />
                </button>
              </div>
            </div>
          )}
          {tab === 2 && (
            <div className="learning-quiz">
              {!result ? (
                <>
                  <div className="learning-sequence-top">
                    <span className="eyebrow">
                      QUESTION {String(questionIndex + 1).padStart(2, "0")} /{" "}
                      {String(lesson.quiz.length).padStart(2, "0")}
                    </span>
                    <span className="learning-footnote">
                      Une preuve, pas une certification
                    </span>
                  </div>
                  <div
                    className="learning-quiz-progress"
                    aria-label={`Question ${questionIndex + 1} sur ${lesson.quiz.length}`}
                  >
                    {lesson.quiz.map((_, index) => (
                      <i
                        key={index}
                        className={index <= questionIndex ? "is-current" : ""}
                      />
                    ))}
                  </div>
                  <form onSubmit={submitQuiz}>
                    <fieldset className="learning-question">
                      <legend>{question.question}</legend>
                      <div className="learning-options">
                        {question.options.map((option, index) => (
                          <label
                            className={`learning-option ${selected === index ? "is-selected" : ""} ${answerConfirmed && index === question.answer ? "is-correct" : ""} ${answerConfirmed && selected === index && !selectionIsCorrect ? "is-incorrect" : ""}`}
                            key={option}
                          >
                            <input
                              className="learning-native-radio"
                              type="radio"
                              name={question.id}
                              value={index}
                              checked={selected === index}
                              required
                              disabled={answerConfirmed}
                              onChange={() =>
                                setAnswers((previous) => ({
                                  ...previous,
                                  [question.id]: index,
                                }))
                              }
                            />
                            <span
                              className="learning-option-letter"
                              aria-hidden="true"
                            >
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="learning-option-text">
                              {option}
                            </span>
                            <span
                              className="learning-option-indicator"
                              aria-hidden="true"
                            >
                              {answerConfirmed && index === question.answer ? (
                                <Icon name="check" size={16} />
                              ) : selected === index ? (
                                <i />
                              ) : null}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    {answerConfirmed ? (
                      <>
                        <div className="learning-quiz-feedback" role="status">
                          <span className="learning-feedback-icon">
                            <Icon
                              name={selectionIsCorrect ? "check" : "idea"}
                              size={20}
                            />
                          </span>
                          <div>
                            <strong>
                              {selectionIsCorrect
                                ? "Bien vu. Le repère est posé."
                                : "Un repère à ajuster."}
                            </strong>
                            <p>{question.explanation}</p>
                          </div>
                        </div>
                        <button
                          className="button primary"
                          type="button"
                          onClick={() => {
                            setQuestionIndex((previous) => previous + 1);
                            setAnswerConfirmed(false);
                            focusStage();
                          }}
                        >
                          Question suivante <Icon name="arrow" size={17} />
                        </button>
                      </>
                    ) : (
                      <div className="learning-quiz-actions">
                        <span className="learning-footnote">
                          {selected === undefined
                            ? "Choisissez la réponse qui vous semble juste."
                            : "Votre choix est posé. Prenez une seconde pour le vérifier."}
                        </span>
                        <button
                          className="button primary"
                          type="submit"
                          disabled={selected === undefined}
                        >
                          {questionIndex === lesson.quiz.length - 1
                            ? "Vérifier mes réponses"
                            : "Valider cette réponse"}
                          <Icon name="arrow" size={17} />
                        </button>
                      </div>
                    )}
                  </form>
                </>
              ) : (
                <div className="learning-quiz-result">
                  <div className="learning-result-orbit" aria-hidden="true">
                    <span>
                      {result.percent}
                      <small>%</small>
                    </span>
                    <i />
                    <i />
                  </div>
                  <span className="eyebrow">VOTRE POINT D’ÉTAPE</span>
                  <h2>
                    {result.passed
                      ? "L’idée est comprise.\nFaites-en quelque chose."
                      : "Une erreur utile.\nUn repère à reprendre."}
                  </h2>
                  <p className="learning-result-score" role="status">
                    {result.correct}/{result.total} · {result.percent} %
                  </p>
                  <p className="learning-lead">
                    {result.passed
                      ? "Repères validés sur ce quiz. La prochaine preuve se construit dans une situation concrète."
                      : "Votre prochaine révision ciblera cette notion. Comparez votre raisonnement aux explications, puis réessayez."}
                  </p>
                  <p className="learning-footnote">
                    Les repères de cette leçon rejoignent votre calendrier de
                    rappel. Les autoévaluations de révision restent distinctes
                    de ce quiz.
                  </p>
                  <button
                    className="text-button"
                    onClick={() => onNavigate("reviews")}
                  >
                    Ouvrir mes révisions <Icon name="arrow" size={16} />
                  </button>
                  <div className="learning-result-review">
                    {lesson.quiz.map((item, index) => (
                      <details key={item.id}>
                        <summary>
                          <span>
                            {answers[item.id] === item.answer ? (
                              <Icon name="check" size={16} />
                            ) : (
                              <Icon name="idea" size={16} />
                            )}
                          </span>
                          <span>
                            Question {index + 1} ·{" "}
                            {answers[item.id] === item.answer
                              ? "repère identifié"
                              : "à retravailler"}
                          </span>
                          <Icon name="plus" size={16} />
                        </summary>
                        <p>{item.question}</p>
                        <p>
                          <strong>À retenir : </strong>
                          {item.options[item.answer]}
                        </p>
                        <p>{item.explanation}</p>
                      </details>
                    ))}
                  </div>
                  <div className="actions">
                    <button
                      className="button secondary"
                      onClick={() => {
                        setResult(null);
                        setAnswers({});
                        setQuestionIndex(0);
                        setAnswerConfirmed(false);
                        submitted.current = false;
                        focusStage();
                      }}
                    >
                      Nouvelle tentative
                    </button>
                    <button
                      className="button primary"
                      onClick={() => {
                        setSequence(0);
                        advanceTo(result.passed ? 3 : 0);
                      }}
                    >
                      {result.passed
                        ? "Appliquer à un projet"
                        : "Revoir la leçon"}
                      <Icon name="arrow" size={17} />
                    </button>
                  </div>
                  <p className="learning-footnote">
                    Seuil de réussite : 80 %. Avec deux questions, les deux
                    réponses sont nécessaires.
                  </p>
                </div>
              )}
            </div>
          )}
          {tab === 3 && (
            <div className="learning-apply">
              <span className="eyebrow">DE LA NOTION À LA DÉCISION</span>
              <h2>
                La leçon devient
                <br />
                votre prochain mouvement.
              </h2>
              <p className="learning-lead">{lesson.application}</p>
              {state.projects.length > 0 ? (
                <form
                  className="learning-project-link"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!selectedProject) return;
                    update((previous) => ({
                      ...previous,
                      projects: previous.projects.map((project) =>
                        project.id === selectedProject
                          ? {
                              ...project,
                              lessonIds: [
                                ...new Set([...project.lessonIds, lesson.id]),
                              ],
                              nextAction: lesson.application,
                            }
                          : project,
                      ),
                    }));
                    setNotice(
                      "Leçon reliée au projet et prochaine action mise à jour. Vous pouvez la préciser dans l’incubateur.",
                    );
                  }}
                >
                  <label className="field">
                    Appliquer à un projet
                    <select
                      required
                      value={selectedProject}
                      onChange={(event) =>
                        setSelectedProject(event.target.value)
                      }
                    >
                      <option value="">Choisir un projet</option>
                      {state.projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button className="button primary" type="submit">
                    Relier cette compétence <Icon name="node" size={17} />
                  </button>
                  <p className="learning-footnote">
                    La mission ci-dessus remplacera la prochaine action du
                    projet.
                  </p>
                </form>
              ) : (
                <p className="learning-footnote">
                  Pas encore de projet ? La piste ci-dessous peut devenir un
                  premier terrain d’apprentissage.
                </p>
              )}
              {linkedProjects.length > 0 && (
                <p className="learning-linked">
                  <Icon name="check" size={16} />
                  Compétence reliée à{" "}
                  {linkedProjects.map((project) => project.title).join(", ")}.
                </p>
              )}
              <div className="learning-idea">
                <span className="learning-idea-symbol">
                  <Icon name="idea" size={34} />
                </span>
                <span className="eyebrow">UNE PISTE À VALIDER</span>
                <h3>{lesson.idea.title}</h3>
                <p>{lesson.idea.description}</p>
                <button className="button secondary" onClick={saveIdea}>
                  Garder cette idée dans l’incubateur{" "}
                  <Icon name="arrow" size={16} />
                </button>
              </div>
              {notice && (
                <p className="learning-notice" role="status">
                  <Icon name="check" size={16} />
                  {notice}
                </p>
              )}
              <button
                className="text-button"
                onClick={() => onNavigate("incubator")}
              >
                Ouvrir mon incubateur <Icon name="arrow" size={16} />
              </button>
            </div>
          )}
        </section>
        <aside className="learning-sidebar">
          {tab === 0 && (
            <nav
              className="learning-sequence-nav"
              aria-label="Séquences de la leçon"
            >
              <p className="eyebrow">LE FIL DE LA LEÇON</p>
              {sequences.map((item, index) => (
                <button
                  key={index}
                  aria-current={sequence === index ? "step" : undefined}
                  className={sequence === index ? "is-active" : ""}
                  onClick={() => jumpSequence(index)}
                >
                  <span className="learning-nav-point">
                    {index < sequence ? (
                      <Icon name="check" size={12} />
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </span>
                  <span>{item.title}</span>
                </button>
              ))}
            </nav>
          )}
          {tab !== 0 && (
            <div className="learning-side-concepts">
              <span className="eyebrow">VOS REPÈRES</span>
              {lesson.skills.map((skill, index) => (
                <p key={skill}>
                  <span>0{index + 1}</span>
                  {skill}
                </p>
              ))}
              <p className="learning-footnote">
                {latest
                  ? `Dernier quiz : ${latest.percent} % · ${latest.passed ? "repères validés" : "à revoir"}.`
                  : "Aucune tentative sur cette leçon."}
              </p>
            </div>
          )}
          <div className="learning-support">
            <details>
              <summary>
                Mon carnet <span>{note.trim() ? "1 note" : ""}</span>
                <Icon name="plus" size={15} />
              </summary>
              <label className="field">
                Ce que je veux retenir
                <textarea
                  rows={4}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Une intuition, une question…"
                />
              </label>
              {note !== (state.notes[lesson.id] || "") && (
                <p className="learning-footnote" role="status">
                  Brouillon non enregistré. Enregistrez vos notes avant de
                  quitter.
                </p>
              )}
              <button
                className="button secondary"
                onClick={() => {
                  update((previous) => ({
                    ...previous,
                    notes: { ...previous.notes, [lesson.id]: note },
                  }));
                  setNotice("Notes enregistrées dans votre espace local.");
                }}
              >
                Enregistrer les notes
              </button>
              {notice.startsWith("Notes") && (
                <p className="learning-footnote" role="status">
                  {notice}
                </p>
              )}
            </details>
            <details>
              <summary>
                Sources & version <Icon name="plus" size={15} />
              </summary>
              <p className="learning-footnote">
                Version {lesson.version} · {lesson.editorialStatus}
              </p>
              <ul>
                {lesson.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.title}
                      <Icon name="external" size={12} />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="learning-footnote">
                Exemples pédagogiques fictifs ; aucune vérification d’actualité
                revendiquée.
              </p>
            </details>
            {lesson.prerequisites.length > 0 && (
              <details>
                <summary>
                  Les prérequis <Icon name="plus" size={15} />
                </summary>
                {lesson.prerequisites.map((id) => (
                  <button
                    key={id}
                    className="text-button"
                    onClick={() => onNavigate(`lesson/${id}`)}
                  >
                    {lessons.find((item) => item.id === id)?.title || id}
                    <Icon name="arrow" size={14} />
                  </button>
                ))}
              </details>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

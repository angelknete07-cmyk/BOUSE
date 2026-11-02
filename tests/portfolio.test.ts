import test from "node:test";
import assert from "node:assert/strict";
import {
  buildPortfolio,
  currentQuizAttempts,
  latestCurrentAttempt,
  portfolioMarkdown,
  type PortfolioLesson,
} from "../src/lib/portfolio.ts";
import {
  createSimulationSnapshot,
  defaultSimulationInput,
} from "../src/lib/simulation.ts";
import type {
  AppState,
  Attempt,
  ProjectDecision,
  ProjectExperiment,
  ReviewEvent,
} from "../src/lib/types.ts";

const now = new Date("2026-11-02T14:00:00.000Z");
const catalog: PortfolioLesson[] = [
  {
    id: "cash",
    title: "Marge et trésorerie",
    domain: "Finance",
    version: "1.0.0",
    skills: ["Trésorerie"],
  },
  {
    id: "prompt",
    title: "Un prompt structuré",
    domain: "Intelligence artificielle",
    version: "2.0.0",
    skills: ["Vérification"],
  },
];
function state(): AppState {
  return {
    schemaVersion: 1,
    profile: null,
    attempts: [],
    projects: [],
    notes: {},
    lastLessonId: null,
  };
}
function attempt(
  at: string,
  passed = true,
  lessonId = "cash",
  lessonVersion?: string,
): Attempt {
  return {
    lessonId,
    ...(lessonVersion === undefined ? {} : { lessonVersion }),
    answers: { q1: passed ? 0 : 1 },
    correct: passed ? 1 : 0,
    total: 1,
    percent: passed ? 100 : 0,
    passed,
    at,
  };
}
const experiment: ProjectExperiment = {
  id: "test-1",
  projectId: "project-1",
  title: "Explorer la relance des factures",
  hypothesis: "Les artisans paieront pour un suivi régulier.",
  protocol: "Interroger cinq artisans sur leur pratique actuelle.",
  successCriterion: "Trois engagements écrits pour un essai.",
  reviewOn: "2026-11-02",
  createdAt: "2026-10-30T10:00:00.000Z",
  result: {
    observation: "Deux engagements ont été recueillis.",
    evidence: "Notes anonymisées des cinq entretiens.",
    conclusion: "inconclusive",
    recordedAt: "2026-11-01T10:00:00.000Z",
  },
};
const decision: ProjectDecision = {
  id: "decision-1",
  projectId: "project-1",
  experimentId: "test-1",
  title: "Limiter le pilote",
  context: "Deux artisans acceptent un essai.",
  options: "Faire un pilote manuel ou automatiser immédiatement.",
  choice: "Tester manuellement avec les deux ateliers.",
  expectedOutcome:
    "Un suivi utilisé chaque semaine en moins de trente minutes.",
  confidence: 65,
  risk: "Le temps de préparation peut dépasser le bénéfice.",
  reviewOn: "2026-11-02",
  createdAt: "2026-11-01T11:00:00.000Z",
  outcome: {
    observed: "Un atelier a utilisé le suivi, le second a arrêté.",
    comparison: "mixed",
    learning: "Mesurer l’usage avant d’automatiser.",
    recordedAt: "2026-11-02T12:00:00.000Z",
  },
};
function documentedState(): AppState {
  return {
    ...state(),
    projects: [
      {
        id: "project-1",
        title: "Un suivi pour les ateliers",
        problem: "Les impayés retardent les achats.",
        customer: "Artisans indépendants",
        hypothesis: "Un suivi régulier aide à anticiper.",
        nextAction: "Mesurer un essai manuel.",
        stage: "Recherche",
        lessonIds: ["cash"],
        createdAt: "2026-10-29T09:00:00.000Z",
      },
    ],
    experiments: [structuredClone(experiment)],
    decisions: [structuredClone(decision)],
    simulations: [
      createSimulationSnapshot(
        defaultSimulationInput,
        "Paiements retardés",
        "simulation-1",
        new Date("2026-11-01T13:00:00.000Z"),
      ),
    ],
  };
}

test("the latest chronological current quiz wins over the order of an imported array", () => {
  const value = state();
  value.attempts = [
    attempt("2026-11-02T13:00:00.000Z", false),
    attempt("2026-11-01T13:00:00.000Z", true),
  ];
  const entry = buildPortfolio(catalog, value, now).lessons[0]!;
  assert.equal(entry.status, "revisit");
  assert.equal(entry.latest?.passed, false);
  assert.deepEqual(
    entry.currentAttempts.map((a) => a.percent),
    [100, 0],
  );
});

test("a newer successful current quiz can replace a failure without choosing the best historical score", () => {
  const value = state();
  value.attempts = [
    attempt("2026-10-31T10:00:00.000Z", false),
    attempt("2026-11-01T10:00:00.000Z", true),
  ];
  const portfolio = buildPortfolio(catalog, value, now);
  assert.equal(portfolio.summary.quizPassed, 1);
  assert.equal(portfolio.summary.quizToRevisit, 0);
  assert.equal(portfolio.lessons[0]!.latest?.at, "2026-11-01T10:00:00.000Z");
});

test("equal timestamps keep source order and the final entry wins a deterministic tie", () => {
  const date = "2026-11-01T10:00:00.000Z";
  assert.equal(
    latestCurrentAttempt(
      catalog[0]!,
      [attempt(date), attempt(date, false)],
      now,
    )?.passed,
    false,
  );
  assert.equal(
    latestCurrentAttempt(
      catalog[0]!,
      [attempt(date, false), attempt(date)],
      now,
    )?.passed,
    true,
  );
});

test("legacy attempts belong only to the initial version and other versions remain archived", () => {
  const value = state();
  value.attempts = [
    attempt("2026-11-01T10:00:00.000Z"),
    attempt("2026-11-01T10:00:00.000Z", true, "prompt"),
    attempt("2026-11-01T11:00:00.000Z", false, "prompt", "1.0.0"),
    attempt("2026-11-01T12:00:00.000Z", true, "prompt", "2.0.0"),
    attempt("2026-11-01T13:00:00.000Z", false, "prompt", "3.0.0"),
  ];
  const portfolio = buildPortfolio(catalog, value, now);
  assert.equal(portfolio.summary.quizPassed, 2);
  assert.equal(portfolio.lessons[1]!.currentAttempts.length, 1);
  assert.equal(portfolio.lessons[1]!.archivedAttempts.length, 3);
  assert.equal(portfolio.archivedAttempts.length, 3);
});

test("future, invalid and noncanonical dates stay visible in archives without giving a current status", () => {
  const value = state();
  value.attempts = [
    attempt("2026-11-03T10:00:00.000Z"),
    attempt("not-a-date"),
    attempt("2026-11-01T11:00:00+01:00"),
  ];
  const portfolio = buildPortfolio(catalog, value, now);
  assert.equal(portfolio.lessons[0]!.status, "untried");
  assert.equal(portfolio.lessons[0]!.latest, undefined);
  assert.deepEqual(portfolio.archivedAttempts, value.attempts);
});

test("a valid quiz recorded exactly at the evaluation instant is eligible", () => {
  const saved = attempt(now.toISOString());
  assert.deepEqual(latestCurrentAttempt(catalog[0]!, [saved], now), saved);
});

test("invalid clocks and ambiguous catalog identities fail instead of inventing evidence", () => {
  assert.throws(() => buildPortfolio(catalog, state(), new Date("invalid")));
  assert.throws(() =>
    currentQuizAttempts(catalog[0]!, [], new Date("invalid")),
  );
  assert.throws(() => buildPortfolio([catalog[0]!, catalog[0]!], state(), now));
  assert.throws(() =>
    buildPortfolio([{ ...catalog[0]!, version: " " }], state(), now),
  );
  assert.throws(() =>
    latestCurrentAttempt({ id: "", version: "1.0.0" }, [], now),
  );
});

test("quiz helper results do not share mutable answers with source attempts", () => {
  const source = [attempt("2026-11-01T10:00:00.000Z")];
  const latest = latestCurrentAttempt(catalog[0]!, source, now)!;
  latest.answers.q1 = 20;
  assert.equal(source[0]!.answers.q1, 0);
  const current = currentQuizAttempts(catalog[0]!, source, now);
  current[0]!.percent = 17;
  assert.equal(source[0]!.percent, 100);
});

test("an empty portfolio contains only untried notions and no manufactured activity", () => {
  const result = buildPortfolio(catalog, state(), now);
  assert.deepEqual(result.summary, {
    totalLessons: 2,
    quizPassed: 0,
    quizToRevisit: 0,
    quizUntested: 2,
    notes: 0,
    projects: 0,
    observedTests: 0,
    reviewedDecisions: 0,
    simulations: 0,
    reviewSelfAssessments: 0,
  });
  assert.equal(result.asOf, now.toISOString());
  assert.deepEqual(result.archivedAttempts, []);
});

test("notes preserve original whitespace and include content outside the current catalogue without fabricated dates", () => {
  const value = state();
  value.notes = {
    cash: "  Première ligne.\n\nDeuxième ligne.  ",
    lost: "Une note ancienne.",
    empty: " \n ",
  };
  const result = buildPortfolio(catalog, value, now);
  assert.equal(result.summary.notes, 2);
  assert.equal(result.lessons[0]!.note, value.notes.cash);
  assert.equal(result.notes[1]!.catalogued, false);
  assert.match(result.notes[1]!.title, /Note d’une ancienne leçon.*lost/);
  assert.equal(result.notes[1]!.body, value.notes.lost);
  assert.equal(Object.hasOwn(result.notes[0]!, "createdAt"), false);
});

test("project evidence is linked by its real project identity and is never a passed quiz", () => {
  const value = documentedState();
  value.experiments!.push({
    ...experiment,
    id: "foreign",
    projectId: "another-project",
  });
  const result = buildPortfolio(catalog, value, now);
  assert.equal(result.lessons[0]!.projects.length, 1);
  assert.equal(result.lessons[1]!.projects.length, 0);
  assert.equal(result.projects[0]!.experiments.length, 1);
  assert.equal(result.summary.observedTests, 1);
  assert.equal(result.summary.reviewedDecisions, 1);
  assert.equal(result.summary.quizPassed, 0);
  assert.equal(result.lessons[0]!.status, "untried");
});

test("a planned test and a decision without outcome do not count as observed evidence", () => {
  const value = documentedState();
  delete value.experiments![0]!.result;
  delete value.decisions![0]!.outcome;
  const result = buildPortfolio(catalog, value, now);
  assert.equal(result.summary.projects, 1);
  assert.equal(result.summary.observedTests, 0);
  assert.equal(result.summary.reviewedDecisions, 0);
});

test("review self assessments are counted separately and cannot manufacture quiz mastery", () => {
  const event: ReviewEvent = {
    id: "recall-1",
    cardId: "cash::1.0.0::0",
    lessonId: "cash",
    lessonVersion: "1.0.0",
    rating: "remembered",
    at: "2026-11-01T10:00:00.000Z",
    dueAt: "2026-11-04T10:00:00.000Z",
    intervalDays: 3,
    step: 1,
  };
  const value = state();
  value.reviewEvents = [
    event,
    {
      ...event,
      id: "future",
      at: "2026-11-03T10:00:00.000Z",
      dueAt: "2026-11-06T10:00:00.000Z",
    },
    { ...event, id: "invalid", dueAt: event.at },
  ];
  const result = buildPortfolio(catalog, value, now);
  assert.equal(result.summary.reviewSelfAssessments, 1);
  assert.equal(result.summary.quizPassed, 0);
});

test("only valid stored financial comparisons are counted and they remain hypothetical", () => {
  const value = documentedState();
  value.simulations!.push({
    ...value.simulations![0]!,
    id: "invalid",
    modelVersion: "9.0.0",
  } as never);
  const result = buildPortfolio(catalog, value, now);
  assert.equal(result.summary.simulations, 1);
  assert.equal(result.summary.quizPassed, 0);
  assert.equal(result.simulations[0]!.modelVersion, "1.0.0");
});

test("portfolio results do not alias the catalog, project history or stored simulation assumptions", () => {
  const value = documentedState();
  const original = structuredClone(value);
  const result = buildPortfolio(catalog, value, now);
  result.lessons[0]!.lesson.skills.push("Inventé");
  result.lessons[0]!.projects[0]!.title = "Changed";
  result.projects[0]!.experiments[0]!.result!.observation = "Changed";
  result.projects[0]!.decisions[0]!.outcome!.learning = "Changed";
  result.simulations[0]!.input.baseline.price = 999;
  assert.deepEqual(value, original);
  assert.deepEqual(catalog[0]!.skills, ["Trésorerie"]);
});

test("inconsistent quiz result fields stay archived instead of being presented as a current success", () => {
  const value = state();
  value.attempts = [
    { ...attempt("2026-11-01T10:00:00.000Z"), percent: 50 },
    { ...attempt("2026-11-01T11:00:00.000Z"), passed: "yes" } as never,
    { ...attempt("2026-11-01T12:00:00.000Z"), answers: [] } as never,
  ];
  const result = buildPortfolio(catalog, value, now);
  assert.equal(result.summary.quizPassed, 0);
  assert.deepEqual(result.archivedAttempts, value.attempts);
});

test("quiz records for missing lessons are preserved globally without being attributed to another notion", () => {
  const value = state();
  const unknown = attempt("2026-11-01T10:00:00.000Z", true, "removed", "4.0.0");
  value.attempts = [unknown];
  const result = buildPortfolio(catalog, value, now);
  assert.deepEqual(result.archivedAttempts, [unknown]);
  assert.equal(result.lessons[0]!.archivedAttempts.length, 0);
  assert.equal(result.summary.quizUntested, 2);
  assert.match(
    portfolioMarkdown(catalog, value, now),
    /Leçon absente du catalogue actuel/,
  );
});

test("Markdown is dated as an export and protects literal notes and titles without a fake verification date", () => {
  const ticks = String.fromCharCode(96);
  const body =
    "Note brute\n" +
    ticks.repeat(4) +
    "\n# Ne pas sortir de la note\n<img src='x'>\n";
  const value = state();
  value.notes = { cash: body, lost: "Ancienne note conservée." };
  const alteredCatalog = [
    { ...catalog[0]!, title: "<img src='x'>\n# Titre injecté" },
  ];
  const markdown = portfolioMarkdown(alteredCatalog, value, now);
  assert.ok(
    markdown.startsWith(
      '---\ntitle: "Portfolio d’apprentissage"\ntype: "bouse-learning-portfolio"\nexported_at: "' +
        now.toISOString() +
        '"\nschema_version: 1\n---',
    ),
  );
  assert.ok(
    markdown.includes(
      ticks.repeat(5) + "text\n" + body + "\n" + ticks.repeat(5),
    ),
  );
  assert.ok(markdown.includes("&lt;img src='x'&gt; \\# Titre injecté"));
  assert.ok(markdown.includes("Ancienne note conservée."));
  assert.doesNotMatch(markdown, /last_verified|date de saisie :/);
  assert.match(markdown, /aucun coffre n’a été ouvert, modifié ou synchronisé/);
});

test("Markdown retains original plans, expectations, observations and exact simulation assumptions", () => {
  const value = documentedState();
  value.simulations![0]!.input.baseline.price = 1.005;
  value.simulations![0]!.input.baseline.units = 13.50001;
  const markdown = portfolioMarkdown(catalog, value, now);
  for (const content of [
    experiment.hypothesis,
    experiment.protocol,
    experiment.successCriterion,
    experiment.result!.evidence,
    decision.expectedOutcome,
    decision.outcome!.observed,
    decision.outcome!.learning,
    '"price": 1.005',
    '"units": 13.50001',
    "modèle 1.0.0",
    "Exploration hypothétique",
    "sans validation indépendante",
  ])
    assert.ok(markdown.includes(content), "Export must preserve " + content);
  assert.match(markdown, /Cette date ne date pas son stade actuel/);
  assert.match(
    markdown,
    /Les exercices et teach-back ne sont pas enregistrés comme réalisations/,
  );
});

test("Markdown preserves current and excluded quiz history without turning archived failures or future success into a status", () => {
  const value = state();
  value.attempts = [
    attempt("2026-11-01T10:00:00.000Z"),
    attempt("2026-11-01T11:00:00.000Z", false, "cash", "0.9.0"),
    attempt("2026-11-03T10:00:00.000Z"),
    attempt("broken-clock"),
  ];
  const original = structuredClone(value);
  const markdown = portfolioMarkdown(catalog, value, now);
  for (const recorded of value.attempts)
    assert.ok(markdown.includes(recorded.at));
  assert.match(markdown, /Version différente de la version courante/);
  assert.match(markdown, /Date postérieure à la date d’export/);
  assert.match(markdown, /Date invalide ou non canonique/);
  assert.match(markdown, /Quiz courants validés : 1 \/ 2/);
  assert.deepEqual(value, original);
});

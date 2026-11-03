import test from "node:test";
import assert from "node:assert/strict";
import {
  buildProjectLearningPlan,
  isLearningGoalIds,
  projectLearningMarkdown,
  setProjectLearningGoals,
  type LearningPlanLesson,
} from "../src/lib/projectLearning.ts";
import type { Attempt, Project } from "../src/lib/types.ts";

const now = new Date("2026-11-02T14:00:00.000Z");
const catalog: LearningPlanLesson[] = [
  {
    id: "base",
    title: "Les fondations",
    domain: "Finance",
    version: "1.0.0",
    minutes: 10,
    prerequisites: [],
  },
  {
    id: "cost",
    title: "Calculer les coûts",
    domain: "Finance",
    version: "1.0.0",
    minutes: 15,
    prerequisites: ["base"],
  },
  {
    id: "cash",
    title: "Anticiper la trésorerie",
    domain: "Finance",
    version: "2.0.0",
    minutes: 20,
    prerequisites: ["base"],
  },
  {
    id: "plan",
    title: "Construire un prévisionnel",
    domain: "Finance",
    version: "1.0.0",
    minutes: 25,
    prerequisites: ["cost", "cash"],
  },
];
function project(goals?: string[]): Project {
  return {
    id: "project-1",
    title: "Mon atelier",
    problem: "Des factures sont payées trop tard.",
    customer: "Artisans",
    hypothesis: "Un suivi régulier aide à anticiper.",
    nextAction: "Interroger trois artisans.",
    stage: "Recherche",
    lessonIds: ["cash"],
    createdAt: "2026-10-31T10:00:00.000Z",
    ...(goals === undefined ? {} : { learningGoalIds: goals }),
  };
}
function attempt(
  id: string,
  passed = true,
  version?: string,
  at = "2026-11-01T10:00:00.000Z",
): Attempt {
  return {
    lessonId: id,
    ...(version === undefined ? {} : { lessonVersion: version }),
    answers: { q1: passed ? 0 : 1 },
    correct: passed ? 1 : 0,
    total: 1,
    percent: passed ? 100 : 0,
    passed,
    at,
  };
}
function plan(goals: string[] = ["plan"], attempts: Attempt[] = []) {
  return buildProjectLearningPlan(catalog, project(goals), { attempts }, now);
}

test("saved goal identities permit unavailable content but reject ambiguity and malformed fields", () => {
  assert.equal(isLearningGoalIds([]), true);
  assert.equal(isLearningGoalIds(["base", "an-older-lesson"]), true);
  for (const value of [
    null,
    {},
    "base",
    [null],
    [1],
    [""],
    [" "],
    [" base"],
    ["base "],
    ["x".repeat(161)],
    ["base", "base"],
  ])
    assert.equal(isLearningGoalIds(value), false);
});

test("setting goals preserves the whole project and copies both source and choices", () => {
  const original = project();
  const choices = ["plan"];
  const updated = setProjectLearningGoals(original, choices);
  assert.deepEqual(updated, { ...original, learningGoalIds: ["plan"] });
  assert.deepEqual(original, project());
  choices.push("cash");
  updated.lessonIds.push("base");
  assert.deepEqual(updated.learningGoalIds, ["plan"]);
  assert.deepEqual(original.lessonIds, ["cash"]);
  assert.equal(updated.stage, original.stage);
  assert.equal(updated.nextAction, original.nextAction);
  assert.deepEqual(setProjectLearningGoals(updated, []).learningGoalIds, []);
  assert.throws(() => setProjectLearningGoals(original, ["base", "base"]));
});

test("an older project without goals stays empty instead of promoting applied lesson links", () => {
  const original = project();
  const result = buildProjectLearningPlan(
    catalog,
    original,
    { attempts: [attempt("cash", true, "2.0.0")] },
    now,
  );
  assert.deepEqual(result.goalIds, []);
  assert.deepEqual(result.steps, []);
  assert.equal(result.next, undefined);
  assert.equal(result.remainingMinutes, 0);
  assert.equal(result.allCurrentQuizzesPassed, false);
  assert.equal(Object.hasOwn(original, "learningGoalIds"), false);
});

test("shared prerequisites occur once before each target in a deterministic closure", () => {
  const result = plan(["cost", "cash"]);
  assert.deepEqual(
    result.steps.map((entry) => entry.lesson.id),
    ["base", "cost", "cash"],
  );
  assert.deepEqual(
    result.steps.map((entry) => entry.isGoal),
    [false, true, true],
  );
  assert.deepEqual(result.steps[0]!.requiredBy, ["cost", "cash"]);
  assert.deepEqual(result.steps[1]!.requiredBy, ["cost"]);
  assert.equal(result.remainingMinutes, 45);
  assert.equal(result.next?.lesson.id, "base");
});

test("a target with two prerequisites stays blocked until both current quizzes pass", () => {
  const oneMissing = plan(["plan"], [attempt("base"), attempt("cost")]);
  assert.equal(
    oneMissing.steps.find((entry) => entry.lesson.id === "plan")?.status,
    "blocked",
  );
  assert.deepEqual(oneMissing.steps.at(-1)!.unmetPrerequisiteIds, ["cash"]);
  assert.equal(oneMissing.next?.lesson.id, "cash");
  const ready = plan(
    ["plan"],
    [attempt("base"), attempt("cost"), attempt("cash", true, "2.0.0")],
  );
  assert.equal(ready.steps.at(-1)!.status, "ready");
  assert.equal(ready.next?.lesson.id, "plan");
});

test("the latest chronological failure asks for review without taking the best or last imported score", () => {
  const result = plan(
    ["cost"],
    [
      attempt("base", false, undefined, "2026-11-02T13:00:00.000Z"),
      attempt("base", true, undefined, "2026-11-01T10:00:00.000Z"),
    ],
  );
  assert.equal(result.steps[0]!.status, "revisit");
  assert.equal(result.steps[1]!.status, "blocked");
  assert.equal(result.next?.latest?.percent, 0);
});

test("current version and real time rules are inherited for legacy, future and invalid quizzes", () => {
  const result = plan(
    ["cash"],
    [
      attempt("base"),
      attempt("cash"),
      attempt("cash", true, "2.0.0", "2026-11-03T10:00:00.000Z"),
      attempt("cash", true, "2.0.0", "invalid-date"),
    ],
  );
  assert.equal(result.steps[0]!.status, "passed");
  assert.equal(result.steps[1]!.status, "ready");
  assert.equal(result.steps[1]!.latest, undefined);
  assert.equal(result.allCurrentQuizzesPassed, false);
});

test("a passed target preserves its quiz evidence while its prerequisite gap remains visible", () => {
  const result = plan(["cost"], [attempt("cost")]);
  const goal = result.steps[1]!;
  assert.equal(goal.status, "passed");
  assert.deepEqual(goal.unmetPrerequisiteIds, ["base"]);
  assert.equal(result.passedCount, 1);
  assert.equal(result.remainingMinutes, 10);
  assert.equal(result.next?.lesson.id, "base");
  assert.equal(result.allCurrentQuizzesPassed, false);
});

test("all current quizzes passing completes only the quiz plan and has no next lesson", () => {
  const attempts = [
    attempt("base"),
    attempt("cost"),
    attempt("cash", true, "2.0.0"),
    attempt("plan"),
  ];
  const before = structuredClone(attempts);
  const result = plan(["plan"], attempts);
  assert.equal(result.passedCount, 4);
  assert.equal(result.remainingMinutes, 0);
  assert.equal(result.allCurrentQuizzesPassed, true);
  assert.equal(result.next, undefined);
  assert.deepEqual(attempts, before);
});

test("unknown goals remain explicit and cannot falsely complete a partly available plan", () => {
  const result = plan(
    ["retired-lesson", "cost"],
    [attempt("base"), attempt("cost")],
  );
  assert.deepEqual(result.goalIds, ["retired-lesson", "cost"]);
  assert.deepEqual(result.missingGoalIds, ["retired-lesson"]);
  assert.equal(result.passedCount, 2);
  assert.equal(result.allCurrentQuizzesPassed, false);
  assert.equal(result.next, undefined);
});

test("a missing prerequisite blocks its descendants even if imported own quizzes passed", () => {
  const broken: LearningPlanLesson[] = [
    { ...catalog[0]!, prerequisites: ["missing-foundation"] },
    catalog[1]!,
  ];
  const result = buildProjectLearningPlan(
    broken,
    project(["cost"]),
    { attempts: [attempt("base"), attempt("cost")] },
    now,
  );
  assert.deepEqual(result.missingPrerequisiteIds, ["missing-foundation"]);
  assert.deepEqual(
    result.steps.map((entry) => entry.status),
    ["blocked", "blocked"],
  );
  assert.deepEqual(result.steps[1]!.unmetPrerequisiteIds, ["base"]);
  assert.equal(result.passedCount, 0);
  assert.equal(result.next, undefined);
  assert.equal(result.allCurrentQuizzesPassed, false);
});

test("cycles are finite, block dependent targets and leave an unrelated branch available", () => {
  const cyclic: LearningPlanLesson[] = [
    { ...catalog[0]!, id: "a", prerequisites: ["b"] },
    { ...catalog[0]!, id: "b", prerequisites: ["a"] },
    { ...catalog[0]!, id: "dependent", prerequisites: ["a"] },
    catalog[1]!,
    catalog[0]!,
  ];
  const result = buildProjectLearningPlan(
    cyclic,
    project(["dependent", "cost"]),
    { attempts: [attempt("a"), attempt("b"), attempt("dependent")] },
    now,
  );
  assert.deepEqual(result.cycleIds, ["a", "b"]);
  assert.deepEqual(
    result.steps
      .filter((entry) => ["a", "b", "dependent"].includes(entry.lesson.id))
      .map((entry) => entry.status),
    ["blocked", "blocked", "blocked"],
  );
  assert.equal(result.next?.lesson.id, "base");
  assert.equal(result.allCurrentQuizzesPassed, false);
});

test("a self cycle is reported once and a cycle outside the chosen closure has no effect", () => {
  const self = { ...catalog[0]!, id: "self", prerequisites: ["self"] };
  const result = buildProjectLearningPlan(
    [...catalog, self],
    project(["self"]),
    { attempts: [] },
    now,
  );
  assert.deepEqual(result.cycleIds, ["self"]);
  assert.equal(result.steps.length, 1);
  assert.equal(result.steps[0]!.status, "blocked");
  assert.deepEqual(
    buildProjectLearningPlan(
      [...catalog, self],
      project(["base"]),
      { attempts: [] },
      now,
    ).cycleIds,
    [],
  );
});

test("overlapping cycles include nodes reached through a finished DFS branch", () => {
  const cyclic = [
    { ...catalog[0]!, id: "a", prerequisites: ["b", "c"] },
    { ...catalog[0]!, id: "b", prerequisites: ["a"] },
    { ...catalog[0]!, id: "c", prerequisites: ["d"] },
    { ...catalog[0]!, id: "d", prerequisites: ["b"] },
  ];
  const result = buildProjectLearningPlan(
    cyclic,
    project(["a"]),
    { attempts: [] },
    now,
  );
  assert.deepEqual(result.cycleIds, ["a", "b", "c", "d"]);
  assert.equal(result.steps.length, 4);
  assert.ok(result.steps.every((entry) => entry.status === "blocked"));
  assert.equal(result.next, undefined);
});

test("outputs do not alias catalogue, project, attempts or the selected next row", () => {
  const lessons = structuredClone(catalog);
  const original = project(["cost"]);
  const attempts = [attempt("base", false)];
  const result = buildProjectLearningPlan(lessons, original, { attempts }, now);
  result.goalIds.push("cash");
  result.steps[0]!.lesson.title = "Changed";
  result.steps[0]!.lesson.prerequisites.push("unexpected");
  result.steps[0]!.requiredBy.push("unexpected");
  result.steps[0]!.latest!.answers.q1 = 9;
  result.next!.lesson.title = "Independent next copy";
  assert.deepEqual(lessons, catalog);
  assert.deepEqual(original.learningGoalIds, ["cost"]);
  assert.equal(attempts[0]!.answers.q1, 1);
  assert.equal(result.steps[0]!.lesson.title, "Changed");
});

test("bad catalog identities, versions, durations and prerequisites are refused", () => {
  for (const invalid of [
    [catalog[0]!, catalog[0]!],
    [{ ...catalog[0]!, id: "" }],
    [{ ...catalog[0]!, version: " " }],
    [{ ...catalog[0]!, minutes: -1 }],
    [{ ...catalog[0]!, minutes: Number.NaN }],
    [{ ...catalog[0]!, minutes: Number.POSITIVE_INFINITY }],
    [{ ...catalog[0]!, prerequisites: ["base", "base"] }],
  ])
    assert.throws(() =>
      buildProjectLearningPlan(
        invalid,
        project(["base"]),
        { attempts: [] },
        now,
      ),
    );
});

test("invalid stored choices and clocks fail explicitly rather than producing a fictitious plan", () => {
  for (const learningGoalIds of [null, {}, ["base", "base"], [" "]])
    assert.throws(() =>
      buildProjectLearningPlan(
        catalog,
        { ...project(), learningGoalIds } as Project,
        { attempts: [] },
        now,
      ),
    );
  assert.throws(() =>
    buildProjectLearningPlan(
      catalog,
      project(),
      { attempts: [] },
      new Date("invalid"),
    ),
  );
});

test("shared work is counted once and indicative remaining time excludes passed quizzes", () => {
  const result = plan(["plan", "cash"], [attempt("base"), attempt("cost")]);
  assert.equal(result.steps.length, 4);
  assert.equal(result.remainingMinutes, 45);
  assert.equal(result.passedCount, 2);
  assert.deepEqual(
    result.steps.find((entry) => entry.lesson.id === "base")!.requiredBy,
    ["plan", "cash"],
  );
});

test("export preserves unavailable identities, versions and the actual quiz status", () => {
  const value = project(["plan", "retired-lesson"]);
  const markdown = projectLearningMarkdown(
    catalog,
    value,
    { attempts: [attempt("base", false)] },
    now,
  );
  assert.ok(markdown.startsWith("## Parcours d’apprentissage du projet\n"));
  assert.ok(markdown.includes(now.toISOString()));
  assert.ok(markdown.includes("retired-lesson"));
  assert.ok(markdown.includes("2.0.0"));
  assert.ok(markdown.includes("Quiz courant à reprendre"));
  assert.ok(markdown.includes("Prérequis dérivé"));
  assert.ok(markdown.includes("pas une estimation de durée du projet"));
  assert.ok(markdown.includes("ni validation du projet"));
  assert.deepEqual(value.learningGoalIds, ["plan", "retired-lesson"]);
});

test("export escapes headings and tables while retaining exact saved goal text in a protected block", () => {
  const weirdId = "retired` ``` | <goal>";
  const lessons = [{ ...catalog[0]!, title: "Fondations | # <test> `titre`" }];
  const markdown = projectLearningMarkdown(
    lessons,
    project(["base", weirdId]),
    { attempts: [] },
    now,
  );
  assert.ok(markdown.includes("Fondations \\| \\# &lt;test&gt; \\`titre\\`"));
  assert.ok(markdown.includes(JSON.stringify(["base", weirdId], null, 2)));
  assert.ok(markdown.includes("````json\n"));
});

test("an empty export does not invent goals, completion or applied evidence", () => {
  const markdown = projectLearningMarkdown(
    catalog,
    project(),
    { attempts: [] },
    now,
  );
  assert.ok(markdown.includes("Aucun objectif d’apprentissage choisi"));
  assert.ok(markdown.includes("Aucune prochaine notion disponible"));
  assert.ok(!markdown.includes("100 %"));
  assert.ok(!markdown.includes("last_verified"));
});

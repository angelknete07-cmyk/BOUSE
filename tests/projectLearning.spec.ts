import { readFile } from "node:fs/promises";
import { pickInTree } from "./treeHelpers";
import { test, expect, type Page } from "@playwright/test";
import { lessons, type Lesson } from "../src/data/lessons";
import type { AppState, Attempt } from "../src/lib/types";

const storageKey = "bouse.academy.v1:guest";
const fixedNow = "2026-11-03T10:00:00.000Z";
const projectId = "learning-project-demo";
const finance = lessons.find((lesson) => lesson.id === "seuil-rentabilite")!;
const firstFinance = lessons.find(
  (lesson) => lesson.id === "ca-marge-tresorerie",
)!;
const firstAI = lessons.find((lesson) => lesson.id === "comprendre-llm")!;
const prompt = lessons.find((lesson) => lesson.id === "prompt-structure")!;
const automation = lessons.find(
  (lesson) => lesson.id === "automatisation-agent",
)!;

function savedState(): AppState {
  return {
    schemaVersion: 1,
    profile: {
      name: "Profil démo",
      level: "Débutant++",
      goal: "Apprendre pour construire un projet utile",
      interests: ["Finance", "Intelligence artificielle"],
      minutes: 20,
      preference: "Appliquer à mon projet",
      diagnostic: { finance: 1, business: 2, ai: 0 },
    },
    attempts: [],
    projects: [
      {
        id: projectId,
        title: "Prévoir le cash d’un atelier",
        problem: "Les retards de paiement empêchent d’anticiper les achats.",
        customer: "Artisans indépendants",
        hypothesis:
          "Un suivi régulier aide à repérer les tensions de trésorerie.",
        nextAction: "Interroger cinq artisans avant de développer un outil.",
        stage: "Recherche",
        // An existing application link never becomes a learning goal or a quiz.
        lessonIds: [firstAI.id],
        createdAt: "2026-11-02T12:00:00.000Z",
      },
    ],
    notes: {},
    lastLessonId: null,
  };
}

function attempt(
  lesson: Lesson,
  passed: boolean,
  at: string,
  version = lesson.version,
): Attempt {
  const answers = Object.fromEntries(
    lesson.quiz.map((question) => [
      question.id,
      passed
        ? question.answer
        : (question.answer + 1) % question.options.length,
    ]),
  );
  return {
    lessonId: lesson.id,
    lessonVersion: version,
    answers,
    correct: passed ? lesson.quiz.length : 0,
    total: lesson.quiz.length,
    percent: passed ? 100 : 0,
    passed,
    at,
  };
}

async function openPlan(page: Page, initial = savedState()) {
  await page.clock.setFixedTime(new Date(fixedNow));
  await page.addInitScript(
    ({ state, key }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(state));
    },
    { state: initial, key: storageKey },
  );
  await page.goto(`/#project/${projectId}`);
  await page.getByRole("tab", { name: "Notions", exact: true }).click();
  await expect(
    page.getByRole("region", {
      name: "Parcours d’apprentissage du projet",
      exact: true,
    }),
  ).toBeVisible();
}

async function stored(page: Page): Promise<AppState> {
  return page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    storageKey,
  );
}

async function noOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    )
    .toBeLessThanOrEqual(1);
}

function steps(page: Page) {
  return page.getByRole("list", { name: "Étapes du parcours", exact: true });
}

function step(page: Page, lesson: Lesson) {
  return steps(page)
    .getByRole("listitem")
    .filter({
      has: page.getByRole("heading", { name: lesson.title, exact: true }),
    });
}

async function saveGoals(page: Page) {
  await page
    .getByRole("button", { name: "Enregistrer les objectifs", exact: true })
    .click();
}

async function passQuiz(page: Page, lesson: Lesson) {
  await expect(
    page.getByRole("heading", { name: lesson.title, exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: /Démontrer/ }).click();
  for (const [index, question] of lesson.quiz.entries()) {
    await page
      .getByRole("radio", {
        name: question.options[question.answer],
        exact: true,
      })
      .locator("..")
      .click();
    if (index < lesson.quiz.length - 1) {
      await page
        .getByRole("button", { name: "Valider cette réponse", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Question suivante", exact: true })
        .click();
    }
  }
  await page
    .getByRole("button", { name: "Vérifier mes réponses", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({
      hasText: `${lesson.quiz.length}/${lesson.quiz.length} · 100 %`,
    }),
  ).toBeVisible();
}

test("choisir des objectifs explicites dérive les prérequis sans transformer les associations ni le projet", async ({
  page,
}) => {
  const initial = savedState();
  await openPlan(page, initial);
  await expect(
    page.getByRole("heading", {
      name: "Donnez un cap à votre apprentissage.",
      exact: true,
    }),
  ).toBeVisible();
  expect(
    Object.hasOwn((await stored(page)).projects[0]!, "learningGoalIds"),
  ).toBe(false);
  await page
    .getByRole("button", { name: "Choisir mes objectifs", exact: true })
    .click();
  await expect(page.getByRole("checkbox", { checked: true })).toHaveCount(0);
  await page
    .getByRole("checkbox", {
      name: `Objectif : ${automation.title}`,
      exact: true,
    })
    .check();
  await page
    .getByRole("checkbox", { name: `Objectif : ${finance.title}`, exact: true })
    .check();
  await saveGoals(page);
  const withGoals = (await stored(page)).projects[0]!;
  expect(withGoals.learningGoalIds).toHaveLength(2);
  expect(withGoals.learningGoalIds).toEqual(
    expect.arrayContaining([automation.id, finance.id]),
  );
  const { learningGoalIds, ...unchangedProject } = withGoals;
  expect(learningGoalIds).toBeDefined();
  expect(unchangedProject).toEqual(initial.projects[0]);
  expect((await stored(page)).attempts).toEqual(initial.attempts);
  await expect(steps(page).getByRole("listitem")).toHaveCount(5);
  await expect(step(page, automation)).toContainText("Prérequis à travailler");
  await expect(step(page, firstAI)).toContainText("Disponible");
  await expect(step(page, firstFinance)).toContainText("Disponible");
  await page.reload();
  await page.getByRole("tab", { name: "Notions", exact: true }).click();
  expect((await stored(page)).projects[0]).toEqual(withGoals);
  await expect(steps(page).getByRole("listitem")).toHaveCount(5);
  await page.goto("/#skills");
  await pickInTree(page, /Automatisation ou agent.*À explorer/);
  const goalLinks = page
    .getByRole("heading", {
      name: "Objectif dans vos projets",
      exact: true,
    })
    .locator("..");
  await expect(goalLinks).toContainText(initial.projects[0]!.title);
  await expect(
    page.getByRole("heading", {
      name: "Déjà reliée à vos projets",
      exact: true,
    }),
  ).toHaveCount(0);
  await goalLinks
    .getByRole("button")
    .filter({ hasText: initial.projects[0]!.title })
    .click();
  await expect(
    page.getByRole("tab", { name: "Notions", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(steps(page).getByRole("listitem")).toHaveCount(5);
  expect((await stored(page)).projects[0]).toEqual(withGoals);
  await noOverflow(page);
});

test("reprendre le prérequis courant puis réussir son quiz actualise immédiatement le plan sans valider le projet", async ({
  page,
}) => {
  const initial = savedState();
  initial.projects[0]!.learningGoalIds = [automation.id];
  initial.attempts = [
    attempt(firstAI, false, "2026-11-03T09:50:00.000Z"),
    attempt(prompt, true, "2026-11-03T09:40:00.000Z"),
    attempt(automation, true, "2026-11-03T09:45:00.000Z"),
    attempt(firstAI, true, "2026-11-03T09:00:00.000Z"),
    attempt(firstAI, true, "2026-11-03T09:55:00.000Z", "0.9.0"),
    attempt(firstAI, true, "2026-11-04T09:55:00.000Z"),
  ];
  await openPlan(page, initial);
  await expect(step(page, firstAI)).toContainText("À reprendre");
  await expect(step(page, automation)).toContainText("Quiz validé");
  await expect(
    page.getByRole("heading", {
      name: "Quiz du parcours validés.",
      exact: true,
    }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: `Étudier : ${firstAI.title}`, exact: true })
    .first()
    .click();
  await passQuiz(page, firstAI);
  const afterQuiz = await stored(page);
  expect(afterQuiz.projects).toEqual(initial.projects);
  expect(afterQuiz.attempts).toHaveLength(initial.attempts.length + 1);
  expect(afterQuiz.attempts.at(-1)).toMatchObject({
    lessonId: firstAI.id,
    passed: true,
    at: fixedNow,
  });
  await page
    .getByRole("button", {
      name: `Reprendre le plan : ${initial.projects[0]!.title}`,
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("heading", {
      name: initial.projects[0]!.title,
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Notions", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "Quiz du parcours validés.",
      exact: true,
    }),
  ).toBeVisible();
  await expect(step(page, firstAI)).toContainText("Quiz validé");
  expect((await stored(page)).projects).toEqual(initial.projects);
  expect((await stored(page)).attempts).toEqual(afterQuiz.attempts);
  await noOverflow(page);
});

test("conserver un objectif hors catalogue dans les exports puis le retirer explicitement et restaurer une sauvegarde ancienne", async ({
  page,
}) => {
  const initial = savedState();
  const absent = "ancienne-notion-indisponible";
  initial.projects[0]!.learningGoalIds = [finance.id, absent];
  await openPlan(page, initial);
  await expect(page.getByText(absent, { exact: true }).first()).toBeVisible();
  await page
    .getByRole("button", { name: "Modifier les objectifs", exact: true })
    .click();
  await page
    .getByRole("checkbox", {
      name: `Objectif : ${automation.title}`,
      exact: true,
    })
    .check();
  await saveGoals(page);
  const preserved = (await stored(page)).projects[0]!;
  expect(preserved.learningGoalIds).toEqual(
    expect.arrayContaining([finance.id, automation.id, absent]),
  );
  const dossierEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Exporter le dossier", exact: true })
    .click();
  const dossier = await dossierEvent;
  const dossierMarkdown = await readFile((await dossier.path())!, "utf8");
  expect(dossierMarkdown).toContain(absent);
  expect(dossierMarkdown).toContain(finance.title);
  expect(dossierMarkdown).toContain(firstFinance.title);
  await page.goto("/#portfolio");
  const portfolioEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Exporter mon portfolio", exact: true })
    .click();
  const portfolio = await portfolioEvent;
  const portfolioMarkdown = await readFile((await portfolio.path())!, "utf8");
  expect(portfolioMarkdown).toContain(absent);
  expect(portfolioMarkdown).toContain(finance.title);
  expect(portfolioMarkdown).toContain(initial.projects[0]!.title);
  await page.goto("/#settings");
  const backupEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Exporter mes données", exact: true })
    .click();
  const backup = await backupEvent;
  const exported: AppState = JSON.parse(
    await readFile((await backup.path())!, "utf8"),
  );
  expect(exported.projects[0]!.learningGoalIds).toEqual(
    preserved.learningGoalIds,
  );
  await page.goto(`/#project/${projectId}`);
  await page.getByRole("tab", { name: "Notions", exact: true }).click();
  await page
    .getByRole("button", { name: "Modifier les objectifs", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: `Retirer l’objectif indisponible : ${absent}`,
      exact: true,
    })
    .click();
  await saveGoals(page);
  expect((await stored(page)).projects[0]!.learningGoalIds).toEqual(
    expect.arrayContaining([finance.id, automation.id]),
  );
  expect((await stored(page)).projects[0]!.learningGoalIds).not.toContain(
    absent,
  );
  const legacy = savedState();
  await page.goto("/#settings");
  await page.getByLabel("Importer une sauvegarde").setInputFiles({
    name: "projet-sans-objectifs-v1.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(legacy)),
  });
  await page
    .getByRole("button", { name: "Confirmer le remplacement", exact: true })
    .click();
  await page.goto(`/#project/${projectId}`);
  await page.getByRole("tab", { name: "Notions", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "Donnez un cap à votre apprentissage.",
      exact: true,
    }),
  ).toBeVisible();
  expect((await stored(page)).projects).toEqual(legacy.projects);
  await noOverflow(page);
});

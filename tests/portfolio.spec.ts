import { readFile } from "node:fs/promises";
import { closeTree, openTree } from "./treeHelpers";
import { test, expect, type Page } from "@playwright/test";
import { lessons } from "../src/data/lessons";
import type { AppState, Attempt } from "../src/lib/types";
import {
  createSimulationSnapshot,
  defaultSimulationInput,
} from "../src/lib/simulation";

const storageKey = "bouse.academy.v1:guest";
const fixedNow = "2026-11-03T10:00:00.000Z";
const firstLesson = lessons.find(
  (lesson) => lesson.id === "ca-marge-tresorerie",
)!;
const secondLesson = lessons.find(
  (lesson) => lesson.id === "seuil-rentabilite",
)!;
const projectTitle = "Un suivi utile aux artisans";
const personalNote =
  "# Mon repère personnel\n\nUne marge positive ne garantit pas du cash.\n```text\n<preuve> à documenter\n```";
const orphanNote =
  "Une note conservée hors catalogue : [[ancien-projet]] et **question ouverte**.";

function attempt(
  lessonId: string,
  at: string,
  passed: boolean,
  version?: string,
): Attempt {
  return {
    lessonId,
    ...(version === undefined ? {} : { lessonVersion: version }),
    answers: { q1: 0, q2: 1, q3: 2 },
    correct: passed ? 3 : 1,
    total: 3,
    percent: passed ? 100 : 33,
    passed,
    at,
  };
}

function stateFixture(): AppState {
  return {
    schemaVersion: 1,
    profile: {
      name: "Profil démo",
      level: "Débutant++",
      goal: "Relier les apprentissages à des preuves concrètes",
      interests: ["Finance", "Entrepreneuriat"],
      minutes: 20,
      preference: "Appliquer à mon projet",
      diagnostic: { finance: 1, business: 2, ai: 0 },
    },
    attempts: [
      // Deliberately unsorted backup: latest CURRENT failure must win over old
      // success, an obsolete version and a future recorded quiz.
      attempt(
        firstLesson.id,
        "2026-11-02T10:00:00.000Z",
        false,
        firstLesson.version,
      ),
      attempt(firstLesson.id, "2026-11-01T10:00:00.000Z", true),
      attempt(firstLesson.id, "2026-11-02T11:00:00.000Z", true, "0.9.0"),
      attempt(
        firstLesson.id,
        "2026-11-04T10:00:00.000Z",
        true,
        firstLesson.version,
      ),
      attempt(
        secondLesson.id,
        "2026-11-02T09:00:00.000Z",
        true,
        secondLesson.version,
      ),
    ],
    projects: [
      {
        id: "portfolio-project",
        title: projectTitle,
        problem: "Les achats précèdent les encaissements clients.",
        customer: "Ateliers artisanaux",
        hypothesis:
          "Un suivi hebdomadaire aide à anticiper un besoin de financement.",
        nextAction: "Comparer les observations de deux ateliers.",
        stage: "Recherche",
        lessonIds: [firstLesson.id],
        createdAt: "2026-11-01T12:00:00.000Z",
      },
    ],
    notes: { [firstLesson.id]: personalNote, "ancienne-lecon": orphanNote },
    lastLessonId: firstLesson.id,
    experiments: [
      {
        id: "portfolio-test",
        projectId: "portfolio-project",
        title: "Interroger deux ateliers",
        hypothesis: "Deux ateliers souhaitent suivre leur trésorerie.",
        protocol: "Mener deux entretiens puis consigner les engagements.",
        successCriterion:
          "Deux essais demandés avec une prochaine étape datée.",
        reviewOn: "2026-11-10",
        createdAt: "2026-11-01T13:00:00.000Z",
        result: {
          observation:
            "Un atelier demande un essai, un autre préfère attendre.",
          evidence: "Compte rendu fictif des deux échanges.",
          conclusion: "inconclusive",
          recordedAt: "2026-11-02T13:00:00.000Z",
        },
      },
    ],
    decisions: [
      {
        id: "portfolio-decision",
        projectId: "portfolio-project",
        experimentId: "portfolio-test",
        title: "Tester une méthode manuelle",
        context: "Une demande concrète, une incertitude sur l’usage.",
        options: "Essai limité ou attente avant développement.",
        choice: "Commencer avec un atelier volontaire.",
        expectedOutcome: "Deux usages hebdomadaires sans relance.",
        confidence: 60,
        risk: "La saisie peut rester trop contraignante.",
        reviewOn: "2026-11-10",
        createdAt: "2026-11-02T14:00:00.000Z",
        outcome: {
          observed: "Un premier usage puis aucune seconde saisie.",
          comparison: "worse",
          learning: "Observer l’usage réel avant d’automatiser.",
          recordedAt: "2026-11-02T15:00:00.000Z",
        },
      },
    ],
    simulations: [
      createSimulationSnapshot(
        defaultSimulationInput,
        "Comparer le cash, sans prédire le terrain",
        "portfolio-simulation",
        new Date("2026-11-02T16:00:00.000Z"),
      ),
    ],
  };
}

async function stored(page: Page): Promise<AppState> {
  return page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    storageKey,
  );
}

async function open(page: Page, state = stateFixture(), route = "portfolio") {
  await page.clock.setFixedTime(new Date(fixedNow));
  await page.addInitScript(
    ({ key, initial }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(initial));
    },
    { key: storageKey, initial: state },
  );
  await page.goto(`/#${route}`);
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

async function selectFirstLesson(page: Page) {
  await page
    .getByRole("button", {
      name: new RegExp(firstLesson.title),
    })
    .first()
    .click();
}

test("le portfolio relie le dernier quiz courant aux notes et aux dossiers sans confondre les versions", async ({
  page,
}) => {
  const initial = stateFixture();
  await open(page, initial, "skills");
  const tree = await openTree(page);
  await expect(
    tree.getByRole("button", {
      name: /Marge et trésorerie.*À reprendre/,
    }),
  ).toBeVisible();
  await closeTree(page);
  await page
    .getByRole("button", { name: "Ouvrir mon portfolio", exact: true })
    .click();
  await expect(page).toHaveURL(/#portfolio$/);
  await expect(
    page.getByRole("heading", {
      name: "Ce que vous pouvez montrer.",
      exact: true,
    }),
  ).toBeVisible();
  await selectFirstLesson(page);
  const detail = page.getByRole("region", {
    name: "Traces de la notion",
  });
  await expect(detail).toContainText("À reprendre");
  await expect(detail).toContainText("33");
  await expect(detail).toContainText(firstLesson.version);
  await expect(detail).toContainText(
    "Une marge positive ne garantit pas du cash.",
  );
  await expect(detail).toContainText(projectTitle);
  await page
    .getByRole("button", {
      name: new RegExp(secondLesson.title),
    })
    .first()
    .click();
  await expect(detail).toContainText("Quiz validé");
  await expect(detail).toContainText("100");
  expect(await stored(page)).toEqual(initial);
  await noOverflow(page);
});

test("dossiers et explorations restent distincts et leur consultation ne crée aucune preuve", async ({
  page,
}) => {
  const initial = stateFixture();
  await open(page, initial);
  await page
    .getByRole("tab", { name: "Projets & explorations", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: projectTitle, exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Explorations fictives", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Comparer le cash, sans prédire le terrain", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: `Ouvrir le dossier : ${projectTitle}`,
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/#project\/portfolio-project$/);
  await expect(
    page.getByRole("heading", { name: projectTitle, exact: true }),
  ).toBeVisible();
  await page.goto("/#portfolio");
  await page.getByRole("tab", { name: "Notes", exact: true }).click();
  await expect(page.getByText(orphanNote, { exact: true })).toBeVisible();
  await expect(page.getByText(/ancienne leçon/i).first()).toBeVisible();
  expect(await stored(page)).toEqual(initial);
  await noOverflow(page);
});

test("l’export Markdown garde notes et archives tandis qu’un ancien profil vide reste honnête", async ({
  page,
}) => {
  const initial = stateFixture();
  await open(page, initial);
  const downloadEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Exporter mon portfolio", exact: true })
    .click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toMatch(/\.md$/);
  const markdown = await readFile((await download.path())!, "utf8");
  expect(markdown).toContain("exported_at");
  expect(markdown).toContain(firstLesson.title);
  expect(markdown).toContain(personalNote);
  expect(markdown).toContain(orphanNote);
  expect(markdown).toContain("0.9.0");
  expect(markdown).toContain("2026-11-04T10:00:00.000Z");
  expect(markdown).toContain(
    "Un atelier demande un essai, un autre préfère attendre.",
  );
  expect(markdown).toContain("Deux usages hebdomadaires sans relance.");
  expect(markdown).toContain("Un premier usage puis aucune seconde saisie.");
  expect(markdown).toContain("Comparer le cash, sans prédire le terrain");
  expect(await stored(page)).toEqual(initial);
  await page
    .getByRole("button", { name: "Ouvrir la recherche", exact: true })
    .click();
  const search = page.getByRole("dialog", { name: "Recherche universelle" });
  await search.getByRole("textbox").fill("Obsidian");
  await search
    .getByRole("button")
    .filter({ hasText: /portfolio/i })
    .click();
  await expect(page).toHaveURL(/#portfolio$/);
  const empty: AppState = {
    schemaVersion: 1,
    profile: initial.profile,
    attempts: [],
    projects: [],
    notes: {},
    lastLessonId: null,
  };
  await page.goto("/#settings");
  await page.getByLabel("Importer une sauvegarde").setInputFiles({
    name: "ancien-profil-vide.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(empty)),
  });
  await page
    .getByRole("button", { name: "Confirmer le remplacement", exact: true })
    .click();
  await page.goto("/#portfolio");
  await page.getByRole("tab", { name: "Notes", exact: true }).click();
  await expect(
    page.getByText("Pas encore de note personnelle.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("tab", { name: "Projets & explorations", exact: true })
    .click();
  await expect(
    page.getByText("Aucun dossier de projet.", { exact: true }),
  ).toBeVisible();
  expect((await stored(page)).attempts).toEqual([]);
  expect((await stored(page)).projects).toEqual([]);
  expect((await stored(page)).notes).toEqual({});
  expect((await stored(page)).simulations).toBeUndefined();
  await noOverflow(page);
});

test("un quiz enregistré dix secondes après l’ouverture compte immédiatement sans attendre le tick d’une minute", async ({
  page,
}) => {
  const initial: AppState = {
    schemaVersion: 1,
    profile: stateFixture().profile,
    attempts: [],
    projects: [],
    notes: {},
    lastLessonId: null,
  };
  await open(page, initial, `lesson/${firstLesson.id}`);
  await expect(
    page.getByRole("heading", { name: firstLesson.title, exact: true }),
  ).toBeVisible();
  const recordedAt = "2026-11-03T10:00:10.000Z";
  // Change Date only: this deliberately does not execute the 60-second timer
  // or mount a new clock hook before the persisted quiz is read again.
  await page.clock.setFixedTime(new Date(recordedAt));
  await page.getByRole("tab", { name: /Démontrer/ }).click();
  for (const [index, question] of firstLesson.quiz.entries()) {
    await page
      .getByRole("radio", {
        name: question.options[question.answer],
        exact: true,
      })
      .locator("..")
      .click();
    if (index < firstLesson.quiz.length - 1) {
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
    page.getByRole("status").filter({ hasText: "2/2 · 100 %" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Appliquer à un projet", exact: true })
    .click();
  await expect(page.getByRole("tab", { name: /Appliquer/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  // This source-of-truth text is hidden by the narrow-screen presentation,
  // but must contain the new quiz immediately in the same mounted lesson.
  await expect(
    page.locator(".learning-side-concepts .learning-footnote"),
  ).toHaveText("Dernier quiz : 100 % · notion validée.");
  const evidence = await stored(page);
  expect(evidence.attempts).toHaveLength(1);
  expect(evidence.attempts[0]).toMatchObject({
    passed: true,
    percent: 100,
    at: recordedAt,
    lessonVersion: firstLesson.version,
  });
  await page.goto("/#portfolio");
  await selectFirstLesson(page);
  const detail = page.getByRole("region", { name: "Traces de la notion" });
  await expect(detail).toContainText("Quiz validé");
  await expect(detail).toContainText("100");
  expect((await stored(page)).attempts).toEqual(evidence.attempts);
  await noOverflow(page);
});

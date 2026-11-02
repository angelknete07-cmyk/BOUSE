import { readFile } from "node:fs/promises";
import { test, expect, type Page } from "@playwright/test";
import type { AppState, ProjectExperiment } from "../src/lib/types";

const storageKey = "bouse.academy.v1";
const fixedNow = "2026-11-03T10:00:00.000Z";
const projectId = "terrain-demo";
const experimentInput = {
  title: "Tester un suivi de trésorerie hebdomadaire",
  hypothesis: "Trois artisans sur cinq accepteront un premier essai de suivi.",
  protocol:
    "Présenter un exemple à cinq artisans, noter leur pratique actuelle et demander un engagement concret.",
  successCriterion:
    "Trois engagements écrits pour un essai limité à deux semaines.",
  reviewOn: "2026-11-10",
};
const resultInput = {
  observation:
    "Deux artisans demandent un essai et trois ne souhaitent pas poursuivre.",
  evidence:
    "Compte rendu fictif des cinq entretiens : deux engagements écrits, trois refus documentés.",
  conclusion: "inconclusive" as const,
};
const decisionInput = {
  title: "Limiter le premier pilote à deux ateliers",
  context:
    "Deux ateliers ont demandé un essai ; le temps de suivi reste inconnu.",
  options:
    "Lancer le pilote à deux ateliers, rechercher d’autres clients ou différer la construction.",
  choice:
    "Tester une méthode manuelle pendant deux semaines avec les deux ateliers volontaires.",
  expectedOutcome:
    "Les deux ateliers utilisent le suivi chaque semaine, avec moins de trente minutes de travail par atelier.",
  confidence: 70,
  risk: "Le traitement manuel peut prendre trop de temps et rendre le modèle non rentable.",
  reviewOn: "2026-11-17",
};

function savedState(): AppState {
  return {
    schemaVersion: 1,
    profile: {
      name: "Profil démo",
      level: "Débutant++",
      goal: "Tester des idées avant de construire",
      interests: ["Entrepreneuriat"],
      minutes: 20,
      preference: "Appliquer à mon projet",
      diagnostic: { finance: 1, business: 2, ai: 0 },
    },
    attempts: [],
    projects: [
      {
        id: projectId,
        title: "Prévoir le cash d’un atelier",
        problem:
          "Les retards de paiement rendent les achats difficiles à anticiper.",
        customer: "Artisans indépendants",
        hypothesis: experimentInput.hypothesis,
        nextAction: "Interroger cinq artisans.",
        stage: "Recherche",
        lessonIds: ["validation-client"],
        createdAt: "2026-11-02T12:00:00.000Z",
      },
      {
        id: "other-project",
        title: "Autre projet de démonstration",
        problem: "Évaluer un autre usage.",
        customer: "Commerçants",
        hypothesis: "Une autre hypothèse reste à explorer.",
        nextAction: "Préparer des entretiens.",
        stage: "Idée",
        lessonIds: [],
        createdAt: "2026-11-02T12:00:00.000Z",
      },
    ],
    notes: {},
    lastLessonId: null,
    // Older v1 backup intentionally omits experiments and decisions.
  };
}

function completedExperiment(
  id = "test-linked",
  forProject = projectId,
): ProjectExperiment {
  return {
    ...experimentInput,
    id,
    projectId: forProject,
    createdAt: "2026-11-02T13:00:00.000Z",
    result: { ...resultInput, recordedAt: "2026-11-02T15:00:00.000Z" },
  };
}

async function openWorkbench(page: Page, initialState = savedState()) {
  await page.clock.setFixedTime(new Date(fixedNow));
  await page.addInitScript(
    ({ state, key }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(state));
    },
    { state: initialState, key: storageKey },
  );
  await page.goto(`/#project/${projectId}`);
  await expect(
    page.getByRole("heading", {
      name: initialState.projects[0]!.title,
      exact: true,
    }),
  ).toBeVisible();
}

async function storedState(page: Page): Promise<AppState> {
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

async function prepareExperiment(page: Page) {
  await page
    .getByRole("button", { name: "Préparer un test", exact: true })
    .click();
  for (const [label, value] of [
    ["Nom du test", experimentInput.title],
    ["Hypothèse à vérifier", experimentInput.hypothesis],
    ["Protocole de test", experimentInput.protocol],
    ["Critère de réussite", experimentInput.successCriterion],
    ["Date de revue du test", experimentInput.reviewOn],
  ])
    await page.getByLabel(label!, { exact: true }).fill(value!);
  await page
    .getByRole("button", { name: "Enregistrer le test", exact: true })
    .click();
}

async function recordResult(page: Page) {
  await page
    .getByRole("button", { name: "Consigner le résultat", exact: true })
    .click();
  await page
    .getByLabel("Observation", { exact: true })
    .fill(resultInput.observation);
  await page
    .getByLabel("Éléments de preuve", { exact: true })
    .fill(resultInput.evidence);
  await page
    .getByLabel("Conclusion", { exact: true })
    .selectOption(resultInput.conclusion);
  await page
    .getByRole("button", { name: "Enregistrer le résultat", exact: true })
    .click();
}

async function prepareDecision(page: Page, linkedId = "test-linked") {
  await page.getByRole("tab", { name: /^Décisions/ }).click();
  await page
    .getByRole("button", { name: "Noter une décision", exact: true })
    .click();
  for (const [label, value] of [
    ["Titre de la décision", decisionInput.title],
    ["Contexte disponible", decisionInput.context],
    ["Options envisagées", decisionInput.options],
    ["Choix retenu", decisionInput.choice],
    ["Résultat attendu", decisionInput.expectedOutcome],
    ["Confiance initiale (%)", String(decisionInput.confidence)],
    ["Risque principal", decisionInput.risk],
    ["Date de revue de la décision", decisionInput.reviewOn],
  ])
    await page.getByLabel(label!, { exact: true }).fill(value!);
  await expect(
    page
      .getByLabel("Test terrain associé (facultatif)", { exact: true })
      .locator('option[value="foreign-test"]'),
  ).toHaveCount(0);
  await page
    .getByLabel("Test terrain associé (facultatif)", { exact: true })
    .selectOption(linkedId);
  await page
    .getByRole("button", { name: "Enregistrer la décision", exact: true })
    .click();
}

test("préparer un test, consigner ses preuves et préserver le plan initial au rechargement", async ({
  page,
}) => {
  const initial = savedState();
  await openWorkbench(page, initial);
  await expect(
    page.getByRole("heading", { name: experimentInput.title, exact: true }),
  ).toHaveCount(0);
  await prepareExperiment(page);
  await expect
    .poll(async () => (await storedState(page)).experiments?.length)
    .toBe(1);
  const plan = (await storedState(page)).experiments![0]!;
  expect(plan).toMatchObject(experimentInput);
  expect(plan.result).toBeUndefined();
  await recordResult(page);
  const recorded = (await storedState(page)).experiments![0]!;
  expect(recorded).toMatchObject({
    ...plan,
    result: { ...resultInput, recordedAt: fixedNow },
  });
  const { result, ...baseline } = recorded;
  expect(result).toBeDefined();
  expect(baseline).toEqual(plan);
  expect((await storedState(page)).projects).toEqual(initial.projects);
  expect((await storedState(page)).attempts).toEqual(initial.attempts);
  await expect(
    page.getByRole("button", { name: "Consigner le résultat", exact: true }),
  ).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByText(resultInput.observation, { exact: true }),
  ).toBeVisible();
  expect((await storedState(page)).experiments).toEqual([recorded]);
  await noOverflow(page);
});

test("lier une décision au terrain, comparer au réel et exporter sans réécrire l’attente", async ({
  page,
}) => {
  const initial = savedState();
  initial.experiments = [
    completedExperiment(),
    {
      ...completedExperiment("foreign-test", "other-project"),
      title: "Test réservé à l’autre projet",
    },
  ];
  await openWorkbench(page, initial);
  await prepareDecision(page);
  const original = (await storedState(page)).decisions![0]!;
  expect(original).toMatchObject({
    ...decisionInput,
    experimentId: "test-linked",
    projectId,
  });
  expect(original.outcome).toBeUndefined();
  await page
    .getByRole("button", { name: "Comparer au réel", exact: true })
    .click();
  await page
    .getByLabel("Ce qui s’est passé", { exact: true })
    .fill(
      "Un atelier a utilisé le suivi deux fois ; l’autre n’a pas renouvelé son engagement.",
    );
  await page.getByLabel("Comparaison", { exact: true }).selectOption("mixed");
  await page
    .getByLabel("Ce que j’en retiens", { exact: true })
    .fill(
      "Mesurer l’usage réel et le temps de préparation avant d’automatiser.",
    );
  await page
    .getByRole("button", { name: "Enregistrer le bilan", exact: true })
    .click();
  const decision = (await storedState(page)).decisions![0]!;
  const { outcome, ...baseline } = decision;
  expect(baseline).toEqual(original);
  expect(outcome).toMatchObject({ comparison: "mixed", recordedAt: fixedNow });
  await expect(
    page.getByRole("button", { name: "Comparer au réel", exact: true }),
  ).toHaveCount(0);
  await page.reload();
  await page.getByRole("tab", { name: /^Décisions/ }).click();
  await expect(
    page.getByText(decisionInput.expectedOutcome, { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(outcome!.observed, { exact: true }),
  ).toBeVisible();
  expect((await storedState(page)).decisions).toEqual([decision]);
  await noOverflow(page);
  const dossierEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Exporter le dossier", exact: true })
    .click();
  const dossier = await dossierEvent;
  expect(dossier.suggestedFilename()).toMatch(/\.md$/);
  const dossierPath = await dossier.path();
  expect(dossierPath).not.toBeNull();
  const markdown = await readFile(dossierPath!, "utf8");
  expect(markdown).toContain(decisionInput.expectedOutcome);
  expect(markdown).toContain(outcome!.observed);
  expect(markdown).toContain(resultInput.evidence);
  expect(markdown).not.toContain("Test réservé à l’autre projet");
  await page.goto("/#settings");
  const downloadEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Exporter mes données", exact: true })
    .click();
  const download = await downloadEvent;
  const path = await download.path();
  expect(path).not.toBeNull();
  const exported: AppState = JSON.parse(await readFile(path!, "utf8"));
  expect(exported.decisions).toEqual([decision]);
  expect(exported.experiments).toEqual(initial.experiments);
  expect(exported.projects).toEqual(initial.projects);
});

test("un atelier vide reste honnête et une ancienne sauvegarde ne crée pas d’expériences", async ({
  page,
}) => {
  const initial = savedState();
  await openWorkbench(page, initial);
  expect((await storedState(page)).experiments ?? []).toEqual([]);
  expect((await storedState(page)).decisions ?? []).toEqual([]);
  await expect(
    page.getByRole("button", { name: "Préparer un test", exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: /^Décisions/ }).click();
  await expect(
    page.getByRole("button", { name: "Noter une décision", exact: true }),
  ).toBeVisible();
  await noOverflow(page);
  await page.goto("/#settings");
  await page.getByLabel("Importer une sauvegarde").setInputFiles({
    name: "projets-v1.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(initial)),
  });
  await page
    .getByRole("button", { name: "Confirmer le remplacement", exact: true })
    .click();
  await page.goto(`/#project/${projectId}`);
  await expect(
    page.getByRole("heading", {
      name: initial.projects[0]!.title,
      exact: true,
    }),
  ).toBeVisible();
  expect((await storedState(page)).experiments ?? []).toEqual([]);
  expect((await storedState(page)).decisions ?? []).toEqual([]);
  await page.goto("/#project/absent-project");
  await expect(
    page.getByRole("heading", { name: "Projet introuvable.", exact: true }),
  ).toBeVisible();
  expect((await storedState(page)).projects).toEqual(initial.projects);
  await noOverflow(page);
});

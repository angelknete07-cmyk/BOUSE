import AxeBuilder from "@axe-core/playwright";
import { test, expect, type Page } from "@playwright/test";

/* « Mes pièges » (idée 19) : les questions ratées, gardées avec la bonne
   réponse et le pourquoi, en haut des Révisions. */

const storageKey = "bouse.academy.v1:guest";
const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86_400_000).toISOString();

async function setup(page: Page, attempts: unknown[]) {
  await page.addInitScript(
    ({ key, attempts }) => {
      sessionStorage.setItem("bouse.splash.seen", "1");
      localStorage.setItem("bouse.tour.seen", "1");
      localStorage.setItem("bouse.tours.seen", "home,academy,skills,reviews");
      if (localStorage.getItem(key)) return;
      localStorage.setItem(
        key,
        JSON.stringify({
          schemaVersion: 1,
          profile: {
            name: "Camille",
            level: "Débutant",
            goal: "Comprendre les bases",
            interests: ["Finance"],
            minutes: 20,
            preference: "Exemples puis pratique",
            diagnostic: {},
          },
          attempts,
          projects: [],
          notes: {},
          lastLessonId: null,
        }),
      );
    },
    { key: storageKey, attempts },
  );
}

const attempts = [
  {
    lessonId: "ca-marge-tresorerie",
    lessonVersion: "1.0.0",
    answers: { "finance-1": 2, "finance-2": 1 },
    correct: 0,
    total: 2,
    percent: 0,
    passed: false,
    at: daysAgo(3),
  },
  {
    lessonId: "ca-marge-tresorerie",
    lessonVersion: "1.0.0",
    answers: { "finance-1": 0, "finance-2": 0 },
    correct: 1,
    total: 2,
    percent: 50,
    passed: false,
    at: daysAgo(2),
  },
  {
    lessonId: "fp-comptes-auto",
    lessonVersion: "competence-1",
    answers: { q0: 0, q1: 0, q2: 1 },
    correct: 2,
    total: 3,
    percent: 67,
    passed: false,
    at: daysAgo(1),
  },
];

test("le carnet montre les pièges, la bonne réponse et le pourquoi", async ({
  page,
}) => {
  await setup(page, attempts);
  await page.goto("/#reviews");
  const notebook = page.getByRole("region", { name: "Tes pièges" });
  await expect(notebook).toBeVisible();
  await expect(
    notebook.getByRole("button", { name: "À déjouer · 2" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(notebook.getByText("Raté 2 fois")).toBeVisible();
  // Sa dernière mauvaise réponse est barrée, la bonne est écrite.
  await expect(
    notebook.locator("del", { hasText: "Le CA augmente de 10 000 €" }),
  ).toBeVisible();
  await expect(
    notebook.getByText("La trésorerie et la dette augmentent").first(),
  ).toBeVisible();
  await expect(
    notebook.getByText("Compétence · Mettre ses comptes en pilote automatique"),
  ).toBeVisible();

  await notebook.getByRole("button", { name: "Déjoués · 1" }).click();
  await expect(notebook.getByText(/Réussie au dernier quiz/)).toBeVisible();
  await expect(notebook.getByText("Raté 2 fois")).toHaveCount(0);

  const axe = await new AxeBuilder({ page })
    .include(".trap-notebook")
    .analyze();
  expect(axe.violations).toEqual([]);
});

test("« Refaire le quiz » ouvre la leçon sur son quiz, « Refaire le contrôle » sur le contrôle", async ({
  page,
}) => {
  await setup(page, attempts);
  await page.goto("/#reviews");
  const notebook = page.getByRole("region", { name: "Tes pièges" });
  await notebook.getByRole("button", { name: "Refaire le quiz →" }).click();
  await expect(page).toHaveURL(/#lesson\/ca-marge-tresorerie\/quiz$/);
  await expect(page.getByRole("tab", { name: /Démontrer/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );

  await page.goto("/#reviews");
  await page
    .getByRole("region", { name: "Tes pièges" })
    .getByRole("button", { name: "Refaire le contrôle →" })
    .click();
  await expect(page).toHaveURL(/#skill\/fp-comptes-auto\/check$/);
  await expect(page.getByText(/1\. « Se payer en premier »/)).toBeVisible();
});

test("l'accueil montre une seule ligne vers les pièges, rien sans piège", async ({
  page,
}) => {
  await setup(page, attempts);
  await page.goto("/#home");
  const line = page.getByRole("button", { name: "2 pièges à déjouer →" });
  await expect(line).toBeVisible();
  await line.click();
  await expect(page.getByRole("region", { name: "Tes pièges" })).toBeVisible();
});

test("sans question ratée, aucun carnet n'apparaît", async ({ page }) => {
  await setup(page, []);
  await page.goto("/#reviews");
  await expect(
    page.getByRole("heading", {
      name: "Faire revenir les idées.",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByRole("region", { name: "Tes pièges" })).toHaveCount(0);
});

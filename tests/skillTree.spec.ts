import { test, expect, type Page } from "@playwright/test";
import type { AppState, Attempt } from "../src/lib/types";
import { clickInTree, closeTree, openTree } from "./treeHelpers";

/* L'arbre des compétences (idée 7) : aperçu, grand arbre, choix d'une leçon. */

const storageKey = "bouse.academy.v1:guest";

function attempt(lessonId: string, passed: boolean): Attempt {
  return {
    lessonId,
    answers: {},
    correct: passed ? 3 : 1,
    total: 3,
    percent: passed ? 100 : 33,
    passed,
    at: "2026-11-01T10:00:00.000Z",
  };
}

function savedState(): AppState {
  return {
    schemaVersion: 1,
    profile: {
      name: "Camille",
      level: "Débutant",
      goal: "Comprendre les bases",
      interests: ["Finance"],
      minutes: 20,
      preference: "Exemples puis pratique",
      diagnostic: { finance: 0, business: 0, ai: 0 },
    },
    attempts: [
      attempt("fp-budget", true),
      attempt("ca-marge-tresorerie", false),
    ],
    projects: [],
    notes: {},
    lastLessonId: "fp-budget",
  };
}

async function open(page: Page) {
  await page.addInitScript(
    ({ state, key }) => {
      sessionStorage.setItem("bouse.splash.seen", "1");
      localStorage.setItem("bouse.tour.seen", "1");
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(state));
    },
    { state: savedState(), key: storageKey },
  );
  await page.goto("/#skills");
  await expect(
    page.getByRole("region", { name: "L’arbre des compétences" }),
  ).toBeVisible();
}

test("l'aperçu montre les branches et ouvre le grand arbre", async ({
  page,
}) => {
  await open(page);
  const branches = page.getByRole("list", {
    name: "Les branches de l’arbre",
  });
  await expect(branches.getByRole("listitem")).toHaveCount(5);
  await expect(branches).toContainText("Ton argent au quotidien");
  await expect(branches).toContainText("1 / 9");
  // La page ne déborde jamais en largeur, même sur téléphone.
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);

  const tree = await openTree(page);
  // Le reste de la page ne répond plus tant que l'arbre est ouvert.
  expect(
    await page.evaluate(() => document.getElementById("root")!.inert),
  ).toBe(true);
  await expect(
    tree.getByRole("button", { name: /^Budget · Quiz validé/ }),
  ).toBeVisible();
  await expect(
    tree.getByRole("button", { name: /^Marge et trésorerie · À reprendre/ }),
  ).toBeVisible();
  await expect(
    tree.getByRole("button", {
      name: /^Épargne de précaution · À explorer, tu peux la faire/,
    }),
  ).toBeVisible();
  await expect(
    tree.getByRole("button", { name: /^Crédit et TAEG · À explorer après/ }),
  ).toBeVisible();
  await expect(
    tree.getByRole("button", { name: /à faire maintenant/ }),
  ).toHaveCount(1);
  await closeTree(page);
  await expect(
    page.getByRole("button", { name: "Agrandir l’arbre", exact: true }),
  ).toBeFocused();
  expect(
    await page.evaluate(() => document.getElementById("root")!.inert),
  ).toBe(false);
});

test("choisir une leçon montre sa fiche, puis la fiche de la page", async ({
  page,
}) => {
  await open(page);
  const tree = await openTree(page);
  await clickInTree(page, /^Épargne de précaution/);
  const panel = tree.getByRole("complementary", { name: "La leçon choisie" });
  await expect(panel).toBeVisible();
  await expect(panel).toContainText("Tu peux la faire maintenant");
  await expect(panel).toContainText("Il faut savoir avant");
  // Les pastilles mènent d'une leçon à l'autre.
  await panel.getByRole("button", { name: "Crédit et TAEG" }).click();
  await expect(panel.getByRole("heading", { name: /Crédit/ })).toBeVisible();
  // Échap ferme d'abord la fiche, puis l'arbre.
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(tree).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page
      .locator(".knowledge-details")
      .getByRole("heading", { name: /^Crédit/ }),
  ).toBeVisible();
});

test("glisser déplace l'arbre sans choisir de leçon, « Ouvrir la leçon » y mène", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "le glissé à la souris se teste sur ordinateur");
  await open(page);
  const tree = await openTree(page);
  const canvas = tree.locator(".tr-canvas");
  await page.waitForTimeout(700);
  // La branche de Budget vient à l'écran.
  await tree.getByRole("button", { name: "Ton argent au quotidien" }).click();
  await page.waitForTimeout(700);
  const node = tree.getByRole("button", { name: /^Budget/ });
  const box = (await node.boundingBox())!;
  const before = await canvas.evaluate((e) => e.style.transform);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 120, box.y + 90, { steps: 6 });
  await page.mouse.up();
  expect(await canvas.evaluate((e) => e.style.transform)).not.toBe(before);
  await expect(
    tree.getByRole("complementary", { name: "La leçon choisie" }),
  ).toBeHidden();

  await node.click();
  const panel = tree.getByRole("complementary", { name: "La leçon choisie" });
  await expect(panel).toBeVisible();
  await panel.getByRole("button", { name: /Revoir la leçon/ }).click();
  await expect(page).toHaveURL(/#lesson\/fp-budget$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("les boutons de zoom et « Tout voir » changent l'échelle", async ({
  page,
}) => {
  await open(page);
  const tree = await openTree(page);
  const zoom = tree.getByRole("group", { name: "Zoom" });
  await page.waitForTimeout(700);
  const scale = () =>
    tree
      .locator(".tr-canvas")
      .evaluate((e) => Number(/scale\(([\d.]+)\)/.exec(e.style.transform)![1]));
  const start = await scale();
  await zoom.getByRole("button", { name: "Zoomer", exact: true }).click();
  expect(await scale()).toBeGreaterThan(start);
  await zoom.getByRole("button", { name: "Tout voir" }).click();
  expect(await scale()).toBeLessThan(start);
});

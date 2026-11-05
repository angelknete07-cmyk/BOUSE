import AxeBuilder from "@axe-core/playwright";
import { test, expect, type Page, type TestInfo } from "@playwright/test";
import { lessons } from "../src/data/lessons";
import type { AppState } from "../src/lib/types";

const lesson = lessons.find((item) => item.id === "ca-marge-tresorerie")!;
const fixture: AppState = {
  schemaVersion: 1,
  profile: {
    name: "Profil démo",
    level: "Débutant++",
    goal: "Comprendre et piloter un business",
    interests: ["Finance"],
    minutes: 20,
    preference: "Exemples puis pratique",
    diagnostic: { finance: 1, business: 2, ai: 0 },
  },
  attempts: [],
  notes: {},
  lastLessonId: lesson.id,
  projects: [
    {
      id: "accessibility-project",
      title: "Prévoir le cash d’un atelier",
      problem: "Anticiper les règlements clients",
      customer: "Artisans",
      hypothesis: "Un suivi hebdomadaire aide à anticiper les achats.",
      nextAction: "Interroger cinq artisans",
      stage: "Validation",
      lessonIds: [lesson.id],
      learningGoalIds: [lesson.id],
      createdAt: "2026-11-02T12:00:00.000Z",
    },
  ],
};
async function seed(page: Page) {
  await page.addInitScript((state) => {
    localStorage.setItem("bouse.academy.v1", JSON.stringify(state));
  }, fixture);
}
async function audit(page: Page, info: TestInfo, screen: string) {
  await page.evaluate(() => document.fonts.ready);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  await info.attach(`accessibility-${screen}`, {
    body: JSON.stringify({
      violations: result.violations,
      incomplete: result.incomplete,
    }),
    contentType: "application/json",
  });
  expect(
    result.violations.map((item) => ({
      rule: item.id,
      nodes: item.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
    screen,
  ).toEqual([]);
  expect(
    result.incomplete
      .filter((item) => item.id === "aria-prohibited-attr")
      .flatMap((item) => item.nodes.map((node) => node.target)),
    `${screen} : les libellés ARIA nécessitent un rôle qui les accepte`,
  ).toEqual([]);
}

test("les écrans principaux conservent leurs noms accessibles et leurs contrastes", async ({
  page,
}, info) => {
  test.setTimeout(120000);
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Faisons connaissance." }),
  ).toBeVisible();
  await audit(page, info, "onboarding");
  await page.evaluate((state) => {
    localStorage.setItem("bouse.academy.v1", JSON.stringify(state));
  }, fixture);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "À vous de jouer, Profil démo." }),
  ).toBeVisible();
  for (const route of [
    "home",
    "academy",
    `lesson/${lesson.id}`,
    "ai",
    "lab",
    "simulation",
    "reviews",
    "skills",
    "portfolio",
    "incubator",
    "project/accessibility-project",
    "project-plan/accessibility-project",
    "radar",
    "settings",
  ]) {
    await page.goto(`/#${route}`);
    await expect(page.locator("main h1")).toBeVisible();
    await audit(page, info, route.replaceAll("/", "-"));
  }
});

test("la recherche se parcourt au clavier et restitue le focus après fermeture ou navigation", async ({
  page,
}, info) => {
  await seed(page);
  await page.goto("/#home");
  const main = page.getByRole("main");
  await expect(main).toBeFocused();
  await page.keyboard.press("Control+k");
  const search = page.getByRole("dialog", { name: "Recherche universelle" });
  const input = search.getByRole("textbox");
  await expect(input).toBeFocused();
  await input.fill("trésorerie");
  const results = search
    .getByRole("group", { name: "RÉSULTATS" })
    .getByRole("button");
  await input.press("ArrowDown");
  await expect(results.first()).toBeFocused();
  await page.keyboard.press("End");
  await expect(results.last()).toBeFocused();
  await page.keyboard.press("Home");
  await expect(results.first()).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(input).toBeFocused();
  await audit(page, info, "recherche");
  await input.fill("zzzz-aucun-resultat");
  await expect(search.getByRole("status")).toHaveText("0 résultat");
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(input).toBeFocused();
  await expect(page).toHaveURL(/#home$/);
  await page.keyboard.press("Escape");
  await expect(main).toBeFocused();

  const opener = page.getByRole("button", {
    name: "Ouvrir la recherche",
    exact: true,
  });
  await opener.focus();
  await opener.press("Enter");
  await input.fill(lesson.title);
  await input.press("Enter");
  await expect(page).toHaveURL(new RegExp(`#lesson/${lesson.id}$`));
  await expect(main).toBeFocused();
  await expect(search).toHaveCount(0);
  await expect(page).toHaveTitle(`${lesson.title} — BOUSE`);
  await page.goBack();
  await expect(page).toHaveURL(/#home$/);
  await expect(main).toBeFocused();
});

test("les menus et la recherche ne superposent pas leurs pièges de focus", async ({
  page,
}, info) => {
  await seed(page);
  await page.goto("/#home");
  await expect(page.getByRole("main")).toBeFocused();
  const opener = page.getByRole("button", {
    name: "Ouvrir la navigation",
    exact: true,
  });
  const search = page.getByRole("dialog", { name: "Recherche universelle" });
  if (await opener.isVisible()) {
    await opener.focus();
    await opener.press("Enter");
    const menu = page.getByRole("dialog", { name: "Navigation des espaces" });
    const close = menu.getByRole("button", { name: "Replier le menu" });
    await expect(close).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(
      menu.getByRole("link", { name: /Profil et paramètres/ }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    await audit(page, info, "navigation-mobile");
    await page.keyboard.press("Control+k");
    await expect(menu).toHaveCount(0);
    await expect(search.getByRole("textbox")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(opener).toBeFocused();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    await opener.press("Enter");
    await menu.getByRole("button", { name: /^Rechercher/ }).press("Enter");
    await expect(search.getByRole("textbox")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(opener).toBeFocused();
    await opener.press("Enter");
    await menu
      .getByRole("link", { name: "Academy", exact: true })
      .press("Enter");
    await expect(page).toHaveURL(/#academy$/);
    await expect(page.getByRole("main")).toBeFocused();
    await opener.press("Enter");
    await page.setViewportSize({ width: 1024, height: 900 });
    await expect(page.getByRole("main")).toBeFocused();
    await expect(menu).toHaveCount(0);
  } else {
    const trigger = page
      .locator(".sidebar")
      .getByRole("button", { name: /^Rechercher/ });
    await trigger.focus();
    await trigger.press("Enter");
    await expect(search.getByRole("textbox")).toBeFocused();
    await page.keyboard.press("Control+k");
    await expect(search).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
  const skip = page.getByRole("link", { name: "Aller au contenu" });
  await skip.focus();
  await skip.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await expect(page).not.toHaveURL(/#main-content$/);
});

test("le diagnostic et le quiz gardent un repère clavier à chaque étape", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Votre prénom ou pseudo").fill("Profil démo");
  await page
    .getByRole("button", { name: "Trouver mon point de départ" })
    .press("Enter");
  await expect(
    page.getByRole("heading", { name: "Trois questions. Aucun jugement." }),
  ).toBeFocused();
  for (const question of await page.locator("fieldset.question").all()) {
    await question.getByRole("radio").first().press("Space");
  }
  await page
    .getByRole("button", { name: "Voir mon point de départ" })
    .press("Enter");
  await expect(
    page.getByRole("heading", { name: "Votre point de départ est posé." }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "Entrer dans mon Academy" })
    .press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.goto(`/#lesson/${lesson.id}`);
  const previous = page.getByRole("button", {
    name: "Séquence précédente",
    exact: true,
  });
  await expect(previous).toBeDisabled();
  await page.getByRole("button", { name: "Séquence suivante" }).press("Enter");
  await expect(previous).toBeEnabled();
  await expect(page.getByRole("tabpanel")).toBeFocused();
  await previous.press("Enter");
  await expect(previous).toBeDisabled();
  await page.getByRole("tab", { name: /Learn/ }).focus();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: /Apply/ })).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("tab", { name: /Prove/ })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("radio").first()).toBeFocused();
  await page.keyboard.press("Space");
  await page
    .getByRole("button", { name: "Valider cette réponse" })
    .press("Enter");
  await expect(page.locator(".learning-quiz-feedback")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Question suivante" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("tabpanel")).toBeFocused();
  await expect(page.getByRole("radio").first()).toBeEnabled();
});

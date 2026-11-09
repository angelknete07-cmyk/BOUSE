import { expect, test, type Page } from "@playwright/test";

const state = {
  schemaVersion: 1,
  profile: {
    name: "Camille",
    level: "Débutant++",
    goal: "Comprendre et piloter un business",
    interests: ["Finance", "Entrepreneuriat"],
    minutes: 20,
    preference: "Exemples puis pratique",
    diagnostic: { finance: 1, business: 3, ai: 0, personal: 1, investing: 3 },
  },
  attempts: [],
  notes: {},
  projects: [],
  lastLessonId: "inv-fonds-enveloppes",
  lessonPositions: {},
};

async function openLesson(page: Page) {
  await page.addInitScript((value) => {
    if (!localStorage.getItem("bouse.academy.v1"))
      localStorage.setItem("bouse.academy.v1", JSON.stringify(value));
  }, state);
  await page.goto("/#lesson/inv-fonds-enveloppes");
  await expect(page.locator(".page-loading")).toHaveCount(0);
}

/** The bubble lies fully on screen, above the mobile dock when there is one. */
async function onScreen(page: Page, name: string) {
  const box = await page
    .getByRole("dialog", { name, exact: true })
    .evaluate((bubble) => {
      const rect = bubble.getBoundingClientRect();
      const dock = document.querySelector(".mobile-bottom-nav");
      const dockTop =
        dock && getComputedStyle(dock).display !== "none"
          ? dock.getBoundingClientRect().top
          : innerHeight;
      return {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: document.documentElement.clientWidth,
        limit: Math.min(dockTop, innerHeight),
      };
    });
  expect(box.left).toBeGreaterThanOrEqual(0);
  expect(box.right).toBeLessThanOrEqual(box.width);
  expect(box.top).toBeGreaterThanOrEqual(0);
  expect(box.bottom).toBeLessThanOrEqual(box.limit);
}

test("une définition s’ouvre sur place, en cascade, avec retour", async ({
  page,
}, testInfo) => {
  await openLesson(page);
  const etf = page.getByRole("button", { name: "ETF : voir la définition" });
  await etf.scrollIntoViewIfNeeded();
  await etf.click();
  const first = page.getByRole("dialog", { name: "ETF (tracker)" });
  await expect(first).toBeVisible();
  await expect(first).toContainText("copie un indice boursier");
  await expect(etf).toHaveAttribute("aria-expanded", "true");
  await expect(first).toBeFocused();
  // The page did not change.
  await expect(page).toHaveURL(/#lesson\/inv-fonds-enveloppes$/);
  await onScreen(page, "ETF (tracker)");

  // A technical word inside the definition opens its own bubble on top.
  const nested = first.getByRole("button", {
    name: "indice boursier : voir la définition",
  });
  await nested.click();
  const second = page.getByRole("dialog", { name: "Indice boursier" });
  await expect(second).toBeVisible();
  await expect(first).toBeVisible();
  await onScreen(page, "Indice boursier");
  // …and so on: CAC 40 is itself a term.
  await expect(
    second.getByRole("button", { name: "CAC 40 : voir la définition" }),
  ).toBeVisible();
  await page.mouse.move(0, 0);
  await page.screenshot({
    path: testInfo.outputPath("20-bulles-definition-viewport.png"),
  });

  // The precise definition stays one click away.
  await second.getByRole("button", { name: "Plus précis" }).click();
  await expect(second).toContainText("Panier de valeurs");

  // Back returns to the first bubble, focus on the term that opened the second.
  await second.getByRole("button", { name: /Retour : ETF/ }).click();
  await expect(second).toHaveCount(0);
  await expect(first).toBeVisible();
  await expect(nested).toBeFocused();

  // Escape closes the last bubble and gives focus back to the lesson term.
  await page.keyboard.press("Escape");
  await expect(first).toHaveCount(0);
  await expect(etf).toBeFocused();
  await expect(etf).toHaveAttribute("aria-expanded", "false");

  // Enter opens it again from the keyboard; a click outside closes it.
  await page.keyboard.press("Enter");
  await expect(first).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(first).toHaveCount(0);
});

test("sur un écran de 320 px, la bulle reste entière et au-dessus du dock", async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "écran de téléphone");
  await page.setViewportSize({ width: 320, height: 700 });
  await openLesson(page);
  const pea = page.getByRole("button", { name: "PEA : voir la définition" });
  // Bring the term near the bottom edge, just above the dock.
  await pea.evaluate((term) => {
    const rect = term.getBoundingClientRect();
    window.scrollBy(0, rect.top - (innerHeight - 130));
  });
  await pea.click();
  const bubble = page.getByRole("dialog", {
    name: "PEA (plan d’épargne en actions)",
  });
  await expect(bubble).toBeVisible();
  await onScreen(page, "PEA (plan d’épargne en actions)");
  await page.screenshot({
    path: testInfo.outputPath("20-bulles-definition-320-viewport.png"),
  });
  await page
    .getByRole("button", { name: /Fermer la définition : PEA/ })
    .click();
  await expect(bubble).toHaveCount(0);
  await expect(pea).toBeFocused();
});

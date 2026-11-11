import { test, expect } from "@playwright/test";

/* Le téléphone simplifié (maquette maquette/telephone.html) : rien n'est
   retiré, le suivi détaillé se replie et l'aide tient sur une ligne. */

const storageKey = "bouse.academy.v1:guest";

test.beforeEach(async ({ page, isMobile }) => {
  test.skip(!isMobile, "réglages propres au téléphone");
  await page.addInitScript(
    ({ key }) => {
      sessionStorage.setItem("bouse.splash.seen", "1");
      localStorage.setItem("bouse.tour.seen", "1");
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
          attempts: [],
          projects: [],
          notes: {},
          lastLessonId: "fp-budget",
        }),
      );
    },
    { key: storageKey },
  );
});

test("l'accueil commence par l'essentiel et replie le suivi", async ({
  page,
}) => {
  await page.goto("/#home");
  const more = page.getByRole("button", { name: /Voir tout mon suivi/ });
  await expect(more).toBeVisible();
  await expect(more).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator(".learning-trajectory")).toBeHidden();
  await expect(page.locator(".home-objectives")).toBeHidden();
  // La leçon à faire vient avant le suivi.
  const hero = await page.locator(".console-top").boundingBox();
  const button = await more.boundingBox();
  expect(hero!.y).toBeLessThan(button!.y);
  await more.click();
  await expect(
    page.getByRole("button", { name: /Replier mon suivi/ }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".learning-trajectory")).toBeVisible();
  await expect(page.locator(".home-objectives")).toBeVisible();
  await expect(page.locator(".topbar .local-status")).toBeHidden();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("l'aide de la page se déplie avec « La suite »", async ({ page }) => {
  await page.goto("/#academy");
  const guide = page.getByRole("complementary", {
    name: "À quoi sert cette page",
  });
  const how = guide.locator("p span");
  await expect(how).toBeHidden();
  await guide.getByRole("button", { name: "La suite" }).click();
  await expect(how).toBeVisible();
  await guide.getByRole("button", { name: "Moins" }).click();
  await expect(how).toBeHidden();
  // Les boutons de l'aide se touchent facilement.
  for (const name of [/Me montrer/, /Masquer les explications/]) {
    const box = await guide.getByRole("button", { name }).boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

import { test, expect } from "@playwright/test";
import { lessons } from "../src/data/lessons";

const state = {
  schemaVersion: 1,
  profile: {
    name: "Profil démo",
    level: "Débutant++",
    goal: "Comprendre et piloter un business",
    interests: ["Finance"],
    minutes: 20,
    preference: "Exemples puis pratique",
    diagnostic: { finance: 1, business: 2, ai: 0, personal: 1, investing: 1 },
  },
  attempts: [],
  notes: {},
  projects: [],
  lastLessonId: null,
};

// Every lesson, every sequence and every tab opens without an error or a
// horizontal overflow: a new lesson cannot ship half broken.
test("chaque leçon du catalogue s’ouvre entièrement sans erreur", async ({
  page,
}, testInfo) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.addInitScript((saved) => {
    if (!localStorage.getItem("bouse.academy.v1:guest"))
      localStorage.setItem("bouse.academy.v1:guest", JSON.stringify(saved));
  }, state);
  for (const lesson of lessons) {
    await page.goto(`/#lesson/${lesson.id}`);
    await expect(
      page.getByRole("heading", { level: 1, name: lesson.title }),
    ).toBeVisible();
    const sequences = lesson.sections.length + 3;
    for (let index = 1; index < sequences; index++) {
      await page
        .getByRole("button", { name: /Séquence suivante/ })
        .first()
        .click();
    }
    for (const tab of ["Pratiquer", "Démontrer", "Appliquer"]) {
      await page.getByRole("tab", { name: new RegExp(tab) }).click();
      await expect(page.getByRole("tabpanel")).toBeVisible();
    }
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(
      overflow,
      `${lesson.id} (${testInfo.project.name})`,
    ).toBeLessThanOrEqual(1);
  }
  expect(errors).toEqual([]);
});

import { test, expect } from "@playwright/test";

/* Idée 33 : une règle qui change après la leçon réussie est signalée sur
   l'accueil, dans la leçon et dans Sources. */

const storageKey = "bouse.academy.v1:guest";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(
    ({ key }) => {
      sessionStorage.setItem("bouse.splash.seen", "1");
      localStorage.setItem("bouse.tour.seen", "1");
      localStorage.setItem("bouse.tours.seen", "home,academy,skills,lesson");
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
          attempts: [
            {
              lessonId: "fp-retraite",
              answers: {},
              correct: 3,
              total: 3,
              percent: 100,
              passed: true,
              at: "2026-10-01T10:00:00.000Z",
            },
          ],
          projects: [],
          notes: {},
          lastLessonId: "fp-retraite",
        }),
      );
    },
    { key: storageKey },
  );
});

test("une règle changée après la leçon est signalée, puis « C'est noté »", async ({ page }) => {
  await page.goto("/#home");
  const alert = page.locator(".rw-alert");
  await expect(alert).toContainText("Une règle a changé depuis ta leçon");
  await expect(alert).toContainText("Âge légal de départ à la retraite");
  await alert.getByRole("button", { name: "C’est noté" }).click();
  await expect(alert).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".rw-alert")).toHaveCount(0);

  await page.goto("/#lesson/fp-retraite");
  await expect(page.locator(".rw-lesson summary")).toContainText("Mis à jour en novembre 2026");
  await expect(page.locator(".rw-lesson")).toContainText("info-retraite.fr");

  await page.goto("/#radar");
  await expect(page.locator(".rw-register li")).toHaveCount(9);
});

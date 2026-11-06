import { readFile } from "node:fs/promises";
import { test, expect, type Page } from "@playwright/test";
import { lessons } from "../src/data/lessons";
import type { AppState } from "../src/lib/types";

const lesson = lessons.find((item) => item.id === "ca-marge-tresorerie")!;
const fixedNow = "2026-11-03T10:00:00.000Z";
const storageKey = "bouse.academy.v1:guest";

function savedState(studied = true): AppState {
  return {
    schemaVersion: 1,
    profile: {
      name: "Profil démo",
      level: "Débutant++",
      goal: "Retenir les repères et les appliquer",
      interests: ["Finance"],
      minutes: 20,
      preference: "Exemples puis pratique",
      diagnostic: { finance: 0, business: 2, ai: 0 },
    },
    attempts: studied
      ? [
          {
            lessonId: lesson.id,
            answers: Object.fromEntries(
              lesson.quiz.map((question) => [
                question.id,
                (question.answer + 1) % question.options.length,
              ]),
            ),
            correct: 0,
            total: lesson.quiz.length,
            percent: 0,
            passed: false,
            at: "2026-11-01T10:00:00.000Z",
          },
        ]
      : [],
    projects: [],
    notes: {},
    lastLessonId: studied ? lesson.id : null,
    // Intentionally an older v1 backup with no reviewEvents field.
  };
}

async function openReviews(page: Page, state = savedState()) {
  await page.clock.setFixedTime(new Date(fixedNow));
  await page.addInitScript(
    ({ initialState, key }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(initialState));
    },
    { initialState: state, key: storageKey },
  );
  await page.goto("/#reviews");
  await expect(
    page.getByRole("heading", {
      name: "Faire revenir les idées.",
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

test("révéler, s’autoévaluer une seule fois et conserver les échéances sans modifier le quiz", async ({
  page,
}) => {
  const initial = savedState();
  await openReviews(page, initial);
  await page
    .getByRole("button", { name: "Commencer la révision", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: lesson.flashcards[0]!.front,
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Retrouvé sans aide", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator(".review-answer")).toHaveCount(0);
  await page
    .getByLabel("Votre rappel", { exact: true })
    .fill(
      "La marge couvre les charges ; un encaissement dépend du délai du client.",
    );
  await page
    .getByRole("button", { name: "Voir les points clés", exact: true })
    .click();
  await expect(page.locator(".review-answer")).toContainText(
    lesson.flashcards[0]!.back,
  );
  await page
    .getByRole("button", { name: "Retrouvé sans aide", exact: true })
    .dblclick();
  await expect
    .poll(async () => (await storedState(page)).reviewEvents?.length)
    .toBe(1);
  await expect(
    page.getByRole("heading", {
      name: lesson.flashcards[1]!.front,
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Encore fragile", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Voir les points clés", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Encore fragile", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Une pause qui compte.", exact: true }),
  ).toBeVisible();
  await expect
    .poll(async () => (await storedState(page)).reviewEvents?.length)
    .toBe(2);
  const saved = await storedState(page);
  expect(saved.attempts).toEqual(initial.attempts);
  expect(saved.reviewEvents?.map((event) => event.rating)).toEqual([
    "remembered",
    "hard",
  ]);
  expect(saved.reviewEvents?.[0]?.dueAt).toBe("2026-11-06T10:00:00.000Z");
  expect(saved.reviewEvents?.[1]?.dueAt).toBe("2026-11-04T10:00:00.000Z");
  expect(new Set(saved.reviewEvents?.map((event) => event.id)).size).toBe(2);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "À jour pour le moment.", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Commencer la révision", exact: true }),
  ).toHaveCount(0);
  expect((await storedState(page)).reviewEvents).toEqual(saved.reviewEvents);
  await noOverflow(page);

  await page.goto("/#settings");
  const downloadEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Exporter mes données", exact: true })
    .click();
  const download = await downloadEvent;
  const path = await download.path();
  expect(path).not.toBeNull();
  const exported: AppState = JSON.parse(await readFile(path!, "utf8"));
  expect(exported.reviewEvents).toEqual(saved.reviewEvents);
  expect(exported.attempts).toEqual(initial.attempts);
  await page.getByLabel("Importer une sauvegarde").setInputFiles({
    name: "ancienne-sauvegarde-v1.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(initial)),
  });
  await page
    .getByRole("button", { name: "Confirmer le remplacement", exact: true })
    .click();
  await page.goto("/#reviews");
  await expect(
    page.getByRole("button", { name: "Commencer la révision", exact: true }),
  ).toBeVisible();
  expect((await storedState(page)).attempts).toEqual(initial.attempts);
  expect((await storedState(page)).reviewEvents ?? []).toEqual([]);
});

test("passer et quitter une session n’inventent aucune réussite", async ({
  page,
}) => {
  const initial = savedState();
  await openReviews(page, initial);
  await page
    .getByRole("button", { name: "Commencer la révision", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Passer cette carte", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: lesson.flashcards[1]!.front,
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Quitter la session", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Une pause qui compte.", exact: true }),
  ).toBeVisible();
  const saved = await storedState(page);
  expect(saved.reviewEvents ?? []).toEqual([]);
  expect(saved.attempts).toEqual(initial.attempts);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Commencer la révision", exact: true }),
  ).toBeVisible();
  await noOverflow(page);
});

test("une bibliothèque jamais travaillée ne crée pas de retard fictif", async ({
  page,
}) => {
  await openReviews(page, savedState(false));
  await expect(
    page.getByRole("heading", {
      name: "Le premier rappel commence par une leçon.",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Commencer la révision", exact: true }),
  ).toHaveCount(0);
  const saved = await storedState(page);
  expect(saved.reviewEvents ?? []).toEqual([]);
  expect(saved.attempts).toEqual([]);
  await noOverflow(page);
});

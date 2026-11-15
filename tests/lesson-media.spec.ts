import { test, expect, type Page } from "@playwright/test";

/* La leçon en vidéo et en podcast (idées 1, 36, 37, 38). Le Chromium des
   tests ne lit pas l'AAC : on vérifie l'interface, pas le son. */

const storageKey = "bouse.academy.v1:guest";
const lessonId = "ca-marge-tresorerie";

async function setup(page: Page) {
  await page.addInitScript(
    ({ key, lessonId }) => {
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
          attempts: [],
          projects: [],
          notes: {},
          lastLessonId: lessonId,
        }),
      );
    },
    { key: storageKey, lessonId },
  );
}

const saved = (page: Page) =>
  page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), storageKey);

test("regarder, écouter ou lire : le choix se garde et la lecture reste", async ({
  page,
}) => {
  await setup(page);
  await page.goto(`/#lesson/${lessonId}`);
  const modes = page.getByRole("group", {
    name: "Votre façon d’apprendre cette leçon",
  });
  const watch = modes.getByRole("button", { name: /Regarder/ });
  await expect(watch).toHaveAttribute("aria-pressed", "true");
  // La durée vient du minutage de la voix.
  await expect(watch).toContainText(/\d min \d\d/);
  const video = page.getByRole("region", { name: "Vidéo de la leçon" });
  await expect(video).toBeVisible();
  await expect(video).toContainText("Chiffre d’affaires, marge et trésorerie");
  await expect(page.getByRole("button", { name: "Lecture" })).toBeEnabled();
  await expect(
    page.getByRole("slider", { name: "Position dans la leçon" }),
  ).toBeVisible();
  await expect(page.locator(".lesson-media audio")).toHaveAttribute(
    "src",
    `/lecons-voix/${lessonId}.m4a`,
  );
  // La lecture de la leçon est toujours là, sous la vidéo.
  await expect(page.getByText("LA QUESTION DE DÉPART")).toBeVisible();

  // Sous-titres à la demande.
  const cc = page.getByRole("button", { name: "Sous-titres" });
  await cc.click();
  await expect(cc).toHaveAttribute("aria-pressed", "true");

  // Écouter : la même voix, sans l'image.
  await modes.getByRole("button", { name: /Écouter/ }).click();
  const podcast = page.getByRole("region", { name: "Podcast de la leçon" });
  await expect(podcast).toContainText("Vous pouvez éteindre l’écran");
  await expect(page.getByRole("button", { name: "Sous-titres" })).toHaveCount(
    0,
  );
  expect((await saved(page)).learningMode).toBe("ecouter");

  // Lire : plus de lecteur, la leçon comme avant ; gardé après rechargement.
  await modes.getByRole("button", { name: /Lire/ }).click();
  await expect(page.locator(".lm-player")).toHaveCount(0);
  await expect(page.getByText("LA QUESTION DE DÉPART")).toBeVisible();
  await page.reload();
  await expect(
    page
      .getByRole("group", { name: "Votre façon d’apprendre cette leçon" })
      .getByRole("button", { name: /Lire/ }),
  ).toHaveAttribute("aria-pressed", "true");
  expect((await saved(page)).learningMode).toBe("lire");
});

test("à la fin de la vidéo, on passe à l'exercice", async ({ page }) => {
  await setup(page);
  await page.goto(`/#lesson/${lessonId}`);
  await expect(page.locator(".lesson-media audio")).toHaveCount(1);
  await page
    .locator(".lesson-media audio")
    .evaluate((audio) => audio.dispatchEvent(new Event("ended")));
  await expect(page.getByText("Leçon écoutée")).toBeVisible();
  await page.getByRole("button", { name: /Passer à l’exercice/ }).click();
  await expect(page.getByRole("tab", { name: /Pratiquer/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("sans minutage, un message clair et la lecture reste", async ({
  page,
}) => {
  await setup(page);
  await page.route(`**/lecons-voix/${lessonId}.json`, (route) =>
    route.fulfill({ status: 404, body: "" }),
  );
  await page.goto(`/#lesson/${lessonId}`);
  await expect(
    page.getByText("La vidéo de cette leçon n’est pas encore prête."),
  ).toBeVisible();
  await expect(page.getByText("LA QUESTION DE DÉPART")).toBeVisible();
});

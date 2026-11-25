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

test("à la fin de la vidéo, l'exercice se fait dans la vidéo", async ({ page }) => {
  await setup(page);
  await page.goto(`/#lesson/${lessonId}`);
  await expect(page.locator(".lesson-media audio")).toHaveCount(1);
  await page
    .locator(".lesson-media audio")
    .evaluate((audio) => audio.dispatchEvent(new Event("ended")));
  const exercise = page.getByRole("dialog", { name: "Exercice de la leçon" });
  await expect(exercise).toContainText("À vous de jouer");
  await exercise.getByRole("textbox").fill("Mon calcul");
  await exercise.getByRole("button", { name: "Un indice" }).click();
  await expect(exercise).toContainText("Indice.");
  await exercise.getByRole("button", { name: "Voir la solution" }).click();
  await exercise.getByRole("button", { name: /Passer au quiz/ }).click();
  await expect(page.getByRole("tab", { name: /Démontrer/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  // Le brouillon suit dans l'onglet « Pratiquer ».
  await page.getByRole("tab", { name: /Pratiquer/ }).click();
  await expect(page.getByRole("textbox", { name: "Votre raisonnement" })).toHaveValue(
    "Mon calcul",
  );
});

test("la vidéo s'arrête après une partie pour une question", async ({ page }) => {
  await setup(page);
  await page.goto(`/#lesson/${lessonId}`);
  const audio = page.locator(".lesson-media audio");
  await expect(audio).toHaveCount(1);
  // On fait comme si la voix jouait et atteignait la fin de la dernière partie
  // (le navigateur de test ne lit pas forcément le son).
  await audio.evaluate(async (el: HTMLAudioElement) => {
    const r = await fetch(el.src.replace(/\.m4a$/, ".json")).then((x) => x.json());
    const lines = r.lines.filter((l: { part: number }) => l.part === 3);
    const at = lines.at(-1).end + 0.5;
    Object.defineProperty(el, "currentTime", { get: () => at, set: () => {}, configurable: true });
    el.pause = () => {};
    el.dispatchEvent(new Event("play"));
  });
  const ask = page.getByRole("dialog", { name: "Question rapide" });
  await expect(ask).toBeVisible();
  await expect(ask).toContainText("Partie");
  await ask.getByRole("button").first().click();
  await expect(ask.getByRole("button", { name: /Reprendre la vidéo/ })).toBeVisible();
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

test("la vidéo animée suit la voix, et sans scénario la vidéo reste simple", async ({
  page,
}) => {
  await setup(page);
  await page.goto(`/#lesson/${lessonId}`);
  const scenes = page.locator(".lesson-media .ls-root");
  await expect(scenes).toHaveCount(1);
  // Au début : le titre de la leçon s'anime.
  await expect(page.locator(".ls-scene.is-on")).toContainText(
    "Chiffre d’affaires, marge et trésorerie",
  );
  // On avance (même sans son) : la scène du compte en banque apparaît.
  await page.locator(".lesson-media audio").evaluate((audio: HTMLAudioElement) => {
    audio.currentTime = 199;
    audio.dispatchEvent(new Event("timeupdate"));
  });
  await expect(page.locator(".ls-scene.is-on .ls-vault")).toContainText("5 100");

  // Sans scénario : les phrases de la voix, comme avant.
  await page.route(`**/lecons-scenes/${lessonId}.json`, (route) =>
    route.fulfill({ status: 404, body: "" }),
  );
  await page.reload();
  await expect(page.getByRole("region", { name: "Vidéo de la leçon" })).toBeVisible();
  await expect(page.locator(".lesson-media .ls-root")).toHaveCount(0);
  // (la position est gardée : on reprend au compte en banque, en phrases)
  await expect(page.locator(".lm-scene")).toBeVisible();
  await expect(page.locator(".lm-scene")).toContainText("Les trois mécanismes");
});

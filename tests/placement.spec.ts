import { test, expect, type Page } from "@playwright/test";

/* Le test de niveau (idée 16) : une question par compétence, arrêt après
   deux ratés dans un niveau, puis ce qui est sauté et la suite. */

const storageKey = "bouse.academy.v1:guest";

async function setup(page: Page) {
  await page.addInitScript(
    ({ key }) => {
      sessionStorage.setItem("bouse.splash.seen", "1");
      localStorage.setItem("bouse.tour.seen", "1");
      localStorage.setItem("bouse.tours.seen", "home,academy,skills");
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
          lastLessonId: null,
          domains: ["fp"],
        }),
      );
    },
    { key: storageKey },
  );
}

const saved = (page: Page) =>
  page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), storageKey);

/** Répond dans l'ordre ; -1 = « Je ne sais pas ». */
async function answer(page: Page, picks: number[]) {
  for (const pick of picks) {
    const options = page.locator(".pl-opt");
    await (pick < 0 ? options.last() : options.nth(pick)).click();
  }
}

test("du domaine au résultat : les compétences sues sont sautées, pas validées", async ({
  page,
}) => {
  await setup(page);
  await page.goto("/#domain/fp");
  await expect(
    page
      .getByRole("heading", { name: "Ta prochaine étape" })
      .or(page.getByRole("heading", { level: 2, name: "Faire son budget" })),
  ).toBeVisible();
  await page.getByRole("button", { name: "Tester mon niveau →" }).click();
  await expect(page).toHaveURL(/#placement\/fp$/);
  await expect(page.locator("#pl-question")).toHaveText(/se payer en premier/);
  await expect(page.getByText("Niveau 1 · Découvrir")).toBeVisible();

  // Arrêter en route : rien n'est enregistré.
  await answer(page, [0, 1]);
  await page.getByRole("button", { name: "Arrêter" }).click();
  expect((await saved(page)).placements).toBeUndefined();

  await page.goto("/#placement/fp");
  await answer(page, [0, 1, 1, 1, 0, -1, 2]);
  const start = page.getByRole("heading", { level: 1, name: "Savoir faire" });
  await expect(start).toBeVisible();
  await expect(start).toBeFocused();
  await expect(
    page.getByText(/répondu juste à 5 questions sur 7/),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Valider Faire son budget" }),
  ).toBeVisible();

  const placements = (await saved(page)).placements;
  expect(placements.fp.known).toEqual([
    "fp-budget",
    "fp-banque-arnaques",
    "fp-fiche-paie",
    "fp-comptes-auto",
    "fp-epargne-precaution",
  ]);
  expect(placements.fp.missed).toEqual([
    "fp-credit-taux",
    "fp-inflation-quotidien",
  ]);
  // Aucune tentative inventée : rien n'est validé.
  expect((await saved(page)).attempts).toEqual([]);

  await page
    .getByRole("button", { name: /Commencer par « Comparer deux crédits »/ })
    .click();
  await expect(page).toHaveURL(/#lesson\/|#skill\//);

  // Dans le domaine : la suite saute ce qui est su, l'étiquette le dit.
  await page.goto("/#domain/fp");
  await expect(page.getByText(/Test de niveau fait le/)).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Comparer deux crédits" }),
  ).toBeVisible();
  await expect(page.getByText("Déjà sue").first()).toBeVisible();
  await expect(page.getByText("0 / 14 validées")).toBeVisible();
});

test("« Valider » ouvre le vrai contrôle de la compétence", async ({
  page,
}) => {
  await setup(page);
  await page.goto("/#placement/fp");
  await answer(page, [0, 1, 1, 1, 0, -1, 2]);
  await page
    .getByRole("button", {
      name: "Valider Mettre ses comptes en pilote automatique",
    })
    .click();
  await expect(page).toHaveURL(/#skill\/fp-comptes-auto\/check$/);
  await expect(page.getByText(/1\. « Se payer en premier »/)).toBeVisible();
});

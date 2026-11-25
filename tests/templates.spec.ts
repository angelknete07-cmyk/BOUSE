import { test, expect } from "@playwright/test";

/* Idée 22 : la boîte à modèles. Remplir, voir le document en direct, le
   retrouver après rechargement, le garder en Excel et en PDF. */

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
          attempts: [],
          projects: [],
          notes: {},
          lastLessonId: null,
        }),
      );
    },
    { key: storageKey },
  );
});

test("une facture se remplit, se calcule et reste enregistrée", async ({
  page,
  isMobile,
}) => {
  await page.goto("/#modeles");
  await expect(page.getByRole("heading", { name: "Des modèles prêts à remplir" })).toBeVisible();
  await page.getByRole("button", { name: /Facture/ }).click();
  await expect(page).toHaveURL(/#modele\/facture$/);

  await page.getByLabel("Désignation, ligne 1").fill("Réparation");
  await page.getByLabel("Quantité, ligne 1").fill("2");
  await page.getByLabel("Prix unitaire HT, ligne 1").fill("150");
  await page.locator("select").selectOption("20");
  if (isMobile) await page.getByRole("button", { name: "Voir le document" }).click();
  const paper = page.locator(".tp-work .tp-paper");
  await expect(paper).toContainText("Réparation");
  await expect(paper.locator(".tp-totals")).toContainText("360 €");
  await expect(paper.locator(".tp-totals")).toContainText("TVA 20 %");

  // Ce qui manque est dit, sans bloquer.
  if (isMobile) await page.getByRole("button", { name: "Remplir", exact: true }).click();
  await expect(page.locator(".tp-problems")).toContainText("ton SIREN");

  await page.waitForTimeout(700);
  await page.reload();
  await expect(page.getByLabel("Désignation, ligne 1")).toHaveValue("Réparation");

  // Excel : un vrai fichier .xlsx.
  if (isMobile) await page.getByRole("button", { name: "Voir le document" }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Ouvrir dans Excel" }).click();
  expect((await download).suggestedFilename()).toBe("boost-facture.xlsx");

  // PDF : seule la feuille part à l'impression.
  await page.evaluate(() => {
    (window as unknown as { printed: number }).printed = 0;
    window.print = () => {
      (window as unknown as { printed: number }).printed++;
    };
  });
  await page.getByRole("button", { name: "Garder en PDF" }).click();
  await expect(page.locator("body > .tp-print .tp-paper")).toHaveCount(1);
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { printed: number }).printed))
    .toBe(1);
});

test("le budget dit ce qui reste, et une leçon mène à son modèle", async ({
  page,
  isMobile,
}) => {
  await page.goto("/#modele/budget");
  await page.getByRole("button", { name: "Remplir avec un exemple" }).click();
  if (isMobile) await page.getByRole("button", { name: "Voir le document" }).click();
  await expect(page.locator(".tp-work .tp-totals")).toContainText("Reste à la fin du mois");
  await expect(page.locator(".tp-work .tp-totals")).toContainText("80 €");
  await page.goto("/#modeles");
  await expect(page.getByRole("button", { name: /Budget du mois/ })).toContainText("Commencé");

  await page.goto("/#lesson/fp-budget");
  await page.getByRole("tab", { name: /Appliquer/ }).click();
  await page.getByRole("button", { name: /Le remplir/ }).click();
  await expect(page).toHaveURL(/#modele\/budget$/);
});

import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

/* Les missions réelles (idée 14) : un vrai projet, des missions qui
   remplissent un vrai dossier, visible en direct. */

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
        }),
      );
    },
    { key: storageKey },
  );
}

const saved = (page: Page) =>
  page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), storageKey);

async function fill(page: Page, values: Record<string, string>) {
  for (const [label, value] of Object.entries(values))
    await page.getByLabel(label).fill(value);
}
const validate = (page: Page) =>
  page.getByRole("button", { name: /Valider la mission/ }).click();
const title = (page: Page, name: string | RegExp) =>
  expect(page.getByRole("heading", { level: 1, name })).toBeVisible();

test("une mission remplit le dossier en direct, jusqu’au dossier prêt", async ({
  page,
}) => {
  await setup(page);
  await page.goto("/#incubator");
  await page.getByRole("button", { name: /Choisir une mission/ }).click();
  await title(page, "Apprends en faisant ton vrai dossier");
  await page.getByRole("button", { name: /Mon budget de l’année/ }).click();
  await title(page, "Ce qui rentre chaque mois");

  // Rien de rempli : l'étape dit ce qui manque.
  await validate(page);
  await expect(page.getByRole("alert")).toContainText("à remplir");

  const paper = page.getByRole("complementary", {
    name: "Ton dossier, en direct",
  });
  await fill(page, {
    "Ton salaire net (ou tes revenus) (€)": "1 650",
    "Autres rentrées (aides, extras) (€)": "0",
  });
  await expect(paper).toContainText("Total des rentrées");
  await expect(paper).toContainText(/1\s650 €/);
  await validate(page);
  await title(page, "Tes dépenses fixes");

  // Le brouillon et la progression tiennent après un rechargement.
  await page.getByLabel(/Logement/).fill("620");
  await page.waitForTimeout(600);
  await page.reload();
  await title(page, "Tes dépenses fixes");
  await expect(page.getByLabel(/Logement/)).toHaveValue("620");

  await fill(page, {
    "Énergie, internet, téléphone (€)": "95",
    "Assurances (€)": "40",
    "Transport (€)": "75",
    "Abonnements (€)": "30",
  });
  await validate(page);
  await fill(page, {
    "Courses (€)": "280",
    "Sorties et loisirs (€)": "120",
    "Imprévus et divers (€)": "60",
  });
  await validate(page);
  await title(page, "Ce qui reste, et où il va");
  await fill(page, {
    "Ce que tu mets de côté chaque mois (€)": "200",
    "Le jour du virement automatique": "le 2 du mois",
  });
  await expect(paper).toContainText("Reste chaque mois");
  await expect(paper).toContainText("330 €");
  await validate(page);
  await fill(page, {
    "Ce que tu as déjà de côté (€)": "800",
    "Combien de mois de dépenses tu vises": "trois",
  });
  await validate(page);
  await expect(page.getByRole("alert")).toContainText("un nombre");
  await page.getByLabel("Combien de mois de dépenses tu vises").fill("3");
  await expect(paper).toContainText("16 mois");
  await validate(page);

  await title(page, "Ton dossier est prêt");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Télécharger mon dossier" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("dossier-budget-annee.md");
  const text = await readFile((await file.path())!, "utf8");
  expect(text).toContain("# Mon budget de l’année");
  expect(text).toMatch(/Reste chaque mois : 330 €/);

  const state = await saved(page);
  expect(state.missions["budget-annee"].done).toHaveLength(5);
  expect(state.missions["budget-annee"].finishedAt).toBeTruthy();

  // La compétence est marquée « mise en pratique » dans son domaine.
  await page.getByRole("button", { name: "Faire son budget" }).first().click();
  await expect(
    page.getByText("Mise en pratique dans une mission réelle"),
  ).toBeVisible();
  await page.goto("/#domain/fp");
  await expect(
    page
      .getByRole("button", { name: /Faire son budget/ })
      .getByText("Mise en pratique"),
  ).toBeVisible();

  // La liste montre le dossier prêt ; aucune page ne déborde.
  await page.goto("/#missions");
  await expect(
    page.getByRole("button", { name: /Mon budget de l’année/ }),
  ).toContainText("Dossier prêt");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("une mission se reprend où on l’a laissée", async ({
  page,
}) => {
  await setup(page);
  await page.goto("/#mission/micro-entreprise");
  await title(page, "Ton idée en une phrase");
  // Les étapes suivantes ne s'ouvrent pas avant leur tour.
  await expect(
    page.getByRole("button", { name: /Ton premier devis/ }),
  ).toBeDisabled();
  await fill(page, {
    "Ce que tu proposes": "Des photos pour les commerces",
    "Pour qui": "Cafés et boutiques",
    "Le problème que ça règle": "Leurs photos sont sombres",
  });
  await validate(page);
  await title(page, "Ton prix");
  await page.goto("/#missions");
  await expect(
    page.getByRole("button", { name: /Lancer ma micro-entreprise/ }),
  ).toContainText("En cours · 1 / 6");
  await page
    .getByRole("button", { name: /Lancer ma micro-entreprise/ })
    .click();
  await title(page, "Ton prix");
  // On peut revenir à une étape faite.
  await page.getByRole("button", { name: /Ton idée en une phrase/ }).click();
  await expect(page.getByLabel("Pour qui")).toHaveValue("Cafés et boutiques");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

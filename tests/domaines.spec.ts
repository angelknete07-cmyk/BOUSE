import { test, expect, type Page } from "@playwright/test";
import { closeTree, openTree } from "./treeHelpers";

/* Le catalogue des compétences : choisir ses domaines, les voir, les retrouver
   dans l'arbre (idées 13 et 15). */

const storageKey = "bouse.academy.v1:guest";

async function skipIntro(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("bouse.splash.seen", "1");
    localStorage.setItem("bouse.tour.seen", "1");
    localStorage.setItem("bouse.tours.seen", "home,academy,skills");
  });
}

async function seedProfile(page: Page) {
  await page.addInitScript(
    ({ key }) => {
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

test("au début, on coche ses domaines et ils sont gardés", async ({ page }) => {
  await skipIntro(page);
  await page.goto("/");
  const picker = page.getByRole("group", { name: /Ce qui t’intéresse/ });
  await expect(picker).toBeVisible();
  // Les domaines des premières leçons sont cochés d'office.
  await expect(
    picker.getByRole("button", { name: /Ton argent au quotidien/ }),
  ).toHaveAttribute("aria-pressed", "true");
  const papers = picker.getByRole("button", { name: /Papiers, impôts/ });
  await expect(papers).toHaveAttribute("aria-pressed", "false");
  await papers.click();
  await expect(papers).toHaveAttribute("aria-pressed", "true");
  await picker.getByRole("button", { name: /Investir/ }).click();
  await page
    .getByRole("button", { name: /Trouver mon point de départ/ })
    .click();
  await page.getByRole("button", { name: /Voir mon point de départ/ }).click();
  await page.getByRole("button", { name: /Entrer dans l’Académie/ }).click();
  await expect
    .poll(async () => (await saved(page)).domains)
    .toEqual(["fp", "papiers", "ent", "fin", "ia"]);
});

test("l'Académie mène à un domaine, à une compétence courte et au choix des domaines", async ({
  page,
}) => {
  await skipIntro(page);
  await seedProfile(page);
  await page.goto("/#academy");
  const strip = page.getByRole("region", { name: "Tes domaines" });
  await strip
    .getByRole("button", { name: /Créer et faire tourner une activité/ })
    .click();
  await expect(page).toHaveURL(/#domain\/ent$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Créer et faire tourner une activité",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Valider un problème" }),
  ).toContainText("Ta prochaine étape");
  // Une compétence courte ouvre sa fiche interactive.
  await page
    .getByRole("button", { name: /^Trouver une idée d’activité/ })
    .click();
  await expect(page).toHaveURL(/#skill\/ent-idee$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Trouver une idée d’activité",
  );
  await expect(page.getByRole("region", { name: "1. L’idée" })).toBeVisible();
  // Retour au domaine, puis on en ajoute un autre.
  await page.getByRole("button", { name: /← Créer et faire tourner/ }).click();
  await page
    .getByRole("group", { name: "Tes domaines" })
    .getByRole("button", { name: /Ajouter un domaine/ })
    .click();
  await expect(page).toHaveURL(/#domains$/);
  await page.getByRole("button", { name: /^Se loger et l’immobilier/ }).click();
  await expect(page.getByRole("status")).toContainText("6 domaines choisis");
  await expect.poll(async () => (await saved(page)).domains).toContain("immo");
  // Le nouveau domaine a sa branche dans l'arbre, ses compétences prêtes.
  await page.goto("/#skills");
  const branches = page.getByRole("list", { name: "Les branches de l’arbre" });
  await expect(branches.getByRole("listitem")).toHaveCount(6);
  await expect(branches).toContainText("Se loger et l’immobilier");
  const tree = await openTree(page);
  await expect(
    tree
      .getByRole("button", { name: /· À explorer, tu peux la faire/ })
      .first(),
  ).toBeAttached();
  await expect(
    tree.getByRole("button", { name: /· Bientôt, la leçon s’écrit/ }),
  ).toHaveCount(0);
  await closeTree(page);
  // La page ne déborde jamais en largeur, même sur téléphone.
  for (const route of ["domains", "domain/immo", "skill/ent-idee"]) {
    await page.goto(`/#${route}`);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("une compétence courte se fait en trois temps et se valide", async ({
  page,
}) => {
  await skipIntro(page);
  await seedProfile(page);
  await page.goto("/#skill/fp-fiche-paie");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Lire sa fiche de paie",
  );
  // 1. L'idée
  await expect(page.getByRole("region", { name: "1. L’idée" })).toContainText(
    "À retenir",
  );
  await page.getByRole("button", { name: "Passer au geste →" }).click();
  // 2. Le geste : un modèle à remplir et à garder
  const gesture = page.getByRole("region", { name: "2. Le geste" });
  await expect(gesture).toBeFocused();
  await gesture.getByLabel("Salaire brut du mois").fill("1 900 €");
  const download = page.waitForEvent("download");
  await gesture
    .getByRole("button", { name: "Garder mon modèle (texte)" })
    .click();
  expect((await download).suggestedFilename()).toBe("fp-fiche-paie.txt");
  await page.getByRole("button", { name: "Passer au contrôle →" }).click();
  // 3. Le contrôle : une erreur, puis les trois bonnes réponses
  const check = page.getByRole("region", { name: "3. Le contrôle" });
  const verify = check.getByRole("button", { name: "Vérifier mes réponses" });
  await expect(verify).toBeDisabled();
  await check.getByLabel("2 440 €").check();
  await check.getByLabel("le net à payer, après l’impôt à la source").check();
  await check.getByLabel("Toute sa vie").check();
  await verify.click();
  await expect(check.getByRole("status")).toContainText("2/3");
  await check.getByLabel("1 560 €").check();
  await verify.click();
  await expect(check.getByRole("status")).toContainText(
    "3/3 · Compétence validée",
  );
  // Elle est validée dans son domaine.
  await page.getByRole("button", { name: /← Ton argent au quotidien/ }).click();
  await expect(
    page.getByRole("button", { name: /^Lire sa fiche de paie/ }),
  ).toContainText("Validée");
});

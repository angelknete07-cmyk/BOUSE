import { readFile } from "node:fs/promises";
import { test, expect, type Page } from "@playwright/test";
import { lessons } from "../src/data/lessons";

const firstLesson = lessons.find(
  (lesson) => lesson.id === "ca-marge-tresorerie",
)!;

async function noHorizontalOverflow(page: Page) {
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

async function onboard(page: Page) {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Faisons connaissance." }),
  ).toBeVisible();
  await noHorizontalOverflow(page);
  await page.getByLabel("Votre prénom ou pseudo").fill("Camille");
  await page.getByLabel("Temps par session").selectOption("20");
  await page
    .getByRole("button", { name: "Trouver mon point de départ" })
    .click();
  await page
    .getByRole("radio", {
      name: "La vente et l’encaissement n’ont pas lieu au même moment.",
      exact: true,
    })
    .locator("..")
    .click();
  await page
    .getByRole("radio", {
      name: "Des clients décrivent une difficulté récente et une solution qu’ils paient déjà.",
      exact: true,
    })
    .locator("..")
    .click();
  await page
    .getByRole("radio", {
      name: "Non, il faut vérifier les affirmations importantes.",
      exact: true,
    })
    .locator("..")
    .click();
  await page.getByRole("button", { name: "Voir mon point de départ" }).click();
  await expect(
    page.getByText("3/3 repères identifiés.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Entrer dans mon Academy" }).click();
  await expect(
    page.getByRole("heading", { name: "À vous de jouer, Camille." }),
  ).toBeVisible();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await noHorizontalOverflow(page);
}

async function navigate(page: Page, name: string) {
  const link = page
    .getByRole("navigation", { name: "Navigation principale" })
    .getByRole("link", { name, exact: true });
  const menu = page.getByRole("button", {
    name: "Ouvrir la navigation",
    exact: true,
  });
  if (await menu.isVisible()) await menu.click();
  await link.click();
}

async function openFinanceLesson(page: Page) {
  await navigate(page, "Academy");
  await page
    .getByLabel("Rechercher une leçon", { exact: true })
    .fill("tresorerie");
  const card = page.locator("article").filter({
    has: page.getByRole("heading", { name: firstLesson.title, exact: true }),
  });
  await card.getByRole("button", { name: /Explorer/ }).click();
  await expect(
    page.getByRole("heading", { name: firstLesson.title, exact: true }),
  ).toBeVisible();
}

test("apprendre, prouver, appliquer et retrouver la progression après rechargement", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await onboard(page);
  await page.screenshot({
    path: testInfo.outputPath("dashboard.png"),
    fullPage: true,
  });
  await openFinanceLesson(page);
  const cashScene = page.getByRole("region", {
    name: "Explorer le résultat et la trésorerie",
  });
  await expect(cashScene.locator(".scene-number")).toHaveText(/-800\s?€/);
  const paymentDay = cashScene.getByRole("slider", {
    name: "Jour de règlement du client",
  });
  await paymentDay.focus();
  await paymentDay.press("Home");
  await expect(cashScene.locator(".scene-number")).toHaveText(/200\s?€/);
  await cashScene
    .getByRole("button", { name: "Résultat", exact: true })
    .click();
  await paymentDay.focus();
  await paymentDay.press("End");
  await expect(cashScene.locator(".scene-number")).toHaveText(/200\s?€/);
  await cashScene
    .getByRole("button", { name: "Trésorerie", exact: true })
    .click();
  await expect(cashScene.locator(".scene-number")).toHaveText(/-800\s?€/);
  await page.getByRole("tab", { name: /Do/ }).click();
  await page
    .getByLabel("Votre raisonnement")
    .fill(
      "Je soustrais les coûts variables et les charges fixes au chiffre d’affaires.",
    );
  await page.getByRole("button", { name: "Un indice", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Le premier repère" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Comparer avec la solution" }).click();
  await expect(
    page.getByRole("heading", { name: "Une solution expliquée" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Vérifier ma compréhension" }).click();
  for (const [index, question] of firstLesson.quiz.entries()) {
    await page
      .getByRole("radio", {
        name: question.options[question.answer],
        exact: true,
      })
      .locator("..")
      .click();
    if (index < firstLesson.quiz.length - 1) {
      await page
        .getByRole("button", { name: "Valider cette réponse", exact: true })
        .click();
      await expect(
        page.getByText(question.explanation, { exact: false }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Question suivante", exact: true })
        .click();
    }
  }
  await page.getByRole("button", { name: "Vérifier mes réponses" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "2/2 · 100 %" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Vérifier mes réponses" }),
  ).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("bouse.academy.v1")!).attempts.length,
      ),
    )
    .toBe(1);
  await page
    .getByRole("button", { name: "Appliquer à un projet", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Garder cette idée dans l’incubateur" })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "Idée enregistrée" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Garder cette idée dans l’incubateur" })
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("bouse.academy.v1")!).projects.length,
      ),
    )
    .toBe(1);
  await page.getByRole("button", { name: "Ouvrir mon incubateur" }).click();
  const project = page.locator("article").filter({
    has: page.getByRole("heading", {
      name: firstLesson.idea.title,
      exact: true,
    }),
  });
  await expect(project).toBeVisible();
  await project.getByRole("button", { name: "Modifier la fiche" }).click();
  await page
    .getByLabel("Pour quel client ou utilisateur ?")
    .fill("Artisans qui facturent leurs clients à 60 jours");
  await page
    .getByLabel("L’hypothèse la plus risquée à tester")
    .fill(
      "Trois artisans sur cinq oublient de prévoir les décalages de paiement.",
    );
  await page.getByRole("button", { name: "Enregistrer le projet" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Projet mis à jour." }),
  ).toBeVisible();
  await project.getByRole("button", { name: "Passer à « Recherche »" }).click();
  await page.reload();
  await expect(
    page.locator("article").getByText("Recherche", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Artisans qui facturent leurs clients à 60 jours", {
      exact: true,
    }),
  ).toBeVisible();
  await navigate(page, "Mes compétences");
  const skill = page.locator("article").filter({
    has: page.getByRole("heading", { name: firstLesson.title, exact: true }),
  });
  await expect(
    skill.getByText("Compréhension vérifiée au dernier quiz", { exact: true }),
  ).toBeVisible();
  await noHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test("calcul financier, limites du modèle et recherche au clavier vers AI Lab", async ({
  page,
}) => {
  await onboard(page);
  await navigate(page, "Lab financier");
  await page.locator("#economics-price").fill("50");
  await page.locator("#economics-unitCost").fill("20");
  await page.locator("#economics-units").fill("100");
  await page.locator("#economics-fixedCosts").fill("2000");
  const metrics = page.getByRole("region", { name: "Résultats du scénario" });
  await expect(metrics).toContainText(/5\s?000\s?€/);
  await expect(metrics).toContainText(/1\s?000\s?€/);
  await expect(
    page.getByRole("heading", { name: "67 unités pour atteindre l’équilibre" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Garder comme référence" }).click();
  await page.locator("#economics-unitCost").fill("50");
  await expect(
    page.getByRole("heading", { name: "Ce modèle ne couvre pas ses charges." }),
  ).toBeVisible();
  await page.locator("#economics-price").fill("0");
  await expect(page.getByRole("alert")).toContainText(
    "Le prix de vente doit être strictement positif.",
  );
  await page.locator("#economics-price").fill("60");
  await noHorizontalOverflow(page);
  await page.keyboard.press("Control+k");
  const palette = page.getByRole("dialog", { name: "Recherche universelle" });
  await expect(palette).toBeVisible();
  await palette.getByRole("textbox").fill("AI Lab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "De l’intention à l’instruction." }),
  ).toBeVisible();
  await expect(
    page.getByText("Aucun modèle IA connecté.", { exact: false }),
  ).toBeVisible();
  await page
    .getByLabel("Quel travail voulez-vous confier à l’IA ?")
    .fill(
      "Objectif : compare les offres. Contexte : entreprise de cinq salariés. Données : fichier ci-dessous. Contrainte : maximum 200 mots. Format : tableau. Critère de réussite : vérifie et signale chaque incertitude.",
    );
  await page.getByRole("button", { name: "Examiner la structure" }).click();
  await expect(page.getByRole("heading", { name: "100 / 100" })).toBeVisible();
  await expect(
    page.getByText("Un repère, pas une note de qualité", { exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Control+k");
  await palette.getByRole("textbox").fill("cash");
  await palette
    .getByRole("button")
    .filter({ hasText: firstLesson.title })
    .click();
  await expect(
    page.getByRole("heading", { name: firstLesson.title, exact: true }),
  ).toBeVisible();
  await noHorizontalOverflow(page);
});

test("une erreur alimente la révision ; export et import nécessitent un remplacement explicite", async ({
  page,
}) => {
  await onboard(page);
  await openFinanceLesson(page);
  await page.getByRole("tab", { name: /Prove/ }).click();
  for (const [index, question] of firstLesson.quiz.entries()) {
    await page
      .getByRole("radio", {
        name: question.options[(question.answer + 1) % question.options.length],
        exact: true,
      })
      .locator("..")
      .click();
    if (index < firstLesson.quiz.length - 1) {
      await page
        .getByRole("button", { name: "Valider cette réponse", exact: true })
        .click();
      await expect(
        page.getByText(question.explanation, { exact: false }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Question suivante", exact: true })
        .click();
    }
  }
  await page.getByRole("button", { name: "Vérifier mes réponses" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "0/2 · 0 %" }),
  ).toBeVisible();
  await navigate(page, "Vue d’ensemble");
  await expect(
    page.getByRole("button", { name: /01 repère à consolider/i }),
  ).toContainText("01");
  await page.goto("/#settings");
  await expect(
    page.getByRole("heading", { name: "Vous gardez la main." }),
  ).toBeVisible();
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter mes données" }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("bouse-sauvegarde.json");
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  const exported = JSON.parse(await readFile(downloadPath!, "utf8"));
  expect(exported.profile.name).toBe("Camille");
  expect(exported.attempts).toHaveLength(1);
  expect(exported.attempts[0].passed).toBe(false);
  await page.getByLabel("Importer une sauvegarde").setInputFiles({
    name: "invalide.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"schemaVersion":999}'),
  });
  await expect(page.getByRole("status")).toContainText("Version ou structure");
  await expect(
    page.getByRole("button", { name: "Confirmer le remplacement" }),
  ).toHaveCount(0);
  exported.profile.name = "Alex";
  await page.getByLabel("Importer une sauvegarde").setInputFiles({
    name: "valide.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(exported)),
  });
  await expect(page.getByRole("status")).toContainText("Sauvegarde reconnue");
  await expect(
    page.getByLabel("Prénom ou pseudo", { exact: true }),
  ).toHaveValue("Camille");
  await page.getByRole("button", { name: "Confirmer le remplacement" }).click();
  await expect(
    page.getByLabel("Prénom ou pseudo", { exact: true }),
  ).toHaveValue("Alex");
  await page.reload();
  await expect(
    page.getByLabel("Prénom ou pseudo", { exact: true }),
  ).toHaveValue("Alex");
  await noHorizontalOverflow(page);
});

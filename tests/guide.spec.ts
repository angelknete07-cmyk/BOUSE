import { test, expect, type Page } from "@playwright/test";
import type { AppState } from "../src/lib/types";

/* Le didacticiel : visite d'accueil, visites des espaces, « Tes premiers pas ». */

const storageKey = "bouse.academy.v1:guest";

function savedState(started: boolean): AppState {
  return {
    schemaVersion: 1,
    profile: {
      name: "Camille",
      level: "Débutant",
      goal: "Comprendre les bases",
      interests: ["Finance"],
      minutes: 20,
      preference: "Exemples puis pratique",
      diagnostic: { finance: 0, business: 0, ai: 0 },
    },
    attempts: started
      ? [
          {
            lessonId: "ca-marge-tresorerie",
            answers: {},
            correct: 3,
            total: 3,
            percent: 100,
            passed: true,
            at: "2026-11-01T10:00:00.000Z",
          },
        ]
      : [],
    projects: [],
    notes: {},
    lastLessonId: started ? "ca-marge-tresorerie" : null,
  };
}

async function open(page: Page, route: string, started = false) {
  await page.addInitScript(
    ({ state, key }) => {
      sessionStorage.setItem("bouse.splash.seen", "1");
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(state));
    },
    { state: savedState(started), key: storageKey },
  );
  await page.goto(`/#${route}`);
}

test("« Tes premiers pas » suit ce que l'apprenant a vraiment fait", async ({
  page,
}) => {
  await open(page, "home");
  const steps = page.getByRole("region", { name: "Tes premiers pas" });
  await expect(steps).toBeVisible();
  await expect(steps).toContainText("0 sur 5");
  await expect(steps).toContainText("Ouvre ta première leçon");
  // Sur l'accueil, la carte remplace la phrase d'aide.
  await expect(page.locator(".page-guide")).toHaveCount(0);

  // Toucher un mot souligné coche le deuxième pas.
  await page.evaluate(() => {
    const term = document.createElement("button");
    term.className = "glossary-inline-term";
    document.body.append(term);
    term.click();
    term.remove();
  });
  await expect(steps).toContainText("1 sur 5");

  // Masquer la carte la range pour de bon ; la phrase d'aide revient.
  await steps.getByRole("button", { name: "Masquer les premiers pas" }).click();
  await expect(steps).toHaveCount(0);
  await expect(page.locator(".page-guide")).toBeVisible();
  await page.reload();
  await expect(page.locator(".page-guide")).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Tes premiers pas" }),
  ).toHaveCount(0);
});

test("les pas déjà faits sont cochés au retour", async ({ page }) => {
  await open(page, "home", true);
  const steps = page.getByRole("region", { name: "Tes premiers pas" });
  await expect(steps).toContainText("2 sur 5");
  await expect(steps).toContainText("Première leçon : fait");
  await expect(steps).toContainText("Quiz réussi : fait");
  await expect(steps).toContainText("Mot souligné : à faire maintenant");
});

test("la visite d'accueil se suit, se passe et se relance", async ({
  page,
}) => {
  await open(page, "home");
  await page
    .getByRole("region", { name: "Tes premiers pas" })
    .getByRole("button", { name: "Revoir la visite guidée" })
    .click();
  const tour = page.getByRole("dialog", { name: "Tes espaces" });
  await expect(tour).toBeVisible();
  await expect(tour).toContainText("1 sur 5");
  await page.getByRole("button", { name: "Suivant" }).click();
  await expect(
    page.getByRole("dialog", { name: "Commence ici" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Suivant" }).click();
  const demo = page.getByRole("dialog", {
    name: "Un mot que tu ne connais pas ?",
  });
  await demo.getByRole("button", { name: "ETF" }).click();
  await expect(demo).toContainText("Un panier tout prêt");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);

  // Les préférences la relancent aussi, depuis n'importe quel espace.
  await page.goto("/#settings");
  await page.getByRole("button", { name: "Revoir la visite guidée" }).click();
  await expect(page).toHaveURL(/#home$/);
  await expect(page.getByRole("dialog", { name: "Tes espaces" })).toBeVisible();
});

for (const [route, first] of [
  ["academy", "Ta prochaine leçon"],
  ["reviews", "Tes rappels"],
  ["skills", "Où tu en es"],
  ["lab", "Une seule vente"],
  ["simulation", "Choisis un cas"],
  ["ai", "Écris ta demande"],
  ["incubator", "Crée un projet"],
  ["radar", "Avant de décider"],
] as const)
  test(`l'espace « ${route} » a sa visite`, async ({ page }) => {
    await open(page, route);
    await page.getByRole("button", { name: "Me montrer" }).click();
    const dialog = page.getByRole("dialog", { name: first });
    await expect(dialog).toBeVisible();
    // Chaque étape éclaire quelque chose et reste dans l'écran.
    const total = Number(
      (await dialog.locator(".tour-count").textContent())!.split(" sur ")[1],
    );
    for (let index = 0; index < total; index += 1) {
      const card = page.locator(".tour-card");
      await expect(card).toHaveAttribute("data-in", "");
      const box = (await card.boundingBox())!;
      const viewport = page.viewportSize()!;
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
      await page
        .getByRole("button", {
          name: index === total - 1 ? "J’ai compris" : "Suivant",
        })
        .click();
    }
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

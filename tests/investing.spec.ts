import { test, expect, type Page } from "@playwright/test";
import { glossary } from "../src/data/investingGlossary";

async function seed(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      "bouse.academy.v1",
      JSON.stringify({
        schemaVersion: 1,
        profile: {
          name: "Profil démo",
          level: "Débutant++",
          goal: "Comprendre et piloter un business",
          interests: ["Investissement"],
          minutes: 20,
          preference: "Exemples puis pratique",
          diagnostic: { finance: 1, business: 2, ai: 0 },
        },
        attempts: [],
        projects: [],
        notes: {},
        lastLessonId: null,
      }),
    );
  });
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

test("le lexique filtre, cherche et renvoie vers la leçon qui explique le terme", async ({
  page,
}) => {
  await seed(page);
  await page.goto("/#academy");
  await page.getByRole("button", { name: "Lexique de la bourse" }).click();
  await expect(
    page.getByRole("heading", { name: "Lexique de la bourse." }),
  ).toBeVisible();
  await expect(page.locator(".glossary-count")).toHaveText(
    `${glossary.length} termes`,
  );
  const orders = glossary.filter((entry) => entry.category === "Ordres");
  await page
    .getByRole("group", { name: "Catégories du lexique" })
    .getByRole("button", { name: "Ordres", exact: true })
    .click();
  await expect(page.locator(".glossary-count")).toHaveText(
    `${orders.length} termes`,
  );
  await page.getByLabel("Chercher un terme").fill("spread");
  await expect(page.locator(".glossary-entry")).toHaveCount(1);
  await expect(page.getByText("Fourchette (spread)")).toBeVisible();
  await page.getByRole("button", { name: /Leçon : Passer un ordre/ }).click();
  await expect(
    page.getByRole("heading", {
      name: "Passer un ordre et déjouer ses biais",
      exact: true,
    }),
  ).toBeVisible();
  await noOverflow(page);
});

test("la recherche universelle ouvre un terme du lexique", async ({ page }) => {
  await seed(page);
  await page.goto("/#home");
  await page.keyboard.press("Control+k");
  const palette = page.getByRole("dialog", { name: "Recherche universelle" });
  await palette.getByRole("textbox").fill("dividende");
  await expect(
    palette.getByRole("button").filter({ hasText: "Dividende" }).first(),
  ).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#lexique\/dividende$/);
  await expect(page.locator("#terme-dividende")).toHaveClass(/is-focused/);
});

test("le simulateur de la leçon montre le coût des frais et respecte le modèle testé", async ({
  page,
}) => {
  await seed(page);
  await page.goto("/#lesson/inv-interets-composes");
  const scene = page.getByRole("region", {
    name: "Explorer les intérêts composés et les frais",
  });
  await expect(scene.locator(".scene-number")).toHaveText(/21\s?702\s?€/);
  await scene.getByLabel("Frais annuels en pourcentage").fill("0");
  await expect(scene.locator(".scene-number")).toHaveText(/26\s?533\s?€/);
  await expect(scene).toContainText("pas une prévision");
  await noOverflow(page);
});

test("sans serveur configuré, le mentor l’annonce et ne simule aucune réponse", async ({
  page,
}) => {
  await seed(page);
  await page.goto("/#lesson/inv-marches-financiers");
  await page.getByText("Poser une question au mentor").click();
  await expect(
    page.getByText("Mentor IA non connecté sur cette installation"),
  ).toBeVisible();
  await expect(page.getByLabel("Votre question sur cette leçon")).toHaveCount(
    0,
  );
});

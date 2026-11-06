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
  await page.getByRole("button", { name: "Lexique de l’Académie" }).click();
  await expect(
    page.getByRole("heading", { name: "Lexique de l’Académie." }),
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
  // Effects have run (focus moved to main): the shortcut listener is attached.
  await expect(page.getByRole("main")).toBeFocused();
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
    page.getByText("Mentor intégré non connecté sur cette installation"),
  ).toBeVisible();
  await expect(page.getByLabel("Votre question sur cette leçon")).toHaveCount(
    0,
  );
  // The free hand-off to the person's own Claude stays available.
  const handoff = page.getByRole("button", {
    name: "Copier et demander à mon Claude",
  });
  await expect(handoff).toBeDisabled();
  await page
    .getByLabel("Votre question", { exact: true })
    .fill("C’est quoi un indice ?");
  await expect(handoff).toBeEnabled();
});

test("le simulateur de crédit montre qu’allonger la durée baisse la mensualité et augmente le coût", async ({
  page,
}) => {
  await seed(page);
  await page.goto("/#lesson/fp-credit-taux");
  const scene = page.getByRole("region", {
    name: "Explorer la mensualité et le coût d’un crédit",
  });
  await scene.getByLabel("Taux nominal annuel en pourcentage").fill("6");
  await scene.getByLabel("Durée du crédit en mois").fill("12");
  await expect(scene.locator(".scene-number")).toHaveText(/258,20\s?€/);
  await expect(scene).toContainText("98,39");
  await scene.getByLabel("Durée du crédit en mois").fill("24");
  await expect(scene.locator(".scene-number")).toHaveText(/132,96\s?€/);
  await expect(scene).toContainText("191,08");
  await noOverflow(page);
});

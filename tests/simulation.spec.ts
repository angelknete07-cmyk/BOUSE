import { readFile } from "node:fs/promises";
import { test, expect, type Page } from "@playwright/test";
import type { AppState } from "../src/lib/types";

const storageKey = "bouse.academy.v1:guest";
const fixedNow = "2026-11-03T10:00:00.000Z";

function oldState(): AppState {
  return {
    schemaVersion: 1,
    profile: {
      name: "Profil démo",
      level: "Débutant++",
      goal: "Comprendre les effets d’une décision",
      interests: ["Finance"],
      minutes: 20,
      preference: "Exemples puis pratique",
      diagnostic: { finance: 1, business: 0, ai: 0 },
    },
    attempts: [],
    projects: [],
    notes: {},
    lastLessonId: null,
    // A historical v1 backup deliberately has no simulations field.
  };
}

async function openSimulation(page: Page) {
  await page.clock.setFixedTime(new Date(fixedNow));
  await page.addInitScript(
    ({ key, state }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(state));
    },
    { key: storageKey, state: oldState() },
  );
  await page.goto("/#simulation");
  await expect(
    page.getByRole("heading", {
      name: "Rentable. Mais à court de cash ?",
      exact: true,
    }),
  ).toBeVisible();
}

async function stored(page: Page): Promise<AppState> {
  return page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    storageKey,
  );
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

async function saveComparison(page: Page, title: string) {
  await page
    .getByRole("button", { name: "Conserver la comparaison", exact: true })
    .click();
  await page.getByLabel("Nom de la comparaison", { exact: true }).fill(title);
  await page
    .getByRole("button", { name: "Enregistrer la comparaison", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: `Charger : ${title}`, exact: true }),
  ).toBeVisible();
}

function compact(text: string) {
  return text.replace(/[\s\u202f]/g, "").replace(/−/g, "-");
}

async function expectMoney(page: Page, label: string, expected: string) {
  await expect
    .poll(async () =>
      compact(await page.getByLabel(label, { exact: true }).innerText()),
    )
    .toContain(expected);
}

test("un délai de paiement change le cash sans changer le résultat et les flux restent consultables", async ({
  page,
}) => {
  await openSimulation(page);
  await expectMoney(page, "Résultat cumulé de la référence", "13200");
  await expectMoney(page, "Résultat cumulé du scénario", "13200");
  await expectMoney(page, "Trésorerie finale de la référence", "13200");
  await expectMoney(page, "Trésorerie finale du scénario", "-10800");
  await page.getByRole("button", { name: /^Mois 2/ }).click();
  await expect(page.getByRole("button", { name: /^Mois 2/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page
    .getByLabel("Délai de paiement du scénario", { exact: true })
    .selectOption("0");
  await expectMoney(page, "Trésorerie finale du scénario", "25200");
  await expectMoney(page, "Résultat cumulé du scénario", "13200");
  await page.getByText("Tous les flux, mois par mois", { exact: true }).click();
  await expect(page.getByRole("table").first()).toBeVisible();
  await expect(page.getByRole("table").first().getByRole("row")).toHaveCount(7);
  await page.getByLabel("Variation du prix (%)", { exact: true }).fill("");
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Conserver la comparaison", exact: true }),
  ).toBeDisabled();
  await page.getByLabel("Variation du prix (%)", { exact: true }).fill("0");
  await expectMoney(page, "Trésorerie finale du scénario", "25200");
  expect((await stored(page)).attempts).toEqual([]);
  expect((await stored(page)).projects).toEqual([]);
  await noOverflow(page);
});

test("une comparaison conserve ses hypothèses au rechargement sans être réécrite par le brouillon", async ({
  page,
}) => {
  await openSimulation(page);
  const title = "Retarder les encaissements, garder les attentes";
  await saveComparison(page, title);
  const first = (await stored(page)).simulations![0]!;
  expect(first).toMatchObject({
    title,
    modelVersion: "1.0.0",
    createdAt: fixedNow,
    input: {
      baseline: {
        price: 100,
        unitCost: 40,
        units: 120,
        fixedCosts: 5000,
        openingCash: 12000,
        collectionDelayMonths: 1,
      },
      change: {
        priceChangePct: 0,
        volumeChangePct: 0,
        unitCostChangePct: 0,
        additionalFixedCosts: 0,
        collectionDelayMonths: 3,
      },
    },
  });
  await page
    .getByRole("button", { name: "Perte d’un client", exact: true })
    .click();
  await expect(
    page.getByLabel("Variation du volume (%)", { exact: true }),
  ).toHaveValue("-40");
  expect((await stored(page)).simulations).toEqual([first]);
  await page.reload();
  await page
    .getByRole("button", { name: `Charger : ${title}`, exact: true })
    .click();
  await expect(
    page.getByLabel("Variation du volume (%)", { exact: true }),
  ).toHaveValue("0");
  await expect(
    page.getByLabel("Délai de paiement du scénario", { exact: true }),
  ).toHaveValue("3");
  await expectMoney(page, "Trésorerie finale du scénario", "-10800");
  await page.getByLabel("Variation du prix (%)", { exact: true }).fill("15");
  expect((await stored(page)).simulations).toEqual([first]);
  await saveComparison(page, "Prix explicite, demande inchangée");
  const saved = (await stored(page)).simulations!;
  expect(saved).toHaveLength(2);
  expect(saved.find((item) => item.id === first.id)).toEqual(first);
  expect(
    saved.find((item) => item.id !== first.id)?.input.change.priceChangePct,
  ).toBe(15);
  await noOverflow(page);
});

test("exporter les hypothèses et réimporter une ancienne sauvegarde sans créer d’historique fictif", async ({
  page,
}) => {
  await openSimulation(page);
  const title = "Comparaison pédagogique de démonstration";
  await saveComparison(page, title);
  const markdownEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Exporter la comparaison", exact: true })
    .click();
  const markdownDownload = await markdownEvent;
  expect(markdownDownload.suggestedFilename()).toMatch(/\.md$/);
  const markdown = await readFile((await markdownDownload.path())!, "utf8");
  expect(markdown).toContain(title);
  expect(markdown).toContain("1.0.0");
  expect(compact(markdown)).toContain("13200");
  expect(compact(markdown)).toContain("-10800");
  expect(markdown).not.toMatch(/NaN|Infinity/);
  const original = await stored(page);
  await page.goto("/#settings");
  const jsonEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Exporter mes données", exact: true })
    .click();
  const jsonDownload = await jsonEvent;
  const exported: AppState = JSON.parse(
    await readFile((await jsonDownload.path())!, "utf8"),
  );
  expect(exported.simulations).toEqual(original.simulations);
  const invalid = structuredClone(exported);
  invalid.simulations![0]!.input.change.collectionDelayMonths = 1.5;
  await page.getByLabel("Importer une sauvegarde").setInputFiles({
    name: "comparaison-invalide.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(invalid)),
  });
  await expect(page.getByRole("status")).toContainText(
    /simulation|comparaison/i,
  );
  await expect(
    page.getByRole("button", {
      name: "Confirmer le remplacement",
      exact: true,
    }),
  ).toHaveCount(0);
  expect((await stored(page)).simulations).toEqual(original.simulations);
  await page.getByLabel("Importer une sauvegarde").setInputFiles({
    name: "ancienne-v1.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(oldState())),
  });
  await page
    .getByRole("button", { name: "Confirmer le remplacement", exact: true })
    .click();
  await page.goto("/#simulation");
  await expect(
    page.getByRole("button", { name: `Charger : ${title}`, exact: true }),
  ).toHaveCount(0);
  expect((await stored(page)).simulations ?? []).toEqual([]);
  await noOverflow(page);
});

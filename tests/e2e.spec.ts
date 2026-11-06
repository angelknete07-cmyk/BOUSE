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
  for (const answer of [
    "Programmer un virement vers l’épargne dès que le salaire arrive.",
    "l’écart de frais se cumule chaque année et pèse nettement sur le capital final ;",
  ])
    await page
      .getByRole("radio", { name: answer, exact: true })
      .locator("..")
      .click();
  await page.getByRole("button", { name: "Voir mon point de départ" }).click();
  await expect(
    page.getByText("5/5 bonnes réponses.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Entrer dans l’Académie" }).click();
  await expect(
    page.getByRole("heading", { name: /^(Bienvenue|Bon retour), Camille !$/ }),
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
  await navigate(page, "Académie");
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
  await page.getByRole("tab", { name: /Pratiquer/ }).click();
  await page
    .getByLabel("Votre raisonnement")
    .fill(
      "Je soustrais les coûts variables et les charges fixes au chiffre d’affaires.",
    );
  await page.getByRole("button", { name: "Un indice", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Un premier indice" }),
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
          JSON.parse(localStorage.getItem("bouse.academy.v1:guest")!).attempts
            .length,
      ),
    )
    .toBe(1);
  await page
    .getByRole("button", { name: "Appliquer à un projet", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Garder cette idée dans mes projets" })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "Idée enregistrée" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Garder cette idée dans mes projets" })
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("bouse.academy.v1:guest")!).projects
            .length,
      ),
    )
    .toBe(1);
  await page.getByRole("button", { name: "Ouvrir mes projets" }).click();
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
    page.locator("article").locator('[aria-current="step"]'),
  ).toHaveText("Recherche");
  await expect(page.locator("article")).toContainText("Étape 2 sur 9");
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

test("calcul financier, limites du modèle et recherche au clavier vers l’Atelier IA", async ({
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
  await palette.getByRole("textbox").fill("Atelier IA");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "De l’intention à l’instruction." }),
  ).toBeVisible();
  await expect(
    page.getByText("Aucun modèle IA connecté.", { exact: false }),
  ).toBeVisible();
  const writeView = page.getByRole("button", { name: "Écrire", exact: true });
  if (await writeView.isVisible()) await writeView.click();
  await page
    .getByLabel("Quel travail voulez-vous confier à l’IA ?")
    .fill(
      "Objectif : compare les offres. Contexte : entreprise de cinq salariés. Données : fichier ci-dessous. Contrainte : maximum 200 mots. Format : tableau. Critère de réussite : vérifie et signale chaque incertitude.",
    );
  await page.getByRole("button", { name: "Examiner la structure" }).click();
  await expect(
    page.getByRole("heading", { name: /^(\d+) \/ \1 critères$/ }),
  ).toBeVisible();
  await expect(
    page.getByText("Une indication, pas une note de qualité", { exact: true }),
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
  await page.getByRole("tab", { name: /Démontrer/ }).click();
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
    page.getByRole("button", { name: /Consolider 1 notion/i }),
  ).toBeVisible();
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

test("les préférences modifient tout le profil, sont conservées et ne touchent ni quiz ni projets", async ({
  page,
}) => {
  await onboard(page);
  await page.goto("/#settings");
  await expect(
    page.getByRole("heading", { name: "Vous gardez la main." }),
  ).toBeVisible();
  await page.getByLabel("Niveau").selectOption("Intermédiaire");
  await page
    .getByRole("combobox", { name: /^Objectif/ })
    .selectOption("Construire un projet avec l’IA");
  await page.getByRole("checkbox", { name: "Entrepreneuriat" }).check();
  await page.getByRole("checkbox", { name: "Finance", exact: true }).uncheck();
  await page
    .getByLabel("Façon d’apprendre")
    .selectOption("Appliquer à mon projet");
  await page.reload();
  const saved = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("bouse.academy.v1:guest")!) as {
        profile: Record<string, unknown>;
        attempts: unknown[];
        projects: unknown[];
      },
  );
  expect(saved.profile).toMatchObject({
    name: "Camille",
    level: "Intermédiaire",
    goal: "Construire un projet avec l’IA",
    preference: "Appliquer à mon projet",
  });
  expect(saved.profile.interests).toEqual(
    expect.arrayContaining(["Entrepreneuriat"]),
  );
  expect(saved.profile.interests).not.toContain("Finance");
  expect(saved.attempts).toEqual([]);
  expect(saved.projects).toEqual([]);
  await expect(page.getByLabel("Niveau")).toHaveValue("Intermédiaire");
  await noHorizontalOverflow(page);
});

test("sans configuration, la synchronisation l’annonce honnêtement et ne propose aucune connexion", async ({
  page,
}) => {
  await onboard(page);
  await page.goto("/#settings");
  const panel = page.getByRole("region", { name: "Compte et synchronisation" });
  await expect(panel).toContainText(/Non configurée|Non connecté/);
  await expect(panel).toContainText(
    "La synchronisation n’est pas configurée sur cette installation",
  );
  await expect(panel.getByLabel("Adresse e-mail")).toHaveCount(0);
  await expect(page.locator(".local-status")).toHaveText("Données locales");
});

test("une leçon quittée en cours reprend à la même séquence, et l’accueil découpe la suite", async ({
  page,
}) => {
  await onboard(page);
  await page.goto("/#lesson/fp-budget");
  const next = page.getByRole("button", { name: /Séquence suivante/ }).first();
  await next.click();
  await next.click();
  await expect(page.getByText(/SÉQUENCE 03/)).toBeVisible();
  await page.goto("/#home");
  await expect(
    page.getByText(/séquences 3 à|la fin de la leçon, séquences 3/),
  ).toBeVisible();
  await page.goto("/#lesson/fp-budget");
  await expect(page.getByText(/SÉQUENCE 03/)).toBeVisible();
  await expect(
    page.getByRole("status").filter({ hasText: "Reprise à la séquence 3" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Revenir au début" }).click();
  await expect(page.getByText(/SÉQUENCE 01/)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/SÉQUENCE 01/)).toBeVisible();
});

test("la recherche trouve un passage de leçon et le simulateur micro réagit", async ({
  page,
}) => {
  await onboard(page);
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", { name: "Recherche universelle" });
  await dialog.getByRole("textbox").fill("auto-entrepreneur");
  const result = dialog
    .getByRole("button")
    .filter({ hasText: "La micro-entreprise de A à Z" });
  await expect(result).toBeVisible();
  await dialog.getByRole("textbox").fill("versement libératoire");
  await expect(
    dialog
      .getByRole("button")
      .filter({ hasText: "La micro-entreprise de A à Z" })
      .locator(".palette-excerpt"),
  ).toContainText("versement libératoire");
  await page.keyboard.press("Escape");

  await page.goto("/#lesson/ent-micro-entreprise");
  const scene = page.getByRole("region", {
    name: "Simuler une année de micro-entreprise",
  });
  await expect(scene.locator(".scene-number")).toHaveText(/20\s640\s€/);
  await scene
    .getByRole("slider", { name: "Charges réelles annuelles en euros" })
    .fill("20000");
  await expect(scene).toContainText("dépassent l’abattement de 50");
  await scene.getByRole("button", { name: "Versement libératoire" }).click();
  await expect(scene).toContainText("impôt déjà payé");
});

// Engagement loop over consecutive lessons: a question to answer, what was
// gained, the next lesson in view, a calm way to stop, and the home that
// builds on the last success. No streak, no countdown.
test("deux leçons de suite : question de départ, acquis, suite et retour serein", async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (localStorage.getItem("bouse.academy.v1:guest")) return;
    localStorage.setItem(
      "bouse.academy.v1:guest",
      JSON.stringify({
        schemaVersion: 1,
        profile: {
          name: "Vous",
          level: "Fondations",
          goal: "Comprendre et piloter un business",
          interests: ["Finance"],
          minutes: 20,
          preference: "Concepts puis cas professionnel",
          diagnostic: {
            finance: 3,
            business: 3,
            ai: 3,
            personal: 3,
            investing: 3,
          },
        },
        attempts: [],
        notes: {},
        projects: [],
        lastLessonId: null,
      }),
    );
  });
  await page.goto("/#home");
  await expect(
    page.getByRole("heading", { name: "Bienvenue !", exact: true }),
  ).toBeVisible();
  const pass = async (id: string) => {
    const lesson = lessons.find((item) => item.id === id)!;
    await expect(
      page.getByRole("complementary", { name: "La question de départ" }),
    ).toContainText(lesson.quiz[0]!.question);
    await page.getByRole("tab", { name: /Démontrer/ }).click();
    await expect(page.getByText("Votre question de départ")).toBeVisible();
    for (const [index, question] of lesson.quiz.entries()) {
      await page
        .getByRole("radio", {
          name: question.options[question.answer],
          exact: true,
        })
        .locator("..")
        .click();
      const last = index === lesson.quiz.length - 1;
      await page
        .getByRole("button", {
          name: last ? "Vérifier mes réponses" : "Valider cette réponse",
        })
        .click();
      if (!last)
        await page.getByRole("button", { name: "Question suivante" }).click();
    }
    const gained = page.getByRole("list", {
      name: "Ce que vous maîtrisez maintenant",
    });
    for (const skill of lesson.skills)
      await expect(gained).toContainText(skill);
  };
  await page
    .getByRole("button", { name: /^(Commencer|Continuer) la leçon/ })
    .click();
  await expect(page).toHaveURL(/#lesson\/ca-marge-tresorerie$/);
  await pass("ca-marge-tresorerie");
  const next = page.getByRole("region", {
    name: "Trouver son seuil de rentabilité",
  });
  await expect(next).toContainText("prolonge cette leçon");
  await expect(page.getByText("sans rappel ni compte à rebours")).toBeVisible();
  await expect(page.getByText(/série|streak|ne perdez pas/i)).toHaveCount(0);
  await page
    .getByRole("button", { name: "Commencer la leçon suivante" })
    .click();
  await expect(page).toHaveURL(/#lesson\/seuil-rentabilite$/);
  await pass("seuil-rentabilite");
  await expect(
    page.getByText(/Finance\s:\s2 notions validées sur/),
  ).toBeVisible();
  await page.getByRole("button", { name: "Revenir à l’accueil" }).click();
  await expect(page.getByText(/Dernière notion validée/)).toContainText(
    "Trouver son seuil de rentabilité",
  );
  await noHorizontalOverflow(page);
});

test("les simulateurs de leçon calculent et s’expliquent : impôt, statut, louer ou acheter", async ({
  page,
}) => {
  await onboard(page);
  await page.goto("/#lesson/fp-impot-revenu");
  const tax = page.getByRole("region", {
    name: "Calculer un impôt avec le barème progressif",
  });
  await tax
    .getByRole("slider", { name: "Revenu net imposable en euros" })
    .fill("30000");
  // (29 579 − 11 600) × 11 % + (30 000 − 29 579) × 30 %, rounded.
  await expect(tax.locator(".scene-number")).toHaveText(/2\s104\s€/);
  await expect(tax).toContainText("Taux marginal : 30");
  await expect(tax).toContainText("gardés");
  await tax.getByRole("button", { name: "2 parts" }).click();
  // 15 000 € per share: (15 000 − 11 600) × 11 % × 2 shares.
  await expect(tax.locator(".scene-number")).toHaveText(/748\s€/);

  await page.goto("/#lesson/ent-statut-juridique");
  const status = page.getByRole("region", {
    name: "Voir quels critères orientent le choix d’un statut",
  });
  await expect(status).toContainText("régime micro");
  await status.getByRole("button", { name: /Je m’associe/ }).click();
  await expect(status.locator(".scene-status-result")).toHaveText("SAS");

  await page.goto("/#lesson/fp-logement");
  const housing = page.getByRole("region", {
    name: "Comparer location et achat dans le temps",
  });
  await housing.getByRole("slider", { name: /Durée d’occupation/ }).fill("2");
  await expect(housing).toContainText("d’avantage à la location sur 2 ans");
  await housing.getByRole("slider", { name: /Durée d’occupation/ }).fill("25");
  await expect(housing).toContainText("d’avantage à l’achat sur 25 ans");
  await noHorizontalOverflow(page);
});

test("bilan à l’équilibre, tri des arnaques et lexique repliable", async ({
  page,
}, testInfo) => {
  await onboard(page);
  await page.goto("/#lesson/fin-etats-financiers");
  const sheet = page.getByRole("region", {
    name: "Construire un bilan opération par opération",
  });
  for (const label of [
    "Apport de 10 000 €",
    "Emprunt de 20 000 €",
    "Achat d’une machine 15 000 €",
  ])
    await sheet.getByRole("button", { name: label }).click();
  const totals = sheet.locator(".scene-sheet-total strong");
  await expect(totals.first()).toHaveText(/30\s000\s€/);
  await expect(totals.last()).toHaveText(/30\s000\s€/);
  await expect(sheet).toContainText("l’actif change de forme");

  await page.goto("/#lesson/inv-arnaques-placement");
  const scams = page.getByRole("region", {
    name: "Repérer les signaux d’une arnaque au placement",
  });
  await scams
    .getByRole("group", { name: /Rendement garanti/ })
    .getByRole("button", { name: "Pas un signal" })
    .click();
  await expect(scams).toContainText("Pas tout à fait.");
  await expect(scams).toContainText("0 / 6");

  await page.goto("/#lexique");
  const toggle = page
    .getByRole("button", { name: "Lire la définition" })
    .first();
  if (testInfo.project.name.includes("mobile")) {
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(
      page.getByRole("button", { name: "Replier" }).first(),
    ).toBeVisible();
  } else {
    // Wide screens always show definitions in full.
    await expect(toggle).toBeHidden();
  }
  await noHorizontalOverflow(page);
});

test("chaque leçon a sa scène : prix TTC, fiscalité des placements, assurances", async ({
  page,
}) => {
  await onboard(page);
  await page.goto("/#lesson/ent-fixer-prix");
  const pricing = page.getByRole("region", {
    name: "Construire un prix du coût de revient au prix TTC",
  });
  // 60 € of cost with 40 % margin on the price: 100 € HT, 120 € TTC.
  await expect(pricing.locator(".scene-number")).toHaveText(/120,00\s€/);
  await pricing.getByRole("button", { name: "Franchise en base" }).click();
  await expect(pricing.locator(".scene-number")).toHaveText(/100,00\s€/);
  await expect(pricing).toContainText("293 B du CGI");

  await page.goto("/#lesson/inv-fiscalite-placements");
  const tax = page.getByRole("region", {
    name: "Comparer un gain après impôt selon l’enveloppe",
  });
  await expect(tax.locator(".scene-number")).toHaveText(/1\s280\s€/);

  await page.goto("/#lesson/fp-assurances");
  const insurance = page.getByRole("region", {
    name: "Distinguer les assurances obligatoires des facultatives",
  });
  await insurance
    .getByRole("group", { name: /locataire/ })
    .getByRole("button", { name: "Obligatoire" })
    .click();
  await expect(insurance).toContainText("Bien vu.");
  await noHorizontalOverflow(page);
});

test("suivre un parcours, s’entraîner sans toucher aux quiz, télécharger une fiche", async ({
  page,
}) => {
  await onboard(page);
  await page.goto("/#academy");
  await page
    .getByRole("region", { name: "Parcours par objectif" })
    .getByRole("button", { name: "Suivre ce parcours" })
    .first()
    .click();
  await expect(page.getByText("Parcours suivi · arrêter")).toBeVisible();
  await page.goto("/#home");
  await expect(page.locator(".learning-hero-reason").first()).toContainText(
    "de votre parcours « Créer mon entreprise »",
  );

  await page.goto("/#lesson/ent-creer-etapes");
  await expect(page.locator(".lesson-verified")).toContainText(
    "Règles vérifiées en",
  );
  await page.getByRole("tab", { name: /Pratiquer/ }).click();
  const drill = page.getByRole("region", { name: "Quel terme correspond ?" });
  await drill.getByRole("group").first().getByRole("button").first().click();
  await expect(drill.getByRole("status").first()).toBeVisible();
  const attempts = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("bouse.academy.v1:guest")!).attempts
        .length,
  );
  expect(attempts).toBe(0);

  await page.getByRole("tab", { name: /Appliquer/ }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: /Télécharger/ }).click();
  expect((await download).suggestedFilename()).toBe(
    "bouse-creation-entreprise.md",
  );
  await noHorizontalOverflow(page);
});

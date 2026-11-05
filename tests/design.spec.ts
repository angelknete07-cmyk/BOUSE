import {
  test,
  expect,
  type Locator,
  type Page,
  type TestInfo,
} from "@playwright/test";
import { lessons } from "../src/data/lessons";
import type { AppState } from "../src/lib/types";

const lesson = lessons.find((item) => item.id === "ca-marge-tresorerie")!;
const fixture: AppState = {
  schemaVersion: 1,
  profile: {
    name: "Profil démo",
    level: "Débutant++",
    goal: "Comprendre et piloter un business",
    interests: ["Finance", "Intelligence artificielle"],
    minutes: 20,
    preference: "Exemples puis pratique",
    diagnostic: { finance: 1, business: 2, ai: 0 },
  },
  attempts: [],
  projects: [
    {
      id: "design-project",
      title: "Prévoir le cash d’un atelier",
      problem:
        "Les retards de règlement empêchent d’anticiper les achats de matières premières.",
      customer: "Artisans indépendants qui facturent des entreprises",
      hypothesis:
        "Un suivi hebdomadaire simple aide à repérer les tensions avant une commande.",
      nextAction:
        "Interroger cinq artisans sur leur dernière difficulté de trésorerie.",
      stage: "Validation",
      lessonIds: [lesson.id],
      createdAt: "2026-11-02T12:00:00.000Z",
    },
  ],
  notes: {
    [lesson.id]: "Distinguer résultat et encaissement avant chaque décision.",
  },
  lastLessonId: lesson.id,
};

async function seed(page: Page) {
  await page.addInitScript((state) => {
    localStorage.setItem("bouse.academy.v1", JSON.stringify(state));
  }, fixture);
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

async function neutral(
  locator: Locator,
  property: string,
  description: string,
) {
  await expect(locator).toBeVisible();
  const color = await locator.evaluate((element, cssProperty) => {
    const value = getComputedStyle(element).getPropertyValue(cssProperty);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d")!;
    context.fillStyle = value;
    context.fillRect(0, 0, 1, 1);
    return {
      value,
      channels: Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3),
    };
  }, property);
  expect(
    Math.max(...color.channels) - Math.min(...color.channels),
    `${description}: ${property} = ${color.value}`,
    // Off-white (#F3F2EE) and cool silver retain up to six channel levels.
  ).toBeLessThanOrEqual(6);
}

async function capture(page: Page, testInfo: TestInfo, name: string) {
  await noOverflow(page);
  // A pointer left over from the previous screen can create an unrelated hover
  // beside the selected item. Capture the neutral state consistently.
  await page.mouse.move(0, 0);
  await page.evaluate(async () => {
    window.scrollTo(0, 0);
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => resolve()),
    );
  });
  await page.screenshot({
    path: testInfo.outputPath(`${name}.png`),
    fullPage: true,
  });
  if (
    [
      "02-academy",
      "06-ai-empty",
      "06-ai-structure",
      "05-lab-financier",
      "03-lecon-learn",
      "16-search-keyboard",
    ].includes(name)
  )
    await page.screenshot({
      path: testInfo.outputPath(`${name}-viewport.png`),
      fullPage: false,
    });
  if (name === "01-home")
    await page.screenshot({
      path: testInfo.outputPath("00-home-viewport.png"),
      fullPage: false,
    });
  if (name === "11-revisions-due")
    await page.screenshot({
      path: testInfo.outputPath("11-revisions-viewport.png"),
      fullPage: false,
    });
  if (name === "12-project-outcome")
    await page.screenshot({
      path: testInfo.outputPath("12-project-viewport.png"),
      fullPage: false,
    });
  if (name === "13-simulation-default")
    await page.screenshot({
      path: testInfo.outputPath("13-simulation-viewport.png"),
      fullPage: false,
    });
  if (name === "14-portfolio-overview")
    await page.screenshot({
      path: testInfo.outputPath("14-portfolio-viewport.png"),
      fullPage: false,
    });
  if (name === "15-project-learning-plan")
    await page.screenshot({
      path: testInfo.outputPath("15-project-learning-viewport.png"),
      fullPage: false,
    });
}

async function importReviewDemo(page: Page, state: AppState) {
  await page.goto("/#settings");
  await page.getByLabel("Importer une sauvegarde").setInputFiles({
    name: "profil-demo-revisions.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(state)),
  });
  await page
    .getByRole("button", { name: "Confirmer le remplacement", exact: true })
    .click();
  await page.goto("/#reviews");
  await expect(
    page.getByRole("heading", {
      name: "Faire revenir les idées.",
      exact: true,
    }),
  ).toBeVisible();
}

test("surfaces neutres et états de navigation sur un véritable rendu", async ({
  page,
}, testInfo) => {
  await seed(page);
  await page.goto("/#home");
  await expect(
    page.getByRole("heading", { name: "À vous de jouer, Profil démo." }),
  ).toBeVisible();
  const colors: [string, string, string][] = [
    ["html", "background-color", "Fond de page"],
    ["body", "background-color", "Corps de page"],
    [".hero-card", "background-color", "Leçon à reprendre"],
    [".button.primary", "background-color", "Action principale"],
    [".path-card", "background-color", "Parcours"],
    [".hero-main .tag", "background-color", "Étiquette de domaine"],
    [".hero-main .tag", "border-top-color", "Bordure de l’étiquette"],
    [".hero-visual", "color", "Décoration topographique"],
    [".hero-visual path", "stroke", "Tracé topographique"],
    [".eyebrow", "color", "Texte secondaire"],
  ];
  for (const [selector, property, description] of colors) {
    await neutral(page.locator(selector).first(), property, description);
  }
  await page.getByRole("button", { name: /^L’équilibre/ }).click();
  await expect(page.locator(".trajectory-detail h3")).toHaveText(
    "Trouver son seuil de rentabilité",
  );
  await page.getByRole("button", { name: /^Les chiffres/ }).click();
  const menu = page.getByRole("button", {
    name: "Ouvrir la navigation",
    exact: true,
  });
  const mobile = await menu.isVisible();
  if (mobile) await menu.click();
  await neutral(
    page.locator(".sidebar"),
    "background-color",
    "Navigation latérale",
  );
  await neutral(
    page.locator(".nav-link.active"),
    "background-color",
    "Navigation active",
  );
  await neutral(
    page.locator(".nav-link.active"),
    "border-top-color",
    "Bordure de navigation active",
  );
  if (mobile) {
    await capture(page, testInfo, "02-navigation-mobile");
    await page.keyboard.press("Escape");
  }
  await capture(page, testInfo, "01-home");
  await page
    .getByRole("button", { name: "Ouvrir la recherche", exact: true })
    .click();
  const search = page.getByRole("dialog", { name: "Recherche universelle" });
  await expect(search).toBeVisible();
  await search.getByRole("textbox").fill("trésorerie");
  await neutral(search, "background-color", "Palette de recherche");
  await neutral(search, "border-top-color", "Bordure de la palette");
  await capture(page, testInfo, "03-recherche");
  await search.getByRole("textbox").press("ArrowDown");
  await expect(
    search.locator(".palette-results > button").first(),
  ).toBeFocused();
  await capture(page, testInfo, "16-search-keyboard");
  await search.getByRole("textbox").fill("zzzz-aucun-resultat");
  await expect(search.getByRole("status")).toHaveText("0 résultat");
  await capture(page, testInfo, "16-search-empty");
  await page.keyboard.press("Escape");
  await expect(search).not.toBeVisible();
});

test("galerie des écrans et du quiz validé sans débordement", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Faisons connaissance." }),
  ).toBeVisible();
  await neutral(
    page.locator(".onboarding-form"),
    "background-color",
    "Formulaire d’accueil",
  );
  await neutral(
    page.locator(".button.primary"),
    "background-color",
    "Bouton d’accueil",
  );
  await capture(page, testInfo, "01-onboarding");
  await seed(page);
  // Change the document URL so the init script runs after the empty onboarding.
  await page.goto("/?gallery=1#academy");
  await expect(
    page.getByRole("heading", { name: "Six notions, trois domaines." }),
  ).toBeVisible();
  await neutral(
    page.locator(".catalog-card").first(),
    "background-color",
    "Catalogue",
  );
  await capture(page, testInfo, "02-academy");
  await page.goto(`/#lesson/${lesson.id}`);
  await expect(
    page.getByRole("heading", { name: lesson.title, exact: true }),
  ).toBeVisible();
  await neutral(
    page.getByRole("tab", { name: /Comprendre/ }),
    "background-color",
    "Étape de leçon active",
  );
  await capture(page, testInfo, "03-lecon-learn");
  const sequenceSelect = page.getByLabel("Choisir une séquence");
  if (await sequenceSelect.isVisible())
    await sequenceSelect.selectOption(String(lesson.sections.length + 1));
  else
    await page
      .getByRole("navigation", { name: "Séquences de la leçon" })
      .getByRole("button", { name: /À vous d’expliquer/ })
      .click();
  await page
    .getByLabel("Mon explication", { exact: true })
    .fill(
      "Le résultat mesure l’activité, la trésorerie les encaissements : une vente rentable à crédit peut manquer de cash.",
    );
  await page
    .getByRole("button", { name: "Comparer avec les repères", exact: true })
    .click();
  await expect(page.locator(".learning-self-review")).toBeVisible();
  await capture(page, testInfo, "03-teach-back");
  await page.getByRole("tab", { name: /Démontrer/ }).click();
  for (const [index, question] of lesson.quiz.entries()) {
    await page
      .getByRole("radio", {
        name: question.options[question.answer],
        exact: true,
      })
      .locator("..")
      .click();
    if (index < lesson.quiz.length - 1) {
      await page
        .getByRole("button", { name: "Valider cette réponse", exact: true })
        .press("Enter");
      await expect(
        page.getByText(question.explanation, { exact: false }),
      ).toBeVisible();
      const feedback = page.locator(".learning-quiz-feedback");
      await expect(feedback).toBeFocused();
      const dock = page.locator(".mobile-dock");
      if (await dock.isVisible()) {
        const feedbackBox = (await feedback.boundingBox())!;
        const dockBox = (await dock.boundingBox())!;
        expect(feedbackBox.y).toBeGreaterThanOrEqual(0);
        expect(feedbackBox.y + feedbackBox.height).toBeLessThanOrEqual(
          dockBox.y,
        );
      }
      await page.screenshot({
        path: testInfo.outputPath("04-quiz-feedback-focus-viewport.png"),
        fullPage: false,
      });
      await capture(page, testInfo, "04-quiz-feedback");
      await page
        .getByRole("button", { name: "Question suivante", exact: true })
        .click();
    }
  }
  await page.getByRole("button", { name: "Vérifier mes réponses" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "2/2 · 100 %" }),
  ).toBeVisible();
  // Feedback may use restrained semantic colors; decorative surfaces remain neutral.
  await capture(page, testInfo, "04-quiz-valide");
  await page.goto("/#lab");
  await expect(
    page.getByRole("heading", { name: "L’économie d’une vente." }),
  ).toBeVisible();
  await neutral(
    page.locator(".financial-chart"),
    "background-color",
    "Données financières",
  );
  await capture(page, testInfo, "05-lab-financier");
  await page.goto("/#ai");
  await expect(
    page.getByRole("heading", { name: "De l’intention à l’instruction." }),
  ).toBeVisible();
  const writeView = page.getByRole("button", { name: "Écrire", exact: true });
  if (await writeView.isVisible()) await writeView.click();
  await page
    .getByLabel("Quel travail voulez-vous confier à l’IA ?")
    .fill(
      "Objectif : comparer trois outils pour mon atelier. Contexte : petite entreprise. Données : tableau ci-dessous. Contrainte : maximum 200 mots. Format : liste. Critère : signale les incertitudes.",
    );
  await page.getByRole("button", { name: "Examiner la structure" }).click();
  await expect(page.getByRole("heading", { name: "100 / 100" })).toBeVisible();
  await capture(page, testInfo, "06-ai-lab");
  await page.goto("/#incubator");
  await expect(
    page.getByRole("heading", {
      name: "Prévoir le cash d’un atelier",
      exact: true,
    }),
  ).toBeVisible();
  await neutral(
    page.locator(".project-card"),
    "background-color",
    "Projet de l’incubateur",
  );
  await capture(page, testInfo, "07-incubator");
  await page
    .getByRole("button", { name: "Créer un projet", exact: true })
    .click();
  for (const label of [
    "Nom du projet",
    "Quel problème concret résoudre ?",
    "Pour quel client ou utilisateur ?",
    "L’hypothèse la plus risquée à tester",
    "La prochaine action observable",
  ])
    await page.getByLabel(label, { exact: true }).fill("   ");
  await page
    .getByRole("button", { name: "Enregistrer le projet", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("Complétez chaque champ");
  await expect(
    page.getByRole("status").filter({ hasText: "Complétez chaque champ" }),
  ).toHaveCount(0);
  await capture(page, testInfo, "08-project-error");
  for (const [route, heading, name] of [
    ["radar", "Garder un regard ouvert.", "08-radar"],
    ["skills", "Relier les idées. Trouver la suite.", "09-competences"],
    ["settings", "Vous gardez la main.", "10-parametres"],
  ]) {
    await page.goto(`/#${route}`);
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
    await capture(page, testInfo, name);
    if (route === "skills") {
      const promptLesson = lessons.find(
        (item) => item.id === "prompt-structure",
      )!;
      await page.getByRole("button", { name: /^Structurer un prompt/ }).click();
      await expect(
        page
          .locator(".knowledge-details")
          .getByRole("heading", { name: promptLesson.title, exact: true }),
      ).toBeVisible();
      await capture(page, testInfo, "09-competences-selection");
    }
  }

  // Use the application's validated import flow. The gallery init script would
  // replace direct localStorage mutations after a document reload.
  const currentState: AppState = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("bouse.academy.v1")!),
  );
  await importReviewDemo(page, {
    ...currentState,
    attempts: [],
    reviewEvents: [],
  });
  await expect(
    page.getByRole("heading", {
      name: "Le premier rappel commence par une leçon.",
      exact: true,
    }),
  ).toBeVisible();
  await capture(page, testInfo, "11-revisions-empty");

  const reviewLesson = lessons.find((item) => item.id === "seuil-rentabilite")!;
  await importReviewDemo(page, {
    ...currentState,
    attempts: [
      ...currentState.attempts,
      {
        lessonId: reviewLesson.id,
        answers: Object.fromEntries(
          reviewLesson.quiz.map((question) => [
            question.id,
            (question.answer + 1) % question.options.length,
          ]),
        ),
        correct: 0,
        total: reviewLesson.quiz.length,
        percent: 0,
        passed: false,
        at: new Date(Date.now() - 2 * 86_400_000).toISOString(),
      },
    ],
    reviewEvents: [],
  });
  await expect(
    page.getByRole("button", { name: "Commencer la révision", exact: true }),
  ).toBeVisible();
  await capture(page, testInfo, "11-revisions-due");
  await page
    .getByRole("button", { name: "Commencer la révision", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: reviewLesson.flashcards[0]!.front,
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Retrouvé sans aide", exact: true }),
  ).toHaveCount(0);
  await capture(page, testInfo, "11-revisions-recall");
  await page
    .getByLabel("Votre rappel", { exact: true })
    .fill(
      "Je divise les charges fixes par la contribution de chaque vente, en gardant les hypothèses constantes.",
    );
  await page
    .getByRole("button", { name: "Voir les repères", exact: true })
    .click();
  await expect(page.locator(".review-answer")).toContainText(
    reviewLesson.flashcards[0]!.back,
  );
  await capture(page, testInfo, "11-revisions-revealed");
  await page
    .getByRole("button", { name: "Retrouvé sans aide", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Voir les repères", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Encore fragile", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Une pause qui compte.", exact: true }),
  ).toBeVisible();
  await capture(page, testInfo, "11-revisions-complete");
  await page.goto("/#academy");
  await page.goto("/#reviews");
  await expect(
    page.getByRole("heading", { name: "À jour pour le moment.", exact: true }),
  ).toBeVisible();
  await capture(page, testInfo, "11-revisions-planned");

  // Build the project's evidence and decision history through the actual UI.
  await page.goto("/#project/design-project");
  await expect(
    page.getByRole("heading", {
      name: "Prévoir le cash d’un atelier",
      exact: true,
    }),
  ).toBeVisible();
  await capture(page, testInfo, "12-project-empty");
  await page
    .getByRole("button", { name: "Préparer un test", exact: true })
    .click();
  for (const [label, value] of [
    ["Nom du test", "Tester un suivi de trésorerie hebdomadaire"],
    [
      "Hypothèse à vérifier",
      "Trois artisans sur cinq acceptent un essai de suivi pendant deux semaines.",
    ],
    [
      "Protocole de test",
      "Présenter un exemple à cinq artisans, noter leur pratique actuelle et demander un engagement concret.",
    ],
    [
      "Critère de réussite",
      "Trois engagements écrits pour un essai limité à deux semaines.",
    ],
    ["Date de revue du test", "2026-11-10"],
  ])
    await page.getByLabel(label!, { exact: true }).fill(value!);
  await page
    .getByRole("button", { name: "Enregistrer le test", exact: true })
    .click();
  await capture(page, testInfo, "12-project-test-plan");
  await page
    .getByRole("button", { name: "Consigner le résultat", exact: true })
    .click();
  await page
    .getByLabel("Observation", { exact: true })
    .fill(
      "Deux artisans demandent un essai et trois ne souhaitent pas poursuivre.",
    );
  await page
    .getByLabel("Éléments de preuve", { exact: true })
    .fill(
      "Compte rendu fictif des cinq entretiens : deux engagements écrits, trois refus documentés.",
    );
  await page
    .getByLabel("Conclusion", { exact: true })
    .selectOption("inconclusive");
  await page
    .getByRole("button", { name: "Enregistrer le résultat", exact: true })
    .click();
  await capture(page, testInfo, "12-project-result");
  const projectState: AppState = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("bouse.academy.v1")!),
  );
  const experiment = projectState.experiments!.find(
    (item) => item.projectId === "design-project",
  )!;
  expect(experiment.result?.conclusion).toBe("inconclusive");
  await page.getByRole("tab", { name: /^Décisions/ }).click();
  await page
    .getByRole("button", { name: "Noter une décision", exact: true })
    .click();
  for (const [label, value] of [
    ["Titre de la décision", "Limiter le premier pilote à deux ateliers"],
    [
      "Contexte disponible",
      "Deux ateliers demandent un essai ; le temps de suivi reste inconnu.",
    ],
    [
      "Options envisagées",
      "Lancer un pilote limité, chercher davantage de clients ou différer la construction.",
    ],
    [
      "Choix retenu",
      "Tester une méthode manuelle pendant deux semaines avec les deux ateliers volontaires.",
    ],
    [
      "Résultat attendu",
      "Les deux ateliers utilisent le suivi chaque semaine avec moins de trente minutes de travail par atelier.",
    ],
    ["Confiance initiale (%)", "70"],
    [
      "Risque principal",
      "Le suivi manuel pourrait prendre trop de temps pour être rentable.",
    ],
    ["Date de revue de la décision", "2026-11-17"],
  ])
    await page.getByLabel(label!, { exact: true }).fill(value!);
  await page
    .getByLabel("Test terrain associé (facultatif)", { exact: true })
    .selectOption(experiment.id);
  await page
    .getByRole("button", { name: "Enregistrer la décision", exact: true })
    .click();
  await capture(page, testInfo, "12-project-decision");
  await page
    .getByRole("button", { name: "Comparer au réel", exact: true })
    .click();
  await page
    .getByLabel("Ce qui s’est passé", { exact: true })
    .fill(
      "Un atelier a utilisé le suivi deux fois ; l’autre n’a pas renouvelé son engagement.",
    );
  await page.getByLabel("Comparaison", { exact: true }).selectOption("mixed");
  await page
    .getByLabel("Ce que j’en retiens", { exact: true })
    .fill(
      "Mesurer l’usage réel et le temps de préparation avant d’automatiser.",
    );
  await page
    .getByRole("button", { name: "Enregistrer le bilan", exact: true })
    .click();
  await capture(page, testInfo, "12-project-outcome");

  // Compare and preserve explicit hypotheses; no simulated result is recorded
  // as a quiz, a real observation, or a project validation.
  await page.goto("/#simulation");
  await expect(
    page.getByRole("heading", {
      name: "Rentable. Mais à court de cash ?",
      exact: true,
    }),
  ).toBeVisible();
  await capture(page, testInfo, "13-simulation-default");
  await page
    .getByRole("button", { name: "Coûts fournisseurs", exact: true })
    .click();
  await page.getByRole("button", { name: /^Mois 3/ }).click();
  await expect(page.getByRole("button", { name: /^Mois 3/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await capture(page, testInfo, "13-simulation-scenario");
  await page
    .getByRole("button", { name: "Conserver la comparaison", exact: true })
    .click();
  await page
    .getByLabel("Nom de la comparaison", { exact: true })
    .fill("Coûts fournisseurs : +25 %, volume inchangé");
  await page
    .getByRole("button", { name: "Enregistrer la comparaison", exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Charger : Coûts fournisseurs : +25 %, volume inchangé",
      exact: true,
    }),
  ).toBeVisible();
  await capture(page, testInfo, "13-simulation-saved");

  // The portfolio reads existing records, never manufactures achievements.
  // Its demonstration dossier reuses the lesson, field observations, decision
  // comparison and simulation that the browser actually exercised above.
  await page.goto("/#portfolio");
  await expect(
    page.getByRole("heading", {
      name: "Ce que vous pouvez montrer.",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: new RegExp(lesson.title),
    })
    .click();
  await capture(page, testInfo, "14-portfolio-overview");
  await page
    .getByRole("tab", { name: "Projets & explorations", exact: true })
    .click();
  await capture(page, testInfo, "14-portfolio-projects");
  await page.getByRole("tab", { name: "Notes", exact: true }).click();
  await capture(page, testInfo, "14-portfolio-notes");

  // Goals are chosen explicitly. Existing application links are left intact,
  // and prerequisite progress comes only from the current-version quizzes.
  const learningGoal = lessons.find(
    (entry) => entry.id === "seuil-rentabilite",
  )!;
  const automationGoal = lessons.find(
    (entry) => entry.id === "automatisation-agent",
  )!;
  await page.goto("/#project/design-project");
  await page.getByRole("tab", { name: "Repères", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "Donnez un cap à votre apprentissage.",
      exact: true,
    }),
  ).toBeVisible();
  await capture(page, testInfo, "15-project-learning-empty");
  await page
    .getByRole("button", { name: "Choisir mes objectifs", exact: true })
    .click();
  await page
    .getByRole("checkbox", {
      name: `Objectif : ${learningGoal.title}`,
      exact: true,
    })
    .check();
  await page
    .getByRole("checkbox", {
      name: `Objectif : ${automationGoal.title}`,
      exact: true,
    })
    .check();
  await capture(page, testInfo, "15-project-learning-editor");
  await page
    .getByRole("button", { name: "Enregistrer les objectifs", exact: true })
    .click();
  await expect(
    page
      .getByRole("list", { name: "Étapes du parcours", exact: true })
      .getByRole("listitem"),
  ).toHaveCount(5);
  await capture(page, testInfo, "15-project-learning-plan");
  await page
    .getByRole("button", {
      name: `Étudier : ${learningGoal.title}`,
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Reprendre le plan : Prévoir le cash d’un atelier",
      exact: true,
    }),
  ).toBeVisible();
  await capture(page, testInfo, "15-project-learning-lesson");
  await page.getByRole("tab", { name: /Démontrer/ }).click();
  for (const [index, question] of learningGoal.quiz.entries()) {
    await page
      .getByRole("radio", {
        name: question.options[question.answer],
        exact: true,
      })
      .locator("..")
      .click();
    if (index < learningGoal.quiz.length - 1) {
      await page
        .getByRole("button", { name: "Valider cette réponse", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Question suivante", exact: true })
        .click();
    }
  }
  await page
    .getByRole("button", { name: "Vérifier mes réponses", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({
      hasText: `${learningGoal.quiz.length}/${learningGoal.quiz.length} · 100 %`,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Reprendre le plan : Prévoir le cash d’un atelier",
      exact: true,
    })
    .click();
  await page.getByRole("tab", { name: "Repères", exact: true }).click();
  await expect(
    page
      .getByRole("list", { name: "Étapes du parcours", exact: true })
      .getByRole("listitem")
      .filter({
        has: page.getByRole("heading", {
          name: learningGoal.title,
          exact: true,
        }),
      }),
  ).toContainText("Quiz validé");
  await capture(page, testInfo, "15-project-learning-updated");
  await page.goto("/#skills");
  await page
    .getByRole("button", {
      name: /^Seuil de rentabilité.*Quiz validé/,
    })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Objectif dans vos projets",
      exact: true,
    }),
  ).toBeVisible();
  await capture(page, testInfo, "15-project-learning-map");

  const emptyPortfolio: AppState = {
    schemaVersion: 1,
    profile: fixture.profile,
    attempts: [],
    projects: [],
    notes: {},
    lastLessonId: null,
  };
  await page.goto("/#settings");
  await page.getByLabel("Importer une sauvegarde").setInputFiles({
    name: "profil-demo-portfolio-vide.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(emptyPortfolio)),
  });
  await page
    .getByRole("button", { name: "Confirmer le remplacement", exact: true })
    .click();
  await page.goto("/#portfolio");
  await expect(
    page.getByRole("heading", {
      name: "Votre dossier commence ici.",
      exact: true,
    }),
  ).toBeVisible();
  await capture(page, testInfo, "14-portfolio-empty");
  expect(errors).toEqual([]);
});

test("compositions des instruments, atlas et leçon complète", async ({
  page,
}, testInfo) => {
  await seed(page);
  await page.goto("/#academy");
  const nodes = page.locator(".atlas-node");
  await nodes.last().click();
  await expect(page.locator(".atlas-focus h2")).toHaveText(
    lessons.at(-1)!.title,
  );
  await capture(page, testInfo, "02-academy-selection");
  await page.getByRole("button", { name: "Catalogue", exact: true }).click();
  await expect(page.locator(".atlas-catalog article")).toHaveCount(
    lessons.length,
  );
  await capture(page, testInfo, "02-academy-catalogue");
  await page.getByLabel("Rechercher une leçon").fill("zzzz");
  await expect(
    page.getByRole("heading", { name: "Aucune leçon pour cette recherche." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Voir toutes les leçons" }).click();
  await page.getByRole("button", { name: "Atlas", exact: true }).click();
  await page.getByRole("button", { name: "Finance", exact: true }).click();
  await expect(page.locator(".atlas-node:visible")).toHaveCount(2);
  await expect(page.locator(".atlas-link")).toHaveCount(1);

  await page.goto("/#ai");
  await capture(page, testInfo, "06-ai-empty");
  const writeView = page.getByRole("button", { name: "Écrire", exact: true });
  if (await writeView.isVisible()) await writeView.click();
  const draft =
    "Objectif : comparer trois offres. Contexte : entreprise artisanale. Données : devis fournis. Contrainte : maximum 200 mots. Format : tableau. Critères de réussite : prix et délai. Vérifie les sources et signale les incertitudes.";
  await page
    .getByLabel("Quel travail voulez-vous confier à l’IA ?")
    .fill(draft);
  await expect(
    page.getByRole("region", { name: "Analyse de la structure" }),
  ).toHaveCount(0);
  await capture(page, testInfo, "06-ai-writing");
  const structureView = page.getByRole("button", { name: /^Structure/ });
  if (await structureView.isVisible()) await structureView.click();
  await expect(page.locator(".prompt-part.is-found")).toHaveCount(7);
  await page.getByRole("button", { name: /Vérification/ }).click();
  await expect(page.locator(".prompt-lens mark")).toHaveText(
    "Vérifie les sources et signale les incertitudes.",
  );
  await capture(page, testInfo, "06-ai-structure");
  if (await writeView.isVisible()) await writeView.click();
  await expect(
    page.getByLabel("Quel travail voulez-vous confier à l’IA ?"),
  ).toHaveValue(draft);
  await page
    .getByRole("button", { name: "Examiner la structure", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "100 / 100", exact: true }),
  ).toBeVisible();
  await capture(page, testInfo, "06-ai-comparison");
  if (await writeView.isVisible()) await writeView.click();
  await page
    .getByLabel("Quel travail voulez-vous confier à l’IA ?")
    .fill("Objectif : comparer.");
  await expect(
    page.getByRole("region", { name: "Analyse de la structure" }),
  ).toHaveCount(0);
  if (await structureView.isVisible()) await structureView.click();
  await expect(page.locator(".prompt-part.is-found")).toHaveCount(1);

  await page.goto("/#lab");
  const plot = page.locator(".equilibrium-plot");
  await expect(plot).toHaveAttribute("aria-label", /Volume actuel : 120/);
  await page.locator("#economics-units").fill("40");
  await expect(plot).toHaveAttribute("aria-label", /Volume actuel : 40/);
  await expect(page.locator(".financial-profit strong")).toContainText(
    /-1\s?320/,
  );
  await capture(page, testInfo, "05-lab-below-threshold");
  await page.locator("#economics-price").fill("45.5");
  await page.locator("#economics-unitCost").fill("18.25");
  await expect(page.locator(".unit-contribution strong")).toHaveText(
    /27,25\s?€/,
  );
  await page.locator("#economics-price").fill("0");
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(plot).toHaveCount(0);
  await capture(page, testInfo, "05-lab-invalid");

  await page.goto(`/#lesson/${lesson.id}`);
  const sequenceSelect = page.getByLabel("Choisir une séquence");
  async function sequence(index: number) {
    if (await sequenceSelect.isVisible())
      await sequenceSelect.selectOption(String(index));
    else
      await page
        .getByRole("navigation", { name: "Séquences de la leçon" })
        .getByRole("button")
        .nth(index)
        .click();
  }
  for (const [index, name] of [
    [1, "03-lecon-mechanisms"],
    [2, "03-lecon-vocabulary"],
    [3, "03-lecon-pitfall"],
    [4, "03-lecon-case"],
    [6, "03-lecon-summary"],
  ] as const) {
    await sequence(index);
    await capture(page, testInfo, name);
  }
  await page.getByRole("tab", { name: /Pratiquer/ }).click();
  await page
    .getByLabel("Votre raisonnement", { exact: true })
    .fill(
      "Je sépare les ventes, les coûts et les encaissements avant de conclure.",
    );
  await page
    .getByRole("button", { name: "Comparer avec la solution", exact: true })
    .click();
  await capture(page, testInfo, "03-lecon-practice");
  await page.getByRole("tab", { name: /Appliquer/ }).click();
  await capture(page, testInfo, "03-lecon-application");
});

test("mouvement de page mesuré et préférence de réduction respectée", async ({
  page,
}) => {
  await seed(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#home");
  await expect(
    page.getByRole("heading", { name: "À vous de jouer, Profil démo." }),
  ).toBeVisible();
  const motion = await page.locator(".main-content").evaluate((main) => {
    const elements = [main, ...main.querySelectorAll("*")];
    return elements
      .map((element) => {
        const style = getComputedStyle(element);
        return {
          name: style.animationName,
          duration: style.animationDuration,
          easing: style.animationTimingFunction,
        };
      })
      .filter(
        (item) =>
          item.name !== "none" &&
          item.duration.split(",").some((duration) => parseFloat(duration) > 0),
      );
  });
  expect(
    motion.length,
    "Une entrée de page doit relier les écrans",
  ).toBeGreaterThan(0);
  expect(
    motion.every((item) => item.easing !== "linear"),
    "L’entrée de page utilise un easing naturel",
  ).toBe(true);
  const buttonDuration = await page
    .locator(".button.primary")
    .first()
    .evaluate((button) => getComputedStyle(button).transitionDuration);
  expect(
    buttonDuration.split(",").some((duration) => parseFloat(duration) > 0),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const reduced = await page.locator(".main-content").evaluate((main) => {
    const elements = [main, ...main.querySelectorAll("*")];
    return elements.map((element) => {
      const style = getComputedStyle(element);
      return {
        animation: style.animationName,
        animationDuration: style.animationDuration,
        transitionDuration: style.transitionDuration,
      };
    });
  });
  expect(
    reduced.every(
      (item) =>
        item.animation === "none" ||
        item.animationDuration
          .split(",")
          .every((duration) => parseFloat(duration) === 0),
    ),
  ).toBe(true);
  expect(
    reduced.every((item) =>
      item.transitionDuration
        .split(",")
        .every((duration) => parseFloat(duration) === 0),
    ),
  ).toBe(true);
  await noOverflow(page);
});

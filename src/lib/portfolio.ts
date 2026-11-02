import type {
  AppState,
  Attempt,
  Project,
  ProjectDecision,
  ProjectExperiment,
} from "./types.ts";
import { isReviewEvent } from "./reviews.ts";
import { isDecision, isExperiment } from "./projects.ts";
import {
  calculateSimulation,
  isSimulationSnapshot,
  type SimulationSnapshot,
} from "./simulation.ts";

export interface PortfolioLesson {
  id: string;
  title: string;
  domain: string;
  version: string;
  skills: string[];
}
export type QuizStatus = "untried" | "passed" | "revisit";
export interface PortfolioLessonEntry {
  lesson: PortfolioLesson;
  status: QuizStatus;
  latest?: Attempt;
  currentAttempts: Attempt[];
  archivedAttempts: Attempt[];
  note: string;
  projects: Project[];
}
export interface PortfolioProjectEntry {
  project: Project;
  experiments: ProjectExperiment[];
  decisions: ProjectDecision[];
}
export interface PortfolioNote {
  lessonId: string;
  title: string;
  body: string;
  catalogued: boolean;
}
export interface Portfolio {
  asOf: string;
  lessons: PortfolioLessonEntry[];
  projects: PortfolioProjectEntry[];
  notes: PortfolioNote[];
  simulations: SimulationSnapshot[];
  archivedAttempts: Attempt[];
  summary: {
    totalLessons: number;
    quizPassed: number;
    quizToRevisit: number;
    quizUntested: number;
    notes: number;
    projects: number;
    observedTests: number;
    reviewedDecisions: number;
    simulations: number;
    reviewSelfAssessments: number;
  };
}

function clock(now: Date): number {
  if (!(now instanceof Date) || !Number.isFinite(now.getTime()))
    throw new RangeError("La date du portfolio est invalide.");
  return now.getTime();
}

function text(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function instant(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const time = Date.parse(value);
  return Number.isFinite(time) && new Date(time).toISOString() === value
    ? time
    : null;
}

function lessonIdentity(lesson: Pick<PortfolioLesson, "id" | "version">) {
  if (!text(lesson.id) || !text(lesson.version))
    throw new Error("Chaque leçon doit avoir un identifiant et une version.");
}

/** A persisted quiz is evidence of its own result, not a professional certificate. */
function coherentAttempt(attempt: Attempt): boolean {
  return (
    !!attempt &&
    typeof attempt === "object" &&
    text(attempt.lessonId) &&
    (attempt.lessonVersion === undefined || text(attempt.lessonVersion)) &&
    typeof attempt.passed === "boolean" &&
    Number.isInteger(attempt.correct) &&
    Number.isInteger(attempt.total) &&
    attempt.total > 0 &&
    attempt.correct >= 0 &&
    attempt.correct <= attempt.total &&
    attempt.percent === Math.round((attempt.correct / attempt.total) * 100) &&
    attempt.passed === attempt.correct / attempt.total >= 0.8 &&
    !!attempt.answers &&
    typeof attempt.answers === "object" &&
    !Array.isArray(attempt.answers) &&
    Object.values(attempt.answers).every(
      (value) => Number.isInteger(value) && value >= 0 && value <= 20,
    )
  );
}

function eligible(
  lesson: Pick<PortfolioLesson, "id" | "version">,
  attempt: Attempt,
  nowMs: number,
): boolean {
  const at = instant(attempt?.at);
  return (
    coherentAttempt(attempt) &&
    attempt.lessonId === lesson.id &&
    (attempt.lessonVersion ?? "1.0.0") === lesson.version &&
    at !== null &&
    at <= nowMs
  );
}

/**
 * Return copies in chronological order. Equal instants keep source order, so the
 * last imported entry wins a tie without letting array order override real dates.
 */
export function currentQuizAttempts(
  lesson: Pick<PortfolioLesson, "id" | "version">,
  attempts: Attempt[],
  now: Date,
): Attempt[] {
  lessonIdentity(lesson);
  const nowMs = clock(now);
  return attempts
    .map((attempt, index) => ({ attempt, index }))
    .filter(({ attempt }) => eligible(lesson, attempt, nowMs))
    .sort(
      (a, b) =>
        instant(a.attempt.at)! - instant(b.attempt.at)! || a.index - b.index,
    )
    .map(({ attempt }) => structuredClone(attempt));
}

export function latestCurrentAttempt(
  lesson: Pick<PortfolioLesson, "id" | "version">,
  attempts: Attempt[],
  now: Date,
): Attempt | undefined {
  return currentQuizAttempts(lesson, attempts, now).at(-1);
}

/** Read-only projection: no new progress, completion dates or evidence is invented. */
export function buildPortfolio(
  catalog: PortfolioLesson[],
  state: AppState,
  now: Date,
): Portfolio {
  const nowMs = clock(now);
  const byId = new Map<string, PortfolioLesson>();
  for (const lesson of catalog) {
    lessonIdentity(lesson);
    if (byId.has(lesson.id))
      throw new Error("Les identifiants des leçons doivent être uniques.");
    byId.set(lesson.id, lesson);
  }
  const projects: PortfolioProjectEntry[] = state.projects.map((project) => ({
    project: structuredClone(project),
    experiments: (state.experiments ?? [])
      .filter((entry) => entry.projectId === project.id && isExperiment(entry))
      .map((entry) => structuredClone(entry)),
    decisions: (state.decisions ?? [])
      .filter((entry) => entry.projectId === project.id && isDecision(entry))
      .map((entry) => structuredClone(entry)),
  }));
  const notes: PortfolioNote[] = Object.entries(state.notes)
    .filter(([, body]) => typeof body === "string" && body.trim().length > 0)
    .map(([lessonId, body]) => ({
      lessonId,
      title:
        byId.get(lessonId)?.title || "Note d’une ancienne leçon · " + lessonId,
      body,
      catalogued: byId.has(lessonId),
    }));
  const noteById = new Map(notes.map((note) => [note.lessonId, note.body]));
  const lessons: PortfolioLessonEntry[] = catalog.map((lesson) => {
    const currentAttempts = currentQuizAttempts(lesson, state.attempts, now);
    const latest = currentAttempts.at(-1);
    return {
      lesson: {
        id: lesson.id,
        title: lesson.title,
        domain: lesson.domain,
        version: lesson.version,
        skills: [...lesson.skills],
      },
      status: latest ? (latest.passed ? "passed" : "revisit") : "untried",
      ...(latest ? { latest: structuredClone(latest) } : {}),
      currentAttempts,
      archivedAttempts: state.attempts
        .filter(
          (attempt) =>
            attempt.lessonId === lesson.id && !eligible(lesson, attempt, nowMs),
        )
        .map((attempt) => structuredClone(attempt)),
      note: noteById.get(lesson.id) ?? "",
      projects: state.projects
        .filter((project) => project.lessonIds.includes(lesson.id))
        .map((project) => structuredClone(project)),
    };
  });
  const archivedAttempts = state.attempts
    .filter((attempt) => {
      const lesson = byId.get(attempt.lessonId);
      return !lesson || !eligible(lesson, attempt, nowMs);
    })
    .map((attempt) => structuredClone(attempt));
  const simulations = (state.simulations ?? [])
    .filter(isSimulationSnapshot)
    .map((entry) => structuredClone(entry));
  return {
    asOf: now.toISOString(),
    lessons,
    projects,
    notes,
    simulations,
    archivedAttempts,
    summary: {
      totalLessons: lessons.length,
      quizPassed: lessons.filter((entry) => entry.status === "passed").length,
      quizToRevisit: lessons.filter((entry) => entry.status === "revisit")
        .length,
      quizUntested: lessons.filter((entry) => entry.status === "untried")
        .length,
      notes: notes.length,
      projects: projects.length,
      observedTests: projects.reduce(
        (count, entry) =>
          count +
          entry.experiments.filter((experiment) => !!experiment.result).length,
        0,
      ),
      reviewedDecisions: projects.reduce(
        (count, entry) =>
          count +
          entry.decisions.filter((decision) => !!decision.outcome).length,
        0,
      ),
      simulations: simulations.length,
      reviewSelfAssessments: (state.reviewEvents ?? []).filter(
        (event) => isReviewEvent(event) && instant(event.at)! <= nowMs,
      ).length,
    },
  };
}

const tick = String.fromCharCode(96);
function markdownText(value: string): string {
  return value
    .replace(/[\r\n]+/g, " ")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/[\\*_[\]#|]/g, "\\$&")
    .replaceAll(tick, "\\" + tick);
}

/** Preserve personal content literally, even if it contains Markdown fences. */
function literal(value: string, language = "text"): string {
  const runs = value.match(new RegExp(tick + "+", "g")) ?? [];
  const length = runs.reduce(
    (longest, run) => Math.max(longest, run.length + 1),
    3,
  );
  const fence = tick.repeat(length);
  return fence + language + "\n" + value + "\n" + fence;
}

function field(label: string, value: string): string[] {
  return ["**" + label + "**", "", literal(value), ""];
}

const statusLabels: Record<QuizStatus, string> = {
  untried: "Aucun quiz courant enregistré",
  passed: "Quiz courant validé",
  revisit: "Quiz courant à reprendre",
};
const conclusions = {
  supported: "Hypothèse confortée (appréciation personnelle)",
  refuted: "Hypothèse fragilisée (appréciation personnelle)",
  inconclusive: "Résultat non concluant (appréciation personnelle)",
};
const comparisons = {
  better: "Mieux que prévu",
  "as-expected": "Conforme à l’attendu",
  worse: "Moins bien que prévu",
  mixed: "Résultat contrasté",
};
const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function archivedReason(
  attempt: Attempt,
  byId: Map<string, PortfolioLesson>,
  nowMs: number,
): string {
  const lesson = byId.get(attempt.lessonId);
  if (!lesson) return "Leçon absente du catalogue actuel.";
  if ((attempt.lessonVersion ?? "1.0.0") !== lesson.version)
    return "Version différente de la version courante.";
  const at = instant(attempt.at);
  if (at === null) return "Date invalide ou non canonique.";
  if (at > nowMs) return "Date postérieure à la date d’export.";
  return "Structure de tentative incohérente.";
}

function exportExperiment(entry: ProjectExperiment): string[] {
  const lines = [
    "#### Test terrain — " + markdownText(entry.title),
    "",
    "Plan enregistré le " +
      markdownText(entry.createdAt) +
      " ; date de revue : " +
      markdownText(entry.reviewOn) +
      ".",
    "",
    ...field("Hypothèse de départ", entry.hypothesis),
    ...field("Protocole", entry.protocol),
    ...field("Critère de réussite prévu", entry.successCriterion),
  ];
  if (entry.result) {
    lines.push(
      "**Conclusion déclarée : " + conclusions[entry.result.conclusion] + ".**",
      "",
      ...field("Observation consignée", entry.result.observation),
      ...field(
        "Éléments de preuve saisis par l’utilisateur",
        entry.result.evidence,
      ),
      "Résultat consigné le " + markdownText(entry.result.recordedAt) + ".",
      "",
    );
  } else lines.push("Aucune observation consignée pour ce test.", "");
  return lines;
}

function exportDecision(entry: ProjectDecision): string[] {
  const lines = [
    "#### Décision — " + markdownText(entry.title),
    "",
    "Décision consignée le " +
      markdownText(entry.createdAt) +
      " ; date de revue : " +
      markdownText(entry.reviewOn) +
      ".",
    "",
    ...field("Contexte initial", entry.context),
    ...field("Options envisagées", entry.options),
    ...field("Choix initial", entry.choice),
    ...field("Résultat attendu au départ", entry.expectedOutcome),
    "Confiance initiale déclarée : " +
      entry.confidence +
      " % (estimation personnelle, pas une probabilité calculée).",
    "",
    ...field("Risque envisagé", entry.risk),
  ];
  if (entry.experimentId)
    lines.push(
      "Test terrain associé : " + markdownText(entry.experimentId) + ".",
      "",
    );
  if (entry.outcome) {
    lines.push(
      "**Comparaison déclarée : " +
        comparisons[entry.outcome.comparison] +
        ".**",
      "",
      ...field("Ce qui a été observé ensuite", entry.outcome.observed),
      ...field("Apprentissage déclaré", entry.outcome.learning),
      "Bilan consigné le " + markdownText(entry.outcome.recordedAt) + ".",
      "",
    );
  } else lines.push("Aucun bilan consigné pour cette décision.", "");
  return lines;
}

/** A downloadable document, compatible with Obsidian without accessing a vault. */
export function portfolioMarkdown(
  catalog: PortfolioLesson[],
  state: AppState,
  now: Date,
): string {
  const portfolio = buildPortfolio(catalog, state, now);
  const byId = new Map(catalog.map((lesson) => [lesson.id, lesson]));
  const lines = [
    "---",
    "title: " + JSON.stringify("Portfolio d’apprentissage"),
    "type: " + JSON.stringify("bouse-learning-portfolio"),
    "exported_at: " + JSON.stringify(portfolio.asOf),
    "schema_version: 1",
    "---",
    "",
    "# Portfolio d’apprentissage",
    "",
    "Ce dossier rassemble les traces enregistrées dans BOUSE. Il ne constitue ni un diplôme, ni une certification professionnelle, ni une vérification indépendante.",
    "",
    "Export Markdown compatible avec Obsidian : aucun coffre n’a été ouvert, modifié ou synchronisé.",
    "",
    "## Repères d’ensemble",
    "",
    "- Quiz courants validés : " +
      portfolio.summary.quizPassed +
      " / " +
      portfolio.summary.totalLessons +
      ".",
    "- Quiz courants à reprendre : " + portfolio.summary.quizToRevisit + ".",
    "- Notes personnelles non vides : " +
      portfolio.summary.notes +
      " (sans date de saisie enregistrée).",
    "- Dossiers de projet : " +
      portfolio.summary.projects +
      " ; ce nombre ne signifie pas projets réalisés ou marchés validés.",
    "- Tests avec observations déclarées : " +
      portfolio.summary.observedTests +
      ".",
    "- Bilans de décision consignés : " +
      portfolio.summary.reviewedDecisions +
      ".",
    "- Comparaisons financières fictives sauvegardées : " +
      portfolio.summary.simulations +
      ".",
    "- Rappels autoévalués à la date de l’export : " +
      portfolio.summary.reviewSelfAssessments +
      " ; ils ne changent pas les résultats de quiz.",
    "",
    "## Notions du catalogue",
    "",
  ];
  for (const [index, entry] of portfolio.lessons.entries()) {
    lines.push(
      "### " + (index + 1) + ". " + markdownText(entry.lesson.title),
      "",
      "Domaine : " +
        markdownText(entry.lesson.domain) +
        " · version courante : " +
        markdownText(entry.lesson.version) +
        ".",
      "",
      "Notions associées : " +
        entry.lesson.skills.map(markdownText).join(", ") +
        ".",
      "",
      "**" + statusLabels[entry.status] + ".**",
      "",
    );
    if (entry.latest)
      lines.push(
        "Dernière tentative courante : " +
          markdownText(entry.latest.at) +
          " · " +
          entry.latest.percent +
          " %.",
        "",
      );
    if (entry.currentAttempts.length)
      lines.push(
        "Tentatives de la version courante, dans l’ordre chronologique :",
        "",
        literal(JSON.stringify(entry.currentAttempts, null, 2), "json"),
        "",
      );
    lines.push(
      "Dossiers liés : " +
        (entry.projects.length
          ? entry.projects
              .map((project) => markdownText(project.title))
              .join(" ; ")
          : "aucun") +
        ".",
      "",
    );
    if (entry.note)
      lines.push(
        ...field(
          "Note personnelle — date de saisie non enregistrée",
          entry.note,
        ),
      );
    else
      lines.push("Aucune note personnelle enregistrée pour cette notion.", "");
    if (entry.archivedAttempts.length)
      lines.push(
        entry.archivedAttempts.length +
          " tentative(s) non utilisée(s) pour le statut courant ; voir l’historique archivé.",
        "",
      );
  }
  lines.push("## Historique des quiz archivés", "");
  if (!portfolio.archivedAttempts.length)
    lines.push("Aucune tentative hors du périmètre courant.", "");
  for (const [index, attempt] of portfolio.archivedAttempts.entries())
    lines.push(
      "### Tentative archivée " + (index + 1),
      "",
      archivedReason(attempt, byId, clock(now)),
      "",
      "Cette trace est conservée sans la transformer en preuve actuelle.",
      "",
      literal(JSON.stringify(attempt, null, 2), "json"),
      "",
    );

  lines.push("## Dossiers de projet", "");
  if (!portfolio.projects.length) lines.push("Aucun dossier enregistré.", "");
  for (const entry of portfolio.projects) {
    const project = entry.project;
    lines.push(
      "### " + markdownText(project.title),
      "",
      "Création de la fiche : " +
        markdownText(project.createdAt) +
        ". Cette date ne date pas son stade actuel.",
      "",
      ...field("Identifiant du dossier", project.id),
      ...field(
        "Étape déclarée — date de changement non enregistrée",
        project.stage,
      ),
      ...field("Problème", project.problem),
      ...field("Client envisagé", project.customer),
      ...field("Hypothèse", project.hypothesis),
      ...field("Prochaine action", project.nextAction),
      "Leçons liées : " +
        (project.lessonIds.length
          ? project.lessonIds
              .map((id) => markdownText(byId.get(id)?.title ?? id))
              .join(" ; ")
          : "aucune") +
        ".",
      "",
    );
    if (!entry.experiments.length)
      lines.push("Aucun test terrain enregistré.", "");
    for (const experiment of entry.experiments)
      lines.push(...exportExperiment(experiment));
    if (!entry.decisions.length) lines.push("Aucune décision enregistrée.", "");
    for (const decision of entry.decisions)
      lines.push(...exportDecision(decision));
  }

  lines.push("## Comparaisons financières fictives", "");
  if (!portfolio.simulations.length)
    lines.push("Aucune comparaison sauvegardée.", "");
  for (const snapshot of portfolio.simulations) {
    const result = calculateSimulation(snapshot.input);
    lines.push(
      "### " + markdownText(snapshot.title),
      "",
      "Comparaison sauvegardée le " +
        markdownText(snapshot.createdAt) +
        " · modèle " +
        markdownText(snapshot.modelVersion) +
        ".",
      "",
      "Hypothèses exactes, pour reproduire le calcul :",
      "",
      literal(JSON.stringify(snapshot.input, null, 2), "json"),
      "",
      "| Résultat du modèle sur six mois | Référence | Scénario |",
      "| --- | ---: | ---: |",
      "| Résultat simplifié cumulé | " +
        money.format(result.baseline.totalProfit) +
        " | " +
        money.format(result.scenario.totalProfit) +
        " |",
      "| Trésorerie finale | " +
        money.format(result.baseline.closingCash) +
        " | " +
        money.format(result.scenario.closingCash) +
        " |",
      "| Besoin théorique de financement | " +
        money.format(result.baseline.financingNeed) +
        " | " +
        money.format(result.scenario.financingNeed) +
        " |",
      "",
      "Exploration hypothétique, pas un résultat terrain ni une simulation « réussie ». Les ventes sont constantes, sans créances initiales ; les charges sont payées le mois de la vente et les encaissements sont décalés par mois entiers. TVA, impôts, stocks, investissements, dette, impayés et variations à l’intérieur du mois ne sont pas modélisés.",
      "",
    );
  }

  lines.push("## Notes hors catalogue", "");
  const orphanNotes = portfolio.notes.filter((note) => !note.catalogued);
  if (!orphanNotes.length) lines.push("Aucune note hors catalogue.", "");
  for (const note of orphanNotes)
    lines.push(
      "### " + markdownText(note.title),
      "",
      "Cette note est conservée sans lui inventer une leçon ou une date.",
      "",
      literal(note.body),
      "",
    );

  lines.push(
    "## Nature des traces",
    "",
    "- Le statut d’un quiz vient de la dernière tentative chronologique admissible de la version courante ; une tentative sans version appartient au catalogue initial 1.0.0.",
    "- Les dates invalides, futures et versions différentes restent archivées. Une réussite ancienne ne masque pas un échec courant plus récent.",
    "- Les notes, étapes, observations, preuves saisies et conclusions terrain sont des déclarations personnelles, sans validation indépendante par BOUSE.",
    "- Les exercices et teach-back ne sont pas enregistrés comme réalisations : aucun accomplissement n’est déduit de leur simple affichage.",
    "- Les rappels sont des autoévaluations ; les simulations sont des calculs hypothétiques. Aucun score global de maîtrise professionnelle n’est calculé.",
    "- Ce fichier contient les traces locales exportées volontairement. Il ne remplace pas la sauvegarde JSON complète de l’application.",
    "",
  );
  return lines.join("\n");
}

import type {
  DecisionOutcome,
  ExperimentResult,
  ProjectDecision,
  ProjectExperiment,
} from "./types.ts";

export const projectTextLimits = {
  id: 160,
  title: 140,
  short: 2_000,
  long: 5_000,
} as const;

export const experimentConclusions = [
  "supported",
  "refuted",
  "inconclusive",
] as const;
export const decisionComparisons = [
  "better",
  "as-expected",
  "worse",
  "mixed",
] as const;

export type ExperimentDraft = Omit<
  ProjectExperiment,
  "id" | "createdAt" | "result"
>;
export type ExperimentResultDraft = Omit<ExperimentResult, "recordedAt">;
export type DecisionDraft = Omit<
  ProjectDecision,
  "id" | "createdAt" | "outcome"
>;
export type DecisionOutcomeDraft = Omit<DecisionOutcome, "recordedAt">;

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown, maximum: number): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maximum
  );
}

function cleanText(value: unknown): string {
  if (typeof value !== "string")
    throw new Error("Renseignez les champs de texte avant d’enregistrer.");
  return value.trim();
}

/** Date-only deadlines remain calendar dates, without an invented local hour. */
function calendarDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const time = Date.parse(`${value}T12:00:00.000Z`);
  return (
    Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value
  );
}

/** Instants are stored in canonical UTC, including the original time. */
function instant(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const time = Date.parse(value);
  return Number.isFinite(time) && new Date(time).toISOString() === value
    ? time
    : null;
}

function timestamp(value: Date): string {
  if (!(value instanceof Date) || !Number.isFinite(value.getTime()))
    throw new RangeError("La date d’enregistrement est invalide.");
  return value.toISOString();
}

function result(value: unknown, createdAt: number): value is ExperimentResult {
  if (!record(value)) return false;
  const recordedAt = instant(value.recordedAt);
  return (
    text(value.observation, projectTextLimits.long) &&
    text(value.evidence, projectTextLimits.long) &&
    experimentConclusions.some((entry) => entry === value.conclusion) &&
    recordedAt !== null &&
    recordedAt >= createdAt
  );
}

function outcome(value: unknown, createdAt: number): value is DecisionOutcome {
  if (!record(value)) return false;
  const recordedAt = instant(value.recordedAt);
  return (
    text(value.observed, projectTextLimits.long) &&
    decisionComparisons.some((entry) => entry === value.comparison) &&
    text(value.learning, projectTextLimits.long) &&
    recordedAt !== null &&
    recordedAt >= createdAt
  );
}

/** Shape validation only; the state boundary checks project and experiment links. */
export function isExperiment(value: unknown): value is ProjectExperiment {
  if (!record(value)) return false;
  const createdAt = instant(value.createdAt);
  return (
    text(value.id, projectTextLimits.id) &&
    text(value.projectId, projectTextLimits.id) &&
    text(value.title, projectTextLimits.title) &&
    text(value.hypothesis, projectTextLimits.short) &&
    text(value.protocol, projectTextLimits.long) &&
    text(value.successCriterion, projectTextLimits.short) &&
    calendarDate(value.reviewOn) &&
    createdAt !== null &&
    (value.result === undefined || result(value.result, createdAt))
  );
}

export function isDecision(value: unknown): value is ProjectDecision {
  if (!record(value)) return false;
  const createdAt = instant(value.createdAt);
  return (
    text(value.id, projectTextLimits.id) &&
    text(value.projectId, projectTextLimits.id) &&
    (value.experimentId === undefined ||
      text(value.experimentId, projectTextLimits.id)) &&
    text(value.title, projectTextLimits.title) &&
    text(value.context, projectTextLimits.long) &&
    text(value.options, projectTextLimits.long) &&
    text(value.choice, projectTextLimits.short) &&
    text(value.expectedOutcome, projectTextLimits.short) &&
    Number.isInteger(value.confidence) &&
    Number(value.confidence) >= 0 &&
    Number(value.confidence) <= 100 &&
    text(value.risk, projectTextLimits.short) &&
    calendarDate(value.reviewOn) &&
    createdAt !== null &&
    (value.outcome === undefined || outcome(value.outcome, createdAt))
  );
}

/** Explicit field copies prevent a runtime draft from supplying a fake result. */
export function createExperiment(
  draft: ExperimentDraft,
  id: string,
  at: Date,
): ProjectExperiment {
  const experiment: ProjectExperiment = {
    id: cleanText(id),
    projectId: cleanText(draft.projectId),
    title: cleanText(draft.title),
    hypothesis: cleanText(draft.hypothesis),
    protocol: cleanText(draft.protocol),
    successCriterion: cleanText(draft.successCriterion),
    reviewOn: cleanText(draft.reviewOn),
    createdAt: timestamp(at),
  };
  if (!isExperiment(experiment))
    throw new Error(
      "Le test est incomplet ou invalide. Vérifiez les champs, leur longueur et la date de revue.",
    );
  return experiment;
}

/** Results append an observation; the original hypothesis and criterion stay intact. */
export function recordExperimentResult(
  experiment: ProjectExperiment,
  draft: ExperimentResultDraft,
  at: Date,
): ProjectExperiment {
  if (!isExperiment(experiment))
    throw new Error("Le test à compléter est invalide.");
  if (experiment.result !== undefined)
    throw new Error(
      "Ce résultat est déjà consigné. Créez un nouveau test pour une autre hypothèse.",
    );
  const next: ProjectExperiment = {
    ...experiment,
    result: {
      observation: cleanText(draft.observation),
      evidence: cleanText(draft.evidence),
      conclusion: draft.conclusion,
      recordedAt: timestamp(at),
    },
  };
  if (!isExperiment(next))
    throw new Error(
      "Le résultat est incomplet ou invalide. Son enregistrement doit suivre la création du test.",
    );
  return next;
}

export function createDecision(
  draft: DecisionDraft,
  id: string,
  at: Date,
): ProjectDecision {
  const decision: ProjectDecision = {
    id: cleanText(id),
    projectId: cleanText(draft.projectId),
    ...(draft.experimentId === undefined
      ? {}
      : { experimentId: cleanText(draft.experimentId) }),
    title: cleanText(draft.title),
    context: cleanText(draft.context),
    options: cleanText(draft.options),
    choice: cleanText(draft.choice),
    expectedOutcome: cleanText(draft.expectedOutcome),
    confidence: draft.confidence,
    risk: cleanText(draft.risk),
    reviewOn: cleanText(draft.reviewOn),
    createdAt: timestamp(at),
  };
  if (!isDecision(decision))
    throw new Error(
      "La décision est incomplète ou invalide. Vérifiez les champs, la confiance entre 0 et 100 et la date de revue.",
    );
  return decision;
}

/** A later outcome never rewrites what was known or expected at decision time. */
export function recordDecisionOutcome(
  decision: ProjectDecision,
  draft: DecisionOutcomeDraft,
  at: Date,
): ProjectDecision {
  if (!isDecision(decision))
    throw new Error("La décision à compléter est invalide.");
  if (decision.outcome !== undefined)
    throw new Error(
      "Ce bilan est déjà consigné. Créez une nouvelle décision pour poursuivre le journal.",
    );
  const next: ProjectDecision = {
    ...decision,
    outcome: {
      observed: cleanText(draft.observed),
      comparison: draft.comparison,
      learning: cleanText(draft.learning),
      recordedAt: timestamp(at),
    },
  };
  if (!isDecision(next))
    throw new Error(
      "Le bilan est incomplet ou invalide. Son enregistrement doit suivre la décision.",
    );
  return next;
}

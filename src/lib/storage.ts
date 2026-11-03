import type { AppState } from "./types";
import { projectStages } from "./domain.ts";
import { isReviewEvent } from "./reviews.ts";
import { isExperiment, isDecision } from "./projects.ts";
import { isSimulationSnapshot } from "./simulation.ts";
import { isLearningGoalIds } from "./projectLearning.ts";

export const storageKey = "bouse.academy.v1";
export const emptyState: AppState = {
  schemaVersion: 1,
  profile: null,
  attempts: [],
  projects: [],
  notes: {},
  lastLessonId: null,
  reviewEvents: [],
  experiments: [],
  decisions: [],
  simulations: [],
};
export function parseState(raw: string): AppState {
  const data: unknown = JSON.parse(raw);
  if (!data || typeof data !== "object")
    throw new Error("Format de sauvegarde invalide.");
  const s = data as AppState;
  if (
    s.schemaVersion !== 1 ||
    !Array.isArray(s.attempts) ||
    !Array.isArray(s.projects) ||
    !s.notes ||
    typeof s.notes !== "object" ||
    Array.isArray(s.notes)
  )
    throw new Error("Version ou structure de sauvegarde incompatible.");
  const strings = (obj: object, keys: string[]) =>
    keys.every((k) => typeof (obj as Record<string, unknown>)[k] === "string");
  const answers = (a: unknown) =>
    !!a &&
    typeof a === "object" &&
    !Array.isArray(a) &&
    Object.values(a).every(
      (n) => Number.isInteger(n) && Number(n) >= 0 && Number(n) <= 20,
    );
  if (
    s.profile !== null &&
    (!s.profile ||
      !strings(s.profile, ["name", "goal", "level", "preference"]) ||
      !Array.isArray(s.profile.interests) ||
      !s.profile.interests.every((i) => typeof i === "string") ||
      !Number.isFinite(s.profile.minutes) ||
      s.profile.minutes <= 0 ||
      !answers(s.profile.diagnostic))
  )
    throw new Error("Profil invalide.");
  if (
    !s.attempts.every(
      (a) =>
        a &&
        strings(a, ["lessonId", "at"]) &&
        (a.lessonVersion === undefined ||
          (typeof a.lessonVersion === "string" &&
            a.lessonVersion.trim().length > 0)) &&
        answers(a.answers) &&
        Number.isFinite(a.percent) &&
        a.percent >= 0 &&
        a.percent <= 100 &&
        Number.isInteger(a.correct) &&
        Number.isInteger(a.total) &&
        a.total > 0 &&
        a.correct >= 0 &&
        a.correct <= a.total &&
        a.percent === Math.round((a.correct / a.total) * 100) &&
        a.passed === a.correct / a.total >= 0.8,
    )
  )
    throw new Error("Tentatives invalides.");
  if (
    !s.projects.every(
      (p) =>
        p &&
        strings(p, [
          "id",
          "title",
          "problem",
          "customer",
          "hypothesis",
          "nextAction",
          "stage",
          "createdAt",
        ]) &&
        projectStages.some((stage) => stage === p.stage) &&
        Array.isArray(p.lessonIds) &&
        p.lessonIds.every((id) => typeof id === "string") &&
        (p.learningGoalIds === undefined ||
          isLearningGoalIds(p.learningGoalIds)),
    )
  )
    throw new Error("Projets invalides.");
  const projectIds = new Set(s.projects.map((project) => project.id));
  if (
    projectIds.size !== s.projects.length ||
    s.projects.some((project) => !project.id.trim())
  )
    throw new Error("Projets invalides : identifiants absents ou en double.");
  if (
    !Object.values(s.notes).every((n) => typeof n === "string") ||
    (s.lastLessonId !== null && typeof s.lastLessonId !== "string")
  )
    throw new Error("Notes invalides.");
  if (s.reviewEvents !== undefined) {
    if (!Array.isArray(s.reviewEvents) || !s.reviewEvents.every(isReviewEvent))
      throw new Error("Historique de révision invalide.");
    const ids = new Set(s.reviewEvents.map((event) => event.id));
    if (ids.size !== s.reviewEvents.length)
      throw new Error(
        "Historique de révision invalide : identifiants en double.",
      );
  }
  if (s.experiments !== undefined) {
    if (
      !Array.isArray(s.experiments) ||
      !s.experiments.every(isExperiment) ||
      s.experiments.some((item) => !projectIds.has(item.projectId))
    )
      throw new Error("Tests terrain invalides ou sans projet associé.");
    if (
      new Set(s.experiments.map((item) => item.id)).size !==
      s.experiments.length
    )
      throw new Error("Tests terrain invalides : identifiants en double.");
  }
  if (s.decisions !== undefined) {
    if (
      !Array.isArray(s.decisions) ||
      !s.decisions.every(isDecision) ||
      s.decisions.some((item) => !projectIds.has(item.projectId))
    )
      throw new Error("Journal de décisions invalide ou sans projet associé.");
    if (new Set(s.decisions.map((item) => item.id)).size !== s.decisions.length)
      throw new Error(
        "Journal de décisions invalide : identifiants en double.",
      );
    if (
      s.decisions.some(
        (item) =>
          item.experimentId !== undefined &&
          !s.experiments?.some(
            (test) =>
              test.id === item.experimentId &&
              test.projectId === item.projectId,
          ),
      )
    )
      throw new Error(
        "Une décision fait référence à un test absent ou à un autre projet.",
      );
  }
  if (s.simulations !== undefined) {
    if (
      !Array.isArray(s.simulations) ||
      !s.simulations.every(isSimulationSnapshot)
    )
      throw new Error(
        "Comparaisons financières invalides ou version de modèle incompatible.",
      );
    if (
      new Set(s.simulations.map((entry) => entry.id)).size !==
      s.simulations.length
    )
      throw new Error(
        "Comparaisons financières invalides : identifiants en double.",
      );
  }
  return s;
}
export function readState(): { state: AppState; error: string | null } {
  try {
    const raw = localStorage.getItem(storageKey);
    return {
      state: raw ? parseState(raw) : structuredClone(emptyState),
      error: null,
    };
  } catch {
    return {
      state: structuredClone(emptyState),
      error:
        "La sauvegarde locale est inaccessible ou illisible. Elle a été conservée ; exportez-la avant de réinitialiser. Les changements restent en mémoire.",
    };
  }
}
export function downloadFile(
  name: string,
  contents: string,
  type = "application/json",
) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

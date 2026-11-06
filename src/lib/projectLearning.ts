import type { AppState, Attempt, Project } from "./types.ts";
import { latestCurrentAttempt } from "./portfolio.ts";

export interface LearningPlanLesson {
  id: string;
  title: string;
  domain: string;
  version: string;
  minutes: number;
  prerequisites: string[];
}
export type LearningStepStatus = "passed" | "ready" | "revisit" | "blocked";
export interface LearningPlanStep {
  lesson: LearningPlanLesson;
  isGoal: boolean;
  requiredBy: string[];
  status: LearningStepStatus;
  latest?: Attempt;
  unmetPrerequisiteIds: string[];
}
export interface ProjectLearningPlan {
  goalIds: string[];
  steps: LearningPlanStep[];
  missingGoalIds: string[];
  missingPrerequisiteIds: string[];
  cycleIds: string[];
  next?: LearningPlanStep;
  passedCount: number;
  remainingMinutes: number;
  allCurrentQuizzesPassed: boolean;
}

function text(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Unknown catalogue identities remain valid saved choices, never discarded. */
export function isLearningGoalIds(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(
      (id) =>
        typeof id === "string" &&
        id.length > 0 &&
        id.length <= 160 &&
        id.trim() === id,
    ) &&
    new Set(value).size === value.length
  );
}

export function setProjectLearningGoals(
  project: Project,
  ids: string[],
): Project {
  if (!isLearningGoalIds(ids))
    throw new Error(
      "Les objectifs d’apprentissage doivent avoir des identifiants uniques et non vides.",
    );
  if (!project || typeof project !== "object")
    throw new Error("Le projet à mettre à jour est invalide.");
  return { ...structuredClone(project), learningGoalIds: [...ids] };
}

function validateCatalog(catalog: LearningPlanLesson[]) {
  const byId = new Map<string, LearningPlanLesson>();
  for (const lesson of catalog) {
    if (
      !lesson ||
      !isLearningGoalIds([lesson.id]) ||
      !text(lesson.title) ||
      !text(lesson.domain) ||
      !text(lesson.version) ||
      !Number.isFinite(lesson.minutes) ||
      lesson.minutes < 0 ||
      !isLearningGoalIds(lesson.prerequisites) ||
      byId.has(lesson.id)
    )
      throw new Error(
        "Le catalogue du parcours est invalide : vérifiez identifiants, versions, durées et prérequis.",
      );
    byId.set(lesson.id, lesson);
  }
  return byId;
}

/**
 * Goals are explicit project choices. The prerequisite closure and quiz states
 * are derived from the current catalogue, not from the project's applied links.
 */
export function buildProjectLearningPlan(
  catalog: LearningPlanLesson[],
  project: Project,
  state: Pick<AppState, "attempts">,
  now: Date,
): ProjectLearningPlan {
  if (!(now instanceof Date) || !Number.isFinite(now.getTime()))
    throw new RangeError("La date du parcours est invalide.");
  const goals =
    project.learningGoalIds === undefined ? [] : project.learningGoalIds;
  if (!isLearningGoalIds(goals))
    throw new Error(
      "Les objectifs d’apprentissage enregistrés sont invalides.",
    );
  const byId = validateCatalog(catalog);
  const goalIds = [...goals];
  const missingGoalIds = goalIds.filter((id) => !byId.has(id));
  const missingPrerequisites = new Set<string>();
  const visited = new Map<string, "visiting" | "done">();
  const discovery: string[] = [];
  const order: string[] = [];

  function visit(id: string) {
    if (visited.get(id) === "done") return;
    if (visited.get(id) === "visiting") return;
    const lesson = byId.get(id);
    if (!lesson) return;
    visited.set(id, "visiting");
    discovery.push(id);
    for (const prerequisite of lesson.prerequisites) {
      if (byId.has(prerequisite)) visit(prerequisite);
      else missingPrerequisites.add(prerequisite);
    }
    visited.set(id, "done");
    order.push(id);
  }
  for (const id of goalIds) visit(id);

  // Strongly connected components identify every cycle participant, including
  // overlapping cycles reached through an already-finished DFS branch.
  const indexes = new Map<string, number>();
  const lowLinks = new Map<string, number>();
  const componentStack: string[] = [];
  const onStack = new Set<string>();
  const cycleMembers = new Set<string>();
  let index = 0;
  function component(id: string) {
    indexes.set(id, index);
    lowLinks.set(id, index);
    index += 1;
    componentStack.push(id);
    onStack.add(id);
    for (const prerequisite of byId.get(id)!.prerequisites) {
      if (!byId.has(prerequisite)) continue;
      if (!indexes.has(prerequisite)) {
        component(prerequisite);
        lowLinks.set(
          id,
          Math.min(lowLinks.get(id)!, lowLinks.get(prerequisite)!),
        );
      } else if (onStack.has(prerequisite)) {
        lowLinks.set(
          id,
          Math.min(lowLinks.get(id)!, indexes.get(prerequisite)!),
        );
      }
    }
    if (lowLinks.get(id) !== indexes.get(id)) return;
    const members: string[] = [];
    let member: string;
    do {
      member = componentStack.pop()!;
      onStack.delete(member);
      members.push(member);
    } while (member !== id);
    if (members.length > 1 || byId.get(id)!.prerequisites.includes(id))
      for (const cycleId of members) cycleMembers.add(cycleId);
  }
  for (const id of discovery) if (!indexes.has(id)) component(id);
  const cycles = new Set(discovery.filter((id) => cycleMembers.has(id)));

  const requiredBy = new Map<string, string[]>();
  for (const goalId of goalIds) {
    const seen = new Set<string>();
    function mark(id: string) {
      const lesson = byId.get(id);
      if (!lesson || seen.has(id)) return;
      seen.add(id);
      const goalsForNode = requiredBy.get(id) ?? [];
      goalsForNode.push(goalId);
      requiredBy.set(id, goalsForNode);
      for (const prerequisite of lesson.prerequisites) mark(prerequisite);
    }
    mark(goalId);
  }

  // Postorder puts prerequisites first. Cycle members are already marked, so
  // missing content and cycles propagate through every dependent descendant.
  const structuralIssues = new Set(cycles);
  for (const id of order) {
    if (
      byId
        .get(id)!
        .prerequisites.some(
          (prerequisite) =>
            !byId.has(prerequisite) || structuralIssues.has(prerequisite),
        )
    )
      structuralIssues.add(id);
  }
  const latest = new Map<string, Attempt>();
  for (const id of order) {
    const attempt = latestCurrentAttempt(byId.get(id)!, state.attempts, now);
    if (attempt) latest.set(id, attempt);
  }
  const steps: LearningPlanStep[] = order.map((id) => {
    const lesson = byId.get(id)!;
    const attempt = latest.get(id);
    const unmetPrerequisiteIds = lesson.prerequisites.filter(
      (prerequisite) =>
        !latest.get(prerequisite)?.passed || structuralIssues.has(prerequisite),
    );
    let status: LearningStepStatus;
    if (structuralIssues.has(id)) status = "blocked";
    else if (attempt?.passed) status = "passed";
    else if (unmetPrerequisiteIds.length) status = "blocked";
    else status = attempt ? "revisit" : "ready";
    return {
      lesson: {
        id: lesson.id,
        title: lesson.title,
        domain: lesson.domain,
        version: lesson.version,
        minutes: lesson.minutes,
        prerequisites: [...lesson.prerequisites],
      },
      isGoal: goalIds.includes(id),
      requiredBy: [...(requiredBy.get(id) ?? [])],
      status,
      ...(attempt ? { latest: structuredClone(attempt) } : {}),
      unmetPrerequisiteIds,
    };
  });
  const next = steps.find(
    (step) => step.status === "ready" || step.status === "revisit",
  );
  const remainingMinutes = steps.reduce(
    (minutes, step) =>
      minutes + (step.status === "passed" ? 0 : step.lesson.minutes),
    0,
  );
  if (!Number.isFinite(remainingMinutes))
    throw new RangeError(
      "La durée cumulée du parcours dépasse les limites de calcul.",
    );
  const passedCount = steps.filter((step) => step.status === "passed").length;
  return {
    goalIds,
    steps,
    missingGoalIds,
    missingPrerequisiteIds: [...missingPrerequisites],
    cycleIds: [...cycles],
    ...(next ? { next: structuredClone(next) } : {}),
    passedCount,
    remainingMinutes,
    allCurrentQuizzesPassed:
      goalIds.length > 0 &&
      missingGoalIds.length === 0 &&
      missingPrerequisites.size === 0 &&
      cycles.size === 0 &&
      steps.length > 0 &&
      passedCount === steps.length,
  };
}

const labels: Record<LearningStepStatus, string> = {
  passed: "Quiz courant validé",
  ready: "À explorer",
  revisit: "Quiz courant à reprendre",
  blocked: "Prérequis à travailler ou indisponibles",
};
function markdownText(value: string) {
  return value
    .replace(/[\r\n]+/g, " ")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/[\\`*_[\]#|]/g, "\\$&");
}
function literal(value: string) {
  const longest = (value.match(/`+/g) ?? []).reduce(
    (length, run) => Math.max(length, run.length),
    0,
  );
  const fence = "`".repeat(Math.max(3, longest + 1));
  return fence + "json\n" + value + "\n" + fence;
}

/** A document section that can be appended to a project dossier export. */
export function projectLearningMarkdown(
  catalog: LearningPlanLesson[],
  project: Project,
  state: Pick<AppState, "attempts">,
  now: Date,
): string {
  const plan = buildProjectLearningPlan(catalog, project, state, now);
  const byId = new Map(catalog.map((lesson) => [lesson.id, lesson]));
  const lines = [
    "## Parcours d’apprentissage du projet",
    "",
    "État du parcours à la date d’export : " + now.toISOString() + ".",
    "",
    "Les objectifs sont des choix explicites. Les prérequis sont dérivés du catalogue courant ; les leçons associées depuis Apply restent distinctes.",
    "",
    "### Objectifs choisis",
    "",
  ];
  if (!plan.goalIds.length) {
    lines.push("Aucun objectif d’apprentissage choisi pour ce projet.", "");
  } else {
    for (const id of plan.goalIds)
      lines.push(
        "- " +
          markdownText(byId.get(id)?.title ?? "Objectif indisponible") +
          " — identifiant : " +
          markdownText(id) +
          ".",
      );
    lines.push(
      "",
      "Identifiants exacts conservés :",
      "",
      literal(JSON.stringify(plan.goalIds, null, 2)),
      "",
    );
  }
  if (plan.steps.length) {
    lines.push(
      "### Ordre de travail et quiz courants",
      "",
      "| Ordre | Notion | Rôle | Version | État | Prérequis non validés |",
      "| ---: | --- | --- | --- | --- | --- |",
      ...plan.steps.map(
        (step, index) =>
          "| " +
          (index + 1) +
          " | " +
          markdownText(step.lesson.title) +
          " | " +
          (step.isGoal ? "Objectif choisi" : "Prérequis dérivé") +
          " | " +
          markdownText(step.lesson.version) +
          " | " +
          labels[step.status] +
          " | " +
          (step.unmetPrerequisiteIds.map(markdownText).join(", ") || "aucun") +
          " |",
      ),
      "",
      "Quiz courants validés : " +
        plan.passedCount +
        " / " +
        plan.steps.length +
        ".",
      "Durée indicative des leçons restant à travailler : " +
        plan.remainingMinutes +
        " minutes ; ce n’est pas une estimation de durée du projet.",
      "",
    );
    for (const step of plan.steps)
      if (step.latest)
        lines.push(
          "- Dernier quiz courant de " +
            markdownText(step.lesson.title) +
            " : " +
            step.latest.percent +
            " % le " +
            markdownText(step.latest.at) +
            ".",
        );
    lines.push("");
  }
  for (const [label, ids] of [
    ["Objectifs absents du catalogue courant", plan.missingGoalIds],
    ["Prérequis absents du catalogue courant", plan.missingPrerequisiteIds],
    ["Dépendances cycliques du catalogue", plan.cycleIds],
  ] as const) {
    if (ids.length)
      lines.push("### " + label, "", literal(JSON.stringify(ids, null, 2)), "");
  }
  lines.push(
    plan.next
      ? "Prochaine notion disponible : " +
          markdownText(plan.next.lesson.title) +
          "."
      : "Aucune prochaine notion disponible dans ce plan.",
    "",
    "Ces résultats décrivent des quiz et un plan de travail. Ils ne prouvent ni application terrain, ni maîtrise professionnelle, ni validation du projet. Les observations et les leçons associées restent des traces distinctes.",
    "",
  );
  return lines.join("\n");
}

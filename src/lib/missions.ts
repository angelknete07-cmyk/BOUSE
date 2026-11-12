/**
 * Les missions réelles dans l'appli : progression, dossier et compétences
 * mises en pratique. Calcul pur, testé dans tests/missions.test.ts.
 */
import {
  euro,
  MISSIONS,
  type Mission,
  type MissionLine,
  type MissionStep,
} from "../data/missions.ts";
import type { AppState, MissionRecord } from "./types.ts";

export const findMission = (id: string): Mission | undefined =>
  MISSIONS.find((m) => m.id === id);

export const missionMinutes = (mission: Mission) =>
  mission.steps.reduce((total, step) => total + step.minutes, 0);

/** « 1 650 », « 1 650,50 € », « 0,5 » → nombre ; vide ou illisible → null. */
export function parseNumber(raw: string | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[\s  €%]/g, "").replace(",", ".");
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  return Number(cleaned);
}

const isNumeric = (kind: string | undefined) =>
  kind === "money" || kind === "number";

/** Ce qui manque pour valider l'étape (vide = c'est bon). */
export function stepProblems(
  step: MissionStep,
  answers: Record<string, string>,
): string[] {
  const problems: string[] = [];
  for (const field of step.fields) {
    const value = answers[field.id]?.trim() ?? "";
    if (!value) {
      if (!field.optional) problems.push(`${field.label} : à remplir`);
    } else if (isNumeric(field.kind) && parseNumber(value) === null) {
      problems.push(`${field.label} : un nombre, par exemple ${field.example}`);
    }
  }
  return problems;
}

export const emptyRecord = (now: Date): MissionRecord => ({
  answers: {},
  done: [],
  startedAt: now.toISOString(),
});

export function missionRecord(state: AppState, id: string) {
  return state.missions?.[id];
}

/** L'étape à faire : la première non validée (ou la dernière si tout est fait). */
export function currentStepIndex(mission: Mission, record?: MissionRecord) {
  const index = mission.steps.findIndex((s) => !record?.done.includes(s.id));
  return index === -1 ? mission.steps.length - 1 : index;
}

export const isFinished = (mission: Mission, record?: MissionRecord) =>
  !!record && mission.steps.every((s) => record.done.includes(s.id));

/** Garde les réponses tapées (brouillon) sans valider l'étape. */
export function saveAnswers(
  state: AppState,
  missionId: string,
  answers: Record<string, string>,
  now: Date,
): AppState {
  const record = state.missions?.[missionId] ?? emptyRecord(now);
  return {
    ...state,
    missions: {
      ...state.missions,
      [missionId]: { ...record, answers: { ...record.answers, ...answers } },
    },
  };
}

/** Valide une étape ; la mission se termine quand toutes le sont. */
export function completeStep(
  state: AppState,
  missionId: string,
  stepId: string,
  now: Date,
): AppState {
  const mission = findMission(missionId);
  const record = state.missions?.[missionId] ?? emptyRecord(now);
  if (!mission || !mission.steps.some((s) => s.id === stepId)) return state;
  const done = record.done.includes(stepId)
    ? record.done
    : mission.steps
        .map((s) => s.id)
        .filter((id) => id === stepId || record.done.includes(id));
  const next: MissionRecord = { ...record, done };
  if (isFinished(mission, next) && !next.finishedAt)
    next.finishedAt = now.toISOString();
  return { ...state, missions: { ...state.missions, [missionId]: next } };
}

/** Recommencer une mission : efface ses réponses, rien d'autre. */
export function restartMission(state: AppState, missionId: string): AppState {
  if (!state.missions?.[missionId]) return state;
  const { [missionId]: _removed, ...rest } = state.missions;
  return { ...state, missions: rest };
}

/** Les lignes calculées d'une étape (total, puis calculs). */
export function stepLines(
  mission: Mission,
  step: MissionStep,
  answers: Record<string, string>,
): MissionLine[] {
  const lines: MissionLine[] = [];
  if (step.total) {
    const money = step.fields
      .filter((f) => f.kind === "money")
      .map((f) => parseNumber(answers[f.id]));
    const total = money.every((v) => v === null)
      ? null
      : money.reduce<number>((a, v) => a + (v ?? 0), 0);
    lines.push({ label: step.total, value: euro(total) });
  }
  if (step.compute) {
    const numericIds = new Set(
      mission.steps.flatMap((s) =>
        s.fields.filter((f) => isNumeric(f.kind)).map((f) => f.id),
      ),
    );
    lines.push(
      ...step.compute((id) =>
        numericIds.has(id) ? parseNumber(answers[id]) : null,
      ),
    );
  }
  return lines;
}

/** Le dossier en texte (Markdown), prêt à garder ou à faire relire. */
export function missionDocument(mission: Mission, record?: MissionRecord) {
  const answers = record?.answers ?? {};
  const out = [
    `# ${mission.title}`,
    "",
    `Dossier fait avec BOUSE — Académie business & IA.`,
  ];
  mission.steps.forEach((step, i) => {
    out.push("", `## ${i + 1}. ${step.title}`);
    if (!record?.done.includes(step.id)) {
      out.push("", "_À faire._");
      return;
    }
    out.push("");
    for (const field of step.fields) {
      const value = answers[field.id]?.trim();
      if (!value) continue;
      out.push(
        `- ${field.label} : ${field.kind === "money" ? euro(parseNumber(value)) : value}`,
      );
    }
    for (const line of stepLines(mission, step, answers))
      out.push(`- **${line.label} : ${line.value}**`);
  });
  out.push(
    "",
    "---",
    "Document d’apprentissage, à vérifier avant tout usage officiel.",
  );
  if (mission.caution) out.push(mission.caution);
  return out.join("\n");
}

/** Le texte à coller dans Claude pour faire relire le dossier. */
export function reviewPrompt(mission: Mission, record?: MissionRecord) {
  return [
    "Tu es mon mentor de l’académie BOUSE (business, finance, IA).",
    "Relis mon dossier ci-dessous, en français et simplement : ce qui est clair, ce qui manque, trois améliorations concrètes. N’invente aucun chiffre ni règle fiscale ; dis-moi quoi vérifier et où (service-public.fr, urssaf.fr, impots.gouv.fr). Pour l’investissement : pédagogie uniquement, aucun conseil ni recommandation de produit.",
    missionDocument(mission, record),
  ].join("\n\n");
}

/** Les compétences utilisées par les étapes validées de toutes les missions. */
export function practicedSkills(state: AppState): Set<string> {
  const out = new Set<string>();
  for (const mission of MISSIONS) {
    const record = state.missions?.[mission.id];
    if (!record) continue;
    for (const step of mission.steps)
      if (record.done.includes(step.id)) step.uses.forEach((id) => out.add(id));
  }
  return out;
}

/** Les missions qui utilisent une compétence. */
export const missionsUsing = (skillId: string) =>
  MISSIONS.filter((m) => m.steps.some((s) => s.uses.includes(skillId)));

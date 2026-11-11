/**
 * Le catalogue dans l'appli (idées 13 et 15 d'Angel) : les domaines choisis,
 * l'état de chaque compétence, et les nœuds de l'arbre. Calcul pur, testé
 * dans tests/catalogueState.test.ts.
 */
import {
  CATALOGUE_DOMAINS,
  CATALOGUE_SKILLS,
  type CatalogueDomain,
  type CatalogueSkill,
} from "../data/catalogue.ts";
import { lessonShortLabels } from "../data/lessonLabels.ts";
import { lessons } from "../data/lessons.ts";

/** Les cinq domaines des premières leçons : proposés à tous au départ. */
export const CORE_DOMAIN_IDS = CATALOGUE_DOMAINS.filter((d) => d.core).map(
  (d) => d.id,
);
const DOMAIN_IDS = new Set(CATALOGUE_DOMAINS.map((d) => d.id));
export const isCatalogueDomain = (id: string) => DOMAIN_IDS.has(id);

export function catalogueDomain(id: string): CatalogueDomain | undefined {
  return CATALOGUE_DOMAINS.find((d) => d.id === id);
}
export function catalogueSkill(id: string): CatalogueSkill | undefined {
  return CATALOGUE_SKILLS.find((s) => s.id === id);
}

/**
 * Les domaines de la personne, dans l'ordre du catalogue. Sans choix
 * enregistré (anciens profils), ce sont les domaines des premières leçons.
 */
export function chosenDomainIds(state: { domains?: string[] }): string[] {
  const picked = new Set((state.domains ?? []).filter(isCatalogueDomain));
  if (!state.domains || picked.size === 0) return [...CORE_DOMAIN_IDS];
  return CATALOGUE_DOMAINS.filter((d) => picked.has(d.id)).map((d) => d.id);
}

/** Ajoute ou retire un domaine ; il en reste toujours au moins un. */
export function toggleDomain(current: string[], id: string): string[] {
  if (!isCatalogueDomain(id)) return current;
  const next = current.includes(id)
    ? current.filter((d) => d !== id)
    : [...current, id];
  if (!next.length) return current;
  return CATALOGUE_DOMAINS.filter((d) => next.includes(d.id)).map((d) => d.id);
}

/**
 * done / retry / open / wait viennent du quiz de la leçon ; « soon » : la
 * compétence est au catalogue mais sa leçon s'écrit encore.
 */
export type SkillStatus = "done" | "retry" | "open" | "wait" | "soon";
export type LessonResult = "passed" | "failed" | undefined;

export function skillStatuses(
  skills: readonly CatalogueSkill[],
  result: (lessonId: string) => LessonResult,
): Record<string, SkillStatus> {
  const out: Record<string, SkillStatus> = {};
  const byId = new Map(CATALOGUE_SKILLS.map((s) => [s.id, s]));
  for (const skill of skills) {
    if (!skill.lesson) {
      out[skill.id] = "soon";
      continue;
    }
    const own = result(skill.lesson);
    if (own) {
      out[skill.id] = own === "passed" ? "done" : "retry";
      continue;
    }
    // Seuls les prérequis qui ont déjà leur leçon peuvent bloquer.
    const blocking = skill.prerequisites
      .map((id) => byId.get(id)?.lesson)
      .filter((id): id is string => !!id);
    out[skill.id] = blocking.every((id) => result(id) === "passed")
      ? "open"
      : "wait";
  }
  return out;
}

/** La prochaine compétence d'un domaine : la première non validée et ouverte. */
export function nextSkill(
  domainId: string,
  statuses: Record<string, SkillStatus>,
): CatalogueSkill | undefined {
  const skills = CATALOGUE_SKILLS.filter((s) => s.domain === domainId);
  return (
    skills.find((s) => statuses[s.id] === "retry") ??
    skills.find((s) => statuses[s.id] === "open") ??
    skills.find((s) => statuses[s.id] === "soon") ??
    skills.find((s) => statuses[s.id] !== "done")
  );
}

export type TreeNode = {
  id: string;
  domain: string;
  prerequisites: string[];
  /** Le nom court affiché dans le nœud. */
  label: string;
  title: string;
  summary: string;
  minutes: number;
  /** La leçon à ouvrir, si elle est écrite. */
  lesson?: string;
  gesture?: string;
};

/** Les nœuds de l'arbre pour les domaines choisis, dans l'ordre du catalogue. */
export function treeNodes(domainIds: readonly string[]): TreeNode[] {
  const lessonById = new Map(lessons.map((l) => [l.id, l]));
  const wanted = CATALOGUE_DOMAINS.filter((d) => domainIds.includes(d.id));
  return wanted.flatMap((domain) =>
    CATALOGUE_SKILLS.filter((s) => s.domain === domain.id).map((skill) => {
      const lesson = skill.lesson ? lessonById.get(skill.lesson) : undefined;
      return {
        id: skill.id,
        domain: skill.domain,
        prerequisites: skill.prerequisites,
        label: lesson
          ? (lessonShortLabels[lesson.id] ?? lesson.title)
          : skill.title,
        title: lesson?.title ?? skill.title,
        summary: lesson?.summary ?? skill.does,
        minutes: lesson?.minutes ?? 10,
        lesson: lesson?.id,
        gesture: skill.gesture,
      };
    }),
  );
}

/** Le nom de chaque branche : celui du domaine, en mots de tous les jours. */
export const DOMAIN_NAMES: Record<string, string> = Object.fromEntries(
  CATALOGUE_DOMAINS.map((d) => [d.id, d.name]),
);

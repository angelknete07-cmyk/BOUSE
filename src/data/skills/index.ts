import type { SkillContent } from "./types";

/** Le contenu des compétences, un fichier par domaine, chargé à la demande. */
const loaders: Record<string, () => Promise<{ skills: SkillContent[] }>> = {
  fp: () => import("./fp"),
  inv: () => import("./inv"),
  papiers: () => import("./papiers"),
  immo: () => import("./immo"),
  psy: () => import("./psy"),
  eco: () => import("./eco"),
  ent: () => import("./ent"),
  fin: () => import("./fin"),
  vente: () => import("./vente"),
  marketing: () => import("./marketing"),
  manager: () => import("./manager"),
  emploi: () => import("./emploi"),
  parole: () => import("./parole"),
  orga: () => import("./orga"),
  droit: () => import("./droit"),
  anglais: () => import("./anglais"),
  ia: () => import("./ia"),
  tableur: () => import("./tableur"),
  nocode: () => import("./nocode"),
  secu: () => import("./secu"),
  contenu: () => import("./contenu"),
};

export async function loadSkillContent(
  domain: string,
  id: string,
): Promise<SkillContent | undefined> {
  const load = loaders[domain];
  if (!load) return undefined;
  const { skills } = await load();
  return skills.find((skill) => skill.id === id);
}

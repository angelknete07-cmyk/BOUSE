/**
 * L'arbre des compétences (idée 7 d'Angel, maquette validée le 11 novembre
 * 2026) : une branche par domaine, lue de gauche à droite, des bases vers les
 * notions avancées. Chaque notion se place sous son prérequis principal (le
 * plus avancé de sa branche), si bien que les liens principaux ne se croisent
 * jamais. Calcul pur, sans dépendance : testé dans tests/skillTree.test.ts.
 */

export type TreeItem = {
  id: string;
  domain: string;
  prerequisites: readonly string[];
};

export const TREE = {
  padX: 36,
  padTop: 28,
  column: 250,
  nodeWidth: 206,
  nodeHeight: 44,
  row: 54,
  laneHead: 58,
  laneGap: 34,
} as const;

/** L'ordre des branches : de l'argent de tous les jours vers l'entreprise et l'IA. */
export const TREE_LANES = [
  "Finance personnelle",
  "Investissement",
  "Finance",
  "Entrepreneuriat",
  "Intelligence artificielle",
] as const;

/** Le nom de chaque branche dit à quoi elle sert, pas sa discipline. */
export const TREE_LANE_NAMES: Record<string, string> = {
  "Finance personnelle": "Ton argent au quotidien",
  Investissement: "Investir",
  Finance: "Les chiffres d’une entreprise",
  Entrepreneuriat: "Créer et faire tourner une activité",
  "Intelligence artificielle": "Se servir de l’IA",
};

export type TreeLane = {
  domain: string;
  top: number;
  height: number;
  ids: string[];
};
export type TreeLink = { from: string; to: string; bridge: boolean };

type Point = { x: number; y: number };

/** Deux segments se coupent-ils ailleurs qu'à leurs bouts ? */
function cross(a: Point, b: Point, c: Point, d: Point) {
  const turn = (p: Point, q: Point, r: Point) =>
    Math.sign((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x));
  return turn(a, b, c) * turn(a, b, d) < 0 && turn(c, d, a) * turn(c, d, b) < 0;
}

function permutations<T>(list: T[]): T[][] {
  if (list.length <= 1) return [list];
  return list.flatMap((item, index) =>
    permutations([...list.slice(0, index), ...list.slice(index + 1)]).map(
      (rest) => [item, ...rest],
    ),
  );
}

export function skillTreeLayout<T extends TreeItem>(items: readonly T[]) {
  const byId = new Map(items.map((item) => [item.id, item]));
  // Un lien déjà sous-entendu par un autre chemin n'est pas redessiné.
  const reaches = (
    from: string,
    to: string,
    seen = new Set<string>(),
  ): boolean => {
    if (from === to) return true;
    if (seen.has(from)) return false;
    seen.add(from);
    return (byId.get(from)?.prerequisites ?? []).some((id) =>
      reaches(id, to, seen),
    );
  };
  const links: TreeLink[] = [];
  for (const item of items)
    for (const from of item.prerequisites) {
      if (!byId.has(from)) continue;
      if (
        item.prerequisites.some(
          (other) => other !== from && byId.has(other) && reaches(other, from),
        )
      )
        continue;
      links.push({
        from,
        to: item.id,
        bridge: byId.get(from)!.domain !== item.domain,
      });
    }

  const positions: Record<string, Point> = {};
  const lanes: TreeLane[] = [];
  const domains = [
    ...TREE_LANES.filter((domain) => items.some((i) => i.domain === domain)),
    // Un domaine ajouté plus tard trouve sa branche à la fin.
    ...new Set(
      items
        .map((item) => item.domain)
        .filter(
          (domain) => !(TREE_LANES as readonly string[]).includes(domain),
        ),
    ),
  ];
  let width = 0;
  let top = TREE.padTop;
  for (const domain of domains) {
    const members = items.filter((item) => item.domain === domain);
    const inside = (item: T) =>
      item.prerequisites.filter((id) => byId.get(id)?.domain === domain);
    const depth: Record<string, number> = {};
    const depthOf = (item: T, seen = new Set<string>()): number => {
      if (depth[item.id] !== undefined) return depth[item.id]!;
      if (seen.has(item.id)) return 0; // garde-fou contre une boucle
      seen.add(item.id);
      const parents = inside(item);
      depth[item.id] = parents.length
        ? 1 + Math.max(...parents.map((id) => depthOf(byId.get(id)!, seen)))
        : 0;
      return depth[item.id]!;
    };
    members.forEach((item) => depthOf(item));
    const laneLinks = links.filter(
      (link) => !link.bridge && byId.get(link.to)!.domain === domain,
    );
    // Parent principal : un des prérequis les plus avancés de la branche.
    const candidates: Record<string, string[]> = {};
    for (const item of members) {
      const parents = inside(item);
      if (!parents.length) continue;
      const deepest = Math.max(...parents.map((id) => depth[id]!));
      candidates[item.id] = parents.filter((id) => depth[id] === deepest);
    }
    const roots = members
      .filter((item) => !inside(item).length)
      .map((i) => i.id);

    // Pose la branche comme un arbre bien rangé : chaque notion au milieu de
    // ses suites, une feuille par rangée.
    const arrange = (
      mains: Record<string, string>,
      order: Record<string, string[]>,
    ) => {
      const children: Record<string, string[]> = {};
      for (const item of members)
        if (mains[item.id]) (children[mains[item.id]!] ||= []).push(item.id);
      for (const id of Object.keys(children))
        if (order[id])
          children[id]!.sort(
            (a, b) => order[id]!.indexOf(a) - order[id]!.indexOf(b),
          );
      const rootOrder = order[""] ?? roots;
      const local: Record<string, Point> = {};
      let row = 0;
      const place = (id: string) => {
        const kids = children[id] || [];
        const x = TREE.padX + depth[id]! * TREE.column;
        if (!kids.length) {
          local[id] = { x, y: TREE.laneHead + row * TREE.row };
          row += 1;
          return;
        }
        kids.forEach(place);
        const first = local[kids[0]!]!.y;
        const last = local[kids[kids.length - 1]!]!.y;
        local[id] = { x, y: (first + last) / 2 };
      };
      rootOrder.forEach(place);
      return { local, rows: row, children };
    };
    const crossings = (local: Record<string, Point>) => {
      const end = (id: string, out: boolean) => ({
        x: local[id]!.x + (out ? TREE.nodeWidth : 0),
        y: local[id]!.y,
      });
      let count = 0;
      for (let i = 0; i < laneLinks.length; i += 1)
        for (let j = i + 1; j < laneLinks.length; j += 1) {
          const a = laneLinks[i]!;
          const b = laneLinks[j]!;
          if (
            cross(
              end(a.from, true),
              end(a.to, false),
              end(b.from, true),
              end(b.to, false),
            )
          )
            count += 1;
        }
      return count;
    };

    // Cherche l'ordre et les parents principaux qui évitent les croisements :
    // les branches sont petites, on peut essayer les possibilités.
    let mains: Record<string, string> = {};
    for (const [id, list] of Object.entries(candidates)) mains[id] = list[0]!;
    let order: Record<string, string[]> = {};
    let best = arrange(mains, order);
    let score = crossings(best.local);
    for (let pass = 0; pass < 2 && score > 0; pass += 1) {
      for (const [id, list] of Object.entries(candidates))
        for (const choice of list) {
          const trial = { ...mains, [id]: choice };
          const result = arrange(trial, order);
          const value = crossings(result.local);
          if (value < score) {
            mains = trial;
            best = result;
            score = value;
          }
        }
      const parents = ["", ...Object.keys(best.children)];
      for (const parent of parents) {
        const kids = parent === "" ? roots : best.children[parent]!;
        if (kids.length < 2 || kids.length > 5) continue;
        for (const permutation of permutations(kids)) {
          const trial = { ...order, [parent]: permutation };
          const result = arrange(mains, trial);
          const value = crossings(result.local);
          if (value < score) {
            order = trial;
            best = result;
            score = value;
          }
        }
      }
    }

    for (const [id, point] of Object.entries(best.local))
      positions[id] = { x: point.x, y: top + point.y };
    const height =
      TREE.laneHead + best.rows * TREE.row - (TREE.row - TREE.nodeHeight) + 22;
    lanes.push({ domain, top, height, ids: members.map((item) => item.id) });
    for (const item of members)
      width = Math.max(
        width,
        positions[item.id]!.x + TREE.nodeWidth + TREE.padX,
      );
    top += height + TREE.laneGap;
  }
  const height = top - TREE.laneGap + TREE.padTop;
  return { positions, lanes, links, width, height };
}

/** Un lien part de la droite d'une notion et arrive à gauche de la suivante. */
export function treeLinkPath(
  a: { x: number; y: number },
  b: { x: number; y: number },
) {
  const x1 = a.x + TREE.nodeWidth;
  const y1 = a.y + TREE.nodeHeight / 2;
  const x2 = b.x - 6;
  const y2 = b.y + TREE.nodeHeight / 2;
  const bend = Math.max(28, (x2 - x1) / 2);
  return `M${x1} ${y1}C${x1 + bend} ${y1},${x2 - bend} ${y2},${x2} ${y2}`;
}

/** Une notion, tout ce qu'elle demande avant et tout ce qu'elle ouvre. */
export function treePath<T extends TreeItem>(items: readonly T[], id: string) {
  const byId = new Map(items.map((item) => [item.id, item]));
  const path = new Set([id]);
  const up = (current: string) =>
    byId.get(current)?.prerequisites.forEach((p) => {
      if (!path.has(p) && byId.has(p)) {
        path.add(p);
        up(p);
      }
    });
  const down = (current: string) =>
    items.forEach((item) => {
      if (item.prerequisites.includes(current) && !path.has(item.id)) {
        path.add(item.id);
        down(item.id);
      }
    });
  up(id);
  down(id);
  return path;
}

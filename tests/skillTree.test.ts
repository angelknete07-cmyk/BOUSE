import test from "node:test";
import assert from "node:assert/strict";
import { lessons } from "../src/data/lessons.ts";
import { TREE, skillTreeLayout, treePath } from "../src/lib/skillTree.ts";

const tree = skillTreeLayout(lessons);

test("chaque notion a sa place dans l'arbre, dans la branche de son domaine", () => {
  for (const lesson of lessons) {
    const point = tree.positions[lesson.id];
    assert.ok(point, lesson.id);
    const lane = tree.lanes.find((item) => item.domain === lesson.domain)!;
    assert.ok(lane.ids.includes(lesson.id), lesson.id);
    assert.ok(
      point.y >= lane.top &&
        point.y + TREE.nodeHeight <= lane.top + lane.height,
      lesson.id,
    );
    assert.ok(point.x + TREE.nodeWidth <= tree.width, lesson.id);
  }
  assert.ok(tree.height >= tree.lanes.at(-1)!.top + tree.lanes.at(-1)!.height);
});

test("deux notions ne se chevauchent jamais", () => {
  const points = Object.entries(tree.positions);
  for (const [a, p] of points)
    for (const [b, q] of points) {
      if (a >= b) continue;
      const apart =
        Math.abs(p.x - q.x) >= TREE.nodeWidth ||
        Math.abs(p.y - q.y) >= TREE.nodeHeight;
      assert.ok(apart, `${a} / ${b}`);
    }
});

test("un lien va toujours de gauche à droite, du prérequis vers la suite", () => {
  for (const link of tree.links) {
    const from = tree.positions[link.from]!;
    const to = tree.positions[link.to]!;
    assert.ok(from.x < to.x, `${link.from} → ${link.to}`);
  }
});

test("les liens principaux d'une branche ne se croisent pas", () => {
  // Deux liens entre les mêmes colonnes se croisent si leurs extrémités
  // s'inversent de haut en bas.
  const inLane = tree.links.filter((link) => !link.bridge);
  for (const a of inLane)
    for (const b of inLane) {
      if (a === b) continue;
      const [a1, a2, b1, b2] = [a.from, a.to, b.from, b.to].map(
        (id) => tree.positions[id]!,
      );
      if (a1!.x !== b1!.x || a2!.x !== b2!.x) continue;
      const crossed = (a1!.y - b1!.y) * (a2!.y - b2!.y) < 0;
      assert.ok(!crossed, `${a.from}→${a.to} croise ${b.from}→${b.to}`);
    }
});

test("un lien sous-entendu par un autre chemin n'est pas redessiné", () => {
  assert.ok(
    !tree.links.some(
      (link) =>
        link.from === "comprendre-llm" && link.to === "automatisation-agent",
    ),
  );
  assert.ok(
    tree.links.some(
      (link) =>
        link.from === "prompt-structure" && link.to === "automatisation-agent",
    ),
  );
  const bridges = tree.links.filter((link) => link.bridge);
  assert.deepEqual(
    bridges.map((link) => `${link.from}→${link.to}`),
    ["seuil-rentabilite→ent-fixer-prix"],
  );
});

test("le chemin d'une notion réunit ses prérequis et ce qu'elle ouvre", () => {
  const path = treePath(lessons, "fp-epargne-precaution");
  for (const id of [
    "fp-epargne-precaution",
    "fp-budget",
    "fp-credit-taux",
    "fp-retraite",
    "fp-logement",
  ])
    assert.ok(path.has(id), id);
  assert.ok(!path.has("fp-impot-revenu"));
});

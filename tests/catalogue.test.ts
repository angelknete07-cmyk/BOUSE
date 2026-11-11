import test from "node:test";
import assert from "node:assert/strict";
import { lessons } from "../src/data/lessons.ts";
import { CATALOGUE_DOMAINS, CATALOGUE_SKILLS } from "../src/data/catalogue.ts";
import { skillTreeLayout } from "../src/lib/skillTree.ts";

const ids = new Set(CATALOGUE_SKILLS.map((skill) => skill.id));

test("chaque compétence a un identifiant unique et un domaine connu", () => {
  assert.equal(ids.size, CATALOGUE_SKILLS.length);
  const domains = new Set(CATALOGUE_DOMAINS.map((domain) => domain.id));
  for (const skill of CATALOGUE_SKILLS)
    assert.ok(domains.has(skill.domain), skill.id);
  for (const domain of CATALOGUE_DOMAINS)
    assert.ok(
      CATALOGUE_SKILLS.some(
        (skill) => skill.domain === domain.id && skill.level === 0,
      ),
      `${domain.id} commence par Découvrir`,
    );
});

test("les prérequis existent et viennent d'un niveau inférieur ou égal", () => {
  const byId = new Map(CATALOGUE_SKILLS.map((skill) => [skill.id, skill]));
  for (const skill of CATALOGUE_SKILLS)
    for (const id of skill.prerequisites) {
      assert.ok(byId.has(id), `${skill.id} ← ${id}`);
      assert.ok(byId.get(id)!.level <= skill.level, `${skill.id} ← ${id}`);
    }
});

test("les 43 leçons écrites ont toutes leur place dans le catalogue", () => {
  const covered = new Set(
    CATALOGUE_SKILLS.flatMap((skill) => skill.lesson ?? []),
  );
  for (const lesson of lessons) assert.ok(covered.has(lesson.id), lesson.id);
  for (const skill of CATALOGUE_SKILLS)
    if (skill.lesson)
      assert.equal(
        skill.id,
        skill.lesson,
        "même identifiant que la leçon : la progression se garde",
      );
});

test("l'arbre de tout le catalogue se dessine sans croisement dans une branche", () => {
  const tree = skillTreeLayout(CATALOGUE_SKILLS);
  for (const skill of CATALOGUE_SKILLS)
    assert.ok(tree.positions[skill.id], skill.id);
  const inLane = tree.links.filter((link) => !link.bridge);
  for (const a of inLane)
    for (const b of inLane) {
      if (a === b) continue;
      const [a1, a2, b1, b2] = [a.from, a.to, b.from, b.to].map(
        (id) => tree.positions[id]!,
      );
      if (a1!.x !== b1!.x || a2!.x !== b2!.x) continue;
      assert.ok(
        (a1!.y - b1!.y) * (a2!.y - b2!.y) >= 0,
        `${a.from}→${a.to} croise ${b.from}→${b.to}`,
      );
    }
});

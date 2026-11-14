import test from "node:test";
import assert from "node:assert/strict";
import { CATALOGUE_SKILLS } from "../src/data/catalogue.ts";
import { isReady, nextSkill } from "../src/lib/catalogue.ts";
import {
  knownSkills,
  levelName,
  placementOver,
  placementRecord,
  placementResult,
  placementSkills,
  type PlacementQuestion,
} from "../src/lib/placement.ts";
import { emptyState, parseState } from "../src/lib/storage.ts";

const q = (skillId: string, level: 0 | 1 | 2 | 3): PlacementQuestion => ({
  skillId,
  level,
  question: skillId,
  options: ["a", "b", "c"],
  answer: 0,
});
const questions = [
  q("a1", 0),
  q("a2", 0),
  q("b1", 1),
  q("b2", 1),
  q("b3", 1),
  q("c1", 2),
];

test("les compétences du test vont du niveau le plus simple au plus avancé", () => {
  const skills = placementSkills("fp", isReady);
  assert.equal(
    skills.length,
    CATALOGUE_SKILLS.filter((s) => s.domain === "fp").length,
  );
  for (let i = 1; i < skills.length; i++)
    assert.ok(skills[i]!.level >= skills[i - 1]!.level);
  assert.ok(skills.every((s) => s.domain === "fp"));
});

test("le test s'arrête après deux ratés dans un même niveau, pas avant", () => {
  assert.equal(placementOver(questions, [0, 0, 1]), false);
  // « Je ne sais pas » compte comme un raté.
  assert.equal(placementOver(questions, [0, 0, 1, null]), true);
  // Un raté par niveau ne suffit pas à arrêter.
  assert.equal(placementOver(questions, [1, 0, 1, 0, 0]), false);
  assert.equal(placementOver(questions, [0, 0, 0, 0, 0, 0]), true);
});

test("le résultat : sues, ratées, pas testées, et le niveau où commencer", () => {
  const result = placementResult(questions, [0, 0, 1, 0, null]);
  assert.deepEqual(result.known, ["a1", "a2", "b2"]);
  assert.deepEqual(result.missed, ["b1", "b3"]);
  assert.deepEqual(result.untested, ["c1"]);
  assert.equal(result.startLevel, 1);
  assert.equal(levelName(result.startLevel), "Savoir faire");
  assert.equal(result.correct, 3);
  assert.equal(result.asked, 5);

  const all = placementResult(questions, [0, 0, 0, 0, 0, 0]);
  assert.equal(all.startLevel, null);
  assert.equal(levelName(all.startLevel), "Tout le domaine");
});

test("la suite saute les compétences déjà sues, sans les valider", () => {
  const skills = CATALOGUE_SKILLS.filter((s) => s.domain === "fp");
  const statuses = Object.fromEntries(
    skills.map((s) => [s.id, "open" as const]),
  );
  const first = nextSkill("fp", statuses)!;
  const known = new Set([first.id]);
  const after = nextSkill("fp", statuses, known)!;
  assert.notEqual(after.id, first.id);
  // Tout su : on retombe sur la première non validée.
  assert.equal(
    nextSkill("fp", statuses, new Set(skills.map((s) => s.id)))!.id,
    first.id,
  );
  // Une compétence à reprendre reste prioritaire.
  const retry = { ...statuses, [first.id]: "retry" as const };
  assert.equal(nextSkill("fp", retry, known)!.id, first.id);
});

test("le test de niveau se sauvegarde et se relit, les données abîmées sont refusées", () => {
  const result = placementResult(questions, [0, 1, 1]);
  const placements = {
    fp: placementRecord(result, new Date("2026-11-14T10:00:00.000Z")),
  };
  const state = parseState(JSON.stringify({ ...emptyState, placements }));
  assert.deepEqual(state.placements, placements);
  assert.deepEqual([...knownSkills(state)], ["a1"]);
  for (const bad of [
    [],
    { fp: { at: "hier", known: [], missed: [] } },
    { fp: { at: "2026-11-14T10:00:00.000Z", known: "a1", missed: [] } },
    { fp: { at: "2026-11-14T10:00:00.000Z", known: [3], missed: [] } },
  ])
    assert.throws(
      () => parseState(JSON.stringify({ ...emptyState, placements: bad })),
      /Tests de niveau invalides/,
    );
});

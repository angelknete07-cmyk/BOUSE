import test from "node:test";
import assert from "node:assert/strict";
import { CATALOGUE_SKILLS } from "../src/data/catalogue.ts";
import { MISSIONS } from "../src/data/missions.ts";
import {
  completeStep,
  currentStepIndex,
  findMission,
  isFinished,
  missionDocument,
  parseNumber,
  practicedSkills,
  restartMission,
  saveAnswers,
  stepLines,
  stepProblems,
} from "../src/lib/missions.ts";
import { emptyState, parseState } from "../src/lib/storage.ts";

const now = new Date("2026-11-12T10:00:00Z");
const skillIds = new Set(CATALOGUE_SKILLS.map((s) => s.id));

test("chaque mission est bien formée et relie de vraies compétences", () => {
  assert.equal(MISSIONS.length, 4);
  assert.equal(new Set(MISSIONS.map((m) => m.id)).size, MISSIONS.length);
  for (const mission of MISSIONS) {
    assert.ok(
      mission.steps.length >= 5 && mission.steps.length <= 6,
      mission.id,
    );
    assert.equal(
      new Set(mission.steps.map((s) => s.id)).size,
      mission.steps.length,
    );
    const fieldIds = mission.steps.flatMap((s) => s.fields.map((f) => f.id));
    assert.equal(
      new Set(fieldIds).size,
      fieldIds.length,
      `${mission.id} : champs en double`,
    );
    for (const step of mission.steps) {
      assert.ok(step.hint.length >= 40 && step.hint.length <= 220, step.id);
      assert.ok(step.fields.length >= 2 && step.fields.length <= 6, step.id);
      assert.ok(step.uses.length >= 1, step.id);
      for (const id of step.uses)
        assert.ok(skillIds.has(id), `${step.id} → ${id}`);
      for (const field of step.fields) assert.ok(field.example, field.id);
    }
  }
});

test("les nombres se lisent à la française", () => {
  assert.equal(parseNumber("1 650"), 1650);
  assert.equal(parseNumber("1 650,50 €"), 1650.5);
  assert.equal(parseNumber("0,5 %"), 0.5);
  assert.equal(parseNumber("0"), 0);
  assert.equal(parseNumber("douze"), null);
  assert.equal(parseNumber(""), null);
});

test("une étape demande ses champs obligatoires et de vrais nombres", () => {
  const devis = findMission("micro-entreprise")!.steps.find(
    (s) => s.id === "devis",
  )!;
  assert.equal(stepProblems(devis, {}).length, 4);
  const ok = {
    client: "Café",
    p1: "Photo",
    m1: "90",
    validite: "fin novembre",
  };
  assert.deepEqual(stepProblems(devis, ok), []);
  assert.match(stepProblems(devis, { ...ok, m1: "beaucoup" })[0]!, /un nombre/);
});

test("les totaux et calculs suivent les réponses", () => {
  const budget = findMission("budget-annee")!;
  const answers = {
    salaire: "1 650",
    autres: "0",
    loyer: "620",
    energie: "95",
    assurances: "40",
    transport: "75",
    abonnements: "30",
    courses: "280",
    loisirs: "120",
    divers: "60",
    epargne: "200",
    deja: "800",
    mois: "3",
  };
  const step = (id: string) => budget.steps.find((s) => s.id === id)!;
  assert.deepEqual(stepLines(budget, step("fixes"), answers), [
    { label: "Total des dépenses fixes", value: "860 €" },
  ]);
  const reste = stepLines(budget, step("reste"), answers);
  assert.equal(reste[0]!.value, "330 €");
  assert.equal(reste[1]!.value, "2 400 €");
  assert.equal(reste[2]!.value, "130 €");
  const matelas = stepLines(budget, step("precaution"), answers);
  assert.equal(matelas[0]!.value, "3 960 €");
  assert.equal(matelas[2]!.value, "16 mois");
  // Sans réponses : aucun chiffre inventé.
  assert.ok(
    stepLines(budget, step("reste"), {}).every((l) => l.value.startsWith("—")),
  );

  const micro = findMission("micro-entreprise")!;
  const prix = micro.steps.find((s) => s.id === "prix")!;
  const lines = stepLines(micro, prix, {
    net: "1500",
    frais: "150",
    taux: "25",
    heures: "60",
  });
  assert.deepEqual(
    lines.map((l) => l.value),
    ["2 200 €", "37 €"],
  );
});

test("progression, dossier et compétences mises en pratique", () => {
  const micro = findMission("micro-entreprise")!;
  let state = saveAnswers(emptyState, micro.id, { offre: "Photos" }, now);
  assert.equal(currentStepIndex(micro, state.missions![micro.id]), 0);
  state = completeStep(state, micro.id, "idee", now);
  state = completeStep(state, micro.id, "idee", now);
  assert.deepEqual(state.missions![micro.id]!.done, ["idee"]);
  assert.equal(currentStepIndex(micro, state.missions![micro.id]), 1);
  assert.ok(practicedSkills(state).has("ent-idee"));
  assert.ok(!practicedSkills(state).has("ent-devis"));
  const doc = missionDocument(micro, state.missions![micro.id]);
  assert.match(doc, /Ce que tu proposes : Photos/);
  assert.match(doc, /## 2\. Ton prix\n\n_À faire\._/);
  for (const step of micro.steps)
    state = completeStep(state, micro.id, step.id, now);
  assert.ok(isFinished(micro, state.missions![micro.id]));
  assert.equal(state.missions![micro.id]!.finishedAt, now.toISOString());
  assert.deepEqual(
    state.missions![micro.id]!.done,
    micro.steps.map((s) => s.id),
  );
  assert.equal(restartMission(state, micro.id).missions![micro.id], undefined);
});

test("la sauvegarde garde les missions et refuse le reste", () => {
  const missions = {
    "budget-annee": {
      answers: { salaire: "1650" },
      done: ["revenus"],
      startedAt: now.toISOString(),
    },
  };
  assert.deepEqual(
    parseState(JSON.stringify({ ...emptyState, missions })).missions,
    missions,
  );
  for (const bad of [
    [],
    { x: { answers: {}, done: "revenus", startedAt: "" } },
    { x: { answers: { a: 3 }, done: [], startedAt: "" } },
    { x: { answers: {}, done: ["a", "a"], startedAt: "" } },
  ])
    assert.throws(
      () => parseState(JSON.stringify({ ...emptyState, missions: bad })),
      /Missions invalides/,
    );
});

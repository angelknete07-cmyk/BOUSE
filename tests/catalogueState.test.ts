import test from "node:test";
import assert from "node:assert/strict";
import { CATALOGUE_SKILLS } from "../src/data/catalogue.ts";
import {
  CORE_DOMAIN_IDS,
  chosenDomainIds,
  nextSkill,
  skillStatuses,
  toggleDomain,
  treeNodes,
} from "../src/lib/catalogue.ts";
import { emptyState, parseState } from "../src/lib/storage.ts";

test("sans choix, on part des domaines des premières leçons", () => {
  assert.deepEqual(chosenDomainIds({}), CORE_DOMAIN_IDS);
  assert.deepEqual(chosenDomainIds({ domains: [] }), CORE_DOMAIN_IDS);
  // Un domaine inconnu (lien ancien, autre version) est ignoré.
  assert.deepEqual(chosenDomainIds({ domains: ["ia", "zzz"] }), ["ia"]);
  // Toujours dans l'ordre du catalogue.
  assert.deepEqual(chosenDomainIds({ domains: ["ia", "fp"] }), ["fp", "ia"]);
});

test("ajouter ou retirer un domaine en garde toujours un", () => {
  assert.deepEqual(toggleDomain(["fp"], "papiers"), ["fp", "papiers"]);
  assert.deepEqual(toggleDomain(["fp", "papiers"], "fp"), ["papiers"]);
  assert.deepEqual(toggleDomain(["fp"], "fp"), ["fp"]);
  assert.deepEqual(toggleDomain(["fp"], "inconnu"), ["fp"]);
});

test("l'état d'une compétence suit le quiz de sa leçon", () => {
  const statuses = skillStatuses(CATALOGUE_SKILLS, (id) =>
    id === "fp-budget"
      ? "passed"
      : id === "fp-epargne-precaution"
        ? "failed"
        : undefined,
  );
  assert.equal(statuses["fp-budget"], "done");
  assert.equal(statuses["fp-epargne-precaution"], "retry");
  // Sans leçon écrite : « bientôt », jamais bloquant pour la suite.
  const soon = CATALOGUE_SKILLS.find((s) => !s.lesson)!;
  assert.equal(statuses[soon.id], "soon");
  for (const skill of CATALOGUE_SKILLS.filter((s) => s.lesson))
    assert.ok(["done", "retry", "open", "wait"].includes(statuses[skill.id]!));
  // Une base avec sa leçon est ouverte d'emblée.
  const fresh = skillStatuses(CATALOGUE_SKILLS, () => undefined);
  assert.equal(fresh["fp-budget"], "open");
  assert.equal(nextSkill("fp", fresh)?.id, "fp-budget");
  assert.equal(nextSkill("fp", statuses)?.id, "fp-epargne-precaution");
});

test("l'arbre reprend les compétences des domaines choisis, leçons comprises", () => {
  const nodes = treeNodes(["fp", "papiers"]);
  assert.equal(
    nodes.length,
    CATALOGUE_SKILLS.filter((s) => s.domain === "fp" || s.domain === "papiers")
      .length,
  );
  const budget = nodes.find((n) => n.id === "fp-budget")!;
  assert.equal(budget.label, "Budget");
  assert.equal(budget.lesson, "fp-budget");
  assert.ok(
    nodes.filter((n) => n.domain === "papiers").every((n) => !n.lesson),
  );
});

test("la sauvegarde garde les domaines choisis et refuse le reste", () => {
  const base = emptyState;
  assert.deepEqual(
    parseState(JSON.stringify({ ...base, domains: ["fp", "ia"] })).domains,
    ["fp", "ia"],
  );
  assert.equal(parseState(JSON.stringify(base)).domains, undefined);
  for (const domains of ["fp", [1], ["fp", "fp"], Array(41).fill("x")])
    assert.throws(
      () => parseState(JSON.stringify({ ...base, domains })),
      /Domaines choisis invalides/,
    );
});

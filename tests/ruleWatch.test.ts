import test from "node:test";
import assert from "node:assert/strict";
import { DATED_RULES } from "../src/data/datedRules.ts";
import { lessons } from "../src/data/lessons.ts";
import {
  alertKey,
  isStale,
  markRulesSeen,
  recentChanges,
  ruleAlerts,
  rulesForLesson,
} from "../src/lib/ruleWatch.ts";
import { emptyState, parseState } from "../src/lib/storage.ts";
import type { Attempt } from "../src/lib/types.ts";

/* Idée 33 : contenu daté et vérifié, alerte quand une règle change. */

const attempt = (lessonId: string, at: string, passed = true): Attempt => ({
  lessonId,
  answers: {},
  correct: 3,
  total: 3,
  percent: 100,
  passed,
  at,
});

test("chaque règle datée vient d'une vraie leçon et sa valeur y figure", () => {
  const ids = new Set(DATED_RULES.map((r) => r.id));
  assert.equal(ids.size, DATED_RULES.length);
  for (const rule of DATED_RULES) {
    const lesson = lessons.find((l) => l.id === rule.lesson);
    assert.ok(lesson, `leçon ${rule.lesson}`);
    const text = JSON.stringify(lesson).replace(/ | /g, " ");
    // Le premier chiffre de la règle doit être écrit dans la leçon.
    const figure = rule.now.match(/\d[\d  ,]*(?:\s?%|\s?€)?/)?.[0]?.trim();
    if (figure) assert.ok(text.includes(figure), `${rule.id} : « ${figure} » absent de la leçon`);
    assert.match(rule.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(rule.where.url, /^https:\/\//);
  }
});

test("une règle changée après la leçon réussie déclenche une alerte", () => {
  const rule = DATED_RULES.find((r) => r.id === "pfu")!;
  const before = { attempts: [attempt(rule.lesson, "2026-10-01T10:00:00Z")], seenRules: [] };
  assert.deepEqual(
    ruleAlerts(before).map((r) => r.id),
    ["pfu", "prelevements-sociaux"],
  );
  // Leçon faite après la mise à jour, ou ratée : pas d'alerte.
  assert.deepEqual(ruleAlerts({ attempts: [attempt(rule.lesson, "2026-11-20T10:00:00Z")] }), []);
  assert.deepEqual(
    ruleAlerts({ attempts: [attempt(rule.lesson, "2026-10-01T10:00:00Z", false)] }),
    [],
  );
  // « C'est noté » : l'alerte disparaît, mais revient si la règle change encore.
  const seen = markRulesSeen(before, ruleAlerts(before));
  assert.deepEqual(ruleAlerts(seen), []);
  const again = [{ ...rule, changedAt: "2027-01-15" }];
  assert.deepEqual(
    ruleAlerts({ ...seen, attempts: [attempt(rule.lesson, "2026-12-01T10:00:00Z")] }, again).map(
      (r) => alertKey(r),
    ),
    ["pfu@2027-01-15"],
  );
});

test("vérifiée il y a plus d'un an : à revérifier ; changée cette année : « Mis à jour »", () => {
  const rule = DATED_RULES[0]!;
  assert.equal(isStale(rule, new Date("2027-06-01")), false);
  assert.equal(isStale(rule, new Date("2027-11-10")), true);
  assert.equal(recentChanges(rule.lesson, new Date("2026-12-01")).length, 2);
  assert.equal(recentChanges(rule.lesson, new Date("2028-01-01")).length, 0);
  assert.equal(rulesForLesson("ca-marge-tresorerie").length, 0);
});

test("les alertes vues se sauvegardent", () => {
  const state = parseState(JSON.stringify({ ...emptyState, seenRules: ["pfu@2026-11-06"] }));
  assert.deepEqual(state.seenRules, ["pfu@2026-11-06"]);
  assert.throws(() => parseState(JSON.stringify({ ...emptyState, seenRules: [3] })));
});

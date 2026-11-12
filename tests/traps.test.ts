import test from "node:test";
import assert from "node:assert/strict";
import {
  buildTraps,
  foiledTraps,
  trapsToFoil,
  trapWhen,
  type TrapQuiz,
} from "../src/lib/traps.ts";
import type { Attempt } from "../src/lib/types.ts";

const quiz: TrapQuiz = {
  id: "budget",
  version: "1.0.0",
  kind: "lesson",
  title: "Faire son budget",
  questions: [
    { key: "a", question: "Q A", options: ["x", "y"], answer: 1, why: "A" },
    { key: "b", question: "Q B", options: ["x", "y"], answer: 0, why: "B" },
    { key: "c", question: "Q C", options: ["x", "y"], answer: 0, why: "C" },
  ],
};
const skill: TrapQuiz = {
  id: "fp-dette",
  version: "competence-1",
  kind: "skill",
  title: "Sortir d’une dette",
  questions: [
    {
      key: "q0",
      question: "Avalanche ?",
      options: ["p", "t"],
      answer: 1,
      why: "W",
    },
  ],
};

function attempt(
  lessonId: string,
  answers: Record<string, number>,
  correct: number,
  at: string,
  lessonVersion = "1.0.0",
): Attempt {
  const total = Object.keys(answers).length;
  return {
    lessonId,
    lessonVersion,
    answers,
    correct,
    total,
    percent: Math.round((correct / total) * 100),
    passed: correct / total >= 0.8,
    at,
  };
}
const now = new Date("2026-11-12T12:00:00.000Z");

test("une question ratée devient un piège, avec la mauvaise réponse et le pourquoi", () => {
  const traps = buildTraps(
    [quiz],
    [attempt("budget", { a: 0, b: 0, c: 0 }, 2, "2026-11-10T10:00:00.000Z")],
    now,
  );
  assert.equal(traps.length, 1);
  assert.equal(traps[0].question, "Q A");
  assert.equal(traps[0].lastWrong, 0);
  assert.equal(traps[0].answer, 1);
  assert.equal(traps[0].why, "A");
  assert.equal(traps[0].solved, false);
  assert.equal(traps[0].wrongCount, 1);
});

test("réussie au quiz suivant : le piège est déjoué, le compte reste", () => {
  const traps = buildTraps(
    [quiz],
    [
      attempt("budget", { a: 0, b: 1, c: 0 }, 1, "2026-11-08T10:00:00.000Z"),
      attempt("budget", { a: 1, b: 1, c: 0 }, 2, "2026-11-10T10:00:00.000Z"),
    ],
    now,
  );
  const a = traps.find((t) => t.id === "budget:a")!;
  const b = traps.find((t) => t.id === "budget:b")!;
  assert.equal(a.solved, true);
  assert.equal(a.wrongCount, 1);
  assert.equal(b.solved, false);
  assert.equal(b.wrongCount, 2);
  assert.deepEqual(
    trapsToFoil(traps).map((t) => t.id),
    ["budget:b"],
  );
  assert.deepEqual(
    foiledTraps(traps).map((t) => t.id),
    ["budget:a"],
  );
  // Les plus ratés d'abord.
  assert.equal(traps[0].id, "budget:b");
});

test("l'ordre des tentatives suit leur date, pas l'ordre du fichier", () => {
  const traps = buildTraps(
    [quiz],
    [
      attempt("budget", { a: 1, b: 0, c: 0 }, 3, "2026-11-10T10:00:00.000Z"),
      attempt("budget", { a: 0, b: 0, c: 0 }, 2, "2026-11-08T10:00:00.000Z"),
    ],
    now,
  );
  assert.equal(traps[0].solved, true);
});

test("aucune tentative ou que des bonnes réponses : aucun piège inventé", () => {
  assert.deepEqual(buildTraps([quiz], [], now), []);
  assert.deepEqual(
    buildTraps(
      [quiz],
      [attempt("budget", { a: 1, b: 0, c: 0 }, 3, "2026-11-10T10:00:00.000Z")],
      now,
    ),
    [],
  );
});

test("une ancienne version de la leçon ou une date future est ignorée", () => {
  assert.deepEqual(
    buildTraps(
      [quiz],
      [
        attempt(
          "budget",
          { a: 0, b: 0, c: 0 },
          2,
          "2026-11-10T10:00:00.000Z",
          "0.9.0",
        ),
        attempt("budget", { a: 0, b: 0, c: 0 }, 2, "2026-12-10T10:00:00.000Z"),
      ],
      now,
    ),
    [],
  );
});

test("les contrôles des compétences courtes comptent aussi", () => {
  const traps = buildTraps(
    [quiz, skill],
    [
      attempt(
        "fp-dette",
        { q0: 0 },
        0,
        "2026-11-11T10:00:00.000Z",
        "competence-1",
      ),
    ],
    now,
  );
  assert.equal(traps.length, 1);
  assert.equal(traps[0].kind, "skill");
  assert.equal(traps[0].title, "Sortir d’une dette");
});

test("dates lisibles", () => {
  assert.equal(trapWhen("2026-11-12T08:00:00.000Z", now), "aujourd’hui");
  assert.equal(trapWhen("2026-11-11T08:00:00.000Z", now), "hier");
  assert.equal(trapWhen("2026-11-09T08:00:00.000Z", now), "il y a 3 jours");
  assert.equal(trapWhen("2026-10-01T08:00:00.000Z", now), "1 octobre");
});

import test from "node:test";
import assert from "node:assert/strict";
import { lessons } from "../src/data/lessons.ts";
import {
  EXPLAIN_MODES,
  explainContext,
  explainHandoff,
  explainQuestion,
} from "../src/lib/explainOtherwise.ts";
import { validateMentorRequest } from "../supabase/functions/_shared/mentorContract.ts";

/* Idée 17 : « Explique-moi autrement » (image, exemple, plus simple). */

test("trois façons d'expliquer, chacune avec sa consigne", () => {
  assert.deepEqual(
    EXPLAIN_MODES.map((m) => m.id),
    ["image", "exemple", "simple"],
  );
  const lesson = lessons.find((l) => l.id === "fp-budget")!;
  assert.match(explainQuestion(lesson, 0, "image"), /comparaison/);
  assert.match(explainQuestion(lesson, 0, "exemple"), /étapes numérotées/);
  assert.match(explainQuestion(lesson, 0, "simple"), /sans jargon/);
  assert.match(explainQuestion(lesson, 1, "simple"), new RegExp(lesson.sections[1]!.title));
  // Jamais de chiffre inventé présenté comme vrai.
  assert.match(explainQuestion(lesson, 0, "exemple"), /fictifs/);
});

test("chaque demande, pour chaque partie de chaque leçon, passe le contrat du mentor", () => {
  for (const lesson of lessons)
    for (let i = 0; i < lesson.sections.length; i++)
      for (const mode of EXPLAIN_MODES) {
        const request = validateMentorRequest({
          lessonId: lesson.id,
          question: explainQuestion(lesson, i, mode.id),
          history: [],
          context: explainContext(lesson, i),
        });
        assert.equal(typeof request, "object", `${lesson.id} ${i} ${mode.id} : ${request}`);
      }
});

test("sans compte, le texte à coller contient le passage et la demande", () => {
  const lesson = lessons[0]!;
  const text = explainHandoff(lesson, 1, "image");
  assert.match(text, /BOOST/);
  assert.ok(text.includes(lesson.sections[1]!.body[0]!.slice(0, 40)));
  assert.match(text, /## Ma demande/);
});

import test from "node:test";
import assert from "node:assert/strict";
import { lessons } from "../src/data/lessons.ts";
import { lessonContext } from "../src/lib/mentorContext.ts";
import {
  validateMentorRequest,
  mentorLimits,
} from "../supabase/functions/_shared/mentorContract.ts";

test("every lesson yields a context the server contract accepts", () => {
  for (const lesson of lessons) {
    const context = lessonContext(lesson);
    assert.ok(context.length > 0, lesson.id);
    assert.ok(context.length <= mentorLimits.contextDocuments);
    const result = validateMentorRequest({
      lessonId: lesson.id,
      question: "Peux-tu reformuler ?",
      history: [],
      context,
    });
    assert.notEqual(typeof result, "string", `${lesson.id}: ${String(result)}`);
  }
});

test("context titles name the lesson and the section they come from", () => {
  const lesson = lessons.find((item) => item.id === "inv-interets-composes")!;
  const context = lessonContext(lesson);
  assert.ok(context[0]!.title.startsWith(lesson.title));
  assert.ok(context.some((item) => item.title.includes(lesson.example.title)));
});

test("the hand-off prompt carries the rules, the lesson excerpts and the question", async () => {
  const { claudeHandoffPrompt } = await import("../src/lib/mentorContext.ts");
  const lesson = lessons.find((item) => item.id === "inv-ordres-biais")!;
  const prompt = claudeHandoffPrompt(lesson, "  C’est quoi le spread ?  ");
  assert.match(prompt, /aucun conseil/);
  assert.ok(prompt.includes(lesson.title));
  assert.ok(prompt.includes(lesson.sections[0]!.title));
  assert.ok(prompt.trimEnd().endsWith("C’est quoi le spread ?"));
});

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

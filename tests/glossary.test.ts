import test from "node:test";
import assert from "node:assert/strict";
import { glossary, glossaryCategories } from "../src/data/investingGlossary.ts";
import { lessons } from "../src/data/lessons.ts";

test("glossary terms are unique, categorised and linked to an existing lesson", () => {
  const ids = glossary.map((entry) => entry.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(
    new Set(glossary.map((entry) => entry.term)).size,
    glossary.length,
  );
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  for (const entry of glossary) {
    assert.ok(glossaryCategories.includes(entry.category), entry.id);
    assert.ok(lessonIds.has(entry.lessonId), `${entry.id} → ${entry.lessonId}`);
    assert.ok(entry.definition.trim().length > 20, entry.id);
  }
});

test("every glossary category is used", () => {
  for (const category of glossaryCategories)
    assert.ok(
      glossary.some((entry) => entry.category === category),
      category,
    );
});

import test from "node:test";
import assert from "node:assert/strict";
import { lessons } from "../src/data/lessons.ts";

test("the catalogue contains foundations, personal finance and investing lessons, all substantial", () => {
  assert.equal(lessons.length, 43);
  assert.equal(
    lessons.filter((lesson) => lesson.domain === "Intelligence artificielle")
      .length,
    7,
  );
  assert.equal(
    lessons.filter((lesson) => lesson.domain === "Finance").length,
    7,
  );
  assert.equal(
    lessons.filter((lesson) => lesson.domain === "Entrepreneuriat").length,
    9,
  );
  assert.equal(
    lessons.filter((lesson) => lesson.domain === "Finance personnelle").length,
    9,
  );
  assert.equal(
    lessons.filter((lesson) => lesson.domain === "Investissement").length,
    11,
  );
  for (const lesson of lessons) {
    assert.ok(lesson.title.trim());
    assert.ok(lesson.summary.trim());
    assert.ok(lesson.minutes > 0);
    assert.ok(lesson.skills.length > 0);
    assert.ok(lesson.sections.length > 0);
    assert.ok(
      lesson.sections.every(
        (section) => section.title.trim() && section.body.length > 0,
      ),
    );
    assert.ok(lesson.version.trim());
    assert.ok(lesson.editorialStatus.trim());
    assert.ok(lesson.application.trim());
    assert.ok(lesson.exercise.prompt.trim());
    assert.ok(lesson.exercise.hint.trim());
    assert.ok(lesson.exercise.explanation.trim());
    assert.ok(lesson.flashcards.length > 0);
  }
});

test("lesson and quiz identifiers are unique and stable enough to store progress", () => {
  const lessonIds = lessons.map((lesson) => lesson.id);
  assert.ok(lessonIds.every((id) => id.trim()));
  assert.equal(new Set(lessonIds).size, lessonIds.length);
  const questionIds = lessons.flatMap((lesson) =>
    lesson.quiz.map((question) => question.id),
  );
  assert.ok(questionIds.every((id) => id.trim()));
  assert.equal(new Set(questionIds).size, questionIds.length);
});

test("each lesson has two usable assessment questions with valid answer indexes", () => {
  for (const lesson of lessons) {
    assert.equal(lesson.quiz.length, 2);
    for (const question of lesson.quiz) {
      assert.ok(question.question.trim());
      assert.ok(question.explanation.trim());
      assert.ok(question.options.length >= 2);
      assert.equal(new Set(question.options).size, question.options.length);
      assert.ok(question.options.every((option) => option.trim()));
      assert.ok(Number.isInteger(question.answer));
      assert.ok(
        question.answer >= 0 && question.answer < question.options.length,
      );
    }
  }
});

test("all prerequisite references resolve to another lesson in the catalogue", () => {
  const ids = new Set(lessons.map((lesson) => lesson.id));
  for (const lesson of lessons) {
    for (const prerequisite of lesson.prerequisites) {
      assert.ok(
        ids.has(prerequisite),
        `${lesson.id}: missing prerequisite ${prerequisite}`,
      );
      assert.notEqual(prerequisite, lesson.id);
    }
  }
});

test("prerequisite graph has no cycles, so every lesson can be unlocked", () => {
  const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const completed = new Set<string>();
  const visiting = new Set<string>();
  function visit(id: string) {
    if (completed.has(id)) return;
    assert.ok(!visiting.has(id), `Prerequisite cycle at ${id}`);
    visiting.add(id);
    const lesson = byId.get(id);
    assert.ok(lesson, `Missing lesson ${id}`);
    for (const prerequisite of lesson.prerequisites) visit(prerequisite);
    visiting.delete(id);
    completed.add(id);
  }
  for (const lesson of lessons) visit(lesson.id);
  assert.equal(completed.size, lessons.length);
});

test("every lesson includes named HTTPS source references", () => {
  for (const lesson of lessons) {
    assert.ok(lesson.sources.length > 0);
    for (const source of lesson.sources) {
      assert.ok(source.title.trim());
      const url = new URL(source.url);
      assert.equal(url.protocol, "https:");
      assert.ok(url.hostname.includes("."));
      assert.equal(url.username, "");
      assert.equal(url.password, "");
    }
  }
});

test("investing lessons stay educational: fictitious examples and an explicit no-advice status", () => {
  const investing = lessons.filter(
    (lesson) => lesson.domain === "Investissement",
  );
  for (const lesson of investing) {
    assert.match(lesson.example.title, /fictif/i, lesson.id);
    assert.match(lesson.editorialStatus, /aucun conseil en investissement/);
    assert.ok(
      lesson.sources.some((source) =>
        new URL(source.url).hostname.endsWith("amf-france.org"),
      ),
      `${lesson.id} cites the AMF`,
    );
  }
});

test("the first investing module is a single prerequisite chain starting from the markets lesson", () => {
  const investing = lessons
    .filter((lesson) => lesson.domain === "Investissement")
    .slice(0, 5);
  assert.deepEqual(investing[0]!.prerequisites, []);
  for (let index = 1; index < investing.length; index++) {
    assert.deepEqual(investing[index]!.prerequisites, [
      investing[index - 1]!.id,
    ]);
  }
});

test("personal finance lessons stay educational; the first module forms a chain", () => {
  const personal = lessons.filter(
    (lesson) => lesson.domain === "Finance personnelle",
  );
  const firstModule = personal.slice(0, 4);
  assert.deepEqual(firstModule[0]!.prerequisites, []);
  for (let index = 1; index < firstModule.length; index++)
    assert.deepEqual(firstModule[index]!.prerequisites, [
      firstModule[index - 1]!.id,
    ]);
  for (const lesson of personal) {
    assert.match(lesson.example.title, /fictif/i, lesson.id);
    assert.match(lesson.editorialStatus, /aucun conseil personnalisé/);
  }
});

import test from "node:test";
import assert from "node:assert/strict";
import {
  buildProviderMessages,
  extractAnswer,
  MENTOR_SYSTEM_PROMPT,
  mentorLimits,
  validateMentorRequest,
  type MentorRequest,
} from "../supabase/functions/_shared/mentorContract.ts";

const valid: MentorRequest = {
  lessonId: "inv-interets-composes",
  question: "  Pourquoi les frais comptent-ils autant ?  ",
  history: [
    { role: "user", text: "Bonjour" },
    { role: "mentor", text: "Bonjour !" },
  ],
  context: [{ title: "Les mécanismes", excerpt: "Les frais composent." }],
};

test("a valid request is accepted and the question is trimmed", () => {
  const result = validateMentorRequest(valid);
  assert.notEqual(typeof result, "string");
  assert.equal(
    (result as MentorRequest).question,
    "Pourquoi les frais comptent-ils autant ?",
  );
});

test("empty, oversized or malformed requests are refused with a readable reason", () => {
  assert.match(
    validateMentorRequest({ ...valid, question: "  " }) as string,
    /vide/,
  );
  assert.match(
    validateMentorRequest({
      ...valid,
      question: "x".repeat(mentorLimits.questionChars + 1),
    }) as string,
    /dépasse/,
  );
  assert.match(
    validateMentorRequest({
      ...valid,
      history: [{ role: "system", text: "x" }],
    }) as string,
    /Historique/,
  );
  assert.match(
    validateMentorRequest({
      ...valid,
      context: Array.from({ length: 6 }, (_, index) => ({
        title: `${index}`,
        excerpt: "x".repeat(mentorLimits.contextChars),
      })),
    }) as string,
    /trop long/,
  );
  assert.equal(typeof validateMentorRequest(null), "string");
  assert.equal(typeof validateMentorRequest([]), "string");
});

test("lesson excerpts become citable documents placed before the question", () => {
  const messages = buildProviderMessages(
    validateMentorRequest(valid) as MentorRequest,
  );
  assert.deepEqual(
    messages.slice(0, 2).map((message) => message.role),
    ["user", "assistant"],
  );
  const last = messages.at(-1)!;
  assert.equal(last.role, "user");
  assert.ok(Array.isArray(last.content));
  const [document, question] = last.content as Array<Record<string, unknown>>;
  assert.equal(document!.type, "document");
  assert.deepEqual(document!.citations, { enabled: true });
  assert.equal(document!.title, "Les mécanismes");
  assert.deepEqual(question, {
    type: "text",
    text: "Pourquoi les frais comptent-ils autant ?",
  });
});

test("the answer joins text blocks and keeps unique, non-empty citations", () => {
  const { answer, citations } = extractAnswer([
    { type: "thinking" },
    { type: "text", text: "Les frais ", citations: null },
    {
      type: "text",
      text: "composent.",
      citations: [
        {
          cited_text: "Les frais composent.",
          document_title: "Les mécanismes",
        },
        {
          cited_text: "Les frais composent.",
          document_title: "Les mécanismes",
        },
        { cited_text: " ", document_title: "Vide" },
      ],
    },
  ]);
  assert.equal(answer, "Les frais composent.");
  assert.deepEqual(citations, [
    { title: "Les mécanismes", quote: "Les frais composent." },
  ]);
});

test("the system prompt forbids investment advice and invented figures", () => {
  assert.match(MENTOR_SYSTEM_PROMPT, /jamais du conseil en investissement/);
  assert.match(MENTOR_SYSTEM_PROMPT, /N'invente jamais de chiffre/);
  assert.doesNotMatch(
    MENTOR_SYSTEM_PROMPT,
    /\d{4}-\d{2}-\d{2}/,
    "no date, so the cached prefix stays stable",
  );
});

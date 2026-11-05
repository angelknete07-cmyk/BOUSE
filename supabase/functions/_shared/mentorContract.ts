/**
 * Provider-neutral contract between the BOUSE client and the mentor function.
 * Pure TypeScript: no Deno, browser or SDK dependency, so the client, the
 * server and the Node unit tests share the same validation.
 */

export const mentorLimits = {
  questionChars: 2000,
  historyTurns: 10,
  historyChars: 4000,
  contextDocuments: 8,
  contextChars: 6000,
  contextTotalChars: 30000,
} as const;

export type MentorTurn = { role: "user" | "mentor"; text: string };
export type MentorContext = { title: string; excerpt: string };

export type MentorRequest = {
  /** Lesson the question is about, if any. */
  lessonId: string | null;
  question: string;
  /** Earlier turns of this session only; nothing is stored server-side. */
  history: MentorTurn[];
  /** Excerpts of the lesson the answer must rely on and cite. */
  context: MentorContext[];
};

export type MentorCitation = { title: string; quote: string };

export type MentorResponse = {
  answer: string;
  citations: MentorCitation[];
  /** Model that actually answered, as reported by the provider. */
  model: string;
  /** Always a draft: an AI answer is never validated course content. */
  status: "draft";
  truncated: boolean;
  usage: { inputTokens: number; outputTokens: number; remainingToday: number };
};

export type MentorErrorCode =
  | "unauthenticated"
  | "invalid_request"
  | "budget_exceeded"
  | "provider_unavailable"
  | "refused"
  | "not_configured";

export type MentorErrorBody = {
  error: { code: MentorErrorCode; message: string };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

/** Returns a clean request, or a French error message for the person. */
export function validateMentorRequest(body: unknown): MentorRequest | string {
  if (!isRecord(body)) return "Requête invalide.";
  const { lessonId, question, history, context } = body;
  if (lessonId !== null && typeof lessonId !== "string")
    return "Leçon invalide.";
  if (typeof question !== "string" || !question.trim())
    return "La question est vide.";
  if (question.length > mentorLimits.questionChars)
    return `La question dépasse ${mentorLimits.questionChars} caractères.`;
  if (!Array.isArray(history) || history.length > mentorLimits.historyTurns)
    return "Historique invalide ou trop long.";
  for (const turn of history) {
    if (
      !isRecord(turn) ||
      (turn.role !== "user" && turn.role !== "mentor") ||
      typeof turn.text !== "string" ||
      turn.text.length > mentorLimits.historyChars
    )
      return "Historique invalide.";
  }
  if (!Array.isArray(context) || context.length > mentorLimits.contextDocuments)
    return "Contexte invalide ou trop long.";
  let total = 0;
  for (const item of context) {
    if (
      !isRecord(item) ||
      typeof item.title !== "string" ||
      typeof item.excerpt !== "string" ||
      !item.excerpt.trim() ||
      item.excerpt.length > mentorLimits.contextChars
    )
      return "Contexte invalide.";
    total += item.excerpt.length;
  }
  if (total > mentorLimits.contextTotalChars) return "Contexte trop long.";
  return {
    lessonId: lessonId ?? null,
    question: question.trim(),
    history: history.map((turn) => ({
      role: turn.role as MentorTurn["role"],
      text: String(turn.text),
    })),
    context: context.map((item) => ({
      title: String(item.title),
      excerpt: String(item.excerpt),
    })),
  };
}

/** Stable system prompt (kept byte-identical so the provider can cache it). */
export const MENTOR_SYSTEM_PROMPT = `Tu es le mentor de BOUSE, une académie personnelle francophone de business, de finance et d'intelligence artificielle.

Ton rôle : aider une personne à comprendre une notion de cours, en partant de l'intuition avant le vocabulaire technique, puis en reliant la notion à une décision concrète.

Règles :
- Réponds en français, clairement, en quelques paragraphes courts. Pas de titres inutiles.
- Appuie-toi d'abord sur les extraits de leçon fournis et cite-les. Si les extraits ne suffisent pas, dis-le explicitement et distingue ce qui vient de tes connaissances générales.
- N'invente jamais de chiffre, de source, de règle fiscale ou juridique. Les règles fiscales, plafonds et taux changent : renvoie vers les sources officielles (AMF, service-public.fr, Banque de France) pour les vérifier.
- Investissement : tu fais de la pédagogie, jamais du conseil en investissement. Ne recommande aucun titre, produit ou intermédiaire et ne prédis aucun cours. Rappelle les risques quand c'est pertinent.
- Si la question sort du cadre (santé, droit personnel détaillé, situation financière individuelle), explique les limites et oriente vers un professionnel autorisé.
- Préfère poser une question de vérification ou proposer un mini-exercice plutôt que de tout résoudre à la place de la personne quand elle apprend.`;

/** Plain-object shapes (SDK-free) for the provider request. */
export type ProviderDocument = {
  type: "document";
  source: { type: "text"; media_type: "text/plain"; data: string };
  title: string;
  citations: { enabled: true };
};
export type ProviderMessage =
  | {
      role: "user";
      content:
        string | Array<ProviderDocument | { type: "text"; text: string }>;
    }
  | { role: "assistant"; content: string };

/** Builds the conversation: history, then lesson documents and the question. */
export function buildProviderMessages(
  request: MentorRequest,
): ProviderMessage[] {
  const messages: ProviderMessage[] = request.history.map((turn) =>
    turn.role === "user"
      ? { role: "user", content: turn.text }
      : { role: "assistant", content: turn.text },
  );
  const documents: ProviderDocument[] = request.context.map((item) => ({
    type: "document",
    source: { type: "text", media_type: "text/plain", data: item.excerpt },
    title: item.title,
    citations: { enabled: true },
  }));
  messages.push({
    role: "user",
    content: [...documents, { type: "text", text: request.question }],
  });
  return messages;
}

type ProviderTextBlock = {
  type: string;
  text?: string;
  citations?: Array<{
    cited_text?: string;
    document_title?: string | null;
  }> | null;
};

/** Joins answer text and collects unique citations from the provider blocks. */
export function extractAnswer(content: ProviderTextBlock[]): {
  answer: string;
  citations: MentorCitation[];
} {
  const parts: string[] = [];
  const citations: MentorCitation[] = [];
  const seen = new Set<string>();
  for (const block of content) {
    if (block.type !== "text" || typeof block.text !== "string") continue;
    parts.push(block.text);
    for (const citation of block.citations ?? []) {
      const quote = (citation.cited_text ?? "").trim();
      if (!quote) continue;
      const title = citation.document_title ?? "Leçon";
      const key = `${title}::${quote}`;
      if (seen.has(key)) continue;
      seen.add(key);
      citations.push({ title, quote });
    }
  }
  return { answer: parts.join("").trim(), citations };
}

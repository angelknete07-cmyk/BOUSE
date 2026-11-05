// BOUSE mentor — Supabase Edge Function (Deno).
// Authenticated, budgeted proxy to the model provider. The provider key never
// reaches the browser: set it with `supabase secrets set ANTHROPIC_API_KEY=...`.
// Logs carry status codes and token counts only, never the questions.
import Anthropic from "npm:@anthropic-ai/sdk@1.1.0";
import { createClient } from "npm:@supabase/supabase-js@2.118.0";
import {
  buildProviderMessages,
  extractAnswer,
  MENTOR_SYSTEM_PROMPT,
  validateMentorRequest,
  type MentorErrorBody,
  type MentorErrorCode,
  type MentorResponse,
} from "../_shared/mentorContract.ts";

const MODEL = "claude-opus-5-5";
// Per-answer cap: a cost guard for a tutoring chat (thinking counts toward it).
const MAX_OUTPUT_TOKENS = Number(
  Deno.env.get("MENTOR_MAX_OUTPUT_TOKENS") ?? 8000,
);
const DAILY_REQUESTS = Number(Deno.env.get("MENTOR_DAILY_REQUESTS") ?? 30);
const ALLOWED_ORIGIN = Deno.env.get("MENTOR_ALLOWED_ORIGIN") ?? "*";

const cors = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(status: number, body: MentorResponse | MentorErrorBody) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json; charset=utf-8" },
  });
}

function fail(status: number, code: MentorErrorCode, message: string) {
  console.log(JSON.stringify({ event: "mentor_error", status, code }));
  return json(status, { error: { code, message } });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS")
    return new Response("ok", { headers: cors });
  if (request.method !== "POST")
    return fail(405, "invalid_request", "Méthode non autorisée.");

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const providerKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!supabaseUrl || !anonKey || !serviceKey || !providerKey)
    return fail(
      503,
      "not_configured",
      "Le mentor n’est pas configuré sur ce serveur.",
    );

  // 1. Authenticate the caller with their own Supabase session token.
  const authorization = request.headers.get("Authorization") ?? "";
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false },
  });
  const { data: auth, error: authError } = await userClient.auth.getUser();
  if (authError || !auth.user)
    return fail(
      401,
      "unauthenticated",
      "Connectez-vous pour poser une question au mentor.",
    );
  const userId = auth.user.id;

  // 2. Validate the provider-neutral request.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "invalid_request", "Corps de requête illisible.");
  }
  const parsed = validateMentorRequest(body);
  if (typeof parsed === "string") return fail(400, "invalid_request", parsed);

  // 3. Daily budget, read with the service role (RLS lets users read only).
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
  const today = new Date().toISOString().slice(0, 10);
  const { data: usage } = await admin
    .from("mentor_usage")
    .select("requests")
    .eq("user_id", userId)
    .eq("day", today)
    .maybeSingle();
  const used = Number(usage?.requests ?? 0);
  if (used >= DAILY_REQUESTS)
    return fail(
      429,
      "budget_exceeded",
      `Limite quotidienne atteinte (${DAILY_REQUESTS} questions). Elle se renouvelle à minuit UTC.`,
    );

  // 4. Ask the model. Lesson excerpts are documents with citations enabled.
  const client = new Anthropic({ apiKey: providerKey });
  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      // On a policy decline, the API retries on a suitable model in the same call.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium" },
      system: [
        {
          type: "text",
          text: MENTOR_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: buildProviderMessages(parsed),
    });

    if (response.stop_reason === "refusal") {
      console.log(
        JSON.stringify({
          event: "mentor_refusal",
          category: response.stop_details?.category ?? null,
        }),
      );
      return fail(
        422,
        "refused",
        "Le mentor ne peut pas répondre à cette demande. Reformulez-la autour de la leçon.",
      );
    }

    const { answer, citations } = extractAnswer(response.content);
    const inputTokens =
      response.usage.input_tokens +
      (response.usage.cache_read_input_tokens ?? 0) +
      (response.usage.cache_creation_input_tokens ?? 0);
    const outputTokens = response.usage.output_tokens;

    // 5. Record usage atomically; a failure here must not hide the answer.
    const { error: usageError } = await admin.rpc("mentor_record_usage", {
      p_user: userId,
      p_input: inputTokens,
      p_output: outputTokens,
    });
    if (usageError)
      console.log(JSON.stringify({ event: "mentor_usage_error" }));

    console.log(
      JSON.stringify({
        event: "mentor_answer",
        model: response.model,
        inputTokens,
        outputTokens,
        citations: citations.length,
        stop: response.stop_reason,
      }),
    );

    return json(200, {
      answer:
        answer ||
        "Le mentor n’a pas produit de réponse. Réessayez en précisant la question.",
      citations,
      model: response.model,
      status: "draft",
      truncated: response.stop_reason === "max_tokens",
      usage: {
        inputTokens,
        outputTokens,
        remainingToday: Math.max(0, DAILY_REQUESTS - used - 1),
      },
    });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError)
      return fail(
        503,
        "provider_unavailable",
        "Le service d’IA est très sollicité. Réessayez dans un moment.",
      );
    if (error instanceof Anthropic.AuthenticationError)
      return fail(
        503,
        "not_configured",
        "La clé du fournisseur d’IA est invalide côté serveur.",
      );
    if (error instanceof Anthropic.BadRequestError)
      return fail(
        400,
        "invalid_request",
        "La demande n’a pas pu être traitée par le fournisseur.",
      );
    if (error instanceof Anthropic.APIError)
      return fail(
        502,
        "provider_unavailable",
        `Le fournisseur d’IA a répondu ${error.status ?? "sans statut"}.`,
      );
    return fail(
      502,
      "provider_unavailable",
      "Le fournisseur d’IA est injoignable.",
    );
  }
});

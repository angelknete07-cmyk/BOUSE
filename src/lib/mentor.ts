import { cloudClient, currentUser, isCloudConfigured } from "./cloud";
import type {
  MentorErrorBody,
  MentorRequest,
  MentorResponse,
} from "../../supabase/functions/_shared/mentorContract.ts";

export type MentorAvailability = "not-configured" | "signed-out" | "ready";

/** The mentor needs the account backend and a signed-in person. */
export async function mentorAvailability(): Promise<MentorAvailability> {
  if (!isCloudConfigured()) return "not-configured";
  try {
    return (await currentUser()) ? "ready" : "signed-out";
  } catch {
    return "signed-out";
  }
}

/** Calls the authenticated mentor function; errors carry a French message. */
export async function askMentor(
  request: MentorRequest,
): Promise<MentorResponse> {
  const client = await cloudClient();
  const { data, error } = await client.functions.invoke<MentorResponse>(
    "mentor",
    { body: request },
  );
  if (error) {
    let message = "Le mentor est indisponible pour le moment.";
    const context = (error as { context?: unknown }).context;
    if (context instanceof Response) {
      try {
        const body = (await context.json()) as MentorErrorBody;
        message = body.error?.message ?? message;
      } catch {
        // Keep the generic message when the body is not JSON.
      }
    }
    throw new Error(message);
  }
  if (!data) throw new Error("Réponse vide du mentor.");
  return data;
}

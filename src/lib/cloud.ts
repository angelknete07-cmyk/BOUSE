import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { AppState } from "./types";
import { parseState } from "./storage";
import type { RemoteCopy } from "./sync";

/**
 * Optional account sync. Disabled unless both public variables are set at
 * build time. The anon key is public by design: access is enforced by the
 * row-level security policies in supabase/migrations.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined;

export function isCloudConfigured(): boolean {
  return Boolean(url && anonKey);
}

let clientPromise: Promise<SupabaseClient> | null = null;

/** Loads the SDK on demand so the local-only app never pays for it. */
export function cloudClient(): Promise<SupabaseClient> {
  if (!isCloudConfigured())
    return Promise.reject(new Error("Synchronisation non configurée."));
  clientPromise ??= import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(url!, anonKey!, {
      global: {
        fetch: (input, init) =>
          fetch(input, { ...init, signal: AbortSignal.timeout(20000) }),
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // PKCE returns ?code=… instead of #access_token=…, which would
        // collide with the hash router.
        flowType: "pkce",
        detectSessionInUrl: true,
      },
    }),
  );
  return clientPromise;
}

/** True when the page was opened from a sign-in link (PKCE code in the query). */
export function hasSignInCode(): boolean {
  return new URLSearchParams(location.search).has("code");
}

/** Removes the one-time code from the address bar once it has been used. */
export function clearSignInCode(): void {
  const params = new URLSearchParams(location.search);
  params.delete("code");
  const query = params.toString();
  history.replaceState(
    null,
    "",
    `${location.pathname}${query ? `?${query}` : ""}${location.hash || "#settings"}`,
  );
}

export async function onAuthChange(
  listener: (user: User | null) => void,
): Promise<() => void> {
  const client = await cloudClient();
  const { data } = client.auth.onAuthStateChange((_event, session) =>
    listener(session?.user ?? null),
  );
  return () => data.subscription.unsubscribe();
}

export async function currentUser(): Promise<User | null> {
  const client = await cloudClient();
  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  return data.session?.user ?? null;
}

/** Passwordless sign-in: a one-time link sent by email. */
export async function sendSignInLink(email: string): Promise<void> {
  const client = await cloudClient();
  const { error } = await client.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: location.origin + location.pathname },
  });
  if (error) throw new Error(error.message);
}

export async function signOut(): Promise<void> {
  const client = await cloudClient();
  const { error } = await client.auth.signOut({ scope: "local" });
  if (error) throw new Error(error.message);
}

/** Reads the server copy and validates it like an import before use. */
export async function pullRemote(userId: string): Promise<RemoteCopy | null> {
  const client = await cloudClient();
  const { data, error } = await client
    .from("learning_states")
    .select("state, revision, updated_at")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    state: parseState(JSON.stringify(data.state)),
    revision: Number(data.revision),
    updatedAt: String(data.updated_at),
  };
}

export class SyncConflictError extends Error {
  constructor() {
    super(
      "La copie en ligne a changé depuis votre dernière synchronisation (autre appareil ?). Choisissez la version à conserver.",
    );
  }
}

/**
 * Writes the state. With an expected revision, the update only applies if
 * nobody else wrote in between (optimistic concurrency); otherwise it throws
 * SyncConflictError instead of overwriting another device's work.
 */
export async function pushRemote(
  userId: string,
  state: AppState,
  expectedRevision: number | null,
): Promise<{ revision: number; updatedAt: string }> {
  const client = await cloudClient();
  const row = { user_id: userId, schema_version: 1, state };
  const query =
    expectedRevision === null
      ? client.from("learning_states").insert(row)
      : client
          .from("learning_states")
          .update({ schema_version: 1, state })
          .eq("user_id", userId)
          .eq("revision", expectedRevision);
  const { data, error } = await query.select("revision, updated_at");
  if (error) {
    // Unique violation on first insert: another device created the copy.
    if (error.code === "23505") throw new SyncConflictError();
    throw new Error(error.message);
  }
  const written = data?.[0];
  if (!written) throw new SyncConflictError();
  return {
    revision: Number(written.revision),
    updatedAt: String(written.updated_at),
  };
}

/** Deletes the account and its server copy. Local browser data is untouched. */
export async function deleteAccount(): Promise<void> {
  const client = await cloudClient();
  const { error } = await client.rpc("delete_my_account");
  if (error) throw new Error(error.message);
}

import "server-only";

import { z } from "zod";

function emptyToUndefined(value: unknown): unknown {
  if (value === "" || value === undefined) return undefined;
  return value;
}

function optionalNonEmptyString(value: unknown): string | undefined {
  const normalized = emptyToUndefined(value);
  if (typeof normalized !== "string" || normalized.length === 0) {
    return undefined;
  }
  return normalized;
}

/**
 * Server-only environment variables.
 * Never import this module from Client Components.
 *
 * SUPABASE_SERVICE_ROLE_KEY bypasses RLS — use only in trusted
 * background jobs if added later, never in Route Handlers exposed to the public.
 */
const serverEnvSchema = z.object({
  GROQ_API_KEY: z.preprocess(optionalNonEmptyString, z.string().min(1).optional()),
  SUPABASE_SERVICE_ROLE_KEY: z.preprocess(
    optionalNonEmptyString,
    z.string().min(1).optional(),
  ),
});

function parseServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "Invalid server environment variables:",
      JSON.stringify(parsed.error.flatten().fieldErrors),
    );
    throw new Error("Invalid server environment variables");
  }

  return parsed.data;
}

export const serverEnv = parseServerEnv();

export function hasGroqConfig(): boolean {
  return Boolean(serverEnv.GROQ_API_KEY);
}

export function getGroqApiKey(): string {
  if (!serverEnv.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }
  return serverEnv.GROQ_API_KEY;
}

/** Present only when explicitly configured — not used by v1 app routes. */
export function hasServiceRoleKey(): boolean {
  return Boolean(serverEnv.SUPABASE_SERVICE_ROLE_KEY);
}

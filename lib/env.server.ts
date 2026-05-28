import "server-only";

import { parseServerEnv, type ServerEnv } from "@/lib/env/validation";

export type { ServerEnv } from "@/lib/env/validation";

/** Validated server-only secrets. Never import from Client Components. */
export const serverEnv: ServerEnv = parseServerEnv();

export function hasGroqConfig(): boolean {
  return Boolean(serverEnv.GROQ_API_KEY);
}

export function getGroqApiKey(): string {
  if (!serverEnv.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }
  return serverEnv.GROQ_API_KEY;
}

export function hasServiceRoleKey(): boolean {
  return Boolean(serverEnv.SUPABASE_SERVICE_ROLE_KEY);
}

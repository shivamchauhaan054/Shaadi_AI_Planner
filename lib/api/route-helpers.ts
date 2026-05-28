import { jsonError } from "@/lib/api/http";
import { hasGroqConfig } from "@/lib/env.server";
import { hasSupabaseConfig } from "@/lib/env";

export const SUPABASE_NOT_CONFIGURED_MESSAGE =
  "Database is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";

export const GROQ_NOT_CONFIGURED_MESSAGE =
  "AI service is not configured.";

export function requireSupabaseConfig() {
  if (!hasSupabaseConfig()) {
    return jsonError(503, SUPABASE_NOT_CONFIGURED_MESSAGE);
  }
  return null;
}

export function requireGroqConfig() {
  if (!hasGroqConfig()) {
    return jsonError(503, GROQ_NOT_CONFIGURED_MESSAGE);
  }
  return null;
}

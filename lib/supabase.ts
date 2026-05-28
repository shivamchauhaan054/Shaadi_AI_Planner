import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env, hasSupabaseConfig } from "@/lib/env";
import type { Database } from "@/types/database";

export type SupabaseClientType = SupabaseClient<Database>;

function assertSupabaseConfig(): { url: string; anonKey: string } {
  if (!hasSupabaseConfig()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
    );
  }

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  };
}

/**
 * Server-side Supabase client using the **anon** key only.
 *
 * - Never import `SUPABASE_SERVICE_ROLE_KEY` here — it bypasses RLS.
 * - When Auth + RLS are enabled, user-scoped clients should pass the session JWT.
 * - v1 uses server Route Handlers as the trust boundary (see `supabase/migrations/rls.example.sql`).
 */
export function createServerClient(): SupabaseClientType {
  const { url, anonKey } = assertSupabaseConfig();

  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/** Returns a server client when configured; otherwise `null` (no throw). */
export function getServerClientOrNull(): SupabaseClientType | null {
  if (!hasSupabaseConfig()) return null;
  return createServerClient();
}

export { hasSupabaseConfig as isSupabaseConfigured };

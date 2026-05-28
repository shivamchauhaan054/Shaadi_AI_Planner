import { parsePublicEnv, type PublicEnv } from "@/lib/env/validation";

export type { PublicEnv } from "@/lib/env/validation";

/** Validated public environment (NEXT_PUBLIC_* and NODE_ENV). */
export const env: PublicEnv = parsePublicEnv();

export function hasSupabaseConfig(): boolean {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

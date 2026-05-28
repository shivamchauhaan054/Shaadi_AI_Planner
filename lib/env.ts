import { z } from "zod";

/**
 * Public environment variables (safe to reference in client bundles).
 * Secrets belong in `lib/env.server.ts` with the `server-only` guard.
 */

function emptyToUndefined(value: unknown): unknown {
  if (value === "" || value === undefined) return undefined;
  return value;
}

function optionalUrl(value: unknown): string | undefined {
  const normalized = emptyToUndefined(value);
  if (normalized === undefined) return undefined;
  if (typeof normalized !== "string") return undefined;

  const parsed = z.string().url().safeParse(normalized);
  return parsed.success ? parsed.data : undefined;
}

function optionalNonEmptyString(value: unknown): string | undefined {
  const normalized = emptyToUndefined(value);
  if (typeof normalized !== "string" || normalized.length === 0) {
    return undefined;
  }
  return normalized;
}

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.preprocess(optionalUrl, z.string().url().optional()),
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(
    optionalUrl,
    z.string().url().optional(),
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.preprocess(
    optionalNonEmptyString,
    z.string().min(1).optional(),
  ),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

function parsePublicEnv(): PublicEnv {
  const parsed = publicEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const details = JSON.stringify(parsed.error.flatten().fieldErrors);
    console.error("Invalid public environment variables:", details);
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export const env = parsePublicEnv();

export function hasSupabaseConfig(): boolean {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

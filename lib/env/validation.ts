import { z } from "zod";

import { getAppUrl } from "@/lib/env/app-url";

function emptyToUndefined(value: unknown): unknown {
  if (value === "" || value === undefined) return undefined;
  return value;
}

function optionalUrl(value: unknown): string | undefined {
  const normalized = emptyToUndefined(value);
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

/** Public env — safe to read in client bundles (NEXT_PUBLIC_* only). */
export const publicEnvSchema = z.object({
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

/** Server-only secrets — parse only on the server. */
export const serverEnvSchema = z.object({
  GROQ_API_KEY: z.preprocess(optionalNonEmptyString, z.string().min(1).optional()),
  SUPABASE_SERVICE_ROLE_KEY: z.preprocess(
    optionalNonEmptyString,
    z.string().min(1).optional(),
  ),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export type EnvValidationResult = {
  publicEnv: PublicEnv;
  serverEnv: ServerEnv;
  appUrl: string;
  warnings: string[];
  errors: string[];
};

export function parsePublicEnv(): PublicEnv {
  const parsed = publicEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const details = JSON.stringify(parsed.error.flatten().fieldErrors);
    throw new Error(`Invalid public environment variables: ${details}`);
  }

  return parsed.data;
}

export function parseServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const details = JSON.stringify(parsed.error.flatten().fieldErrors);
    throw new Error(`Invalid server environment variables: ${details}`);
  }

  return parsed.data;
}

export function validateEnvironment(): EnvValidationResult {
  const publicEnv = parsePublicEnv();
  const serverEnv =
    typeof window === "undefined" ? parseServerEnv() : ({} as ServerEnv);

  const warnings: string[] = [];
  const errors: string[] = [];

  const hasSupabaseUrl = Boolean(publicEnv.NEXT_PUBLIC_SUPABASE_URL);
  const hasSupabaseKey = Boolean(publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (hasSupabaseUrl !== hasSupabaseKey) {
    errors.push(
      "Set both NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or neither.",
    );
  }

  if (!publicEnv.NEXT_PUBLIC_APP_URL && !process.env.VERCEL_URL) {
    warnings.push(
      "NEXT_PUBLIC_APP_URL is unset; metadata will use localhost unless VERCEL_URL is present.",
    );
  }

  if (typeof window === "undefined") {
    if (!serverEnv.GROQ_API_KEY) {
      warnings.push(
        "GROQ_API_KEY is unset — AI recommendations and POST /api/recommend will return 503.",
      );
    }

    if (!hasSupabaseUrl) {
      warnings.push(
        "Supabase is unset — database features and /api/* routes will return 503.",
      );
    }

    if (serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
      warnings.push(
        "SUPABASE_SERVICE_ROLE_KEY is set but unused in v1; prefer anon key + RLS when Auth ships.",
      );
    }
  }

  return {
    publicEnv,
    serverEnv,
    appUrl: getAppUrl(),
    warnings,
    errors,
  };
}

/**
 * Call at server startup in production. Logs warnings; throws only on hard misconfig.
 */
export function assertProductionEnvironment(): void {
  if (process.env.NODE_ENV !== "production") return;

  const result = validateEnvironment();

  for (const warning of result.warnings) {
    console.warn(`[env] ${warning}`);
  }

  if (result.errors.length > 0) {
    throw new Error(
      `Production environment misconfigured:\n${result.errors.join("\n")}`,
    );
  }
}

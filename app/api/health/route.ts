/**
 * GET /api/health — liveness probe (no secrets in production).
 * @rateLimit See `lib/api/rate-limit.ts` (`RATE_LIMIT_ROUTE_IDS.health`)
 */
import { NextResponse } from "next/server";

import { hasGroqConfig } from "@/lib/env.server";
import { hasSupabaseConfig } from "@/lib/env";

export const runtime = "nodejs";

export async function GET() {
  const payload: Record<string, unknown> = {
    status: "ok",
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development") {
    payload.services = {
      supabase: hasSupabaseConfig(),
      groq: hasGroqConfig(),
    };
  }

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

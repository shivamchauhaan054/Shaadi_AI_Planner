/**
 * POST /api/recommend — create intake + AI vendor plan.
 * @rateLimit See `lib/api/rate-limit.ts` (`RATE_LIMIT_ROUTE_IDS.recommend`)
 */
import { jsonError, jsonSuccess, jsonValidationError } from "@/lib/api/http";
import {
  jsonBodyErrorToMessage,
  parseJsonPostRequest,
} from "@/lib/api/parse-request";
import { recommendResponseSchema } from "@/lib/api/responses";
import {
  requireGroqConfig,
  requireSupabaseConfig,
} from "@/lib/api/route-helpers";
import { handleRouteError } from "@/lib/api/safe-errors";
import { processRecommendationRequest } from "@/lib/services/recommendations";
import { formatZodErrors } from "@/lib/validations/format-errors";
import { recommendRequestSchema } from "@/lib/validators";

export const runtime = "nodejs";

const ROUTE = "POST /api/recommend";

export async function POST(request: Request) {
  const supabaseError = requireSupabaseConfig();
  if (supabaseError) return supabaseError;

  const groqError = requireGroqConfig();
  if (groqError) return groqError;

  const bodyResult = await parseJsonPostRequest(request);
  if (!bodyResult.ok) {
    return jsonError(400, jsonBodyErrorToMessage(bodyResult.error));
  }

  const parsed = recommendRequestSchema.safeParse(bodyResult.data);

  if (!parsed.success) {
    return jsonValidationError(
      "Invalid intake data",
      formatZodErrors(parsed.error),
    );
  }

  try {
    const result = await processRecommendationRequest(parsed.data);
    const response = recommendResponseSchema.parse({
      intake_id: result.intake_id,
      recommendations: result.recommendations,
    });

    return jsonSuccess(response, 201);
  } catch (error) {
    return handleRouteError(error, {
      route: ROUTE,
      validationMessage: "Invalid AI response shape",
    });
  }
}

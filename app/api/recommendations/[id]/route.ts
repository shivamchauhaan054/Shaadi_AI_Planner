/**
 * GET /api/recommendations/[id] — plan details, budgets, payments.
 * @rateLimit See `lib/api/rate-limit.ts` (`RATE_LIMIT_ROUTE_IDS.recommendationDetails`)
 */
import { jsonError, jsonSuccess } from "@/lib/api/http";
import { parseIntakeIdParam } from "@/lib/api/route-params";
import { requireSupabaseConfig } from "@/lib/api/route-helpers";
import {
  handleRouteError,
  PUBLIC_API_ERRORS,
} from "@/lib/api/safe-errors";
import { getRecommendationDetails } from "@/lib/services/recommendation-details";

export const runtime = "nodejs";

const ROUTE = "GET /api/recommendations/[id]";

type RouteContext = {
  params: { id: string };
};

export async function GET(_request: Request, context: RouteContext) {
  const configError = requireSupabaseConfig();
  if (configError) return configError;

  const parsedId = parseIntakeIdParam(context.params.id);

  if (!parsedId.ok) {
    return jsonError(400, parsedId.message);
  }

  try {
    const details = await getRecommendationDetails(parsedId.id);
    return jsonSuccess(details);
  } catch (error) {
    const response = handleRouteError(error, { route: ROUTE });

    if (response.status === 500) {
      return jsonError(500, PUBLIC_API_ERRORS.fetchRecommendationsFailed);
    }

    return response;
  }
}

/**
 * POST /api/payments — record a vendor payment.
 * @rateLimit See `lib/api/rate-limit.ts` (`RATE_LIMIT_ROUTE_IDS.payments`)
 */
import { jsonError, jsonSuccess, jsonValidationError } from "@/lib/api/http";
import {
  jsonBodyErrorToMessage,
  parseJsonPostRequest,
} from "@/lib/api/parse-request";
import { requireSupabaseConfig } from "@/lib/api/route-helpers";
import { handleRouteError } from "@/lib/api/safe-errors";
import { recordPayment } from "@/lib/services/payments";
import { createPaymentSchema } from "@/lib/validations/payments";
import { formatZodErrors } from "@/lib/validations/format-errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const ROUTE = "POST /api/payments";

export async function POST(request: Request) {
  const configError = requireSupabaseConfig();
  if (configError) return configError;

  const bodyResult = await parseJsonPostRequest(request);
  if (!bodyResult.ok) {
    return jsonError(400, jsonBodyErrorToMessage(bodyResult.error));
  }

  const parsed = createPaymentSchema.safeParse(bodyResult.data);

  if (!parsed.success) {
    return jsonValidationError(
      "Invalid payment data",
      formatZodErrors(parsed.error),
    );
  }

  try {
    const result = await recordPayment(parsed.data);
    return jsonSuccess(result, 201);
  } catch (error) {
    return handleRouteError(error, {
      route: ROUTE,
      validationMessage: "Invalid payment record",
    });
  }
}

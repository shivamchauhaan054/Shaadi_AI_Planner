import {
  createPaymentResponseSchema,
  type CreatePaymentInput,
  type CreatePaymentResponse,
} from "@/lib/validations/payments";
import {
  recommendationDetailsResponseSchema,
  type RecommendationDetailsResponse,
} from "@/lib/validators";

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; statusCode: number };

async function parseJsonBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function getErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "error" in body) {
    const error = (body as { error?: unknown }).error;
    if (typeof error === "string") return error;
  }
  return fallback;
}

export async function fetchRecommendationDetails(
  intakeId: string,
  signal?: AbortSignal,
): Promise<ApiResult<RecommendationDetailsResponse>> {
  const response = await fetch(`/api/recommendations/${intakeId}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal,
  });

  const body = await parseJsonBody(response);

  if (!response.ok) {
    return {
      ok: false,
      message: getErrorMessage(body, "Failed to load recommendations"),
      statusCode: response.status,
    };
  }

  const parsed = recommendationDetailsResponseSchema.safeParse(body);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Received invalid data from the server",
      statusCode: 502,
    };
  }

  return { ok: true, data: parsed.data };
}

export async function createPayment(
  input: CreatePaymentInput,
): Promise<ApiResult<CreatePaymentResponse>> {
  const response = await fetch("/api/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input),
  });

  const body = await parseJsonBody(response);

  if (!response.ok) {
    return {
      ok: false,
      message: getErrorMessage(body, "Failed to save payment"),
      statusCode: response.status,
    };
  }

  const parsed = createPaymentResponseSchema.safeParse(body);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid response from server",
      statusCode: 502,
    };
  }

  return { ok: true, data: parsed.data };
}

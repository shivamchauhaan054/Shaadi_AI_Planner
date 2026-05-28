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

function formatFieldDetails(details: Record<string, string[]>): string {
  const parts = Object.entries(details).flatMap(([field, messages]) =>
    messages.map((message) => `${field}: ${message}`),
  );
  return parts.slice(0, 3).join(" · ");
}

function getErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;

  const record = body as { error?: unknown; details?: unknown };
  const base =
    typeof record.error === "string" ? record.error : fallback;

  if (
    record.details &&
    typeof record.details === "object" &&
    !Array.isArray(record.details)
  ) {
    const fieldDetails = formatFieldDetails(
      record.details as Record<string, string[]>,
    );
    if (fieldDetails) return `${base} (${fieldDetails})`;
  }

  return base;
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

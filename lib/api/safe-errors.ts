import { ZodError } from "zod";

import { jsonError, jsonValidationError } from "@/lib/api/http";
import { formatZodErrors } from "@/lib/validations/format-errors";
import { GroqConfigurationError, GroqGenerationError } from "@/lib/groq";
import { IntakeNotFoundError } from "@/lib/errors/intake";
import { InvalidVendorCategoryError } from "@/lib/errors/payment";

export const PUBLIC_API_ERRORS = {
  generic: "An unexpected error occurred",
  notFoundIntake: "Wedding intake not found",
  invalidVendorCategory: "Vendor category is not valid for this intake",
  groqFailed: "Failed to generate valid AI recommendations",
  saveIntakeFailed: "Failed to save wedding intake",
  saveRecommendationsFailed: "Failed to save recommendations",
  savePaymentFailed: "Failed to save payment",
  fetchRecommendationsFailed: "Failed to fetch recommendations",
  corruptRecommendations: "Stored recommendations data is invalid",
} as const;

/** Logs full error server-side; never log request bodies (may contain PII). */
export function logRouteError(route: string, error: unknown): void {
  if (error instanceof Error) {
    console.error(`[${route}]`, error.message);
    return;
  }
  console.error(`[${route}]`, error);
}

type ErrorHandlerOptions = {
  route: string;
  validationMessage?: string;
};

/**
 * Maps known domain errors to safe public responses.
 * Unknown errors return a generic 500 without leaking stack or DB messages.
 */
export function handleRouteError(
  error: unknown,
  { route, validationMessage = "Invalid request" }: ErrorHandlerOptions,
) {
  if (error instanceof IntakeNotFoundError) {
    return jsonError(404, PUBLIC_API_ERRORS.notFoundIntake);
  }

  if (error instanceof InvalidVendorCategoryError) {
    return jsonError(400, PUBLIC_API_ERRORS.invalidVendorCategory);
  }

  if (error instanceof GroqConfigurationError) {
    return jsonError(503, "AI service is not configured");
  }

  if (error instanceof GroqGenerationError) {
    logRouteError(route, error);
    return jsonError(502, PUBLIC_API_ERRORS.groqFailed);
  }

  if (error instanceof ZodError) {
    return jsonValidationError(validationMessage, formatZodErrors(error));
  }

  if (error instanceof Error) {
    logRouteError(route, error);

    if (error.message.includes("Failed to create wedding intake")) {
      return jsonError(500, PUBLIC_API_ERRORS.saveIntakeFailed);
    }

    if (error.message.includes("Failed to save recommendations")) {
      return jsonError(500, PUBLIC_API_ERRORS.saveRecommendationsFailed);
    }

    if (error.message.includes("Failed to create payment")) {
      return jsonError(500, PUBLIC_API_ERRORS.savePaymentFailed);
    }

    if (error.message.includes("Corrupt recommendations")) {
      return jsonError(500, PUBLIC_API_ERRORS.corruptRecommendations);
    }
  } else {
    logRouteError(route, error);
  }

  return jsonError(500, PUBLIC_API_ERRORS.generic);
}

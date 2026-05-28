import "server-only";

import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

import { getGroqApiKey, hasGroqConfig } from "@/lib/env.server";
import {
  buildRecommendationRetryPrompt,
  buildRecommendationSystemPrompt,
  buildRecommendationUserPrompt,
} from "@/lib/prompts";
import { sanitizeRecommendRequest } from "@/lib/security/sanitize-intake";
import {
  parseAiRecommendations,
  type AiRecommendationsResponse,
  type RecommendRequest,
} from "@/lib/validators";

export const GROQ_MODEL = "llama-3.3-70b-versatile" as const;

const MAX_GENERATION_ATTEMPTS = 2;
const GROQ_REQUEST_TIMEOUT_MS = 45_000;

let groqClient: Groq | null = null;

export class GroqConfigurationError extends Error {
  constructor() {
    super("GROQ_API_KEY is not configured");
    this.name = "GroqConfigurationError";
  }
}

export class GroqGenerationError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "GroqGenerationError";
  }
}

/** Server-only Groq client — API key never enters client bundles. */
export function getGroqClient(): Groq {
  if (!hasGroqConfig()) {
    throw new GroqConfigurationError();
  }

  if (!groqClient) {
    groqClient = new Groq({
      apiKey: getGroqApiKey(),
    });
  }

  return groqClient;
}

function extractJsonContent(content: string | null | undefined): unknown {
  if (!content?.trim()) {
    throw new GroqGenerationError("Empty response from Groq");
  }

  const trimmed = content.trim();

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new GroqGenerationError("Response is not valid JSON");
    }
    return JSON.parse(jsonMatch[0]) as unknown;
  }
}

/**
 * Calls Groq with json_object response format, validates output, and retries once on failure.
 */
export async function generateVendorRecommendations(
  intake: RecommendRequest,
  totalBudgetInr: number,
): Promise<AiRecommendationsResponse> {
  const safeIntake = sanitizeRecommendRequest(intake);
  const groq = getGroqClient();
  const systemPrompt = buildRecommendationSystemPrompt();

  let lastValidationError = "Unknown validation error";

  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt++) {
    const userPrompt =
      attempt === 1
        ? buildRecommendationUserPrompt(safeIntake, totalBudgetInr)
        : buildRecommendationRetryPrompt(
            safeIntake,
            totalBudgetInr,
            lastValidationError,
          );

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    let parsedJson: unknown;

    try {
      const completion = await groq.chat.completions.create(
        {
          model: GROQ_MODEL,
          temperature: 0.35,
          max_tokens: 2048,
          response_format: { type: "json_object" },
          messages,
        },
        { signal: AbortSignal.timeout(GROQ_REQUEST_TIMEOUT_MS) },
      );

      parsedJson = extractJsonContent(completion.choices[0]?.message?.content);
    } catch (error) {
      if (attempt === MAX_GENERATION_ATTEMPTS) {
        throw new GroqGenerationError(
          "Failed to generate recommendations from Groq",
          error,
        );
      }
      lastValidationError =
        error instanceof Error ? error.message : "Groq request failed";
      continue;
    }

    const validated = parseAiRecommendations(parsedJson, totalBudgetInr);

    if (validated.success) {
      return validated.data;
    }

    lastValidationError = validated.error.issues
      .map((issue) => issue.message)
      .join("; ");

    if (attempt === MAX_GENERATION_ATTEMPTS) {
      throw new GroqGenerationError(
        `AI response failed validation: ${lastValidationError}`,
      );
    }
  }

  throw new GroqGenerationError("Failed to generate valid recommendations");
}

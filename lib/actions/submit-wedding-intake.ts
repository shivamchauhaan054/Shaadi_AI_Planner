"use server";

import { hasSupabaseConfig } from "@/lib/env";
import { hasGroqConfig } from "@/lib/env.server";
import { GroqGenerationError } from "@/lib/groq";
import { IntakeNotFoundError } from "@/lib/errors/intake";
import { processRecommendationRequest } from "@/lib/services/recommendations";
import { sanitizeDisplayText } from "@/lib/security/sanitize";
import { FIELD_LIMITS } from "@/lib/security/constants";
import { recommendRequestSchema } from "@/lib/validators";
import type { WeddingIntakeFormValues } from "@/lib/validations/wedding-intake";
import type { VendorRecommendation } from "@/lib/validators";

export type SubmitIntakeResult = {
  success: boolean;
  message: string;
  intakeId?: string;
  recommendations?: VendorRecommendation[];
};

export async function submitWeddingIntake(
  values: WeddingIntakeFormValues,
): Promise<SubmitIntakeResult> {
  const parsed = recommendRequestSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please complete all steps with valid information.",
    };
  }

  if (!hasSupabaseConfig() || !hasGroqConfig()) {
    return {
      success: false,
      message:
        "Recommendations are unavailable right now. Please try again later.",
    };
  }

  try {
    const result = await processRecommendationRequest(parsed.data);
    const cityLabel = sanitizeDisplayText(
      parsed.data.city,
      FIELD_LIMITS.city,
    );

    return {
      success: true,
      message: `Thank you! Your ${cityLabel} wedding recommendations are ready.`,
      intakeId: result.intake_id,
      recommendations: result.recommendations,
    };
  } catch (error) {
    if (error instanceof IntakeNotFoundError) {
      return {
        success: false,
        message: "We could not find your intake. Please try submitting again.",
      };
    }

    if (error instanceof GroqGenerationError) {
      return {
        success: false,
        message:
          "Our AI planner could not generate a valid plan. Please try again in a moment.",
      };
    }

    if (error instanceof Error) {
      console.error("[submitWeddingIntake]", error.message);

      if (error.message.includes("Corrupt recommendations")) {
        return {
          success: false,
          message: "Stored plan data is invalid. Please contact support.",
        };
      }
    }

    return {
      success: false,
      message:
        "We couldn't generate recommendations right now. Please try again shortly.",
    };
  }
}

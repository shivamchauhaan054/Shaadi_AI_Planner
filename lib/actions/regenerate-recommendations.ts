"use server";

import { hasSupabaseConfig } from "@/lib/env";
import { hasGroqConfig } from "@/lib/env.server";
import { getWeddingIntakeById } from "@/lib/db/wedding-intakes";
import { createRecommendationRecord } from "@/lib/db/recommendations";
import { generateVendorRecommendations } from "@/lib/groq";
import { BUDGET_OPTIONS } from "@/lib/constants/intake";
import { IntakeNotFoundError } from "@/lib/errors/intake";
import { GroqGenerationError } from "@/lib/groq";
import type { RecommendRequest } from "@/lib/validators";

export type RegenerateResult = {
  success: boolean;
  message: string;
};

export async function regenerateRecommendations(
  intakeId: string,
): Promise<RegenerateResult> {
  if (!hasSupabaseConfig() || !hasGroqConfig()) {
    return {
      success: false,
      message: "AI planning is currently unavailable. Please try again later.",
    };
  }

  try {
    // 1. Load the existing intake
    const intake = await getWeddingIntakeById(intakeId);
    if (!intake) {
      throw new IntakeNotFoundError(intakeId);
    }

    // 2. Map stored db record to RecommendRequest object
    const totalBudget = Number(intake.total_budget);
    const matchingOption =
      BUDGET_OPTIONS.find((b) => b.midpointInr === totalBudget) ||
      BUDGET_OPTIONS[1]; // fallback to 10l-20l

    const requestPayload: RecommendRequest = {
      weddingDate: intake.wedding_date,
      guestCount: intake.guest_count,
      city: intake.city,
      venueType: intake.venue_type as RecommendRequest["venueType"],
      budgetRange: matchingOption.value,
      priorities: (intake.priorities ?? []) as RecommendRequest["priorities"],
    };

    // 3. Generate recommendations from Groq
    const aiResponse = await generateVendorRecommendations(
      requestPayload,
      totalBudget,
    );

    // 4. Save new recommendations version in database
    await createRecommendationRecord(intake.id, aiResponse);

    return {
      success: true,
      message: "Your vendor recommendations have been successfully regenerated.",
    };
  } catch (error) {
    console.error("[regenerateRecommendations]", error);

    if (error instanceof IntakeNotFoundError) {
      return {
        success: false,
        message: "We couldn't find your wedding plan. Please try again.",
      };
    }

    if (error instanceof GroqGenerationError) {
      return {
        success: false,
        message: "Our AI planner failed to plan. Please try again shortly.",
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred during plan regeneration.",
    };
  }
}

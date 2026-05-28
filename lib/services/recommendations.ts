import { createRecommendationRecord } from "@/lib/db/recommendations";
import {
  createWeddingIntake,
  deleteWeddingIntake,
} from "@/lib/db/wedding-intakes";
import { generateVendorRecommendations } from "@/lib/groq";
import { intakeToDbPayload, resolveTotalBudgetInr } from "@/lib/intake-mapper";
import { sanitizeRecommendRequest } from "@/lib/security/sanitize-intake";
import type {
  AiRecommendationsResponse,
  RecommendRequest,
  VendorRecommendation,
} from "@/lib/validators";

export type RecommendResult = {
  intake_id: string;
  recommendations: VendorRecommendation[];
};

export async function processRecommendationRequest(
  intake: RecommendRequest,
): Promise<RecommendResult> {
  const safeIntake = sanitizeRecommendRequest(intake);
  const dbPayload = intakeToDbPayload(safeIntake);
  const totalBudgetInr = resolveTotalBudgetInr(safeIntake.budgetRange);

  const weddingIntake = await createWeddingIntake(dbPayload);

  let aiResponse: AiRecommendationsResponse;

  try {
    aiResponse = await generateVendorRecommendations(safeIntake, totalBudgetInr);
  } catch (error) {
    await deleteWeddingIntake(weddingIntake.id).catch((rollbackError) => {
      console.error(
        "[processRecommendationRequest] Rollback failed:",
        rollbackError,
      );
    });
    throw error;
  }

  const SAVE_ATTEMPTS = 2;
  let lastSaveError: unknown;

  for (let attempt = 1; attempt <= SAVE_ATTEMPTS; attempt++) {
    try {
      await createRecommendationRecord(weddingIntake.id, aiResponse);
      lastSaveError = undefined;
      break;
    } catch (error) {
      lastSaveError = error;
      if (attempt === SAVE_ATTEMPTS) break;
    }
  }

  if (lastSaveError) {
    throw lastSaveError instanceof Error
      ? lastSaveError
      : new Error("Failed to save recommendations");
  }

  return {
    intake_id: weddingIntake.id,
    recommendations: aiResponse.recommendations,
  };
}

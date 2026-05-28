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
    await createRecommendationRecord(weddingIntake.id, aiResponse);
  } catch (error) {
    await deleteWeddingIntake(weddingIntake.id).catch((rollbackError) => {
      console.error(
        "[processRecommendationRequest] Rollback failed:",
        rollbackError,
      );
    });
    throw error;
  }

  return {
    intake_id: weddingIntake.id,
    recommendations: aiResponse.recommendations,
  };
}

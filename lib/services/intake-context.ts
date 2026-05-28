import { getLatestRecommendationByIntakeId } from "@/lib/db/recommendations";
import { getWeddingIntakeById } from "@/lib/db/wedding-intakes";
import { IntakeNotFoundError } from "@/lib/errors/intake";
import {
  parseStoredRecommendations,
  type VendorRecommendation,
} from "@/lib/validators";
import type { WeddingIntake } from "@/types/database";

export type IntakeWithRecommendations = {
  intake: WeddingIntake;
  recommendations: VendorRecommendation[];
  generatedAt: string | null;
};

export async function loadIntakeWithRecommendations(
  intakeId: string,
): Promise<IntakeWithRecommendations> {
  const intake = await getWeddingIntakeById(intakeId);
  if (!intake) {
    throw new IntakeNotFoundError(intakeId);
  }

  const record = await getLatestRecommendationByIntakeId(intakeId);
  const recommendations = record
    ? parseStoredRecommendations(record.recommendations)
    : [];

  return {
    intake,
    recommendations,
    generatedAt: record?.created_at ?? null,
  };
}

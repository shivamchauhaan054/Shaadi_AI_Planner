import { buildBudgetSnapshot } from "@/lib/budget/snapshot";
import { listPaymentsForIntake } from "@/lib/services/payments";
import { loadIntakeWithRecommendations } from "@/lib/services/intake-context";
import { getRecommendationsHistory } from "@/lib/db/recommendations";
import { parseStoredRecommendations } from "@/lib/validators";
import type { RecommendationDetailsResponse } from "@/lib/validators";

export { IntakeNotFoundError } from "@/lib/errors/intake";

export async function getRecommendationDetails(
  intakeId: string,
): Promise<RecommendationDetailsResponse> {
  const { intake, recommendations, generatedAt } =
    await loadIntakeWithRecommendations(intakeId);

  const payments = await listPaymentsForIntake(intakeId);
  const totalBudget = Number(intake.total_budget);
  const { category_budgets, budget_summary } = buildBudgetSnapshot(
    totalBudget,
    recommendations,
    payments,
  );

  // Fetch complete version history
  const rawHistory = await getRecommendationsHistory(intakeId);
  const versions = rawHistory.map((rec) => {
    let parsedRecs: ReturnType<typeof parseStoredRecommendations> = [];
    try {
      parsedRecs = parseStoredRecommendations(rec.recommendations);
    } catch (e) {
      console.error("[getRecommendationDetails] Failed to parse version:", rec.id, e);
    }
    return {
      id: rec.id,
      created_at: new Date(rec.created_at).toISOString(),
      recommendations: parsedRecs,
    };
  });

  return {
    intake_id: intake.id,
    wedding_date: intake.wedding_date,
    city: intake.city,
    guest_count: intake.guest_count,
    venue_type: intake.venue_type,
    total_budget: totalBudget,
    priorities: intake.priorities ?? [],
    recommendations,
    budget_summary,
    category_budgets,
    payments,
    vendor_categories: recommendations.map((r) => r.vendor_category),
    generated_at: generatedAt,
    versions,
  };
}


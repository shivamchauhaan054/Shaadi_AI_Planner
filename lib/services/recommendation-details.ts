import { buildBudgetSnapshot } from "@/lib/budget/snapshot";
import { listPaymentsForIntake } from "@/lib/services/payments";
import { loadIntakeWithRecommendations } from "@/lib/services/intake-context";
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
  };
}

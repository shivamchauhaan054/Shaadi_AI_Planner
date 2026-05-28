import { BUDGET_OPTIONS } from "@/lib/constants/intake";
import type { RecommendRequest } from "@/lib/validators";
import type { WeddingIntakeInsert } from "@/types/database";

export function resolveTotalBudgetInr(budgetRange: RecommendRequest["budgetRange"]): number {
  const option = BUDGET_OPTIONS.find((b) => b.value === budgetRange);
  if (!option) {
    throw new Error(`Unknown budget range: ${budgetRange}`);
  }
  return option.midpointInr;
}

export function intakeToDbPayload(intake: RecommendRequest): WeddingIntakeInsert {
  return {
    wedding_date: intake.weddingDate,
    guest_count: intake.guestCount,
    city: intake.city.trim(),
    venue_type: intake.venueType,
    total_budget: resolveTotalBudgetInr(intake.budgetRange),
    priorities: intake.priorities,
  };
}

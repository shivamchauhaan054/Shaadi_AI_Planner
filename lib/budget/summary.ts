import type { BudgetSummary } from "@/lib/validations/budget-summary";
import type { VendorRecommendation } from "@/lib/validators";

export function computeBudgetSummary(
  totalBudget: number,
  recommendations: VendorRecommendation[],
  totalSpent = 0,
): BudgetSummary {
  const totalAllocated = recommendations.reduce(
    (sum, item) => sum + item.suggested_budget,
    0,
  );

  return {
    total_budget: totalBudget,
    total_allocated: totalAllocated,
    total_spent: totalSpent,
    remaining: totalBudget - totalSpent,
    unallocated: Math.max(0, totalBudget - totalAllocated),
  };
}

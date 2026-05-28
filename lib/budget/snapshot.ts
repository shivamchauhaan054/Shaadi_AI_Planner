import {
  buildCategoryBudgets,
  computeTotalSpent,
} from "@/lib/budget/calculations";
import { computeBudgetSummary } from "@/lib/budget/summary";
import type { BudgetSummary } from "@/lib/validations/budget-summary";
import type { CategoryBudget, PaymentRecord } from "@/lib/validations/payments";
import type { VendorRecommendation } from "@/lib/validators";

export type BudgetSnapshot = {
  category_budgets: CategoryBudget[];
  budget_summary: BudgetSummary;
};

/**
 * Single source of truth for category rows and summary totals
 * (recommendation details + payment recording).
 */
export function buildBudgetSnapshot(
  totalBudget: number,
  recommendations: VendorRecommendation[],
  payments: PaymentRecord[],
): BudgetSnapshot {
  const category_budgets = buildCategoryBudgets(recommendations, payments);
  const budget_summary = computeBudgetSummary(
    totalBudget,
    recommendations,
    computeTotalSpent(payments),
  );

  return { category_budgets, budget_summary };
}

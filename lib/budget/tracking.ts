import type { RecommendationDetailsResponse } from "@/lib/validators";

export type BudgetTrackingData = Pick<
  RecommendationDetailsResponse,
  "budget_summary" | "category_budgets" | "payments" | "vendor_categories"
>;

export function selectBudgetTrackingData(
  data: RecommendationDetailsResponse,
): BudgetTrackingData {
  return {
    budget_summary: data.budget_summary,
    category_budgets: data.category_budgets,
    payments: data.payments,
    vendor_categories: data.vendor_categories,
  };
}

export function mergeBudgetTrackingData(
  data: RecommendationDetailsResponse,
  patch: BudgetTrackingData,
): RecommendationDetailsResponse {
  return {
    ...data,
    budget_summary: patch.budget_summary,
    category_budgets: patch.category_budgets,
    payments: patch.payments,
  };
}

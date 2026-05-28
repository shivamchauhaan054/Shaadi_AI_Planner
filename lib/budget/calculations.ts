import type { CategoryBudget, PaymentRecord } from "@/lib/validations/payments";
import type { VendorRecommendation } from "@/lib/validators";

export function buildCategoryBudgets(
  recommendations: VendorRecommendation[],
  payments: PaymentRecord[],
): CategoryBudget[] {
  const map = new Map<string, { allocated: number; spent: number }>();

  for (const rec of recommendations) {
    map.set(rec.vendor_category, {
      allocated: rec.suggested_budget,
      spent: 0,
    });
  }

  for (const payment of payments) {
    const current = map.get(payment.vendor_category) ?? {
      allocated: 0,
      spent: 0,
    };
    current.spent += payment.amount_paid;
    map.set(payment.vendor_category, current);
  }

  return Array.from(map.entries())
    .map(([vendor_category, { allocated, spent }]) => ({
      vendor_category,
      allocated,
      spent,
      remaining: allocated - spent,
    }))
    .sort((a, b) => a.vendor_category.localeCompare(b.vendor_category));
}

export function computeTotalSpent(payments: PaymentRecord[]): number {
  return payments.reduce((sum, payment) => sum + payment.amount_paid, 0);
}

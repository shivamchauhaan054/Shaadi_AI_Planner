import { sortPaymentsByDateDesc } from "@/lib/budget/payments";
import { buildBudgetSnapshot } from "@/lib/budget/snapshot";
import { createPayment, getPaymentsByIntakeId } from "@/lib/db/payments";
import { toPaymentRecord } from "@/lib/db/mappers/payment";
import { InvalidVendorCategoryError } from "@/lib/errors/payment";
import { loadIntakeWithRecommendations } from "@/lib/services/intake-context";
import type { CreatePaymentInput } from "@/lib/validations/payments";
import type {
  CreatePaymentResponse,
  PaymentRecord,
} from "@/lib/validations/payments";

export async function listPaymentsForIntake(
  intakeId: string,
): Promise<PaymentRecord[]> {
  const rows = await getPaymentsByIntakeId(intakeId);
  return sortPaymentsByDateDesc(rows.map(toPaymentRecord));
}

function assertVendorCategoryAllowed(
  category: string,
  allowed: string[],
): void {
  const normalized = category.trim();
  if (!allowed.includes(normalized)) {
    throw new InvalidVendorCategoryError(normalized, allowed);
  }
}

export async function recordPayment(
  input: CreatePaymentInput,
): Promise<CreatePaymentResponse> {
  const { intake, recommendations } = await loadIntakeWithRecommendations(
    input.intake_id,
  );

  const vendorCategories = recommendations.map((r) => r.vendor_category);
  assertVendorCategoryAllowed(input.vendor_category, vendorCategories);

  const row = await createPayment({
    intake_id: input.intake_id,
    vendor_category: input.vendor_category.trim(),
    vendor_name: input.vendor_name.trim(),
    amount_paid: input.amount_paid,
    payment_date: input.payment_date,
  });

  const payment = toPaymentRecord(row);
  const payments = await listPaymentsForIntake(input.intake_id);
  const { category_budgets, budget_summary } = buildBudgetSnapshot(
    Number(intake.total_budget),
    recommendations,
    payments,
  );

  return {
    payment,
    payments,
    category_budgets,
    budget_summary,
  };
}

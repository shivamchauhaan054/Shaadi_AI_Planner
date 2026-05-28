import type { PaymentRecord } from "@/lib/validations/payments";

export function sortPaymentsByDateDesc(
  payments: PaymentRecord[],
): PaymentRecord[] {
  return [...payments].sort(
    (a, b) =>
      new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime(),
  );
}

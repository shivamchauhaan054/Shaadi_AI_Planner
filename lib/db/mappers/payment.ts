import type { Payment } from "@/types/database";
import {
  paymentRecordSchema,
  type PaymentRecord,
} from "@/lib/validations/payments";

/** Maps a Supabase payment row to the API contract (Zod-validated). */
export function toPaymentRecord(row: Payment): PaymentRecord {
  return paymentRecordSchema.parse({
    id: row.id,
    intake_id: row.intake_id,
    vendor_category: row.vendor_category,
    vendor_name: row.vendor_name,
    amount_paid: Number(row.amount_paid),
    payment_date: row.payment_date,
    created_at: row.created_at,
  });
}

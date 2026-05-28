import { createServerClient } from "@/lib/supabase";
import type { Payment, PaymentInsert } from "@/types/database";

export async function createPayment(
  payload: PaymentInsert,
): Promise<Payment> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("payments")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create payment: ${error.message}`);
  }

  return data;
}

export async function getPaymentsByIntakeId(
  intakeId: string,
): Promise<Payment[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("payments")
    .select()
    .eq("intake_id", intakeId)
    .order("payment_date", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch payments: ${error.message}`);
  }

  return data ?? [];
}

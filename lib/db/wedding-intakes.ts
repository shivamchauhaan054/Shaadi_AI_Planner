import { createServerClient } from "@/lib/supabase";
import type {
  WeddingIntake,
  WeddingIntakeInsert,
} from "@/types/database";

export async function createWeddingIntake(
  payload: WeddingIntakeInsert,
): Promise<WeddingIntake> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("wedding_intakes")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create wedding intake: ${error.message}`);
  }

  return data;
}

export async function getWeddingIntakeById(
  id: string,
): Promise<WeddingIntake | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("wedding_intakes")
    .select()
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch wedding intake: ${error.message}`);
  }

  return data;
}

export async function deleteWeddingIntake(id: string): Promise<void> {
  const supabase = createServerClient();

  const { error } = await supabase.from("wedding_intakes").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete wedding intake: ${error.message}`);
  }
}

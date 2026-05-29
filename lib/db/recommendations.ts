import { createServerClient } from "@/lib/supabase";
import type { AiRecommendationsResponse } from "@/lib/validators";
import type { Recommendation } from "@/types/database";

export async function createRecommendationRecord(
  intakeId: string,
  payload: AiRecommendationsResponse,
): Promise<Recommendation> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("recommendations")
    .insert({
      intake_id: intakeId,
      recommendations: payload,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save recommendations: ${error.message}`);
  }

  return data;
}

export async function getLatestRecommendationByIntakeId(
  intakeId: string,
): Promise<Recommendation | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("recommendations")
    .select()
    .eq("intake_id", intakeId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch recommendations: ${error.message}`);
  }

  return data;
}

export async function getRecommendationsHistory(
  intakeId: string,
): Promise<Recommendation[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("recommendations")
    .select()
    .eq("intake_id", intakeId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch recommendations history: ${error.message}`);
  }

  return data ?? [];
}


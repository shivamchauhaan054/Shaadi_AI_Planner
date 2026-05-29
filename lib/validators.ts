import { z } from "zod";

import { budgetSummarySchema } from "@/lib/validations/budget-summary";
import {
  categoryBudgetSchema,
  paymentRecordSchema,
} from "@/lib/validations/payments";
import { weddingIntakeSchema } from "@/lib/validations/wedding-intake";

/** POST /api/recommend request body — same shape as the intake form */
export const recommendRequestSchema = weddingIntakeSchema;

export type RecommendRequest = z.infer<typeof recommendRequestSchema>;

export const vendorRecommendationSchema = z.object({
  vendor_category: z
    .string()
    .min(1, "vendor_category is required")
    .max(80, "vendor_category is too long"),
  priority_rank: z
    .number()
    .int("priority_rank must be an integer")
    .min(1)
    .max(5),
  suggested_budget: z
    .number()
    .positive("suggested_budget must be positive")
    .finite(),
  rationale: z
    .string()
    .min(10, "rationale is too short")
    .max(280, "rationale must be concise (max 280 characters)"),
});

export type VendorRecommendation = z.infer<typeof vendorRecommendationSchema>;

const EXPECTED_RANKS = [1, 2, 3, 4, 5] as const;

/**
 * Validates the LLM JSON output against the contract, including budget fit.
 */
export function createAiRecommendationsSchema(totalBudgetInr: number) {
  return z
    .object({
      recommendations: z
        .array(vendorRecommendationSchema)
        .length(5, "Exactly 5 recommendations are required"),
    })
    .superRefine((data, ctx) => {
      const ranks = data.recommendations.map((r) => r.priority_rank);
      const uniqueRanks = new Set(ranks);

      if (uniqueRanks.size !== 5) {
        ctx.addIssue({
          code: "custom",
          message: "priority_rank values must be unique integers from 1 to 5",
          path: ["recommendations"],
        });
      }

      for (const expected of EXPECTED_RANKS) {
        if (!uniqueRanks.has(expected)) {
          ctx.addIssue({
            code: "custom",
            message: `Missing priority_rank ${expected}`,
            path: ["recommendations"],
          });
          break;
        }
      }

      const totalSuggested = data.recommendations.reduce(
        (sum, item) => sum + item.suggested_budget,
        0,
      );

      if (totalSuggested > totalBudgetInr) {
        ctx.addIssue({
          code: "custom",
          message: `Sum of suggested_budget (${totalSuggested}) exceeds total budget (${totalBudgetInr})`,
          path: ["recommendations"],
        });
      }
    });
}

export type AiRecommendationsResponse = z.infer<
  ReturnType<typeof createAiRecommendationsSchema>
>;

export function parseAiRecommendations(
  data: unknown,
  totalBudgetInr: number,
):
  | { success: true; data: AiRecommendationsResponse }
  | { success: false; error: z.ZodError } {
  const schema = createAiRecommendationsSchema(totalBudgetInr);
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, error: result.error };
}

export { intakeIdSchema as intakeIdParamSchema } from "@/lib/validations/primitives";

export {
  budgetSummarySchema,
  type BudgetSummary,
} from "@/lib/validations/budget-summary";

export const recommendationVersionSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string(),
  recommendations: z.array(vendorRecommendationSchema),
});

export const recommendationDetailsResponseSchema = z.object({
  intake_id: z.string().uuid(),
  wedding_date: z.string(),
  city: z.string(),
  guest_count: z.number().int().positive(),
  venue_type: z.string(),
  total_budget: z.number().nonnegative(),
  priorities: z.array(z.string()),
  recommendations: z.array(vendorRecommendationSchema),
  budget_summary: budgetSummarySchema,
  category_budgets: z.array(categoryBudgetSchema),
  payments: z.array(paymentRecordSchema),
  vendor_categories: z.array(z.string()),
  generated_at: z.string().nullable(),
  versions: z.array(recommendationVersionSchema).optional(),
});


export type RecommendationDetailsResponse = z.infer<
  typeof recommendationDetailsResponseSchema
>;

const storedRecommendationsSchema = z.object({
  recommendations: z.array(vendorRecommendationSchema),
});

export function parseStoredRecommendations(
  payload: unknown,
): VendorRecommendation[] {
  const parsed = storedRecommendationsSchema.safeParse(payload);

  if (!parsed.success) {
    throw new Error(
      `Corrupt recommendations payload: ${parsed.error.issues.map((i) => i.message).join("; ")}`,
    );
  }

  return [...parsed.data.recommendations].sort(
    (a, b) => a.priority_rank - b.priority_rank,
  );
}

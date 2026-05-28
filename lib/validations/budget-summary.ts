import { z } from "zod";

export const budgetSummarySchema = z.object({
  total_budget: z.number().nonnegative(),
  total_allocated: z.number().nonnegative(),
  total_spent: z.number().nonnegative(),
  /** Wedding cap minus recorded payments (runway left). */
  remaining: z.number(),
  /** Cap minus AI allocations (not yet assigned to vendor lines). */
  unallocated: z.number().nonnegative(),
});

export type BudgetSummary = z.infer<typeof budgetSummarySchema>;

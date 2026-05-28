import { z } from "zod";

export const budgetSummarySchema = z.object({
  total_budget: z.number().nonnegative(),
  total_allocated: z.number().nonnegative(),
  total_spent: z.number().nonnegative(),
  remaining: z.number(),
});

export type BudgetSummary = z.infer<typeof budgetSummarySchema>;

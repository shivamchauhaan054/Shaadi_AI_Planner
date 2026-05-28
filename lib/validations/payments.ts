import { isBefore, startOfDay } from "date-fns";
import { z } from "zod";

import { budgetSummarySchema } from "@/lib/validations/budget-summary";
import {
  intakeIdSchema,
  isoDateStringSchema,
  vendorCategoryFieldSchema,
  vendorNameFieldSchema,
} from "@/lib/validations/primitives";

export const createPaymentSchema = z
  .object({
    intake_id: intakeIdSchema,
    vendor_category: vendorCategoryFieldSchema,
    vendor_name: vendorNameFieldSchema,
    amount_paid: z.coerce
      .number({ message: "Amount is required" })
      .positive("Amount must be greater than zero")
      .max(100_000_000, "Amount exceeds maximum"),
    payment_date: isoDateStringSchema
      .refine((value) => {
        const date = startOfDay(new Date(value));
        return !Number.isNaN(date.getTime());
      }, "Invalid payment date")
      .refine((value) => {
        const date = startOfDay(new Date(value));
        return !isBefore(date, startOfDay(new Date("2000-01-01")));
      }, "Payment date is too far in the past"),
  })
  .strict();

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

/**
 * Client form schema — mirrors API rules minus intake_id.
 * Uses `z.number()` (not coerce) because react-hook-form supplies numbers via valueAsNumber.
 */
export const paymentFormSchema = createPaymentSchema
  .omit({ intake_id: true, amount_paid: true })
  .extend({
    amount_paid: z
      .number({ message: "Amount is required" })
      .positive("Amount must be greater than zero")
      .max(100_000_000, "Amount exceeds maximum"),
  })
  .strict();

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export const paymentRecordSchema = z.object({
  id: intakeIdSchema,
  intake_id: intakeIdSchema,
  vendor_category: z.string(),
  vendor_name: z.string(),
  amount_paid: z.number().nonnegative(),
  payment_date: isoDateStringSchema,
  created_at: z.string().min(1),
});

export type PaymentRecord = z.infer<typeof paymentRecordSchema>;

export const categoryBudgetSchema = z.object({
  vendor_category: z.string(),
  allocated: z.number().nonnegative(),
  spent: z.number().nonnegative(),
  remaining: z.number(),
});

export type CategoryBudget = z.infer<typeof categoryBudgetSchema>;

export const createPaymentResponseSchema = z.object({
  payment: paymentRecordSchema,
  payments: z.array(paymentRecordSchema),
  category_budgets: z.array(categoryBudgetSchema),
  budget_summary: budgetSummarySchema,
});

export type CreatePaymentResponse = z.infer<typeof createPaymentResponseSchema>;

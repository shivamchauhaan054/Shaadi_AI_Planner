import { isBefore, startOfDay } from "date-fns";
import { z } from "zod";

import {
  BUDGET_OPTIONS,
  MAX_PRIORITIES,
  PRIORITY_OPTIONS,
  VENUE_OPTIONS,
} from "@/lib/constants/intake";
import { cityFieldSchema, isoDateStringSchema } from "@/lib/validations/primitives";

const venueValues = VENUE_OPTIONS.map((v) => v.value) as [
  (typeof VENUE_OPTIONS)[number]["value"],
  ...(typeof VENUE_OPTIONS)[number]["value"][],
];

const budgetValues = BUDGET_OPTIONS.map((b) => b.value) as [
  (typeof BUDGET_OPTIONS)[number]["value"],
  ...(typeof BUDGET_OPTIONS)[number]["value"][],
];

const priorityValues = PRIORITY_OPTIONS.map((p) => p.value) as [
  (typeof PRIORITY_OPTIONS)[number]["value"],
  ...(typeof PRIORITY_OPTIONS)[number]["value"][],
];

export const intakeStep1Schema = z.object({
  weddingDate: isoDateStringSchema.refine((value) => {
    const date = startOfDay(new Date(value));
    if (Number.isNaN(date.getTime())) return false;
    return !isBefore(date, startOfDay(new Date()));
  }, "Wedding date must be today or in the future"),
  guestCount: z
    .number({ message: "Enter guest count" })
    .int("Guest count must be a whole number")
    .min(50, "Minimum 50 guests")
    .max(5000, "Maximum 5,000 guests"),
});

export const intakeStep2Schema = z.object({
  city: cityFieldSchema,
  venueType: z.enum(venueValues, {
    message: "Select a venue type",
  }),
});

export const intakeStep3Schema = z.object({
  budgetRange: z.enum(budgetValues, {
    message: "Select a budget range",
  }),
});

export const intakeStep4Schema = z.object({
  priorities: z
    .array(z.enum(priorityValues))
    .min(1, "Select at least one priority")
    .max(MAX_PRIORITIES, `Select up to ${MAX_PRIORITIES} priorities`),
});

export const weddingIntakeSchema = intakeStep1Schema
  .merge(intakeStep2Schema)
  .merge(intakeStep3Schema)
  .merge(intakeStep4Schema)
  .strict();

export type WeddingIntakeFormValues = z.infer<typeof weddingIntakeSchema>;

export type IntakeStep1Values = z.infer<typeof intakeStep1Schema>;
export type IntakeStep2Values = z.infer<typeof intakeStep2Schema>;
export type IntakeStep3Values = z.infer<typeof intakeStep3Schema>;
export type IntakeStep4Values = z.infer<typeof intakeStep4Schema>;

export const INTAKE_STEP_SCHEMAS = [
  intakeStep1Schema,
  intakeStep2Schema,
  intakeStep3Schema,
  intakeStep4Schema,
] as const;

export const INTAKE_STEP_FIELDS: (keyof WeddingIntakeFormValues)[][] = [
  ["weddingDate", "guestCount"],
  ["city", "venueType"],
  ["budgetRange"],
  ["priorities"],
];

export function isStepValid(
  stepIndex: number,
  values: Partial<WeddingIntakeFormValues>,
): boolean {
  const schema = INTAKE_STEP_SCHEMAS[stepIndex];
  if (!schema) return false;
  return schema.safeParse(values).success;
}

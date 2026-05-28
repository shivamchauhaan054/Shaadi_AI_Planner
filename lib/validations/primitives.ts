import { z } from "zod";

import { FIELD_LIMITS } from "@/lib/security/constants";
import { sanitizeDisplayText } from "@/lib/security/sanitize";

const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;

/** ISO calendar date (YYYY-MM-DD) — matches Postgres `DATE` serialization. */
export const isoDateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD");

export const intakeIdSchema = z.string().uuid("Invalid intake id");

function hasNoControlChars(value: string): boolean {
  return !CONTROL_CHARS.test(value);
}

/**
 * Human-readable text stored in DB or shown in UI.
 * Trims, strips control characters, enforces max length.
 */
export function safeTextField(label: string, maxLength: number) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(maxLength, `${label} is too long`)
    .refine(hasNoControlChars, `${label} contains invalid characters`)
    .transform((value) => sanitizeDisplayText(value, maxLength));
}

export const cityFieldSchema = safeTextField("City", FIELD_LIMITS.city);
export const vendorNameFieldSchema = safeTextField(
  "Vendor name",
  FIELD_LIMITS.vendorName,
);
export const vendorCategoryFieldSchema = safeTextField(
  "Vendor category",
  FIELD_LIMITS.vendorCategory,
);

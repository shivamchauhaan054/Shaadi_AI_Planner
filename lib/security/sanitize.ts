import { FIELD_LIMITS } from "@/lib/security/constants";

const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

/**
 * Strips control characters and enforces a max length.
 * Use for values shown to users (toasts, labels).
 */
export function sanitizeDisplayText(value: string, maxLength: number): string {
  return value.replace(CONTROL_CHARS, "").trim().slice(0, maxLength);
}

/**
 * Sanitizes untrusted text embedded in LLM prompts to reduce injection risk.
 * Removes control chars, collapses excessive newlines, and caps length.
 */
export function sanitizePromptField(value: string, maxLength: number): string {
  const cleaned = value
    .replace(CONTROL_CHARS, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);

  return cleaned;
}

/**
 * Sanitizes internal validation messages before they are echoed in a retry prompt.
 * Never pass raw user input or stack traces through this for display.
 */
export function sanitizeInternalPromptNote(value: string): string {
  return sanitizePromptField(value, FIELD_LIMITS.internalErrorSnippet);
}

import { FIELD_LIMITS } from "@/lib/security/constants";
import { sanitizePromptField } from "@/lib/security/sanitize";
import type { RecommendRequest } from "@/lib/validators";

/**
 * Defense-in-depth sanitization before LLM prompts and persistence.
 * Zod already validated shape/enums; this strips risky characters from free text.
 */
export function sanitizeRecommendRequest(
  intake: RecommendRequest,
): RecommendRequest {
  return {
    ...intake,
    city: sanitizePromptField(intake.city, FIELD_LIMITS.city),
  };
}

/** Maximum JSON request body size for POST /api/* routes (bytes). */
export const MAX_JSON_BODY_BYTES = 64 * 1024;

/** Field length limits aligned with DB columns and prompt safety. */
export const FIELD_LIMITS = {
  city: 100,
  vendorName: 120,
  vendorCategory: 80,
  promptField: 200,
  internalErrorSnippet: 240,
} as const;

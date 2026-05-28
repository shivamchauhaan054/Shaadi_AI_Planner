import { z } from "zod";

export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const flattened = error.flatten();
  const fieldErrors: Record<string, string[]> = {};

  for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
    if (Array.isArray(messages) && messages.length > 0) {
      fieldErrors[key] = messages;
    }
  }

  return fieldErrors;
}

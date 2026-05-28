import { intakeIdSchema } from "@/lib/validations/primitives";

export type ParsedRouteId =
  | { ok: true; id: string }
  | { ok: false; message: string };

/** Validates dynamic `[id]` route segments as UUIDs. */
export function parseIntakeIdParam(raw: string | undefined): ParsedRouteId {
  const parsed = intakeIdSchema.safeParse(raw);

  if (!parsed.success) {
    return { ok: false, message: "Invalid intake id" };
  }

  return { ok: true, id: parsed.data };
}

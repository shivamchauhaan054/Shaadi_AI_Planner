import {
  INTAKE_STEP_FIELDS,
  type WeddingIntakeFormValues,
} from "@/lib/validations/wedding-intake";

/**
 * Merges react-hook-form watch output for the active step into full form values.
 * RHF returns an array when `name` is a field-name array, or a scalar when only
 * one field is watched — both shapes must be handled for correct step gating.
 */
export function mergeStepWatchValues(
  stepIndex: number,
  base: WeddingIntakeFormValues,
  watched: unknown,
): WeddingIntakeFormValues {
  const fieldNames = INTAKE_STEP_FIELDS[stepIndex];
  if (!fieldNames?.length) {
    return base;
  }

  if (Array.isArray(watched) && watched.length === fieldNames.length) {
    const patch = Object.fromEntries(
      fieldNames.map((field, index) => [field, watched[index]]),
    ) as Partial<WeddingIntakeFormValues>;

    return { ...base, ...patch };
  }

  if (fieldNames.length === 1 && watched !== undefined) {
    return {
      ...base,
      [fieldNames[0]]: watched,
    } as WeddingIntakeFormValues;
  }

  return base;
}

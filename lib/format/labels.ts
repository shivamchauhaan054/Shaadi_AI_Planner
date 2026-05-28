import { PRIORITY_OPTIONS, VENUE_OPTIONS } from "@/lib/constants/intake";

export function formatVenueType(value: string): string {
  return (
    VENUE_OPTIONS.find((v) => v.value === value)?.label ??
    value.replace(/-/g, " ")
  );
}

export function formatPriority(value: string): string {
  return (
    PRIORITY_OPTIONS.find((p) => p.value === value)?.label ??
    value.charAt(0).toUpperCase() + value.slice(1)
  );
}

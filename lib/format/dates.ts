import { format, isValid, parseISO } from "date-fns";

export function parseDateSafe(value: string): Date | null {
  const parsed = parseISO(value.includes("T") ? value : `${value}T12:00:00`);
  return isValid(parsed) ? parsed : null;
}

export function formatDisplayDate(
  value: string,
  pattern = "PPP",
  fallback = "—",
): string {
  const date = parseDateSafe(value);
  if (!date) return fallback;
  return format(date, pattern);
}

export function formatTodayIsoDate(): string {
  return format(new Date(), "yyyy-MM-dd");
}

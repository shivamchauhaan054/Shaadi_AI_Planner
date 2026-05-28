const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrCompactFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatInr(amount: number): string {
  return inrFormatter.format(amount);
}

export function formatInrCompact(amount: number): string {
  if (amount >= 100_000) {
    return inrCompactFormatter.format(amount);
  }
  return formatInr(amount);
}

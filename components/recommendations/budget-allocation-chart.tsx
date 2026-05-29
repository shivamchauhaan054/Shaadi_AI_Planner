"use client";

import { useMemo } from "react";
import type { VendorRecommendation } from "@/lib/validators";

type BudgetAllocationChartProps = {
  recommendations: VendorRecommendation[];
  totalBudget: number;
};

const PALETTE = [
  "bg-primary",
  "bg-accent",
  "bg-rose-700/80",
  "bg-amber-600/70",
  "bg-rose-400/70",
];

const BORDER_PALETTE = [
  "border-primary/20",
  "border-accent/20",
  "border-rose-700/20",
  "border-amber-600/20",
  "border-rose-400/20",
];

const TEXT_PALETTE = [
  "text-primary",
  "text-accent",
  "text-rose-700",
  "text-amber-600",
  "text-rose-500",
];

const DOT_PALETTE = [
  "bg-primary",
  "bg-accent",
  "bg-rose-700",
  "bg-amber-600",
  "bg-rose-400",
];

export function BudgetAllocationChart({
  recommendations,
  totalBudget,
}: BudgetAllocationChartProps) {
  const chartData = useMemo(() => {
    const totalAllocated = recommendations.reduce(
      (sum, item) => sum + item.suggested_budget,
      0,
    );

    if (totalAllocated === 0) return [];

    return recommendations.map((item, index) => {
      const percentage = (item.suggested_budget / totalAllocated) * 100;
      const totalPercentage = (item.suggested_budget / totalBudget) * 100;
      return {
        category: item.vendor_category,
        amount: item.suggested_budget,
        percentage,
        totalPercentage,
        colorClass: PALETTE[index % PALETTE.length],
        dotClass: DOT_PALETTE[index % DOT_PALETTE.length],
        textClass: TEXT_PALETTE[index % TEXT_PALETTE.length],
        borderClass: BORDER_PALETTE[index % BORDER_PALETTE.length],
      };
    });
  }, [recommendations, totalBudget]);

  if (chartData.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
      <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            Budget Distribution
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            AI-optimized breakdown across priority vendor allocations
          </p>
        </div>
        <div className="text-left sm:text-right">
          <span className="font-mono text-xs text-muted-foreground">
            Total Allocated:
          </span>
          <p className="font-sans text-sm font-semibold text-primary">
            ₹
            {recommendations
              .reduce((sum, item) => sum + item.suggested_budget, 0)
              .toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Horizontal Stacked Bar */}
      <div className="relative h-4.5 w-full overflow-hidden rounded-full bg-secondary/50 flex shadow-inner">
        {chartData.map((item, i) => {
          if (item.percentage < 1) return null; // hide very small segments
          return (
            <div
              key={i}
              className={`h-full ${item.colorClass} first:rounded-l-full last:rounded-r-full transition-all duration-500 ease-out hover:brightness-95 hover:scale-y-110 relative group cursor-help`}
              style={{ width: `${item.percentage}%` }}
              title={`${item.category}: ₹${item.amount.toLocaleString("en-IN")} (${item.percentage.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      {/* Legend Grid */}
      <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-t border-border/40 pt-5">
        {chartData.map((item, i) => (
          <div
            key={i}
            className="flex flex-col gap-1 rounded-xl border border-border/40 bg-secondary/10 p-3 transition-colors hover:bg-secondary/20"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`size-2 shrink-0 rounded-full ${item.dotClass}`} />
              <span className="truncate font-sans text-xs font-medium text-foreground">
                {item.category}
              </span>
            </div>
            <div className="pl-3.5 mt-0.5">
              <span className="font-sans text-xs font-semibold text-foreground">
                ₹{item.amount.toLocaleString("en-IN")}
              </span>
              <span className="block text-[10px] text-muted-foreground font-mono">
                {item.percentage.toFixed(1)}% of allocated
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

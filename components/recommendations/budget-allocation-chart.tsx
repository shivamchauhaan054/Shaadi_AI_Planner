"use client";

import { useMemo } from "react";
import { PieChart } from "lucide-react";

import { InlineEmpty } from "@/components/shared/inline-empty";
import type { VendorRecommendation } from "@/lib/validators";

type BudgetAllocationChartProps = {
  recommendations: VendorRecommendation[];
  totalBudget: number;
};

const PALETTE = [
  "bg-[hsl(var(--chart-1))]",
  "bg-[hsl(var(--chart-2))]",
  "bg-[hsl(var(--chart-3))]",
  "bg-[hsl(var(--chart-4))]",
  "bg-[hsl(var(--chart-5))]",
];

const BORDER_PALETTE = [
  "border-[hsl(var(--chart-1)/0.25)]",
  "border-[hsl(var(--chart-2)/0.25)]",
  "border-[hsl(var(--chart-3)/0.25)]",
  "border-[hsl(var(--chart-4)/0.25)]",
  "border-[hsl(var(--chart-5)/0.25)]",
];

const TEXT_PALETTE = [
  "text-[hsl(var(--chart-1))]",
  "text-[hsl(var(--chart-2))]",
  "text-[hsl(var(--chart-3))]",
  "text-[hsl(var(--chart-4))]",
  "text-[hsl(var(--chart-5))]",
];

const DOT_PALETTE = PALETTE;

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

  if (chartData.length === 0) {
    return (
      <InlineEmpty
        icon={PieChart}
        title="No expenses recorded yet"
        description="Your spending insights will appear once vendor payments are added."
      />
    );
  }

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
              className={`h-full ${item.colorClass} first:rounded-l-full last:rounded-r-full transition-all duration-500 ease-out hover:brightness-110 dark:hover:brightness-125 relative group cursor-help`}
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

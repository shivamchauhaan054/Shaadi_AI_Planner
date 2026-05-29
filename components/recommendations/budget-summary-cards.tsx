"use client";

import { useState, useEffect } from "react";
import { IndianRupee, PieChart, Receipt, Wallet } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { BudgetSummary } from "@/lib/validators";
import { formatInr } from "@/lib/format/currency";
import { staggerContainer, staggerItem } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type BudgetSummaryCardsProps = {
  summary: BudgetSummary;
};

const cards = [
  {
    key: "total",
    label: "Total wedding budget",
    icon: Wallet,
    getValue: (s: BudgetSummary) => s.total_budget,
    accent: "from-primary/15 to-primary/5 text-primary border-primary/10",
  },
  {
    key: "allocated",
    label: "AI allocated",
    icon: PieChart,
    getValue: (s: BudgetSummary) => s.total_allocated,
    accent: "from-accent/20 to-accent/5 text-accent-foreground border-accent/15",
  },
  {
    key: "spent",
    label: "Total spent",
    icon: Receipt,
    getValue: (s: BudgetSummary) => s.total_spent,
    accent: "from-secondary to-wedding-blush text-foreground border-border/40",
  },
  {
    key: "remaining",
    label: "Left in wedding cap",
    icon: IndianRupee,
    getValue: (s: BudgetSummary) => s.remaining,
    accent: "from-card to-secondary text-foreground border-border/60",
  },
] as const;

export function BudgetSummaryCards({ summary }: BudgetSummaryCardsProps) {
  const prefersReducedMotion = useReducedMotion();
  const spentPercent =
    summary.total_budget > 0
      ? Math.round((summary.total_spent / summary.total_budget) * 100)
      : 0;

  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPercent(spentPercent);
    }, 150);
    return () => clearTimeout(timer);
  }, [spentPercent]);

  const isOverBudget = summary.remaining < 0;

  return (
    <div className="space-y-4">
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={prefersReducedMotion ? undefined : staggerContainer}
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
      >
        {cards.map(({ key, label, icon: Icon, getValue, accent }) => {
          const isRemaining = key === "remaining";
          const isOver = isRemaining && isOverBudget;
          
          return (
            <motion.div
              key={key}
              variants={prefersReducedMotion ? undefined : staggerItem}
              className={cn(
                "rounded-2xl border bg-card p-5 shadow-soft transition-all duration-200",
                "bg-gradient-to-br hover:shadow-card hover:-translate-y-0.5",
                isOver 
                  ? "from-destructive/10 to-destructive/5 text-destructive border-destructive/20 shadow-none hover:shadow-none hover:translate-y-0" 
                  : accent,
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className={cn(
                  "text-xs font-medium uppercase tracking-wider",
                  isOver ? "text-destructive/80" : "text-muted-foreground"
                )}>
                  {label}
                </span>
                <Icon className={cn(
                  "size-4 shrink-0 opacity-70",
                  isOver ? "text-destructive" : ""
                )} aria-hidden />
              </div>
              <p className="font-display text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
                {formatInr(getValue(summary))}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {summary.unallocated > 0 ? (
        <p className="text-sm text-muted-foreground pl-1">
          {formatInr(summary.unallocated)} of your cap is not yet assigned across
          vendor categories by the AI plan.
        </p>
      ) : null}

      <div className={cn(
        "rounded-2xl border px-5 py-4 sm:px-6 transition-colors duration-200 bg-card/80",
        isOverBudget ? "border-destructive/20 bg-destructive-[0.02]" : "border-border/60"
      )}>
        <div className="mb-2 flex items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground font-medium">Spend vs. total budget</span>
          <span className={cn(
            "font-semibold tabular-nums",
            isOverBudget ? "text-destructive" : "text-foreground"
          )}>
            {spentPercent}%
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-secondary/80 shadow-inner"
          role="progressbar"
          aria-valuenow={spentPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Spend versus total budget"
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              isOverBudget
                ? "bg-gradient-to-r from-destructive to-red-500"
                : "bg-gradient-to-r from-primary to-accent"
            )}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

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
    accent: "from-primary/15 to-primary/5 text-primary",
  },
  {
    key: "allocated",
    label: "AI allocated",
    icon: PieChart,
    getValue: (s: BudgetSummary) => s.total_allocated,
    accent: "from-accent/20 to-accent/5 text-accent-foreground",
  },
  {
    key: "spent",
    label: "Total spent",
    icon: Receipt,
    getValue: (s: BudgetSummary) => s.total_spent,
    accent: "from-secondary to-wedding-blush text-foreground",
  },
  {
    key: "remaining",
    label: "Remaining",
    icon: IndianRupee,
    getValue: (s: BudgetSummary) => s.remaining,
    accent: "from-card to-secondary text-foreground",
  },
] as const;

export function BudgetSummaryCards({ summary }: BudgetSummaryCardsProps) {
  const prefersReducedMotion = useReducedMotion();
  const spentPercent =
    summary.total_budget > 0
      ? Math.round((summary.total_spent / summary.total_budget) * 100)
      : 0;

  return (
    <div className="space-y-4">
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={prefersReducedMotion ? undefined : staggerContainer}
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
      >
        {cards.map(({ key, label, icon: Icon, getValue, accent }) => (
          <motion.div
            key={key}
            variants={prefersReducedMotion ? undefined : staggerItem}
            className={cn(
              "rounded-2xl border border-border/60 bg-card p-5 shadow-soft transition-shadow duration-200",
              "bg-gradient-to-br hover:shadow-card",
              accent,
            )}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </span>
              <Icon className="size-4 shrink-0 opacity-70" aria-hidden />
            </div>
            <p className="font-display text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
              {formatInr(getValue(summary))}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <div className="rounded-2xl border border-border/60 bg-card/80 px-5 py-4 sm:px-6">
        <div className="mb-2 flex items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">Spend vs. total budget</span>
          <span className="font-medium tabular-nums text-foreground">
            {spentPercent}%
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuenow={spentPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Spend versus total budget"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
            style={{ width: `${Math.min(spentPercent, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

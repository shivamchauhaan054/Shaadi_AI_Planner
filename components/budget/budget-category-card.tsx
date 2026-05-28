import { formatInr } from "@/lib/format/currency";
import type { CategoryBudget } from "@/lib/validations/payments";
import { cn } from "@/lib/utils";

type BudgetCategoryCardProps = {
  budget: CategoryBudget;
};

export function BudgetCategoryCard({ budget }: BudgetCategoryCardProps) {
  const spentPercent =
    budget.allocated > 0
      ? Math.min(100, Math.round((budget.spent / budget.allocated) * 100))
      : budget.spent > 0
        ? 100
        : 0;

  const isOverBudget = budget.remaining < 0;

  return (
    <div
      className={cn(
        "interactive-card p-5",
        isOverBudget && "border-destructive/30 ring-1 ring-destructive/10",
      )}
    >
      <h3 className="font-display text-lg font-semibold leading-snug text-foreground">
        {budget.vendor_category}
      </h3>

      <dl className="mt-4 grid grid-cols-3 gap-3 text-center sm:gap-4">
        <div className="rounded-xl bg-secondary/50 px-2 py-3">
          <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
            Allocated
          </dt>
          <dd className="mt-1 text-sm font-semibold sm:text-base">
            {formatInr(budget.allocated)}
          </dd>
        </div>
        <div className="rounded-xl bg-primary/5 px-2 py-3">
          <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
            Spent
          </dt>
          <dd className="mt-1 text-sm font-semibold text-primary sm:text-base">
            {formatInr(budget.spent)}
          </dd>
        </div>
        <div
          className={cn(
            "rounded-xl px-2 py-3",
            isOverBudget ? "bg-destructive/10" : "bg-accent/10",
          )}
        >
          <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
            Remaining
          </dt>
          <dd
            className={cn(
              "mt-1 text-sm font-semibold sm:text-base",
              isOverBudget ? "text-destructive" : "text-foreground",
            )}
          >
            {formatInr(budget.remaining)}
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
          <span>Category utilization</span>
          <span>{spentPercent}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isOverBudget
                ? "bg-destructive"
                : "bg-gradient-to-r from-primary to-accent",
            )}
            style={{ width: `${spentPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

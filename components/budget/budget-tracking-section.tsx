"use client";

import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { BudgetCategoryCard } from "@/components/budget/budget-category-card";
import { PaymentModal } from "@/components/budget/payment-modal";
import { PaymentTable } from "@/components/budget/payment-table";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { createPayment } from "@/lib/api/client";
import type { BudgetTrackingData } from "@/lib/budget/tracking";
import type { CreatePaymentInput } from "@/lib/validations/payments";

type BudgetTrackingSectionProps = {
  intakeId: string;
  budgetData: BudgetTrackingData;
  onBudgetDataChange: (data: BudgetTrackingData) => void;
};

export function BudgetTrackingSection({
  intakeId,
  budgetData,
  onBudgetDataChange,
}: BudgetTrackingSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePaymentSubmit = useCallback(
    async (payment: CreatePaymentInput) => {
      setIsSubmitting(true);

      try {
        const result = await createPayment(payment);

        if (!result.ok) {
          toast.error(result.message);
          throw new Error(result.message);
        }

        onBudgetDataChange({
          category_budgets: result.data.category_budgets,
          budget_summary: result.data.budget_summary,
          payments: result.data.payments,
          vendor_categories: budgetData.vendor_categories,
        });

        toast.success("Payment recorded");
      } finally {
        setIsSubmitting(false);
      }
    },
    [budgetData.vendor_categories, onBudgetDataChange],
  );

  return (
    <section
      className="mt-16 border-t border-border/60 pt-12"
      aria-labelledby="budget-tracking-heading"
    >
      <SectionHeader
        id="budget-tracking-heading"
        title="Budget tracking"
        description="Monitor allocated vs. spent by vendor category"
        action={
          <Button
            onClick={() => setModalOpen(true)}
            className="w-full gap-2 shadow-soft sm:w-auto"
            disabled={budgetData.vendor_categories.length === 0}
          >
            <Plus className="size-4" aria-hidden />
            Add payment
          </Button>
        }
      />

      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        {budgetData.category_budgets.length === 0 ? (
          <div
            className="col-span-full rounded-2xl border border-dashed border-border/80 bg-card/50 px-6 py-12 text-center"
            role="status"
          >
            <p className="text-sm font-medium text-foreground">
              No vendor allocations yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete your intake to see category budgets here.
            </p>
          </div>
        ) : (
          budgetData.category_budgets.map((budget) => (
            <BudgetCategoryCard
              key={budget.vendor_category}
              budget={budget}
            />
          ))
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold">Payment history</h3>
        <PaymentTable 
          payments={budgetData.payments} 
          onAddPayment={() => setModalOpen(true)}
        />
      </div>

      <PaymentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        intakeId={intakeId}
        vendorCategories={budgetData.vendor_categories}
        onSubmit={handlePaymentSubmit}
        isSubmitting={isSubmitting}
      />
    </section>
  );
}

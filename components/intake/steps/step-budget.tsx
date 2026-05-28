"use client";

import type { UseFormReturn } from "react-hook-form";

import { SelectionCard } from "@/components/forms/selection-card";
import { FormField } from "@/components/forms/form-field";
import { StepIntro } from "@/components/shared/step-intro";
import { BUDGET_OPTIONS } from "@/lib/constants";
import type { WeddingIntakeFormValues } from "@/lib/validations/wedding-intake";

type StepBudgetProps = {
  form: UseFormReturn<WeddingIntakeFormValues>;
};

export function StepBudget({ form }: StepBudgetProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const budgetRange = watch("budgetRange");

  return (
    <div className="space-y-6">
      <StepIntro
        title="What's your budget range?"
        description="Select a comfortable range—we'll optimize recommendations accordingly."
      />

      <FormField
        label="Total wedding budget"
        required
        error={errors.budgetRange?.message}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {BUDGET_OPTIONS.map((option) => (
            <SelectionCard
              key={option.value}
              label={option.label}
              description={option.description}
              selected={budgetRange === option.value}
              onSelect={() =>
                setValue("budgetRange", option.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
          ))}
        </div>
      </FormField>
    </div>
  );
}

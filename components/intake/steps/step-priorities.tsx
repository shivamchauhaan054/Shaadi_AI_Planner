"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  Building2,
  Camera,
  Music,
  Palette,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import { FormField } from "@/components/forms/form-field";
import { StepIntro } from "@/components/shared/step-intro";
import { MAX_PRIORITIES, PRIORITY_OPTIONS, type PriorityValue } from "@/lib/constants";
import type { WeddingIntakeFormValues } from "@/lib/validations/wedding-intake";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  camera: Camera,
  utensils: UtensilsCrossed,
  sparkles: Sparkles,
  palette: Palette,
  music: Music,
  building: Building2,
};

type StepPrioritiesProps = {
  form: UseFormReturn<WeddingIntakeFormValues>;
};

export function StepPriorities({ form }: StepPrioritiesProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const priorities = watch("priorities") ?? [];

  const togglePriority = (value: PriorityValue) => {
    const current = priorities;
    const exists = current.includes(value);

    if (exists) {
      setValue(
        "priorities",
        current.filter((p) => p !== value),
        { shouldValidate: true, shouldDirty: true },
      );
      return;
    }

    if (current.length >= MAX_PRIORITIES) return;

    setValue("priorities", [...current, value], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-6">
      <StepIntro
        title="What matters most?"
        description={`Pick up to ${MAX_PRIORITIES} focus areas—we'll weight your plan toward them.`}
      />

      <p className="text-xs font-medium text-primary" aria-live="polite">
        {priorities.length}/{MAX_PRIORITIES} selected
      </p>

      <FormField
        label="Couple priorities"
        required
        error={errors.priorities?.message}
      >
        <div
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          role="group"
          aria-label="Priority options"
        >
          {PRIORITY_OPTIONS.map((option) => {
            const Icon = ICONS[option.icon] ?? Sparkles;
            const selected = priorities.includes(option.value);
            const atLimit =
              priorities.length >= MAX_PRIORITIES && !selected;

            return (
              <button
                key={option.value}
                type="button"
                disabled={atLimit}
                onClick={() => togglePriority(option.value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  selected
                    ? "border-primary bg-primary/10 text-primary shadow-soft"
                    : "border-border/80 bg-card hover:border-primary/25",
                  atLimit && "cursor-not-allowed opacity-45",
                )}
                aria-pressed={selected}
              >
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl transition-colors",
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground",
                  )}
                  aria-hidden
                >
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </FormField>
    </div>
  );
}

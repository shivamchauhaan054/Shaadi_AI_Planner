"use client";

import type { UseFormReturn } from "react-hook-form";
import { MapPin } from "lucide-react";

import { FormField } from "@/components/forms/form-field";
import { StepIntro } from "@/components/shared/step-intro";
import { Input } from "@/components/ui/input";
import { VENUE_OPTIONS } from "@/lib/constants";
import type { WeddingIntakeFormValues } from "@/lib/validations/wedding-intake";
import { cn } from "@/lib/utils";

type StepLocationProps = {
  form: UseFormReturn<WeddingIntakeFormValues>;
};

export function StepLocation({ form }: StepLocationProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const venueType = watch("venueType");

  return (
    <div className="space-y-6">
      <StepIntro
        title="Where will you celebrate?"
        description="City and venue style help us match vendors and logistics."
      />

      <FormField
        label="City"
        htmlFor="city"
        required
        error={errors.city?.message}
        hint="Primary city for ceremonies or reception"
      >
        <div className="relative">
          <MapPin
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="city"
            placeholder="Mumbai, Delhi, Jaipur…"
            className="h-12 pl-10"
            {...register("city")}
          />
        </div>
      </FormField>

      <FormField
        label="Venue type"
        required
        error={errors.venueType?.message}
        hint="Choose the setting that best matches your vision"
      >
        <div
          className="grid gap-2"
          role="group"
          aria-label="Venue type options"
        >
          {VENUE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setValue("venueType", option.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              className={cn(
                "flex h-12 w-full items-center rounded-xl border-2 px-4 text-left text-sm font-medium transition-all duration-200",
                venueType === option.value
                  ? "border-primary bg-primary/5 text-primary shadow-soft"
                  : "border-border/80 bg-card hover:border-primary/25 hover:bg-secondary/40",
              )}
              aria-pressed={venueType === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FormField>
    </div>
  );
}

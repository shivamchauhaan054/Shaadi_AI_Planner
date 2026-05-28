"use client";

import type { UseFormReturn } from "react-hook-form";
import { CalendarDays, Users } from "lucide-react";

import { FormField } from "@/components/forms/form-field";
import { StepIntro } from "@/components/shared/step-intro";
import { Input } from "@/components/ui/input";
import type { WeddingIntakeFormValues } from "@/lib/validations/wedding-intake";

type StepDateGuestsProps = {
  form: UseFormReturn<WeddingIntakeFormValues>;
};

export function StepDateGuests({ form }: StepDateGuestsProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <StepIntro
        title="When is the big day?"
        description="We'll shape your timeline and vendor shortlist around your date and guest list."
      />

      <FormField
        label="Wedding date"
        htmlFor="weddingDate"
        required
        error={errors.weddingDate?.message}
        hint="Select your ceremony or main reception date"
      >
        <div className="relative">
          <CalendarDays
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="weddingDate"
            type="date"
            className="h-12 pl-10"
            {...register("weddingDate")}
          />
        </div>
      </FormField>

      <FormField
        label="Approximate guest count"
        htmlFor="guestCount"
        required
        error={errors.guestCount?.message}
        hint="Include family, friends, and colleagues you expect to attend"
      >
        <div className="relative">
          <Users
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="guestCount"
            type="number"
            min={50}
            max={5000}
            step={10}
            placeholder="e.g. 350"
            className="h-12 pl-10"
            {...register("guestCount", { valueAsNumber: true })}
          />
        </div>
      </FormField>
    </div>
  );
}

"use client";

import { ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IntakeFormNavigationProps = {
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
};

export function IntakeFormNavigation({
  isFirstStep,
  isLastStep,
  canProceed,
  isSubmitting,
  onBack,
  onNext,
}: IntakeFormNavigationProps) {
  return (
    <nav
      className={cn(
        "flex flex-col-reverse gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between",
      )}
      aria-label="Intake form steps"
    >
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        disabled={isFirstStep || isSubmitting}
        className="gap-1 sm:min-w-[120px]"
        aria-disabled={isFirstStep || isSubmitting}
      >
        <ChevronLeft className="size-4" aria-hidden />
        Back
      </Button>

      {isLastStep ? (
        <Button
          type="submit"
          size="lg"
          disabled={!canProceed || isSubmitting}
          className="w-full gap-2 shadow-card sm:w-auto sm:min-w-[220px]"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Submitting…
            </>
          ) : (
            <>
              <Sparkles className="size-4" aria-hidden />
              Complete intake
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          size="lg"
          onClick={onNext}
          disabled={!canProceed || isSubmitting}
          className="w-full gap-1 shadow-soft sm:w-auto sm:min-w-[180px]"
        >
          Continue
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      )}
    </nav>
  );
}

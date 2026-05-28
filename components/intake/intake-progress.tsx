"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { INTAKE_STEPS } from "@/lib/constants/intake";
import { cn } from "@/lib/utils";

type IntakeProgressProps = {
  currentStep: number;
  totalSteps?: number;
};

export function IntakeProgress({
  currentStep,
  totalSteps = INTAKE_STEPS.length,
}: IntakeProgressProps) {
  const prefersReducedMotion = useReducedMotion();
  const progressValue = ((currentStep + 1) / totalSteps) * 100;
  const stepLabel = INTAKE_STEPS[currentStep]?.label ?? "";

  return (
    <div className="space-y-4" aria-label="Intake progress">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">
          Step {currentStep + 1} of {totalSteps}
        </p>
        <p className="truncate text-sm text-muted-foreground">{stepLabel}</p>
      </div>

      <Progress
        value={progressValue}
        className="h-2 bg-secondary"
        aria-label={`Step ${currentStep + 1} of ${totalSteps}: ${stepLabel}`}
      />

      <ol className="hidden gap-2 sm:grid sm:grid-cols-4">
        {INTAKE_STEPS.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li
              key={step.id}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors duration-200",
                isCurrent && "bg-primary/10 text-primary",
                isComplete && "text-primary",
                !isCurrent && !isComplete && "text-muted-foreground",
              )}
              aria-current={isCurrent ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors duration-200",
                  isCurrent &&
                    "border-primary bg-primary text-primary-foreground",
                  isComplete && "border-primary bg-primary/15 text-primary",
                  !isCurrent && !isComplete && "border-border",
                )}
              >
                {isComplete ? (
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                ) : (
                  step.id
                )}
              </span>
              <span className="truncate">{step.shortLabel}</span>
            </li>
          );
        })}
      </ol>

      {!prefersReducedMotion ? (
        <motion.div
          className="h-1 overflow-hidden rounded-full bg-secondary sm:hidden"
          initial={false}
          aria-hidden
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progressValue}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </motion.div>
      ) : (
        <div
          className="h-1 overflow-hidden rounded-full bg-secondary sm:hidden"
          aria-hidden
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-200"
            style={{ width: `${progressValue}%` }}
          />
        </div>
      )}
    </div>
  );
}

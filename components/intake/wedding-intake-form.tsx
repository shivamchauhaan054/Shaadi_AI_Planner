"use client";

import { useCallback, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";

import { Container } from "@/components/layout/container";
import { Heading, Text } from "@/components/layout/typography";
import { IntakeFormNavigation } from "@/components/intake/intake-form-navigation";
import { IntakeProgress } from "@/components/intake/intake-progress";
import { StepBudget } from "@/components/intake/steps/step-budget";
import { StepDateGuests } from "@/components/intake/steps/step-date-guests";
import { StepLocation } from "@/components/intake/steps/step-location";
import { StepPriorities } from "@/components/intake/steps/step-priorities";
import { FormBusyOverlay } from "@/components/shared/form-busy-overlay";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { submitWeddingIntake } from "@/lib/actions/submit-wedding-intake";
import { INTAKE_STEPS } from "@/lib/constants";
import { mergeStepWatchValues } from "@/lib/intake/step-values";
import { slideStep, slideStepTransition } from "@/lib/motion/variants";
import {
  INTAKE_STEP_FIELDS,
  isStepValid,
  weddingIntakeSchema,
  type WeddingIntakeFormValues,
} from "@/lib/validations/wedding-intake";

const STEP_COMPONENTS = [
  StepDateGuests,
  StepLocation,
  StepBudget,
  StepPriorities,
] as const;

const defaultValues = {
  weddingDate: "",
  city: "",
  priorities: [] as WeddingIntakeFormValues["priorities"],
} satisfies Partial<WeddingIntakeFormValues>;

export function WeddingIntakeForm() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WeddingIntakeFormValues>({
    resolver: zodResolver(weddingIntakeSchema),
    defaultValues,
    mode: "onChange",
  });

  const watchedStepValues = useWatch({
    control: form.control,
    name: INTAKE_STEP_FIELDS[currentStep],
  });

  const canProceed = useMemo(() => {
    const values = mergeStepWatchValues(
      currentStep,
      form.getValues(),
      watchedStepValues,
    );
    return isStepValid(currentStep, values);
  }, [currentStep, watchedStepValues, form]);

  const StepComponent = STEP_COMPONENTS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === INTAKE_STEPS.length - 1;
  const stepLabel = INTAKE_STEPS[currentStep]?.label ?? "";

  const goToStep = useCallback(
    (next: number) => {
      setDirection(next > currentStep ? 1 : -1);
      setCurrentStep(next);
    },
    [currentStep],
  );

  const handleNext = useCallback(async () => {
    const fields = INTAKE_STEP_FIELDS[currentStep];
    const valid = await form.trigger(fields);
    if (!valid) return;
    goToStep(currentStep + 1);
  }, [currentStep, form, goToStep]);

  const handleBack = useCallback(() => {
    if (!isFirstStep) goToStep(currentStep - 1);
  }, [currentStep, goToStep, isFirstStep]);

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const result = await submitWeddingIntake(values);
      if (result.success && result.intakeId) {
        toast.success(result.message);
        router.push(`/recommendations/${result.intakeId}`);
        return;
      }

      toast.error(result.message);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <section id="intake" className="scroll-mt-24 py-16 sm:py-20 md:py-28">
      <Container size="narrow">
        <div className="mb-8 text-center sm:mb-10">
          <Heading as="h2" className="mb-3 sm:mb-4">
            Tell us about your wedding
          </Heading>
          <Text className="mx-auto max-w-md text-pretty">
            A guided intake in four steps—crafted for couples who want clarity
            without the overwhelm.
          </Text>
        </div>

        <Card className="overflow-hidden border-border/80 bg-card/90 shadow-card backdrop-blur-sm">
          <CardHeader className="space-y-6 border-b border-border/60 bg-gradient-to-br from-secondary/40 to-transparent px-5 pb-7 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
            <div>
              <CardTitle className="font-display text-2xl sm:text-3xl">
                Wedding intake
              </CardTitle>
              <CardDescription className="mt-1.5 text-sm sm:text-base">
                {stepLabel}
              </CardDescription>
            </div>
            <IntakeProgress currentStep={currentStep} />
          </CardHeader>

          <CardContent className="relative p-5 sm:p-8">
            <FormBusyOverlay visible={isSubmitting} />

            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {`Step ${currentStep + 1} of ${INTAKE_STEPS.length}: ${stepLabel}`}
            </p>

            <form onSubmit={onSubmit} noValidate>
              <div className="min-h-[300px] overflow-hidden sm:min-h-[340px]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={prefersReducedMotion ? undefined : slideStep}
                    initial={prefersReducedMotion ? false : "enter"}
                    animate="center"
                    exit={prefersReducedMotion ? undefined : "exit"}
                    transition={
                      prefersReducedMotion ? undefined : slideStepTransition
                    }
                  >
                    <fieldset disabled={isSubmitting} className="min-w-0 border-0 p-0">
                      <legend className="sr-only">{stepLabel}</legend>
                      {StepComponent ? <StepComponent form={form} /> : null}
                    </fieldset>
                  </motion.div>
                </AnimatePresence>
              </div>

              <IntakeFormNavigation
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                canProceed={canProceed}
                isSubmitting={isSubmitting}
                onBack={handleBack}
                onNext={handleNext}
              />
            </form>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Container } from "@/components/layout/container";
import { submitWeddingIntake } from "@/lib/actions/submit-wedding-intake";
import { weddingIntakeSchema } from "@/lib/validations/wedding-intake";

const LOADING_MESSAGES = [
  "Designing your celebration budget...",
  "Finding the right vendor balance...",
  "Optimizing allocations for your priorities...",
  "Preparing your AI wedding roadmap...",
];

const CHECKLIST_STEPS = [
  "Understanding guest count & location",
  "Analyzing wedding priorities",
  "Balancing vendor allocations",
  "Generating personalized recommendations",
];

export default function GenerateRecommendationsPage() {
  const router = useRouter();
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Cycle messages every 2.5 seconds
    const msgInterval = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    // Progress the checklist artificially, leaving the last step pending
    const stepInterval = setInterval(() => {
      setActiveStepIndex((prev) => Math.min(prev + 1, CHECKLIST_STEPS.length - 1));
    }, 1800);

    return () => {
      clearInterval(msgInterval);
      clearInterval(stepInterval);
    };
  }, []);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    async function generate() {
      try {
        const payloadRaw = sessionStorage.getItem("shaadi_intake_payload");
        if (!payloadRaw) {
          router.replace("/");
          return;
        }

        const payload = JSON.parse(payloadRaw);
        const parsed = weddingIntakeSchema.safeParse(payload);

        if (!parsed.success) {
          toast.error("Invalid intake data found. Please try again.");
          router.replace("/");
          return;
        }

        const result = await submitWeddingIntake(parsed.data);

        if (result.success && result.intakeId) {
          sessionStorage.removeItem("shaadi_intake_payload");
          toast.success(result.message);
          router.push(`/recommendations/${result.intakeId}`);
        } else {
          toast.error(result.message || "Failed to generate plan");
          router.replace("/");
        }
      } catch {
        toast.error("Something went wrong generating your plan.");
        router.replace("/");
      }
    }

    void generate();
  }, [router]);

  return (
    <div 
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 md:py-20"
      role="status"
      aria-live="polite"
    >
      <Container size="narrow">
        <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-border/60 bg-card/90 p-8 shadow-card backdrop-blur-sm sm:p-12">
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"
            >
              <Sparkles className="h-7 w-7 text-primary" />
            </motion.div>
            <h1 className="mb-3 font-display text-2xl font-semibold sm:text-3xl">
              Creating your wedding plan
            </h1>
            <p className="text-muted-foreground sm:text-lg">
              Our AI planner is analyzing your celebration details and building a balanced vendor budget.
            </p>
          </div>

          <div className="mb-8 space-y-4">
            {CHECKLIST_STEPS.map((step, index) => {
              const isActive = index === activeStepIndex;
              const isCompleted = index < activeStepIndex;

              return (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: isActive || isCompleted ? 1 : 0.4,
                    x: 0 
                  }}
                  transition={{ delay: index * 0.15 }}
                  className="flex items-center gap-4"
                >
                  <div 
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                      isCompleted 
                        ? "border-primary bg-primary text-primary-foreground" 
                        : isActive
                        ? "border-primary text-primary"
                        : "border-muted-foreground/30 text-muted-foreground/30"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : isActive ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-current" />
                    )}
                  </div>
                  <span 
                    className={`text-sm font-medium sm:text-base transition-colors duration-300 ${
                      isActive || isCompleted ? "text-foreground" : "text-muted-foreground/60"
                    }`}
                  >
                    {step}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div className="relative flex h-12 items-center justify-center overflow-hidden rounded-xl bg-secondary/30 px-4 text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeMessageIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="absolute text-sm font-medium text-muted-foreground"
              >
                {LOADING_MESSAGES[activeMessageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </div>
  );
}

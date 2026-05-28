"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Heading, Text } from "@/components/layout/typography";
import { Button } from "@/components/ui/button";
import { fadeIn } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
  compact?: boolean;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  isRetrying = false,
  className,
  compact = false,
}: ErrorStateProps) {
  const prefersReducedMotion = useReducedMotion();
  const titleId = "error-state-title";

  return (
    <div
      className={cn(
        "gradient-wedding-hero flex items-center",
        compact ? "py-12 sm:py-16" : "min-h-[50vh] py-16 sm:py-20",
        className,
      )}
      role="alert"
      aria-labelledby={titleId}
    >
      <Container size="narrow" className="text-center">
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          variants={prefersReducedMotion ? undefined : fadeIn}
          className="glass-card mx-auto max-w-md p-8 sm:p-10"
        >
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="size-7" aria-hidden />
          </div>
          <Heading id={titleId} as="h2" className="mb-3 text-2xl sm:text-3xl">
            {title}
          </Heading>
          <Text className="mb-8 text-pretty">{message}</Text>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            {onRetry ? (
              <Button
                onClick={onRetry}
                disabled={isRetrying}
                className="gap-2"
                aria-busy={isRetrying}
              >
                {isRetrying ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Retrying…
                  </>
                ) : (
                  <>
                    <RefreshCw className="size-4" aria-hidden />
                    Try again
                  </>
                )}
              </Button>
            ) : null}
            <Button variant="outline" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}

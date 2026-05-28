"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type SelectionCardProps = {
  selected: boolean;
  onSelect: () => void;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
};

export function SelectionCard({
  selected,
  onSelect,
  label,
  description,
  disabled,
  className,
}: SelectionCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      whileTap={
        disabled || prefersReducedMotion ? undefined : { scale: 0.98 }
      }
      className={cn(
        "relative w-full rounded-2xl border-2 p-5 text-left transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "min-h-[4.5rem] touch-manipulation",
        selected
          ? "border-primary bg-primary/5 shadow-soft"
          : "border-border/80 bg-card/80 hover:border-primary/30 hover:bg-secondary/50 hover:shadow-soft",
        disabled && "cursor-not-allowed opacity-50 hover:shadow-none",
        className,
      )}
      aria-pressed={selected}
      aria-label={`${label}${selected ? ", selected" : ""}`}
    >
      {selected ? (
        <span
          className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
          aria-hidden
        >
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      ) : null}
      <span className="block pr-8 font-display text-lg font-semibold text-foreground">
        {label}
      </span>
      {description ? (
        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
          {description}
        </span>
      ) : null}
    </motion.button>
  );
}

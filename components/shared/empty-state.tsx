"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { Heading, Text } from "@/components/layout/typography";
import { Button } from "@/components/ui/button";
import { fadeIn } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const prefersReducedMotion = useReducedMotion();
  const titleId = "empty-state-title";

  return (
    <motion.div
      initial={prefersReducedMotion ? false : "hidden"}
      animate="visible"
      variants={prefersReducedMotion ? undefined : fadeIn}
      className={cn(
        "glass-card mx-auto max-w-md p-8 text-center sm:p-10",
        className,
      )}
      role="status"
      aria-labelledby={titleId}
    >
      <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-7" aria-hidden />
      </div>
      <Heading id={titleId} as="h2" className="mb-3 text-2xl sm:text-3xl">
        {title}
      </Heading>
      <Text className="mb-8 text-pretty">{description}</Text>
      {action ? (
        action.href ? (
          <Button asChild className="shadow-soft">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : (
          <Button onClick={action.onClick} className="shadow-soft">
            {action.label}
          </Button>
        )
      ) : null}
    </motion.div>
  );
}

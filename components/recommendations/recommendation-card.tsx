"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatInr } from "@/lib/format/currency";
import { staggerItem } from "@/lib/motion/variants";
import { FIELD_LIMITS } from "@/lib/security/constants";
import { sanitizeDisplayText } from "@/lib/security/sanitize";
import type { VendorRecommendation } from "@/lib/validators";
import { cn } from "@/lib/utils";

type RecommendationCardProps = {
  recommendation: VendorRecommendation;
};

export function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const isTopPriority = recommendation.priority_rank === 1;
  const category = sanitizeDisplayText(
    recommendation.vendor_category,
    FIELD_LIMITS.vendorCategory,
  );
  const rationale = sanitizeDisplayText(recommendation.rationale, 280);

  return (
    <motion.div variants={prefersReducedMotion ? undefined : staggerItem}>
      <Card
        className={cn(
          "interactive-card h-full",
          isTopPriority && "border-primary/25 ring-1 ring-primary/10",
        )}
      >
        <CardHeader className="space-y-3 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <CardTitle className="font-display text-xl leading-snug sm:text-2xl">
                {category}
              </CardTitle>
              {isTopPriority ? (
                <CardDescription className="flex items-center gap-1 text-primary">
                  <Sparkles className="size-3.5 shrink-0" aria-hidden />
                  Top priority for your celebration
                </CardDescription>
              ) : null}
            </div>
            <Badge
              variant={isTopPriority ? "default" : "secondary"}
              className="shrink-0 font-mono text-xs"
              aria-label={`Priority rank ${recommendation.priority_rank}`}
            >
              #{recommendation.priority_rank}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl bg-secondary/60 px-4 py-3 transition-colors duration-200">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Suggested budget
            </p>
            <p className="font-display text-2xl font-semibold tabular-nums text-foreground sm:text-3xl">
              {formatInr(recommendation.suggested_budget)}
            </p>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              AI rationale
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {rationale}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

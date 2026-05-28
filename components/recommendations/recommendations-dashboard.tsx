"use client";

import { Calendar, MapPin, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { BudgetTrackingSection } from "@/components/budget/budget-tracking-section";
import {
  selectBudgetTrackingData,
  type BudgetTrackingData,
} from "@/lib/budget/tracking";
import { BudgetSummaryCards } from "@/components/recommendations/budget-summary-cards";
import { RecommendationCard } from "@/components/recommendations/recommendation-card";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Eyebrow, Heading, Text } from "@/components/layout/typography";
import { Badge } from "@/components/ui/badge";
import { formatDisplayDate } from "@/lib/format/dates";
import { formatPriority, formatVenueType } from "@/lib/format/labels";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";
import type { RecommendationDetailsResponse } from "@/lib/validators";

type RecommendationsDashboardProps = {
  data: RecommendationDetailsResponse;
  onBudgetDataChange: (budgetData: BudgetTrackingData) => void;
};

export function RecommendationsDashboard({
  data,
  onBudgetDataChange,
}: RecommendationsDashboardProps) {
  const prefersReducedMotion = useReducedMotion();
  const weddingDateLabel = formatDisplayDate(data.wedding_date);
  const generatedLabel = data.generated_at
    ? formatDisplayDate(data.generated_at, "PPp")
    : null;

  return (
    <div className="page-shell">
      <Container size="wide">
        <motion.header
          className="mb-10 md:mb-12"
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          variants={prefersReducedMotion ? undefined : fadeUp}
          custom={0}
        >
          <Eyebrow className="mb-4">Your wedding plan</Eyebrow>
          <Heading as="h1" className="mb-3 max-w-3xl sm:mb-4">
            Vendor recommendations for{" "}
            <span className="text-primary">{data.city}</span>
          </Heading>
          <Text className="max-w-2xl text-pretty">
            AI-optimized allocations based on your intake—prioritized for Indian
            wedding traditions and your couple preferences.
          </Text>

          <ul className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
            <li>
              <Badge
                variant="secondary"
                className="gap-1.5 px-3 py-1.5 transition-colors hover:bg-secondary"
              >
                <Calendar className="size-3.5" aria-hidden />
                <time dateTime={data.wedding_date}>{weddingDateLabel}</time>
              </Badge>
            </li>
            <li>
              <Badge
                variant="secondary"
                className="gap-1.5 px-3 py-1.5 transition-colors hover:bg-secondary"
              >
                <MapPin className="size-3.5" aria-hidden />
                {formatVenueType(data.venue_type)}
              </Badge>
            </li>
            <li>
              <Badge
                variant="secondary"
                className="gap-1.5 px-3 py-1.5 transition-colors hover:bg-secondary"
              >
                <Users className="size-3.5" aria-hidden />
                {data.guest_count.toLocaleString("en-IN")} guests
              </Badge>
            </li>
            {data.priorities.map((priority) => (
              <li key={priority}>
                <Badge className="border-primary/20 bg-primary/10 px-3 py-1.5 text-primary">
                  Focus: {formatPriority(priority)}
                </Badge>
              </li>
            ))}
          </ul>

          {generatedLabel && data.generated_at ? (
            <p className="mt-4 text-xs text-muted-foreground">
              Generated{" "}
              <time dateTime={data.generated_at}>{generatedLabel}</time>
            </p>
          ) : null}
        </motion.header>

        <section
          className="mb-12 md:mb-16"
          aria-labelledby="budget-overview-heading"
        >
          <SectionHeader
            id="budget-overview-heading"
            title="Budget overview"
            description="High-level view of your total plan and spend"
            className="mb-6"
          />
          <BudgetSummaryCards summary={data.budget_summary} />
        </section>

        <section
          className="mb-12 md:mb-16"
          aria-labelledby="vendor-allocations-heading"
        >
          <SectionHeader
            id="vendor-allocations-heading"
            title="Vendor allocations"
            description={`${data.recommendations.length} categories ranked by priority`}
            className="mb-6"
          />

          <motion.div
            className="grid gap-5 sm:gap-6 md:grid-cols-2"
            variants={prefersReducedMotion ? undefined : staggerContainer}
            initial={prefersReducedMotion ? false : "hidden"}
            animate="visible"
          >
            {data.recommendations.map((recommendation) => (
              <RecommendationCard
                key={`${recommendation.vendor_category}-${recommendation.priority_rank}`}
                recommendation={recommendation}
              />
            ))}
          </motion.div>
        </section>

        <BudgetTrackingSection
          intakeId={data.intake_id}
          budgetData={selectBudgetTrackingData(data)}
          onBudgetDataChange={onBudgetDataChange}
        />
      </Container>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { Calendar, MapPin, Users, Sparkles, RefreshCw } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";

import { BudgetTrackingSection } from "@/components/budget/budget-tracking-section";
import {
  selectBudgetTrackingData,
  type BudgetTrackingData,
} from "@/lib/budget/tracking";
import { BudgetSummaryCards } from "@/components/recommendations/budget-summary-cards";
import { RecommendationCard } from "@/components/recommendations/recommendation-card";
import { BudgetAllocationChart } from "@/components/recommendations/budget-allocation-chart";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Eyebrow, Heading, Text } from "@/components/layout/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InlineEmpty } from "@/components/shared/inline-empty";
import { formatDisplayDate } from "@/lib/format/dates";
import { formatPriority, formatVenueType } from "@/lib/format/labels";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";
import { buildBudgetSnapshot } from "@/lib/budget/snapshot";
import { regenerateRecommendations } from "@/lib/actions/regenerate-recommendations";
import type { RecommendationDetailsResponse } from "@/lib/validators";

type RecommendationsDashboardProps = {
  data: RecommendationDetailsResponse;
  onBudgetDataChange: (budgetData: BudgetTrackingData) => void;
  onReload: () => void;
};

export function RecommendationsDashboard({
  data,
  onBudgetDataChange,
  onReload,
}: RecommendationsDashboardProps) {
  const prefersReducedMotion = useReducedMotion();
  const weddingDateLabel = formatDisplayDate(data.wedding_date);
  
  // Local active version switcher
  const [activeVersionId, setActiveVersionId] = useState<string>(
    data.versions && data.versions.length > 0 ? data.versions[0].id : "latest"
  );
  
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Derive recommendations of selected version
  const currentVersion = useMemo(() => {
    if (data.versions && data.versions.length > 0) {
      const match = data.versions.find((v) => v.id === activeVersionId);
      if (match) return match;
    }
    return {
      id: "latest",
      created_at: data.generated_at || "",
      recommendations: data.recommendations,
    };
  }, [data.versions, data.recommendations, data.generated_at, activeVersionId]);

  // Derive dynamic budget snapshot for selected version recommendations
  const snapshot = useMemo(() => {
    return buildBudgetSnapshot(
      data.total_budget,
      currentVersion.recommendations,
      data.payments
    );
  }, [data.total_budget, currentVersion.recommendations, data.payments]);

  const generatedLabel = currentVersion.created_at
    ? formatDisplayDate(currentVersion.created_at, "PPp")
    : null;

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    const toastId = toast.loading("AI is planning your celebration. Please wait...");
    try {
      const result = await regenerateRecommendations(data.intake_id);
      if (result.success) {
        toast.success(result.message, { id: toastId });
        onReload();
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch {
      toast.error("Failed to plan recommendations.", { id: toastId });
    } finally {
      setIsRegenerating(false);
    }
  };

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <Eyebrow>Your wedding plan</Eyebrow>
            <div className="flex flex-wrap items-center gap-2">
              {data.versions && data.versions.length > 1 ? (
                <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card p-1 shadow-soft">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider pl-2.5">
                    Plan Version:
                  </span>
                  <select
                    value={activeVersionId}
                    onChange={(e) => setActiveVersionId(e.target.value)}
                    className="rounded-lg border border-border/40 bg-secondary/80 px-2 py-1 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-primary outline-none cursor-pointer"
                  >
                    {data.versions.map((v, index) => (
                      <option key={v.id} value={v.id}>
                        Version #{data.versions!.length - index} ({new Date(v.created_at).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <InlineEmpty
                  variant="subtle"
                  icon={Sparkles}
                  title="Your original AI wedding plan is active"
                  description="Generate a refreshed plan anytime to compare alternative budget strategies."
                  className="px-4 py-3 sm:px-5 sm:py-3 max-w-sm flex-1"
                />
              )}
              
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 text-xs font-semibold border-primary/25 text-primary hover:bg-primary hover:text-primary-foreground shadow-soft bg-card"
                onClick={handleRegenerate}
                disabled={isRegenerating}
              >
                {isRegenerating ? (
                  <RefreshCw className="size-3.5 shrink-0 animate-spin" />
                ) : (
                  <Sparkles className="size-3.5 shrink-0 text-primary" />
                )}
                {isRegenerating ? "Plannning..." : "Regenerate AI Plan"}
              </Button>
            </div>
          </div>

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

          {generatedLabel && currentVersion.created_at ? (
            <p className="mt-4 text-xs text-muted-foreground">
              Generated{" "}
              <time dateTime={currentVersion.created_at}>{generatedLabel}</time>
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
          <BudgetSummaryCards summary={snapshot.budget_summary} />
        </section>

        <section
          className="mb-12 md:mb-16"
          aria-labelledby="budget-allocation-heading"
        >
          <SectionHeader
            id="budget-allocation-heading"
            title="Budget distribution"
            description="AI-generated allocation percentages across priority vendor categories"
            className="mb-6"
          />
          <BudgetAllocationChart
            recommendations={currentVersion.recommendations}
            totalBudget={data.total_budget}
          />
        </section>

        <section
          className="mb-12 md:mb-16"
          aria-labelledby="vendor-allocations-heading"
        >
          <SectionHeader
            id="vendor-allocations-heading"
            title="Vendor allocations"
            description={`${currentVersion.recommendations.length} categories ranked by priority`}
            className="mb-6"
          />

          <motion.div
            className="grid gap-5 sm:gap-6 md:grid-cols-2"
            variants={prefersReducedMotion ? undefined : staggerContainer}
            initial={prefersReducedMotion ? false : "hidden"}
            animate="visible"
          >
            {currentVersion.recommendations.map((recommendation) => (
              <RecommendationCard
                key={`${recommendation.vendor_category}-${recommendation.priority_rank}`}
                recommendation={recommendation}
              />
            ))}
          </motion.div>
        </section>

        <BudgetTrackingSection
          intakeId={data.intake_id}
          budgetData={{
            ...selectBudgetTrackingData(data),
            category_budgets: snapshot.category_budgets,
          }}
          onBudgetDataChange={onBudgetDataChange}
        />
      </Container>
    </div>
  );
}

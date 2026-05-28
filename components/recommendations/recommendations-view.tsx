"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { fetchRecommendationDetails } from "@/lib/api/client";
import { RecommendationsDashboard } from "@/components/recommendations/recommendations-dashboard";
import { RecommendationsEmpty } from "@/components/recommendations/recommendations-empty";
import { RecommendationsError } from "@/components/recommendations/recommendations-error";
import { RecommendationsSkeleton } from "@/components/recommendations/recommendations-skeleton";
import {
  mergeBudgetTrackingData,
  type BudgetTrackingData,
} from "@/lib/budget/tracking";
import type { RecommendationDetailsResponse } from "@/lib/validators";

type ViewState =
  | { status: "loading" }
  | { status: "error"; message: string; statusCode?: number }
  | { status: "empty"; data: RecommendationDetailsResponse }
  | { status: "success"; data: RecommendationDetailsResponse };

type RecommendationsViewProps = {
  intakeId: string;
};

export function RecommendationsView({ intakeId }: RecommendationsViewProps) {
  const [state, setState] = useState<ViewState>({ status: "loading" });
  const [isRetrying, setIsRetrying] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(
    async (soft = false) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (!soft) {
        setState({ status: "loading" });
      }

      const result = await fetchRecommendationDetails(
        intakeId,
        controller.signal,
      );

      if (controller.signal.aborted) return;

      if (!result.ok) {
        if (!soft) {
          setState({
            status: "error",
            message: result.message,
            statusCode: result.statusCode,
          });
        } else {
          toast.error(result.message);
        }
        return;
      }

      if (result.data.recommendations.length === 0) {
        setState({ status: "empty", data: result.data });
        return;
      }

      setState({ status: "success", data: result.data });
    },
    [intakeId],
  );

  const handleBudgetDataChange = useCallback((budgetData: BudgetTrackingData) => {
    setState((prev) => {
      if (prev.status !== "success") return prev;

      return {
        status: "success",
        data: mergeBudgetTrackingData(prev.data, budgetData),
      };
    });
  }, []);

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    try {
      await load();
    } finally {
      setIsRetrying(false);
    }
  }, [load]);

  useEffect(() => {
    void load();
    return () => abortRef.current?.abort();
  }, [load]);

  if (state.status === "loading") {
    return <RecommendationsSkeleton />;
  }

  if (state.status === "error") {
    const isNotFound = state.statusCode === 404;

    return (
      <RecommendationsError
        title={isNotFound ? "Plan not found" : undefined}
        message={
          isNotFound
            ? "We couldn't find a wedding intake with this link. It may have been removed or the URL is incorrect."
            : state.message
        }
        onRetry={isNotFound ? undefined : handleRetry}
        isRetrying={isRetrying}
      />
    );
  }

  if (state.status === "empty") {
    return (
      <RecommendationsEmpty
        intakeId={state.data.intake_id}
        city={state.data.city}
      />
    );
  }

  return (
    <RecommendationsDashboard
      data={state.data}
      onBudgetDataChange={handleBudgetDataChange}
    />
  );
}

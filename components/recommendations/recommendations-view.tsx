"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
      const controller = new AbortController();
      abortRef.current = controller;

      if (!soft) {
        setState({ status: "loading" });
      }

      try {
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
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        if (!soft) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Failed to load recommendations",
          });
        } else {
          toast.error("Failed to load recommendations");
        }
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
      }
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
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
    };
  }, [load]);

  return (
    <AnimatePresence mode="wait">
      {state.status === "loading" && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <RecommendationsSkeleton />
        </motion.div>
      )}

      {state.status === "error" && (
        <motion.div
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <RecommendationsError
            title={
              state.statusCode === 404
                ? "Plan not found"
                : "We couldn't load your wedding plan"
            }
            message={
              state.statusCode === 404
                ? "We couldn't find a wedding intake with this link. It may have been removed or the URL is incorrect."
                : "This may be caused by a temporary network interruption."
            }
            secondaryMessage={
              state.statusCode === 404
                ? undefined
                : "Your saved recommendations remain securely stored."
            }
            retryLabel={state.statusCode === 404 ? undefined : "Retry loading plan"}
            onRetry={state.statusCode === 404 ? undefined : handleRetry}
            isRetrying={isRetrying}
          />
        </motion.div>
      )}

      {state.status === "empty" && (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <RecommendationsEmpty
            intakeId={state.data.intake_id}
            city={state.data.city}
          />
        </motion.div>
      )}

      {state.status === "success" && (
        <motion.div
          key="success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <RecommendationsDashboard
            data={state.data}
            onBudgetDataChange={handleBudgetDataChange}
            onReload={() => void load()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

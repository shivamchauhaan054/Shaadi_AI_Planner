"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/shared/error-state";

type RecommendationsErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RecommendationsErrorPage({
  error,
  reset,
}: RecommendationsErrorPageProps) {
  useEffect(() => {
    console.error("[recommendations/error]", error);
  }, [error]);

  return (
    <ErrorState
      title="Could not load your plan"
      message="We had trouble loading your recommendations. Please try again."
      onRetry={reset}
    />
  );
}

"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/shared/error-state";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <ErrorState
      title="We hit a snag"
      message="Something unexpected happened. You can try again or return home."
      onRetry={reset}
    />
  );
}

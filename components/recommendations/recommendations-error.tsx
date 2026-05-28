import { ErrorState } from "@/components/shared/error-state";

type RecommendationsErrorProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
};

export function RecommendationsError({
  title,
  message,
  onRetry,
  isRetrying,
}: RecommendationsErrorProps) {
  return (
    <ErrorState
      title={title}
      message={message}
      onRetry={onRetry}
      isRetrying={isRetrying}
    />
  );
}

import { ErrorState } from "@/components/shared/error-state";

type RecommendationsErrorProps = {
  title?: string;
  message: string;
  secondaryMessage?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  retryLabel?: string;
};

export function RecommendationsError({
  title,
  message,
  secondaryMessage,
  onRetry,
  isRetrying,
  retryLabel,
}: RecommendationsErrorProps) {
  return (
    <ErrorState
      title={title}
      message={message}
      secondaryMessage={secondaryMessage}
      onRetry={onRetry}
      isRetrying={isRetrying}
      retryLabel={retryLabel}
    />
  );
}

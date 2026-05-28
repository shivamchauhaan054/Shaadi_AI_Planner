import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

function BudgetCardSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-card/80 p-5">
      <Skeleton className="h-3 w-24 rounded-full" />
      <Skeleton className="h-8 w-32 rounded-lg" />
    </div>
  );
}

export function RecommendationsSkeleton() {
  return (
    <div
      className="page-shell"
      role="status"
      aria-busy="true"
      aria-label="Loading your wedding plan"
    >
      <Container size="wide">
        <div className="mb-10 space-y-4 md:mb-12">
          <Skeleton className="h-4 w-36 rounded-full" />
          <Skeleton className="h-10 w-full max-w-2xl rounded-xl" />
          <Skeleton className="h-5 w-full max-w-lg rounded-md" />
          <div className="flex flex-wrap gap-2 pt-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-28 rounded-full" />
            ))}
          </div>
        </div>

        <div className="mb-10 md:mb-12">
          <Skeleton className="mb-6 h-8 w-48 rounded-lg" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <BudgetCardSkeleton key={i} />
            ))}
          </div>
          <Skeleton className="mt-6 h-3 w-full rounded-full" />
        </div>

        <div className="mb-12 md:mb-16">
          <Skeleton className="mb-6 h-8 w-56 rounded-lg" />
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-2xl md:h-40" />
            ))}
          </div>
        </div>

        <div className="border-t border-border/60 pt-12">
          <Skeleton className="mb-8 h-8 w-40 rounded-lg" />
          <div className="mb-10 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="mb-4 h-6 w-36 rounded-md" />
          <div className="space-y-3 rounded-2xl border border-border/60 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

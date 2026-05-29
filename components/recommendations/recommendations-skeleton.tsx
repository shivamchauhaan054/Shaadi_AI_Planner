import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

function BudgetCardSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-card/85 p-5 shadow-soft">
      <Skeleton className="h-3.5 w-24 rounded-full" />
      <Skeleton className="h-8 w-32 rounded-lg" />
    </div>
  );
}

function VendorCardSkeleton({ index }: { index: number }) {
  const lineWidths = [
    ["w-[92%]", "w-[85%]"],
    ["w-[96%]", "w-[78%]"],
    ["w-[90%]", "w-[88%]"],
    ["w-[94%]", "w-[82%]"],
  ];
  const widths = lineWidths[index % 4];

  return (
    <div className="flex flex-col space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        {index === 0 && <Skeleton className="h-6 w-24 rounded-full bg-primary/20" />}
      </div>
      
      <div className="pt-2">
        <div className="flex items-baseline gap-1">
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
        <Skeleton className="mt-3 h-1.5 w-full rounded-full" />
      </div>

      <div className="space-y-2.5 pt-4 border-t border-border/40 flex-1">
        <Skeleton className={`h-4 ${widths[0]} rounded-md`} />
        <Skeleton className={`h-4 ${widths[1]} rounded-md`} />
      </div>
      
      <div className="flex flex-wrap gap-2 pt-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>
    </div>
  );
}

export function RecommendationsSkeleton() {
  return (
    <div
      className="page-shell animate-fade-up duration-300"
      role="status"
      aria-busy="true"
      aria-label="Loading your wedding plan"
    >
      <Container size="wide">
        <div className="mb-10 space-y-4 md:mb-12">
          <Skeleton className="h-4.5 w-36 rounded-full" />
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
          <Skeleton className="mt-6 h-4 w-full rounded-full" />
        </div>

        <div className="mb-12 md:mb-16">
          <Skeleton className="mb-6 h-8 w-56 rounded-lg" />
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <VendorCardSkeleton key={i} index={i} />
            ))}
          </div>
        </div>

        <div className="border-t border-border/60 pt-12">
          <Skeleton className="mb-8 h-8 w-40 rounded-lg" />
          <div className="mb-10 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-2xl border border-border/60 bg-card/60 p-5 shadow-soft">
                <Skeleton className="h-4 w-28 rounded-full" />
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-3 w-3/4 rounded-full mt-2" />
              </div>
            ))}
          </div>
          <Skeleton className="mb-4 h-6 w-36 rounded-md" />
          <div className="space-y-3 rounded-2xl border border-border/60 p-4 bg-card/60 shadow-soft">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

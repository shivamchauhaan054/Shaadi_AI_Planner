import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="gradient-wedding-hero animate-in fade-in duration-300">
      <Container className="space-y-24 py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <Skeleton className="mx-auto h-6 w-48 rounded-full" />
          <Skeleton className="mx-auto h-14 w-full max-w-xl rounded-xl" />
          <Skeleton className="mx-auto h-6 w-full max-w-lg rounded-md" />
          <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row max-w-sm mx-auto sm:max-w-none">
            <Skeleton className="h-12 w-full sm:w-40 rounded-xl" />
            <Skeleton className="h-12 w-full sm:w-36 rounded-xl" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </Container>
    </div>
  );
}

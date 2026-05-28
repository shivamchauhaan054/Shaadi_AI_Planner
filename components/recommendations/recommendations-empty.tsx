import { Sparkles } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

type RecommendationsEmptyProps = {
  intakeId: string;
  city: string;
};

export function RecommendationsEmpty({
  intakeId,
  city,
}: RecommendationsEmptyProps) {
  return (
    <div className="page-shell flex min-h-[55vh] items-center py-12 sm:min-h-[60vh]">
      <EmptyState
        icon={Sparkles}
        title="Recommendations pending"
        description={`We saved your ${city} wedding intake, but AI recommendations aren't ready yet. You can start a new intake to generate your plan.`}
        action={{ label: "Plan another wedding", href: "/#intake" }}
      />
      <p className="sr-only">Intake reference: {intakeId}</p>
    </div>
  );
}

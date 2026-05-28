import { RecommendationsView } from "@/components/recommendations/recommendations-view";
import { createPageMetadata } from "@/lib/metadata";

type RecommendationsPageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: RecommendationsPageProps) {
  return createPageMetadata({
    title: "Your wedding plan",
    description: "View AI vendor recommendations and track your wedding budget.",
    path: `/recommendations/${params.id}`,
    noIndex: true,
  });
}

export default function RecommendationsPage({
  params,
}: RecommendationsPageProps) {
  return <RecommendationsView intakeId={params.id} />;
}

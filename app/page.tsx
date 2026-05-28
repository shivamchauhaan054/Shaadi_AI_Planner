import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { WeddingIntakeForm } from "@/components/intake/wedding-intake-form";
import { HomeJsonLd } from "@/components/seo/json-ld";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Plan your dream shaadi",
  description:
    "AI-powered Indian wedding planning with vendor budgets, payment tracking, and a guided intake experience.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WeddingIntakeForm />
    </>
  );
}

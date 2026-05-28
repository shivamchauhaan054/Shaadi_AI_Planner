import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  {
    step: "01",
    title: "Share your vision",
    description:
      "Tell us about your date, city, culture, guest count, and budget.",
  },
  {
    step: "02",
    title: "Get AI guidance",
    description:
      "Receive tailored vendor allocations powered by Groq when configured.",
  },
  {
    step: "03",
    title: "Track & celebrate",
    description:
      "Record payments, monitor spend, and refine your plan as you go.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="section-y border-y border-border/60 bg-secondary/25"
    >
      <Container>
        <SectionHeader
          title="How it works"
          description="Three clear steps from dream to day-of execution."
        />

        <ol className="grid gap-5 md:grid-cols-3">
          {STEPS.map((item) => (
            <li
              key={item.step}
              className="interactive-card list-none p-6 sm:p-8"
            >
              <Badge
                variant="secondary"
                className="mb-4 font-mono text-xs tracking-wider"
              >
                {item.step}
              </Badge>
              <h3 className="font-display text-xl font-semibold">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

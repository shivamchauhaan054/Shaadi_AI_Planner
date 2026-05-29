import { MessageSquare, Sparkles, TrendingUp } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  {
    step: "01",
    title: "Share your vision",
    icon: MessageSquare,
    description:
      "Tell us about your date, city, culture, guest count, and budget.",
    animationClass: "animate-fade-up [animation-delay:100ms]",
  },
  {
    step: "02",
    title: "Get AI guidance",
    icon: Sparkles,
    description:
      "Receive tailored vendor allocations powered by Groq when configured.",
    animationClass: "animate-fade-up [animation-delay:250ms]",
  },
  {
    step: "03",
    title: "Track & celebrate",
    icon: TrendingUp,
    description:
      "Record payments, monitor spend, and refine your plan as you go.",
    animationClass: "animate-fade-up [animation-delay:400ms]",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="section-y border-y border-border/60 bg-secondary/25 overflow-hidden"
    >
      <Container>
        <SectionHeader
          title="How it works"
          description="Three clear steps from dream to day-of execution."
          align="center"
          className="mb-12"
        />

        <div className="relative">
          {/* Connector line for desktop only */}
          <div
            className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-0.5 border-t border-dashed border-primary/20 -z-10"
            aria-hidden="true"
          />

          <ol className="grid gap-6 md:grid-cols-3 z-10 relative">
            {STEPS.map((item) => {
              const IconComponent = item.icon;
              return (
                <li
                  key={item.step}
                  className={`interactive-card list-none p-6 sm:p-8 flex flex-col items-center text-center bg-card/90 ${item.animationClass}`}
                >
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground shadow-soft">
                    <IconComponent className="size-6" />
                  </div>
                  
                  <Badge
                    variant="secondary"
                    className="mb-3 font-mono text-[10px] uppercase tracking-wider bg-primary/5 text-primary border-primary/10"
                  >
                    Step {item.step}
                  </Badge>

                  <h3 className="font-display text-xl font-semibold mb-2 text-foreground">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
                    {item.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}

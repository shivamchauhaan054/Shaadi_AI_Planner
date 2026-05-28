import { cn } from "@/lib/utils";

type StepIntroProps = {
  title: string;
  description: string;
  className?: string;
};

export function StepIntro({ title, description, className }: StepIntroProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-accent/5 p-4 sm:p-5",
        className,
      )}
    >
      <h3 className="font-display text-lg font-semibold text-foreground sm:text-xl">
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

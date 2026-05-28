import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type InlineEmptyProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
};

export function InlineEmpty({
  icon: Icon,
  title,
  description,
  className,
}: InlineEmptyProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border/80 bg-card/50 px-5 py-10 text-center sm:px-8 sm:py-12",
        className,
      )}
      role="status"
    >
      {Icon ? (
        <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden />
        </div>
      ) : null}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InlineEmptyProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Optional helper bullet points shown below the description. */
  bullets?: string[];
  /** Optional CTA button rendered below content. */
  action?: { label: string; onClick?: () => void };
  /**
   * `"default"` — dashed border, transparent bg (original style).
   * `"subtle"`  — solid muted border, soft filled bg (helper/hint card).
   */
  variant?: "default" | "subtle";
  className?: string;
};

export function InlineEmpty({
  icon: Icon,
  title,
  description,
  bullets,
  action,
  variant = "default",
  className,
}: InlineEmptyProps) {
  return (
    <div
      className={cn(
        "rounded-2xl px-5 py-10 text-center sm:px-8 sm:py-12",
        variant === "subtle"
          ? "border border-border/50 bg-secondary/30 shadow-sm"
          : "border border-dashed border-border/80 bg-card/50",
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
        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {bullets && bullets.length > 0 ? (
        <ul className="mx-auto mt-4 max-w-xs space-y-1.5 text-left">
          {bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2 text-[13px] leading-relaxed text-muted-foreground"
            >
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/40"
                aria-hidden
              />
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}
      {action ? (
        <div className="mt-5">
          <Button
            size="sm"
            variant="outline"
            onClick={action.onClick}
            className="gap-1.5 shadow-soft"
          >
            {action.label}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

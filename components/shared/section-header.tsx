import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  id?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  id,
  title,
  description,
  action,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4",
        align === "center" && "text-center sm:text-left",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto sm:mx-0")}>
        <h2
          id={id}
          className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

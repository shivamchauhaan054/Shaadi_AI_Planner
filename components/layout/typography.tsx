import { cn } from "@/lib/utils";

type TypographyProps = React.HTMLAttributes<HTMLElement>;

export function Heading({
  as: Component = "h1",
  className,
  children,
  ...props
}: TypographyProps & { as?: "h1" | "h2" | "h3" | "h4" }) {
  return (
    <Component
      className={cn(
        "font-display text-balance font-semibold tracking-tight text-foreground",
        Component === "h1" && "text-4xl sm:text-5xl lg:text-6xl",
        Component === "h2" && "text-3xl sm:text-4xl",
        Component === "h3" && "text-2xl sm:text-3xl",
        Component === "h4" && "text-xl sm:text-2xl",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Lead({ className, children, ...props }: TypographyProps) {
  return (
    <p
      className={cn(
        "text-lg leading-relaxed text-muted-foreground sm:text-xl",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function Text({ className, children, ...props }: TypographyProps) {
  return (
    <p
      className={cn("text-base leading-relaxed text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function Eyebrow({ className, children, ...props }: TypographyProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type FormBusyOverlayProps = {
  visible: boolean;
  label?: string;
  className?: string;
};

export function FormBusyOverlay({
  visible,
  label = "Submitting your intake…",
  className,
}: FormBusyOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-[2px]",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <Loader2
          className="size-8 animate-spin text-primary"
          aria-hidden
        />
        <p className="text-sm font-medium text-foreground">{label}</p>
      </div>
    </div>
  );
}

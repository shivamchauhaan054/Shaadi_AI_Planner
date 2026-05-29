"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export function ThemeAwareToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="top-center"
      richColors
      closeButton
      expand={false}
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "font-sans rounded-xl border border-border/80 bg-card text-card-foreground shadow-card",
          title: "text-sm font-medium",
          description: "text-sm text-muted-foreground",
        },
      }}
    />
  );
}

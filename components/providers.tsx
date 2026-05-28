"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster
        position="top-center"
        richColors
        closeButton
        expand={false}
        duration={4000}
        toastOptions={{
          classNames: {
            toast:
              "font-sans rounded-xl border border-border/80 bg-card shadow-card",
            title: "text-sm font-medium",
            description: "text-sm text-muted-foreground",
          },
        }}
      />
    </ThemeProvider>
  );
}

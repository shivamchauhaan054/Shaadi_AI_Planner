"use client";

import { ThemeAwareToaster } from "@/components/theme/theme-aware-toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      {children}
      <ThemeAwareToaster />
    </ThemeProvider>
  );
}

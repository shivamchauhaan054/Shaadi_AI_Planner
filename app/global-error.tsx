"use client";

import { useEffect } from "react";
import { DM_Sans } from "next/font/google";

import "./globals.css";

const fontSans = DM_Sans({ subsets: ["latin"], display: "swap" });

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className={`${fontSans.className} min-h-screen bg-background antialiased`}>
        <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            Application error
          </h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            A critical error occurred. Please refresh the page.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}

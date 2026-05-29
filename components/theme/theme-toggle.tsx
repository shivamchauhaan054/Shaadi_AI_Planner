"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  THEME_OPTIONS,
  type ThemeOption,
} from "@/lib/theme/config";

const THEME_LABELS: Record<ThemeOption, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

const THEME_ICONS: Record<ThemeOption, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

type ThemeToggleProps = {
  className?: string;
  /** Compact layout for dense mobile nav rows */
  variant?: "icon" | "menu-row";
};

export function ThemeToggle({ className, variant = "icon" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const selectTheme = useCallback(
    (value: ThemeOption) => {
      setTheme(value);
      setOpen(false);
    },
    [setTheme],
  );

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("size-9 shrink-0", className)}
        aria-label="Theme"
        disabled
      >
        <span className="size-4 rounded-full bg-muted" aria-hidden />
      </Button>
    );
  }

  const activeTheme = (theme ?? "system") as ThemeOption;
  const isDark = resolvedTheme === "dark";

  if (variant === "menu-row") {
    return (
      <div className={cn("space-y-1", className)}>
        <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Appearance
        </p>
        <div className="grid grid-cols-3 gap-1 px-1">
          {THEME_OPTIONS.map((option) => {
            const Icon = THEME_ICONS[option];
            const selected = activeTheme === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => selectTheme(option)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg px-2 py-2.5 text-xs font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  selected
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
                aria-pressed={selected}
                aria-label={`${THEME_LABELS[option]} theme`}
              >
                <Icon className="size-4" aria-hidden />
                {THEME_LABELS[option]}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="relative size-9 shrink-0 text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
        aria-label="Change color theme"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <motion.span
          className="relative flex size-4 items-center justify-center"
          initial={false}
          animate={
            prefersReducedMotion
              ? undefined
              : { rotate: open ? 12 : 0, scale: open ? 1.05 : 1 }
          }
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Sun
            className={cn(
              "absolute size-4 transition-all duration-300 ease-out",
              isDark
                ? "rotate-90 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100",
            )}
            aria-hidden
          />
          <Moon
            className={cn(
              "absolute size-4 transition-all duration-300 ease-out",
              isDark
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-0 opacity-0",
            )}
            aria-hidden
          />
        </motion.span>
      </Button>

      {open ? (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            aria-label="Theme options"
            className="absolute right-0 top-full z-50 mt-2 min-w-[10.5rem] overflow-hidden rounded-xl border border-border/80 bg-popover p-1 shadow-card backdrop-blur-sm"
          >
            {THEME_OPTIONS.map((option) => {
              const Icon = THEME_ICONS[option];
              const selected = activeTheme === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  onClick={() => selectTheme(option)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover",
                    selected
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-secondary/80",
                  )}
                >
                  <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
                  {THEME_LABELS[option]}
                </button>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}

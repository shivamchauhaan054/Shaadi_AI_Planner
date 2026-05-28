import Link from "next/link";
import { Heart } from "lucide-react";

import { Container } from "@/components/layout/container";
import { APP_NAME } from "@/lib/constants";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-secondary/30 py-10 md:py-12">
      <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-sm font-medium text-foreground transition-opacity hover:opacity-80"
        >
          <Heart className="size-4 text-primary" aria-hidden />
          {APP_NAME}
        </Link>
        <p className="text-center text-sm text-muted-foreground sm:text-right">
          © {year} {APP_NAME}. Crafted for couples who dream in detail.
        </p>
      </Container>
    </footer>
  );
}

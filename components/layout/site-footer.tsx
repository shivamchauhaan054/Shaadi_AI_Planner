import Link from "next/link";
import { Heart, Instagram, Twitter, Compass } from "lucide-react";

import { Container } from "@/components/layout/container";
import { APP_NAME } from "@/lib/constants";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-secondary/25 py-12 md:py-16">
      <Container className="grid gap-10 md:grid-cols-4 lg:gap-12">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-lg font-semibold text-foreground transition-opacity hover:opacity-80"
          >
            <Heart className="size-4 text-primary fill-current" aria-hidden />
            {APP_NAME}
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AI-powered Indian wedding planner helping couples map budgets, vendor allocations, and payment tracking with elegance and clarity.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Follow us on Twitter"
            >
              <Twitter className="size-4" />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Follow us on Pinterest"
            >
              <Compass className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Planning Tools</h4>
          <ul className="space-y-2.5">
            <li>
              <Link href="/#intake" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Budget Intake
              </Link>
            </li>
            <li>
              <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                AI Recommendations
              </Link>
            </li>
            <li>
              <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Payment History
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Resources</h4>
          <ul className="space-y-2.5">
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Shaadi Guide
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Vendor Checklist
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ Support
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Company</h4>
          <ul className="space-y-2.5">
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Use
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-border/40 mt-12 pt-8">
        <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {year} {APP_NAME}. Crafted for couples who dream in detail. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground text-center sm:text-right flex items-center gap-1">
            Made with <Heart className="size-3 text-primary fill-current" /> in India.
          </p>
        </Container>
      </div>
    </footer>
  );
}

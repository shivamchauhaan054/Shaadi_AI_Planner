"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Eyebrow, Heading, Lead } from "@/components/layout/typography";
import { Button } from "@/components/ui/button";
import { APP_DESCRIPTION } from "@/lib/constants";
import { fadeUp } from "@/lib/motion/variants";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="gradient-wedding-hero relative overflow-hidden pb-20 pt-16 md:pb-28 md:pt-24"
      aria-labelledby="hero-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23a63d5c%22 fill-opacity=%220.04%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"
      />

      <Container className="relative">
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div custom={0} variants={prefersReducedMotion ? undefined : fadeUp}>
            <Eyebrow className="mb-6">AI-powered shaadi planning</Eyebrow>
          </motion.div>

          <motion.div custom={1} variants={prefersReducedMotion ? undefined : fadeUp}>
            <Heading id="hero-heading" as="h1" className="mb-6">
              Plan your wedding with{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                elegance & clarity
              </span>
            </Heading>
          </motion.div>

          <motion.div custom={2} variants={prefersReducedMotion ? undefined : fadeUp}>
            <Lead className="mx-auto mb-10 max-w-2xl">{APP_DESCRIPTION}</Lead>
          </motion.div>

          <motion.div
            custom={3}
            variants={prefersReducedMotion ? undefined : fadeUp}
            className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <Button
              asChild
              size="lg"
              className="h-12 w-full gap-2 px-8 shadow-card transition-transform hover:scale-[1.02] sm:w-auto"
            >
              <Link href="#intake">
                Create your plan
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 w-full px-8 sm:w-auto"
            >
              <Link href="#features">Explore features</Link>
            </Button>
          </motion.div>

          <motion.ul
            custom={4}
            variants={prefersReducedMotion ? undefined : fadeUp}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            <li className="inline-flex items-center gap-2">
              <Sparkles className="size-4 text-accent" aria-hidden />
              Timeline & budget AI
            </li>
            <li className="hidden h-4 w-px bg-border sm:block" aria-hidden />
            <li>Multi-culture ceremonies</li>
            <li className="hidden h-4 w-px bg-border sm:block" aria-hidden />
            <li>No login required</li>
          </motion.ul>
        </motion.div>
      </Container>
    </section>
  );
}

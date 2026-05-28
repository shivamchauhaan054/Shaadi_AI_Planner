"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Calendar, Sparkles, Users, Wallet } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WEDDING_FEATURES } from "@/lib/constants";

const iconMap = {
  calendar: Calendar,
  wallet: Wallet,
  sparkles: Sparkles,
  users: Users,
} as const;

export function FeaturesSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="features" className="section-y bg-background/50">
      <Container>
        <SectionHeader
          title="Everything your shaadi needs"
          description="A premium planning workspace inspired by boutique wedding studios—soft, structured, and stress-free."
          align="center"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WEDDING_FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div
                key={feature.title}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
              >
                <Card className="interactive-card group h-full">
                  <CardHeader>
                    <div
                      className="mb-2 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary transition-colors duration-200 group-hover:from-primary group-hover:to-accent group-hover:text-primary-foreground"
                      aria-hidden
                    >
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="font-display text-lg">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

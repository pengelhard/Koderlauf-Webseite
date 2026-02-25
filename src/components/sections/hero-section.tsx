"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { RealtimeCountdown } from "@/components/sections/realtime-countdown";
import { Button } from "@/components/ui/button";
import { useMagneticHover } from "@/hooks/use-magnetic-hover";
import { useParallax } from "@/hooks/use-parallax";

interface HeroSectionProps {
  countdownTarget: string;
  countdownLabel?: string | null;
}

const ctaItems = [
  { href: "/ergebnisse", label: "Ergebnisse 2026", variant: "secondary" as const },
  { href: "/galerie", label: "Galerie", variant: "outline" as const },
  { href: "/anmelden", label: "Jetzt anmelden", variant: "default" as const },
];

function MagneticCta({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "default" | "secondary" | "outline";
}) {
  const magnetic = useMagneticHover(14);

  return (
    <motion.div style={{ x: magnetic.x, y: magnetic.y }} {...magnetic.handlers}>
      <Link href={href} aria-label={label}>
        <Button
          variant={variant}
          size="xl"
          className="w-full min-w-[200px] rounded-2xl text-[0.76rem] sm:w-auto"
        >
          {label}
        </Button>
      </Link>
    </motion.div>
  );
}

export function HeroSection({ countdownTarget, countdownLabel }: HeroSectionProps) {
  const { translateY, scale } = useParallax(110);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <motion.div style={{ y: translateY, scale }} className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1448387473223-5c37445527e7?auto=format&fit=crop&w=1600&q=80"
          aria-hidden="true"
        >
          <source src="/video/forest-run.webm" type="video/webm" />
          <source src="/video/forest-run.mp4" type="video/mp4" />
        </video>
      </motion.div>
      <div className="hero-overlay absolute inset-0" aria-hidden="true" />

      <div className="container relative z-10 pb-12 pt-36">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.14,
              },
            },
          }}
          className="mx-auto max-w-5xl text-center"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className="mb-4 inline-flex rounded-full border border-primary-koder/40 bg-dark-elevated/70 px-5 py-2 font-display text-sm uppercase tracking-[0.28em] text-primary-glow"
          >
            Obermögersheim · 2027
          </motion.p>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className="text-balance text-white"
          >
            Koderlauf 2027
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className="mx-auto mt-6 max-w-3xl text-balance text-xl text-text-soft"
          >
            Lauf mit Herz durch den Wald
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <RealtimeCountdown
              eventKey="koderlauf-2027"
              initialTargetDate={countdownTarget}
              initialLabel={countdownLabel}
            />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className="mx-auto mt-9 flex max-w-4xl flex-col items-center justify-center gap-4 sm:flex-row"
          >
            {ctaItems.map((cta) => (
              <MagneticCta key={cta.href} href={cta.href} label={cta.label} variant={cta.variant} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

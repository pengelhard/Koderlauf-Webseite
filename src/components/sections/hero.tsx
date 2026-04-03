"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CountdownTimer } from "@/components/sections/countdown";
import { RunnerInfoDialog } from "@/components/sections/runner-info-dialog";

const HERO_VIDEO_SRC = "https://videos.pexels.com/video-files/2711092/2711092-hd_1920_1080_24fps.mp4";
const HERO_FALLBACK_IMG = "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [videoError, setVideoError] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  // Kein scroll-gekoppeltes Opacity mehr: In Chrome-Responsive/Device-Mode liefert useScroll
  // mitunter sofort progress≈1 → Opacity 0 → nur dunkles Video/Overlay sichtbar („schwarzer Bildschirm“).

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 z-0"
      >
        {!videoError ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
            className="h-full w-full object-cover"
            poster={HERO_FALLBACK_IMG}
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
        ) : (
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-full"
          >
            <Image
              src={HERO_FALLBACK_IMG}
              alt="Koderlauf"
              fill
              priority
              className="object-cover"
              unoptimized
            />
          </motion.div>
        )}
      </motion.div>

      <div className="absolute inset-0 z-10 bg-gradient-to-t from-forest-deep/90 via-forest-deep/50 to-forest-deep/30" />

      <motion.div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" as const, stiffness: 150 }}
          className="mb-2"
        >
          <Image
            src="/mascot-koderlauf.png"
            alt="Koderlauf Maskottchen"
            width={72}
            height={79}
            className="drop-shadow-[0_4px_20px_rgba(255,107,0,0.4)]"
            priority
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange"
        >
          04. April 2026 &middot; Obermögersheim
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl font-extrabold leading-[0.95] tracking-[-0.04em] text-white sm:text-7xl md:text-8xl lg:text-[7rem]"
        >
          KODERLAUF
          <br />
          <span className="text-gradient-orange">2026</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 max-w-lg text-lg font-medium text-white/80 md:text-xl"
        >
          Lauf mit Herz durch den Wald
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <CountdownTimer targetDate="2026-04-04T14:00:00" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.62 }}
          className="mt-8 flex justify-center px-2"
        >
          <RunnerInfoDialog />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.76 }}
          className="mt-8 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/strecken"
            className="rounded-2xl border-2 border-white/20 bg-white/10 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/20"
          >
            Strecken
          </Link>
          <Link
            href="/galerie"
            className="rounded-2xl border-2 border-white/20 bg-white/10 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/20"
          >
            Galerie
          </Link>
          <Link
            href="/anmeldung"
            className="glow-orange rounded-2xl bg-koder-orange px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-all hover:bg-koder-orange-bright"
          >
            Jetzt anmelden
          </Link>
        </motion.div>
      </motion.div>

      {/* No bottom fade — avoids flicker line at video-to-content transition */}
    </section>
  );
}

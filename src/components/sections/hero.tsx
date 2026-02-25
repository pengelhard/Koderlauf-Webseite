"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CountdownTimer } from "@/components/sections/countdown";

const HERO_VIDEO_SRC = "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4";
const HERO_FALLBACK_IMG = "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=1920&q=80";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [videoError, setVideoError] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      {/* Video / Fallback Image with parallax */}
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
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-full w-full"
          >
            <Image
              src={HERO_FALLBACK_IMG}
              alt="Waldlauf bei Sonnenuntergang"
              fill
              priority
              className="object-cover"
              unoptimized
            />
          </motion.div>
        )}
      </motion.div>

      {/* Forest gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-forest-deep/90 via-forest-deep/50 to-forest-deep/30" />

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange"
        >
          Obermögersheim &middot; Waldlauf
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl font-extrabold leading-[0.95] tracking-[-0.04em] text-white sm:text-7xl md:text-8xl lg:text-[7rem]"
        >
          KODERLAUF
          <br />
          <span className="text-gradient-orange">2027</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 max-w-lg text-lg font-medium text-white/80 md:text-xl"
        >
          Lauf mit Herz durch den Wald
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10"
        >
          <CountdownTimer targetDate="2027-06-15T09:00:00" />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/ergebnisse"
            className="rounded-2xl border-2 border-white/20 bg-white/10 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/20"
          >
            Ergebnisse 2026
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

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

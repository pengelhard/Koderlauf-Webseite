"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EVENT } from "@/lib/event-config";
import { fadeReveal, useStaticReveal } from "@/hooks/use-static-reveal";

function AnimatedNumber({
  value,
  suffix = "",
  instant = false,
}: {
  value: number;
  suffix?: string;
  /** Zahl sofort setzen statt hochzählen – Textmutationen während des
      Scrollens erzeugen auf Mobile Rendering-Artefakte (Ghosting). */
  instant?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (instant) {
      motionVal.set(value);
      return;
    }
    if (inView) {
      const controls = animate(motionVal, value, { duration: 1.5, ease: "easeOut" });
      return () => controls.stop();
    }
  }, [inView, motionVal, value, instant]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${v}${suffix}`;
    });
    return unsub;
  }, [rounded, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export function Stats() {
  const [daysLeft, setDaysLeft] = useState(0);
  const [anmeldungen, setAnmeldungen] = useState(0);
  const staticReveal = useStaticReveal();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const diff = new Date(EVENT.datum).getTime() - Date.now();
      setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Live-Anmeldezahlen 2027 (gleiche Quelle wie /anmeldungen)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/anmeldungen?jahr=2027", { cache: "no-store" });
        const json = await res.json();
        if (!cancelled && typeof json.total === "number") {
          setAnmeldungen(json.total);
        }
      } catch {
        /* still 0 */
      }
    }

    void load();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const stats = [
    {
      value: anmeldungen,
      label: `Anmeldungen ${EVENT.jahr}`,
      href: "/anmeldungen" as string | undefined,
    },
    {
      value: EVENT.strecken.length,
      label: `Strecken ${EVENT.jahr}`,
      href: "/strecken" as string | undefined,
    },
    { value: daysLeft, label: "Tage bis zum Start" },
    { value: 50, label: "Jahre SV Obermögersheim" },
  ];

  return (
    <section className="border-y border-border bg-forest-deep py-12 text-white sm:py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6">
        {stats.map((stat) => {
          const number = (
            <p className="text-3xl font-extrabold text-koder-orange sm:text-5xl">
              <AnimatedNumber value={stat.value} instant={staticReveal} />
            </p>
          );
          return (
            <motion.div
              key={stat.label}
              {...fadeReveal(staticReveal)}
              className="text-center"
            >
              {"href" in stat && stat.href ? (
                <Link
                  href={stat.href}
                  className="group block rounded-xl transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-koder-orange"
                  aria-label={`${stat.value} ${stat.label} – Seite öffnen`}
                >
                  {number}
                  <p className="mt-2 text-xs font-medium uppercase tracking-widest text-white/60 underline-offset-4 group-hover:underline sm:text-sm">
                    {stat.label}
                  </p>
                </Link>
              ) : (
                <>
                  {number}
                  <p className="mt-2 text-xs font-medium uppercase tracking-widest text-white/60 sm:text-sm">
                    {stat.label}
                  </p>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

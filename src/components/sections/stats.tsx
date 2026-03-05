"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView) animate(motionVal, value, { duration: 1.5, ease: "easeOut" });
  }, [inView, motionVal, value]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${v}${suffix}`;
    });
    return unsub;
  }, [rounded, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

interface CountData {
  total: number;
  strecken: number;
}

export function Stats() {
  const [counts, setCounts] = useState<CountData>({ total: 0, strecken: 4 });

  useEffect(() => {
    fetch("/api/anmeldungen")
      .then((r) => r.json())
      .then((d) => {
        if (d.count) setCounts({ total: d.count, strecken: 4 });
      })
      .catch(() => {});
  }, []);

  const daysLeft = Math.max(0, Math.ceil((new Date("2026-04-04T14:00:00").getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const stats = [
    { value: counts.total, label: "Anmeldungen", suffix: "" },
    { value: counts.strecken, label: "Strecken", suffix: "" },
    { value: daysLeft, label: "Tage bis zum Start", suffix: "" },
    { value: 1, label: "Koderlauf", suffix: "." },
  ];

  return (
    <section className="border-y border-border bg-forest-deep py-12 text-white sm:py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-3xl font-extrabold text-koder-orange sm:text-5xl">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-widest text-white/60 sm:text-sm">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

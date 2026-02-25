"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getParticipantCounts } from "@/lib/data/events";

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
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
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView) {
      animate(motionVal, value, { duration: 1.5, ease: "easeOut" });
    }
  }, [inView, motionVal, value]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${v}${suffix}`;
    });
    return unsubscribe;
  }, [rounded, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export function Stats() {
  const [counts, setCounts] = useState({ "5km": 0, "10km": 0, kids: 0, total: 0 });

  useEffect(() => {
    getParticipantCounts().then(setCounts);
  }, []);

  const stats = [
    { value: counts.total, label: "Läufer 2026", suffix: "" },
    { value: 5, label: "Kilometer (kurz)", suffix: "km" },
    { value: 10, label: "Kilometer (lang)", suffix: "km" },
    { value: 3, label: "Distanzen", suffix: "" },
  ];

  return (
    <section className="border-y border-border bg-forest-deep py-16 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-4xl font-extrabold text-koder-orange sm:text-5xl">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-sm font-medium uppercase tracking-widest text-white/60">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

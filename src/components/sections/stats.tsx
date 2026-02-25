"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ value }: { value: number }) {
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
      if (ref.current) ref.current.textContent = String(v);
    });
    return unsubscribe;
  }, [rounded]);

  return <span ref={ref}>0</span>;
}

const stats = [
  { value: 247, label: "Läufer 2026", suffix: "" },
  { value: 5, label: "Kilometer", suffix: "km" },
  { value: 3, label: "Kategorien", suffix: "" },
  { value: 2024, label: "Seit", suffix: "" },
];

export function Stats() {
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
              <AnimatedNumber value={stat.value} />
              {stat.suffix}
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

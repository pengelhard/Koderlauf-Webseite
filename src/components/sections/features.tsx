"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mountain, TreePine, Zap, Baby } from "lucide-react";

const strecken = [
  { id: "kinderlauf", name: "Kinderlauf", dist: "800 m", icon: Baby, color: "#22C55E", diff: "Leicht" },
  { id: "kurz-knackig", name: "Kurz und knackig", dist: "4 km", icon: Zap, color: "#FF9F1C", diff: "Mittel" },
  { id: "koderrunde", name: "Koderrunde", dist: "8,5 km", icon: TreePine, color: "#FF6B00", diff: "Mittel" },
  { id: "trailrun", name: "Trailrun", dist: "11,25 km", icon: Mountain, color: "#EF4444", diff: "Schwer" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            Unsere Strecken
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Für jeden das Richtige
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {strecken.map((s) => (
            <motion.div key={s.id} variants={item}>
              <Link
                href={`/strecken?route=${s.id}#${s.id}`}
                className="group block rounded-3xl border border-border bg-card p-6 transition-all hover:border-koder-orange/30 hover:shadow-xl hover:shadow-koder-orange/5"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl transition-colors group-hover:scale-110"
                  style={{ backgroundColor: `${s.color}15`, color: s.color }}
                >
                  <s.icon size={24} />
                </div>
                <h3 className="mt-5 text-xl font-bold">{s.name}</h3>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-2xl font-extrabold text-koder-orange">{s.dist}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.diff}
                  </span>
                </div>
                <p className="mt-3 text-sm text-koder-orange opacity-0 transition-opacity group-hover:opacity-100">
                  Strecke ansehen →
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

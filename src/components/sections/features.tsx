"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mountain, TreePine, Zap, Baby } from "lucide-react";

const strecken = [
  { id: "kinderlauf", name: "Kinderlauf", dist: "800 m", zeit: "14:00", startgebuehr: "10 €", icon: Baby, color: "#FF6B00" },
  { id: "kurz-knackig", name: "Kurz und knackig", dist: "4 km", zeit: "14:30", startgebuehr: "15 €", icon: Zap, color: "#22C55E" },
  { id: "koderrunde", name: "Koderrunde", dist: "8,5 km", zeit: "14:45", startgebuehr: "15 €", icon: TreePine, color: "#EAB308" },
  { id: "trailrun", name: "Trailrun", dist: "11,25 km", zeit: "15:20", startgebuehr: "15 €", icon: Mountain, color: "#3B82F6" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export function Features() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            Strecken & Startzeiten
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Für jeden das Richtige
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          {strecken.map((s) => (
            <motion.div key={s.id} variants={item}>
              <Link
                href={`/strecken?route=${s.id}`}
                className="group flex flex-col rounded-2xl border border-border p-4 transition-all hover:border-koder-orange/30 hover:shadow-lg sm:p-5"
                style={{
                  background: `linear-gradient(to bottom right, ${s.color}33, ${s.color}0D)`,
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${s.color}15`, color: s.color }}
                  >
                    <s.icon size={16} />
                  </div>
                  <h3 className="truncate text-sm font-bold sm:text-base">{s.name}</h3>
                </div>
                <div className="mt-3 space-y-1">
                  <p className="text-xl font-extrabold sm:text-2xl" style={{ color: s.color }}>
                    {s.dist}
                  </p>
                  <p className="text-xs text-muted-foreground">Start {s.zeit} Uhr</p>
                  <p className="text-xs text-muted-foreground">Startgebühr {s.startgebuehr}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

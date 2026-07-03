"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mountain, TreePine, Zap, Baby, Route, type LucideIcon } from "lucide-react";
import { EVENT, getAktuellerPreis } from "@/lib/event-config";

const ICONS: Record<string, LucideIcon> = {
  kinderlauf: Baby,
  "kurz-knackig": Zap,
  koderrunde: TreePine,
  trailrun: Mountain,
  spielerei: Route,
};

// Nur Opacity animieren: Transform-Animationen beim Scrollen erzeugen auf
// Mobilgeräten Rendering-Artefakte (Ghosting alter Frames).
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4 } } };

export function Features() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            Strecken & Startzeiten {EVENT.jahr}
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
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {EVENT.strecken.map((s) => {
            const Icon = ICONS[s.id] ?? Route;
            return (
              <motion.div key={s.id} variants={item}>
                {/* Solide Farbe statt Alpha-Gradient + nur Farb-Transition:
                    Gradients/Shadows-Transitions triggern auf Mali-GPUs Scroll-Ghosting. */}
                <Link
                  href={`/strecken?route=${s.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-border p-4 transition-colors hover:border-koder-orange/30 lg:hover:shadow-lg sm:p-5"
                  style={{ backgroundColor: `${s.farbe}1F` }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${s.farbe}15`, color: s.farbe }}
                    >
                      <Icon size={16} />
                    </div>
                    <h3 className="truncate text-sm font-bold sm:text-base">{s.name}</h3>
                  </div>
                  <div className="mt-3 space-y-1">
                    <p className="text-xl font-extrabold sm:text-2xl" style={{ color: s.farbe }}>
                      {s.distanz}
                    </p>
                    <p className="text-xs text-muted-foreground">Start {s.startzeit} Uhr</p>
                    <p className="text-xs text-muted-foreground">
                      Startgebühr {getAktuellerPreis(s.id)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

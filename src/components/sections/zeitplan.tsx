"use client";

import { motion } from "framer-motion";
import { Ticket, Award, Baby, Zap, TreePine, Mountain, Route, Clock, type LucideIcon } from "lucide-react";
import { EVENT, getStrecke } from "@/lib/event-config";

const STRECKEN_ICONS: Record<string, LucideIcon> = {
  kinderlauf: Baby,
  "kurz-knackig": Zap,
  koderrunde: TreePine,
  trailrun: Mountain,
  spielerei: Route,
};

const SONSTIGE_ICONS: Record<string, LucideIcon> = {
  "Startnummern- & Chipausgabe": Ticket,
  Siegerehrung: Award,
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.35 } } };

export function Zeitplan() {
  return (
    <section className="bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            {EVENT.datumKurz}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Tagesablauf
          </h2>
        </motion.div>

        <motion.ol
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative mx-auto mt-10 max-w-xl"
        >
          {/* Vertikale Linie */}
          <div className="absolute bottom-5 left-[52px] top-5 w-px bg-border" aria-hidden />

          {EVENT.zeitplan.map((eintrag) => {
            const strecke = eintrag.streckeId ? getStrecke(eintrag.streckeId) : undefined;
            const farbe = strecke?.farbe ?? "#FF6B00";
            const Icon =
              (eintrag.streckeId && STRECKEN_ICONS[eintrag.streckeId]) ||
              SONSTIGE_ICONS[eintrag.titel] ||
              Clock;

            return (
              <motion.li key={`${eintrag.zeit}-${eintrag.titel}`} variants={item} className="relative flex items-center gap-4 py-2.5">
                <span className="w-10 shrink-0 text-right text-sm font-extrabold tabular-nums text-muted-foreground">
                  {eintrag.zeit}
                </span>
                <span
                  className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 ring-background"
                  style={{ backgroundColor: `${farbe}20`, color: farbe }}
                >
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1 rounded-xl border border-border bg-card px-4 py-2.5">
                  <p className="text-sm font-semibold">{eintrag.titel}</p>
                  {strecke && (
                    <p className="text-xs text-muted-foreground">
                      {strecke.distanz}
                    </p>
                  )}
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { EVENT } from "@/lib/event-config";
import { StartzeitenTimeline } from "@/components/sections/startzeiten-timeline";

export function Zeitplan() {
  return (
    <section className="bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Nur Opacity animieren: Scroll-Transforms verursachen auf Mobile Ghosting */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
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

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6"
        >
          <StartzeitenTimeline />
        </motion.div>
      </div>
    </section>
  );
}

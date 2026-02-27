"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Shirt, Clock, Sparkles } from "lucide-react";

export function TShirtPromo() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl border border-koder-orange/20 bg-gradient-to-r from-forest-deep via-forest-deep/95 to-forest-deep"
        >
          <div className="grid items-center gap-0 lg:grid-cols-2">
            {/* Image side */}
            <div className="relative flex items-center justify-center bg-gradient-to-br from-koder-orange/10 to-transparent p-8 sm:p-12">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <Image
                  src="/tshirt-koderlauf.png"
                  alt="Koderlauf 2026 T-Shirt"
                  width={400}
                  height={400}
                  className="rounded-2xl drop-shadow-[0_10px_40px_rgba(255,107,0,0.3)]"
                  unoptimized
                />
                <div className="absolute -top-3 -right-3 flex h-16 w-16 items-center justify-center rounded-full bg-koder-orange text-xs font-black text-white shadow-lg">
                  <div className="text-center leading-tight">
                    <Sparkles size={14} className="mx-auto mb-0.5" />
                    NEU
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Text side */}
            <div className="p-8 text-white sm:p-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-koder-orange/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-koder-orange">
                <Shirt size={14} />
                Limited Edition
              </div>

              <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Das exklusive Koderlauf
                <br />
                <span className="text-koder-orange">2026 T-Shirt</span>
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
                Sichere dir das offizielle Koderlauf-Shirt! Kann direkt bei der
                Anmeldung mitbestellt werden. Ausgabe zusammen mit den
                Startunterlagen am Veranstaltungstag.
              </p>

              <div className="mt-6 flex items-center gap-2 rounded-2xl border border-koder-orange/30 bg-koder-orange/10 px-4 py-3">
                <Clock size={18} className="shrink-0 text-koder-orange" />
                <div>
                  <p className="text-sm font-bold text-koder-orange">Bestellschluss: 07. März 2026</p>
                  <p className="text-xs text-white/60">Jetzt bei der Anmeldung mitbestellen!</p>
                </div>
              </div>

              <Link
                href="/anmeldung"
                className="glow-orange mt-8 inline-flex items-center gap-2 rounded-2xl bg-koder-orange px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-koder-orange-bright"
              >
                Jetzt anmelden & T-Shirt sichern
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

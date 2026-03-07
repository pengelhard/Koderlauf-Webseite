"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Shirt, Clock, ArrowRight } from "lucide-react";

export function TShirtPromo() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: "linear-gradient(135deg, #1a0a2e 0%, #0f172a 30%, #0c1220 50%, #0a3d2a 100%)",
          }}
        >
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-koder-orange/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative grid items-center gap-0 lg:grid-cols-5">
            {/* Image — takes 2 cols */}
            <div className="relative flex items-center justify-center p-6 sm:p-10 lg:col-span-2">
              <motion.div
                initial={{ scale: 0.85, opacity: 0, rotate: -3 }}
                whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2, type: "spring" as const }}
              >
                <Image
                  src="/tshirt-koderlauf.png"
                  alt="Koderlauf 2026 T-Shirt"
                  width={450}
                  height={450}
                  className="rounded-2xl drop-shadow-[0_20px_60px_rgba(255,107,0,0.25)]"
                  priority
                />
              </motion.div>
            </div>

            {/* Text — takes 3 cols */}
            <div className="p-8 text-white sm:p-12 lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-300">
                  <Shirt size={14} />
                  Bestellschluss verlängert!
                </div>

                <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  Hol dir das
                  <br />
                  <span className="bg-gradient-to-r from-koder-orange to-yellow-400 bg-clip-text text-transparent">
                    Koderlauf T-Shirt!
                  </span>
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">
                  Das exklusive Koderlauf 2026 Shirt — direkt bei der Anmeldung
                  mitbestellen. Ausgabe zusammen mit den Startunterlagen.
                </p>

                <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-green-400/30 bg-green-500/10 px-5 py-3">
                  <Clock size={18} className="shrink-0 text-green-400" />
                  <div>
                    <p className="text-sm font-bold text-green-300">Verlängert bis 07. März 2026!</p>
                    <p className="text-xs text-white/50">Letzte Chance — jetzt noch T-Shirt mitbestellen!</p>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/anmeldung"
                    className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-koder-orange to-koder-orange-bright px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-koder-orange/25 transition-all hover:shadow-xl hover:shadow-koder-orange/40"
                  >
                    Jetzt anmelden & bestellen
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

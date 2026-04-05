"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, Navigation, Info } from "lucide-react";

const MAPS_URL =
  "https://maps.google.com/?q=Sportheim+Obermögersheim+91717+Wassertrüdingen";

export default function AnmeldungPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            Koderlauf 2027
          </p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Anmeldung
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Infos zum nächsten Koderlauf am 29. Mai 2027 in Obermögersheim.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 rounded-3xl border border-koder-orange/30 bg-koder-orange/10 p-6 sm:p-8"
        >
          <div className="flex gap-3">
            <Info className="mt-0.5 h-6 w-6 shrink-0 text-koder-orange" aria-hidden />
            <div>
              <h2 className="font-bold text-foreground">Vorverkauf startet in Kürze</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Der Vorverkauf ist noch nicht gestartet. Sobald es Tickets bzw. Startplätze gibt,
                geben wir das <strong className="font-semibold text-foreground">hier auf dieser Seite</strong>{" "}
                bekannt – schaut also gern wieder vorbei.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 grid gap-3 sm:grid-cols-3"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <CalendarDays className="h-5 w-5 shrink-0 text-koder-orange" />
            <div>
              <p className="text-sm font-semibold">Sa, 29. Mai 2027</p>
              <p className="text-xs text-muted-foreground">Nächster Koderlauf</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <Clock className="h-5 w-5 shrink-0 text-koder-orange" />
            <div>
              <p className="text-sm font-semibold">Details folgen</p>
              <p className="text-xs text-muted-foreground">Startzeiten u. a.</p>
            </div>
          </div>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:border-koder-orange/40 hover:bg-koder-orange/5"
          >
            <MapPin className="h-5 w-5 shrink-0 text-koder-orange" />
            <div className="min-w-0">
              <p className="text-sm font-semibold">Sportheim Obermögersheim</p>
              <p className="flex items-center gap-1 text-xs text-koder-orange">
                <Navigation size={10} /> In Google Maps öffnen
              </p>
            </div>
          </a>
        </motion.div>
      </div>
    </div>
  );
}

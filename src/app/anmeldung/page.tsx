"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CalendarDays, MapPin, Clock, Navigation, ExternalLink } from "lucide-react";

const GOOGLE_FORMS_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfAkm13x6Nml-SNe6isACTMN2SYOtutCgVNdmwrw9pbIFHhnQ/viewform";
const GOOGLE_FORMS_EMBED = `${GOOGLE_FORMS_URL}?embedded=true`;

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
            Koderlauf 2026
          </p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Anmeldung
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Sichere dir deinen Startplatz für den Koderlauf 2026 in Obermögersheim!
          </p>
        </motion.div>

        {/* Event Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 grid gap-3 sm:grid-cols-3"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <CalendarDays className="h-5 w-5 shrink-0 text-koder-orange" />
            <div>
              <p className="text-sm font-semibold">Sa, 04. April 2026</p>
              <p className="text-xs text-muted-foreground">Veranstaltungstag</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <Clock className="h-5 w-5 shrink-0 text-koder-orange" />
            <div>
              <p className="text-sm font-semibold">14:00 Uhr Start</p>
              <p className="text-xs text-muted-foreground">Erster Startschuss</p>
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

        {/* Google Forms Embed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <div className="overflow-hidden rounded-3xl border border-border bg-white">
            <iframe
              src={GOOGLE_FORMS_EMBED}
              title="Koderlauf 2026 Anmeldung"
              className="w-full"
              style={{ height: "min(1200px, 80vh)", border: "none" }}
            >
              Wird geladen…
            </iframe>
          </div>
          <a
            href={GOOGLE_FORMS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-koder-orange/40 bg-koder-orange/5 py-4 text-sm font-semibold text-koder-orange transition-all hover:border-koder-orange hover:bg-koder-orange/10"
          >
            <ExternalLink size={18} />
            Anmeldeformular direkt öffnen
          </a>
        </motion.div>

        {/* Strecken-Überblick */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10"
        >
          <h3 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">
            Unsere Strecken 2026
          </h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              { name: "Kinderlauf", dist: "800 m", id: "kinderlauf" },
              { name: "Kurz und knackig", dist: "4 km", id: "kurz-knackig" },
              { name: "Koderrunde", dist: "8,5 km", id: "koderrunde" },
              { name: "Trailrun", dist: "11,25 km", id: "trailrun" },
            ].map((s) => (
              <Link
                key={s.id}
                href={`/strecken?route=${s.id}`}
                className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-3 transition-all hover:border-koder-orange/30 hover:bg-koder-orange/5"
              >
                <span className="font-semibold">{s.name}</span>
                <span className="text-lg font-extrabold text-koder-orange">{s.dist}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

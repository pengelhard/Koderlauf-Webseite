"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, CalendarDays, MapPin, Clock } from "lucide-react";

const GOOGLE_FORMS_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfAkm13x6Nml-SNe6isACTMN2SYOtutCgVNdmwrw9pbIFHhnQ/viewform";

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
            Sichere dir deinen Startplatz für den Koderlauf 2026 in
            Obermögersheim!
          </p>
        </motion.div>

        {/* Event Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 grid gap-4 sm:grid-cols-3"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <CalendarDays className="h-5 w-5 text-koder-orange" />
            <div>
              <p className="text-sm font-semibold">Samstag, 04. April 2026</p>
              <p className="text-xs text-muted-foreground">Veranstaltungstag</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <Clock className="h-5 w-5 text-koder-orange" />
            <div>
              <p className="text-sm font-semibold">14:00 Uhr Start</p>
              <p className="text-xs text-muted-foreground">Erster Startschuss</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <MapPin className="h-5 w-5 text-koder-orange" />
            <div>
              <p className="text-sm font-semibold">Sportheim Obermögersheim</p>
              <p className="text-xs text-muted-foreground">Start & Ziel</p>
            </div>
          </div>
        </motion.div>

        {/* Google Forms CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10"
        >
          <div className="rounded-3xl border-2 border-koder-orange/20 bg-gradient-to-br from-koder-orange/5 to-forest-deep/5 p-8 text-center sm:p-12">
            <Image
              src="/mascot-koderlauf.png"
              alt="Koderlauf Maskottchen"
              width={80}
              height={88}
              className="mx-auto drop-shadow-[0_4px_20px_rgba(255,107,0,0.3)]"
            />
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Jetzt für 2026 anmelden!
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Die Anmeldung für den Koderlauf 2026 läuft über Google Forms.
              Klicke auf den Button und sichere dir deinen Startplatz.
            </p>
            <a
              href={GOOGLE_FORMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-orange mt-8 inline-flex items-center gap-3 rounded-2xl bg-koder-orange px-10 py-5 text-lg font-bold uppercase tracking-widest text-white transition-all hover:bg-koder-orange-bright hover:shadow-xl hover:shadow-koder-orange/25"
            >
              <ExternalLink className="h-5 w-5" />
              Zur Anmeldung
            </a>
            <p className="mt-4 text-xs text-muted-foreground">
              Du wirst zu Google Forms weitergeleitet
            </p>
          </div>
        </motion.div>

        {/* Strecken-Überblick */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <h3 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">
            Unsere Strecken 2026
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { name: "Kinderlauf", dist: "800 m", diff: "Leicht" },
              { name: "Kurz und knackig", dist: "4 km", diff: "Mittel" },
              { name: "Koderrunde", dist: "8,5 km", diff: "Mittel" },
              { name: "Trailrun", dist: "11,25 km", diff: "Schwer" },
            ].map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-3"
              >
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.diff}</p>
                </div>
                <span className="text-lg font-extrabold text-koder-orange">
                  {s.dist}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/strecken"
              className="text-sm font-medium text-koder-orange underline underline-offset-4 hover:text-koder-orange-bright"
            >
              Alle Strecken mit Karte ansehen →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

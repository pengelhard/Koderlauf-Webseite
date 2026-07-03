"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, Navigation, Award, Megaphone } from "lucide-react";
import { EVENT } from "@/lib/event-config";
import { StartzeitenTimeline } from "@/components/sections/startzeiten-timeline";

export default function AnmeldungPage() {
  const fruehbucher = EVENT.preise.phasen[0];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            Koderlauf {EVENT.jahr}
          </p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Anmeldung
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Infos zum nächsten Koderlauf am {EVENT.datumFormatiert} in {EVENT.ort}.
          </p>
        </motion.div>

        {!EVENT.anmeldungOffen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glow-orange mt-8 rounded-3xl border border-koder-orange/40 bg-gradient-to-br from-koder-orange/20 to-koder-orange/5 p-8 text-center sm:p-10"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-koder-orange/20 text-koder-orange">
              <Megaphone className="h-7 w-7" aria-hidden />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-foreground sm:text-3xl">
              Vorverkauf startet in Kürze
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              Der Vorverkauf ist noch nicht gestartet. Sobald es Startplätze gibt, geben wir das{" "}
              <strong className="font-semibold text-foreground">hier auf dieser Seite</strong>{" "}
              bekannt – schaut also gern wieder vorbei.
            </p>
            <p className="mx-auto mt-4 inline-flex rounded-full border border-koder-orange/30 bg-background/60 px-4 py-1.5 text-xs font-semibold text-koder-orange sm:text-sm">
              Tipp: Frühbucherpreise gelten {fruehbucher.hinweis}
            </p>
          </motion.div>
        )}

        {/* Pricing overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-extrabold tracking-tight">Startgebühren {EVENT.jahr}</h2>
          <div className="mt-4 rounded-2xl border border-koder-orange/40 bg-koder-orange/5 p-4">
            <div className="flex items-start gap-3">
              <Award className="mt-0.5 h-5 w-5 shrink-0 text-koder-orange" />
              <div>
                <p className="font-semibold text-foreground">Senioren ab 70 Jahren</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Zahlen auf <strong className="text-foreground">allen Strecken</strong> und in <strong className="text-foreground">allen Phasen</strong> nur
                  <span className="ml-1 text-xl font-extrabold text-koder-orange">{EVENT.preise.seniorenAb70} €</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left">
                  <th className="px-4 py-3 font-semibold">Zeitraum</th>
                  <th className="px-4 py-3 font-semibold">Kinderlauf</th>
                  <th className="px-4 py-3 font-semibold">Alle anderen Strecken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {EVENT.preise.phasen.map((phase) => (
                  <tr key={phase.id} className={phase.id === "vor_ort" ? "bg-muted/30" : undefined}>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{phase.name}</div>
                      <div className="text-xs text-muted-foreground">{phase.hinweis}</div>
                    </td>
                    <td className="px-4 py-3 font-extrabold text-lg">{phase.kinderlauf} €</td>
                    <td className="px-4 py-3 font-extrabold text-lg">{phase.andere} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Die genauen Strecken und weitere Details findest du auf der{" "}
            <a href="/strecken" className="underline hover:text-foreground">Strecken-Seite</a>.
          </p>
        </motion.div>

        {/* Startzeiten 2027 – nur Startzeiten inkl. Siegerehrung */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10"
        >
          <h2 className="text-2xl font-extrabold tracking-tight">Startzeiten {EVENT.jahr}</h2>
          <StartzeitenTimeline />
        </motion.div>

        {/* Info cards: Date + Location (clean 2-col) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 grid gap-3 sm:grid-cols-2"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <CalendarDays className="h-5 w-5 shrink-0 text-koder-orange" />
            <div>
              <p className="text-sm font-semibold">{EVENT.datumKurz}</p>
              <p className="text-xs text-muted-foreground">Nächster Koderlauf</p>
            </div>
          </div>
          <a
            href={EVENT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:border-koder-orange/40 hover:bg-koder-orange/5"
          >
            <MapPin className="h-5 w-5 shrink-0 text-koder-orange" />
            <div className="min-w-0">
              <p className="text-sm font-semibold">{EVENT.ortDetail}</p>
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

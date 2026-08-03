"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  Navigation,
  Award,
  Megaphone,
  Accessibility,
  Shirt,
  Ticket,
  CheckCircle2,
} from "lucide-react";
import { EVENT } from "@/lib/event-config";
import { StartzeitenTimeline } from "@/components/sections/startzeiten-timeline";
import { StartnummernAusgabe } from "@/components/sections/startnummern-ausgabe";
import { fadeReveal, useStaticReveal } from "@/hooks/use-static-reveal";

export default function AnmeldungPage() {
  const fruehbucher = EVENT.preise.phasen[0];
  const staticReveal = useStaticReveal();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeReveal(staticReveal, { duration: 0.6 })}
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
            {...fadeReveal(staticReveal, { duration: 0.6, delay: 0.15 })}
            className="glow-orange mt-8 rounded-3xl border border-koder-orange/40 bg-koder-orange/20 p-8 text-center sm:p-10"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-koder-orange/20 text-koder-orange">
              <Megaphone className="h-7 w-7" aria-hidden />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-foreground sm:text-3xl">
              Vorverkauf startet in Kürze
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              Die Online-Anmeldung läuft über {EVENT.anmeldePartner.name}. Sobald der
              Vorverkauf startet, geben wir das{" "}
              <strong className="font-semibold text-foreground">hier auf dieser Seite</strong>{" "}
              bekannt – inklusive optionalem T-Shirt und günstigerer Abendkarte für Tape Jam.
            </p>
            <p className="mx-auto mt-4 inline-flex rounded-full border border-koder-orange/30 bg-background/60 px-4 py-1.5 text-xs font-semibold text-koder-orange sm:text-sm">
              Tipp: Frühbucherpreise gelten {fruehbucher.hinweis}
            </p>
          </motion.div>
        )}

        <motion.div
          {...fadeReveal(staticReveal, { duration: 0.6, delay: 0.2 })}
          className="mt-8"
        >
          <StartnummernAusgabe />
        </motion.div>

        <motion.div
          {...fadeReveal(staticReveal, { duration: 0.6, delay: 0.25 })}
          className="mt-8"
        >
          <h2 className="text-2xl font-extrabold tracking-tight">Startgebühren {EVENT.jahr}</h2>

          <div className="mt-4 rounded-2xl border border-border bg-card p-4">
            <p className="text-sm font-semibold">In der Startgebühr enthalten</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {EVENT.startgebuehrEnthaelt.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-koder-orange" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-2xl border border-koder-orange/40 bg-koder-orange/5 p-4">
            <div className="flex items-start gap-3">
              <Award className="mt-0.5 h-5 w-5 shrink-0 text-koder-orange" />
              <div>
                <p className="font-semibold text-foreground">Senioren ab 70 Jahren</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Zahlen auf <strong className="text-foreground">allen Strecken</strong> und in{" "}
                  <strong className="text-foreground">allen Phasen</strong> nur
                  <span className="ml-1 text-xl font-extrabold text-koder-orange">
                    {EVENT.preise.seniorenAb70} €
                  </span>
                  – ohne Preiserhöhung.
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
                    <td className="px-4 py-3 text-lg font-extrabold">{phase.kinderlauf} €</td>
                    <td className="px-4 py-3 text-lg font-extrabold">{phase.andere} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Mindestalter: Kurz und knackig ab 8, Koderrunde ab 12, Trailrun ab 16, Spielerei ab 18.
            Kinderlauf bis max. 8 Jahre. {EVENT.elternEinverstaendnis} Strecken und Details:{" "}
            <a href="/strecken" className="underline hover:text-foreground">
              Strecken-Seite
            </a>
            . Weitere Fragen:{" "}
            <a href="/#faq" className="underline hover:text-foreground">
              FAQ
            </a>
            .
          </p>
        </motion.div>

        <motion.div
          {...fadeReveal(staticReveal, { duration: 0.6, delay: 0.28 })}
          className="mt-10"
        >
          <h2 className="text-2xl font-extrabold tracking-tight">Gleich mitbestellen</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Bei der Online-Anmeldung optional dazu buchen.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={EVENT.extras.tshirt.bild}
                  alt="Koderlauf-T-Shirt – Motiv 2026"
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-koder-orange">
                  <Shirt size={18} aria-hidden />
                  <p className="text-xs font-semibold uppercase tracking-widest">Merchandise</p>
                </div>
                <h3 className="mt-2 text-xl font-extrabold">{EVENT.extras.tshirt.name}</h3>
                <p className="mt-1 text-2xl font-extrabold text-koder-orange">
                  {EVENT.extras.tshirt.preis} €
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {EVENT.extras.tshirt.hinweis}
                </p>
              </div>
            </div>

            <div className="flex flex-col overflow-hidden rounded-3xl border border-koder-orange/35 bg-koder-orange/5">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/tape-jam.webp"
                  alt="Tape Jam – Tribute to 80's Rock"
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <p className="absolute bottom-3 left-4 right-4 text-sm font-bold text-white">
                  Abendprogramm · ab 21:30 Uhr
                </p>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-koder-orange">
                  <Ticket size={18} aria-hidden />
                  <p className="text-xs font-semibold uppercase tracking-widest">Teilnehmer-Vorteil</p>
                </div>
                <h3 className="mt-2 text-xl font-extrabold">{EVENT.extras.abendkarte.name}</h3>
                <p className="mt-1 text-lg font-extrabold text-koder-orange">
                  {EVENT.extras.abendkarte.preisHinweis}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {EVENT.extras.abendkarte.beschreibung}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fadeReveal(staticReveal, { duration: 0.6, delay: 0.3 })}
          className="mt-10"
        >
          <h2 className="text-2xl font-extrabold tracking-tight">Startzeiten {EVENT.jahr}</h2>
          <div className="mt-4">
            <StartzeitenTimeline />
          </div>
        </motion.div>

        <motion.div
          {...fadeReveal(staticReveal, { duration: 0.6, delay: 0.32 })}
          className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-light/15 text-forest-light">
              <Accessibility className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h3 className="text-base font-extrabold">Früher Start bei Beeinträchtigung</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Geistig oder körperlich beeinträchtigte Personen dürfen auf Wunsch ca.{" "}
                <strong className="font-semibold text-foreground">2–5 Minuten vor dem Startschuss</strong>{" "}
                loslaufen. Bitte möglichst frühzeitig per Mail an{" "}
                <a
                  href={`mailto:${EVENT.kontaktEmail}?subject=Fr%C3%BCher%20Start%20Koderlauf`}
                  className="font-semibold text-koder-orange hover:underline"
                >
                  {EVENT.kontaktEmail}
                </a>
                .
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fadeReveal(staticReveal, { duration: 0.6, delay: 0.35 })}
          className="mobile-gpu-layer mt-8 grid gap-3 sm:grid-cols-2"
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
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-koder-orange/40 hover:bg-koder-orange/5"
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

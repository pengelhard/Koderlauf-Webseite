"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Car,
  ShowerHead,
  Utensils,
  Ticket,
  Backpack,
  Flag,
  Trophy,
  Sparkles,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { EVENT } from "@/lib/event-config";
import { fadeReveal, useStaticReveal, variantsReveal } from "@/hooks/use-static-reveal";

const INFOS = [
  { icon: MapPin, text: "Start/Ziel & Orga: Sportheim Obermögersheim" },
  { icon: Utensils, text: "Essen & Trinken vor Ort; Zielverpflegung direkt nach Zieleinlauf" },
  { icon: Car, text: "Parkmöglichkeiten vor Ort vorhanden" },
  { icon: ShowerHead, text: "Duschen im Sportheim möglich" },
  { icon: Flag, text: "Laufstrecke teilweise offroad (siehe Streckenbeschreibung)" },
  { icon: Ticket, text: "Startnummern- und Chipübergabe ab 13:00 Uhr" },
  { icon: Backpack, text: "Persönliche Gegenstände können in begrenzter Anzahl abgegeben werden" },
];

// Nur Opacity animieren: Scroll-Transforms verursachen auf Mobile Ghosting.
const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } };

export function EventInfo() {
  const staticReveal = useStaticReveal();

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeReveal(staticReveal, { duration: 0.6 })}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Willkommen zum Koderlauf!
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Gemeinsam laufen, lachen, anfeuern – bei uns zählt die Freude am
            Bewegen und das Miteinander im Dorf. Egal ob du selbst an den Start
            gehst, an der Strecke Stimmung machst oder einfach nur das Event
            genießt: Wir freuen uns auf jeden Einzelnen von euch.
          </p>
          <p className="mx-auto mt-4 text-base font-semibold text-koder-orange sm:text-lg">
            Jeder Finisher erhält eine einzigartige Koderlauf-Medaille! 🏅
          </p>
        </motion.div>

        {/* Rückblick / Ausblick */}
        <div className="mobile-gpu-layer mt-10 grid gap-4 sm:grid-cols-2">
          <motion.div
            {...fadeReveal(staticReveal, { duration: 0.5 })}
            className="flex flex-col rounded-3xl border border-border bg-card p-6 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-light/15 text-forest-light">
                <Trophy size={20} />
              </div>
              <h3 className="text-xl font-extrabold">
                Das war {EVENT.vorjahr.jahr}
              </h3>
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Der erste Koderlauf war ein voller Erfolg:{" "}
              <strong className="text-foreground">
                {EVENT.vorjahr.anmeldungen} Anmeldungen
              </strong>
              , Gänsehautmomente im Wald, gute Laune im Dorf und ein
              unvergesslicher Zieleinlauf am Sportheim.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
              <Link
                href="/ergebnisse"
                className="inline-flex items-center gap-1 text-koder-orange transition-colors hover:text-koder-orange-bright"
              >
                Ergebnisse ansehen <ArrowRight size={14} />
              </Link>
              <Link
                href="/galerie"
                className="inline-flex items-center gap-1 text-koder-orange transition-colors hover:text-koder-orange-bright"
              >
                Zur Galerie <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            {...fadeReveal(staticReveal, { duration: 0.5, delay: 0.1 })}
            className="flex flex-col rounded-3xl border border-koder-orange/30 bg-koder-orange/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-koder-orange/15 text-koder-orange">
                <Sparkles size={20} />
              </div>
              <h3 className="text-xl font-extrabold">
                Das kommt {EVENT.jahr}
              </h3>
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Am{" "}
              <strong className="text-foreground">{EVENT.datumKurz}</strong>{" "}
              geht es weiter – mit{" "}
              <strong className="text-foreground">
                {EVENT.strecken.length} Strecken
              </strong>{" "}
              inklusive der neuen „Spielerei“ und der Koderrunde als Lauf und
              Walking (eigene Wertung). Und das Beste: Der Koderlauf ist
              eingebettet in das Jubiläum{" "}
              <strong className="text-foreground">{EVENT.jubilaeum}</strong>.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-semibold">
              <Link
                href="/strecken"
                className="inline-flex items-center gap-1 text-koder-orange transition-colors hover:text-koder-orange-bright"
              >
                Zu den Strecken <ArrowRight size={14} />
              </Link>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <CalendarDays size={14} /> {EVENT.datumKurz}
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          {...variantsReveal(staticReveal, container)}
          className="mobile-gpu-layer mx-auto mt-12 grid max-w-2xl gap-2"
        >
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-koder-orange">
            <MapPin size={14} />
            Ort & Ablauf
          </h3>
          {INFOS.map((info, i) => (
            <motion.div
              key={i}
              variants={item}
              className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-2.5"
            >
              <info.icon size={16} className="mt-0.5 shrink-0 text-forest-light" />
              <span className="text-sm">{info.text}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          {...fadeReveal(staticReveal, { duration: 0.6 })}
          className="mt-8 text-center"
        >
          <Link
            href="/anmeldung"
            className="glow-orange inline-flex rounded-2xl bg-koder-orange px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-koder-orange-bright"
          >
            Zur Anmeldung
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

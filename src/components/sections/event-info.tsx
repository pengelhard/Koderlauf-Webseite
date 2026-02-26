"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Car,
  ShowerHead,
  Utensils,
  Ticket,
  Backpack,
  Flag,
} from "lucide-react";

const STARTZEITEN = [
  { name: "Kinderlauf", zeit: "14:00 Uhr", color: "#22C55E" },
  { name: "Kurz und knackig", zeit: "14:30 Uhr", color: "#FF9F1C" },
  { name: "Koderrunde", zeit: "14:45 Uhr", color: "#FF6B00" },
  { name: "Trailrun", zeit: "15:20 Uhr", color: "#EF4444" },
];

const INFOS = [
  { icon: MapPin, text: "Start/Ziel & Orga: Sportheim Obermögersheim" },
  { icon: Utensils, text: "Essen & Trinken vor Ort; Zielverpflegung direkt nach dem Zieleinlauf" },
  { icon: Car, text: "Parkmöglichkeiten vor Ort vorhanden" },
  { icon: ShowerHead, text: "Duschen im Sportheim möglich" },
  { icon: Flag, text: "Laufstrecke teilweise offroad (siehe Streckenbeschreibung)" },
  { icon: Ticket, text: "Startnummern- und Chipübergabe ab 13:00 Uhr" },
  { icon: Backpack, text: "Persönliche Gegenstände können in begrenzter Anzahl abgegeben werden" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function EventInfo() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            04. April 2026
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Willkommen zum Koderlauf 2026!
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Gemeinsam laufen, lachen, anfeuern – ob Kurz und knackig, Koderrunde,
            Trailrun oder der Kinderlauf: Bei uns zählt die Freude am Bewegen und
            das Miteinander im Dorf. Schnür die Schuhe, hol dir deine Startnummer
            und genieß die Stimmung am Sportheim und an der Strecke – jeder ist
            willkommen, vom Einsteiger bis zur Tempo-Fee. Wir kümmern uns um
            Verpflegung und das drumherum, du bringst die gute Laune mit.
          </p>
          <p className="mt-4 text-xl font-semibold">
            Let&apos;s go – wir freuen uns auf dich! 🏃‍♀️🏃‍♂️✨
          </p>
        </motion.div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          {/* Startzeiten */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-koder-orange">
              <Clock size={16} />
              Startzeiten
            </h3>
            <div className="mt-6 space-y-3">
              {STARTZEITEN.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 transition-all hover:border-koder-orange/30"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="font-semibold">{s.name}</span>
                  </div>
                  <span className="text-lg font-extrabold tabular-nums text-koder-orange">
                    {s.zeit}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/strecken"
                className="text-sm font-medium text-koder-orange underline underline-offset-4 hover:text-koder-orange-bright"
              >
                Alle Strecken mit Karte ansehen →
              </Link>
            </div>
          </motion.div>

          {/* Ort & Ablauf */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-koder-orange">
              <MapPin size={16} />
              Ort & Ablauf
            </h3>
            <div className="mt-6 space-y-3">
              {INFOS.map((info, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card px-5 py-3"
                >
                  <info.icon
                    size={18}
                    className="mt-0.5 shrink-0 text-forest-light"
                  />
                  <span className="text-sm">{info.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            href="/anmeldung"
            className="glow-orange inline-flex rounded-2xl bg-koder-orange px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-koder-orange-bright"
          >
            Jetzt anmelden
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

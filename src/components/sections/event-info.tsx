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
} from "lucide-react";

const INFOS = [
  { icon: MapPin, text: "Start/Ziel & Orga: Sportheim Obermögersheim" },
  { icon: Utensils, text: "Essen & Trinken vor Ort; Zielverpflegung direkt nach Zieleinlauf" },
  { icon: Car, text: "Parkmöglichkeiten vor Ort vorhanden" },
  { icon: ShowerHead, text: "Duschen im Sportheim möglich" },
  { icon: Flag, text: "Laufstrecke teilweise offroad (siehe Streckenbeschreibung)" },
  { icon: Ticket, text: "Startnummern- und Chipübergabe ab 13:00 Uhr" },
  { icon: Backpack, text: "Persönliche Gegenstände können in begrenzter Anzahl abgegeben werden" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export function EventInfo() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Willkommen zum Koderlauf 2026!
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Gemeinsam laufen, lachen, anfeuern – ob Kurz und knackig, Koderrunde,
            Trailrun oder der Kinderlauf: Bei uns zählt die Freude am Bewegen und
            das Miteinander im Dorf. Schnür die Schuhe, hol dir deine Startnummer
            und genieß die Stimmung am Sportheim und an der Strecke – jeder ist
            willkommen, vom Einsteiger bis zur Tempo-Fee.
          </p>
          <p className="mx-auto mt-3 text-base font-semibold text-koder-orange sm:text-lg">
            Jeder Finisher erhält eine einzigartige Koderlauf-Medaille! 🏅
          </p>
          <p className="mt-3 text-lg font-semibold sm:text-xl">
            Let&apos;s go – wir freuen uns auf dich! 🏃‍♀️🏃‍♂️✨
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto mt-10 grid max-w-2xl gap-2"
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 text-center"
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Music,
  Cross,
  PartyPopper,
  Route,
  Trophy,
  Ticket,
  ArrowRight,
} from "lucide-react";
import { EVENT } from "@/lib/event-config";
import { fadeReveal, useStaticReveal, variantsReveal } from "@/hooks/use-static-reveal";

const SAMSTAG_PROGRAMM = [
  { zeit: "12:00", text: "Startnummernausgabe am Eventtag", icon: Ticket },
  { zeit: EVENT.zeitplan.find((z) => z.streckeId === "spielerei")?.zeit ?? "15:00", text: "Koderlauf – Start der Strecken (Spielerei zuerst)", icon: Route },
  { zeit: EVENT.zeitplan.find((z) => z.titel.includes("Siegerehrung"))?.zeit ?? "18:30", text: "Siegerehrung am Sportheim", icon: Trophy },
  { zeit: "21:30", text: "Live: Tape Jam – Tribute to 80's Rock", icon: Music },
];

const RAHMENPROGRAMM = [
  {
    tag: "Freitag",
    datum: "28. Mai 2027",
    akzent: "Auftakt",
    icon: PartyPopper,
    punkte: [
      "ab 17 Uhr Elf- & Neunmeterturnier für Kinder",
      "ab 19 Uhr Kinder- und Jugenddisco mit Siegerehrung",
      "Übergang zur Plattenparty",
      "Barbetrieb ab 23 Uhr",
    ],
  },
  {
    tag: "Sonntag",
    datum: "30. Mai 2027",
    akzent: "Festsonntag",
    icon: Cross,
    punkte: [
      "9 Uhr Totenehrung",
      "10 Uhr Gottesdienst",
      "ab 11:30 Uhr Mittagstisch",
      "ab 13 Uhr Ehrungen, danach Kaffee und Kuchen",
    ],
  },
];

// Nur Opacity animieren: Scroll-Transforms verursachen auf Mobile Ghosting.
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.35 } } };

export function JubilaeumsProgramm() {
  const staticReveal = useStaticReveal();

  return (
    <section className="bg-gradient-to-br from-forest-deep via-forest-deep to-black py-16 text-white sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Kopf */}
        <motion.div
          {...fadeReveal(staticReveal, { duration: 0.6 })}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            {EVENT.jubilaeum}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Das Festwochenende – mit dem Koderlauf im Mittelpunkt
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
            Drei Tage feiert Obermögersheim 50 Jahre Sportverein. Das Herzstück:
            der Koderlauf am Samstag – eingerahmt von Auftakt am Freitag und
            Festsonntag.
          </p>
        </motion.div>

        {/* Samstag / Koderlauf – Highlight */}
        <motion.article
          {...fadeReveal(staticReveal, { duration: 0.6 })}
          className="mt-12 overflow-hidden rounded-3xl border border-koder-orange/45 bg-gradient-to-br from-koder-orange/15 via-white/[0.04] to-white/[0.02] shadow-2xl shadow-koder-orange/10"
        >
          <div className="grid lg:grid-cols-[1.15fr_1fr]">
            {/* Linke Spalte: Koderlauf */}
            <div className="p-6 sm:p-10">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-koder-orange">
                <CalendarDays size={14} />
                Samstag · {EVENT.datumFormatiert}
              </p>
              <h3 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Koderlauf {EVENT.jahr}
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                Der große Tag: Strecken vom Kinderlauf bis zur neuen
                „Spielerei“, inklusive Koderrunde als Lauf und Walking – Start
                und Ziel direkt am Sportheim, und abends wird gefeiert.
              </p>

              <ol className="mt-8 space-y-4">
                {SAMSTAG_PROGRAMM.map((punkt) => {
                  const Icon = punkt.icon;
                  return (
                    <li key={punkt.zeit} className="flex items-center gap-4">
                      <span className="w-12 shrink-0 text-right text-sm font-extrabold tabular-nums text-koder-orange">
                        {punkt.zeit}
                      </span>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-koder-orange/15 text-koder-orange">
                        <Icon size={16} />
                      </span>
                      <span className="text-sm font-medium text-white/85 sm:text-base">
                        {punkt.text}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/strecken"
                  className="glow-orange inline-flex items-center gap-2 rounded-2xl bg-koder-orange px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-koder-orange-bright"
                >
                  Strecken entdecken <ArrowRight size={16} />
                </Link>
                <Link
                  href="/anmeldung"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/25 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:border-koder-orange hover:text-koder-orange"
                >
                  Zur Anmeldung
                </Link>
              </div>
            </div>

            {/* Rechte Spalte: Tape Jam – Mobile Hochformat, damit die Band vollständig sichtbar ist */}
            <div className="relative aspect-[3/4] w-full border-t border-koder-orange/25 lg:aspect-auto lg:min-h-full lg:border-l lg:border-t-0">
              <Image
                src="/tape-jam.webp"
                alt="Tape Jam – Tribute to 80's Rock live auf der Bühne"
                fill
                className="object-contain object-center lg:object-cover lg:object-top"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-koder-orange">
                  Abendprogramm · ab 21:30 Uhr
                </p>
                <p className="mt-1 text-lg font-extrabold sm:text-xl">
                  Tape Jam – Tribute to 80&apos;s Rock
                </p>
                <p className="mt-2 text-xs leading-relaxed text-white/80 sm:text-sm">
                  Als Teilnehmer: günstigere Abendkarte bei der Anmeldung mitbestellen.
                </p>
              </div>
            </div>
          </div>
        </motion.article>

        {/* Freitag & Sonntag – Rahmenprogramm */}
        <motion.div
          {...variantsReveal(staticReveal, container)}
          className="mt-6 grid gap-4 sm:grid-cols-2"
        >
          {RAHMENPROGRAMM.map((tag) => {
            const Icon = tag.icon;
            return (
              <motion.article
                key={tag.tag}
                variants={item}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-koder-orange">
                      {tag.akzent}
                    </p>
                    <h3 className="mt-2 text-2xl font-extrabold">{tag.tag}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-white/55">
                      <CalendarDays size={14} />
                      {tag.datum}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-koder-orange">
                    <Icon size={22} />
                  </div>
                </div>

                <ul className="mt-6 space-y-3 text-sm leading-relaxed text-white/75">
                  {tag.punkte.map((punkt) => (
                    <li key={punkt} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-koder-orange" />
                      <span>{punkt}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}

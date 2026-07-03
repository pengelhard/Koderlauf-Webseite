"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { EVENT } from "@/lib/event-config";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    frage: "Wann und wo findet der Koderlauf statt?",
    antwort: `Am ${EVENT.datumKurz} rund um das Sportheim Obermögersheim. Der erste Start (Kinderlauf) ist um ${EVENT.strecken[0].startzeit} Uhr, die Startnummern- und Chipausgabe beginnt bereits um 13:00 Uhr.`,
  },
  {
    frage: "Kann ich mich vor Ort nachmelden?",
    antwort:
      "Ja! Nachmeldungen sind am Eventtag direkt vor Ort möglich – es gilt dann der Nachmeldepreis. Wer sicher einen Startplatz und den günstigeren Preis möchte, meldet sich am besten vorab an.",
  },
  {
    frage: "Gibt es Parkplätze?",
    antwort:
      "Ja, Parkmöglichkeiten sind direkt vor Ort am Sportheim vorhanden. Bitte folgt am Eventtag der Beschilderung und den Einweisern.",
  },
  {
    frage: "Gibt es Duschen und Umkleiden?",
    antwort:
      "Ja, im Sportheim Obermögersheim stehen Duschen zur Verfügung. Persönliche Gegenstände können in begrenzter Anzahl abgegeben werden.",
  },
  {
    frage: "Gibt es Verpflegung?",
    antwort:
      "Essen und Trinken gibt es den ganzen Tag vor Ort am Sportheim. Direkt nach dem Zieleinlauf wartet zudem eine Zielverpflegung auf alle Läuferinnen und Läufer.",
  },
  {
    frage: "Bekommt jeder eine Medaille?",
    antwort:
      "Ja! Jeder Finisher erhält eine einzigartige Koderlauf-Medaille – egal auf welcher Strecke. 🏅",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            Gut zu wissen
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Häufige Fragen
          </h2>
        </motion.div>

        <div className="mt-10 space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={faq.frage}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-semibold">{faq.frage}</span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "shrink-0 text-koder-orange transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                        {faq.antwort}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Deine Frage ist nicht dabei? Schreib uns über das{" "}
          <Link href="/feedback" className="text-koder-orange hover:underline">
            Kontaktformular
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

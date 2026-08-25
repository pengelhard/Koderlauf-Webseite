"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { EVENT, getErsterStart } from "@/lib/event-config";
import { formatAltersklassenKurz } from "@/lib/data/altersklassen";
import { VEREINS_WERTUNG } from "@/lib/anmeldungen/vereine";
import { cn } from "@/lib/utils";
import { fadeReveal, useStaticReveal } from "@/hooks/use-static-reveal";

const ersterStart = getErsterStart();
const spaet = EVENT.preise.phasen.find((p) => p.id === "spaet");
const vorOrt = EVENT.preise.phasen.find((p) => p.id === "vor_ort");

const FAQS = [
  {
    frage: "Wann und wo findet der Koderlauf statt?",
    antwort: `Am ${EVENT.datumKurz} rund um das ${EVENT.ortDetail}. Der erste Start (${ersterStart.name}) ist um ${ersterStart.startzeit} Uhr. Startnummern gibt es am Eventtag ab 12:00 Uhr – und schon Do/Fr von 17–20 Uhr (empfohlen).`,
  },
  {
    frage: "Was ist in der Startgebühr enthalten?",
    antwort: `In der Startgebühr sind enthalten: ${EVENT.startgebuehrEnthaelt.join(", ")}.`,
  },
  {
    frage: "Wann kann ich Startnummer und T-Shirt abholen?",
    antwort: `Am besten schon am ${EVENT.startnummernAusgabe.termine.map((t) => `${t.tag} (${t.datum}, ${t.zeit})`).join(" oder ")} am Sportplatz. Weniger Stress am Eventtag – besonders, wenn ihr keine weite Anreise habt. Am Samstag zusätzlich ${EVENT.startnummernAusgabe.eventtag}. Bestellte T-Shirts werden dort mit ausgegeben.`,
  },
  {
    frage: "Was ist der Unterschied zwischen Koderrunde Lauf und Walking?",
    antwort:
      "Gleiche Strecke (8,5 km) und gleicher Start um 16:30 Uhr – aber getrennte Wertung. Meldet euch entweder als Lauf oder als Walking an.",
  },
  {
    frage: "Welche Altersklassen gibt es?",
    antwort: `${formatAltersklassenKurz()} Die Zuordnung erfolgt über das Geburtsjahr bei der Anmeldung. Bei der Siegerehrung werden die drei schnellsten Männer und die drei schnellsten Frauen je Strecke geehrt. Eine separate Altersklassen-Ehrung gibt es nicht – die drei Schnellsten je Altersklasse bekommen aber eine Urkunde.`,
  },
  {
    frage: "Gibt es eine Vereinswertung?",
    antwort: `Ja. Bitte bei der Anmeldung den offiziellen Vereinsnamen angeben, damit die Zuordnung stimmt. Der Verein mit den meisten Teilnehmern gewinnt ${VEREINS_WERTUNG.preis}. ${VEREINS_WERTUNG.ausrichterCanonical} ist als Ausrichter nicht in der Wertung. Den aktuellen Stand findet ihr unter Teilnehmer.`,
  },
  {
    frage: "Für wen ist der Kinderlauf?",
    antwort:
      "Der Kinderlauf (800 m) ist für Kinder bis maximal 8 Jahre. Die Anmeldung erfolgt über die Erziehungsberechtigten.",
  },
  {
    frage: "Ab welchem Alter darf ich welche Strecke laufen?",
    antwort: `Das Mindestalter gilt fest – darunter kein Start und keine Ausnahme:

• Kinderlauf: bis max. 8 Jahre
• Kurz und knackig: ab 8 Jahren
• Koderrunde (Lauf & Walking): ab 12 Jahren
• Trailrun: ab 16 Jahren
• Spielerei: ab 18 Jahren

Zusätzlich brauchen alle unter 18 Jahren bei der Anmeldung das Einverständnis der Erziehungsberechtigten.`,
  },
  {
    frage: "Brauchen Minderjährige eine Einverständniserklärung der Eltern?",
    antwort:
      "Ja. Alle Teilnehmerinnen und Teilnehmer unter 18 Jahren brauchen bei der Anmeldung das Einverständnis der Erziehungsberechtigten (Checkbox sowie Name und Telefon der Eltern). Das Mindestalter der gewählten Strecke gilt trotzdem verbindlich.",
  },
  {
    frage: "Können geistig oder körperlich beeinträchtigte Personen früher starten?",
    antwort: `Ja. Auf Wunsch ca. 2–5 Minuten vor dem regulären Startschuss der jeweiligen Strecke. Bitte möglichst frühzeitig per E-Mail an ${EVENT.kontaktEmail} melden – so können wir alles ruhig vorbereiten. Eine kurze Meldung vor dem Lauf am Sportheim ist auch möglich.`,
  },
  {
    frage: "Kann ich mich vor Ort nachmelden?",
    antwort: `Ja. Online ist die Spätmeldung ${spaet?.hinweis ?? "bis kurz vor dem Event"} möglich. Am Eventtag sind Nachmeldungen vor Ort ${vorOrt?.hinweis ?? "möglich"} – dann gilt der Nachmeldepreis.`,
  },
  {
    frage: "Wie funktioniert Storno oder Startplatz-Übertrag?",
    antwort: `Online-Anmeldung und Zeitmessung laufen über ${EVENT.anmeldePartner.name}. Stornierungen, Umbuchungen und Startplatz-Überträge werden über deren Meldeportal bzw. Reklamationsformular abgewickelt – bitte die Teilnahmebedingungen bei der Anmeldung beachten. Link: ${EVENT.anmeldePartner.url}`,
  },
  {
    frage: "Muss ich die Straßenverkehrsordnung beachten?",
    antwort:
      "Ja. Die Strecken verlaufen teilweise auf öffentlichen Straßen und Wegen – die Teilnahme erfolgt daher auf eigene Gefahr. Es gilt durchgehend die StVO; Läuferinnen und Läufer haben kein Vorrecht im Straßenverkehr und müssen bei fließendem Verkehr warten. Streckenposten unterstützen euch, ersetzen aber nicht die eigene Vorsicht – besonders an Kreuzungen und der Bundesstraße. Das gilt für alle Läufe, bei der Spielerei ausdrücklich, weil dort öffentliche Straßen gekreuzt werden.",
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
      "Ja: Verpflegung während der Läufe und Verpflegung im Ziel. Essen und Trinken gibt es außerdem den ganzen Tag vor Ort am Sportheim.",
  },
  {
    frage: "Bekommt jeder eine Medaille?",
    antwort:
      "Ja! Jeder Finisher erhält eine exklusive KoderMedaille – egal auf welcher Strecke.",
  },
  {
    frage: "Kann ich ein T-Shirt oder eine Abendkarte mitbestellen?",
    antwort: `Ja, bei der Online-Anmeldung optional: ${EVENT.extras.tshirt.name} für ${EVENT.extras.tshirt.preis} € (Größen 116, 128, 140, 152, 164, S–XXL, 3XL, 4XL) sowie eine ${EVENT.extras.abendkarte.name} zum ${EVENT.extras.abendkarte.preisHinweis} für Tape Jam ab 21:30 Uhr.`,
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const staticReveal = useStaticReveal();

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeReveal(staticReveal, { duration: 0.6 })}
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
                {...fadeReveal(staticReveal, { duration: 0.3, delay: i * 0.03 })}
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

"use client";

import { useState, type ReactNode } from "react";
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

function FaqLink({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className = "font-semibold text-koder-orange hover:underline";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

type FaqItem = { frage: string; antwort: ReactNode };

const FAQS: FaqItem[] = [
  {
    frage: "Wann und wo findet der Koderlauf statt?",
    antwort: (
      <>
        Am {EVENT.datumKurz} rund um das {EVENT.ortDetail}. Der erste Start ({ersterStart.name}) ist
        um {ersterStart.startzeit} Uhr. Details zu den Läufen:{" "}
        <FaqLink href="/strecken">Strecken</FaqLink>. Startnummern Do/Fr 17–20 Uhr (empfohlen) und am
        Eventtag ab 12:00 Uhr.
      </>
    ),
  },
  {
    frage: "Was ist in der Startgebühr enthalten?",
    antwort: <>In der Startgebühr sind enthalten: {EVENT.startgebuehrEnthaelt.join(", ")}.</>,
  },
  {
    frage: "Wann kann ich Startnummer und T-Shirt abholen?",
    antwort: (
      <>
        Am besten schon am{" "}
        {EVENT.startnummernAusgabe.termine
          .map((t) => `${t.tag} (${t.datum}, ${t.zeit})`)
          .join(" oder ")}{" "}
        am Sportplatz – weniger Stress am Eventtag. Am Samstag zusätzlich{" "}
        {EVENT.startnummernAusgabe.eventtag}. Bestellte T-Shirts werden dort mit ausgegeben. Zur{" "}
        <FaqLink href="/anmeldung">Anmeldung</FaqLink>.
      </>
    ),
  },
  {
    frage: "Was ist der Unterschied zwischen Koderrunde Lauf und Walking?",
    antwort: (
      <>
        Gleiche Strecke ({EVENT.strecken.find((s) => s.id === "koderrunde")?.distanz ?? "8,5 km"}) und
        gleicher Start um{" "}
        {EVENT.strecken.find((s) => s.id === "koderrunde")?.startzeit ?? "16:30"} Uhr – aber getrennte
        Wertung. Meldet euch entweder als Lauf oder als Walking an. Übersicht:{" "}
        <FaqLink href="/strecken">Strecken</FaqLink>.
      </>
    ),
  },
  {
    frage: "Welche Altersklassen und Ehrungen gibt es?",
    antwort: (
      <>
        {formatAltersklassenKurz()} Die Zuordnung erfolgt über das Geburtsjahr bei der Anmeldung. Bei
        der Siegerehrung werden die drei schnellsten Männer und die drei schnellsten Frauen je Strecke
        geehrt. Eine separate Altersklassen-Ehrung gibt es nicht – die drei Schnellsten je
        Altersklasse bekommen aber eine Urkunde. Details:{" "}
        <FaqLink href="/ergebnisse">Ergebnisse &amp; Ehrungen</FaqLink>. Zusätzlich gibt es eine{" "}
        <FaqLink href="/teilnehmer">Vereinswertung</FaqLink>.
      </>
    ),
  },
  {
    frage: "Gibt es eine Vereinswertung?",
    antwort: (
      <>
        Ja. <strong className="text-foreground">{VEREINS_WERTUNG.kurz}</strong> Bitte bei der{" "}
        <FaqLink href="/anmeldung">Anmeldung</FaqLink> den offiziellen Vereinsnamen angeben, damit die
        Zuordnung stimmt. {VEREINS_WERTUNG.ausrichterCanonical} ist als Ausrichter nicht in der
        Wertung. Aktueller Stand: <FaqLink href="/teilnehmer">Teilnehmer</FaqLink>.
      </>
    ),
  },
  {
    frage: "Ab welchem Alter darf ich welche Strecke laufen?",
    antwort: (
      <>
        <p>Das Mindestalter gilt fest – darunter kein Start und keine Ausnahme:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Kinderlauf: bis max. 8 Jahre</li>
          <li>Kurz und knackig: ab 8 Jahren</li>
          <li>Koderrunde (Lauf &amp; Walking): ab 12 Jahren</li>
          <li>Trailrun: ab 16 Jahren</li>
          <li>Spielerei: ab 18 Jahren</li>
        </ul>
        <p className="mt-2">
          Unter 18 Jahren braucht ihr bei der <FaqLink href="/anmeldung">Anmeldung</FaqLink> das
          Einverständnis der Erziehungsberechtigten (Checkbox sowie Name und Telefon der Eltern).
          Streckenübersicht: <FaqLink href="/strecken">Strecken</FaqLink>.
        </p>
      </>
    ),
  },
  {
    frage: "Können geistig oder körperlich beeinträchtigte Personen früher starten?",
    antwort: (
      <>
        Ja. Auf Wunsch ca. 2–5 Minuten vor dem regulären Startschuss der jeweiligen Strecke. Bitte
        möglichst frühzeitig per E-Mail an{" "}
        <FaqLink href={`mailto:${EVENT.kontaktEmail}`} external>
          {EVENT.kontaktEmail}
        </FaqLink>{" "}
        melden – oder kurz vor dem Lauf am Sportheim. Übersicht der Startzeiten:{" "}
        <FaqLink href="/strecken">Strecken</FaqLink>.
      </>
    ),
  },
  {
    frage: "Kann ich mich vor Ort nachmelden?",
    antwort: (
      <>
        Ja. Online ist die Spätmeldung {spaet?.hinweis ?? "bis kurz vor dem Event"} möglich (
        <FaqLink href="/anmeldung">Anmeldung</FaqLink>). Am Eventtag sind Nachmeldungen vor Ort{" "}
        {vorOrt?.hinweis ?? "möglich"} – dann gilt der Nachmeldepreis.
      </>
    ),
  },
  {
    frage: "Wie funktioniert Storno oder Startplatz-Übertrag?",
    antwort: (
      <>
        Online-Anmeldung und Zeitmessung laufen über {EVENT.anmeldePartner.name}. Stornierungen,
        Umbuchungen und Startplatz-Überträge werden über deren Meldeportal bzw. Reklamationsformular
        abgewickelt – bitte die Teilnahmebedingungen bei der{" "}
        <FaqLink href="/anmeldung">Anmeldung</FaqLink> beachten. Partner:{" "}
        <FaqLink href={EVENT.anmeldePartner.url} external>
          {EVENT.anmeldePartner.url.replace(/^https?:\/\//, "")}
        </FaqLink>
        .
      </>
    ),
  },
  {
    frage: "Muss ich die Straßenverkehrsordnung beachten?",
    antwort: (
      <>
        Ja. Die Strecken verlaufen teilweise auf öffentlichen Straßen und Wegen – die Teilnahme
        erfolgt auf eigene Gefahr. Es gilt die StVO; Läuferinnen und Läufer haben kein Vorrecht im
        Straßenverkehr. Streckenposten unterstützen euch, ersetzen aber nicht die eigene Vorsicht –
        besonders an Kreuzungen und der Bundesstraße. Das gilt für alle Läufe, bei der Spielerei
        ausdrücklich. Details zu den Routen: <FaqLink href="/strecken">Strecken</FaqLink>.
      </>
    ),
  },
  {
    frage: "Gibt es Parkplätze, Duschen und Verpflegung?",
    antwort: (
      <>
        Ja: Parkplätze am Sportheim, Duschen im Sportheim, Verpflegung während der Läufe und im Ziel
        sowie Essen und Trinken den ganzen Tag vor Ort. Mehr zum Ablauf auf der{" "}
        <FaqLink href="/">Startseite</FaqLink>.
      </>
    ),
  },
  {
    frage: "Bekommt jeder eine Medaille?",
    antwort:
      "Ja. Jeder Finisher erhält eine exklusive KoderMedaille – egal auf welcher Strecke.",
  },
  {
    frage: "Kann ich ein T-Shirt oder eine Abendkarte mitbestellen?",
    antwort: (
      <>
        Ja, bei der <FaqLink href="/anmeldung">Online-Anmeldung</FaqLink> optional:{" "}
        {EVENT.extras.tshirt.name} für {EVENT.extras.tshirt.preis} € (Größen 116–164, S–XXL, 3XL,
        4XL) sowie eine {EVENT.extras.abendkarte.name} zum {EVENT.extras.abendkarte.preisHinweis} für
        Tape Jam ab 21:30 Uhr.
      </>
    ),
  },
  {
    frage: "Wo finde ich Ergebnisse und Fotos?",
    antwort: (
      <>
        Ergebnisse und Ehrungsregeln: <FaqLink href="/ergebnisse">Ergebnisse</FaqLink>. Impressionen:{" "}
        <FaqLink href="/galerie">Galerie</FaqLink>. Live-Teilnehmerstand:{" "}
        <FaqLink href="/teilnehmer">Teilnehmer</FaqLink>.
      </>
    ),
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const staticReveal = useStaticReveal();

  return (
    <section id="faq" className="py-16 sm:py-24">
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
                      isOpen && "rotate-180",
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
                      <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                        {faq.antwort}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Deine Frage ist nicht dabei? Schreib uns über das{" "}
          <FaqLink href="/feedback">Kontaktformular</FaqLink>.
        </p>
      </div>
    </section>
  );
}

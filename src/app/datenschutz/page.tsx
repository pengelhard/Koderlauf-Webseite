import type { Metadata } from "next";
import { EVENT } from "@/lib/event-config";

export const metadata: Metadata = { title: "Datenschutzerklärung" };

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            Koderlauf
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
            Datenschutzerklärung
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Stand: August 2026</p>
        </div>

        <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-4 [&_h3]:font-semibold [&_h3]:text-foreground [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          <section>
            <h2>1. Verantwortlicher</h2>
            <p>
              Sportverein Obermögersheim e.V.
              <br />
              Obermögersheim 211
              <br />
              91717 Wassertrüdingen
              <br />
              E-Mail: {EVENT.kontaktEmail}
            </p>
            <p>
              Verantwortlicher für die Website: Peter Engelhard, Obermögersheim 13, 91717
              Wassertrüdingen
            </p>
          </section>

          <section>
            <h2>2. Hosting</h2>
            <p>
              Diese Website wird bei Vercel Inc. (USA) gehostet. Beim Besuch werden technisch
              notwendige Informationen (z. B. IP-Adresse, Browsertyp, Zeitpunkt des Zugriffs) in
              Server-Logfiles verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse an sicherem und stabilem Betrieb der Website).
            </p>
          </section>

          <section>
            <h2>3. Online-Anmeldung (RaceSolution / Race Result)</h2>
            <p>
              Die Online-Anmeldung und Zahlung zum Koderlauf {EVENT.jahr} erfolgen über unseren
              Partner {EVENT.anmeldePartner.name} (
              <a href={EVENT.anmeldePartner.url} className="underline hover:text-foreground">
                {EVENT.anmeldePartner.url.replace(/^https?:\/\//, "")}
              </a>
              ). Dabei werden die für Anmeldung, Zahlung und Zeitmessung erforderlichen
              personenbezogenen Daten (u. a. Name, Kontaktdaten, Geburtsdatum, gewählte Strecke)
              an {EVENT.anmeldePartner.name} bzw. das von ihnen genutzte System Race Result
              übermittelt und dort verarbeitet. Es gelten zusätzlich deren Datenschutz- und
              Teilnahmebedingungen, die im Anmeldeportal einsehbar sind. Rechtsgrundlage: Art. 6
              Abs. 1 lit. b DSGVO (Vertragserfüllung).
            </p>
            <p>
              Die Anmeldung 2026 erfolgte noch über Google Forms; für Archivzwecke können
              entsprechende Daten weiterhin bei Google gespeichert sein.
            </p>
          </section>

          <section>
            <h2>4. Website-Datenbank (Supabase)</h2>
            <p>
              Für Website-Funktionen (z. B. Ergebnislisten, Galerie, interne Verwaltung) können
              wir Supabase (Supabase Inc.) nutzen. Dort können u. a. Name, Startnummer,
              Strecke und Ergebniszeiten gespeichert werden – soweit für die Darstellung der
              Website erforderlich. Rechtsgrundlage: Art. 6 Abs. 1 lit. b bzw. f DSGVO.
            </p>
          </section>

          <section>
            <h2>5. Teilnehmerliste und Anmeldestatistik</h2>
            <p>
              Auf der Website können eine öffentliche Teilnehmerliste und aggregierte
              Anmeldestatistiken angezeigt werden (z. B. Vorname, Nachname, Geschlecht, Strecke,
              ggf. Verein). Persönliche Kontaktdaten wie E-Mail-Adresse, Anschrift oder Telefon
              werden nicht veröffentlicht. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse an transparenter Event-Information) bzw. Einwilligung im
              Rahmen der Anmeldung.
            </p>
          </section>

          <section>
            <h2>6. Kartendienste</h2>
            <p>
              Für die Streckenkarten verwenden wir MapLibre GL JS (Open Source) mit Kartenkacheln
              von Esri (Satellitenbild) und OpenStreetMap (Beschriftungen). Beim Laden der Karten
              werden Daten (IP-Adresse) an diese Dienste übermittelt. Rechtsgrundlage: Art. 6 Abs.
              1 lit. f DSGVO.
            </p>
          </section>

          <section>
            <h2>7. Fotos und Galerie</h2>
            <p>
              Im Rahmen der Veranstaltung werden Fotos und Videos erstellt. Diese können auf der
              Website und in sozialen Medien veröffentlicht werden. Durch die Teilnahme an der
              Veranstaltung erklären sich die Teilnehmer grundsätzlich mit der Veröffentlichung
              einverstanden. Ein Widerruf ist jederzeit möglich unter {EVENT.kontaktEmail}.
            </p>
          </section>

          <section>
            <h2>8. Cookies</h2>
            <p>
              Diese Website verwendet nur technisch notwendige Cookies (z. B. für die
              Darstellungs-Präferenz Dark/Light Mode). Es werden keine Tracking- oder
              Marketing-Cookies eingesetzt.
            </p>
          </section>

          <section>
            <h2>9. Ihre Rechte</h2>
            <p>Sie haben jederzeit das Recht auf:</p>
            <ul>
              <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            </ul>
            <p>
              Bitte wenden Sie sich dazu an {EVENT.kontaktEmail}. Sie haben außerdem das Recht,
              sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

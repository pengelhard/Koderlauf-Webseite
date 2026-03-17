import type { Metadata } from "next";

export const metadata: Metadata = { title: "Datenschutzerklärung" };

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Datenschutzerklärung</h1>
        <p className="mt-2 text-sm text-muted-foreground">Stand: Februar 2026</p>

        <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-4 [&_h3]:font-semibold [&_h3]:text-foreground [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          <section>
            <h2>1. Verantwortlicher</h2>
            <p>Sportverein Obermögersheim e.V.<br />Obermögersheim 211<br />91717 Wassertrüdingen<br />E-Mail: info@koderlauf.de</p>
            <p>Verantwortlich für die Website: Peter Engelhard, Obermögersheim 13, 91717 Wassertrüdingen</p>
          </section>

          <section>
            <h2>2. Hosting</h2>
            <p>Diese Website wird auf einem Server der Hetzner Online GmbH (Industriestr. 25, 91710 Gunzenhausen, Deutschland) gehostet. Beim Besuch der Website werden automatisch Informationen (z.B. IP-Adresse, Browsertyp, Zeitpunkt des Zugriffs) in Server-Logfiles gespeichert. Diese Daten sind nicht bestimmten Personen zuordenbar. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Die Daten werden in Deutschland verarbeitet.</p>
          </section>

          <section>
            <h2>3. Datenbank (Supabase)</h2>
            <p>Wir verwenden Supabase (Supabase Inc., USA) zur Speicherung von Anmeldedaten und Ergebnissen. Es gilt das EU-US Data Privacy Framework. Gespeichert werden:</p>
            <ul>
              <li>Vorname, Nachname, E-Mail-Adresse</li>
              <li>Geburtsdatum (optional, für Altersklasse)</li>
              <li>Vereinszugehörigkeit (optional)</li>
              <li>Gewählte Distanz</li>
              <li>Startnummer und Ergebniszeiten</li>
            </ul>
            <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>
          </section>

          <section>
            <h2>4. Anmeldung (Google Forms)</h2>
            <p>Die Anmeldung zum Koderlauf 2026 erfolgt über Google Forms (Google Ireland Limited). Dabei werden die eingegebenen Daten an Google übermittelt und dort gespeichert. Es gelten die{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-koder-orange hover:underline">Datenschutzbestimmungen von Google</a>.
            </p>
          </section>

          <section>
            <h2>5. Teilnehmerliste</h2>
            <p>Auf der Website wird eine öffentliche Teilnehmerliste angezeigt (Vorname, Nachname, Geschlecht, Altersklasse, Strecke). Diese Daten werden automatisch aus der Anmeldung übernommen. Persönliche Daten wie E-Mail-Adresse, Adresse oder Telefonnummer werden nicht veröffentlicht.</p>
          </section>

          <section>
            <h2>6. Kartendienste</h2>
            <p>Für die Streckenkarten verwenden wir MapLibre GL JS (Open Source) mit Kartenkacheln von Esri (Satellitenbild) und OpenStreetMap (Beschriftungen). Beim Laden der Karten werden Daten (IP-Adresse) an diese Dienste übermittelt. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>
          </section>

          <section>
            <h2>7. Fotos und Galerie</h2>
            <p>Im Rahmen der Veranstaltung werden Fotos und Videos erstellt. Diese können auf der Website und in sozialen Medien veröffentlicht werden. Durch die Teilnahme an der Veranstaltung erklären sich die Teilnehmer grundsätzlich mit der Veröffentlichung einverstanden. Ein Widerruf ist jederzeit möglich unter info@koderlauf.de.</p>
          </section>

          <section>
            <h2>8. Cookies</h2>
            <p>Diese Website verwendet nur technisch notwendige Cookies (z.B. für die Darstellungs-Präferenz Dark/Light Mode). Es werden keine Tracking- oder Marketing-Cookies eingesetzt.</p>
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
            <p>Bitte wenden Sie sich dazu an info@koderlauf.de. Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

import { getSportsEventJsonLd } from "@/lib/json-ld";

/**
 * Einmaliges SportsEvent-JSON-LD (schema.org) für Suchmaschinen.
 * Sitzt im Root-Layout, damit Startseite, /anmeldung und /strecken dieselbe
 * Entität teilen (@id) – keine widersprüchlichen Duplikate.
 */
export function SportsEventJsonLd() {
  const jsonLd = getSportsEventJsonLd();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

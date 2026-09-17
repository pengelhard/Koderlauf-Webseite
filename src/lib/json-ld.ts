/**
 * schema.org JSON-LD für den Koderlauf (SportsEvent).
 * Eine Quelle: EVENT. Canonical-URLs immer koderlauf.de (nicht Testdomain).
 */

import {
  EVENT,
  getAktuellePreisPhase,
  getErsterStart,
  isOnlineAnmeldungOffen,
} from "@/lib/event-config";
import { PROD_SITE_URL } from "@/lib/site-url";

const EVENT_ID = `${PROD_SITE_URL}/#event-${EVENT.jahr}`;
const ORGANIZER_ID = `${PROD_SITE_URL}/#organizer`;
const PLACE_ID = `${PROD_SITE_URL}/#venue`;
const ANMELDUNG_URL = `${PROD_SITE_URL}/anmeldung`;
const STRECKEN_URL = `${PROD_SITE_URL}/strecken`;

/** 29. Mai liegt in der mitteleuropäischen Sommerzeit (CEST, UTC+2). */
const BERLIN_OFFSET = "+02:00";

export function toBerlinIso(timeHHmm: string): string {
  const date = EVENT.datum.slice(0, 10);
  return `${date}T${timeHHmm}:00${BERLIN_OFFSET}`;
}

function streckenBeschreibung(): string {
  return EVENT.strecken
    .map((s) => `${s.name} ${s.distanz} (Start ${s.startzeit} Uhr)`)
    .join("; ");
}

export function getSportsEventJsonLd() {
  const phase = getAktuellePreisPhase();
  const ersterStart = getErsterStart();
  const fruehbucher = EVENT.preise.phasen.find((p) => p.id === "fruehbucher");

  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": EVENT_ID,
    name: `${EVENT.name} ${EVENT.jahr}`,
    alternateName: EVENT.alternateName,
    description: `${EVENT.name} (${EVENT.alternateName}) am ${EVENT.datumFormatiert} am ${EVENT.ortDetail}, ${EVENT.adresse.streetAddress}, ${EVENT.adresse.postalCode} ${EVENT.adresse.addressLocality}. Start ab ${ersterStart.startzeit} Uhr (gestaffelt). Strecken: ${streckenBeschreibung()}. Anmeldung: ${ANMELDUNG_URL}. Streckeninfos: ${STRECKEN_URL}.`,
    url: PROD_SITE_URL,
    sport: "Running",
    inLanguage: "de-DE",
    isAccessibleForFree: false,
    startDate: toBerlinIso(ersterStart.startzeit),
    doorTime: toBerlinIso("12:00"),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [`${PROD_SITE_URL}/opengraph-image`, `${PROD_SITE_URL}/mascot-koderlauf.png`],
    location: {
      "@type": "Place",
      "@id": PLACE_ID,
      name: EVENT.ortDetail,
      address: {
        "@type": "PostalAddress",
        streetAddress: EVENT.adresse.streetAddress,
        postalCode: EVENT.adresse.postalCode,
        addressLocality: EVENT.adresse.addressLocality,
        addressRegion: EVENT.adresse.addressRegion,
        addressCountry: EVENT.adresse.addressCountry,
      },
    },
    organizer: {
      "@type": "Organization",
      "@id": ORGANIZER_ID,
      name: EVENT.veranstalter,
      alternateName: EVENT.veranstalterAlias,
      url: PROD_SITE_URL,
      email: EVENT.kontaktEmail,
      sameAs: ["https://www.instagram.com/koderlauf"],
    },
    offers: {
      "@type": "AggregateOffer",
      url: ANMELDUNG_URL,
      priceCurrency: "EUR",
      lowPrice: fruehbucher?.kinderlauf ?? 5,
      highPrice: phase.andere,
      availability: isOnlineAnmeldungOffen()
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      category: phase.name,
    },
    subEvent: EVENT.strecken.map((s) => ({
      "@type": "SportsEvent",
      "@id": `${PROD_SITE_URL}/strecken#${s.id}`,
      name: s.name,
      description: `${s.name}: ${s.distanz}, Start ${s.startzeit} Uhr am ${EVENT.datumFormatiert}.`,
      startDate: toBerlinIso(s.startzeit),
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      url: STRECKEN_URL,
      location: { "@id": PLACE_ID },
      organizer: { "@id": ORGANIZER_ID },
      isPartOf: { "@id": EVENT_ID },
      offers: {
        "@type": "Offer",
        url: ANMELDUNG_URL,
        priceCurrency: "EUR",
        price: s.id === "kinderlauf" ? phase.kinderlauf : phase.andere,
        availability: isOnlineAnmeldungOffen()
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      },
    })),
  };
}

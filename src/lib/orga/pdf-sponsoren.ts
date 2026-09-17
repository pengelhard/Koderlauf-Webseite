import {
  formatSponsorAdresse,
  formatSponsorLinks,
  formatSponsorSocial,
  getSponsorsForYear,
  pdfDash,
  type SponsorRecord,
  type SponsorYear,
  type SponsorsLoadResult,
} from "../data/sponsors";
import { footerNote, PdfWriter } from "./pdf-core";

export function sponsorenPdfFilename(year: SponsorYear): string {
  return `koderlauf-${year}-sponsoren.pdf`;
}

function drawSponsor(w: PdfWriter, s: SponsorRecord, index: number) {
  w.kvBlock(
    s.firma,
    [
      { label: "Adresse", value: pdfDash(formatSponsorAdresse(s)) },
      { label: "Ansprechpartner", value: pdfDash(s.ansprechpartner) },
      { label: "E-Mail", value: pdfDash(s.email) },
      { label: "Telefon", value: pdfDash(s.telefon) },
      { label: "Social Media", value: pdfDash(formatSponsorSocial(s)) },
      { label: "Website / Links", value: pdfDash(formatSponsorLinks(s)) },
    ],
    { index, badge: s.hauptsponsor ? "Hauptsponsor" : undefined },
  );
}

export async function renderSponsorenPdf(loaded: SponsorsLoadResult): Promise<Uint8Array> {
  const { year, sponsors, source } = loaded;
  const w = new PdfWriter({
    bodySize: 10.5,
    headerSize: 9.5,
    rowHeight: 18,
    lineHeight: 14,
  });
  await w.init(footerNote(year));
  w.runningHeader = `Koderlauf ${year} – Sponsoren (intern)`;

  w.title(`Koderlauf ${year} – Sponsoren`);
  const n = sponsors.length;
  const quelle = source === "database" ? "Datenbank" : "Website-Liste";
  w.subtitle(
    `Internes Orga-PDF · ${n} ${n === 1 ? "Eintrag" : "Einträge"} · Quelle: ${quelle}`,
  );
  w.paragraph(
    "Alle Kontaktdaten nur für die Orga. Felder, die noch nicht gepflegt sind, stehen als Gedankenstrich – sobald Adresse, Telefon oder Mail ergänzt werden, erscheinen sie hier. Die öffentliche Sponsoren-Seite zeigt weiterhin nur Name, Ort, Logo und Website.",
  );

  if (sponsors.length === 0) {
    w.heading(`Keine Sponsoren für ${year} hinterlegt`);
    w.paragraph(
      `Für den Koderlauf ${year} sind noch keine Sponsoren in der Liste. Sobald Einträge für ${year} in der Sponsoren-Datei (oder später in der Datenbank) stehen, erscheinen sie mit Firma, Adresse, Ansprechpartner, E-Mail, Telefon, Social Media und Website in diesem PDF.`,
    );
    return w.save();
  }

  const haupts = sponsors.filter((s) => s.hauptsponsor);
  const weitere = sponsors.filter((s) => !s.hauptsponsor);
  let index = 1;

  if (haupts.length > 0) {
    w.heading("Hauptsponsoren");
    for (const s of haupts) {
      drawSponsor(w, s, index);
      index += 1;
    }
  }

  w.heading(
    haupts.length > 0
      ? "Weitere Sponsoren & Unterstützer"
      : "Sponsoren & Unterstützer",
  );
  for (const s of weitere) {
    drawSponsor(w, s, index);
    index += 1;
  }

  return w.save();
}

export async function buildSponsorenPdf(year: SponsorYear): Promise<Uint8Array> {
  return renderSponsorenPdf(await getSponsorsForYear(year));
}

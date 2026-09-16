import { EVENT } from "@/lib/event-config";
import type { OrgaParticipant } from "@/lib/orga/types";

function csvCell(v: string): string {
  const s = v.replace(/"/g, '""');
  if (/[;"\n]/.test(s)) return `"${s}"`;
  return s;
}

/** Interne Kontaktliste: nur T-Shirt-Bestellungen, hinter Auth. */
export function tshirtKontaktCsv(participants: OrgaParticipant[]): string {
  const header = ["Startnr", "Nachname", "Vorname", "Mail", "TShirt", "Wettbewerb"];
  const lines = [header.join(";")];
  const rows = participants
    .filter((p) => p.tshirtSize && p.mail.includes("@"))
    .sort((a, b) => {
      const n = a.nachname.localeCompare(b.nachname, "de");
      if (n !== 0) return n;
      return a.vorname.localeCompare(b.vorname, "de");
    });
  for (const p of rows) {
    lines.push(
      [p.bib, p.nachname, p.vorname, p.mail, p.tshirtSize ?? "", p.wettbewerb]
        .map((c) => csvCell(c))
        .join(";"),
    );
  }
  return `\uFEFF${lines.join("\r\n")}\r\n`;
}

export function kontaktCsvFilename(): string {
  return `koderlauf-${EVENT.jahr}-tshirt-kontakt.csv`;
}

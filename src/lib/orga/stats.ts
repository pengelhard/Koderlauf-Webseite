import { TSHIRT_SIZES } from "@/lib/pricing";
import { bibLabel } from "./pdf-core";
import {
  groupStartunterlagen,
  listStreckenWithParticipants,
  streckeMeta,
  streckeSlug,
  summarizeStrecke,
} from "./startunterlagen";
import type {
  AbendkarteRecipient,
  OrgaAdminPayload,
  OrgaFields,
  OrgaParticipant,
  OrgaStats,
  ShirtRecipient,
  SizeCount,
  StartunterlagenStreckeSummary,
} from "./types";

const SIZE_RANK = new Map<string, number>(
  TSHIRT_SIZES.map((s, i) => [s, i]),
);

function sizeRank(size: string): number {
  if (size === "ohne Größe") return 1000;
  return SIZE_RANK.get(size) ?? 500;
}

function cmpName(
  a: { nachname: string; vorname: string; name: string },
  b: { nachname: string; vorname: string; name: string },
): number {
  const n = a.nachname.localeCompare(b.nachname, "de", { sensitivity: "base" });
  if (n !== 0) return n;
  const v = a.vorname.localeCompare(b.vorname, "de", { sensitivity: "base" });
  if (v !== 0) return v;
  return a.name.localeCompare(b.name, "de", { sensitivity: "base" });
}

export function emptyOrgaStats(error?: string): OrgaStats {
  return {
    fetchedAt: new Date().toISOString(),
    source: "empty",
    error,
    rowCount: 0,
    fields: {
      present: [],
      mail: false,
      tshirt: false,
      abendkarte: false,
      bib: false,
      payment: false,
    },
    hinweise: error ? [error] : [],
    participants: [],
    startunterlagen: [],
    tshirtTotal: 0,
    tshirtBySize: [],
    tshirtOhneGroesse: 0,
    tshirtRecipients: [],
    abendkartenTotal: 0,
    abendkartenPersonen: 0,
    abendkartenRecipients: [],
    mailCount: 0,
  };
}

function detectFields(present: string[], cols: {
  mail?: number;
  tshirt?: number;
  abendkarte?: number;
  bib?: number;
  payment?: number;
}): OrgaFields {
  return {
    present,
    mail: cols.mail != null,
    tshirt: cols.tshirt != null,
    abendkarte: cols.abendkarte != null,
    bib: cols.bib != null,
    payment: cols.payment != null,
  };
}

export function buildOrgaStats(
  participants: OrgaParticipant[],
  present: string[],
  cols: {
    mail?: number;
    tshirt?: number;
    abendkarte?: number;
    bib?: number;
    payment?: number;
  },
  fetchedAt = new Date().toISOString(),
): OrgaStats {
  const fields = detectFields(present, cols);
  const hinweise: string[] = [];

  if (!fields.tshirt) {
    hinweise.push(
      "Spalte T-Shirt fehlt in der Race-Result-Liste. In RR die Ausgabeliste „Adressliste“ um das Feld TShirt / Größe erweitern.",
    );
  }
  if (!fields.abendkarte) {
    hinweise.push(
      "Spalte Abendkarte / Tape Jam fehlt. In RR das Anmeldefeld in die Adressliste aufnehmen.",
    );
  }
  if (!fields.mail) {
    hinweise.push(
      "Keine Mail-Spalte in der Liste – Kontakt-CSV ist dann leer.",
    );
  }
  if (!fields.payment) {
    hinweise.push(
      "Kein Bezahlstatus in der Adressliste (Spalte z. B. Bezahlt/Status). Ausgabe-PDF zeigt ihn daher nicht.",
    );
  }
  if (!fields.bib) {
    hinweise.push(
      "Spalte Startnummer fehlt in der Adressliste. Sobald Race Result die Nummern vergibt, Contest.Bib / Startnummer in die Ausgabeliste aufnehmen – die PDFs zeigen sie dann automatisch.",
    );
  } else if (
    participants.length > 0 &&
    participants.every((p) => bibLabel(p.bib) === "–")
  ) {
    hinweise.push(
      "Startnummern sind in der Adressliste noch nicht gesetzt (Race Solution). Die Ausgabe-PDFs zeigen „–“ und füllen die Nummern automatisch, sobald sie in Race Result stehen.",
    );
  }

  const counts = new Map<string, number>();
  const tshirtRecipients: ShirtRecipient[] = [];
  for (const p of participants) {
    if (!p.tshirtSize) continue;
    counts.set(p.tshirtSize, (counts.get(p.tshirtSize) ?? 0) + 1);
    tshirtRecipients.push({
      bib: p.bib,
      name: p.name,
      nachname: p.nachname,
      vorname: p.vorname,
      size: p.tshirtSize,
      paymentStatus: p.paymentStatus,
    });
  }

  const tshirtBySize: SizeCount[] = [...counts.entries()]
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => {
      const r = sizeRank(a.size) - sizeRank(b.size);
      if (r !== 0) return r;
      return a.size.localeCompare(b.size, "de");
    });

  const abendkartenRecipients: AbendkarteRecipient[] = participants
    .filter((p) => p.abendkarten > 0)
    .map((p) => ({
      bib: p.bib,
      name: p.name,
      nachname: p.nachname,
      vorname: p.vorname,
      anzahl: p.abendkarten,
    }))
    .sort(cmpName);

  tshirtRecipients.sort(cmpName);

  const groups = groupStartunterlagen(participants);
  const startunterlagen: StartunterlagenStreckeSummary[] =
    listStreckenWithParticipants(groups).map((label) => {
      const rows = groups.get(label) ?? [];
      const meta = streckeMeta(label);
      const summary = summarizeStrecke(rows);
      return {
        label,
        slug: streckeSlug(label),
        teilnehmer: summary.teilnehmer,
        shirts: summary.shirts,
        karten: summary.karten,
        distanz: meta.distanz,
        startzeit: meta.startzeit,
      };
    });

  return {
    fetchedAt,
    source: "raceresult",
    rowCount: participants.length,
    fields,
    hinweise,
    participants,
    startunterlagen,
    tshirtTotal: tshirtRecipients.length,
    tshirtBySize,
    tshirtOhneGroesse: counts.get("ohne Größe") ?? 0,
    tshirtRecipients,
    abendkartenTotal: abendkartenRecipients.reduce((s, r) => s + r.anzahl, 0),
    abendkartenPersonen: abendkartenRecipients.length,
    abendkartenRecipients,
    mailCount: participants.filter((p) => p.mail.includes("@")).length,
  };
}

export function shirtsBySizeThenName(stats: OrgaStats): ShirtRecipient[] {
  return [...stats.tshirtRecipients].sort((a, b) => {
    const r = sizeRank(a.size) - sizeRank(b.size);
    if (r !== 0) return r;
    return cmpName(a, b);
  });
}

export function shirtsGroupedBySize(
  stats: OrgaStats,
): { size: string; count: number; rows: ShirtRecipient[] }[] {
  const groups: { size: string; count: number; rows: ShirtRecipient[] }[] = [];
  for (const r of shirtsBySizeThenName(stats)) {
    const last = groups[groups.length - 1];
    if (last && last.size === r.size) last.rows.push(r);
    else groups.push({ size: r.size, count: 0, rows: [r] });
  }
  for (const g of groups) g.count = g.rows.length;
  return groups;
}

export function toAdminPayload(stats: OrgaStats): OrgaAdminPayload {
  return {
    fetchedAt: stats.fetchedAt,
    source: stats.source,
    error: stats.error,
    rowCount: stats.rowCount,
    fields: stats.fields,
    hinweise: stats.hinweise,
    tshirt: {
      total: stats.tshirtTotal,
      bySize: stats.tshirtBySize,
      ohneGroesse: stats.tshirtOhneGroesse,
      recipients: stats.tshirtRecipients.map((r) => ({
        bib: r.bib,
        name: r.name,
        size: r.size,
        paymentStatus: r.paymentStatus,
      })),
    },
    abendkarten: {
      totalKarten: stats.abendkartenTotal,
      personen: stats.abendkartenPersonen,
      recipients: stats.abendkartenRecipients.map((r) => ({
        bib: r.bib,
        name: r.name,
        anzahl: r.anzahl,
      })),
    },
    startunterlagen: stats.startunterlagen,
    mailCount: stats.mailCount,
  };
}

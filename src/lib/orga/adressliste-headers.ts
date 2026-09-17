export type MappedCols = {
  bib?: number;
  name?: number;
  nachname?: number;
  vorname?: number;
  jahrgang?: number;
  geschlecht?: number;
  verein?: number;
  wettbewerb?: number;
  mail?: number;
  tshirt?: number;
  abendkarte?: number;
  payment?: number;
};

export function normHeader(h: string): string {
  return h
    .trim()
    .toLowerCase()
    .replace(/\u00a0/g, " ")
    .replace(/[.]/g, "")
    .replace(/\s+/g, " ");
}

const HEADER_ALIASES: Record<string, keyof MappedCols> = {
  startnr: "bib",
  startnummer: "bib",
  startnummern: "bib",
  startno: "bib",
  startnumber: "bib",
  "start nr": "bib",
  "start-nr": "bib",
  "start no": "bib",
  bib: "bib",
  bibno: "bib",
  bibnumber: "bib",
  "bib no": "bib",
  "bib number": "bib",
  contestbib: "bib",
  "contest bib": "bib",
  contestbibno: "bib",
  name: "name",
  anzeigename: "name",
  nachname: "nachname",
  lastname: "nachname",
  vorname: "vorname",
  firstname: "vorname",
  jg: "jahrgang",
  jahrgang: "jahrgang",
  yb: "jahrgang",
  "m/w": "geschlecht",
  geschlecht: "geschlecht",
  gender: "geschlecht",
  verein: "verein",
  club: "verein",
  wettbewerb: "wettbewerb",
  contest: "wettbewerb",
  strecke: "wettbewerb",
  mail: "mail",
  email: "mail",
  "e-mail": "mail",
  "e mail": "mail",
  tshirt: "tshirt",
  "t-shirt": "tshirt",
  "t shirt": "tshirt",
  shirt: "tshirt",
  groesse: "tshirt",
  größe: "tshirt",
  size: "tshirt",
  "abendkarte tape jam": "abendkarte",
  abendkarte: "abendkarte",
  "tape jam": "abendkarte",
  tapejam: "abendkarte",
  abendkarten: "abendkarte",
  bezahlt: "payment",
  status: "payment",
  paid: "payment",
  payment: "payment",
  zahlstatus: "payment",
};

export function mapHeaders(headers: string[]): { cols: MappedCols; present: string[] } {
  const cols: MappedCols = {};
  const present: string[] = [];
  headers.forEach((h, i) => {
    const raw = h.trim();
    if (!raw) return;
    present.push(raw);
    const key = HEADER_ALIASES[normHeader(raw)];
    if (key && cols[key] == null) cols[key] = i;
  });
  return { cols, present };
}

/**
 * Demo-Ergebnisse für alle vier Strecken (Vorschau bis zur echten Datenbank).
 * `ak` = Altersklasse 1–6 (nur Hauptläufe); bei Kinderlauf null.
 */
export type DemoErgebnisRow = {
  rank: number;
  bib: number;
  first_name: string;
  last_name: string;
  gender: "M" | "W";
  distance: string;
  finish_time: string;
  ak: number | null;
};

export const DEMO_ERGEBNISSE: DemoErgebnisRow[] = [
  // —— Kinderlauf ——
  { rank: 1, bib: 301, first_name: "Emma", last_name: "Sonnenschein", gender: "W", distance: "Kinderlauf", finish_time: "00:02:58", ak: null },
  { rank: 2, bib: 315, first_name: "Lena", last_name: "Moosbach", gender: "W", distance: "Kinderlauf", finish_time: "00:03:05", ak: null },
  { rank: 3, bib: 308, first_name: "Mia", last_name: "Tannenbaum", gender: "W", distance: "Kinderlauf", finish_time: "00:03:12", ak: null },
  { rank: 4, bib: 322, first_name: "Sophie", last_name: "Waldweg", gender: "W", distance: "Kinderlauf", finish_time: "00:03:28", ak: null },
  { rank: 1, bib: 302, first_name: "Tim", last_name: "Lichtenberg", gender: "M", distance: "Kinderlauf", finish_time: "00:02:55", ak: null },
  { rank: 2, bib: 317, first_name: "Lukas", last_name: "Grünfeld", gender: "M", distance: "Kinderlauf", finish_time: "00:03:01", ak: null },
  { rank: 3, bib: 309, first_name: "Felix", last_name: "Birkner", gender: "M", distance: "Kinderlauf", finish_time: "00:03:09", ak: null },
  { rank: 4, bib: 324, first_name: "Noah", last_name: "Eichenweg", gender: "M", distance: "Kinderlauf", finish_time: "00:03:21", ak: null },

  // —— Kurz und knackig ——
  { rank: 1, bib: 12, first_name: "Jonas", last_name: "Steinweg", gender: "M", distance: "Kurz und knackig", finish_time: "00:14:22", ak: 3 },
  { rank: 2, bib: 28, first_name: "Anna", last_name: "Bergmann", gender: "W", distance: "Kurz und knackig", finish_time: "00:15:01", ak: 3 },
  { rank: 3, bib: 41, first_name: "Tom", last_name: "Eichner", gender: "M", distance: "Kurz und knackig", finish_time: "00:15:18", ak: 4 },
  { rank: 4, bib: 55, first_name: "Laura", last_name: "Waldstein", gender: "W", distance: "Kurz und knackig", finish_time: "00:15:44", ak: 3 },
  { rank: 5, bib: 63, first_name: "Paul", last_name: "Fichtel", gender: "M", distance: "Kurz und knackig", finish_time: "00:16:02", ak: 2 },
  { rank: 6, bib: 71, first_name: "Marie", last_name: "Grünwald", gender: "W", distance: "Kurz und knackig", finish_time: "00:16:21", ak: 4 },
  { rank: 7, bib: 84, first_name: "Simon", last_name: "Kiefer", gender: "M", distance: "Kurz und knackig", finish_time: "00:16:45", ak: 5 },
  { rank: 8, bib: 92, first_name: "Nina", last_name: "Buchenweg", gender: "W", distance: "Kurz und knackig", finish_time: "00:17:03", ak: 2 },
  { rank: 9, bib: 105, first_name: "David", last_name: "Ahorn", gender: "M", distance: "Kurz und knackig", finish_time: "00:17:28", ak: 4 },
  { rank: 10, bib: 118, first_name: "Julia", last_name: "Tanne", gender: "W", distance: "Kurz und knackig", finish_time: "00:17:55", ak: 5 },
  { rank: 11, bib: 126, first_name: "Klaus", last_name: "Rotbuche", gender: "M", distance: "Kurz und knackig", finish_time: "00:18:12", ak: 6 },
  { rank: 12, bib: 134, first_name: "Elena", last_name: "Waldläufer", gender: "W", distance: "Kurz und knackig", finish_time: "00:18:40", ak: 1 },

  // —— Koderrunde ——
  { rank: 1, bib: 201, first_name: "Max", last_name: "Waldläufer", gender: "M", distance: "Koderrunde", finish_time: "00:38:34", ak: 3 },
  { rank: 2, bib: 215, first_name: "Leon", last_name: "Förster", gender: "M", distance: "Koderrunde", finish_time: "00:39:02", ak: 3 },
  { rank: 3, bib: 208, first_name: "Sophie", last_name: "Grünwald", gender: "W", distance: "Koderrunde", finish_time: "00:40:45", ak: 3 },
  { rank: 4, bib: 222, first_name: "Tom", last_name: "Eichner", gender: "M", distance: "Koderrunde", finish_time: "00:41:11", ak: 4 },
  { rank: 5, bib: 236, first_name: "Anna", last_name: "Bergmann", gender: "W", distance: "Koderrunde", finish_time: "00:41:58", ak: 4 },
  { rank: 6, bib: 241, first_name: "Niklas", last_name: "Steinweg", gender: "M", distance: "Koderrunde", finish_time: "00:42:33", ak: 2 },
  { rank: 7, bib: 255, first_name: "Mia", last_name: "Tannenbaum", gender: "W", distance: "Koderrunde", finish_time: "00:43:10", ak: 2 },
  { rank: 8, bib: 268, first_name: "Felix", last_name: "Birkner", gender: "M", distance: "Koderrunde", finish_time: "00:43:44", ak: 4 },
  { rank: 9, bib: 272, first_name: "Laura", last_name: "Waldstein", gender: "W", distance: "Koderrunde", finish_time: "00:44:02", ak: 5 },
  { rank: 10, bib: 285, first_name: "Oliver", last_name: "Läufer", gender: "M", distance: "Koderrunde", finish_time: "00:44:55", ak: 5 },
  { rank: 11, bib: 291, first_name: "Petra", last_name: "Waldweg", gender: "W", distance: "Koderrunde", finish_time: "00:45:33", ak: 6 },
  { rank: 12, bib: 298, first_name: "Stefan", last_name: "Hainbuche", gender: "M", distance: "Koderrunde", finish_time: "00:46:01", ak: 6 },

  // —— Trailrun ——
  { rank: 1, bib: 401, first_name: "Florian", last_name: "Gipfel", gender: "M", distance: "Trailrun", finish_time: "00:52:18", ak: 3 },
  { rank: 2, bib: 412, first_name: "Clara", last_name: "Steilhang", gender: "W", distance: "Trailrun", finish_time: "00:54:02", ak: 3 },
  { rank: 3, bib: 425, first_name: "Ben", last_name: "Wachtler", gender: "M", distance: "Trailrun", finish_time: "00:55:44", ak: 4 },
  { rank: 4, bib: 438, first_name: "Kathrin", last_name: "Pfad", gender: "W", distance: "Trailrun", finish_time: "00:56:21", ak: 4 },
  { rank: 5, bib: 441, first_name: "Marco", last_name: "Stein", gender: "M", distance: "Trailrun", finish_time: "00:57:05", ak: 3 },
  { rank: 6, bib: 456, first_name: "Sandra", last_name: "Moos", gender: "W", distance: "Trailrun", finish_time: "00:58:12", ak: 5 },
  { rank: 7, bib: 462, first_name: "Tobias", last_name: "Fels", gender: "M", distance: "Trailrun", finish_time: "00:59:01", ak: 5 },
  { rank: 8, bib: 478, first_name: "Andrea", last_name: "Hang", gender: "W", distance: "Trailrun", finish_time: "01:00:33", ak: 4 },
  { rank: 9, bib: 483, first_name: "Jürgen", last_name: "Wald", gender: "M", distance: "Trailrun", finish_time: "01:01:18", ak: 6 },
  { rank: 10, bib: 495, first_name: "Monika", last_name: "Tal", gender: "W", distance: "Trailrun", finish_time: "01:02:44", ak: 6 },
  { rank: 11, bib: 501, first_name: "Sebastian", last_name: "Kamm", gender: "M", distance: "Trailrun", finish_time: "01:03:55", ak: 2 },
  { rank: 12, bib: 512, first_name: "Franziska", last_name: "Grat", gender: "W", distance: "Trailrun", finish_time: "01:05:10", ak: 2 },
];

export const DEMO_EVENT_2027 = {
  id: "demo-2027",
  name: "Koderlauf 2027",
  slug: "koderlauf-2027",
  date: "2027-06-15T09:00:00+02:00",
  location: "Obermögersheim",
  description: "Der jährliche Koderlauf in Obermögersheim.",
  max_participants_5km: 200,
  max_participants_10km: 150,
  max_participants_kids: 100,
  registration_open: true,
  early_bird_deadline: "2027-02-28T23:59:59+01:00",
  created_at: new Date().toISOString(),
};

export const DEMO_RESULTS = [
  { rank: 1, bib: 42, first_name: "Max", last_name: "Waldläufer", gender: "M", distance: "10km", finish_time: "00:38:34", pace: "3:51/km", age_class: "M30" },
  { rank: 2, bib: 17, first_name: "Leon", last_name: "Förster", gender: "M", distance: "10km", finish_time: "00:39:02", pace: "3:54/km", age_class: "M25" },
  { rank: 3, bib: 5, first_name: "Anna", last_name: "Bergmann", gender: "W", distance: "10km", finish_time: "00:40:45", pace: "4:05/km", age_class: "W30" },
  { rank: 4, bib: 88, first_name: "Tom", last_name: "Eichner", gender: "M", distance: "10km", finish_time: "00:41:11", pace: "4:07/km", age_class: "M35" },
  { rank: 5, bib: 23, first_name: "Sophie", last_name: "Grünwald", gender: "W", distance: "10km", finish_time: "00:42:33", pace: "4:15/km", age_class: "W25" },
  { rank: 1, bib: 101, first_name: "Lena", last_name: "Moosbach", gender: "W", distance: "5km", finish_time: "00:18:34", pace: "3:43/km", age_class: "W20" },
  { rank: 2, bib: 112, first_name: "Niklas", last_name: "Steinweg", gender: "M", distance: "5km", finish_time: "00:19:02", pace: "3:48/km", age_class: "M20" },
  { rank: 3, bib: 108, first_name: "Mia", last_name: "Tannenbaum", gender: "W", distance: "5km", finish_time: "00:19:45", pace: "3:57/km", age_class: "W25" },
  { rank: 4, bib: 134, first_name: "Felix", last_name: "Birkner", gender: "M", distance: "5km", finish_time: "00:20:11", pace: "4:02/km", age_class: "M30" },
  { rank: 5, bib: 199, first_name: "Laura", last_name: "Waldstein", gender: "W", distance: "5km", finish_time: "00:20:33", pace: "4:07/km", age_class: "W30" },
  { rank: 1, bib: 301, first_name: "Tim", last_name: "Lichtenberg", gender: "M", distance: "kids", finish_time: "00:09:05", pace: "4:33/km", age_class: "U14" },
  { rank: 2, bib: 315, first_name: "Emma", last_name: "Sonnenschein", gender: "W", distance: "kids", finish_time: "00:09:22", pace: "4:41/km", age_class: "U14" },
  { rank: 3, bib: 308, first_name: "Lukas", last_name: "Grünfeld", gender: "M", distance: "kids", finish_time: "00:09:48", pace: "4:54/km", age_class: "U12" },
];

export const DEMO_GALLERY = [
  { id: "g1", url: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80", beschreibung: "Der Start des Koderlauf 2026", distanz: "10km" },
  { id: "g2", url: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80", beschreibung: "Durch die Wälder von Obermögersheim", distanz: null },
  { id: "g3", url: "https://images.unsplash.com/photo-1461897104016-0b3b00b1ea56?w=600&q=80", beschreibung: "Zieleinlauf mit Bestzeit", distanz: "5km" },
  { id: "g4", url: "https://images.unsplash.com/photo-1486218119243-13883505764c?w=600&q=80", beschreibung: "Die Siegerehrung", distanz: null },
  { id: "g5", url: "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=600&q=80", beschreibung: "Die wunderschöne Strecke", distanz: null },
  { id: "g6", url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80", beschreibung: "Gemeinsam ans Ziel", distanz: "10km" },
];

export const DEMO_PARTICIPANT_COUNTS = {
  "5km": 87,
  "10km": 134,
  kids: 26,
  total: 247,
};

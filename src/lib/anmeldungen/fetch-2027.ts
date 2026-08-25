import { aggregateFromRaceResultJson, emptyStats2027 } from "@/lib/anmeldungen/aggregate";
import type { AnmeldungenStats } from "@/lib/anmeldungen/types";

/**
 * Lädt die RR-Teilnehmer-JSON-Liste und aggregiert Statistik.
 * URL kommt aus Env: RACE_RESULT_PARTICIPANTS_JSON_URL
 */
export async function fetchAnmeldungen2027(): Promise<AnmeldungenStats> {
  const url = process.env.RACE_RESULT_PARTICIPANTS_JSON_URL?.trim();
  if (!url) {
    return emptyStats2027();
  }

  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: { Accept: "application/json, text/plain, */*" },
  });

  if (!res.ok) {
    throw new Error(`Race Result JSON nicht erreichbar (${res.status})`);
  }

  const text = await res.text();
  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("Antwort ist kein gültiges JSON");
  }

  return aggregateFromRaceResultJson(payload);
}

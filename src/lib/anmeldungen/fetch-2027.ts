import { aggregateFromRaceResultJson } from "@/lib/anmeldungen/aggregate";
import {
  fetchRrPublishParticipantsConfig,
  fetchRrPublishTeilnehmerList,
} from "@/lib/anmeldungen/rr-publish";
import type { AnmeldungenStats } from "@/lib/anmeldungen/types";

async function parseJsonResponse(res: Response, label: string): Promise<unknown> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label} ist kein gültiges JSON`);
  }
}

/**
 * Lädt Live-Anmeldungen 2027.
 * 1) Optionaler Simple-API-Link (Env)
 * 2) Öffentliche RRPublish-Teilnehmerliste (Event 391760)
 */
export async function fetchAnmeldungen2027(): Promise<AnmeldungenStats> {
  const url = process.env.RACE_RESULT_PARTICIPANTS_JSON_URL?.trim();
  if (url) {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json, text/plain, */*" },
    });
    if (!res.ok) {
      throw new Error(`Race Result JSON nicht erreichbar (${res.status})`);
    }
    return aggregateFromRaceResultJson(await parseJsonResponse(res, "Antwort"));
  }

  const cfg = await fetchRrPublishParticipantsConfig();
  const payload = await fetchRrPublishTeilnehmerList(cfg);
  return aggregateFromRaceResultJson(payload, cfg.contests);
}

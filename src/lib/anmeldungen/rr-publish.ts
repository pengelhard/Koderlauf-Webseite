/**
 * Öffentliche my.raceresult.com Teilnehmerliste (RRPublish).
 * Event-ID kommt aus RACE_RESULT – kein Simple-API-Link nötig.
 */

import { RACE_RESULT } from "@/lib/race-result";

export const RR_PUBLISH_ORIGIN = "https://my.raceresult.com";

export interface RrPublishListMeta {
  Name: string;
  Contest?: string | number;
  ID?: string;
}

export interface RrPublishConfig {
  key: string;
  contests: Record<string, string>;
  TabConfig?: { Lists?: RrPublishListMeta[] };
  Tab?: { Config?: { Lists?: RrPublishListMeta[] } };
}

function publishUrl(path: string): string {
  return `${RR_PUBLISH_ORIGIN}/${RACE_RESULT.eventId}/${path}`;
}

async function rrFetch(url: string): Promise<unknown> {
  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: {
      Accept: "application/json",
      "User-Agent": "Koderlauf-Webseite/1.0 (teilnehmer)",
    },
  });
  if (!res.ok) {
    throw new Error(`Race Result nicht erreichbar (${res.status})`);
  }
  return res.json();
}

export async function fetchRrPublishParticipantsConfig(): Promise<RrPublishConfig> {
  const payload = await rrFetch(publishUrl("participants/config"));
  if (!payload || typeof payload !== "object") {
    throw new Error("Race Result Config ungültig");
  }
  const cfg = payload as RrPublishConfig;
  if (!cfg.key) {
    throw new Error("Race Result Config ohne Schlüssel");
  }
  return cfg;
}

export function pickTeilnehmerListName(cfg: RrPublishConfig): string {
  const lists =
    cfg.TabConfig?.Lists ?? cfg.Tab?.Config?.Lists ?? [];
  const preferred = lists.find((l) =>
    String(l.Name ?? "")
      .toLowerCase()
      .includes("teilnehmer"),
  );
  return preferred?.Name ?? lists[0]?.Name ?? "Online|Teilnehmer";
}

export async function fetchRrPublishTeilnehmerList(
  cfg: RrPublishConfig,
): Promise<unknown> {
  const listname = pickTeilnehmerListName(cfg);
  const params = new URLSearchParams({
    key: cfg.key,
    listname,
    r: "all",
  });
  return rrFetch(`${publishUrl("participants/list")}?${params.toString()}`);
}

/**
 * Öffentliche my.raceresult.com-Listen (RRPublish).
 *
 * Event-ID = Zahl in der URL, z. B. https://my.raceresult.com/391760/
 * Config   = GET /{eventId}/{tab}/config  (tab: participants | results)
 *            liefert `key` (Token, keine Event-ID), `contests` und `Lists`
 * Liste    = GET /{eventId}/{tab}/list?key=…&listname=…&r=all
 *            optional `contest` wenn die Liste einer Strecke zugeordnet ist
 */

import { flattenRrListData } from "@/lib/anmeldungen/aggregate";
import { RACE_RESULT } from "@/lib/race-result";

export const RR_PUBLISH_ORIGIN = "https://my.raceresult.com";

export type RrPublishTab = "participants" | "results";

export interface RrPublishListMeta {
  Name: string;
  Contest?: string | number;
  ID?: string;
  Mode?: string;
  ShowAs?: string;
}

export interface RrPublishConfig {
  key: string;
  contests: Record<string, string>;
  TabConfig?: { Lists?: RrPublishListMeta[] };
  Tab?: { Config?: { Lists?: RrPublishListMeta[] } };
}

interface RrListPayload {
  DataFields?: string[];
  data?: unknown;
}

function publishUrl(tab: RrPublishTab, path: string): string {
  return `${RR_PUBLISH_ORIGIN}/${RACE_RESULT.eventId}/${tab}/${path}`;
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

export function listsFromConfig(cfg: RrPublishConfig): RrPublishListMeta[] {
  return cfg.TabConfig?.Lists ?? cfg.Tab?.Config?.Lists ?? [];
}

export function contestName(
  cfg: RrPublishConfig,
  contest: string | number | undefined,
): string {
  if (contest == null) return "";
  const id = String(contest);
  if (id === "" || id === "0") return "";
  return cfg.contests?.[id] || cfg.contests?.[id.replace(/^0+/, "")] || "";
}

export async function fetchRrPublishConfig(
  tab: RrPublishTab = "participants",
): Promise<RrPublishConfig> {
  const payload = await rrFetch(publishUrl(tab, "config"));
  if (!payload || typeof payload !== "object") {
    throw new Error("Race Result Config ungültig");
  }
  const cfg = payload as RrPublishConfig;
  if (!cfg.key) {
    throw new Error("Race Result Config ohne Schlüssel");
  }
  return cfg;
}

export async function fetchRrPublishParticipantsConfig(): Promise<RrPublishConfig> {
  return fetchRrPublishConfig("participants");
}

function uniqueLists(lists: RrPublishListMeta[]): RrPublishListMeta[] {
  const seen = new Set<string>();
  const out: RrPublishListMeta[] = [];
  for (const list of lists) {
    const key = `${list.Name ?? ""}::${list.Contest ?? "0"}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(list);
  }
  return out;
}

/** Teilnehmerliste, sonst sichtbare Listen (nicht Mode=hidden). */
export function pickListsToFetch(cfg: RrPublishConfig): RrPublishListMeta[] {
  const lists = listsFromConfig(cfg);
  const named = lists.filter((l) =>
    String(l.Name ?? "")
      .toLowerCase()
      .includes("teilnehmer"),
  );
  const pool = named.length
    ? named
    : lists.filter((l) => String(l.Mode ?? "").toLowerCase() !== "hidden");
  const unique = uniqueLists(pool.length ? pool : lists);
  if (unique.length) return unique;
  return [{ Name: "Online|Teilnehmer", Contest: "0" }];
}

const IGNORE_GROUP_FILTERS = ["<Ignore>", "<Ignore>", "<Ignore>", "<Ignore>"].join(
  "\f",
);

async function fetchRrList(
  tab: RrPublishTab,
  cfg: RrPublishConfig,
  list: RrPublishListMeta,
): Promise<RrListPayload> {
  const params = new URLSearchParams({
    key: cfg.key,
    listname: list.Name,
    r: "all",
    f: IGNORE_GROUP_FILTERS,
  });
  const contestId = list.Contest != null ? String(list.Contest) : "";
  if (contestId && contestId !== "0") {
    params.set("contest", contestId);
  }
  const payload = await rrFetch(`${publishUrl(tab, "list")}?${params.toString()}`);
  if (!payload || typeof payload !== "object") {
    throw new Error("Race Result Liste ungültig");
  }
  return payload as RrListPayload;
}

/**
 * Lädt die Teilnehmerliste(n).
 * Eine Sammelliste (Contest 0) oder mehrere Listen je Strecke wie in /results/config.
 */
export async function fetchRrPublishTeilnehmerList(
  cfg: RrPublishConfig,
  tab: RrPublishTab = "participants",
): Promise<unknown> {
  const lists = pickListsToFetch(cfg);
  const allRows: ReturnType<typeof flattenRrListData> = [];
  let fields: string[] = [];

  for (const list of lists) {
    const payload = await fetchRrList(tab, cfg, list);
    const listFields = Array.isArray(payload.DataFields)
      ? payload.DataFields.map(String)
      : [];
    if (listFields.length > fields.length) fields = listFields;
    const rows = flattenRrListData(payload.data, listFields);
    const listContest = contestName(cfg, list.Contest);
    for (const row of rows) {
      if (listContest) row.__listContest = listContest;
      allRows.push(row);
    }
  }

  return { DataFields: [...fields, "__listContest"], data: allRows };
}

export function pickTeilnehmerListName(cfg: RrPublishConfig): string {
  return pickListsToFetch(cfg)[0]?.Name ?? "Online|Teilnehmer";
}

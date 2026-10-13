/** Neue Supabase-Projekte vergeben seit Mai 2026 keine Tabellenrechte mehr automatisch. */
export const FASSJAGD_STATE_GRANT_SQL = `grant usage on schema public to service_role;
grant select, insert, update, delete on table public.fassjagd_state to service_role;`;

export type SacheSaveResult = { ok: true } | { ok: false; error: string; sql?: string };

export function fehlerAusDatenbank(code: string | undefined, message: string | undefined): SacheSaveResult {
  const text = message?.trim() || "unbekannter Fehler";
  if (code === "42501" || /permission denied|row-level security/i.test(text)) {
    return {
      ok: false,
      error:
        "Die Datenbank verweigert das Speichern. Diesen Befehl einmal im Supabase-SQL-Editor ausführen, danach den Haken noch einmal setzen.",
      sql: FASSJAGD_STATE_GRANT_SQL,
    };
  }
  return { ok: false, error: `Speichern klappt nicht: ${text}` };
}

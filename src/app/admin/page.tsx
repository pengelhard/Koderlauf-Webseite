"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Shirt, Ticket, Download, Mail } from "lucide-react";
import type { OrgaAdminPayload } from "@/lib/orga/types";

export default function OrgaAdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OrgaAdminPayload | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/orga/admin", { cache: "no-store" });
    if (res.status === 401) {
      setAuthed(false);
      setData(null);
      return;
    }
    const json = (await res.json().catch(() => ({}))) as OrgaAdminPayload & {
      error?: string;
    };
    if (!res.ok) {
      setError(json.error || "Fehler");
      return;
    }
    setAuthed(true);
    setData(json);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function post(body: Record<string, string>) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/orga/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(json.error || "Aktion fehlgeschlagen");
        return;
      }
      if (body.action === "login") {
        setAuthed(true);
        await refresh();
      }
      if (body.action === "logout") {
        setAuthed(false);
        setData(null);
      }
    } finally {
      setBusy(false);
    }
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 pt-28 pb-16">
        <h1 className="text-3xl font-extrabold">Orga Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          T-Shirt-Produktion, Ausgabe am Sportheim, Tape-Jam-Abendkarten. Gleiches
          Passwort wie Fassjagd-Admin.
        </p>
        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void post({ action: "login", password });
          }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin-Passwort"
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm"
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-koder-orange py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            Anmelden
          </button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      </div>
    );
  }

  const stand = data?.fetchedAt
    ? new Date(data.fetchedAt).toLocaleString("de-DE", {
        timeZone: "Europe/Berlin",
      })
    : "";

  return (
    <div className="mx-auto max-w-3xl px-4 pt-28 pb-16 space-y-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">T-Shirt &amp; Abendkarten</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Race Result Adressliste · {data?.rowCount ?? 0} Teilnehmer
            {stand ? ` · Stand ${stand}` : ""}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => void post({ action: "logout" })}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Abmelden
          </button>
          <Link
            href="/fassjagd/admin"
            className="text-xs text-koder-orange hover:underline"
          >
            Fassjagd Admin
          </Link>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {data?.error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {data.error}
        </p>
      )}
      {data?.hinweise && data.hinweise.length > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
          <p className="font-semibold">Hinweise zu den API-Feldern</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
            {data.hinweise.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shirt size={16} aria-hidden /> T-Shirts
          </div>
          <p className="mt-1 text-3xl font-black tabular-nums">{data?.tshirt.total ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Ticket size={16} aria-hidden /> Abendkarten
          </div>
          <p className="mt-1 text-3xl font-black tabular-nums">
            {data?.abendkarten.totalKarten ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">
            {data?.abendkarten.personen ?? 0} Personen
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail size={16} aria-hidden /> Mails in der Liste
          </div>
          <p className="mt-1 text-3xl font-black tabular-nums">{data?.mailCount ?? 0}</p>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <h2 className="font-semibold">T-Shirt nach Größe</h2>
        {(data?.tshirt.bySize.length ?? 0) === 0 ? (
          <p className="text-sm text-muted-foreground">Keine Größen in der Liste.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-1 font-medium">Größe</th>
                <th className="py-1 text-right font-medium">Anzahl</th>
              </tr>
            </thead>
            <tbody>
              {data!.tshirt.bySize.map((r) => (
                <tr key={r.size} className="border-t border-border">
                  <td className="py-1.5">{r.size}</td>
                  <td className="py-1.5 text-right tabular-nums">{r.count}</td>
                </tr>
              ))}
              <tr className="border-t border-border font-semibold">
                <td className="py-1.5">Gesamt</td>
                <td className="py-1.5 text-right tabular-nums">{data!.tshirt.total}</td>
              </tr>
            </tbody>
          </table>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <h2 className="font-semibold">Downloads</h2>
        <p className="text-sm text-muted-foreground">
          Drei Listen für die Praxis: Druckerei, Ausgabe Shirts, Ausgabe Abendkarten.
          Mails nur in der internen CSV, nicht in den PDFs am Tresen.
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/orga/pdf?kind=produktion"
            className="inline-flex items-center gap-2 rounded-xl bg-koder-orange px-4 py-2 text-sm font-semibold text-white"
          >
            <Download size={16} aria-hidden /> PDF Produktion
          </a>
          <a
            href="/api/orga/pdf?kind=ausgabe"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:border-koder-orange/40"
          >
            <Download size={16} aria-hidden /> PDF Ausgabe T-Shirt
          </a>
          <a
            href="/api/orga/pdf?kind=abendkarten"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:border-koder-orange/40"
          >
            <Download size={16} aria-hidden /> PDF Abendkarten
          </a>
          {(data?.mailCount ?? 0) > 0 && (
            <a
              href="/api/orga/kontakt"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:border-koder-orange/40"
            >
              <Mail size={16} aria-hidden /> CSV Kontakt T-Shirt
            </a>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <h2 className="font-semibold">Ausgabe T-Shirt (Vorschau)</h2>
        {(data?.tshirt.recipients.length ?? 0) === 0 ? (
          <p className="text-sm text-muted-foreground">Niemand mit T-Shirt-Größe.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-1 font-medium">Nr.</th>
                  <th className="py-1 font-medium">Name</th>
                  <th className="py-1 font-medium">Größe</th>
                </tr>
              </thead>
              <tbody>
                {data!.tshirt.recipients.map((r) => (
                  <tr key={`${r.bib}-${r.name}`} className="border-t border-border">
                    <td className="py-1.5 tabular-nums">{r.bib || "–"}</td>
                    <td className="py-1.5">{r.name}</td>
                    <td className="py-1.5">{r.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <h2 className="font-semibold">Abendkarten (Vorschau)</h2>
        {(data?.abendkarten.recipients.length ?? 0) === 0 ? (
          <p className="text-sm text-muted-foreground">
            Noch keine Tape-Jam-Karten in der Adressliste.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-1 font-medium">Nr.</th>
                <th className="py-1 font-medium">Name</th>
                <th className="py-1 text-right font-medium">Karten</th>
              </tr>
            </thead>
            <tbody>
              {data!.abendkarten.recipients.map((r) => (
                <tr key={`${r.bib}-${r.name}`} className="border-t border-border">
                  <td className="py-1.5 tabular-nums">{r.bib || "–"}</td>
                  <td className="py-1.5">{r.name}</td>
                  <td className="py-1.5 text-right tabular-nums">{r.anzahl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

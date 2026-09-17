"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Shirt,
  Ticket,
  Download,
  Mail,
  ClipboardList,
  LayoutList,
  Package,
  Handshake,
} from "lucide-react";
import type { OrgaAdminPayload } from "@/lib/orga/types";

function pdfHref(kind: string, strecke?: string, year?: string): string {
  const params = new URLSearchParams({ kind });
  if (strecke) params.set("strecke", strecke);
  if (year) params.set("year", year);
  return `/api/orga/pdf?${params.toString()}`;
}

export default function OrgaAdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OrgaAdminPayload | null>(null);
  const [busy, setBusy] = useState(false);
  const [sponsorYear, setSponsorYear] = useState<"2026" | "2027">("2026");

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
          Startunterlagen, T-Shirts, Abendkarten und Sponsoren. Gleiches Passwort wie
          Fassjagd-Admin.
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

  const strecken = data?.startunterlagen ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 pt-28 pb-16 space-y-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Orga Admin</h1>
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
            <ClipboardList size={16} aria-hidden /> Teilnehmer
          </div>
          <p className="mt-1 text-3xl font-black tabular-nums">{data?.rowCount ?? 0}</p>
        </div>
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
      </div>

      {/* Startunterlagen */}
      <section className="rounded-2xl border border-koder-orange/30 bg-card p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-koder-orange/15 text-koder-orange">
            <ClipboardList className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-bold">Startunterlagen</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Variante A bleibt Querformat-Checkliste. Variante B (Ausgabe) ist Hochformat
              mit größerer Schrift: links Name/Startnr., rechts Abhak-Spalten. Startnummern
              erscheinen automatisch, sobald Race Result sie in der Adressliste setzt.
              Variante C = alle Strecken. Leere Zeilen am Ende für Nachmeldungen.
            </p>
          </div>
        </div>

        <a
          href={pdfHref("start-gesamt")}
          className="inline-flex items-center gap-2 rounded-xl bg-koder-orange px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Download size={16} aria-hidden />
          Variante C – Gesamtliste (alle Strecken)
        </a>

        {strecken.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Noch keine Strecken in der Adressliste.
          </p>
        ) : (
          <div className="space-y-3">
            {strecken.map((s) => (
              <div
                key={s.slug}
                className="rounded-xl border border-border bg-muted/30 p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{s.label}</h3>
                    <p className="text-xs text-muted-foreground">
                      {s.distanz} · Start {s.startzeit} · {s.teilnehmer} TN · {s.shirts}{" "}
                      Shirts · {s.karten} Karten
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={pdfHref("start-standard", s.slug)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:border-koder-orange/40"
                      title="Variante A – Checkliste"
                    >
                      <Download size={14} aria-hidden />
                      A Checkliste
                    </a>
                    <a
                      href={pdfHref("start-ausgabe", s.slug)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:border-koder-orange/40"
                      title="Variante B – Ausgabe (Hochformat)"
                    >
                      <Download size={14} aria-hidden />
                      B Ausgabe
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sponsoren */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-koder-orange/15 text-koder-orange">
            <Handshake className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-bold">Sponsoren</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Internes Kontakt-PDF nach Jahr. Firma als Block, Logo rechts, darunter
              Adresse, Ansprechpartner, E-Mail, Telefon, Social Media und Website.
              Öffentliche Felder und Web-Impressen sind ergänzt; was fehlt, steht als „–“.
              Die Website zeigt weiterhin nur Name, Ort, Logo und Website.
            </p>
          </div>
        </div>

        <div className="flex max-w-xs rounded-2xl border border-border bg-muted/40 p-1">
          {(["2026", "2027"] as const).map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setSponsorYear(year)}
              className={[
                "flex-1 rounded-xl px-4 py-2 text-sm font-bold transition-colors",
                sponsorYear === year
                  ? "bg-koder-orange text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {year}
            </button>
          ))}
        </div>

        <a
          href={pdfHref("sponsoren", undefined, sponsorYear)}
          className="inline-flex items-center gap-2 rounded-xl bg-koder-orange px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Download size={16} aria-hidden />
          Sponsoren-PDF {sponsorYear}
        </a>
      </section>

      {/* T-Shirt & Abendkarten */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-light/15 text-forest-light">
            <Package className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-bold">T-Shirt &amp; Abendkarten</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Speziallisten für Druckerei, Shirt-Karton und Tape Jam. Keine Mailadressen in den
              PDFs. Die T-Shirt-Ausgabe ist Hochformat, sortiert nach Größe, dann Name.
              Startnummern erscheinen in der Ausgabe, sobald Race Result sie in der Adressliste
              setzt.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-4 space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Shirt size={16} aria-hidden /> T-Shirts
            </h3>
            {(data?.tshirt.bySize.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground">Keine Größen in der Liste.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {data!.tshirt.bySize.map((r) => (
                    <tr key={r.size} className="border-t border-border first:border-0">
                      <td className="py-1">{r.size}</td>
                      <td className="py-1 text-right tabular-nums">{r.count}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-border font-semibold">
                    <td className="py-1">Gesamt</td>
                    <td className="py-1 text-right tabular-nums">{data!.tshirt.total}</td>
                  </tr>
                </tbody>
              </table>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={pdfHref("produktion")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-koder-orange px-3 py-1.5 text-xs font-semibold text-white"
              >
                <Download size={14} aria-hidden /> Produktion
              </a>
              <a
                href={pdfHref("ausgabe")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:border-koder-orange/40"
              >
                <Download size={14} aria-hidden /> Ausgabe
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4 space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Ticket size={16} aria-hidden /> Tape Jam
            </h3>
            <p className="text-sm text-muted-foreground">
              {data?.abendkarten.totalKarten ?? 0} Karten · {data?.abendkarten.personen ?? 0}{" "}
              Personen
            </p>
            <a
              href={pdfHref("abendkarten")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:border-koder-orange/40"
            >
              <Download size={14} aria-hidden /> Abendkarten-PDF
            </a>
          </div>
        </div>

        {(data?.mailCount ?? 0) > 0 && (
          <a
            href="/api/orga/kontakt"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:border-koder-orange/40"
          >
            <Mail size={16} aria-hidden /> CSV Kontakt T-Shirt (intern)
          </a>
        )}
      </section>

      {/* Vorschau */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <LayoutList size={18} aria-hidden /> Kurzvorschau
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
              T-Shirt-Empfänger ({data?.tshirt.recipients.length ?? 0})
            </h3>
            {(data?.tshirt.recipients.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground">–</p>
            ) : (
              <div className="max-h-48 overflow-y-auto rounded-lg border border-border text-sm">
                <table className="w-full">
                  <thead className="sticky top-0 bg-card">
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-2 py-1 font-medium">Nr.</th>
                      <th className="px-2 py-1 font-medium">Name</th>
                      <th className="px-2 py-1 font-medium">Gr.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data!.tshirt.recipients.slice(0, 30).map((r) => (
                      <tr key={`${r.bib}-${r.name}`} className="border-t border-border">
                        <td className="px-2 py-1 tabular-nums">{r.bib || "–"}</td>
                        <td className="px-2 py-1">{r.name}</td>
                        <td className="px-2 py-1">{r.size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(data?.tshirt.recipients.length ?? 0) > 30 && (
                  <p className="px-2 py-1 text-xs text-muted-foreground">
                    … und {(data?.tshirt.recipients.length ?? 0) - 30} weitere
                  </p>
                )}
              </div>
            )}
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
              Abendkarten ({data?.abendkarten.recipients.length ?? 0})
            </h3>
            {(data?.abendkarten.recipients.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground">–</p>
            ) : (
              <div className="max-h-48 overflow-y-auto rounded-lg border border-border text-sm">
                <table className="w-full">
                  <thead className="sticky top-0 bg-card">
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-2 py-1 font-medium">Nr.</th>
                      <th className="px-2 py-1 font-medium">Name</th>
                      <th className="px-2 py-1 text-right font-medium">K.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data!.abendkarten.recipients.slice(0, 30).map((r) => (
                      <tr key={`${r.bib}-${r.name}`} className="border-t border-border">
                        <td className="px-2 py-1 tabular-nums">{r.bib || "–"}</td>
                        <td className="px-2 py-1">{r.name}</td>
                        <td className="px-2 py-1 text-right tabular-nums">{r.anzahl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

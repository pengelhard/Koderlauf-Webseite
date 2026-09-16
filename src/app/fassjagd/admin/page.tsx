"use client";

import { useCallback, useEffect, useState } from "react";
import { VereinCombobox } from "@/components/fassjagd/verein-combobox";
import type { FassjagdBoard } from "@/lib/fassjagd/types";
import type { FassjagdOverrides } from "@/lib/fassjagd/store";

export default function FassjagdAdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [board, setBoard] = useState<FassjagdBoard | null>(null);
  const [overrides, setOverrides] = useState<FassjagdOverrides | null>(null);
  const [fromName, setFromName] = useState("");
  const [toName, setToName] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/fassjagd/admin", { cache: "no-store" });
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Fehler");
      return;
    }
    setAuthed(true);
    setBoard(json.board);
    setOverrides(json.overrides);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function post(body: Record<string, string>) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/fassjagd/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Aktion fehlgeschlagen");
        return;
      }
      if (json.board) setBoard(json.board);
      if (json.overrides) setOverrides(json.overrides);
      if (body.action === "login") {
        setAuthed(true);
        await refresh();
      }
      if (body.action === "logout") setAuthed(false);
    } finally {
      setBusy(false);
    }
  }

  const names = board?.names ?? [];

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 pt-28 pb-16">
        <h1 className="text-3xl font-extrabold">Fassjagd Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Vereine mergen, aus Wertung nehmen, Freeze, Wochenstand-Bild.
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

  return (
    <div className="mx-auto max-w-3xl px-4 pt-28 pb-16 space-y-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Fassjagd Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Status: {board?.status === "live" ? "LIVE" : "OFFIZIELL"}
            {board?.frozen ? " (eingefroren)" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void post({ action: "logout" })}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Abmelden
        </button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}

      <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <h2 className="font-semibold">Alias-Merge</h2>
        <p className="text-sm text-muted-foreground">
          z. B. „TV 1860 GZ“ auf „TV 1860 Gunzenhausen“. Ohne Merge ist die Tabelle wertlos.
        </p>
        <VereinCombobox id="merge-from" names={names} value={fromName} onChange={setFromName} placeholder="Diese Schreibweise…" />
        <VereinCombobox id="merge-to" names={names} value={toName} onChange={setToName} placeholder="…gehört zu diesem Namen" />
        <button
          type="button"
          disabled={busy || !fromName || !toName}
          onClick={() => void post({ action: "merge", from: fromName, to: toName })}
          className="rounded-xl bg-koder-orange px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Zusammenführen
        </button>
        {overrides && Object.keys(overrides.aliases).length > 0 && (
          <ul className="text-xs text-muted-foreground">
            {Object.entries(overrides.aliases).map(([k, v]) => (
              <li key={k}>
                {k} → {v}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <h2 className="font-semibold">Aus Wertung nehmen</h2>
        <ul className="space-y-2">
          {(board?.ranking ?? []).map((c) => (
            <li key={c.slug} className="flex items-center justify-between gap-2 text-sm">
              <span>
                {c.place}. {c.name} ({c.total})
              </span>
              <button
                type="button"
                className="text-xs font-semibold text-destructive hover:underline"
                onClick={() => void post({ action: "exclude", name: c.name })}
              >
                raus
              </button>
            </li>
          ))}
        </ul>
        {(overrides?.excluded.length ?? 0) > 0 && (
          <div className="text-xs">
            <p className="font-semibold">Ausgeschlossen</p>
            {overrides!.excluded.map((n) => (
              <button
                key={n}
                type="button"
                className="mt-1 block text-koder-orange hover:underline"
                onClick={() => void post({ action: "include", name: n })}
              >
                {n} wieder rein
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <h2 className="font-semibold">Freeze</h2>
        <p className="text-sm text-muted-foreground">
          Automatisch am Online-Anmeldeschluss. Manuell jetzt einfrieren, damit Nachmeldungen vor Ort
          nicht mehr zählen.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void post({ action: "freeze" })}
            className="rounded-xl bg-koder-orange px-4 py-2 text-sm font-semibold text-white"
          >
            Jetzt einfrieren
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void post({ action: "unfreeze" })}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold"
          >
            Freeze lösen
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <h2 className="font-semibold">Wochenstand</h2>
        <a
          href="/api/fassjagd/week-image"
          className="inline-flex rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:border-koder-orange/40"
        >
          Top-3-Bild herunterladen
        </a>
      </section>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { Package } from "lucide-react";

type Sache = { id: string; titel: string; mehrfach: boolean; vergeben: boolean };

export function SachspendenAdmin() {
  const [sachen, setSachen] = useState<Sache[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/sponsor-sachen", { cache: "no-store" });
    const json = (await res.json().catch(() => ({}))) as { sachen?: Sache[]; error?: string };
    if (!res.ok) {
      setError(json.error || "Sachspenden konnten nicht geladen werden.");
      return;
    }
    setSachen(json.sachen ?? []);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      void refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [refresh]);

  async function toggle(sache: Sache) {
    setBusyId(sache.id);
    setError(null);
    const next = !sache.vergeben;
    setSachen((list) => list.map((s) => (s.id === sache.id ? { ...s, vergeben: next } : s)));
    try {
      const res = await fetch("/api/sponsor-sachen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sache.id, vergeben: next }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(json.error || "Speichern fehlgeschlagen.");
        setSachen((list) => list.map((s) => (s.id === sache.id ? { ...s, vergeben: sache.vergeben } : s)));
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="rounded-2xl border border-koder-orange/30 bg-card p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-koder-orange/15 text-koder-orange">
          <Package className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-lg font-bold">Sachspenden 2027</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Abgehakt heißt: auf der Sponsor-Seite durchgestrichen und nicht mehr in der Liste.
            Haken wieder weg, dann ist die Sache frei. Siegerpreise und Verpflegung schließen sich
            durch eine Anfrage nicht von selbst.
          </p>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <ul className="divide-y divide-border rounded-xl border border-border">
        {sachen.map((sache) => (
          <li key={sache.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
            <label className="flex min-w-0 flex-1 items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={sache.vergeben}
                disabled={busyId === sache.id}
                onChange={() => void toggle(sache)}
              />
              <span className={sache.vergeben ? "line-through text-muted-foreground" : "font-semibold"}>
                {sache.titel}
              </span>
            </label>
            {sache.mehrfach && (
              <span className="shrink-0 text-[11px] uppercase tracking-wider text-muted-foreground">
                mehrfach
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

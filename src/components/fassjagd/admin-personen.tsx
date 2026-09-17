"use client";

import { useMemo, useState } from "react";
import { VereinCombobox } from "@/components/fassjagd/verein-combobox";
import type { FassjagdPerson } from "@/lib/fassjagd/types";

function PersonRow({
  person,
  names,
  busy,
  onAssign,
  onReset,
}: {
  person: FassjagdPerson;
  names: string[];
  busy: boolean;
  onAssign: (personId: string, group: string) => void;
  onReset: (personId: string) => void;
}) {
  const [group, setGroup] = useState(person.currentGroup);

  const changed = group.trim() !== person.currentGroup.trim();

  return (
    <li className="border-t border-border py-3 first:border-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="font-medium">
          {person.nachname || "–"}, {person.vorname || "–"}
        </p>
        <p className="text-xs text-muted-foreground">{person.strecke || "–"}</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Aktuell: {person.currentGroup || "keine Angabe"}
        {person.overridden
          ? ` · Quelle: ${person.originalGroup || "keine Angabe"}`
          : null}
      </p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <VereinCombobox
            id={`group-${person.id}`}
            names={names}
            value={group}
            onChange={setGroup}
            placeholder="Gruppe zuweisen…"
          />
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            disabled={busy || !group.trim() || !changed}
            onClick={() => onAssign(person.id, group)}
            className="rounded-xl bg-koder-orange px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            Speichern
          </button>
          <button
            type="button"
            disabled={busy || !person.overridden}
            onClick={() => onReset(person.id)}
            className="rounded-xl border border-border px-3 py-2 text-xs font-semibold disabled:opacity-50"
          >
            Zurücksetzen
          </button>
        </div>
      </div>
    </li>
  );
}

export function FassjagdAdminPersonen({
  people,
  names,
  busy,
  onAssign,
  onReset,
}: {
  people: FassjagdPerson[];
  names: string[];
  busy: boolean;
  onAssign: (personId: string, group: string) => void;
  onReset: (personId: string) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return people;
    return people.filter((p) => {
      const hay = `${p.nachname} ${p.vorname} ${p.currentGroup} ${p.originalGroup} ${p.strecke}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [people, q]);

  const overriddenCount = people.filter((p) => p.overridden).length;

  return (
    <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
      <h2 className="font-semibold">Personen einer Gruppe zuweisen</h2>
      <p className="text-sm text-muted-foreground">
        Einzelne Starter einer Fassjagd-Gruppe (Verein, Firma, Gruppe) zuordnen oder die Zuweisung
        ändern. Zählt sofort in der Wertung. Zurücksetzen holt den Original-Namen aus Race Result.
      </p>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Name, Gruppe oder Strecke suchen…"
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-koder-orange"
      />
      <p className="text-xs text-muted-foreground">
        {filtered.length} von {people.length} Personen
        {overriddenCount > 0 ? ` · ${overriddenCount} überschrieben` : ""}
      </p>
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">Keine Personen gefunden.</p>
      ) : (
        <ul className="max-h-[32rem] overflow-y-auto">
          {filtered.map((p) => (
            <PersonRow
              key={`${p.id}-${p.currentGroup}-${p.overridden ? "1" : "0"}`}
              person={p}
              names={names}
              busy={busy}
              onAssign={onAssign}
              onReset={onReset}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

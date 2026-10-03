"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import {
  getEffectiveStatus,
  SACHSPENDEN_SICHTBAR,
  SPONSOR_STUFEN,
  SPONSORING_2027,
  type SponsorFlaeche,
} from "@/lib/sponsoring-2027";

export function InfoButton({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border text-[11px] font-bold text-muted-foreground hover:border-koder-orange hover:text-koder-orange"
      aria-expanded={open}
      aria-label={label}
      onClick={onToggle}
    >
      i
    </button>
  );
}

function InfoNote({ text }: { text: string }) {
  return (
    <p className="mt-2 rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
      {text}
    </p>
  );
}

function StufenKarte({
  stufe,
}: {
  stufe: (typeof SPONSOR_STUFEN)[number];
}) {
  const [open, setOpen] = useState(false);
  return (
    <article
      className={`flex flex-col rounded-2xl border p-5 ${
        stufe.id === "hauptsponsor"
          ? "border-koder-orange/40 bg-gradient-to-br from-koder-orange/10 to-transparent"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-koder-orange">
          {stufe.preisLabel}
        </p>
        <InfoButton label={`Info ${stufe.name}`} open={open} onToggle={() => setOpen((v) => !v)} />
      </div>
      {open && <InfoNote text={stufe.info} />}
      <h3 className="mt-1 text-lg font-extrabold">{stufe.name}</h3>
      <ul className="mt-3 flex-1 space-y-1.5 text-sm">
        {stufe.leistungen.map((item) => (
          <li key={item} className="flex gap-2">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-koder-orange" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <Link
        href={stufe.ctaHref}
        className="mt-4 inline-flex justify-center rounded-xl bg-koder-orange px-3 py-2 text-sm font-bold text-white hover:bg-koder-orange/90"
      >
        {stufe.ctaLabel}
      </Link>
    </article>
  );
}

export function SponsorStufen() {
  return (
    <section className="mt-10" id="stufen">
      <h2 className="text-2xl font-extrabold tracking-tight">Drei Stufen</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {SPONSOR_STUFEN.map((stufe) => (
          <StufenKarte key={stufe.id} stufe={stufe} />
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Unter 100 €: kleines Logo und Name auf der Website, wie 2026.
      </p>
    </section>
  );
}

function SacheZeile({ flaeche }: { flaeche: SponsorFlaeche }) {
  const status = getEffectiveStatus(flaeche);
  const [open, setOpen] = useState(false);
  const hinweis = flaeche.beschreibung;
  return (
    <li className="border-b border-border py-2.5 last:border-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="font-semibold">
          {flaeche.titel}
          {hinweis && (
            <span className="ml-2 align-middle">
              <InfoButton label={`Info ${flaeche.titel}`} open={open} onToggle={() => setOpen((v) => !v)} />
            </span>
          )}
        </span>
        <span className="text-sm text-muted-foreground">
          {[flaeche.kurz, status === "reserviert" ? "im Gespräch" : status === "vergeben" ? "vergeben" : ""]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </div>
      {open && hinweis && <InfoNote text={hinweis} />}
    </li>
  );
}

export function SponsorSachen() {
  const [offen, setOffen] = useState(false);
  return (
    <section id="sachen" className="mt-12 scroll-mt-28">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-2xl font-extrabold tracking-tight">Diese Sachen brauchen wir</h2>
        <InfoButton label="Info Sachspenden" open={offen} onToggle={() => setOffen((v) => !v)} />
      </div>
      {offen && <InfoNote text={SPONSORING_2027.zuordnungSatz} />}
      <p className="mt-2 text-sm text-muted-foreground">
        Kein Preis von uns. Wir bestätigen den Wert, danach gilt die Stufe. Unter 100 € kleines Logo · ab 100 € Banner am Bauzaun · ab 250 € Zieleinlauf und Instagram · ab 500 € ganz oben.
      </p>
      <p className="mt-3 rounded-xl border border-koder-orange/30 bg-koder-orange/10 px-3 py-2 text-sm">
        Liegt euer Logo auf der Sache, seid ihr dort noch einmal sichtbar: Zielbogen, Medaillenband, Startnummer. Zusätzlich zur Stufe.
      </p>
      <ul className="mt-4 rounded-2xl border border-border bg-card px-4">
        {SACHSPENDEN_SICHTBAR.map((f) => (
          <SacheZeile key={f.id} flaeche={f} />
        ))}
      </ul>
    </section>
  );
}

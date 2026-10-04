"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import {
  getEffectiveStatus,
  SACHSPENDEN_SICHTBAR,
  SPONSOR_STUFEN,
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
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length <= 1) {
    return (
      <p className="mt-2 rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
        {lines[0] ?? text}
      </p>
    );
  }
  return (
    <ul className="mt-2 list-disc space-y-1 rounded-xl border border-border bg-muted/40 px-3 py-2 pl-7 text-xs leading-relaxed text-muted-foreground">
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
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
        {stufe.info ? (
          <InfoButton label={`Info ${stufe.name}`} open={open} onToggle={() => setOpen((v) => !v)} />
        ) : null}
      </div>
      {open && stufe.info ? <InfoNote text={stufe.info} /> : null}
      <h3 className="mt-1 text-lg font-extrabold">{stufe.name}</h3>
      <ul className="mt-3 flex-1 space-y-1.5 text-sm">
        {stufe.leistungen.map((item) => (
          <li key={item} className="flex gap-2">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-koder-orange" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
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
      <div className="mt-6 text-center">
        <Link
          href="#anfrage"
          className="inline-flex rounded-xl bg-koder-orange px-6 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-koder-orange/90"
        >
          Sponsor anfragen
        </Link>
      </div>
    </section>
  );
}

function SacheZeile({ flaeche, vergeben }: { flaeche: SponsorFlaeche; vergeben: boolean }) {
  const status = vergeben ? "vergeben" : getEffectiveStatus(flaeche);
  const [open, setOpen] = useState(false);
  const hinweis = flaeche.beschreibung;
  return (
    <li className={`border-b border-border py-2.5 last:border-0 ${vergeben ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="font-semibold">
          <span className={vergeben ? "line-through decoration-2" : ""}>{flaeche.titel}</span>
          {hinweis && (
            <span className="ml-2 align-middle">
              <InfoButton label={`Info ${flaeche.titel}`} open={open} onToggle={() => setOpen((v) => !v)} />
            </span>
          )}
        </span>
        <span className={`text-sm text-muted-foreground ${vergeben ? "line-through" : ""}`}>
          {[flaeche.kurz, status === "reserviert" ? "im Gespräch" : status === "vergeben" ? "vergeben" : ""]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </div>
      {open && hinweis && <InfoNote text={hinweis} />}
    </li>
  );
}

export function SponsorSachen({ vergebenIds = [] }: { vergebenIds?: string[] }) {
  const vergeben = new Set(vergebenIds);
  return (
    <section id="sachen" className="mt-12 scroll-mt-28">
      <h2 className="text-2xl font-extrabold tracking-tight">Diese Sachen brauchen wir</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Zur Orientierung: Wir rechnen mit etwa 600 bis 1000 Läufern.
      </p>
      <p className="mt-3 rounded-xl border border-koder-orange/30 bg-koder-orange/10 px-3 py-2 text-sm">
        Liegt euer Logo auf der Sache, seid ihr dort noch einmal sichtbar, zusätzlich zur Stufe.
      </p>
      <ul className="mt-4 rounded-2xl border border-border bg-card px-4">
        {SACHSPENDEN_SICHTBAR.map((f) => (
          <SacheZeile key={f.id} flaeche={f} vergeben={vergeben.has(f.id)} />
        ))}
      </ul>
    </section>
  );
}

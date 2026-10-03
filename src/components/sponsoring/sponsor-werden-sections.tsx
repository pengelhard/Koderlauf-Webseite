"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import {
  getEffectiveStatus,
  isSachspendeFlaeche,
  SACHSPENDEN_SICHTBAR,
  SPONSOR_STUFEN,
  SPONSORING_2027,
  type SponsorFlaeche,
} from "@/lib/sponsoring-2027";

export function InfoButton({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border text-[11px] font-bold text-muted-foreground hover:border-koder-orange hover:text-koder-orange"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
      >
        i
      </button>
      {open && (
        <span
          role="note"
          className="absolute left-0 top-7 z-20 w-64 max-w-[min(16rem,calc(100vw-3rem))] rounded-xl border border-border bg-card p-3 text-left text-xs font-normal normal-case tracking-normal text-foreground shadow-lg"
        >
          {text}
        </span>
      )}
    </span>
  );
}

export function SponsorStufen() {
  return (
    <section className="mt-10" id="stufen">
      <h2 className="text-2xl font-extrabold tracking-tight">Drei Stufen</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {SPONSOR_STUFEN.map((stufe) => (
          <article
            key={stufe.id}
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
              <InfoButton label={`Info ${stufe.name}`} text={stufe.info} />
            </div>
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
        ))}
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        Unter 100 € nur der Name auf der Website.
        <InfoButton
          label="Info unter 100 Euro"
          text="Äpfel, Riegel oder ein kleiner Betrag. Kein Banner, kein Instagram."
        />
      </p>
    </section>
  );
}

function SacheZeile({ flaeche }: { flaeche: SponsorFlaeche }) {
  const status = getEffectiveStatus(flaeche);
  return (
    <li className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-border py-2.5 last:border-0">
      <span className="font-semibold">
        {flaeche.titel}
        {isSachspendeFlaeche(flaeche) && (
          <span className="ml-2 align-middle">
            <InfoButton label={`Info ${flaeche.titel}`} text={flaeche.beschreibung ?? ""} />
          </span>
        )}
      </span>
      <span className="text-sm text-muted-foreground">
        {flaeche.kurz}
        {status === "reserviert" ? " · im Gespräch" : status === "vergeben" ? " · vergeben" : ""}
      </span>
    </li>
  );
}

export function SponsorSachen() {
  return (
    <section id="sachen" className="mt-12 scroll-mt-28">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-2xl font-extrabold tracking-tight">Diese Sachen brauchen wir</h2>
        <InfoButton label="Info Sachspenden" text={SPONSORING_2027.zuordnungSatz} />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Kein Preis von uns. Unter 100 € Website · ab 100 € Banner und Instagram · ab 250 € größeres Logo · ab 500 € Hauptsponsor.
      </p>
      <ul className="mt-4 rounded-2xl border border-border bg-card px-4">
        {SACHSPENDEN_SICHTBAR.map((f) => (
          <SacheZeile key={f.id} flaeche={f} />
        ))}
      </ul>
    </section>
  );
}

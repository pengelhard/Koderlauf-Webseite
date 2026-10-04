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
  return (
    <p className="mt-2 whitespace-pre-line rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
      {text}
    </p>
  );
}

function LogoPlatte({
  size,
  name,
  hervor,
}: {
  size: "klein" | "mittel" | "gross";
  name: string;
  hervor?: boolean;
}) {
  const box =
    size === "gross" ? "h-16 w-16 text-xs" : size === "mittel" ? "h-11 w-11 text-[10px]" : "h-7 w-7 text-[8px]";
  return (
    <div
      className={`flex min-w-0 items-center gap-2 rounded-xl border p-2 ${
        hervor
          ? "border-koder-orange/50 bg-koder-orange/15 shadow-[0_0_24px_-12px] shadow-koder-orange"
          : "border-white/10 bg-white/5"
      } ${size === "gross" ? "p-3" : ""}`}
    >
      <div
        className={`flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-white to-zinc-200 font-black tracking-tight text-zinc-900 ${box}`}
      >
        Logo
      </div>
      <div className="min-w-0">
        <p className={`truncate font-bold leading-tight ${size === "gross" ? "text-sm" : "text-[11px]"}`}>{name}</p>
        <p className="truncate text-[9px] text-zinc-400">{size === "gross" ? "ganz oben" : "Name"}</p>
      </div>
    </div>
  );
}

function WebsiteMuster({ stufe }: { stufe: "unterstuetzer" | "sponsor" | "hauptsponsor" }) {
  const caption =
    stufe === "hauptsponsor"
      ? "Ganz oben, sehr präsent"
      : stufe === "sponsor"
        ? "Etwas größeres Logo"
        : "Kleines Logo, wie die weiteren Sponsoren";
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 text-zinc-100 shadow-inner">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-koder-orange" />
        <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-400">Sponsoren</span>
      </div>
      <div className="space-y-2 p-3">
        {stufe === "hauptsponsor" && (
          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-koder-orange">Hauptsponsoren</p>
            <div className="mt-1.5">
              <LogoPlatte size="gross" name="Eure Firma" hervor />
            </div>
          </div>
        )}
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {stufe === "hauptsponsor" ? "Weitere Sponsoren" : "Sponsoren"}
          </p>
          <div className="mt-1.5 grid gap-1.5">
            {stufe === "unterstuetzer" && <LogoPlatte size="klein" name="Eure Firma" hervor />}
            {stufe === "sponsor" && <LogoPlatte size="mittel" name="Eure Firma" hervor />}
            {stufe !== "unterstuetzer" && <LogoPlatte size="klein" name="Andere Firma" />}
          </div>
        </div>
      </div>
      <p className="border-t border-white/10 px-3 py-1.5 text-[10px] text-zinc-400">{caption}</p>
    </div>
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
      {stufe.id === "unterstuetzer" || stufe.id === "sponsor" || stufe.id === "hauptsponsor" ? (
        <WebsiteMuster stufe={stufe.id} />
      ) : null}
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
        Zur Orientierung: Wir rechnen mit etwa 600 bis 1000 Leute.
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

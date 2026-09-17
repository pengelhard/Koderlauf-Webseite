"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  BAND_LABEL,
  ctaFuerFlaeche,
  FLAECHEN_UI,
  getEffectiveStatus,
  getFlaeche,
  isFlaecheBuchbar,
  isSachspendeFlaeche,
  SPONSOR_ABLAUF,
  SPONSOR_FAQ,
  SPONSOR_PAKETE,
  SPONSORING_2027,
  STATUS_LABEL,
  TYP_LABEL,
  type FlaecheStatus,
  type SponsorFlaeche,
} from "@/lib/sponsoring-2027";

function StatusBadge({ status, mehrere }: { status: FlaecheStatus; mehrere?: boolean }) {
  const tone =
    status === "offen"
      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
      : status === "vergeben"
        ? "border-border bg-muted text-muted-foreground"
        : "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200";
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${tone}`}
    >
      {mehrere && status === "offen" ? "OFFEN · mehrere möglich" : STATUS_LABEL[status]}
    </span>
  );
}

function TypBadge({ flaeche }: { flaeche: SponsorFlaeche }) {
  const sach = isSachspendeFlaeche(flaeche);
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
        sach
          ? "border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-100"
          : "border-koder-orange/30 bg-koder-orange/10 text-koder-orange"
      }`}
    >
      {TYP_LABEL[flaeche.typ]}
    </span>
  );
}

export function SponsorPakete() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-extrabold tracking-tight">Die 3 Pakete</h2>
      <p className="mt-2 text-sm text-muted-foreground">{SPONSORING_2027.fairnessSatz}</p>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {SPONSOR_PAKETE.map((paket) => (
          <article
            key={paket.id}
            className={`flex flex-col rounded-2xl border p-5 ${
              paket.id === "hauptsponsor"
                ? "border-koder-orange/40 bg-gradient-to-br from-koder-orange/10 to-transparent"
                : "border-border bg-card"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-koder-orange">
              {paket.preisLabel}
            </p>
            <h3 className="mt-1 text-lg font-extrabold">{paket.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{paket.kurz}</p>
            <ul className="mt-3 flex-1 space-y-1.5 text-sm">
              {paket.leistungen.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-koder-orange" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href={paket.ctaHref}
              className="mt-4 inline-flex justify-center rounded-xl bg-koder-orange px-3 py-2 text-sm font-bold text-white hover:bg-koder-orange/90"
            >
              {paket.ctaLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function SachspendeKarte({ flaeche }: { flaeche: SponsorFlaeche }) {
  const status = getEffectiveStatus(flaeche);
  const cta = ctaFuerFlaeche(flaeche);
  const buchbar = isFlaecheBuchbar(flaeche.id);

  return (
    <article className="rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-bold">{flaeche.titel}</h3>
        <div className="flex flex-wrap gap-1.5">
          <TypBadge flaeche={flaeche} />
          <StatusBadge status={status} />
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-amber-900 dark:text-amber-100">
        Bitte die Sache stellen. Eine Überweisung ersetzt das nicht.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{flaeche.kurz}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {flaeche.festpreis} € Gegenwert · {BAND_LABEL[flaeche.vorgeschlagenesBand]}
      </p>
      <details className="group mt-2">
        <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-koder-orange hover:underline [&::-webkit-details-marker]:hidden">
          Details
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <p className="mt-2 text-xs text-muted-foreground">{flaeche.beschreibung}</p>
      </details>
      {buchbar ? (
        <Link href={cta.href} className="mt-3 inline-flex text-sm font-semibold text-koder-orange hover:underline">
          {cta.label}
        </Link>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">Aktuell nicht buchbar.</p>
      )}
    </article>
  );
}

function GruppenKarte({
  titel,
  zeile,
  slotIds,
}: {
  titel: string;
  zeile: string;
  slotIds: string[];
}) {
  const slots = slotIds.map((id) => getFlaeche(id)).filter(Boolean) as SponsorFlaeche[];
  const komplett = slots.find((s) => s.komplettHaelften);
  const status = komplett ? getEffectiveStatus(komplett) : "offen";

  return (
    <article className="rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-bold">{titel}</h3>
        <div className="flex gap-1.5">
          <TypBadge flaeche={slots[0]} />
          <StatusBadge status={status} />
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{zeile}</p>
      <details className="group mt-2">
        <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-koder-orange hover:underline [&::-webkit-details-marker]:hidden">
          Slots & Details
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <ul className="mt-2 space-y-2 text-sm">
          {slots.map((slot) => {
            const cta = ctaFuerFlaeche(slot);
            const buchbar = isFlaecheBuchbar(slot.id);
            return (
              <li key={slot.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2 first:border-0 first:pt-0">
                <span>
                  {slot.titel} · {slot.festpreis} €
                  {getEffectiveStatus(slot) !== "offen" ? ` (${STATUS_LABEL[getEffectiveStatus(slot)]})` : ""}
                </span>
                {buchbar ? (
                  <Link href={cta.href} className="text-xs font-semibold text-koder-orange hover:underline">
                    Anfragen
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
        {komplett?.hinweis && (
          <p className="mt-2 text-xs text-muted-foreground">{komplett.hinweis}</p>
        )}
      </details>
    </article>
  );
}

function KurzZeile({ id }: { id: string }) {
  const flaeche = getFlaeche(id);
  if (!flaeche) return null;
  const cta = ctaFuerFlaeche(flaeche);
  const buchbar = isFlaecheBuchbar(id);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-3 last:border-0">
      <div>
        <span className="font-semibold">{flaeche.titel}</span>
        <span className="text-muted-foreground"> · {flaeche.festpreis} € · {BAND_LABEL[flaeche.vorgeschlagenesBand]}</span>
        <span className="ml-2">
          <StatusBadge status={getEffectiveStatus(flaeche)} mehrere={flaeche.mehrereMoeglich} />
        </span>
      </div>
      {buchbar ? (
        <Link href={cta.href} className="text-sm font-semibold text-koder-orange hover:underline">
          Anfragen
        </Link>
      ) : null}
    </div>
  );
}

export function SponsorOffeneFlaechen() {
  const sachspenden = FLAECHEN_UI.sachspendeIds
    .map((id) => getFlaeche(id))
    .filter(Boolean) as SponsorFlaeche[];

  return (
    <section id="flaechen" className="mt-12 scroll-mt-28">
      <h2 className="text-2xl font-extrabold tracking-tight">Flächen</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Festpreise für 500 Starter. Sachspende = Sache stellen. Geld oder Sache = Verein kann einkaufen.
      </p>

      <h3 className="mt-8 text-sm font-bold uppercase tracking-widest text-koder-orange">
        Sachspende – bitte stellen
      </h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {sachspenden.map((f) => <SachspendeKarte key={f.id} flaeche={f} />)}
      </div>

      <h3 className="mt-8 text-sm font-bold uppercase tracking-widest text-koder-orange">
        Geld oder Sache
      </h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {FLAECHEN_UI.gruppen.map((g) => (
          <GruppenKarte key={g.id} titel={g.titel} zeile={g.zeile} slotIds={[...g.slotIds]} />
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-border bg-card px-4">
        {FLAECHEN_UI.kurzIds.map((id) => <KurzZeile key={id} id={id} />)}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        T-Shirts sind 2027 keine Sponsoring-Fläche.
      </p>
    </section>
  );
}

export function SponsorAblauf() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-extrabold tracking-tight">So läuft die Anfrage</h2>
      <ol className="mt-4 grid gap-3 sm:grid-cols-3">
        {SPONSOR_ABLAUF.map((s) => (
          <li key={s.schritt} className="rounded-2xl border border-border bg-card p-4">
            <span className="text-xl font-black text-koder-orange">{s.schritt}</span>
            <h3 className="mt-1 font-bold text-sm">{s.titel}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm text-muted-foreground">
        Rückmeldung von{" "}
        <a href={`mailto:${SPONSORING_2027.kontaktEmail}`} className="text-koder-orange hover:underline">
          {SPONSORING_2027.kontaktEmail}
        </a>
        . Keine Online-Zahlung.
      </p>
    </section>
  );
}

export function SponsorFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-extrabold tracking-tight">Häufige Fragen</h2>
      <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
        {SPONSOR_FAQ.map((item, i) => (
          <div key={item.frage}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold hover:bg-muted/30"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? null : i)}
            >
              {item.frage}
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            {open === i && (
              <p className="px-4 pb-3 text-sm text-muted-foreground">{item.antwort}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function SponsorHeroBilder() {
  const imgs = [
    { src: "/gallery-start-ziel.webp", alt: "Start und Ziel beim Koderlauf" },
    { src: "/gallery-strecke.webp", alt: "Strecke im Wald" },
    { src: "/gallery-aufbau.webp", alt: "Aufbau am Sportheim" },
  ];
  return (
    <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
      {imgs.map((img) => (
        <div key={img.src} className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-28">
          <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="112px" />
        </div>
      ))}
    </div>
  );
}

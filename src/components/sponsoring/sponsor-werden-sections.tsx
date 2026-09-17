"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Check, ChevronDown, Eye, Handshake, MapPin, Shield } from "lucide-react";
import {
  BAND_LABEL,
  BAND_VERGLEICH,
  ctaFuerFlaeche,
  SPONSOR_ABLAUF,
  SPONSOR_BANDER,
  SPONSOR_FALLBEISPIELE,
  SPONSOR_FAQ,
  SPONSOR_FLAECHEN,
  SPONSOR_SO_FUNKTIONIERT,
  SPONSORING_2027,
  STATUS_LABEL,
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

export function SponsorWarum() {
  const { premiere2026 } = SPONSORING_2027;
  const tiles = [
    {
      icon: Eye,
      title: "Sichtbarkeit vor Ort",
      text: "Zielbogen, Medaille, Strecke, Bauzaun – echte Flächen, nicht nur eine Liste.",
    },
    {
      icon: MapPin,
      title: "Dorf + Jubiläum",
      text: `Ortsteil ca. ${premiere2026.ortsteilEinwohner} Einwohner – 2027 feiern wir 50 Jahre SV Obermögersheim.`,
    },
    {
      icon: Shield,
      title: "Faire, öffentliche Flächen",
      text: "Pro Fläche eine Firma. Status OFFEN oder VERGEBEN – für alle sichtbar.",
    },
    {
      icon: Handshake,
      title: "Nennung & Fotos",
      text: "Nennung auf der Website, Fotos eurer Fläche und Danksagung – soweit der Verein das umsetzen kann.",
    },
  ];

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-extrabold tracking-tight">Warum mitmachen?</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {tiles.map((t) => (
          <article key={t.title} className="rounded-2xl border border-border bg-card p-5">
            <t.icon className="h-5 w-5 text-koder-orange" aria-hidden />
            <h3 className="mt-2 font-bold">{t.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
          </article>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Auch reines Geld zählt – gerade wenn die Flächen vergeben sind. 2026 haben über{" "}
        {premiere2026.anmeldungen} Menschen am Start gestanden, {premiere2026.finisher} sind ins Ziel
        gekommen –{" "}
        <Link href="/sponsoren" className="font-semibold text-koder-orange hover:underline">
          unsere Sponsoren 2026
        </Link>{" "}
        haben das möglich gemacht.
      </p>
    </section>
  );
}

export function SponsorSoFunktionierts() {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-extrabold tracking-tight">So funktioniert&apos;s</h2>
      <ol className="mt-6 grid gap-4 sm:grid-cols-3">
        {SPONSOR_SO_FUNKTIONIERT.map((s) => (
          <li key={s.schritt} className="rounded-2xl border border-border bg-card p-5">
            <span className="text-2xl font-black text-koder-orange">{s.schritt}</span>
            <h3 className="mt-2 font-bold">{s.titel}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        {SPONSORING_2027.fairnessSatz}
      </p>
    </section>
  );
}

export function SponsorBandVergleich() {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-extrabold tracking-tight">Die 3 Bänder</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Rang und Sichtbarkeitspaket – unabhängig von der Fläche.
      </p>

      <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-border md:block">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left">
              <th className="sticky left-0 z-10 bg-muted/95 px-4 py-3 font-semibold backdrop-blur-sm">
                Leistung
              </th>
              <th className="px-4 py-3 font-semibold">Partner 150 €</th>
              <th className="px-4 py-3 font-semibold">Förderer ca. 500 €</th>
              <th className="px-4 py-3 font-semibold">Hauptsponsor ab 800 €</th>
            </tr>
          </thead>
          <tbody>
            {BAND_VERGLEICH.map((row) => (
              <tr key={row.leistung} className="border-b border-border last:border-0">
                <td className="sticky left-0 z-10 bg-card px-4 py-2.5 font-medium">{row.leistung}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{row.partner}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{row.foerderer}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{row.hauptsponsor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-4 md:hidden">
        {(["partner", "foerderer", "hauptsponsor"] as const).map((band) => (
          <div key={band} className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-bold">
              {band === "partner"
                ? "Partner 150 €"
                : band === "foerderer"
                  ? "Förderer ca. 500 €"
                  : "Hauptsponsor ab 800 €"}
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {BAND_VERGLEICH.map((row) => (
                <li key={row.leistung}>
                  <span className="font-medium text-foreground">{row.leistung}:</span> {row[band]}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {SPONSOR_BANDER.map((band) => (
          <article
            key={band.id}
            className={`flex flex-col rounded-3xl border p-6 ${
              band.id === "hauptsponsor"
                ? "border-koder-orange/40 bg-gradient-to-br from-koder-orange/10 to-transparent"
                : "border-border bg-card"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-koder-orange">
              {band.preisLabel}
            </p>
            <h3 className="mt-2 text-xl font-extrabold">{band.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{band.kurz}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm">
              {band.leistungen.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-koder-orange" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">{band.flaecheHinweis}</p>
            <Link
              href={band.ctaHref}
              className="mt-5 inline-flex justify-center rounded-xl bg-koder-orange px-4 py-2.5 text-sm font-bold text-white hover:bg-koder-orange/90"
            >
              {band.ctaLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function FlaecheKarte({ flaeche }: { flaeche: SponsorFlaeche }) {
  const waehlbar = flaeche.status !== "vergeben" || flaeche.mehrereMoeglich;
  const cta = ctaFuerFlaeche(flaeche);
  const hasDetails =
    flaeche.aufteilbar || flaeche.hinweis || flaeche.beschreibung !== flaeche.kurz;

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold">{flaeche.titel}</h3>
        <StatusBadge status={flaeche.status} mehrere={flaeche.mehrereMoeglich} />
      </div>
      <span className="mt-2 inline-flex w-fit rounded-full border border-koder-orange/30 bg-koder-orange/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-koder-orange">
        {flaeche.badgeLabel}
      </span>
      <p className="mt-3 text-sm text-muted-foreground">{flaeche.kurz}</p>
      <p className="mt-2 text-sm">
        <span className="font-semibold">Werbung: </span>
        {flaeche.werbungKurz}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Richtwert: </span>
        {flaeche.richtkosten}
      </p>

      {hasDetails && (
        <details className="group mt-3">
          <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-koder-orange hover:underline [&::-webkit-details-marker]:hidden">
            Details
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <div className="mt-2 space-y-2 text-xs text-muted-foreground">
            {flaeche.aufteilbar && <p>Aufteilbar: {flaeche.aufteilbar}</p>}
            {flaeche.hinweis && <p>{flaeche.hinweis}</p>}
            <p>
              Typisches Band: {BAND_LABEL[flaeche.vorgeschlagenesBand]}. Wer die Sache stellt, zahlt nicht
              bar nach.
            </p>
          </div>
        </details>
      )}

      {waehlbar ? (
        <Link
          href={cta.href}
          className="mt-4 inline-flex text-sm font-semibold text-koder-orange hover:underline"
        >
          {cta.label}
        </Link>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Bereits vergeben.</p>
      )}
    </article>
  );
}

export function SponsorOffeneFlaechen() {
  return (
    <section id="flaechen" className="mt-16 scroll-mt-28">
      <h2 className="text-2xl font-extrabold tracking-tight">Offene Flächen</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Eine Firma pro Fläche (Ausnahme Restkosten-Topf). Status OFFEN oder VERGEBEN. Richtwert =
        Einkaufswert. Standard: Verein kauft und organisiert – ihr zahlt den Richtwert.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {SPONSOR_FLAECHEN.map((flaeche) => (
          <FlaecheKarte key={flaeche.id} flaeche={flaeche} />
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        T-Shirts sind 2027 keine Sponsoring-Fläche. Kleine Sachspenden sind willkommen – das Band richtet
        sich nach dem Gegenwert.
      </p>
    </section>
  );
}

export function SponsorDreiFaelle() {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-extrabold tracking-tight">Typische Situationen</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {SPONSOR_FALLBEISPIELE.map((fall) => (
          <article key={fall.titel} className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold leading-snug">{fall.titel}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{fall.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function SponsorAblauf() {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-extrabold tracking-tight">So läuft die Anfrage</h2>
      <ol className="mt-6 grid gap-4 sm:grid-cols-3">
        {SPONSOR_ABLAUF.map((s) => (
          <li key={s.schritt} className="rounded-2xl border border-border bg-card p-5">
            <span className="text-2xl font-black text-koder-orange">{s.schritt}</span>
            <h3 className="mt-2 font-bold">{s.titel}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-muted-foreground">
        Rückmeldung von{" "}
        <a href={`mailto:${SPONSORING_2027.kontaktEmail}`} className="text-koder-orange hover:underline">
          {SPONSORING_2027.kontaktEmail}
        </a>
        . Keine Online-Zahlung – der Verein schickt die Rechnung.
      </p>
    </section>
  );
}

export function SponsorFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-extrabold tracking-tight">Häufige Fragen</h2>
      <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
        {SPONSOR_FAQ.map((item, i) => (
          <div key={item.frage}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold hover:bg-muted/30"
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
              <p className="px-5 pb-4 text-sm text-muted-foreground">{item.antwort}</p>
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
    <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
      {imgs.map((img) => (
        <div key={img.src} className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-36">
          <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="144px" />
        </div>
      ))}
    </div>
  );
}

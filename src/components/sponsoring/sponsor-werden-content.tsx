"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Medal } from "lucide-react";
import { EVENT } from "@/lib/event-config";
import {
  KOSTENPARTNERSCHAFTEN,
  SPONSOR_STUFEN,
  SPONSORING_2027,
  STATUS_LABEL,
} from "@/lib/sponsoring-2027";
import { SponsorAnfrageFormular } from "@/components/sponsoring/anfrage-formular";

function StatusBadge({ status }: { status: keyof typeof STATUS_LABEL }) {
  const tone =
    status === "offen"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : status === "reserviert"
        ? "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200"
        : "border-border bg-muted text-muted-foreground";
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${tone}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function SponsorWerdenContent() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            Koderlauf {EVENT.jahr}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Sponsor 2027 werden
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {EVENT.datumKurz} am {EVENT.ortDetail}. Veranstalter: {EVENT.veranstalter}. Ihr finanziert
            einen konkreten Posten – Preis = reale Kosten. Zwei Stufen, klar und lokal.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {SPONSOR_STUFEN.map((stufe) => (
            <article
              key={stufe.id}
              className={`rounded-3xl border p-6 sm:p-8 ${
                stufe.id === "hauptsponsor"
                  ? "border-koder-orange/50 bg-gradient-to-br from-koder-orange/15 to-transparent"
                  : "border-border bg-card"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-koder-orange">
                {stufe.preisLabel}
              </p>
              <h2 className="mt-2 text-2xl font-extrabold">{stufe.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{stufe.kurz}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {stufe.leistungen.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-koder-orange" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={
                  stufe.id === "partner"
                    ? "/sponsor-werden?stufe=partner#anfrage"
                    : "/sponsor-werden?stufe=hauptsponsor#anfrage"
                }
                className="mt-6 inline-flex rounded-xl bg-koder-orange px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-white hover:bg-koder-orange/90"
              >
                {stufe.id === "partner" ? "Partner werden (150 €)" : "Hauptsponsor anfragen"}
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Posten unter ca. {SPONSORING_2027.soloSchwelleEuro} € sind kein Solo-Einstieg, sondern Add-on zum
          Partner oder Teil eines Bündels. Hauptsponsor: Einstieg ab {SPONSORING_2027.hauptsponsorAb} €,
          Gelddeckel {SPONSORING_2027.hauptsponsorDeckel.toLocaleString("de-DE")} € – wird der gewählte
          Posten teurer (z. B. viele Medaillen), zahlt der Verein den Rest. Keine Online-Zahlung; Abschluss
          ist eine Anfrage, Rechnung kommt vom Verein.
        </p>

        <h2 className="mt-16 text-2xl font-extrabold tracking-tight">Kostenpartnerschaften</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Hängen am Hauptsponsor. Ihr wählt einen Posten, tragt die realen Kosten (Stück × Menge oder
          Pauschale) und bekommt Werbung genau dort – plus Partner-Leistungen, Startnummer-Logo und{" "}
          {SPONSORING_2027.ticketsHauptsponsor} Tickets.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {KOSTENPARTNERSCHAFTEN.map((posten) => {
            const waehlbar = posten.status !== "vergeben";
            return (
              <article key={posten.id} className="flex flex-col rounded-3xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold">{posten.titel}</h3>
                  <StatusBadge status={posten.status} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{posten.beschreibung}</p>
                <p className="mt-3 text-sm">
                  <span className="font-semibold">Werbung: </span>
                  {posten.werbung}
                </p>
                <p className="mt-2 text-sm">
                  <span className="font-semibold">Richtkosten: </span>
                  {posten.richtkosten}
                </p>
                {posten.aufteilbar && (
                  <p className="mt-2 text-sm text-muted-foreground">Aufteilbar: {posten.aufteilbar}</p>
                )}
                {posten.hinweis && (
                  <p className="mt-2 text-xs text-muted-foreground">{posten.hinweis}</p>
                )}
                {waehlbar ? (
                  <Link
                    href={`/sponsor-werden?stufe=hauptsponsor&posten=${posten.id}#anfrage`}
                    className="mt-4 inline-flex text-sm font-semibold text-koder-orange hover:underline"
                  >
                    Als Hauptsponsor wählen
                  </Link>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">Nicht mehr verfügbar.</p>
                )}
              </article>
            );
          })}
        </div>

        <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
          <Medal className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          T-Shirts sind 2027 keine Kostenpartnerschaft – frühestens 2028.
        </p>

        <section id="anfrage" className="mt-16 scroll-mt-28">
          <h2 className="text-2xl font-extrabold tracking-tight">Anfrage abschließen</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Kein Checkout. Wir bekommen die Anfrage per Mail und melden uns.
          </p>
          <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
            <SponsorAnfrageFormular />
          </div>
        </section>
      </div>
    </div>
  );
}

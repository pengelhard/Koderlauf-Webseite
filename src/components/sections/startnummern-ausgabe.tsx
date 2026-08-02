"use client";

import { CalendarClock, Shirt } from "lucide-react";
import { EVENT } from "@/lib/event-config";

/** Übersichtliche Empfehlung: Startnummern & T-Shirts Do/Fr abholen. */
export function StartnummernAusgabe({ className = "" }: { className?: string }) {
  const { startnummernAusgabe: a } = EVENT;

  return (
    <div className={`rounded-3xl border border-forest-light/30 bg-forest-light/5 p-5 sm:p-6 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-light/15 text-forest-light">
          <CalendarClock className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-extrabold sm:text-lg">Startnummern &amp; T-Shirts abholen</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {a.hinweis}
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {a.termine.map((t) => (
              <div
                key={t.datum}
                className="rounded-2xl border border-border bg-card px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-koder-orange">
                  {t.tag}
                </p>
                <p className="mt-0.5 font-bold">{t.datum}</p>
                <p className="text-sm text-muted-foreground">{t.zeit}</p>
              </div>
            ))}
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            Am Eventtag zusätzlich: <strong className="text-foreground">{a.eventtag}</strong>
          </p>
          <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
            <Shirt size={16} className="mt-0.5 shrink-0 text-koder-orange" aria-hidden />
            <span>
              Bestellte T-Shirts werden ebenfalls an diesen Terminen ausgegeben.
              Der Timing-Chip ist an der Startnummer befestigt.
            </span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{a.ort}</p>
        </div>
      </div>
    </div>
  );
}

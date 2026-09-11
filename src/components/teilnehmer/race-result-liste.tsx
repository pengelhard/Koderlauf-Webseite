"use client";

import { useEffect, useRef, useState } from "react";
import { RACE_RESULT } from "@/lib/race-result";
import { cn } from "@/lib/utils";

type RrPublishInstance = {
  ShowTimerLogo: boolean;
  ShowInfoText: boolean;
};

type RrPublishCtor = new (
  el: HTMLElement | null,
  eventId: string,
  tab: string,
) => RrPublishInstance;

declare global {
  interface Window {
    RRPublish?: RrPublishCtor;
  }
}

/** Race-Result-Teilnehmerliste – RRPublish-Embed wie auf my.raceresult.com. */
export function RaceResultTeilnehmerListe({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const box = document.createElement("div");
    box.id = "divRRPublish";
    box.className = "RRPublish";
    host.appendChild(box);

    const script = document.createElement("script");
    script.src = RACE_RESULT.publish.script;
    script.async = false;

    script.onload = () => {
      try {
        const Ctor = window.RRPublish;
        if (!Ctor) {
          throw new Error("RRPublish nicht geladen");
        }
        const rrp = new Ctor(
          box,
          RACE_RESULT.eventId,
          RACE_RESULT.publish.teilnehmerTab,
        );
        rrp.ShowTimerLogo = true;
        rrp.ShowInfoText = true;
        setReady(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Liste konnte nicht geladen werden");
      }
    };
    script.onerror = () => {
      setError("Race-Result-Skript konnte nicht geladen werden");
    };

    document.body.appendChild(script);
    const fallback = window.setTimeout(() => setReady(true), 10000);

    return () => {
      window.clearTimeout(fallback);
      script.remove();
      box.remove();
    };
  }, []);

  return (
    <div
      className={cn(
        "relative min-h-[240px] overflow-hidden rounded-2xl border border-border bg-white text-neutral-900",
        className,
      )}
    >
      {!ready && !error && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/95 p-8"
          aria-live="polite"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-koder-orange border-t-transparent" />
          <p className="text-sm text-neutral-500">Teilnehmerliste wird geladen…</p>
        </div>
      )}
      {error && <p className="p-6 text-sm text-red-600">{error}</p>}
      <div ref={hostRef} className="min-h-[200px] p-2 sm:p-3" />
    </div>
  );
}

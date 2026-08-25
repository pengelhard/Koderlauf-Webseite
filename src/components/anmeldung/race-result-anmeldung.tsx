"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  RACE_RESULT,
  getRaceResultForm,
  type RaceResultFormId,
} from "@/lib/race-result";

/** Dark-Theme-Overrides für Race-Result-Formular (im IFrame). */
const EMBED_THEME_CSS = `
  html, body {
    margin: 0;
    padding: 0;
    background: #0A0A0A;
    color: #E5E7EB;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  .RRReg_divLoading {
    color: #A3A3A3 !important;
    padding: 2rem !important;
    text-align: center !important;
  }
  .RRReg {
    background: #0A0A0A !important;
    color: #E5E7EB !important;
    max-width: 100% !important;
  }
  .RRReg, .RRReg * {
    box-sizing: border-box;
  }
  .RRReg a { color: #FF6B00 !important; }
  .RRReg input,
  .RRReg select,
  .RRReg textarea {
    background: #141414 !important;
    color: #E5E7EB !important;
    border: 1px solid #2A2A2A !important;
    border-radius: 0.75rem !important;
    padding: 0.65rem 0.85rem !important;
  }
  .RRReg input:focus,
  .RRReg select:focus,
  .RRReg textarea:focus {
    outline: 2px solid #FF6B00 !important;
    outline-offset: 1px !important;
    border-color: #FF6B00 !important;
  }
  .RRReg label,
  .RRReg .RRLabel,
  .RRReg td,
  .RRReg th,
  .RRReg span,
  .RRReg div {
    color: #E5E7EB;
  }
  .RRReg button,
  .RRReg input[type="button"],
  .RRReg input[type="submit"],
  .RRReg .RRButton,
  .RRReg .rr-button {
    background: #FF6B00 !important;
    color: #fff !important;
    border: none !important;
    border-radius: 0.75rem !important;
    font-weight: 700 !important;
    padding: 0.7rem 1.25rem !important;
    cursor: pointer !important;
  }
  .RRReg button:hover,
  .RRReg input[type="button"]:hover,
  .RRReg input[type="submit"]:hover {
    background: #FF9F1C !important;
  }
  .RRReg table { width: 100% !important; }
  .RRReg [style*="background"],
  .RRReg [bgcolor] {
    background-color: transparent !important;
  }
`;

function buildEmbedSrcDoc(formId: RaceResultFormId): string {
  const form = getRaceResultForm(formId);
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href=${JSON.stringify(RACE_RESULT.server)} crossorigin />
  <link rel="dns-prefetch" href=${JSON.stringify(RACE_RESULT.server)} />
  <style>${EMBED_THEME_CSS}</style>
</head>
<body>
  <script type="text/javascript">
    var RRReg_eventid=${JSON.stringify(RACE_RESULT.eventId)};
    var RRReg_name=${JSON.stringify(form.name)};
    var RRReg_key=${JSON.stringify(form.key)};
    var RRReg_server=${JSON.stringify(RACE_RESULT.server)};
  </script>
  <script type="text/javascript" src=${JSON.stringify(RACE_RESULT.initScript)}></script>
</body>
</html>`;
}

/**
 * Bindet das Race-Result-Anmeldeformular ein (Einzel- oder Sammelanmeldung).
 */
export function RaceResultAnmeldung({ className = "" }: { className?: string }) {
  const [formId, setFormId] = useState<RaceResultFormId>("einzeln");
  const [iframeReady, setIframeReady] = useState(false);
  const srcDoc = useMemo(() => buildEmbedSrcDoc(formId), [formId]);

  useEffect(() => {
    setIframeReady(false);
  }, [formId]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = RACE_RESULT.server;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
    const dns = document.createElement("link");
    dns.rel = "dns-prefetch";
    dns.href = RACE_RESULT.server;
    document.head.appendChild(dns);
    return () => {
      link.remove();
      dns.remove();
    };
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Anmeldeart wählen"
      >
        {RACE_RESULT.forms.map((f) => {
          const active = f.id === formId;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFormId(f.id)}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
                active
                  ? "border-koder-orange bg-koder-orange text-white"
                  : "border-border bg-card text-foreground hover:border-koder-orange/40",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Die Anmeldung und Zahlung laufen über Race Result / RaceSolution. Personenbezogene
        Daten werden dort verarbeitet.
      </p>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-[#0A0A0A]">
        {!iframeReady && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0A0A0A] p-8"
            aria-live="polite"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-koder-orange border-t-transparent" />
            <p className="text-sm text-muted-foreground">Anmeldeformular wird geladen…</p>
            <p className="max-w-sm text-center text-xs text-muted-foreground/80">
              Das Formular kommt von Race Result – der erste Aufruf kann ein paar Sekunden dauern.
            </p>
          </div>
        )}
        <iframe
          key={formId}
          title={getRaceResultForm(formId).label}
          srcDoc={srcDoc}
          className={cn(
            "h-[min(90vh,1100px)] w-full bg-[#0A0A0A] transition-opacity duration-300",
            iframeReady ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setIframeReady(true)}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

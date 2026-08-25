"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  RACE_RESULT,
  getRaceResultForm,
  type RaceResultFormId,
} from "@/lib/race-result";

function buildEmbedSrcDoc(formId: RaceResultFormId): string {
  const form = getRaceResultForm(formId);
  // IFrame-Dokument: Scripts laufen zuverlässig (currentScript / Reihenfolge).
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    html, body { margin: 0; padding: 0; background: transparent; }
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
  </style>
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
  const srcDoc = useMemo(() => buildEmbedSrcDoc(formId), [formId]);

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

      <iframe
        key={formId}
        title={getRaceResultForm(formId).label}
        srcDoc={srcDoc}
        className="race-result-embed h-[min(90vh,1100px)] w-full rounded-2xl border border-border bg-card"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

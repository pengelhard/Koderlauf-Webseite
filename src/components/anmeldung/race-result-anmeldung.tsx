"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  RACE_RESULT,
  getRaceResultForm,
  type RaceResultFormId,
} from "@/lib/race-result";

/**
 * Überschreibt Race-Result-Design-Tokens und Komponenten.
 * Wird NACH registration.css eingefügt, damit es gewinnt.
 */
const EMBED_THEME_CSS = `
:root {
  --navigation-background: #FF6B00 !important;
  --navigation-selected: rgba(0, 0, 0, 0.22) !important;
  --navigation-text: #ffffff !important;
  --button: #FF6B00 !important;
  --button-text: #ffffff !important;
  --button-disabled: #3f3f46 !important;
  --mandatory-border: #FF9F1C !important;
}

html, body {
  margin: 0 !important;
  padding: 0 !important;
  background: #0A0A0A !important;
  color: #E5E7EB !important;
}

.RRReg_divLoading,
.lds-ring {
  filter: none;
}
.RRReg_divLoading {
  color: #A3A3A3 !important;
  padding: 2.5rem 1rem !important;
  text-align: center !important;
  background: #0A0A0A !important;
}
.lds-ring div {
  border-color: #FF6B00 transparent transparent transparent !important;
}

.RRReg {
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif !important;
  color: #E5E7EB !important;
  background: #0A0A0A !important;
}

.RRReg .RRReg_Nav {
  background-color: #FF6B00 !important;
  border-radius: 0.75rem 0.75rem 0 0 !important;
}

.RRReg .RRReg_Main {
  max-width: 100% !important;
  margin: 0 !important;
  padding: 1.25rem !important;
  background-color: #141414 !important;
  color: #E5E7EB !important;
  border-radius: 0 0 1rem 1rem !important;
}

.RRReg .RRReg_Text,
.RRReg .RRReg_HTML,
.RRReg .RRReg_Expression,
.RRReg p,
.RRReg h1,
.RRReg h2,
.RRReg h3,
.RRReg td,
.RRReg th {
  color: #E5E7EB !important;
}

.RRReg a {
  color: #FF6B00 !important;
}

.RRReg div.RRReg_Box {
  border: 1px solid #2A2A2A !important;
  background-color: #0A0A0A !important;
  border-radius: 0.75rem !important;
}

.RRReg div.RRReg_EntryField {
  background-color: transparent !important;
}

.RRReg div.RRReg_EntryField > * ~ label {
  background-color: #141414 !important;
  color: #A3A3A3 !important;
}

.RRReg div.RRReg_EntryField > label:first-child {
  border: 1px solid #2A2A2A !important;
  background-color: #0A0A0A !important;
  color: #E5E7EB !important;
  border-radius: 0.75rem !important;
}

.RRReg div.RRReg_EntryField > label:first-child:not(.disabled):hover {
  border-color: #FF6B00 !important;
}

.RRReg div.RRReg_EntryField > label.disabled:first-child {
  background-color: #1a1a1a !important;
  color: #737373 !important;
}

.RRReg div.RRReg_EntryField .RRReg_FileField,
.RRReg div.RRReg_EntryField .RRReg_RadioGroup,
.RRReg div.RRReg_EntryField .RRReg_SignatureField,
.RRReg div.RRReg_EntryField input[type="password"],
.RRReg div.RRReg_EntryField input[type="text"],
.RRReg div.RRReg_EntryField select,
.RRReg div.RRReg_EntryField textarea {
  border: 1px solid #2A2A2A !important;
  border-radius: 0.75rem !important;
  background-color: #0A0A0A !important;
  color: #E5E7EB !important;
}

.RRReg div.RRReg_EntryField input:disabled,
.RRReg div.RRReg_EntryField select:disabled,
.RRReg div.RRReg_EntryField textarea:disabled {
  background-color: #1a1a1a !important;
  color: #737373 !important;
}

.RRReg div.RRReg_EntryField input[type="password"]:not(:disabled):hover,
.RRReg div.RRReg_EntryField input[type="text"]:not(:disabled):hover,
.RRReg div.RRReg_EntryField select:not(:disabled):hover,
.RRReg div.RRReg_EntryField textarea:not(:disabled):hover {
  border-color: #525252 !important;
}

.RRReg div.RRReg_EntryField > input[type="password"]:not(:disabled):focus,
.RRReg div.RRReg_EntryField > input[type="text"]:not(:disabled):focus,
.RRReg div.RRReg_EntryField > select:not(:disabled):focus,
.RRReg div.RRReg_EntryField > textarea:not(:disabled):focus {
  border-color: #FF6B00 !important;
  outline: 1px solid #FF6B00 !important;
}

.RRReg div.RRReg_EntryField > input[type="password"]:focus + label,
.RRReg div.RRReg_EntryField > input[type="text"]:focus + label,
.RRReg div.RRReg_EntryField > select:focus + label,
.RRReg div.RRReg_EntryField > textarea:focus + label {
  color: #FF6B00 !important;
}

.RRReg div.RRReg_EntryField .RRReg_RadioGroup.RRReg_RadioGroupTile > label {
  background-color: #0A0A0A !important;
  border-color: #2A2A2A !important;
  color: #E5E7EB !important;
}

.RRReg div.RRReg_EntryField .RRReg_RadioGroup.RRReg_RadioGroupTile > label.selected {
  background-color: #FF6B00 !important;
  color: #fff !important;
}

.RRReg div.RRReg_Tab > div.RRReg_TabsList > div {
  background-color: #1a1a1a !important;
  border-color: #2A2A2A !important;
  color: #E5E7EB !important;
}

.RRReg div.RRReg_Tab > div.RRReg_TabsList > div.selected,
.RRReg div.RRReg_Tab > div.RRReg_TabsList > div.selected + div.RRReg_TabsList_RemoveTab {
  background-color: #141414 !important;
  border-bottom-color: #141414 !important;
}

.RRReg .RRReg_EntryFees > table thead td {
  background-color: #1a1a1a !important;
  border-bottom-color: #2A2A2A !important;
  color: #A3A3A3 !important;
}

.RRReg .RRReg_EntryFees > table tbody.RRReg_EntryFees_Sum td {
  border-top-color: #2A2A2A !important;
}

.RRReg .RRReg_PaymentSelector div.RRReg_PaymentMethod {
  border-color: #2A2A2A !important;
  background-color: #0A0A0A !important;
}

.RRReg .RRReg_PaymentSelector div.RRReg_PaymentMethod:hover {
  background-color: #1a1a1a !important;
}

.RRReg .RRReg_Confirmation .RRReg_Confirmation_PaymentDetails {
  background-color: #1a1a1a !important;
}

.RRReg .RRReg_Confirmation .RRReg_Confirmation_PaymentDetails > .RRReg_Confirmation_PaymentDetails_Inner > div {
  background-color: #0A0A0A !important;
}

.RRReg .RRReg_Confirmation .RRReg_Confirmation_StartOver {
  color: #FF6B00 !important;
}

.RRReg button {
  background-color: #FF6B00 !important;
  color: #ffffff !important;
  border-radius: 0.75rem !important;
  font-weight: 700 !important;
  min-height: 48px !important;
}

.RRReg button:focus,
.RRReg button:hover {
  filter: brightness(1.08);
  background-color: #FF9F1C !important;
}

.RRReg button.RRReg_ButtonBack {
  background-color: #2A2A2A !important;
  color: #E5E7EB !important;
}

.RRReg button.RRReg_ButtonBack:focus,
.RRReg button.RRReg_ButtonBack:hover {
  background-color: #3f3f46 !important;
}

.RRReg button:disabled {
  background-color: #3f3f46 !important;
  color: #a1a1aa !important;
}

.RRReg .RRReg_BorderBottom {
  border-bottom-color: #2A2A2A !important;
}

.RRReg .RRReg_FatalError_Custom {
  color: #E5E7EB !important;
}
`;

function buildEmbedSrcDoc(formId: RaceResultFormId): string {
  const form = getRaceResultForm(formId);
  // Theme-CSS nach RR-Stylesheets injizieren (sonst gewinnen deren :root-Variablen).
  const injectScript = `
    (function () {
      var css = ${JSON.stringify(EMBED_THEME_CSS)};
      function applyTheme() {
        var existing = document.getElementById("koder-rr-theme");
        if (existing) existing.remove();
        var style = document.createElement("style");
        style.id = "koder-rr-theme";
        style.textContent = css;
        document.head.appendChild(style);
      }
      applyTheme();
      var tries = 0;
      var timer = setInterval(function () {
        tries += 1;
        applyTheme();
        if (document.querySelector(".RRReg") || tries > 40) clearInterval(timer);
      }, 250);
    })();
  `;

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href=${JSON.stringify(RACE_RESULT.server)} crossorigin />
  <style>html,body{margin:0;padding:0;background:#0A0A0A;color:#E5E7EB}</style>
</head>
<body>
  <script type="text/javascript">
    var RRReg_eventid=${JSON.stringify(RACE_RESULT.eventId)};
    var RRReg_name=${JSON.stringify(form.name)};
    var RRReg_key=${JSON.stringify(form.key)};
    var RRReg_server=${JSON.stringify(RACE_RESULT.server)};
  </script>
  <script type="text/javascript" src=${JSON.stringify(RACE_RESULT.initScript)}></script>
  <script type="text/javascript">${injectScript}</script>
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
          onLoad={() => {
            // Formular-Scripts brauchen etwas länger als das leere IFrame-Dokument
            window.setTimeout(() => setIframeReady(true), 600);
          }}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

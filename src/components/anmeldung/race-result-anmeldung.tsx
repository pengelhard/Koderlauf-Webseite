"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, User, Users } from "lucide-react";
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

/* Scrollbar im Koderlauf-Stil */
html {
  scrollbar-width: thin;
  scrollbar-color: #FF6B00 #1a1a1a;
}
*::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
*::-webkit-scrollbar-track {
  background: #1a1a1a;
  border-radius: 9999px;
}
*::-webkit-scrollbar-thumb {
  background: #FF6B00;
  border-radius: 9999px;
  border: 2px solid #1a1a1a;
}
*::-webkit-scrollbar-thumb:hover {
  background: #FF9F1C;
}
.RRReg .RRReg_Nav {
  scrollbar-width: thin;
  scrollbar-color: #ffffff66 transparent;
}
.RRReg .RRReg_Nav::-webkit-scrollbar {
  height: 6px;
}
.RRReg .RRReg_Nav::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.45);
  border: none;
}
`;

function buildEmbedSrcDoc(formId: RaceResultFormId): string {
  const form = getRaceResultForm(formId);
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

const FORM_ICONS = {
  einzeln: User,
  sammel: Users,
} as const;

function isFormId(value: string | null): value is RaceResultFormId {
  return value === "einzeln" || value === "sammel";
}

/**
 * Bindet das Race-Result-Anmeldeformular ein.
 * Schritt 1: Anmeldeart · Schritt 2: Formular (erst nach Klick).
 */
export function RaceResultAnmeldung({ className = "" }: { className?: string }) {
  const [formId, setFormId] = useState<RaceResultFormId | null>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const srcDoc = useMemo(
    () => (formId ? buildEmbedSrcDoc(formId) : ""),
    [formId],
  );

  // Deep-Link / Refresh: ?typ=einzeln|sammel
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const typ = params.get("typ");
    if (isFormId(typ)) setFormId(typ);
  }, []);

  useEffect(() => {
    setIframeReady(false);
  }, [formId]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (formId) url.searchParams.set("typ", formId);
    else url.searchParams.delete("typ");
    window.history.replaceState({}, "", url.pathname + url.search + url.hash);
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

  function selectForm(id: RaceResultFormId) {
    setFormId(id);
    requestAnimationFrame(() => {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (!formId) {
    return (
      <div ref={rootRef} className={cn("space-y-6", className)}>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-koder-orange text-[11px] text-white">
            1
          </span>
          Anmeldeart wählen
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {RACE_RESULT.forms.map((f) => {
            const Icon = FORM_ICONS[f.id];
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => selectForm(f.id)}
                className="group flex flex-col rounded-3xl border border-border bg-card p-6 text-left transition-all duration-200 hover:border-koder-orange/55 hover:bg-koder-orange/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-koder-orange"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-koder-orange/15 text-koder-orange transition-colors group-hover:bg-koder-orange group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="mt-5 text-xl font-extrabold tracking-tight text-foreground">
                  {f.label}
                </span>
                <span className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </span>
                <span className="mt-5 text-sm font-semibold text-koder-orange transition-transform group-hover:translate-x-0.5">
                  Weiter →
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          Sichere Abwicklung über Race Result / RaceSolution – Zahlung und Bestätigung
          direkt im Formular.
        </p>
      </div>
    );
  }

  const activeForm = getRaceResultForm(formId);
  const otherForm = RACE_RESULT.forms.find((f) => f.id !== formId)!;

  return (
    <div ref={rootRef} className={cn("space-y-4 scroll-mt-28", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-koder-orange text-[11px] text-white">
              2
            </span>
            Formular
          </div>
          <h3 className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">
            {activeForm.label}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFormId(null)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-koder-orange/40 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Zur Auswahl
          </button>
          <button
            type="button"
            onClick={() => selectForm(otherForm.id)}
            className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-koder-orange/40"
          >
            Zu {otherForm.label}
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Anmeldung und Zahlung laufen über Race Result / RaceSolution.
      </p>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-[#0A0A0A]">
        {!iframeReady && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0A0A0A] p-8"
            aria-live="polite"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-koder-orange border-t-transparent" />
            <p className="text-sm text-muted-foreground">Formular wird geladen…</p>
          </div>
        )}
        <iframe
          key={formId}
          title={activeForm.label}
          srcDoc={srcDoc}
          className={cn(
            "h-[min(90vh,1100px)] w-full bg-[#0A0A0A] transition-opacity duration-300",
            iframeReady ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => {
            window.setTimeout(() => setIframeReady(true), 600);
          }}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

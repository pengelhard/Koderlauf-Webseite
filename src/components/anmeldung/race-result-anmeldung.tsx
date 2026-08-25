"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, User, Users } from "lucide-react";
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

const COMPLETE_MESSAGE = { source: "koder-rr", type: "complete" } as const;
const SUCCESS_STORAGE_KEY = "koder-anmeldung-ok";

function markAnmeldungErfolgreich() {
  try {
    sessionStorage.setItem(SUCCESS_STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

function consumeAnmeldungErfolgreich(): boolean {
  try {
    if (sessionStorage.getItem(SUCCESS_STORAGE_KEY) !== "1") return false;
    sessionStorage.removeItem(SUCCESS_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/** Kleines Erfolgsbanner nach abgeschlossener Anmeldung. */
function AnmeldungErfolgBanner({
  onDismiss,
  className,
}: {
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-koder-orange/45 bg-koder-orange/15 px-4 py-3 shadow-sm shadow-koder-orange/10",
        className,
      )}
      role="status"
    >
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-koder-orange" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground">Anmeldung erfolgreich</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Du bist angemeldet. Die Bestätigung kommt per E-Mail.
        </p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          Schließen
        </button>
      )}
    </div>
  );
}

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

      var done = false;
      var sawOpenForm = false;
      function isVisible(el) {
        if (!el) return false;
        var style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) {
          return false;
        }
        var rect = el.getBoundingClientRect();
        return rect.width > 8 && rect.height > 8;
      }
      function notifyComplete() {
        if (done) return;
        var conf = document.querySelector(".RRReg_Confirmation");
        var main = document.querySelector(".RRReg_Main") || document.querySelector(".RRReg");
        var confVisible = isVisible(conf);
        var details =
          document.querySelector(".RRReg_Confirmation_PaymentDetails") ||
          document.querySelector(".RRReg_Confirmation_StartOver");
        var hasText = !!(conf && (conf.innerText || "").trim().length > 30);
        var confLooksComplete = confVisible && (isVisible(details) || hasText);
        // Erst normales Formular ohne echte Bestätigung gesehen haben
        if (main && !confLooksComplete) sawOpenForm = true;
        if (!sawOpenForm || !confLooksComplete) return;
        done = true;
        try {
          parent.postMessage(${JSON.stringify(COMPLETE_MESSAGE)}, "*");
        } catch (e) {}
      }
      setInterval(notifyComplete, 600);
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

const FORM_HREF: Record<RaceResultFormId, string> = {
  einzeln: "/anmeldung/einzeln",
  sammel: "/anmeldung/sammel",
};

/** Orangene Auswahlkarten auf /anmeldung → eigene Formular-Seiten. */
export function AnmeldungAuswahl({ className = "" }: { className?: string }) {
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("ok") === "1";
    const fromStorage = consumeAnmeldungErfolgreich();
    if (!fromQuery && !fromStorage) return;
    setJustCompleted(true);
    if (fromQuery) {
      const url = new URL(window.location.href);
      url.searchParams.delete("ok");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }
  }, []);

  useEffect(() => {
    if (!justCompleted) return;
    const t = window.setTimeout(() => setJustCompleted(false), 12000);
    return () => window.clearTimeout(t);
  }, [justCompleted]);

  return (
    <div className={cn("space-y-4", className)}>
      {justCompleted && (
        <AnmeldungErfolgBanner onDismiss={() => setJustCompleted(false)} />
      )}

      <div className="grid gap-3 sm:grid-cols-2 sm:max-w-xl">
        {RACE_RESULT.forms.map((f) => {
          const Icon = FORM_ICONS[f.id];
          return (
            <Link
              key={f.id}
              href={FORM_HREF[f.id]}
              className="group flex items-center gap-3 rounded-2xl border border-koder-orange/50 bg-koder-orange px-4 py-3.5 text-left text-white shadow-md shadow-koder-orange/15 transition-all duration-200 hover:bg-[#FF9F1C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-base font-extrabold tracking-tight">{f.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/** Nur Formular – eigene Seite für Einzel- oder Sammelanmeldung. */
export function RaceResultFormular({
  formId,
  className = "",
}: {
  formId: RaceResultFormId;
  className?: string;
}) {
  const router = useRouter();
  const [iframeReady, setIframeReady] = useState(false);
  const [completed, setCompleted] = useState(false);
  const srcDoc = useMemo(() => buildEmbedSrcDoc(formId), [formId]);
  const activeForm = getRaceResultForm(formId);

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

  useEffect(() => {
    let redirectTimer = 0;
    function onMessage(event: MessageEvent) {
      // Nur Nachrichten aus unserem Embed-iframe (srcDoc = same origin)
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (
        data &&
        typeof data === "object" &&
        data.source === COMPLETE_MESSAGE.source &&
        data.type === COMPLETE_MESSAGE.type
      ) {
        markAnmeldungErfolgreich();
        setCompleted(true);
        window.clearTimeout(redirectTimer);
        // Kurz Bestätigung zeigen, dann zurück zur Auswahl mit Banner
        redirectTimer = window.setTimeout(() => {
          router.push("/anmeldung?ok=1");
        }, 2200);
      }
    }
    window.addEventListener("message", onMessage);
    return () => {
      window.clearTimeout(redirectTimer);
      window.removeEventListener("message", onMessage);
    };
  }, [router]);

  return (
    <div className={cn("space-y-4", className)}>
      {completed && <AnmeldungErfolgBanner />}

      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {activeForm.label}
        </h1>
        <Link
          href={completed ? "/anmeldung?ok=1" : "/anmeldung"}
          onClick={() => {
            if (completed) markAnmeldungErfolgreich();
          }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-koder-orange/40 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Zurück
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-[#0A0A0A]">
        {!iframeReady && !completed && (
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
            "h-[min(92vh,1200px)] w-full bg-[#0A0A0A] transition-opacity duration-300",
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

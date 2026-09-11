"use client";

import { useEffect, useMemo, useState } from "react";
import { RACE_RESULT } from "@/lib/race-result";
import { cn } from "@/lib/utils";

const HEIGHT_MESSAGE = {
  source: "koderlauf-rr-publish",
  type: "height",
} as const;

function buildTeilnehmerSrcDoc(): string {
  const { eventId, publish } = RACE_RESULT;
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="${publish.origin}" crossorigin />
  <style>
    html, body { margin: 0; padding: 0; background: #ffffff; color: #171717; }
    .RRPublish { min-height: 200px; }
    :root { --brandColorDark: #FF6B00; }
  </style>
</head>
<body>
  <div id="divRRPublish" class="RRPublish"></div>
  <script type="text/javascript" src="${publish.script}"></script>
  <script type="text/javascript">
    var rrp = new RRPublish(document.getElementById("divRRPublish"), ${JSON.stringify(eventId)}, ${JSON.stringify(publish.teilnehmerTab)});
    rrp.ShowTimerLogo = true;
    rrp.ShowInfoText = true;
    function sendHeight() {
      var el = document.getElementById("divRRPublish");
      var h = Math.max(
        (el && el.scrollHeight) || 0,
        document.documentElement.scrollHeight || 0,
        document.body.scrollHeight || 0,
        280
      );
      try {
        parent.postMessage({ source: ${JSON.stringify(HEIGHT_MESSAGE.source)}, type: ${JSON.stringify(HEIGHT_MESSAGE.type)}, height: h }, "*");
      } catch (e) {}
    }
    setInterval(sendHeight, 800);
    window.addEventListener("load", sendHeight);
  </script>
</body>
</html>`;
}

/** Race-Result-Teilnehmerliste – gleicher Embed-Typ wie auf my.raceresult.com (RRPublish). */
export function RaceResultTeilnehmerListe({ className = "" }: { className?: string }) {
  const srcDoc = useMemo(() => buildTeilnehmerSrcDoc(), []);
  const [ready, setReady] = useState(false);
  const [height, setHeight] = useState(480);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = RACE_RESULT.publish.origin;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, []);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (
        data &&
        typeof data === "object" &&
        data.source === HEIGHT_MESSAGE.source &&
        data.type === HEIGHT_MESSAGE.type &&
        typeof data.height === "number"
      ) {
        setHeight(Math.min(Math.max(data.height + 16, 280), 2400));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border bg-white", className)}>
      {!ready && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white p-8"
          aria-live="polite"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-koder-orange border-t-transparent" />
          <p className="text-sm text-neutral-500">Teilnehmerliste wird geladen…</p>
        </div>
      )}
      <iframe
        title="Teilnehmerliste Race Result"
        srcDoc={srcDoc}
        style={{ height }}
        className={cn(
          "w-full bg-white transition-opacity duration-300",
          ready ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => {
          window.setTimeout(() => setReady(true), 700);
        }}
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

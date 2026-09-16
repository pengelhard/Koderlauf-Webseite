import { EVENT } from "@/lib/event-config";

export function AnmeldungGeschlossenHinweis({ className = "" }: { className?: string }) {
  const vorOrt = EVENT.preise.phasen.find((p) => p.id === "vor_ort");

  return (
    <div
      className={`rounded-2xl border border-border bg-muted/40 px-5 py-4 text-sm leading-relaxed text-muted-foreground ${className}`}
    >
      <p className="font-semibold text-foreground">Online-Anmeldung geschlossen</p>
      <p className="mt-2">
        Der Online-Anmeldeschluss war am{" "}
        <strong className="text-foreground">{EVENT.onlineAnmeldeschlussAnzeige}</strong>.
      </p>
      <p className="mt-2">
        Nachmeldung am Eventtag vor Ort: {vorOrt?.hinweis ?? "am Sportheim"} – dann gilt der
        Nachmeldepreis.
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { CalendarHeart, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SPORTHEIM_MAPS_URL =
  "https://maps.google.com/?q=Sportheim+Obermögersheim+91717+Wassertrüdingen";

export function RunnerInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/*
          Native <button>: shadcn-Button leitet kein ref weiter – Radix DialogTrigger (asChild) braucht das.
        */}
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 whitespace-normal break-words rounded-2xl border-2 border-white/30 bg-koder-orange px-6 py-4 text-base font-extrabold uppercase tracking-widest text-white shadow-[0_0_40px_rgba(255,107,0,0.55),0_8px_32px_rgba(0,0,0,0.35)] ring-4 ring-koder-orange/40 transition-all outline-none hover:scale-[1.02] hover:border-white/50 hover:bg-koder-orange-bright hover:shadow-[0_0_52px_rgba(255,107,0,0.7)] focus-visible:ring-[3px] focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-deep active:scale-[0.99] sm:min-h-16 sm:px-10 sm:py-5 sm:text-lg"
        >
          <CalendarHeart className="size-6 shrink-0 sm:size-7" aria-hidden />
          Infos zum Renntag &amp; Ablauf
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton
        className="max-h-[min(90vh,900px)] w-[calc(100%-1.5rem)] max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl"
      >
        <div className="max-h-[min(90vh,900px)] overflow-y-auto px-6 pt-6 pb-8 sm:px-8">
          <DialogHeader className="pr-10 text-left">
            <DialogTitle className="text-xl font-extrabold text-foreground sm:text-2xl">
              Liebe Läuferinnen und Läufer
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-5 text-sm leading-relaxed text-foreground sm:text-base">
            <p>
              Liebe Läuferinnen und Läufer, liebe Familien und Koderlauf-Fans,
            </p>
            <p>
              wir sind absolut überwältigt vom riesigen Interesse an unserem Lauf! So viele Anmeldungen – das ist
              einfach der Wahnsinn und zeigt, wie sehr ihr euch auf diesen besonderen Tag im Wald freut. Vielen, vielen
              Dank dafür! ❤️
            </p>
            <p className="font-semibold">
              Samstag, 04. April 2026 ist es endlich so weit – der 1. Obermögersheimer Koderlauf geht an den Start!
            </p>

            <div>
              <h3 className="mb-2 font-bold text-koder-orange">Zeitplan für Samstag</h3>
              <ul className="list-inside list-disc space-y-1.5 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Startnummern- &amp; Shirt-Ausgabe:</strong> ab 13:00 Uhr
                </li>
                <li>
                  <strong className="text-foreground">Große Eröffnung: 13:45 Uhr</strong> – mit Einmarsch der Kinder
                  und Grußworten des SVO-Vorstands
                </li>
                <li>
                  <strong className="text-foreground">Kinderlauf (800 m):</strong> Start 14:00 Uhr
                </li>
                <li>
                  <strong className="text-foreground">Kurz und knackig (4 km):</strong> Start 14:30 Uhr
                </li>
                <li>
                  <strong className="text-foreground">Koderrunde (8,5 km):</strong> Start 14:45 Uhr
                </li>
                <li>
                  <strong className="text-foreground">Trailrun (11,25 km):</strong> Start 15:20 Uhr
                </li>
                <li>
                  <strong className="text-foreground">Siegerehrung:</strong> gegen 17:30 Uhr, sobald alle Läufer im Ziel
                  sind
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-bold text-koder-orange">Vorab-Abholung am Donnerstag</h3>
              <p className="text-muted-foreground">
                Bereits am <strong className="text-foreground">Donnerstag, 02. April 2026 von 17:00 bis 19:00 Uhr</strong>{" "}
                könnt ihr eure Startnummern und T-Shirts am Sportheim Obermögersheim abholen.
              </p>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-muted-foreground">
                <span>
                  <strong className="text-foreground">Ort:</strong> Sportheim Obermögersheim →{" "}
                </span>
                <Link
                  href={SPORTHEIM_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-koder-orange underline underline-offset-2 hover:text-koder-orange-bright"
                >
                  <MapPin className="size-4 shrink-0" />
                  Google Maps zum Sportheim
                </Link>
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-bold text-koder-orange">Wichtige Hinweise für den Renntag</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Parken:</strong> Alle, die aus Obermögersheim kommen, bitten wir
                  möglichst mit dem Fahrrad oder zu Fuß zu kommen. Gäste aus dem Umland bitten wir im Ort zu parken, da
                  am Sportheim die Parkplätze begrenzt sind.
                </li>
                <li>
                  <strong className="text-foreground">Gepäck / Wertsachen:</strong> Ihr könnt eure Sachen in begrenzter
                  Anzahl bei uns abgeben. Für Wertgegenstände übernehmen wir keine Haftung – bringt bitte nur das
                  Nötigste mit.
                </li>
                <li>
                  <strong className="text-foreground">Kinderbetreuung:</strong> Während ihr lauft, kümmern wir uns
                  gerne um eure Kinder im Zielbereich – sprecht uns einfach beim Team an.
                </li>
                <li>
                  <strong className="text-foreground">Duschen:</strong> Duschen ist im Sportheim möglich.
                </li>
                <li>
                  <strong className="text-foreground">Kleidung:</strong> Kommt bitte wetterangepasst und mit festem
                  Schuhwerk – auf den Trail-Strecken empfehlen wir Schuhe mit gutem Profil.
                </li>
                <li>
                  <strong className="text-foreground">Vor Ort sein:</strong> Bitte seid mindestens 60 Minuten vor
                  eurem Start da, damit Startnummer, Aufwärmen und alle Formalitäten stressfrei klappen.
                </li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-destructive/40 bg-destructive/10 p-4">
              <h3 className="mb-2 font-bold text-destructive">🚨 WICHTIGE NOTFALL-NUMMER</h3>
              <p className="text-muted-foreground">
                Alle Teilnehmer, die ein Handy mit auf die Strecke nehmen, bitten wir, folgende Nummer
                einzuspeichern:
              </p>
              <p className="mt-2 text-lg font-black tabular-nums tracking-wide text-foreground">0151 24056845</p>
              <p className="mt-2 text-muted-foreground">
                Unter dieser Nummer ist immer jemand erreichbar. Im Notfall einfach anrufen – Hilfe wird sofort
                geschickt.
              </p>
            </div>

            <p className="text-muted-foreground">
              Auch für Fans, Familien und Nichtläufer ist bestens gesorgt: Im Zielbereich gibt es den ganzen
              Nachmittag über Essen, Trinken, Kaffee und Kuchen für alle. Bringt ruhig Oma, Opa, Geschwister oder
              Freunde mit – je mehr, desto besser!
            </p>
            <p className="text-muted-foreground">
              Jede Finisherin und jeder Finisher erhält natürlich eine richtig schöne, individuelle Koderlauf-Medaille.
            </p>
            <p className="font-semibold">
              Wir freuen uns riesig auf euch! Es wird legendär! 🏃‍♂️🌲🏅❤️
            </p>
            <p className="border-t border-border pt-4 text-muted-foreground">
              <span className="font-semibold text-foreground">Euer Koderlauf-Team</span>
              <br />
              <a href="mailto:info@koderlauf.de" className="text-koder-orange hover:underline">
                info@koderlauf.de
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

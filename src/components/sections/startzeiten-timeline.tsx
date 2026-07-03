"use client";

import { Ticket, Baby, Zap, TreePine, Mountain, Route, Award, type LucideIcon } from "lucide-react";

interface TimelineItem {
  name: string;
  time: string;
  color: string;
  icon: LucideIcon;
  /** Position auf der Linie in % */
  pos: number;
  side: "top" | "bottom";
}

const ITEMS: TimelineItem[] = [
  { name: "Startnummernausgabe", time: "13:00", color: "#14B8A6", icon: Ticket,   pos: 7,  side: "top" },
  { name: "Kinderlauf",          time: "14:30", color: "#FF6B00", icon: Baby,     pos: 21, side: "bottom" },
  { name: "Spielerei",           time: "15:00", color: "#7C3AED", icon: Route,    pos: 35, side: "top" },
  { name: "Trailrun",            time: "15:10", color: "#3B82F6", icon: Mountain, pos: 49, side: "bottom" },
  { name: "Koderrunde",          time: "15:20", color: "#EAB308", icon: TreePine, pos: 63, side: "top" },
  { name: "Kurz & knackig",      time: "15:30", color: "#22C55E", icon: Zap,      pos: 77, side: "bottom" },
  { name: "Siegerehrung",        time: "19:00", color: "#D97706", icon: Award,    pos: 93, side: "top" },
];

/** Timeline mit allen Startzeiten inkl. Startnummernausgabe und Siegerehrung.
 *  Mobile: vertikal-schlangenförmig (Einträge abwechselnd links/rechts der Linie),
 *  damit nichts horizontal gescrollt werden muss. Desktop (sm+): horizontal. */
export function StartzeitenTimeline() {
  return (
    <>
      {/* Mobile: vertikaler Zeitstrahl */}
      <div className="relative mx-auto max-w-md sm:hidden">
        <div className="absolute left-1/2 top-5 bottom-5 w-px -translate-x-1/2 bg-foreground/40" />
        <div className="flex flex-col gap-7">
          {ITEMS.map((s, i) => {
            const Icon = s.icon;
            const isLeft = i % 2 === 0;
            return (
              <div key={s.name} className="relative grid grid-cols-[1fr_2.5rem_1fr] items-center">
                {/* Marker auf der Linie */}
                <div className="col-start-2 row-start-1 flex justify-center">
                  <div
                    className="z-10 flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-offset-2 ring-offset-background"
                    style={{
                      backgroundColor: s.color,
                      color: "#fff",
                      boxShadow: `0 0 0 5px ${s.color}22, 0 0 18px ${s.color}55`,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                </div>

                {/* Kurzer Verbindungsstrich zum Text */}
                <div
                  className={`absolute top-1/2 h-px w-3 ${isLeft ? "right-[calc(50%+1.25rem)]" : "left-[calc(50%+1.25rem)]"}`}
                  style={{ backgroundColor: `${s.color}55` }}
                />

                {/* Text abwechselnd links/rechts der Linie */}
                <div
                  className={`row-start-1 ${isLeft ? "col-start-1 pr-4 text-right" : "col-start-3 pl-4 text-left"}`}
                >
                  <div className="text-xs font-semibold tracking-tight" style={{ color: s.color }}>
                    {s.name}
                  </div>
                  <div className="text-lg font-extrabold tabular-nums tracking-[-0.4px]" style={{ color: s.color }}>
                    {s.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop: horizontale Timeline */}
      <div className="hidden sm:block">
      <div className="relative h-64 min-w-[560px] pt-2 pb-2">
        {/* Dünne, klare Timeline-Linie */}
        <div className="absolute left-[3%] right-[3%] top-1/2 h-px -translate-y-1/2 rounded-full bg-foreground/50" />

        {ITEMS.map((s) => {
          const Icon = s.icon;
          const isTop = s.side === "top";
          return (
            <div
              key={s.name}
              className="absolute"
              style={{ left: `${s.pos}%`, top: "50%", transform: "translateX(-50%)" }}
            >
              {/* Marker exakt zentriert auf der Linie */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-offset-2 ring-offset-background"
                style={{
                  backgroundColor: s.color,
                  color: "#fff",
                  boxShadow: `0 0 0 5px ${s.color}22, 0 0 18px ${s.color}55, 0 0 36px ${s.color}33`,
                }}
              >
                <Icon size={18} />
              </div>

              {/* Text + kurzer Stiel – abwechselnd komplett ober- oder unterhalb des Markers */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center ${isTop ? "bottom-[calc(50%+3px)]" : "top-[calc(50%+11px)]"}`}
              >
                {isTop && (
                  <div className="text-center mb-1">
                    <div
                      className="text-[10px] sm:text-xs font-semibold tracking-tight whitespace-nowrap"
                      style={{ color: s.color }}
                    >
                      {s.name}
                    </div>
                    <div
                      className="text-base sm:text-lg font-extrabold tabular-nums tracking-[-0.4px]"
                      style={{ color: s.color }}
                    >
                      {s.time}
                    </div>
                  </div>
                )}

                {/* Kurzer Verbindungsstrich (Stiel) */}
                <div className="w-px" style={{ height: isTop ? "8px" : "12px", backgroundColor: `${s.color}55` }} />

                {!isTop && (
                  <div className="text-center mt-1">
                    <div
                      className="text-[10px] sm:text-xs font-semibold tracking-tight whitespace-nowrap"
                      style={{ color: s.color }}
                    >
                      {s.name}
                    </div>
                    <div
                      className="text-base sm:text-lg font-extrabold tabular-nums tracking-[-0.4px]"
                      style={{ color: s.color }}
                    >
                      {s.time}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground sm:-mt-2 sm:text-sm">
        Wir empfehlen allen, die es sich einrichten können: Holt eure Startnummern und bestellten T-Shirts
        bereits am Freitag zwischen{" "}
        <strong className="font-semibold text-foreground">17:00 bis 20:00 Uhr</strong>{" "}
        am Sportplatz ab.
      </p>
    </>
  );
}

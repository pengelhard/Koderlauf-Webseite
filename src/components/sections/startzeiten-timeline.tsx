"use client";

import { Ticket, Baby, Zap, TreePine, Mountain, Route, Award, Footprints, type LucideIcon } from "lucide-react";
import { EVENT } from "@/lib/event-config";

interface TimelineItem {
  name: string;
  sub?: string;
  time: string;
  color: string;
  icon: LucideIcon;
  pos: number;
  side: "top" | "bottom";
}

const ICONS: Record<string, LucideIcon> = {
  spielerei: Route,
  kinderlauf: Baby,
  trailrun: Mountain,
  koderrunde: TreePine,
  "koderrunde-walking": Footprints,
  "kurz-knackig": Zap,
};

/** Timeline-Einträge aus EVENT.zeitplan – eine Quelle für Startzeiten. */
function buildItems(): TimelineItem[] {
  const starts = EVENT.zeitplan.filter((z) => z.streckeId || z.titel.includes("Siegerehrung") || z.titel.includes("Startnummern"));
  const positions = [7, 22, 37, 52, 67, 82, 95];
  const sides: Array<"top" | "bottom"> = ["top", "bottom", "top", "bottom", "top", "bottom", "top"];

  return starts.map((z, i) => {
    const strecke = z.streckeId ? EVENT.strecken.find((s) => s.id === z.streckeId) : undefined;
    const isAusgabe = z.titel.toLowerCase().includes("startnummern");
    const isSieg = z.titel.toLowerCase().includes("siegerehrung");

    let name = z.titel.replace(/^Start\s+/i, "");
    let sub: string | undefined;
    let color = "#D97706";
    let icon: LucideIcon = Award;

    if (isAusgabe) {
      name = "Startnummernausgabe";
      sub = "am Eventtag";
      color = "#14B8A6";
      icon = Ticket;
    } else if (isSieg) {
      name = "Siegerehrung";
      color = "#D97706";
      icon = Award;
    } else if (strecke) {
      if (z.streckeId === "koderrunde") {
        name = "Koderrunde";
        sub = "Lauf & Walking";
      } else {
        name = strecke.name.replace(/\s*\(Lauf\)|\s*\(Walking\)/g, "").trim();
      }
      color = strecke.farbe;
      icon = ICONS[strecke.id] ?? Route;
    }

    return {
      name,
      sub,
      time: z.zeit,
      color,
      icon,
      pos: positions[i] ?? 50,
      side: sides[i] ?? "top",
    };
  });
}

function ItemLabel({ item, className }: { item: TimelineItem; className?: string }) {
  return (
    <div className={className}>
      <div className="text-xs font-semibold tracking-tight sm:text-[10px] sm:whitespace-nowrap" style={{ color: item.color }}>
        {item.name}
      </div>
      {item.sub && (
        <div className="text-[10px] font-medium text-muted-foreground sm:whitespace-nowrap">
          {item.sub}
        </div>
      )}
      <div className="text-lg font-extrabold tabular-nums tracking-[-0.4px] sm:text-base" style={{ color: item.color }}>
        {item.time}
      </div>
    </div>
  );
}

/** Timeline mit allen Startzeiten inkl. Startnummernausgabe und Siegerehrung.
 *  Mobile: vertikal-schlangenförmig. Desktop (sm+): horizontal. */
export function StartzeitenTimeline() {
  const items = buildItems();

  return (
    <>
      <div className="relative mx-auto max-w-md sm:hidden">
        <div className="absolute left-1/2 top-5 bottom-5 w-px -translate-x-1/2 bg-foreground/40" />
        <div className="flex flex-col gap-7">
          {items.map((s, i) => {
            const Icon = s.icon;
            const isLeft = i % 2 === 0;
            return (
              <div key={`${s.name}-${s.time}`} className="relative grid grid-cols-[1fr_2.5rem_1fr] items-center">
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
                <div
                  className={`absolute top-1/2 h-px w-3 ${isLeft ? "right-[calc(50%+1.25rem)]" : "left-[calc(50%+1.25rem)]"}`}
                  style={{ backgroundColor: `${s.color}55` }}
                />
                <ItemLabel
                  item={s}
                  className={`row-start-1 ${isLeft ? "col-start-1 pr-4 text-right" : "col-start-3 pl-4 text-left"}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="hidden sm:block">
        <div className="relative h-64 min-w-[560px] pt-2 pb-2">
          <div className="absolute left-[3%] right-[3%] top-1/2 h-px -translate-y-1/2 rounded-full bg-foreground/50" />
          {items.map((s) => {
            const Icon = s.icon;
            const isTop = s.side === "top";
            return (
              <div
                key={`${s.name}-${s.time}`}
                className="absolute"
                style={{ left: `${s.pos}%`, top: "50%", transform: "translateX(-50%)" }}
              >
                <div
                  className="absolute left-1/2 top-1/2 z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ring-1 ring-offset-2 ring-offset-background"
                  style={{
                    backgroundColor: s.color,
                    color: "#fff",
                    boxShadow: `0 0 0 5px ${s.color}22, 0 0 18px ${s.color}55, 0 0 36px ${s.color}33`,
                  }}
                >
                  <Icon size={18} />
                </div>
                <div
                  className={`absolute left-1/2 flex -translate-x-1/2 flex-col items-center ${isTop ? "bottom-[calc(50%+3px)]" : "top-[calc(50%+11px)]"}`}
                >
                  {isTop && (
                    <>
                      <ItemLabel item={s} className="mb-1 text-center" />
                      <div className="w-px" style={{ height: "8px", backgroundColor: `${s.color}55` }} />
                    </>
                  )}
                  {!isTop && (
                    <>
                      <div className="w-px" style={{ height: "12px", backgroundColor: `${s.color}55` }} />
                      <ItemLabel item={s} className="mt-1 text-center" />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

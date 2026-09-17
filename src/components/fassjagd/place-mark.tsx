"use client";

import { cn } from "@/lib/utils";

const MEDALS: Record<
  1 | 2 | 3,
  { label: string; fill: string; rim: string; shine: string; text: string }
> = {
  1: {
    label: "Gold",
    fill: "#D4AF37",
    rim: "#8A6D1A",
    shine: "#F8E7A0",
    text: "#3D2E00",
  },
  2: {
    label: "Silber",
    fill: "#C0C0C0",
    rim: "#6E6E6E",
    shine: "#F2F2F2",
    text: "#2A2A2A",
  },
  3: {
    label: "Bronze",
    fill: "#CD7F32",
    rim: "#7A4A16",
    shine: "#E8B57A",
    text: "#3A1C00",
  },
};

export function PlaceMark({
  place,
  size = "md",
}: {
  place: number;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-8 w-8 text-sm" : "h-9 w-9 text-sm";
  const medal = place === 1 || place === 2 || place === 3 ? MEDALS[place] : null;
  const label = medal ? `Platz ${place}, ${medal.label}` : `Platz ${place}`;

  if (medal) {
    return (
      <span
        role="img"
        aria-label={label}
        title={label}
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-full font-extrabold tabular-nums",
          dim,
        )}
        style={{
          color: medal.text,
          background: `radial-gradient(circle at 32% 28%, ${medal.shine} 0%, ${medal.fill} 52%, ${medal.rim} 100%)`,
          boxShadow: `0 1px 3px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.55), 0 0 0 1.5px ${medal.rim}`,
        }}
      >
        {place}
      </span>
    );
  }

  return (
    <span
      aria-label={label}
      title={label}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-muted font-extrabold tabular-nums text-muted-foreground",
        dim,
      )}
    >
      {place}
    </span>
  );
}

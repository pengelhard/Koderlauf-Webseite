"use client";

import { useMemo } from "react";
import type { GpxPoint } from "@/lib/gpx";
import { getElevationProfile } from "@/lib/gpx";

interface ElevationProfileProps {
  points: GpxPoint[];
  className?: string;
}

export function ElevationProfile({ points, className = "" }: ElevationProfileProps) {
  const profile = useMemo(() => getElevationProfile(points, 200), [points]);

  if (profile.length === 0) return null;

  const minEle = Math.min(...profile.map((p) => p.elevation));
  const maxEle = Math.max(...profile.map((p) => p.elevation));
  const maxDist = profile[profile.length - 1].distance;

  const padding = { top: 20, right: 10, bottom: 30, left: 45 };
  const width = 800;
  const height = 160;
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const eleRange = maxEle - minEle || 1;

  function x(d: number) {
    return padding.left + (d / maxDist) * plotW;
  }
  function y(e: number) {
    return padding.top + plotH - ((e - minEle) / eleRange) * plotH;
  }

  const linePath = profile
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.distance).toFixed(1)},${y(p.elevation).toFixed(1)}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L${x(maxDist).toFixed(1)},${(padding.top + plotH).toFixed(1)}` +
    ` L${x(0).toFixed(1)},${(padding.top + plotH).toFixed(1)} Z`;

  const yTicks = 5;
  const xTicks = 6;

  return (
    <div className={`overflow-hidden rounded-2xl border border-border bg-card p-4 ${className}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {Array.from({ length: yTicks }, (_, i) => {
          const ele = minEle + (eleRange * i) / (yTicks - 1);
          const py = y(ele);
          return (
            <g key={`y-${i}`}>
              <line
                x1={padding.left}
                y1={py}
                x2={width - padding.right}
                y2={py}
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeWidth={0.5}
              />
              <text
                x={padding.left - 5}
                y={py + 3}
                textAnchor="end"
                fontSize={9}
                fill="currentColor"
                opacity={0.4}
              >
                {Math.round(ele)}m
              </text>
            </g>
          );
        })}
        {Array.from({ length: xTicks }, (_, i) => {
          const d = (maxDist * i) / (xTicks - 1);
          const px = x(d);
          return (
            <text
              key={`x-${i}`}
              x={px}
              y={height - 5}
              textAnchor="middle"
              fontSize={9}
              fill="currentColor"
              opacity={0.4}
            >
              {d.toFixed(1)} km
            </text>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="#FF6B00" fillOpacity={0.15} />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#FF6B00"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Start dot */}
        <circle cx={x(0)} cy={y(profile[0].elevation)} r={4} fill="#22C55E" />
        {/* End dot */}
        <circle
          cx={x(maxDist)}
          cy={y(profile[profile.length - 1].elevation)}
          r={4}
          fill="#EF4444"
        />
      </svg>
    </div>
  );
}

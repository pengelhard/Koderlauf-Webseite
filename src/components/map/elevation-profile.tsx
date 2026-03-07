"use client";

import { useMemo, useRef, useCallback, useState } from "react";
import type { GpxPoint } from "@/lib/gpx";
import { getElevationProfile } from "@/lib/gpx";

interface ElevationProfileProps {
  points: GpxPoint[];
  className?: string;
  onHover?: (point: { lat: number; lon: number; ele: number; distance: number } | null) => void;
}

export function ElevationProfile({ points, className = "", onHover }: ElevationProfileProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const profile = useMemo(() => getElevationProfile(points, 250), [points]);

  const pointDistances = useMemo(() => {
    if (points.length === 0) return [];
    const dists: number[] = [0];
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const R = 6371;
      const dLat = ((curr.lat - prev.lat) * Math.PI) / 180;
      const dLon = ((curr.lon - prev.lon) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((prev.lat * Math.PI) / 180) *
          Math.cos((curr.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2;
      dists.push(dists[i - 1] + R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }
    return dists;
  }, [points]);

  const findNearestGpxPoint = useCallback(
    (distance: number) => {
      if (pointDistances.length === 0) return null;
      let closest = 0;
      let minDiff = Math.abs(pointDistances[0] - distance);
      for (let i = 1; i < pointDistances.length; i++) {
        const diff = Math.abs(pointDistances[i] - distance);
        if (diff < minDiff) {
          minDiff = diff;
          closest = i;
        }
      }
      return {
        lat: points[closest].lat,
        lon: points[closest].lon,
        ele: points[closest].ele,
        distance,
      };
    },
    [points, pointDistances]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>, profileLen: number, mDist: number, pLeft: number, pW: number, w: number) => {
      const svg = svgRef.current;
      if (!svg || mDist === 0) return;
      const bRect = svg.getBoundingClientRect();
      const svgX = ((e.clientX - bRect.left) / bRect.width) * w;
      const d = ((svgX - pLeft) / pW) * mDist;

      if (d < 0 || d > mDist) {
        setHoverIdx(null);
        onHover?.(null);
        return;
      }

      const idx = Math.round((d / mDist) * (profileLen - 1));
      setHoverIdx(idx);

      const gpxPoint = findNearestGpxPoint(d);
      onHover?.(gpxPoint);
    },
    [onHover, findNearestGpxPoint]
  );

  const handleMouseLeave = useCallback(() => {
    setHoverIdx(null);
    onHover?.(null);
  }, [onHover]);

  if (profile.length === 0) return null;

  const minEle = Math.min(...profile.map((p) => p.elevation));
  const maxEle = Math.max(...profile.map((p) => p.elevation));
  const maxDist = profile[profile.length - 1].distance;

  const padding = { top: 20, right: 10, bottom: 30, left: 45 };
  const width = 800;
  const height = 180;
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

  const hoverPoint = hoverIdx !== null ? profile[hoverIdx] : null;

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-card ${className}`}>
      {/* Hover tooltip */}
      {hoverPoint && (
        <div
          className="pointer-events-none absolute z-10 rounded-xl bg-forest-deep/95 px-3 py-2 text-xs text-white shadow-lg backdrop-blur-sm transition-all"
          style={{
            left: `${(x(hoverPoint.distance) / width) * 100}%`,
            top: "8px",
            transform: "translateX(-50%)",
          }}
        >
          <span className="font-bold text-koder-orange">{Math.round(hoverPoint.elevation)} m</span>
          <span className="mx-1.5 text-white/40">|</span>
          <span>{hoverPoint.distance.toFixed(1)} km</span>
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full cursor-crosshair select-none"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={(e) => handleMouseMove(e, profile.length, maxDist, padding.left, plotW, width)}
        onMouseLeave={handleMouseLeave}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          const svg = svgRef.current;
          if (!svg || !touch) return;
          handleMouseMove(
            { clientX: touch.clientX, clientY: touch.clientY, currentTarget: svg } as React.MouseEvent<SVGSVGElement>,
            profile.length, maxDist, padding.left, plotW, width
          );
        }}
        onTouchEnd={handleMouseLeave}
      >
        {/* Y-axis grid + labels */}
        {Array.from({ length: yTicks }, (_, i) => {
          const ele = minEle + (eleRange * i) / (yTicks - 1);
          const py = y(ele);
          return (
            <g key={`y-${i}`}>
              <line x1={padding.left} y1={py} x2={width - padding.right} y2={py} stroke="currentColor" strokeOpacity={0.06} strokeWidth={0.5} />
              <text x={padding.left - 5} y={py + 3} textAnchor="end" fontSize={8} fill="currentColor" opacity={0.35}>{Math.round(ele)}m</text>
            </g>
          );
        })}
        {/* X-axis labels */}
        {Array.from({ length: xTicks }, (_, i) => {
          const d = (maxDist * i) / (xTicks - 1);
          return (
            <text key={`x-${i}`} x={x(d)} y={height - 5} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.35}>
              {d.toFixed(1)} km
            </text>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="#FF6B00" fillOpacity={0.12} />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#FF6B00" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* Start dot */}
        <circle cx={x(0)} cy={y(profile[0].elevation)} r={4} fill="#22C55E" />
        {/* End dot */}
        <circle cx={x(maxDist)} cy={y(profile[profile.length - 1].elevation)} r={4} fill="#EF4444" />

        {/* Hover crosshair */}
        {hoverPoint && (
          <>
            <line
              x1={x(hoverPoint.distance)}
              y1={padding.top}
              x2={x(hoverPoint.distance)}
              y2={padding.top + plotH}
              stroke="#FF6B00"
              strokeWidth={1}
              strokeDasharray="3,3"
              opacity={0.7}
            />
            <circle
              cx={x(hoverPoint.distance)}
              cy={y(hoverPoint.elevation)}
              r={5}
              fill="#FF6B00"
              stroke="#fff"
              strokeWidth={2}
            />
          </>
        )}

        {/* Invisible hit area for better mouse tracking */}
        <rect
          x={padding.left}
          y={padding.top}
          width={plotW}
          height={plotH}
          fill="transparent"
        />
      </svg>
    </div>
  );
}

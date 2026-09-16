"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FassjagdBoard } from "@/lib/fassjagd/types";

const POLL_MS = 45_000;

export function useFassjagdBoard(initial: FassjagdBoard) {
  const [board, setBoard] = useState(initial);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setBoard(initial));
    return () => cancelAnimationFrame(id);
  }, [initial]);

  useEffect(() => {
    if (board.frozen) return;

    let cancelled = false;
    async function tick() {
      if (document.visibilityState !== "visible") return;
      setRefreshing(true);
      try {
        const res = await fetch("/api/fassjagd", { cache: "no-store" });
        if (!res.ok) return;
        const next = (await res.json()) as FassjagdBoard;
        if (!cancelled && Array.isArray(next.ranking)) setBoard(next);
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setRefreshing(false);
      }
    }

    const id = window.setInterval(tick, POLL_MS);
    const onVis = () => {
      if (document.visibilityState === "visible") void tick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [board.frozen]);

  return { board, refreshing };
}

export function FassjagdLiveBadge({
  status,
  className,
}: {
  status: FassjagdBoard["status"];
  className?: string;
}) {
  const live = status === "live";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-widest",
        live ? "bg-red-600 text-white" : "bg-forest-light/20 text-forest-light",
        className,
      )}
    >
      {live && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />}
      {live ? "Live" : "Offiziell"}
    </span>
  );
}

export function FassjagdFlame({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <Flame
      className="h-4 w-4 text-koder-orange"
      aria-label="Diese Woche zugelegt"
    />
  );
}

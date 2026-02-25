"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { useCountdown } from "@/hooks/use-countdown";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface RealtimeCountdownProps {
  eventKey: string;
  initialTargetDate: string;
  initialLabel?: string | null;
}

interface CounterItemProps {
  label: string;
  value: number;
}

function CounterItem({ label, value }: CounterItemProps) {
  const springValue = useSpring(value, { stiffness: 90, damping: 24, mass: 0.5 });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    springValue.set(value);
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [springValue, value]);

  return (
    <div className="rounded-2xl border border-primary-glow/30 bg-dark/75 px-4 py-4 text-center md:px-5">
      <motion.p
        key={displayValue}
        initial={{ opacity: 0.35, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="font-display text-3xl font-black tracking-tight text-white md:text-4xl"
      >
        {displayValue.toString().padStart(2, "0")}
      </motion.p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">{label}</p>
    </div>
  );
}

export function RealtimeCountdown({
  eventKey,
  initialTargetDate,
  initialLabel = "Bis zum Start",
}: RealtimeCountdownProps) {
  const [targetDate, setTargetDate] = useState(initialTargetDate);
  const [label, setLabel] = useState(initialLabel);
  const countdown = useCountdown(targetDate);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      const supabase = createSupabaseBrowserClient();
      const channel = supabase
        .channel(`countdown-settings-${eventKey}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "countdown_settings",
            filter: `event_key=eq.${eventKey}`,
          },
          (payload) => {
            if (payload.new && typeof payload.new === "object") {
              const next = payload.new as { target_timestamp?: string; label?: string | null };
              if (next.target_timestamp) setTargetDate(next.target_timestamp);
              if (typeof next.label === "string" || next.label === null) setLabel(next.label ?? "");
            }
          },
        )
        .subscribe();

      unsubscribe = () => {
        void supabase.removeChannel(channel);
      };
    } catch {
      // In lokalen Umgebungen ohne ENV soll die UI weiterhin mit initialen Daten laufen.
    }

    return () => {
      unsubscribe?.();
    };
  }, [eventKey]);

  const items = useMemo(
    () => [
      { label: "Tage", value: countdown.days },
      { label: "Stunden", value: countdown.hours },
      { label: "Minuten", value: countdown.minutes },
      { label: "Sekunden", value: countdown.seconds },
    ],
    [countdown.days, countdown.hours, countdown.minutes, countdown.seconds],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto mt-10 w-full max-w-4xl rounded-3xl border border-primary-koder/20 bg-primary-koder/15 p-4 shadow-orange-strong backdrop-blur-md md:p-6"
    >
      <p className="mb-4 text-center font-display text-sm uppercase tracking-[0.24em] text-primary-glow">
        {countdown.isComplete ? "Der Start läuft!" : label}
      </p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {items.map((item) => (
          <CounterItem key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </motion.div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

function getCountdown(targetDate: string): CountdownValue {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const delta = Math.max(target - now, 0);

  return {
    days: Math.floor(delta / DAY),
    hours: Math.floor((delta % DAY) / HOUR),
    minutes: Math.floor((delta % HOUR) / MINUTE),
    seconds: Math.floor((delta % MINUTE) / SECOND),
    isComplete: delta === 0,
  };
}

export function useCountdown(targetDate: string) {
  const [value, setValue] = useState<CountdownValue>(() => getCountdown(targetDate));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setValue(getCountdown(targetDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  return useMemo(() => value, [value]);
}

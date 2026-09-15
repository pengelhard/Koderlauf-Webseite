"use client";

import { useSyncExternalStore } from "react";
import { TEST_SITE_HOST } from "@/lib/site-url";

function subscribe() {
  return () => {};
}

function getIsTestSite() {
  if (typeof window === "undefined") return false;
  return window.location.hostname === TEST_SITE_HOST;
}

function getServerSnapshot() {
  return false;
}

/** Hinweisleiste auf test.koderlauf.de – nicht indexieren, klar als Test markieren. */
export function TestBanner() {
  const isTest = useSyncExternalStore(subscribe, getIsTestSite, getServerSnapshot);

  if (!isTest) return null;

  return (
    <div
      role="status"
      className="fixed top-[4.5rem] left-0 right-0 z-40 border-b border-amber-500/40 bg-amber-500/95 px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-amber-950 sm:top-[4.75rem] sm:text-sm"
    >
      Testumgebung · {TEST_SITE_HOST} · nicht die offizielle Seite
    </div>
  );
}

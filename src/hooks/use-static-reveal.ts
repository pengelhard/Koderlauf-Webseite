"use client";

import { useEffect, useState } from "react";
import type { Transition, Variants } from "framer-motion";

/**
 * true auf Mobile-/Touch-Geräten: Scroll-Reveal-Animationen (whileInView)
 * werden dort komplett deaktiviert. Auch "instant" umgeschaltete Opacity-Werte
 * lösen beim Scrollen Repaints aus, die auf Mali-GPUs (z. B. Huawei P30) zu
 * Ghosting alter Frames führen. Auf Mobile rendern die Sektionen daher von
 * Anfang an statisch im Endzustand – ohne jegliche scroll-gekoppelte Änderung.
 */
export function useStaticReveal(): boolean {
  const [isStatic, setIsStatic] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px), (pointer: coarse)");
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setIsStatic(mq.matches));
    };
    update();
    mq.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", update);
    };
  }, []);

  return isStatic;
}

/** Props für einen einfachen Opacity-Fade beim Scrollen in den Viewport. */
export function fadeReveal(isStatic: boolean, transition?: Transition) {
  if (isStatic) {
    // animate statt whileInView: wird einmalig beim Mount angewendet
    // (per MotionGlobalConfig.skipAnimations sofort), nie beim Scrollen.
    return { initial: false as const, animate: { opacity: 1 } };
  }
  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition,
  };
}

/** Props für Variants-basierte Reveals (Container mit staggerChildren). */
export function variantsReveal(isStatic: boolean, variants: Variants) {
  if (isStatic) {
    return { variants, initial: false as const, animate: "show" };
  }
  return {
    variants,
    initial: "hidden",
    whileInView: "show",
    viewport: { once: true },
  };
}

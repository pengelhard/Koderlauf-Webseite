"use client";

import { useEffect } from "react";
import { MotionGlobalConfig } from "framer-motion";

/**
 * Deaktiviert auf Mobilgeräten (Touch oder < 1024px) sämtliche Framer-Motion-
 * Animationen. Scroll-gekoppelte Einblend-Animationen verursachen auf vielen
 * Mobil-GPUs Rendering-Artefakte (Ghosting alter Frames beim Scrollen).
 * Inhalte erscheinen dann sofort im Endzustand – ohne Animation, aber stabil.
 */
export function MobileMotionConfig() {
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px), (pointer: coarse)");
    const update = () => {
      MotionGlobalConfig.skipAnimations = mq.matches;
    };
    update();
    mq.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      MotionGlobalConfig.skipAnimations = false;
    };
  }, []);

  return null;
}

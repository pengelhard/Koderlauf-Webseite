"use client";

import { MotionValue, useScroll, useTransform } from "framer-motion";

export function useParallax(distance = 120): {
  translateY: MotionValue<number>;
  scale: MotionValue<number>;
} {
  const { scrollYProgress } = useScroll();
  const translateY = useTransform(scrollYProgress, [0, 1], [0, distance]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return { translateY, scale };
}

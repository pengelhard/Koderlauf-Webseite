"use client";

import { useMotionValue, useSpring } from "framer-motion";
import { useMemo } from "react";

export function useMagneticHover(strength = 18) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.25 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.25 });

  const handlers = useMemo(
    () => ({
      onMouseMove: (event: React.MouseEvent<HTMLElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        x.set(((event.clientX - centerX) / rect.width) * strength);
        y.set(((event.clientY - centerY) / rect.height) * strength);
      },
      onMouseLeave: () => {
        x.set(0);
        y.set(0);
      },
    }),
    [strength, x, y],
  );

  return {
    x: springX,
    y: springY,
    handlers,
  };
}

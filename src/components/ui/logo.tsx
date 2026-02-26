"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "mascot";
  className?: string;
  linked?: boolean;
}

const mascotSizes = {
  sm: { width: 32, height: 36 },
  md: { width: 40, height: 45 },
  lg: { width: 64, height: 72 },
};

const textSizes = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export function Logo({
  size = "md",
  variant = "full",
  className,
  linked = true,
}: LogoProps) {
  const { width, height } = mascotSizes[size];

  const content = (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <Image
        src="/mascot-koderlauf.png"
        alt=""
        width={width}
        height={height}
        className="drop-shadow-[0_2px_10px_rgba(255,107,0,0.3)]"
        priority
      />
      {variant === "full" && (
        <span
          className={cn(
            "font-black tracking-tight leading-none",
            textSizes[size]
          )}
        >
          <span className="text-white dark:text-white">Koder</span>
          <span className="text-koder-orange">lauf</span>
        </span>
      )}
    </span>
  );

  if (linked) {
    return (
      <Link href="/" className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}

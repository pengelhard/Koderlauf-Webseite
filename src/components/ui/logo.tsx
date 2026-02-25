import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "mascot";
  className?: string;
  linked?: boolean;
}

const fullDimensions = {
  sm: { width: 160, height: 28 },
  md: { width: 200, height: 36 },
  lg: { width: 280, height: 50 },
};

const mascotDimensions = {
  sm: { width: 36, height: 40 },
  md: { width: 48, height: 52 },
  lg: { width: 80, height: 88 },
};

export function Logo({
  size = "md",
  variant = "full",
  className,
  linked = true,
}: LogoProps) {
  const isMascot = variant === "mascot";
  const { width, height } = isMascot
    ? mascotDimensions[size]
    : fullDimensions[size];

  const content = (
    <Image
      src={isMascot ? "/mascot-koderlauf.svg" : "/logo-koderlauf.svg"}
      alt="Koderlauf"
      width={width}
      height={height}
      className={cn(
        "drop-shadow-[0_2px_10px_rgba(255,107,0,0.3)]",
        className
      )}
      priority
    />
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

import Image from "next/image";
import { cn } from "@/lib/utils";

export function FassjagdFassBild({
  className,
  size = 160,
  priority = false,
}: {
  className?: string;
  size?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src="/fassjagd-fass.png"
      alt="Das Fass Bier – Preis der Fassjagd"
      width={size}
      height={size}
      priority={priority}
      className={cn("drop-shadow-[0_8px_28px_rgba(255,107,0,0.35)]", className)}
    />
  );
}

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  linked?: boolean;
}

const dimensions = {
  sm: { width: 140, height: 28 },
  md: { width: 180, height: 36 },
  lg: { width: 240, height: 48 },
};

export function Logo({ size = "md", className, linked = true }: LogoProps) {
  const { width, height } = dimensions[size];

  const content = (
    <Image
      src="/logo-koderlauf.svg"
      alt="Koderlauf"
      width={width}
      height={height}
      className={cn("drop-shadow-[0_2px_8px_rgba(255,107,0,0.35)]", className)}
      priority
    />
  );

  if (linked) {
    return (
      <Link href="/" className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}

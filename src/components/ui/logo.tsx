import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  linked?: boolean;
}

const sizes = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl sm:text-5xl",
};

export function Logo({ size = "md", className, linked = true }: LogoProps) {
  const content = (
    <span
      className={cn(
        "font-black tracking-tight text-koder-orange",
        "drop-shadow-[0_2px_8px_rgba(255,107,0,0.35)]",
        sizes[size],
        className
      )}
    >
      Koderlauf
    </span>
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

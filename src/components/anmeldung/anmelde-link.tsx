"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useOnlineAnmeldungOffen } from "@/hooks/use-online-anmeldung-offen";
import { EVENT } from "@/lib/event-config";
import { cn } from "@/lib/utils";

export const ANMELDE_BUTTON_DISABLED_CLASS =
  "pointer-events-none cursor-not-allowed bg-muted text-muted-foreground opacity-60";

type AnmeldeLinkProps = {
  href?: string;
  className?: string;
  disabledClassName?: string;
  children: ReactNode;
  title?: string;
  onClick?: () => void;
};

export function AnmeldeLink({
  href = "/anmeldung",
  className,
  disabledClassName = ANMELDE_BUTTON_DISABLED_CLASS,
  children,
  title,
  onClick,
}: AnmeldeLinkProps) {
  const offen = useOnlineAnmeldungOffen();

  if (!offen) {
    return (
      <span
        role="link"
        aria-disabled="true"
        title={title ?? `Online-Anmeldeschluss: ${EVENT.onlineAnmeldeschlussAnzeige}`}
        className={cn(className, disabledClassName)}
      >
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={className} title={title} onClick={onClick}>
      {children}
    </Link>
  );
}

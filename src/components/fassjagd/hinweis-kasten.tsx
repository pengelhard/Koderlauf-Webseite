import type { ReactNode } from "react";
import Link from "next/link";
import { FassjagdFassBild } from "@/components/fassjagd/fass-bild";
import { VEREINS_WERTUNG } from "@/lib/anmeldungen/vereine";
import { EVENT } from "@/lib/event-config";
import { cn } from "@/lib/utils";

export const FASSJAGD_KASTEN_CLASS =
  "overflow-hidden rounded-3xl border border-koder-orange/35 bg-gradient-to-br from-koder-orange/15 to-forest-deep/10";

export function FassjagdPunkte({ className }: { className?: string }) {
  return (
    <ul className={cn("space-y-1.5 text-sm leading-relaxed text-muted-foreground sm:text-base", className)}>
      {VEREINS_WERTUNG.punkte.map((punkt) => (
        <li key={punkt}>{punkt}</li>
      ))}
    </ul>
  );
}

export function FassjagdHinweisKasten({
  title = `${VEREINS_WERTUNG.titel} ${EVENT.jahr}`,
  titleAs = "h2",
  linkHref = "/fassjagd",
  linkLabel = "Zur Fassjagd →",
  extra,
  className,
}: {
  title?: string;
  titleAs?: "h1" | "h2";
  linkHref?: string | null;
  linkLabel?: string;
  extra?: ReactNode;
  className?: string;
}) {
  const TitleTag = titleAs;
  return (
    <div className={cn(FASSJAGD_KASTEN_CLASS, className)}>
      <div className="flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:items-center sm:text-left sm:p-8">
        <FassjagdFassBild
          size={168}
          className="h-36 w-36 shrink-0 object-contain sm:h-40 sm:w-40"
        />
        <div className="min-w-0">
          <TitleTag
            className={cn(
              "font-extrabold tracking-tight",
              titleAs === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl",
            )}
          >
            {title}
          </TitleTag>
          <div className="mt-3">
            <FassjagdPunkte />
          </div>
          {extra}
          {linkHref ? (
            <Link
              href={linkHref}
              className="mt-4 inline-block text-sm font-semibold text-koder-orange hover:underline"
            >
              {linkLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

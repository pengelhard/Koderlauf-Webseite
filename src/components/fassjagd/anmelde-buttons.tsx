"use client";

import { User, Users } from "lucide-react";
import { AnmeldeLink } from "@/components/anmeldung/anmelde-link";
import { cn } from "@/lib/utils";

const CTA =
  "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-koder-orange px-5 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-md shadow-koder-orange/15 transition-colors hover:bg-koder-orange-bright";

export function FassjagdAnmeldeButtons({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", className)}>
      <AnmeldeLink href="/anmeldung/einzeln" className={CTA}>
        <User className="h-4 w-4" aria-hidden />
        Einzelanmeldung
      </AnmeldeLink>
      <AnmeldeLink href="/anmeldung/sammel" className={CTA}>
        <Users className="h-4 w-4" aria-hidden />
        Sammelanmeldung
      </AnmeldeLink>
    </div>
  );
}

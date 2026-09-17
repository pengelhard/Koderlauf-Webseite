"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";

/** Sticky CTA nur auf /sponsor-werden, sichtbar nach dem Hero. */
export function SponsorStickyAnfrage({ heroId = "sponsor-hero" }: { heroId?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroId]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-koder-orange/20 bg-background/95 p-3 backdrop-blur-sm md:hidden">
      <Link
        href="#anfrage"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-koder-orange px-6 py-3 text-sm font-bold uppercase tracking-widest text-white"
      >
        <Send size={16} aria-hidden />
        Anfrage
      </Link>
    </div>
  );
}

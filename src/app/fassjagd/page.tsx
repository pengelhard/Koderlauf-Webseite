import type { Metadata } from "next";
import { FassjagdTafel } from "@/components/fassjagd/tafel";
import { loadFassjagdBoard } from "@/lib/fassjagd/load";
import { VEREINS_WERTUNG } from "@/lib/anmeldungen/vereine";
import { EVENT } from "@/lib/event-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fassjagd",
  description: VEREINS_WERTUNG.hinweis,
};

export default async function FassjagdPage() {
  const board = await loadFassjagdBoard();
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
          Koderlauf {EVENT.jahr}
        </p>
        <div className="mt-6">
          <FassjagdTafel initial={board} />
        </div>
      </div>
    </div>
  );
}

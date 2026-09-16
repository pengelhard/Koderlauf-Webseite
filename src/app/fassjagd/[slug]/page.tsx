import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FassjagdVerein } from "@/components/fassjagd/verein-seite";
import { loadFassjagdBoard } from "@/lib/fassjagd/load";
import { findFassjagdClub } from "@/lib/fassjagd/ranking";
import { gapLine } from "@/lib/fassjagd/copy";
import { PROD_SITE_URL } from "@/lib/site-url";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const board = await loadFassjagdBoard();
  const club = findFassjagdClub(board, slug);
  if (!club) return { title: "Fassjagd" };
  const title = `${club.name} · Fassjagd`;
  const description = `Platz ${club.place ?? "–"} · ${club.total} Starter. ${gapLine(club)}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${PROD_SITE_URL}/fassjagd/${club.slug}`,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function FassjagdVereinPage({ params }: Params) {
  const { slug } = await params;
  const board = await loadFassjagdBoard();
  const club = findFassjagdClub(board, slug);
  if (!club) notFound();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FassjagdVerein initial={board} slug={slug} />
      </div>
    </div>
  );
}

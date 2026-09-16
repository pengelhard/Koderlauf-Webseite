import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { FassjagdVerein } from "@/components/fassjagd/verein-seite";
import { loadFassjagdBoard } from "@/lib/fassjagd/load";
import { findFassjagdClub } from "@/lib/fassjagd/ranking";
import { gapLine, teamOgImageUrl, teamShareUrl } from "@/lib/fassjagd/copy";
import { getSiteUrlFromHost, hostFromHeaders } from "@/lib/site-url";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const board = await loadFassjagdBoard();
  const club = findFassjagdClub(board, slug);
  if (!club) return { title: "Fassjagd" };
  const siteUrl = getSiteUrlFromHost(hostFromHeaders(await headers()));
  const pageUrl = teamShareUrl(siteUrl, club.slug);
  const ogImage = teamOgImageUrl(siteUrl, club.slug);
  const title = `${club.name} · Fassjagd`;
  const description = `Platz ${club.place ?? "–"} · ${club.total} Starter. ${gapLine(club)}`;
  const image = {
    url: ogImage,
    width: 1200,
    height: 630,
    alt: `${club.name} · Fassjagd`,
    type: "image/png" as const,
  };
  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      locale: "de_DE",
      siteName: "Koderlauf",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
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

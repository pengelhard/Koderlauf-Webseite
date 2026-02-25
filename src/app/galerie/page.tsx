import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MasonryGrid } from "@/components/gallery/masonry-grid";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Bilder und Highlights vom Koderlauf in Obermögersheim.",
};

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-28">
        <section className="section-shell">
          <div className="mx-auto max-w-7xl space-y-9">
            <div className="space-y-4">
              <p className="font-display text-sm uppercase tracking-[0.24em] text-primary-glow">Momente vom Lauf</p>
              <h1 className="text-balance">Galerie</h1>
              <p className="max-w-3xl text-text-secondary">
                Die besten Szenen aus dem Wald – als dynamisches Masonry-Grid mit smoothen Hover-Effekten.
              </p>
            </div>
            <MasonryGrid />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

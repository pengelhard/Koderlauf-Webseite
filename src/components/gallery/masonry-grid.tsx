"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
import type { GalleryEntry } from "@/lib/supabase/queries";

interface MasonryGridProps {
  items: GalleryEntry[];
}

export function MasonryGrid({ items }: MasonryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 xl:columns-5">
        {items.map((item, index) => (
          <motion.button
            type="button"
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 110, damping: 14, delay: index * 0.04 }}
            className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-3xl border border-primary-koder/15 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary-koder"
            onClick={() => setActiveIndex(index)}
            aria-label={`${item.title} vergrößern`}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={item.width}
              height={item.height}
              className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"
              placeholder="blur"
              blurDataURL={item.blurDataUrl}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark via-dark/70 to-transparent p-4 text-sm font-medium text-text-soft opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              {item.title}
            </span>
          </motion.button>
        ))}
      </div>

      <GalleryLightbox
        items={items}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onPrev={() =>
          setActiveIndex((prev) => {
            if (prev === null) return null;
            return prev === 0 ? items.length - 1 : prev - 1;
          })
        }
        onNext={() =>
          setActiveIndex((prev) => {
            if (prev === null) return null;
            return prev === items.length - 1 ? 0 : prev + 1;
          })
        }
      />
    </>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import type { GalleryEntry } from "@/lib/supabase/queries";

interface GalleryLightboxProps {
  items: GalleryEntry[];
  activeIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function GalleryLightbox({ items, activeIndex, onClose, onPrev, onNext }: GalleryLightboxProps) {
  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, onClose, onNext, onPrev]);

  return (
    <AnimatePresence>
      {activeItem ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-dark/92 p-4 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeItem.title} – Vollansicht`}
        >
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={onClose}
            className="absolute right-4 top-4 z-10"
            aria-label="Lightbox schließen"
          >
            <X className="h-5 w-5" />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={onPrev}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2"
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <motion.figure
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ type: "spring", stiffness: 170, damping: 20 }}
            className="relative max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-primary-koder/20 bg-dark-elevated"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 60) onPrev();
              if (info.offset.x < -60) onNext();
            }}
          >
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={activeItem.imageUrl}
                alt={activeItem.title}
                fill
                className="object-contain"
                sizes="100vw"
                placeholder="blur"
                blurDataURL={activeItem.blurDataUrl}
              />
            </div>
            <figcaption className="space-y-1 p-4 text-sm">
              <p className="font-display text-base font-bold text-white">{activeItem.title}</p>
              <p className="text-text-secondary">{activeItem.caption ?? "Koderlauf Galerie"}</p>
            </figcaption>
          </motion.figure>

          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={onNext}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2"
            aria-label="Nächstes Bild"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getGalleryImages, type GalleryImage } from "@/lib/data/gallery";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
};

const ASPECT_CLASSES = [
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-square",
];

export default function GaleriePage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGalleryImages().then((data) => {
      setImages(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            Koderlauf 2026
          </p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Galerie
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Die besten Momente des Koderlauf 2026 in Bildern.
          </p>
        </motion.div>

        {loading ? (
          <div className="mt-20 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-koder-orange border-t-transparent" />
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3"
          >
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                variants={item}
                whileHover={{ scale: 1.02 }}
                className="group relative mb-4 cursor-pointer overflow-hidden rounded-3xl break-inside-avoid"
              >
                <div className={`relative ${ASPECT_CLASSES[i % ASPECT_CLASSES.length]}`}>
                  <Image
                    src={img.url}
                    alt={img.beschreibung || "Koderlauf Foto"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-sm font-semibold text-white">
                      {img.beschreibung}
                    </p>
                    {img.distanz && (
                      <p className="mt-1 text-xs text-white/60">{img.distanz}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

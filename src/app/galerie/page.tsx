"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const demoImages = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80",
    alt: "Waldlauf Start",
    caption: "Der Start des Koderlauf 2026",
    aspect: "tall",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80",
    alt: "Läufer im Wald",
    caption: "Durch die Wälder von Obermögersheim",
    aspect: "wide",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1461897104016-0b3b00b1ea56?w=600&q=80",
    alt: "Zieleinlauf",
    caption: "Zieleinlauf mit Bestzeit",
    aspect: "square",
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1486218119243-13883505764c?w=600&q=80",
    alt: "Siegerehrung",
    caption: "Die Siegerehrung",
    aspect: "tall",
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=600&q=80",
    alt: "Strecke",
    caption: "Die wunderschöne Strecke",
    aspect: "wide",
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80",
    alt: "Gruppe",
    caption: "Gemeinsam ans Ziel",
    aspect: "square",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

export default function GaleriePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3"
        >
          {demoImages.map((img) => (
            <motion.div
              key={img.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              className="group relative mb-4 cursor-pointer overflow-hidden rounded-3xl break-inside-avoid"
              onClick={() => setSelectedImage(img.id)}
            >
              <div className="relative aspect-auto">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={img.aspect === "tall" ? 800 : img.aspect === "wide" ? 400 : 600}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-sm font-semibold text-white">
                    {img.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

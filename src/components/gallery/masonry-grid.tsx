"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const galleryItems = [
  {
    src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=80",
    title: "Startschuss im Morgendunst",
  },
  {
    src: "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=900&q=80",
    title: "Trail im Forst",
  },
  {
    src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80",
    title: "Zielsprint",
  },
  {
    src: "https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=900&q=80",
    title: "Community Vibes",
  },
  {
    src: "https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=900&q=80",
    title: "Kids Run",
  },
];

export function MasonryGrid() {
  return (
    <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 xl:columns-5">
      {galleryItems.map((item, index) => (
        <motion.figure
          key={item.src}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 110, damping: 14, delay: index * 0.04 }}
          className="group relative mb-4 break-inside-avoid overflow-hidden rounded-3xl border border-primary-koder/15"
        >
          <Image
            src={item.src}
            alt={item.title}
            width={900}
            height={1200}
            className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"
            placeholder="empty"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark via-dark/70 to-transparent p-4 text-sm font-medium text-text-soft opacity-0 transition duration-300 group-hover:opacity-100">
            {item.title}
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Timer, Camera, Users, TreePine } from "lucide-react";

const features = [
  {
    icon: Timer,
    title: "Live-Ergebnisse",
    description:
      "Echtzeit-Zeitmessung und Ranglisten direkt nach dem Zieleinlauf.",
  },
  {
    icon: Camera,
    title: "Foto-Galerie",
    description:
      "Professionelle Fotos und Community-Uploads von jedem Koderlauf.",
  },
  {
    icon: Users,
    title: "Online-Anmeldung",
    description:
      "Sichere Anmeldung mit Stripe-Zahlung und automatischer Startnummer.",
  },
  {
    icon: TreePine,
    title: "Wald-Erlebnis",
    description:
      "Ein einzigartiger Lauf durch die Wälder rund um Obermögersheim.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            Was erwartet dich
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-[3.5rem]">
            Mehr als nur ein Lauf
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ scale: 1.03 }}
              className="group rounded-3xl border border-border bg-card p-8 transition-all hover:border-koder-orange/30 hover:shadow-xl hover:shadow-koder-orange/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-koder-orange/10 text-koder-orange transition-colors group-hover:bg-koder-orange group-hover:text-white">
                <feature.icon size={24} />
              </div>
              <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

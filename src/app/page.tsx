import { Hero } from "@/components/sections/hero";
import { EventInfo } from "@/components/sections/event-info";
import { Features } from "@/components/sections/features";
import { Zeitplan } from "@/components/sections/zeitplan";
import { Stats } from "@/components/sections/stats";
import { Faq } from "@/components/sections/faq";

export default function Home() {
  return (
    <>
      <Hero />
      <EventInfo />
      <Features />
      <Zeitplan />
      <Stats />
      <Faq />
    </>
  );
}

import { Hero } from "@/components/sections/hero";
import { EventInfo } from "@/components/sections/event-info";
import { Features } from "@/components/sections/features";
import { Stats } from "@/components/sections/stats";

export default function Home() {
  return (
    <>
      <Hero />
      <EventInfo />
      <Features />
      <Stats />
    </>
  );
}

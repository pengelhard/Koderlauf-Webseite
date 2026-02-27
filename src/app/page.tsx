import { Hero } from "@/components/sections/hero";
import { EventInfo } from "@/components/sections/event-info";
import { Features } from "@/components/sections/features";
import { TShirtPromo } from "@/components/sections/tshirt-promo";
import { Stats } from "@/components/sections/stats";

export default function Home() {
  return (
    <>
      <Hero />
      <EventInfo />
      <Features />
      <TShirtPromo />
      <Stats />
    </>
  );
}

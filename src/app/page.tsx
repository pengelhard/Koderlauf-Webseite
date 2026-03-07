import { Hero } from "@/components/sections/hero";
import { TShirtPromo } from "@/components/sections/tshirt-promo";
import { EventInfo } from "@/components/sections/event-info";
import { Features } from "@/components/sections/features";
import { Stats } from "@/components/sections/stats";

export default function Home() {
  return (
    <>
      <Hero />
      <TShirtPromo />
      <EventInfo />
      <Features />
      <Stats />
    </>
  );
}

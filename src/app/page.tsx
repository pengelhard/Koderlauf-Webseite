import { Hero } from "@/components/sections/hero";
import { EventInfo } from "@/components/sections/event-info";
import { FassjagdPromo } from "@/components/sections/fassjagd-promo";
import { JubilaeumsProgramm } from "@/components/sections/jubilaeums-programm";
import { Features } from "@/components/sections/features";
import { Zeitplan } from "@/components/sections/zeitplan";
import { Stats } from "@/components/sections/stats";
import { Faq } from "@/components/sections/faq";
import { SponsoringPromo } from "@/components/sections/sponsoring-promo";

export default function Home() {
  return (
    <>
      <Hero />
      <EventInfo />
      <SponsoringPromo />
      <FassjagdPromo />
      <JubilaeumsProgramm />
      <Features />
      <Zeitplan />
      <Stats />
      <div id="faq">
        <Faq />
      </div>
    </>
  );
}

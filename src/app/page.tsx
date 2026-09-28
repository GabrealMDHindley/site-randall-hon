import { Hero } from "@/components/home/Hero";
import { StatsBand } from "@/components/home/StatsBand";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { ListingsPreview } from "@/components/home/ListingsPreview";
import { CalculatorTeaser } from "@/components/home/CalculatorTeaser";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactCTA } from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <ServicesOverview />
      <ListingsPreview />
      <div className="py-24">
        <CalculatorTeaser />
      </div>
      <Testimonials />
      <ContactCTA />
    </>
  );
}

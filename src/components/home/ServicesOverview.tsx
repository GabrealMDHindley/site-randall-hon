import { agent } from "@/content/agent";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";

export function ServicesOverview() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <SectionEyebrow>What Randall Handles</SectionEyebrow>
      <Reveal delay={0.05}>
        <h2 className="mt-4 max-w-2xl font-display text-3xl text-paper sm:text-4xl">
          A practice built on breadth, not just a single deal type.
        </h2>
      </Reveal>

      <StaggerGroup className="mt-14 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {agent.services.map((service) => (
          <StaggerItem key={service.title} className="bg-surface p-8">
            <h3 className="font-display text-xl text-brass">{service.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-paper/75">
              {service.description}
            </p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

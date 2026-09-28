import type { Metadata } from "next";
import { agent } from "@/content/agent";
import { PageHeader } from "@/components/ui/PageHeader";
import { PortraitPanel } from "@/components/about/PortraitPanel";
import { CredentialsRow } from "@/components/about/CredentialsRow";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { ContactCTA } from "@/components/home/ContactCTA";

export const metadata: Metadata = {
  title: "About",
  description: `Meet ${agent.name}, ${agent.title} with ${agent.brokerage} — serving Houston real estate since ${agent.practiceSince}.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Agent"
        title={`About ${agent.name}`}
        description={`${agent.title} · ${agent.brokerage}`}
      />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <Reveal>
            <PortraitPanel />
          </Reveal>

          <div>
            <Reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-brass">
                Houstonian Since {agent.houstonianSince}
              </p>
            </Reveal>
            <div className="mt-6 space-y-5">
              {agent.bio.map((paragraph, i) => (
                <Reveal key={i} delay={0.08 * (i + 1)}>
                  <p className="text-base leading-relaxed text-paper/85">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <CredentialsRow />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <SectionEyebrow>How Randall Can Help</SectionEyebrow>
        <Reveal delay={0.05}>
          <h2 className="mt-4 max-w-2xl font-display text-3xl text-paper sm:text-4xl">
            Services
          </h2>
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-8 sm:grid-cols-2">
          {agent.services.map((service) => (
            <StaggerItem
              key={service.title}
              className="border-l border-brass/40 pl-6"
            >
              <h3 className="font-display text-lg text-paper">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/70">
                {service.description}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal delay={0.1}>
          <div className="mt-16 border-t border-line pt-10">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Service Areas
            </p>
            <p className="mt-3 font-display text-xl text-paper">
              {agent.serviceAreas.join(" · ")}
            </p>
          </div>
        </Reveal>
      </section>

      <ContactCTA />
    </>
  );
}

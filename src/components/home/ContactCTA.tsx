import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { agent } from "@/content/agent";

export function ContactCTA() {
  return (
    <section className="border-t border-line bg-ground-deep">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-10">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-brass">
            Ready When You Are
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 text-balance font-display text-4xl text-paper sm:text-5xl">
            Let&rsquo;s talk about your next move in Houston real estate.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-4 max-w-md text-sm text-paper/70">
            {agent.name} — {agent.brokerage}. Buying, selling, leasing, or
            managing, reach out directly.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10 flex justify-center">
            <ButtonLink href="/contact" variant="filled">
              Get In Touch
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

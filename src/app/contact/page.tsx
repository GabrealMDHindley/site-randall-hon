import type { Metadata } from "next";
import { Suspense } from "react";
import { MessageCircle } from "lucide-react";
import { agent } from "@/content/agent";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${agent.name}, ${agent.title} with ${agent.brokerage} in Houston, TX.`,
};

export default function ContactPage() {
  const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(agent.officeAddress)}`;

  return (
    <>
      <PageHeader
        eyebrow="Get In Touch"
        title="Contact Randall"
        description="Buying, selling, leasing, or managing a property — reach out and Randall will follow up personally."
      />

      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-10">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Office</p>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block max-w-xs text-base leading-relaxed text-paper transition-colors hover:text-brass"
                >
                  {agent.officeAddress}
                </a>
              </div>

              {(agent.phone || agent.email) && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Direct</p>
                  {agent.phone && (
                    <a
                      href={`tel:${agent.phone}`}
                      className="mt-3 block text-base text-paper transition-colors hover:text-brass"
                    >
                      {agent.phone}
                    </a>
                  )}
                  {agent.email && (
                    <a
                      href={`mailto:${agent.email}`}
                      className="mt-1 block text-base text-paper transition-colors hover:text-brass"
                    >
                      {agent.email}
                    </a>
                  )}
                </div>
              )}

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">
                  Service Areas
                </p>
                <p className="mt-3 text-base text-paper">
                  {agent.serviceAreas.join(" · ")}
                </p>
              </div>

              <div className="flex items-start gap-3 border-t border-line pt-8 text-sm text-paper/70">
                <MessageCircle className="mt-0.5 shrink-0 text-brass" size={18} />
                <p>
                  Have a quick question? Use the chat button in the
                  bottom-right corner for an instant answer, any time.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

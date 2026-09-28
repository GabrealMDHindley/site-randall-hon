import { testimonials } from "@/content/testimonials";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";

// Renders nothing until real testimonials are supplied — never a placeholder
// header over empty space. See status.md needs-user list.
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <SectionEyebrow>In Their Words</SectionEyebrow>
      <Reveal delay={0.05}>
        <h2 className="mt-4 font-display text-3xl text-paper sm:text-4xl">
          Client Testimonials
        </h2>
      </Reveal>

      <StaggerGroup className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <StaggerItem
            key={t.name}
            className="border border-line bg-surface p-8"
          >
            <p className="font-display text-lg leading-relaxed text-paper/90">
              &ldquo;{t.quote}&rdquo;
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-brass">
              {t.name}
            </p>
            {t.context && (
              <p className="text-xs text-muted">{t.context}</p>
            )}
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

import { Calculator } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";

export function CalculatorTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10">
      <Reveal>
        <div className="relative overflow-hidden border border-brass/30 bg-surface px-8 py-16 text-center sm:px-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(198,161,91,0.4), transparent 60%)",
            }}
          />
          <Calculator className="mx-auto text-brass" size={32} strokeWidth={1.5} />
          <h2 className="mx-auto mt-6 max-w-xl font-display text-3xl text-paper sm:text-4xl">
            What Would It Cost You Each Month?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-paper/75">
            Enter any home price and get an instant estimate of your monthly
            payment and cash needed to close — then get a personalized
            number directly from Randall.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/calculator" variant="filled">
              Try the Calculator
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

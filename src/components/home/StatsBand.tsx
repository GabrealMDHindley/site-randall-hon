import { agent } from "@/content/agent";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";

export function StatsBand() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <StaggerGroup className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {agent.stats.map((stat) => (
            <StaggerItem key={stat.label} className="text-center lg:text-left">
              <p className="font-tabular font-display text-4xl text-brass sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">
                {stat.label}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

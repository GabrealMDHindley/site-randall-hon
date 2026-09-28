import Image from "next/image";
import { agent } from "@/content/agent";

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function PortraitPanel() {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden border border-brass/30 bg-surface">
      {agent.headshotUrl ? (
        <Image
          src={agent.headshotUrl}
          alt={agent.name}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
          priority
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(198,161,91,0.25), transparent 65%)",
            }}
          />
          <span className="relative border border-brass/50 px-10 py-8 font-display text-6xl text-brass">
            {initials(agent.name)}
          </span>
          <span className="relative text-[11px] uppercase tracking-[0.25em] text-muted">
            Portrait coming soon
          </span>
        </div>
      )}
    </div>
  );
}

import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function SectionEyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal>
      <p className={cn("text-xs uppercase tracking-[0.3em] text-brass", className)}>
        {children}
      </p>
    </Reveal>
  );
}

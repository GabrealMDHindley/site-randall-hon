import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-line px-8 py-16 text-center">
      <p className="font-display text-2xl text-paper">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
        {description}
      </p>
      {action && <div className="mt-8 flex justify-center">{action}</div>}
    </div>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BaseProps {
  children: ReactNode;
  variant?: "filled" | "outline" | "ghost";
  className?: string;
}

const VARIANT_CLASSES: Record<NonNullable<BaseProps["variant"]>, string> = {
  filled: "bg-brass text-ground hover:bg-brass-bright",
  outline: "border border-brass/60 text-brass hover:bg-brass hover:text-ground",
  ghost: "text-paper/85 hover:text-brass",
};

const BASE =
  "inline-flex items-center justify-center gap-2 px-7 py-3 text-xs uppercase tracking-[0.2em] transition-colors duration-300";

export function ButtonLink({
  href,
  children,
  variant = "filled",
  className,
  external,
}: BaseProps & { href: string; external?: boolean }) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(BASE, VARIANT_CLASSES[variant], className)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(BASE, VARIANT_CLASSES[variant], className)}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = "filled",
  className,
  type = "button",
  disabled,
  onClick,
}: BaseProps & {
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        BASE,
        VARIANT_CLASSES[variant],
        disabled && "opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}

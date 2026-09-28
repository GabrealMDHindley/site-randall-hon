"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { listings } from "@/content/listings";
import { formatCurrency } from "@/lib/utils";

const REASONS = [
  { value: "buying", label: "Buying a Home" },
  { value: "selling", label: "Selling a Home" },
  { value: "leasing", label: "Leasing / Renting" },
  { value: "property-management", label: "Property Management" },
  { value: "general", label: "General Inquiry" },
] as const;

function buildPrefill(searchParams: URLSearchParams) {
  const reason = searchParams.get("reason");
  const listingSlug = searchParams.get("listing");
  const listing = listingSlug ? listings.find((l) => l.slug === listingSlug) : undefined;
  const price = searchParams.get("price");
  const monthly = searchParams.get("monthly");

  let message = "";
  let reasonValue: (typeof REASONS)[number]["value"] = "general";

  if (reason === "listing") {
    reasonValue = "buying";
    message = listing
      ? `I'm interested in the listing at ${listing.address}, ${listing.city}. Please reach out with more information.`
      : "I'm interested in one of your listings. Please reach out with more information.";
  } else if (reason === "calculator") {
    reasonValue = "buying";
    const priceText = price ? formatCurrency(Number(price)) : "a home";
    const monthlyText = monthly ? ` (about ${formatCurrency(Number(monthly))}/mo estimated)` : "";
    message = `I used the affordability calculator on a ${priceText} home${monthlyText} and would like to talk through my options.`;
  } else if (reason && REASONS.some((r) => r.value === reason)) {
    reasonValue = reason as (typeof REASONS)[number]["value"];
  }

  return { reasonValue, message };
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const prefill = useMemo(() => buildPrefill(searchParams), [searchParams]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState(prefill.reasonValue);
  const [message, setMessage] = useState(prefill.message);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, reason, message }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="border border-brass/40 bg-surface p-10 text-center">
        <CheckCircle2 className="mx-auto text-brass" size={36} />
        <h3 className="mt-4 font-display text-2xl text-paper">Message Sent</h3>
        <p className="mt-2 text-sm text-paper/70">
          Thank you — your message has been received. Randall will be in
          touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-xs uppercase tracking-[0.15em] text-muted">
            Name
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full border border-line bg-ground-deep px-4 py-3 text-sm text-paper focus:border-brass focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-xs uppercase tracking-[0.15em] text-muted">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border border-line bg-ground-deep px-4 py-3 text-sm text-paper focus:border-brass focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="text-xs uppercase tracking-[0.15em] text-muted">
            Phone (optional)
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 w-full border border-line bg-ground-deep px-4 py-3 text-sm text-paper focus:border-brass focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="reason" className="text-xs uppercase tracking-[0.15em] text-muted">
            Reason for Contact
          </label>
          <select
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value as typeof reason)}
            className="mt-2 w-full border border-line bg-ground-deep px-4 py-3 text-sm text-paper focus:border-brass focus:outline-none"
          >
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-xs uppercase tracking-[0.15em] text-muted">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 w-full resize-none border border-line bg-ground-deep px-4 py-3 text-sm text-paper focus:border-brass focus:outline-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-brass-bright">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 bg-brass px-8 py-3 text-xs uppercase tracking-[0.2em] text-ground transition-colors hover:bg-brass-bright disabled:opacity-50"
      >
        {status === "loading" && <Loader2 className="animate-spin" size={16} />}
        Send Message
      </button>
    </form>
  );
}

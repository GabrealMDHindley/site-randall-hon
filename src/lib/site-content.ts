import { agent } from "@/content/agent";
import { listings } from "@/content/listings";
import { testimonials } from "@/content/testimonials";
import { faqs } from "@/content/faqs";
import { formatCurrency } from "@/lib/utils";

/**
 * Builds the grounding text the /api/chat assistant is given as context on every
 * request. This reads the exact same content/* modules that render the pages, so the
 * assistant's knowledge is never a separate, stale copy — it is current the moment a
 * content change (a new listing, a fixed phone number, a testimonial) is deployed.
 * That IS the "the chatbot learns when the site updates" mechanism: there is no
 * training step: every request rebuilds this text from the live site content.
 */
export function buildSiteKnowledge(): string {
  const sections: string[] = [];

  sections.push(
    [
      `Agent: ${agent.name}, ${agent.title}`,
      `Brokerage: ${agent.brokerage}`,
      `License: ${agent.license} (licensed since ${agent.licensedSince})`,
      `Houstonian since ${agent.houstonianSince}; serving Houston real estate since ${agent.practiceSince}.`,
      `Closed transactions: ${agent.closedTransactions}`,
      `Office address: ${agent.officeAddress}`,
      `Service areas: ${agent.serviceAreas.join(", ")}`,
      `Direct phone: ${agent.phone ?? "not published yet — direct the user to the Contact page form"}`,
      `Direct email: ${agent.email ?? "not published yet — direct the user to the Contact page form"}`,
      `Bio: ${agent.bio.join(" ")}`,
    ].join("\n"),
  );

  sections.push(
    "Services offered:\n" +
      agent.services.map((s) => `- ${s.title}: ${s.description}`).join("\n"),
  );

  if (agent.socialLinks.length > 0) {
    sections.push(
      "Social media:\n" +
        agent.socialLinks.map((s) => `- ${s.label}: ${s.url}`).join("\n"),
    );
  }

  if (listings.length > 0) {
    sections.push(
      "Current listings:\n" +
        listings
          .map((l) =>
            [
              `- ${l.address}, ${l.city}, ${l.state} ${l.zip}`,
              `  Status: ${l.status} | Price: ${formatCurrency(l.price)} | ${l.beds} bed / ${l.baths} bath / ${formatNumberSafe(l.sqft)} sqft`,
              `  Description: ${truncate(l.description, 600)}`,
              l.features.length ? `  Features: ${l.features.join(", ")}` : "",
              `  Page: /listings/${l.slug}`,
            ]
              .filter(Boolean)
              .join("\n"),
          )
          .join("\n"),
    );
  } else {
    sections.push(
      "Current listings: none are loaded on the site yet. If asked about available homes, " +
        "say the inventory is being updated and direct the user to the Contact page to reach " +
        "Randall directly for current availability. Never invent an address, price, or listing.",
    );
  }

  if (testimonials.length > 0) {
    sections.push(
      "Testimonials:\n" +
        testimonials.map((t) => `- "${t.quote}" — ${t.name}`).join("\n"),
    );
  }

  sections.push(
    "Frequently asked questions:\n" +
      faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n"),
  );

  sections.push(
    [
      "About the affordability calculator on this site (/calculator): a visitor enters any",
      "home price, down payment %, interest rate, loan term, property tax rate, insurance,",
      "and optional HOA dues, and it estimates the monthly payment (principal & interest,",
      "taxes, insurance, HOA) and the approximate cash needed at closing. It is clearly",
      "labeled as an estimate, not a loan offer. Each listing page also has the calculator",
      "pre-filled with that home's price.",
    ].join(" "),
  );

  return sections.join("\n\n---\n\n");
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

function formatNumberSafe(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

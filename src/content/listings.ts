// Listing inventory — empty until real listings are supplied (see status.md needs-user
// list; the source profile is CAPTCHA-blocked, see docs/scraping-playbook.md upstream).
//
// Add entries here — or wire this up to a future CMS/MLS feed — and the listings index,
// each listing detail page, the calculator pre-fill, and the chatbot's knowledge all pick
// them up automatically. No other code changes needed.

export interface Listing {
  slug: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  status: "For Sale" | "For Lease" | "Pending" | "Sold" | "Leased";
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  features: string[];
  /** Paths under /public/listings/<slug>/, e.g. "01.jpg" */
  photos: string[];
  sourceUrl?: string;
  scrapeDate?: string;
}

export const listings: Listing[] = [];

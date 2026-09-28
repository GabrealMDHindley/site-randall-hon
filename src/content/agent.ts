// Single source of truth for everything the site says about Randall Hon.
// Every page (and the /api/chat assistant, via lib/site-content.ts) reads from here —
// update this file and both the site and the chatbot's knowledge change together.

export interface Stat {
  label: string;
  value: string;
}

export interface Service {
  title: string;
  description: string;
}

export interface SocialLink {
  label: string;
  url: string;
  handle?: string;
}

export const agent = {
  name: "Randall Hon",
  title: "REALTOR®",
  brokerage: "My City Real Estate LLC",
  license: "TREC #357781",
  licensedSince: 1983,
  houstonianSince: 1964,
  practiceSince: 1980,
  closedTransactions: "2,500+",
  officeAddress: "801 Travis Street, Suite 2101, Houston, TX 77002",
  serviceAreas: ["Houston", "Harris County", "Greater Houston Area"],
  // None of these were confirmable from a public source — see status.md.
  // The site shows the Contact form instead of a phone/email until these are supplied.
  phone: null as string | null,
  email: null as string | null,
  headshotUrl: null as string | null,

  bio: [
    "Randall Hon has called Houston home since 1964 and has served the city's real estate community since 1980 — a career now spanning more than four decades. Licensed by the Texas Real Estate Commission since 1983 (TREC #357781), he has represented buyers and sellers in more than 2,500 closed transactions.",
    "Randall's practice is unusually broad. Alongside traditional buyer and seller representation, he has provided property management services since 1980, and works directly with investors, landlords, and tenants — offering consultation on locating, inspecting, financing, and closing from every side of the table. He is a REALTOR® with My City Real Estate LLC, based in downtown Houston.",
  ],

  stats: [
    { label: "Houstonian Since", value: "1964" },
    { label: "Licensed Since", value: "1983" },
    { label: "Closed Transactions", value: "2,500+" },
    { label: "Property Management Since", value: "1980" },
  ] satisfies Stat[],

  services: [
    {
      title: "Buyer Representation",
      description:
        "Locating, evaluating, and closing on the right home — from first search to final walkthrough.",
    },
    {
      title: "Seller Representation",
      description:
        "Pricing, positioning, and negotiating a sale from listing day to closing table.",
    },
    {
      title: "Leasing & Landlord/Tenant Representation",
      description:
        "Direct representation for landlords and tenants alike, built on decades of leasing experience.",
    },
    {
      title: "Property Management",
      description:
        "Hands-on portfolio and property management for investors, ongoing since 1980.",
    },
    {
      title: "Investor Consultation",
      description:
        "Guidance on locating, inspecting, and financing investment property across the Houston market.",
    },
  ] satisfies Service[],

  // Populate once real handles/URLs are confirmed — the footer and chatbot
  // automatically pick up whatever is here. Nothing is published until it's real.
  socialLinks: [] as SocialLink[],
};

export type Agent = typeof agent;

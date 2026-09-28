// General FAQ content — grounds the chatbot (and can back an on-page FAQ section) even
// before listings/testimonials exist. Keep answers accurate to what's verified in
// content/agent.ts; never invent a fact here that isn't backed elsewhere in content/.

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "What areas does Randall Hon serve?",
    answer:
      "Randall focuses on Houston and the greater Harris County area.",
  },
  {
    question: "Does Randall handle rentals as well as home sales?",
    answer:
      "Yes — Randall represents landlords and tenants directly, and has provided property management services since 1980, alongside traditional buyer and seller representation.",
  },
  {
    question: "How long has Randall been in real estate?",
    answer:
      "Randall has served Houston's real estate community since 1980 and has been a licensed REALTOR® since 1983 (TREC #357781) — over four decades of experience.",
  },
  {
    question: "How do I find out what a home will cost me each month?",
    answer:
      "Use the affordability calculator on this site — enter any home price and it estimates your monthly payment (principal, interest, taxes, insurance) and the cash you'd need at closing. It's an estimate, not a loan offer; contact Randall for a personalized number.",
  },
  {
    question: "Does this site show Randall's current listings?",
    answer:
      "The listing inventory here is being updated. Please use the Contact page to reach Randall directly for current availability.",
  },
];

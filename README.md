# Randall Hon — My City Real Estate LLC

Website for Randall Hon, REALTOR® with My City Real Estate LLC, Houston TX. Built with
Next.js (App Router), Tailwind CSS v4, React Three Fiber, GSAP ScrollTrigger, and Framer
Motion. Deployed on Vercel (project `site-randall-hon`, team SHAI), connected to this
repository's `main` branch — every push auto-deploys.

## Local development

```bash
npm install
npm run dev
```

## Everything the site shows lives in `src/content/`

This is the single source of truth — both the pages **and** the AI chat assistant read
from these files, so updating one file updates both at once, automatically, on the next
deploy:

- `src/content/agent.ts` — bio, stats, services, license info, contact details, social
  links. Set `phone`, `email`, and `headshotUrl` here once available; the Contact page,
  footer, and About page portrait all pick them up automatically.
- `src/content/listings.ts` — currently empty. Add a listing object (see the `Listing`
  type in that file) and drop its photos into `public/listings/<slug>/` (numbered
  `01.jpg`, `02.jpg`, …) — the listings index, the listing detail page, its calculator
  pre-fill, its OpenGraph image, and the chatbot's knowledge all light up with no other
  code changes.
- `src/content/testimonials.ts` — currently empty (the homepage section only renders
  once this is non-empty). Add `{ name, quote, context? }` entries.
- `src/content/faqs.ts` — general Q&A the chat assistant (and optionally a future FAQ
  section) draws on.

## Environment variables (set these in Vercel → Project → Settings → Environment Variables)

| Variable | Required for | Notes |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | The AI chat widget (bottom-right button) | Without it, the widget still opens and tells the visitor it isn't connected yet, instead of erroring. Get a key at [console.anthropic.com](https://console.anthropic.com). |
| `GHL_WEBHOOK_URL` | Forwarding Contact-page leads into Go High Level | Create an "Inbound Webhook" trigger in a GHL workflow and paste its URL here. Until set, submitted leads are still accepted (visitors see a normal success message) but only land in this project's Vercel function logs (Project → Logs) — set this promptly so real leads aren't just sitting in logs. |
| `NEXT_PUBLIC_SITE_URL` | Correct sitemap/OpenGraph URLs | Set to the production domain once one is chosen (defaults to the `.vercel.app` URL otherwise). |

After adding or changing an environment variable, redeploy (Vercel → Deployments → ⋯ →
Redeploy) for it to take effect.

## The AI chat assistant

`src/app/api/chat/route.ts` calls the Claude API (model: `claude-haiku-4-5`, chosen for
speed/cost on a support-chat workload — swap the `CHAT_MODEL` constant for
`claude-sonnet-5` if more reasoning power is ever needed) with a system prompt built by
`src/lib/site-content.ts`, which reads `src/content/*` directly. There is no separate
training step: every request is grounded in whatever is currently in those files, so a
content update takes effect for the chatbot the moment it's deployed, same as the pages.
It is instructed never to invent listings, prices, or contact details — only to answer
from what's actually in `src/content/`.

## The affordability calculator

`src/components/calculator/AffordabilityCalculator.tsx` + `src/lib/mortgage.ts`. Pure
client-side estimate (principal & interest, Texas-ballpark property tax and insurance
defaults, both editable) — not a loan offer, labeled as such on the page. Available at
`/calculator` and embedded (pre-filled with that home's price) on every listing detail
page.

## Deployment

Connected to Vercel; every push to `main` auto-deploys. No manual build step required.

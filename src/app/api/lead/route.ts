import { z } from "zod";
import { agent } from "@/content/agent";

export const runtime = "nodejs";

const LeadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("A valid email is required").max(320),
  phone: z.string().trim().max(40).optional().default(""),
  reason: z
    .enum(["buying", "selling", "leasing", "property-management", "general"])
    .default("general"),
  message: z.string().trim().min(1, "Message is required").max(4000),
});

/**
 * Lead capture, stubbed for a CRM webhook (built for Go High Level, but any
 * service that accepts an inbound JSON webhook works the same way).
 *
 * To go live: in Vercel, set the GHL_WEBHOOK_URL environment variable to the
 * inbound webhook URL from your Go High Level workflow ("Inbound Webhook"
 * trigger), then redeploy. Every submission is forwarded there as JSON.
 *
 * Until that env var is set, submissions are still accepted (the visitor
 * always sees a success confirmation) and are logged to this function's
 * Vercel logs (Project -> Logs in the Vercel dashboard) so no lead is
 * silently lost — but that is a stopgap, not a substitute for wiring up
 * the real webhook promptly.
 */
export async function POST(req: Request) {
  let parsed: z.infer<typeof LeadSchema>;
  try {
    const body = await req.json();
    parsed = LeadSchema.parse(body);
  } catch (err) {
    const message =
      err instanceof z.ZodError
        ? err.issues[0]?.message ?? "Invalid submission."
        : "Invalid submission.";
    return Response.json({ error: message }, { status: 400 });
  }

  const [firstName, ...rest] = parsed.name.split(" ");
  const lead = {
    ...parsed,
    firstName,
    lastName: rest.join(" "),
    source: `${agent.name} website`,
    submittedAt: new Date().toISOString(),
  };

  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) {
        console.error("GHL_WEBHOOK_URL responded with", res.status, await res.text());
      }
    } catch (err) {
      console.error("Failed to forward lead to GHL_WEBHOOK_URL:", err);
    }
  } else {
    console.log("New lead (GHL_WEBHOOK_URL not set — logged only):", lead);
  }

  return Response.json({ ok: true });
}

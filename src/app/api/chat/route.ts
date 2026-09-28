import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { buildSiteKnowledge } from "@/lib/site-content";
import { agent } from "@/content/agent";

export const runtime = "nodejs";

// Cost-conscious model choice for a public-facing support widget on a small business
// site: Haiku 4.5 is fast and inexpensive while being more than capable of grounded
// Q&A over a corpus this size. Swap to "claude-sonnet-5" in one place if more
// reasoning headroom is ever needed.
const CHAT_MODEL = "claude-haiku-4-5";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(20),
});

const NO_KEY_MESSAGE = `I don't have my live knowledge connected yet on this deployment (the site owner needs to add an ANTHROPIC_API_KEY). In the meantime, please reach ${agent.name} directly through the Contact page — he'll get back to you personally.`;

function buildSystemPrompt(): string {
  return [
    `You are the website assistant for ${agent.name}, a ${agent.title} with ${agent.brokerage} in Houston, Texas. You are a helpful assistant embedded on his website — you are not Randall himself, and you should make that clear if asked.`,
    "",
    "Ground every factual answer ONLY in the information below, which is generated directly from the live website's own content. Do not invent listings, prices, addresses, testimonials, phone numbers, emails, social media links, awards, or credentials that are not present below — if something isn't covered, say so plainly and direct the visitor to the Contact page.",
    "",
    "The affordability calculator results are estimates, not loan offers — if asked for financial, legal, or tax advice, give general orientation only and recommend the visitor speak with Randall, a licensed lender, or an attorney for anything binding.",
    "",
    "Keep answers conversational and concise (a few sentences, under ~120 words) unless the visitor clearly wants more detail. No markdown headers or bullet-heavy formatting — this is a chat widget, write like you're talking.",
    "",
    "=== LIVE WEBSITE CONTENT ===",
    buildSiteKnowledge(),
    "=== END LIVE WEBSITE CONTENT ===",
  ].join("\n");
}

export async function POST(req: Request) {
  let parsed: z.infer<typeof RequestSchema>;
  try {
    const body = await req.json();
    parsed = RequestSchema.parse(body);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(NO_KEY_MESSAGE, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const client = new Anthropic();
  const history = parsed.messages.slice(-12);

  let stream: ReturnType<Anthropic["messages"]["stream"]>;
  try {
    stream = client.messages.stream({
      model: CHAT_MODEL,
      max_tokens: 1024,
      system: buildSystemPrompt(),
      messages: history.map((m) => ({ role: m.role, content: m.content })),
    });
  } catch {
    return new Response(
      "Something went wrong reaching the assistant. Please try again or use the Contact page.",
      { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on("text", (text: string) => {
        controller.enqueue(encoder.encode(text));
      });
      stream.on("end", () => {
        controller.close();
      });
      stream.on("error", (err: Error) => {
        console.error("Chat stream error:", err);
        try {
          controller.enqueue(
            encoder.encode(
              "\n\nSorry, I lost my connection there. Please try again or use the Contact page.",
            ),
          );
        } finally {
          controller.close();
        }
      });
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

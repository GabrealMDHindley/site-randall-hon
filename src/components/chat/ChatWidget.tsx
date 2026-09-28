"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
import { agent } from "@/content/agent";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const GREETING: ChatMessage = {
  role: "assistant",
  content: `Hi, I'm the assistant for ${agent.name}'s site. Ask me about Randall's experience, services, service area, current listings, or how the affordability calculator works — I'll do my best to help, and point you to Randall directly for anything I can't answer.`,
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, reduce]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    // Reserve a spot for the streaming assistant reply.
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-12),
        }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "The assistant is unavailable right now.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }

      if (!acc.trim()) {
        throw new Error("The assistant is unavailable right now.");
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or use the contact form.";
      setError(message);
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: `${message} In the meantime, you're welcome to reach Randall directly through the Contact page.`,
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? "Close chat" : `Chat with ${agent.name}'s assistant`}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-brass/60 bg-ground shadow-[0_0_30px_rgba(198,161,91,0.25)] transition-colors hover:bg-surface sm:h-16 sm:w-16"
        whileHover={reduce ? undefined : { scale: 1.06 }}
        whileTap={reduce ? undefined : { scale: 0.94 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={reduce ? false : { opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={reduce ? undefined : { opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              <X className="text-brass" size={24} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={reduce ? false : { opacity: 0, rotate: 45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={reduce ? undefined : { opacity: 0, rotate: -45 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="text-brass" size={24} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="chat-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Chat with ${agent.name}'s assistant`}
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 z-50 flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-sm border border-line bg-surface shadow-2xl sm:right-6 sm:bottom-28"
          >
            <div className="flex items-center justify-between border-b border-line bg-surface-raised px-5 py-4">
              <div>
                <p className="font-display text-base text-paper">{agent.name}</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-brass">
                  AI Assistant
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-muted transition-colors hover:text-brass"
              >
                <X size={20} />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="brass-scroll flex-1 space-y-4 overflow-y-auto px-5 py-4"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] rounded-sm px-4 py-3 text-sm leading-relaxed",
                    m.role === "user"
                      ? "ml-auto bg-brass text-ground"
                      : "bg-ground-deep text-paper/90",
                  )}
                >
                  {m.content || (
                    <span className="inline-flex items-center gap-2 text-muted">
                      <Loader2 className="animate-spin" size={14} /> Thinking
                    </span>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="border-t border-line p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question…"
                  disabled={loading}
                  className="flex-1 rounded-sm border border-line bg-ground-deep px-3 py-2 text-sm text-paper placeholder:text-muted focus:border-brass focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-brass text-ground transition-opacity disabled:opacity-40"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-xs text-brass-bright">{error}</p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BackLink } from "../../components/BackLink";
import { useBank } from "../../lib/bank-context";
import { supportHref, supportLabel } from "../../lib/support";

type ChatMessage = { id: string; from: "me" | "agent"; text: string };

function SupportChat() {
  const params = useSearchParams();
  const live = params.get("live") === "1";
  const { state } = useBank();
  const contact = state.support;
  const href = supportHref(contact);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "hello", from: "agent", text: "Hi, this is support. How can we help today?" },
  ]);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, { id: `me_${Date.now()}`, from: "me", text }]);
    setDraft("");
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `ag_${Date.now()}`,
          from: "agent",
          text: href
            ? `A specialist can also reach you on ${supportLabel(contact)}.`
            : "A specialist is reviewing that in this chat.",
        },
      ]);
    }, 700);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <BackLink href="/profile" label="Settings" />
      <div>
        <h1 className="page-title">{live ? "Live support" : "Contact support"}</h1>
        <p className="page-sub">
          {contact?.value
            ? "Your admin set a preferred contact for this profile."
            : "Message us here, or start a live chat."}
        </p>
      </div>

      {contact?.value && href && (
        <a href={href} target="_blank" rel="noreferrer" className="soft-card block p-5 font-semibold text-[var(--blue)]">
          Open {supportLabel(contact)}
        </a>
      )}

      <section className="soft-card flex min-h-[380px] flex-col overflow-hidden">
        <div className="border-b border-[var(--line)] px-5 py-3 font-semibold text-[var(--navy)]">
          {live ? "Live chat" : "Support inbox"}
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((item) => (
            <div key={item.id} className={`flex ${item.from === "me" ? "justify-end" : "justify-start"}`}>
              <p className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${item.from === "me" ? "bg-[var(--blue)] text-white" : "bg-[var(--page)]"}`}>
                {item.text}
              </p>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <form onSubmit={send} className="flex gap-2 border-t border-[var(--line)] p-3">
          <input value={draft} onChange={(event) => setDraft(event.target.value)} className="field" placeholder="Type a message" />
          <button className="btn-primary shrink-0">Send</button>
        </form>
      </section>
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense fallback={<div className="soft-card p-6">Opening support…</div>}>
      <SupportChat />
    </Suspense>
  );
}

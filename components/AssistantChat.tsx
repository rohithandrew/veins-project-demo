"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { generateReply } from "@/lib/assistant";
import { IconSparkles, IconSend } from "./icons";

const SUGGESTIONS = [
  "Which materials are low on stock?",
  "Status of PO-002",
  "Add supplier dashboard insight to the main dashboard",
  "Add delivery timeline to dashboard",
  "Add PO status breakdown to dashboard",
];

export function AssistantChat({ variant = "page" }: { variant?: "page" | "panel" }) {
  const { assistantMessages, materials, suppliers, purchaseOrders, stockRequests, supplyRequests, dispatch } = useStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [assistantMessages]);

  function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    dispatch({ type: "ASSISTANT_ASK", text: trimmed });
    setInput("");
    const reply = generateReply(trimmed, { materials, suppliers, purchaseOrders, stockRequests, supplyRequests });
    setTimeout(() => {
      dispatch({ type: "ASSISTANT_REPLY", text: reply.text, addWidget: reply.addWidget, removeWidget: reply.removeWidget });
    }, reply.delayMs);
  }

  const heightClass = variant === "page" ? "h-[70vh]" : "h-[28rem]";

  return (
    <div className={`flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm ${heightClass}`}>
      {variant === "page" && (
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <IconSparkles width={16} height={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Vijaya AI Assistant</p>
            <p className="text-[11px] text-slate-400">Ask about stock, POs, suppliers — or customize your dashboard</p>
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {assistantMessages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.loading ? (
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-2.5 text-sm text-slate-500">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                </span>
              </div>
            ) : (
              <div
                className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "rounded-br-sm bg-blue-700 text-white"
                    : "rounded-bl-sm bg-slate-100 text-slate-700"
                }`}
              >
                {m.text}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 p-3">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the AI Assistant…"
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="submit"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-white hover:bg-blue-800"
            title="Send"
          >
            <IconSend width={16} height={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

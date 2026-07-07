"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { POCard } from "./POCard";
import { IconSparkles, IconSend, IconUpload } from "./icons";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text?: string;
  poId?: string;
  loading?: boolean;
}

let msgCounter = 0;
function mid() {
  msgCounter += 1;
  return `MSG-${msgCounter}`;
}

export function POUpload() {
  const { purchaseOrders } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: mid(),
      role: "assistant",
      text:
        "Hi Admin, I'm the Vijaya Electronics PO Assistant. Paste a PO reference (e.g. \"parse PO-002\") or describe an order, and I'll extract the Kit → Component → BOM structure for review.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = { id: mid(), role: "user", text: trimmed };
    const loadingId = mid();
    setMessages((m) => [...m, userMsg, { id: loadingId, role: "assistant", loading: true }]);
    setInput("");

    const match = purchaseOrders.find((po) =>
      trimmed.toUpperCase().includes(po.poNumber)
    );

    setTimeout(() => {
      setMessages((m) => {
        const withoutLoading = m.filter((x) => x.id !== loadingId);
        if (match) {
          return [
            ...withoutLoading,
            {
              id: mid(),
              role: "assistant",
              text: `Parsed ${match.poNumber} for ${match.clientName}. Found ${match.kits.length} kit(s). Review the breakdown below before releasing to production.`,
            },
            { id: mid(), role: "assistant", poId: match.id },
          ];
        }
        return [
          ...withoutLoading,
          {
            id: mid(),
            role: "assistant",
            text:
              "I couldn't match that to a known PO. Try referencing PO-001, PO-002, or PO-003, or upload a PO document.",
          },
        ];
      });
    }, 900);
  }

  function handleUploadClick() {
    handleSend("Uploaded PO document — please parse PO-003");
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <div className="lg:col-span-3 flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm h-[70vh]">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <IconSparkles width={16} height={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">PO Parsing Assistant</p>
            <p className="text-[11px] text-slate-400">Extracts Kit → Component → BOM structure</p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.loading ? (
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-2.5 text-sm text-slate-500">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                  </span>
                </div>
              ) : m.poId ? (
                <div className="w-full max-w-[92%]">
                  <POCard po={purchaseOrders.find((p) => p.id === m.poId)!} />
                </div>
              ) : (
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
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
            {purchaseOrders.map((po) => (
              <button
                key={po.id}
                onClick={() => handleSend(`Parse ${po.poNumber}`)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Parse {po.poNumber}
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
            <button
              type="button"
              onClick={handleUploadClick}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
              title="Upload PO document"
            >
              <IconUpload width={16} height={16} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe or reference a PO (e.g. parse PO-001)…"
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

      <div className="lg:col-span-2 space-y-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">PO Structure</h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Every purchase order breaks down as:
          </p>
          <div className="mt-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 font-mono leading-relaxed">
            PO_ID<br />
            &nbsp;&nbsp;└─ Kit<br />
            &nbsp;&nbsp;&nbsp;&nbsp;└─ Component<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─ BOM (raw materials)
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">All Purchase Orders</h3>
          <div className="mt-2 space-y-2">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-xs">
                <span className="font-medium text-slate-700">
                  {po.poNumber} · {po.clientName}
                </span>
                <span className="text-slate-400 capitalize">{po.status.replace("_", " ")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

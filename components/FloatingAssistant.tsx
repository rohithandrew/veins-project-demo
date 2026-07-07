"use client";

import { useState } from "react";
import { AssistantChat } from "./AssistantChat";
import { IconSparkles, IconX } from "./icons";

export function FloatingAssistant({ hidden }: { hidden?: boolean }) {
  const [open, setOpen] = useState(false);

  if (hidden) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[150] flex flex-col items-end gap-3">
      {open && (
        <div className="w-[22rem] max-w-[calc(100vw-2.5rem)] rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <IconSparkles width={16} height={16} />
              <p className="text-sm font-semibold">AI Assistant</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-300 hover:text-white" aria-label="Close assistant">
              <IconX width={16} height={16} />
            </button>
          </div>
          <AssistantChat variant="panel" />
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg hover:bg-blue-800 transition-colors"
        aria-label="Toggle AI Assistant"
      >
        {open ? <IconX width={22} height={22} /> : <IconSparkles width={22} height={22} />}
      </button>
    </div>
  );
}

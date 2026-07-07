"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { ViewKey } from "@/lib/types";
import { IconBell, IconLogout, IconChevronRight } from "./icons";

const titles: Record<ViewKey, string> = {
  dashboard: "Dashboard",
  "po-upload": "PO Upload & Processing",
  production: "Production",
  inventory: "Inventory Management",
  supplier: "Supplier Dashboard",
  assistant: "AI Assistant",
};

export function Topbar({ current }: { current: ViewKey }) {
  const { auditLog } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 py-3.5">
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Vijaya Electronics</span>
          <IconChevronRight width={13} height={13} />
          <span className="text-slate-600 font-medium">{titles[current]}</span>
        </div>
        <h1 className="mt-0.5 text-lg font-semibold text-slate-900">{titles[current]}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <IconBell width={19} height={19} />
            {auditLog.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-800">
                  Activity Log
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {auditLog.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-slate-400">No activity yet.</p>
                  ) : (
                    auditLog.slice(0, 10).map((a) => (
                      <div key={a.id} className="border-b border-slate-50 px-4 py-2.5 last:border-0">
                        <p className="text-xs text-slate-700 leading-snug">{a.message}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">{a.timestamp}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2.5 border-l border-slate-200 pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            A
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-slate-800">Admin</p>
            <p className="text-[11px] text-slate-400">Inventory Controller</p>
          </div>
        </div>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          aria-label="Logout"
          title="Logout"
        >
          <IconLogout width={17} height={17} />
        </button>
      </div>
    </header>
  );
}

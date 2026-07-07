"use client";

import React from "react";
import Image from "next/image";
import type { ViewKey } from "@/lib/types";
import { IconDashboard, IconUpload, IconFactory, IconBox, IconTruck, IconSparkles } from "./icons";

const items: { key: ViewKey; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { key: "dashboard", label: "Dashboard", icon: IconDashboard },
  { key: "po-upload", label: "PO Upload & Processing", icon: IconUpload },
  { key: "production", label: "Production", icon: IconFactory },
  { key: "inventory", label: "Inventory Management", icon: IconBox },
  { key: "supplier", label: "Supplier Dashboard", icon: IconTruck },
  { key: "assistant", label: "AI Assistant", icon: IconSparkles },
];

export function Sidebar({ current, onNavigate }: { current: ViewKey; onNavigate: (v: ViewKey) => void }) {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-slate-900 text-slate-200">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white p-1">
          <Image src="/vijaya-logo.png" alt="Vijaya Electronics" width={36} height={24} className="h-auto w-full object-contain" priority />
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-tight">Vijaya Electronics</p>
          <p className="text-[11px] text-slate-400 leading-tight">AI Inventory System</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(({ key, label, icon: Icon }) => {
          const active = current === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon width={18} height={18} className="shrink-0" />
              <span className="text-left">{label}</span>
            </button>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-white/10 text-[11px] text-slate-500">
        Vijaya Electronics · Component Manufacturing
        <br />
        v1.0 Demo Build
      </div>
    </aside>
  );
}

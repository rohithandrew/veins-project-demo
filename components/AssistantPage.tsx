"use client";

import { AssistantChat } from "./AssistantChat";
import { IconBox, IconFactory, IconTruck, IconSparkles } from "./icons";

const capabilities = [
  { icon: IconBox, text: "Check current stock and low-stock materials" },
  { icon: IconFactory, text: "Look up the status of any purchase order" },
  { icon: IconTruck, text: "Get supplier contact details and reliability" },
  { icon: IconSparkles, text: "Customize this app — e.g. add insight widgets to your Dashboard" },
];

export function AssistantPage() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <AssistantChat variant="page" />
      </div>
      <div className="lg:col-span-2 space-y-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">What I can help with</h3>
          <div className="mt-3 space-y-3">
            {capabilities.map((c, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <c.icon width={14} height={14} />
                </div>
                {c.text}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Dashboard widgets you can request</h3>
          <ul className="mt-2 space-y-1.5 text-xs text-slate-500 list-disc list-inside">
            <li>Supplier Insights</li>
            <li>Delivery Timeline</li>
            <li>Pending Stock Requests</li>
            <li>PO Status Breakdown</li>
            <li>Critical Materials</li>
          </ul>
          <p className="mt-2 text-xs text-slate-400">
            Just say "add [name] to dashboard" — or "remove [name]" to take it back off.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Always available</h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            This assistant is also available as a floating chat button on every page, so you can ask
            questions without leaving your current screen. Your conversation carries over between pages.
          </p>
        </div>
      </div>
    </div>
  );
}

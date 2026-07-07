"use client";

import { useStore } from "@/lib/store";
import type { POStatus } from "@/lib/types";
import { IconFactory, IconX, IconSparkles } from "./icons";

const STATUS_META: { key: POStatus; label: string; barColor: string }[] = [
  { key: "draft", label: "Draft", barColor: "bg-slate-400" },
  { key: "pending", label: "Ready for Production", barColor: "bg-amber-400" },
  { key: "in_progress", label: "In Progress", barColor: "bg-blue-500" },
  { key: "completed", label: "Completed", barColor: "bg-emerald-500" },
];

export function PoStatusBreakdownWidget() {
  const { purchaseOrders, dispatch } = useStore();
  const total = purchaseOrders.length || 1;

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-5 shadow-sm relative">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <IconFactory width={16} height={16} className="text-blue-600" /> PO Status Breakdown
          <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
            <IconSparkles width={10} height={10} /> Added by AI Assistant
          </span>
        </h2>
        <button
          onClick={() => dispatch({ type: "REMOVE_DASHBOARD_WIDGET", widget: "po-status-breakdown" })}
          className="text-slate-400 hover:text-slate-600"
          aria-label="Remove widget"
          title="Remove widget"
        >
          <IconX width={15} height={15} />
        </button>
      </div>
      <div className="space-y-3">
        {STATUS_META.map((s) => {
          const count = purchaseOrders.filter((po) => po.status === s.key).length;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={s.key}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">{s.label}</span>
                <span className="text-slate-500">{count} PO(s)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white overflow-hidden">
                <div className={`h-full rounded-full ${s.barColor}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

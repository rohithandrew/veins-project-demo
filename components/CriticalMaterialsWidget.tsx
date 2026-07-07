"use client";

import { useStore } from "@/lib/store";
import { Badge } from "./StatusBadge";
import { IconAlert, IconX, IconSparkles } from "./icons";

export function CriticalMaterialsWidget() {
  const { materials, dispatch } = useStore();
  const critical = materials.filter((m) => m.currentStock <= m.reorderPoint * 0.6);

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5 shadow-sm relative">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <IconAlert width={16} height={16} className="text-rose-600" /> Critical Materials
          <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
            <IconSparkles width={10} height={10} /> Added by AI Assistant
          </span>
        </h2>
        <button
          onClick={() => dispatch({ type: "REMOVE_DASHBOARD_WIDGET", widget: "critical-materials" })}
          className="text-slate-400 hover:text-slate-600"
          aria-label="Remove widget"
          title="Remove widget"
        >
          <IconX width={15} height={15} />
        </button>
      </div>
      {critical.length === 0 ? (
        <p className="text-sm text-slate-400 py-4 text-center">No materials critically low right now.</p>
      ) : (
        <div className="space-y-2">
          {critical.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-lg bg-white px-3.5 py-2.5 text-sm">
              <div>
                <p className="font-medium text-slate-800">{m.name}</p>
                <p className="text-xs text-slate-400">
                  {m.currentStock} {m.unit} — below {Math.round(m.reorderPoint * 0.6)} {m.unit} threshold
                </p>
              </div>
              <Badge color="red">Critical</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { IconAlert, IconX, IconChevronRight } from "./icons";

export function GlobalLowStockBar() {
  const { materials, dispatch } = useStore();
  const [dismissed, setDismissed] = useState(false);
  const lowStock = materials.filter((m) => m.currentStock <= m.reorderPoint);

  if (lowStock.length === 0 || dismissed) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 mb-4">
      <IconAlert width={16} height={16} className="shrink-0 text-orange-500" />
      <div className="flex flex-1 flex-wrap items-center gap-2 overflow-x-auto">
        <span className="text-xs font-semibold text-orange-800 shrink-0">
          {lowStock.length} material(s) low on stock:
        </span>
        {lowStock.map((m) => (
          <span
            key={m.id}
            className="flex items-center gap-2 rounded-full bg-white border border-orange-200 pl-2.5 pr-1 py-1 text-xs text-slate-700 shrink-0"
          >
            {m.name}
            <span className="text-slate-400">
              ({m.currentStock}/{m.reorderPoint} {m.unit})
            </span>
            <button
              onClick={() => dispatch({ type: "OPEN_SUPPLY_MODAL", materialId: m.id })}
              className="flex items-center gap-0.5 rounded-full bg-rose-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-rose-700"
            >
              Request Supply <IconChevronRight width={10} height={10} />
            </button>
          </span>
        ))}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-orange-400 hover:text-orange-600"
        aria-label="Dismiss"
      >
        <IconX width={14} height={14} />
      </button>
    </div>
  );
}

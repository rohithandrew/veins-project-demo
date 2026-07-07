"use client";

import { useStore } from "@/lib/store";
import { IconBox, IconX, IconSparkles } from "./icons";

export function PendingRequestsWidget() {
  const { stockRequests, materials, dispatch } = useStore();
  const pending = stockRequests.filter((r) => r.status === "pending");

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm relative">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <IconBox width={16} height={16} className="text-amber-600" /> Pending Stock Requests
          <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
            <IconSparkles width={10} height={10} /> Added by AI Assistant
          </span>
        </h2>
        <button
          onClick={() => dispatch({ type: "REMOVE_DASHBOARD_WIDGET", widget: "pending-requests" })}
          className="text-slate-400 hover:text-slate-600"
          aria-label="Remove widget"
          title="Remove widget"
        >
          <IconX width={15} height={15} />
        </button>
      </div>
      {pending.length === 0 ? (
        <p className="text-sm text-slate-400 py-4 text-center">No requests awaiting action.</p>
      ) : (
        <div className="space-y-2">
          {pending.map((r) => {
            const material = materials.find((m) => m.id === r.materialId);
            const sufficient = !!material && material.currentStock >= r.qtyRequested;
            return (
              <div key={r.id} className="flex items-center justify-between rounded-lg bg-white px-3.5 py-2.5 text-sm">
                <div>
                  <p className="font-medium text-slate-800">
                    {r.materialName} <span className="text-slate-400 font-normal">×{r.qtyRequested} {r.unit}</span>
                  </p>
                  <p className="text-xs text-slate-400">{r.id} · for {r.poNumber}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    sufficient ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {sufficient ? "Stock available" : "Insufficient stock"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

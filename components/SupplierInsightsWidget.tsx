"use client";

import { useStore } from "@/lib/store";
import { IconTruck, IconX, IconSparkles } from "./icons";

export function SupplierInsightsWidget() {
  const { suppliers, supplyRequests, dispatch } = useStore();

  const avgRating = suppliers.reduce((s, sup) => s + sup.rating, 0) / suppliers.length;
  const avgResponse = suppliers.reduce((s, sup) => s + sup.avgResponseTimeHours, 0) / suppliers.length;
  const topSupplier = [...suppliers].sort((a, b) => b.rating - a.rating)[0];
  const pending = supplyRequests.filter((s) => s.status === "requested").length;
  const delivered = supplyRequests.filter((s) => s.status === "delivered").length;

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-5 shadow-sm relative">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <IconTruck width={16} height={16} className="text-blue-600" /> Supplier Insights
          <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
            <IconSparkles width={10} height={10} /> Added by AI Assistant
          </span>
        </h2>
        <button
          onClick={() => dispatch({ type: "REMOVE_DASHBOARD_WIDGET", widget: "supplier-insights" })}
          className="text-slate-400 hover:text-slate-600"
          aria-label="Remove widget"
          title="Remove widget"
        >
          <IconX width={15} height={15} />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-slate-500">Avg. Reliability</p>
          <p className="mt-0.5 text-lg font-semibold text-slate-900">{avgRating.toFixed(1)} / 5</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Avg. Response Time</p>
          <p className="mt-0.5 text-lg font-semibold text-slate-900">{avgResponse.toFixed(1)}h</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Top Supplier</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">{topSupplier?.companyName}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Supply Requests</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">
            {pending} pending · {delivered} delivered
          </p>
        </div>
      </div>
    </div>
  );
}

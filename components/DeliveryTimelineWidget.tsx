"use client";

import { useStore } from "@/lib/store";
import { IconClock, IconX, IconSparkles } from "./icons";

function daysUntil(dateStr: string) {
  const target = new Date(dateStr).getTime();
  const now = new Date("2026-07-07").getTime();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export function DeliveryTimelineWidget() {
  const { purchaseOrders, dispatch } = useStore();
  const upcoming = [...purchaseOrders]
    .filter((po) => po.status !== "completed")
    .sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime());

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-5 shadow-sm relative">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <IconClock width={16} height={16} className="text-blue-600" /> Delivery Timeline
          <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
            <IconSparkles width={10} height={10} /> Added by AI Assistant
          </span>
        </h2>
        <button
          onClick={() => dispatch({ type: "REMOVE_DASHBOARD_WIDGET", widget: "delivery-timeline" })}
          className="text-slate-400 hover:text-slate-600"
          aria-label="Remove widget"
          title="Remove widget"
        >
          <IconX width={15} height={15} />
        </button>
      </div>
      {upcoming.length === 0 ? (
        <p className="text-sm text-slate-400 py-4 text-center">No upcoming deliveries.</p>
      ) : (
        <div className="space-y-2">
          {upcoming.map((po) => {
            const days = daysUntil(po.deliveryDate);
            const urgent = days < 5;
            const soon = days >= 5 && days < 10;
            return (
              <div key={po.id} className="flex items-center justify-between rounded-lg bg-white px-3.5 py-2.5 text-sm">
                <div>
                  <p className="font-medium text-slate-800">
                    {po.poNumber} <span className="text-slate-400 font-normal">· {po.clientName}</span>
                  </p>
                  <p className="text-xs text-slate-400">{po.deliveryDate}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    urgent ? "bg-rose-100 text-rose-700" : soon ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {days >= 0 ? `${days}d left` : "overdue"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

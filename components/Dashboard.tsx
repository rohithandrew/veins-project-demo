"use client";

import React from "react";
import { useStore } from "@/lib/store";
import type { ViewKey } from "@/lib/types";
import type { DashboardWidgetKey } from "@/lib/types";
import { POStatusBadge, StockStatusBadge } from "./StatusBadge";
import { SupplierInsightsWidget } from "./SupplierInsightsWidget";
import { DeliveryTimelineWidget } from "./DeliveryTimelineWidget";
import { PendingRequestsWidget } from "./PendingRequestsWidget";
import { PoStatusBreakdownWidget } from "./PoStatusBreakdownWidget";
import { CriticalMaterialsWidget } from "./CriticalMaterialsWidget";
import { IconBox, IconFactory, IconAlert, IconUsers, IconChevronRight } from "./icons";

const WIDGET_COMPONENTS: Record<DashboardWidgetKey, React.FC> = {
  "supplier-insights": SupplierInsightsWidget,
  "delivery-timeline": DeliveryTimelineWidget,
  "pending-requests": PendingRequestsWidget,
  "po-status-breakdown": PoStatusBreakdownWidget,
  "critical-materials": CriticalMaterialsWidget,
};

function KpiCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}>
          <Icon width={18} height={18} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export function Dashboard({ onNavigate }: { onNavigate: (v: ViewKey) => void }) {
  const { purchaseOrders, stockRequests, materials, suppliers, dashboardWidgets } = useStore();

  const pendingRequests = stockRequests.filter((r) => r.status === "pending").length;
  const lowStock = materials.filter((m) => m.currentStock < m.reorderPoint);
  const totalStockUnits = materials.reduce((sum, m) => sum + m.currentStock, 0);
  const healthyPct = Math.round(((materials.length - lowStock.length) / materials.length) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Purchase Orders" value={purchaseOrders.length} icon={IconFactory} accent="bg-blue-50 text-blue-600" />
        <KpiCard label="Pending Requests" value={pendingRequests} icon={IconBox} accent="bg-amber-50 text-amber-600" />
        <KpiCard label="Low Stock Alerts" value={lowStock.length} icon={IconAlert} accent="bg-rose-50 text-rose-600" />
        <KpiCard label="Total Suppliers" value={suppliers.length} icon={IconUsers} accent="bg-emerald-50 text-emerald-600" />
      </div>

      {dashboardWidgets.length > 0 && (
        <div className="space-y-4">
          {dashboardWidgets.map((key) => {
            const Widget = WIDGET_COMPONENTS[key];
            return <Widget key={key} />;
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Recent Purchase Orders</h2>
            <button
              onClick={() => onNavigate("production")}
              className="flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline"
            >
              View all <IconChevronRight width={13} height={13} />
            </button>
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {po.poNumber} · {po.clientName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {po.kits.length} kit(s) · Delivery {po.deliveryDate}
                  </p>
                </div>
                <POStatusBadge status={po.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Stock Health</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <span className="text-lg font-semibold text-slate-800">{healthyPct}%</span>
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <p>
                <span className="font-semibold text-slate-800">{materials.length}</span> materials tracked
              </p>
              <p>
                <span className="font-semibold text-slate-800">{totalStockUnits.toLocaleString()}</span> total units in stock
              </p>
              <p>
                <span className="font-semibold text-rose-600">{lowStock.length}</span> below reorder point
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("inventory")}
            className="mt-4 w-full rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Go to Inventory
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Low Stock Snapshot</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400">
                <th className="pb-2 font-medium">Material</th>
                <th className="pb-2 font-medium">Current Stock</th>
                <th className="pb-2 font-medium">Reorder Point</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {materials.map((m) => (
                <tr key={m.id}>
                  <td className="py-2.5 text-slate-700">{m.name}</td>
                  <td className="py-2.5 text-slate-600">
                    {m.currentStock} {m.unit}
                  </td>
                  <td className="py-2.5 text-slate-600">
                    {m.reorderPoint} {m.unit}
                  </td>
                  <td className="py-2.5">
                    <StockStatusBadge low={m.currentStock < m.reorderPoint} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

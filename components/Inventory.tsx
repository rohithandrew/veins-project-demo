"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { RequestStatusBadge, StockStatusBadge, Badge } from "./StatusBadge";
import { ConfirmDialog } from "./ConfirmDialog";
import { IconAlert, IconCheck, IconX, IconBox } from "./icons";

type SectionKey = "overview" | "requests" | "alerts";

export function Inventory() {
  const { materials, suppliers, stockRequests, inwardRecords, outwardRecords, dispatch } = useStore();
  const [section, setSection] = useState<SectionKey>("overview");
  const [confirm, setConfirm] = useState<{ type: "accept" | "reject"; requestId: string } | null>(null);

  const lowStock = materials.filter((m) => m.currentStock <= m.reorderPoint);
  const atRisk = materials.filter((m) => m.currentStock <= m.reorderPoint * 0.6);
  const pendingRequests = stockRequests.filter((r) => r.status === "pending");
  const historyRequests = stockRequests.filter((r) => r.status !== "pending");

  function supplierName(id: string) {
    return suppliers.find((s) => s.id === id)?.companyName ?? "—";
  }

  const tabs: { key: SectionKey; label: string }[] = [
    { key: "overview", label: "Stock Overview" },
    { key: "requests", label: "Raised Requests" },
    { key: "alerts", label: "Low Stock Alerts" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setSection(t.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              section === t.key ? "bg-blue-700 text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            {t.label}
            {t.key === "requests" && pendingRequests.length > 0 && (
              <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                {pendingRequests.length}
              </span>
            )}
            {t.key === "alerts" && lowStock.length > 0 && (
              <span className="ml-2 rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700">
                {lowStock.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {section === "overview" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">Current Stock Levels</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                    <th className="pb-2 font-medium">Material</th>
                    <th className="pb-2 font-medium">Current Qty</th>
                    <th className="pb-2 font-medium">Reorder Point</th>
                    <th className="pb-2 font-medium">Supplier</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {materials.map((m) => (
                    <tr key={m.id}>
                      <td className="py-2.5 text-slate-700">{m.name}</td>
                      <td className="py-2.5 text-slate-600">{m.currentStock} {m.unit}</td>
                      <td className="py-2.5 text-slate-600">{m.reorderPoint} {m.unit}</td>
                      <td className="py-2.5 text-slate-600">{supplierName(m.supplierId)}</td>
                      <td className="py-2.5"><StockStatusBadge low={m.currentStock <= m.reorderPoint} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-800 mb-3">Inward Materials</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                      <th className="pb-2 font-medium">Material</th>
                      <th className="pb-2 font-medium">Qty</th>
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">Supplier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {inwardRecords.map((r) => (
                      <tr key={r.id}>
                        <td className="py-2 text-slate-700">{r.materialName}</td>
                        <td className="py-2 text-slate-600">{r.qty} {r.unit}</td>
                        <td className="py-2 text-slate-600">{r.date}</td>
                        <td className="py-2 text-slate-600">{r.supplierName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-800 mb-3">Outward Materials</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                      <th className="pb-2 font-medium">Material</th>
                      <th className="pb-2 font-medium">Qty</th>
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">PO Ref</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {outwardRecords.map((r) => (
                      <tr key={r.id}>
                        <td className="py-2 text-slate-700">{r.materialName}</td>
                        <td className="py-2 text-slate-600">{r.qty} {r.unit}</td>
                        <td className="py-2 text-slate-600">{r.date}</td>
                        <td className="py-2 text-slate-600">{r.poNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {section === "requests" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">Requests Awaiting Action</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                    <th className="pb-2 font-medium">Request ID</th>
                    <th className="pb-2 font-medium">PO Ref</th>
                    <th className="pb-2 font-medium">Material</th>
                    <th className="pb-2 font-medium">Qty Requested</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Stock Level</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pendingRequests.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-slate-400">No pending requests.</td>
                    </tr>
                  )}
                  {pendingRequests.map((r) => {
                    const material = materials.find((m) => m.id === r.materialId);
                    const sufficient = !!material && material.currentStock >= r.qtyRequested;
                    return (
                      <tr key={r.id}>
                        <td className="py-2.5 text-slate-500">{r.id}</td>
                        <td className="py-2.5 text-slate-700 font-medium">{r.poNumber}</td>
                        <td className="py-2.5 text-slate-700">{r.materialName}</td>
                        <td className="py-2.5 text-slate-600">{r.qtyRequested} {r.unit}</td>
                        <td className="py-2.5 text-slate-600">{r.dateRequested}</td>
                        <td className="py-2.5 text-slate-600">{material?.currentStock ?? 0} {r.unit}</td>
                        <td className="py-2.5"><RequestStatusBadge status={r.status} /></td>
                        <td className="py-2.5">
                          <div className="flex justify-end gap-1.5">
                            {sufficient ? (
                              <>
                                <button
                                  onClick={() => setConfirm({ type: "accept", requestId: r.id })}
                                  className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                                >
                                  <IconCheck width={12} height={12} /> Accept
                                </button>
                                <button
                                  onClick={() => setConfirm({ type: "reject", requestId: r.id })}
                                  className="flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                >
                                  <IconX width={12} height={12} /> Reject
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  disabled
                                  className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-400 cursor-not-allowed"
                                  title="Insufficient stock"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() =>
                                    dispatch({
                                      type: "OPEN_SUPPLY_MODAL",
                                      materialId: r.materialId,
                                      qty: r.qtyRequested - (material?.currentStock ?? 0),
                                      linkedStockRequestId: r.id,
                                    })
                                  }
                                  className="rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                                >
                                  Request Supply
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">Request History / Audit Trail</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                    <th className="pb-2 font-medium">Request ID</th>
                    <th className="pb-2 font-medium">PO Ref</th>
                    <th className="pb-2 font-medium">Material</th>
                    <th className="pb-2 font-medium">Qty</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {historyRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">No history yet.</td>
                    </tr>
                  )}
                  {historyRequests.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2 text-slate-500">{r.id}</td>
                      <td className="py-2 text-slate-700 font-medium">{r.poNumber}</td>
                      <td className="py-2 text-slate-700">{r.materialName}</td>
                      <td className="py-2 text-slate-600">{r.qtyRequested} {r.unit}</td>
                      <td className="py-2 text-slate-600">{r.dateRequested}</td>
                      <td className="py-2"><RequestStatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {section === "alerts" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-1">
              <IconAlert width={16} height={16} className="text-orange-500" /> Low Stock Alerts
            </h2>
            <p className="text-xs text-slate-400 mb-3">Materials at or below their reorder point.</p>
            <div className="space-y-2.5">
              {lowStock.length === 0 && <p className="text-sm text-slate-400 py-4 text-center">All materials are adequately stocked.</p>}
              {lowStock.map((m) => (
                <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-orange-100 bg-orange-50/50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{m.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Current: {m.currentStock} {m.unit} · Min Required: {m.reorderPoint} {m.unit} · Supplier: {supplierName(m.supplierId)}
                    </p>
                  </div>
                  <button
                    onClick={() => dispatch({ type: "OPEN_SUPPLY_MODAL", materialId: m.id })}
                    className="rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-700"
                  >
                    Request Supply
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-1">
              <IconBox width={16} height={16} className="text-rose-600" /> At Risk — Running Out Soon
            </h2>
            <p className="text-xs text-slate-400 mb-3">Materials below 60% of their reorder point — needs immediate attention.</p>
            {atRisk.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No critically depleted materials right now.</p>
            ) : (
              <div className="space-y-2.5">
                {atRisk.map((m) => (
                  <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{m.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Current: {m.currentStock} {m.unit} — critically below reorder point of {m.reorderPoint}</p>
                    </div>
                    <Badge color="red">Critical</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        title={confirm?.type === "accept" ? "Accept this request?" : "Reject this request?"}
        description={
          confirm?.type === "accept"
            ? "This deducts the requested quantity from stock and marks the request as fulfilled."
            : "This marks the request as rejected. Production will need to re-raise it if still required."
        }
        confirmLabel={confirm?.type === "accept" ? "Accept" : "Reject"}
        tone={confirm?.type === "reject" ? "danger" : "primary"}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (!confirm) return;
          dispatch({
            type: confirm.type === "accept" ? "ACCEPT_REQUEST" : "REJECT_REQUEST",
            requestId: confirm.requestId,
          });
          setConfirm(null);
        }}
      />
    </div>
  );
}

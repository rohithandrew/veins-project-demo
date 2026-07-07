"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { SupplyStatusBadge } from "./StatusBadge";
import { ConfirmDialog } from "./ConfirmDialog";
import { IconUsers, IconCheck, IconX, IconClock } from "./icons";

export function SupplierDashboard() {
  const { suppliers, supplyRequests, materials, dispatch } = useStore();
  const [confirm, setConfirm] = useState<{ type: "accept" | "reject"; supplyId: string } | null>(null);

  function materialUnit(materialId: string) {
    return materials.find((m) => m.id === materialId)?.unit ?? "";
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <IconUsers width={18} height={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{s.companyName}</p>
                <p className="text-xs text-slate-400">{s.contactPerson}</p>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-xs text-slate-500">
              <p>{s.email}</p>
              <p>{s.phone}</p>
              <p>{s.address}</p>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="text-xs">
                <p className="text-slate-400">Reliability Rating</p>
                <p className="font-semibold text-amber-600">{"★".repeat(Math.round(s.rating))}{"☆".repeat(5 - Math.round(s.rating))} <span className="text-slate-500">{s.rating.toFixed(1)}</span></p>
              </div>
              <div className="text-xs text-right">
                <p className="text-slate-400 flex items-center gap-1 justify-end"><IconClock width={11} height={11} /> Avg Response</p>
                <p className="font-semibold text-slate-700">{s.avgResponseTimeHours}h</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Supply Requests Raised</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="pb-2 font-medium">Request ID</th>
                <th className="pb-2 font-medium">Supplier</th>
                <th className="pb-2 font-medium">Material</th>
                <th className="pb-2 font-medium">Qty</th>
                <th className="pb-2 font-medium">Date Requested</th>
                <th className="pb-2 font-medium">Requested Delivery</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {supplyRequests.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-400">No supply requests raised yet.</td>
                </tr>
              )}
              {supplyRequests.map((sr) => {
                const supplier = suppliers.find((s) => s.id === sr.supplierId);
                return (
                  <tr key={sr.id}>
                    <td className="py-2.5 text-slate-500">{sr.id}</td>
                    <td className="py-2.5 text-slate-700 font-medium">{supplier?.companyName}</td>
                    <td className="py-2.5 text-slate-700">{sr.materialName}</td>
                    <td className="py-2.5 text-slate-600">{sr.qtyRequested} {materialUnit(sr.materialId)}</td>
                    <td className="py-2.5 text-slate-600">{sr.dateRequested}</td>
                    <td className="py-2.5 text-slate-600">{sr.requestedDeliveryDate}</td>
                    <td className="py-2.5"><SupplyStatusBadge status={sr.status} /></td>
                    <td className="py-2.5">
                      {sr.status === "requested" ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setConfirm({ type: "accept", supplyId: sr.id })}
                            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            <IconCheck width={12} height={12} /> Accept Supply
                          </button>
                          <button
                            onClick={() => setConfirm({ type: "reject", supplyId: sr.id })}
                            className="flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                          >
                            <IconX width={12} height={12} /> Reject Supply
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300 block text-right">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!confirm}
        title={confirm?.type === "accept" ? "Accept this supply?" : "Reject this supply?"}
        description={
          confirm?.type === "accept"
            ? "This adds the delivered quantity to inventory as an inward stock record."
            : "This marks the supply request as rejected by the supplier."
        }
        confirmLabel={confirm?.type === "accept" ? "Accept Supply" : "Reject Supply"}
        tone={confirm?.type === "reject" ? "danger" : "primary"}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (!confirm) return;
          dispatch({
            type: confirm.type === "accept" ? "ACCEPT_SUPPLY" : "REJECT_SUPPLY",
            supplyId: confirm.supplyId,
          });
          setConfirm(null);
        }}
      />
    </div>
  );
}

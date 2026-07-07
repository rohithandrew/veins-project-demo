"use client";

import { useState } from "react";
import { useStore, aggregatePoMaterials } from "@/lib/store";
import type { PurchaseOrder } from "@/lib/types";
import { POStatusBadge } from "./StatusBadge";
import { ConfirmDialog } from "./ConfirmDialog";
import { IconBox, IconChevronRight } from "./icons";

export function POCard({ po, compact = false }: { po: PurchaseOrder; compact?: boolean }) {
  const { materials, dispatch } = useStore();
  const [openKit, setOpenKit] = useState<string | null>(po.kits[0]?.id ?? null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const missing = aggregatePoMaterials(po).filter(
    (item) => !materials.some((m) => m.name === item.materialName)
  );
  const totalComponents = po.kits.reduce((n, k) => n + k.components.length, 0);
  const totalBomLines = po.kits.reduce(
    (n, k) => n + k.components.reduce((c, comp) => c + comp.bom.length, 0),
    0
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {po.poNumber} <span className="text-slate-400 font-normal">·</span> {po.clientName}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Delivery: {po.deliveryDate} · Created: {po.createdDate}
          </p>
        </div>
        <POStatusBadge status={po.status} context="upload" />
      </div>

      <div className="px-4 py-3 flex flex-wrap gap-4 text-xs text-slate-500 border-b border-slate-50">
        <span className="flex items-center gap-1">
          <IconBox width={14} height={14} /> {po.kits.length} kit(s)
        </span>
        <span>{totalComponents} component(s)</span>
        <span>{totalBomLines} raw material line(s)</span>
      </div>

      <div className="divide-y divide-slate-100">
        {po.kits.map((kit) => {
          const open = openKit === kit.id;
          return (
            <div key={kit.id}>
              <button
                onClick={() => setOpenKit(open ? null : kit.id)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-slate-50"
              >
                <span className="text-sm font-medium text-slate-700">{kit.name}</span>
                <IconChevronRight
                  width={14}
                  height={14}
                  className={`text-slate-400 transition-transform ${open ? "rotate-90" : ""}`}
                />
              </button>
              {open && (
                <div className="px-4 pb-3 space-y-3">
                  {kit.components.map((comp) => (
                    <div key={comp.id} className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-slate-600 mb-1.5">{comp.name}</p>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-slate-400">
                            <th className="text-left font-medium pb-1">Material</th>
                            <th className="text-right font-medium pb-1">Qty Required</th>
                            <th className="text-right font-medium pb-1">Unit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comp.bom.map((b, i) => {
                            const exists = materials.some((m) => m.name === b.materialName);
                            return (
                              <tr key={i} className={!exists ? "text-rose-600" : "text-slate-700"}>
                                <td className="py-0.5">{b.materialName}{!exists && " (not in system)"}</td>
                                <td className="py-0.5 text-right">{b.qtyRequired}</td>
                                <td className="py-0.5 text-right">{b.unit}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!compact && (
        <div className="border-t border-slate-100 px-4 py-3">
          {missing.length > 0 && (
            <p className="mb-2 text-xs text-rose-600">
              Missing from materials master: {missing.map((m) => m.materialName).join(", ")}
            </p>
          )}
          {po.status === "draft" ? (
            <button
              onClick={() => setConfirmOpen(true)}
              className="w-full rounded-lg bg-blue-700 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Move to Production
            </button>
          ) : (
            <p className="text-xs text-slate-400">
              Status: <span className="font-medium text-slate-600">Ready for Production</span> — validated and queued.
            </p>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Move to Production?"
        description={`This validates that all raw materials for ${po.poNumber} exist in the inventory system before releasing it to Production.`}
        confirmLabel="Move to Production"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          dispatch({ type: "MOVE_TO_PRODUCTION", poId: po.id });
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}

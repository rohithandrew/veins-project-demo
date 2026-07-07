"use client";

import { useState } from "react";
import { useStore, aggregatePoMaterials } from "@/lib/store";
import type { PurchaseOrder } from "@/lib/types";
import { POCard } from "./POCard";
import { POStatusBadge } from "./StatusBadge";
import { ConfirmDialog } from "./ConfirmDialog";
import { IconClock, IconBox } from "./icons";

function daysUntil(dateStr: string) {
  const target = new Date(dateStr).getTime();
  const now = new Date("2026-07-07").getTime();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function ProductionCard({ po }: { po: PurchaseOrder }) {
  const { materials, stockRequests, dispatch } = useStore();
  const [confirmAction, setConfirmAction] = useState<null | "raise" | "start" | "complete">(null);

  const bomItems = aggregatePoMaterials(po);
  const totalComponents = po.kits.reduce((n, k) => n + k.components.length, 0);
  const openRequests = stockRequests.filter((r) => r.poId === po.id && r.status !== "rejected");
  const allRequested = bomItems.every((item) =>
    openRequests.some((r) => r.materialName === item.materialName)
  );
  const days = daysUntil(po.deliveryDate);

  function raiseRequests() {
    const items = bomItems
      .map((item) => {
        const material = materials.find((m) => m.name === item.materialName);
        return material ? { materialId: material.id, qty: item.qtyRequired } : null;
      })
      .filter((x): x is { materialId: string; qty: number } => !!x);
    dispatch({ type: "RAISE_REQUESTS", poId: po.id, items });
    setConfirmAction(null);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {po.poNumber} · {po.clientName}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{po.clientContact}</p>
        </div>
        <POStatusBadge status={po.status} context="production" />
      </div>

      <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-slate-50">
        <div>
          <p className="text-slate-400">Kits</p>
          <p className="font-semibold text-slate-700">{po.kits.length}</p>
        </div>
        <div>
          <p className="text-slate-400">Components</p>
          <p className="font-semibold text-slate-700">{totalComponents}</p>
        </div>
        <div>
          <p className="text-slate-400">Raw Materials</p>
          <p className="font-semibold text-slate-700">{bomItems.length}</p>
        </div>
        <div className="flex items-center gap-1">
          <IconClock width={13} height={13} className="text-slate-400" />
          <div>
            <p className="text-slate-400">Delivery</p>
            <p className={`font-semibold ${days < 5 ? "text-rose-600" : "text-slate-700"}`}>
              {po.deliveryDate} {days >= 0 ? `(${days}d)` : "(overdue)"}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        <POCard po={po} compact />
      </div>

      <div className="border-t border-slate-100 px-4 py-3 flex flex-wrap items-center gap-2">
        <button
          disabled={allRequested}
          onClick={() => setConfirmAction("raise")}
          className={`rounded-lg px-3.5 py-2 text-xs font-semibold ${
            allRequested
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-blue-700 text-white hover:bg-blue-800"
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            <IconBox width={13} height={13} />
            {allRequested ? "Requests Raised" : "Raise Request"}
          </span>
        </button>

        {po.status === "pending" && (
          <button
            onClick={() => setConfirmAction("start")}
            className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Start Production
          </button>
        )}
        {po.status === "in_progress" && (
          <button
            onClick={() => setConfirmAction("complete")}
            className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Mark Completed
          </button>
        )}

        {openRequests.length > 0 && (
          <span className="text-xs text-slate-400 ml-auto">
            {openRequests.filter((r) => r.status === "accepted").length}/{openRequests.length} requests fulfilled
          </span>
        )}
      </div>

      <ConfirmDialog
        open={confirmAction === "raise"}
        title="Raise stock request?"
        description={`This sends a request to Inventory for all raw materials required by ${po.poNumber}.`}
        confirmLabel="Raise Request"
        onCancel={() => setConfirmAction(null)}
        onConfirm={raiseRequests}
      />
      <ConfirmDialog
        open={confirmAction === "start"}
        title="Start production?"
        description={`Move ${po.poNumber} to In Progress.`}
        confirmLabel="Start Production"
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => {
          dispatch({ type: "START_PRODUCTION", poId: po.id });
          setConfirmAction(null);
        }}
      />
      <ConfirmDialog
        open={confirmAction === "complete"}
        title="Mark as completed?"
        description={`Confirm ${po.poNumber} has finished production.`}
        confirmLabel="Mark Completed"
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => {
          dispatch({ type: "COMPLETE_PRODUCTION", poId: po.id });
          setConfirmAction(null);
        }}
      />
    </div>
  );
}

export function Production() {
  const { purchaseOrders } = useStore();
  const visible = purchaseOrders.filter((po) => po.status !== "draft");

  return (
    <div className="space-y-4">
      {visible.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
          No POs in production yet. Move a PO to production from the PO Upload page.
        </div>
      )}
      {visible.map((po) => (
        <ProductionCard key={po.id} po={po} />
      ))}
    </div>
  );
}

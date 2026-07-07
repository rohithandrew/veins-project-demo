"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import type { SupplyRequest } from "@/lib/types";
import { IconMail, IconSend, IconX } from "./icons";

function addDays(days: number) {
  const d = new Date("2026-07-07");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function SupplyRequestModal() {
  const { materials, suppliers, dispatch, companyAddress, activeSupplyRequest } = useStore();
  const materialId = activeSupplyRequest?.materialId ?? null;
  const suggestedQty = activeSupplyRequest?.qty;
  const linkedStockRequestId = activeSupplyRequest?.linkedStockRequestId;
  const material = materials.find((m) => m.id === materialId);
  const supplier = material ? suppliers.find((s) => s.id === material.supplierId) : undefined;
  const open = !!activeSupplyRequest;

  const [qty, setQty] = useState(suggestedQty ?? 0);
  const [urgency, setUrgency] = useState<SupplyRequest["urgency"]>("Urgent");
  const [deliveryDate, setDeliveryDate] = useState(addDays(7));

  function onClose() {
    dispatch({ type: "CLOSE_SUPPLY_MODAL" });
  }

  useMemo(() => {
    if (open) {
      setQty(suggestedQty ?? (material ? Math.max(material.reorderPoint * 2 - material.currentStock, material.reorderPoint) : 0));
      setUrgency("Urgent");
      setDeliveryDate(addDays(7));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, materialId]);

  if (!open || !material || !supplier) return null;

  const subject = `Urgent: Stock Request - ${material.name}`;
  const body = `Dear ${supplier.contactPerson},

We would like to place an urgent stock request for the following item:

Material: ${material.name}
Quantity Required: ${qty} ${material.unit}
Urgency: ${urgency}
Current Stock Level: ${material.currentStock} ${material.unit} (Reorder Point: ${material.reorderPoint} ${material.unit})

Delivery Address:
${companyAddress}

Requested Delivery Date: ${deliveryDate}

Please confirm availability and expected dispatch date at your earliest convenience.

Regards,
Inventory Team
Vijaya Electronics`;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <IconMail width={18} height={18} className="text-blue-600" />
            <h3 className="text-sm font-semibold text-slate-900">Supply Request Email</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <IconX width={18} height={18} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-4 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 grid grid-cols-2 gap-2">
            <p><span className="text-slate-400">Company:</span> <span className="font-medium text-slate-700">{supplier.companyName}</span></p>
            <p><span className="text-slate-400">Contact:</span> <span className="font-medium text-slate-700">{supplier.contactPerson}</span></p>
            <p><span className="text-slate-400">Phone:</span> <span className="font-medium text-slate-700">{supplier.phone}</span></p>
            <p><span className="text-slate-400">Rating:</span> <span className="font-medium text-slate-700">{supplier.rating.toFixed(1)} / 5</span></p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-xs font-medium text-slate-600">
              Quantity Required
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="text-xs font-medium text-slate-600">
              Urgency
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as SupplyRequest["urgency"])}
                className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option>Normal</option>
                <option>Urgent</option>
                <option>Critical</option>
              </select>
            </label>
            <label className="text-xs font-medium text-slate-600">
              Requested Delivery
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-3.5 py-2 text-xs text-slate-500 space-y-1 border-b border-slate-200">
              <p><span className="text-slate-400">To:</span> {supplier.email}</p>
              <p><span className="text-slate-400">Subject:</span> {subject}</p>
            </div>
            <pre className="whitespace-pre-wrap px-3.5 py-3 text-xs text-slate-700 font-sans leading-relaxed">{body}</pre>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3.5">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              dispatch({
                type: "SEND_SUPPLY_REQUEST",
                materialId: material.id,
                qty,
                urgency,
                requestedDeliveryDate: deliveryDate,
                linkedStockRequestId,
              });
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            <IconSend width={14} height={14} />
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}

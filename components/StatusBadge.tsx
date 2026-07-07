import React from "react";
import type { POStatus, RequestStatus, SupplyStatus } from "@/lib/types";

const base =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset whitespace-nowrap";

const styles: Record<string, string> = {
  gray: "bg-slate-100 text-slate-600 ring-slate-200",
  yellow: "bg-amber-50 text-amber-700 ring-amber-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  orange: "bg-orange-50 text-orange-700 ring-orange-200",
};

export function Badge({ color, children }: { color: keyof typeof styles; children: React.ReactNode }) {
  return <span className={`${base} ${styles[color]}`}>{children}</span>;
}

export function POStatusBadge({ status, context = "default" }: { status: POStatus; context?: "upload" | "production" | "default" }) {
  const map: Record<POStatus, { label: string; color: keyof typeof styles }> = {
    draft: { label: "Draft", color: "gray" },
    pending: {
      label: context === "production" ? "Pending" : "Ready for Production",
      color: "yellow",
    },
    in_progress: { label: "In Progress", color: "blue" },
    completed: { label: "Completed", color: "green" },
  };
  const { label, color } = map[status];
  return <Badge color={color}>{label}</Badge>;
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const map: Record<RequestStatus, { label: string; color: keyof typeof styles }> = {
    pending: { label: "Pending", color: "yellow" },
    accepted: { label: "Accepted", color: "green" },
    rejected: { label: "Rejected", color: "red" },
  };
  const { label, color } = map[status];
  return <Badge color={color}>{label}</Badge>;
}

export function SupplyStatusBadge({ status }: { status: SupplyStatus }) {
  const map: Record<SupplyStatus, { label: string; color: keyof typeof styles }> = {
    requested: { label: "Pending Supply", color: "yellow" },
    delivered: { label: "Delivered", color: "green" },
    rejected: { label: "Rejected", color: "red" },
  };
  const { label, color } = map[status];
  return <Badge color={color}>{label}</Badge>;
}

export function StockStatusBadge({ low }: { low: boolean }) {
  return low ? <Badge color="orange">Low Stock</Badge> : <Badge color="green">Adequate</Badge>;
}

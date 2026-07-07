"use client";

import React, { useEffect } from "react";
import { useStore } from "@/lib/store";
import { IconCheck, IconX, IconAlert } from "./icons";

const styles: Record<string, string> = {
  success: "bg-emerald-600",
  error: "bg-rose-600",
  warning: "bg-amber-600",
  info: "bg-slate-800",
};

const icons: Record<string, React.ReactNode> = {
  success: <IconCheck className="shrink-0" width={16} height={16} />,
  error: <IconAlert className="shrink-0" width={16} height={16} />,
  warning: <IconAlert className="shrink-0" width={16} height={16} />,
  info: <IconAlert className="shrink-0" width={16} height={16} />,
};

function ToastItem({ id, type, message }: { id: string; type: string; message: string }) {
  const { dispatch } = useStore();

  useEffect(() => {
    const t = setTimeout(() => dispatch({ type: "DISMISS_TOAST", toastId: id }), 4500);
    return () => clearTimeout(t);
  }, [id, dispatch]);

  return (
    <div
      className={`${styles[type]} text-white rounded-lg shadow-lg px-4 py-3 flex items-start gap-2.5 min-w-[280px] max-w-sm animate-[fadeIn_0.2s_ease-out]`}
    >
      {icons[type]}
      <p className="text-sm leading-snug flex-1">{message}</p>
      <button
        onClick={() => dispatch({ type: "DISMISS_TOAST", toastId: id })}
        className="opacity-70 hover:opacity-100 shrink-0"
        aria-label="Dismiss"
      >
        <IconX width={14} height={14} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useStore();
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  );
}

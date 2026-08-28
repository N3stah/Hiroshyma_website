"use client";
import { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";
interface ToastItem { id: number; message: string; type: ToastType; }
interface ToastCtx { toast: (message: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastCtx>({ toast: () => {} });

const BG: Record<ToastType, string> = {
  success: "#14532d",
  error: "#7f1d1d",
  info: "var(--hiro-surface)",
};
const BORDER: Record<ToastType, string> = {
  success: "#166534",
  error: "#991b1b",
  info: "var(--hiro-border)",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="px-4 py-3 text-xs border"
            style={{
              backgroundColor: BG[t.type],
              borderColor: BORDER[t.type],
              color: "var(--hiro-text)",
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface Toast {
  id: string;
  message: string;
  variant: "success" | "info";
}

interface ToastContextValue {
  addToast: (message: string, variant?: "success" | "info") => void;
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, variant: "success" | "info" = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`animate-slide-in-right rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
                toast.variant === "success" ? "bg-forest" : "bg-ocean"
              }`}
              role="alert"
            >
              {toast.message}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

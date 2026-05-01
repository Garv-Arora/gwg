"use client";

import { createContext, useCallback, useContext, useState } from "react";

type Toast = {
  id: number;
  text: string;
  tone: "info" | "success" | "error";
};

type Ctx = {
  show: (text: string, tone?: Toast["tone"]) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const show = useCallback<Ctx["show"]>((text, tone = "info") => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { id, text, tone }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 3200);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center pointer-events-none px-4">
        <div className="flex flex-col items-center gap-2 w-full max-w-[400px]">
          {items.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto rounded-pill px-4 py-2.5 text-sm font-medium shadow-card animate-rise ${
                t.tone === "success"
                  ? "bg-mint text-bg"
                  : t.tone === "error"
                    ? "bg-danger text-bg"
                    : "bg-card text-ink-primary border border-white/10"
              }`}
            >
              {t.text}
            </div>
          ))}
        </div>
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

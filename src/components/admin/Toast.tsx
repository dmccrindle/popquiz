"use client";

import { createContext, useContext, useState, useCallback } from "react";

type ToastState = { message: string; isError: boolean; id: number } | null;

const ToastContext = createContext<{
  toast: (message: string, isError?: boolean) => void;
}>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ToastState>(null);

  const toast = useCallback((message: string, isError = false) => {
    const id = Date.now();
    setState({ message, isError, id });
    setTimeout(() => {
      setState((curr) => (curr?.id === id ? null : curr));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {state && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full text-sm font-semibold text-white shadow-lg ${
            state.isError
              ? "bg-red-500"
              : "bg-gradient-to-r from-accent-pink to-accent-purple"
          }`}
        >
          {state.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

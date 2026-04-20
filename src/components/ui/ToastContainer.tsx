"use client";

import { useToast } from "@/lib/providers";
import { motion, AnimatePresence } from "framer-motion";

const TOAST_COLORS = {
  info: "border-[var(--color-teal-300)] bg-[var(--color-teal-700)]/80",
  success: "border-green-400 bg-green-900/80",
  warning: "border-yellow-400 bg-yellow-900/80",
  error: "border-[var(--color-error)] bg-red-900/80",
};

const TOAST_ICONS = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  error: "❌",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-[84px] left-4 z-[9999] flex flex-col gap-3 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: -100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`pointer-events-auto backdrop-blur-xl border rounded-xl px-4 py-3 shadow-2xl cursor-pointer flex items-start gap-3 ${TOAST_COLORS[toast.type]}`}
            onClick={() => removeToast(toast.id)}
          >
            <span className="text-lg">{TOAST_ICONS[toast.type]}</span>
            <p className="text-sm text-white font-medium">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

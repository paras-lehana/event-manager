"use client";

import { useQueues, useToast } from "@/lib/providers";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

function getWaitColor(min: number): string {
  if (min <= 3) return "var(--color-teal-300)";
  if (min <= 7) return "#f59e0b";
  return "var(--color-error)";
}

function getBarWidth(min: number): string {
  const pct = Math.min((min / 15) * 100, 100);
  return `${pct}%`;
}

export function QueueDashboard() {
  const { queues } = useQueues();
  const { addToast } = useToast();
  const prevQueues = useRef(queues);

  // Predictive Slash Alerts
  useEffect(() => {
    queues.forEach((q) => {
      const prev = prevQueues.current.find((p) => p.standId === q.standId);
      if (prev && prev.estimatedWaitMin > 2 && q.estimatedWaitMin <= 2) {
        addToast({
          message: `⚡ ${q.standName} just dropped to ${q.estimatedWaitMin} min! Go now!`,
          type: "info",
          duration: 8000,
        });
      }
    });
    prevQueues.current = queues;
  }, [queues, addToast]);

  const sortedQueues = [...queues]
    .filter((q) => q.type !== "restroom")
    .sort((a, b) => a.estimatedWaitMin - b.estimatedWaitMin);

  const restrooms = queues.filter((q) => q.type === "restroom").sort((a, b) => a.estimatedWaitMin - b.estimatedWaitMin);

  return (
    <div className="space-y-4">
      <GlassCard>
        <h3 className="font-semibold text-[var(--color-text-secondary)] uppercase text-xs tracking-wider mb-4">
          🍽️ Concession Wait Times
        </h3>
        <div className="space-y-3">
          {sortedQueues.map((q, i) => (
            <motion.div
              key={q.standId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white">{q.standName}</span>
                <span className="font-bold" style={{ color: getWaitColor(q.estimatedWaitMin) }}>
                  {q.estimatedWaitMin} min
                </span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ backgroundColor: getWaitColor(q.estimatedWaitMin) }}
                  initial={{ width: 0 }}
                  animate={{ width: getBarWidth(q.estimatedWaitMin) }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="font-semibold text-[var(--color-text-secondary)] uppercase text-xs tracking-wider mb-4">
          🚻 Restroom Wait Times
        </h3>
        <div className="space-y-3">
          {restrooms.map((q, i) => (
            <motion.div
              key={q.standId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white">{q.standName}</span>
                <span className="font-bold" style={{ color: getWaitColor(q.estimatedWaitMin) }}>
                  {q.estimatedWaitMin} min
                </span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: getWaitColor(q.estimatedWaitMin) }}
                  animate={{ width: getBarWidth(q.estimatedWaitMin) }}
                  transition={{ duration: 0.7 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

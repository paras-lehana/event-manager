"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { StandMenu } from "@/components/ui/StandMenu";
import { useVenue, useQueues } from "@/lib/providers";
import { Stand } from "@/lib/types";
import { motion } from "framer-motion";

function getTypeIcon(type: Stand["type"]): string {
  switch (type) {
    case "food": return "🍔";
    case "beverage": return "🍺";
    case "merchandise": return "🏪";
    case "restroom": return "🚻";
    default: return "📍";
  }
}

export default function OrderPage() {
  const { stands } = useVenue();
  const { getQueueForStand } = useQueues();
  const [selectedStand, setSelectedStand] = useState<Stand | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const orderableStands = stands.filter((s) => s.menu && s.menu.length > 0);
  const filtered = filter === "all" ? orderableStands : orderableStands.filter((s) => s.type === filter);

  if (selectedStand) {
    return (
      <main className="min-h-screen bg-[var(--background)] text-[#f5f5f5] pb-24">
        <div className="max-w-2xl mx-auto p-4 md:p-8">
          <StandMenu stand={selectedStand} onBack={() => setSelectedStand(null)} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[#f5f5f5] pb-24">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-1 tracking-tight">Order Food & Drinks</h1>
          <p className="text-[var(--color-text-secondary)] mb-6">Skip the line — order ahead and pick up when ready</p>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "food", "beverage", "merchandise"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm px-4 py-2 rounded-full border transition-all ${
                filter === f
                  ? "bg-[var(--color-teal-500)] border-[var(--color-teal-300)] text-white"
                  : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-teal-300)]"
              }`}
            >
              {f === "all" ? "All Stands" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Stand cards */}
        <div className="space-y-3">
          {filtered.map((stand, i) => {
            const queue = getQueueForStand(stand.id);
            return (
              <motion.div
                key={stand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard
                  className="cursor-pointer flex items-center gap-4 !p-4"
                  onClick={() => setSelectedStand(stand)}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                    {getTypeIcon(stand.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{stand.name}</h3>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {stand.section} • Level {stand.level} • {stand.menu?.length || 0} items
                    </p>
                  </div>
                  {queue && (
                    <div className="text-right">
                      <p
                        className="text-sm font-bold"
                        style={{ color: queue.estimatedWaitMin > 5 ? "var(--color-error)" : "var(--color-teal-300)" }}
                      >
                        {queue.estimatedWaitMin} min
                      </p>
                      <p className="text-[10px] text-[var(--color-text-secondary)]">wait</p>
                    </div>
                  )}
                  <span className="text-[var(--color-text-secondary)]">→</span>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

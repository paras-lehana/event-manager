"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { GlassCard } from "@/components/ui/GlassCard";
import { AIChatPanel } from "@/components/ui/AIChatPanel";
import { useQueues, useCrew, useOrders, useToast } from "@/lib/providers";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const { queues } = useQueues();
  const { members, crewId } = useCrew();
  const { orders } = useOrders();
  const { addToast } = useToast();
  const router = useRouter();
  const prevQueuesRef = useRef(queues);

  const activeOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "preparing" || o.status === "ready"
  );

  const sortedQueues = [...queues]
    .filter((q) => q.type !== "restroom")
    .sort((a, b) => a.estimatedWaitMin - b.estimatedWaitMin);

  const restrooms = queues
    .filter((q) => q.type === "restroom")
    .sort((a, b) => a.estimatedWaitMin - b.estimatedWaitMin);

  const fastestQueue = sortedQueues[0];

  // Slash Alerts
  useEffect(() => {
    queues.forEach((q) => {
      const prev = prevQueuesRef.current.find((p) => p.standId === q.standId);
      if (prev && prev.estimatedWaitMin > 2 && q.estimatedWaitMin <= 2) {
        addToast({
          message: `⚡ ${q.standName} just dropped to ${q.estimatedWaitMin} min! Go now!`,
          type: "info",
          duration: 8000,
        });
      }
    });
    prevQueuesRef.current = queues;
  }, [queues, addToast]);

  // GSAP entrance
  useEffect(() => {
    if (gridRef.current) {
      gsap.from(gridRef.current.children, {
        opacity: 0,
        y: 30,
        stagger: 0.06,
        duration: 0.6,
        ease: "power3.out",
      });
    }
  }, []);

  function getWaitColor(min: number): string {
    if (min <= 3) return "#32b8c6";
    if (min <= 7) return "#f59e0b";
    return "#ff5459";
  }

  return (
    <main className="min-h-screen bg-[#1f2121] text-[#f5f5f5] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-[30%] -left-[20%] w-[50%] h-[50%] bg-gradient-to-br from-[#1a6873]/40 to-transparent rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[15%] w-[35%] h-[35%] bg-gradient-to-tl from-purple-900/20 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-6 pb-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#32b8c6] to-[#1a6873] flex items-center justify-center text-base font-black shadow-lg shadow-[#1a6873]/30 text-white">
              SF
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Stadium<span className="text-[#32b8c6]">Flow</span>
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)]">
                SoFi Stadium • Live Now
              </p>
            </div>
          </div>
        </motion.header>

        {/* Dashboard Grid */}
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">

          {/* ─── LIVE GAME BANNER ─── */}
          <div className="col-span-2 md:col-span-4">
            <GlassCard className="!p-4 flex items-center justify-between bg-gradient-to-r from-[#1a6873]/30 to-purple-900/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">Live</span>
                <span className="text-sm font-semibold text-white">SoFi Stadium — Rams vs 49ers</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="font-bold text-white">24 <span className="text-[var(--color-text-secondary)] font-normal">-</span> 17</span>
                <span className="text-[var(--color-text-secondary)] text-xs">Q3 · 8:42</span>
              </div>
            </GlassCard>
          </div>

          {/* ─── MAP CARD ─── */}
          <div className="col-span-2 md:col-span-2 row-span-2">
            <GlassCard
              className="h-full cursor-pointer !p-4 flex flex-col"
              onClick={() => router.push("/map")}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-[#32b8c6]">🗺️ Stadium Map</h2>
                <span className="text-[10px] text-[var(--color-text-secondary)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                  Interactive
                </span>
              </div>
              {/* Simplified stadium visual */}
              <div className="flex-1 min-h-[200px] bg-[#13343b] rounded-xl relative overflow-hidden border border-[var(--color-border)]">
                {/* Stadium oval */}
                <svg viewBox="0 0 200 200" className="w-full h-full opacity-60" preserveAspectRatio="xMidYMid meet">
                  <ellipse cx="100" cy="100" rx="85" ry="80" fill="none" stroke="#32b8c6" strokeWidth="8" opacity="0.3" />
                  <ellipse cx="100" cy="100" rx="60" ry="56" fill="none" stroke="#32b8c6" strokeWidth="5" opacity="0.2" />
                  <ellipse cx="100" cy="100" rx="32" ry="28" fill="#1a5c28" opacity="0.8" />
                  <line x1="72" y1="100" x2="128" y2="100" stroke="white" strokeWidth="0.5" opacity="0.3" />
                  {/* Concession dots */}
                  <circle cx="40" cy="50" r="5" fill="#f59e0b" opacity="0.9" />
                  <circle cx="160" cy="50" r="5" fill="#32b8c6" opacity="0.9" />
                  <circle cx="160" cy="150" r="5" fill="#a855f6" opacity="0.9" />
                  <circle cx="40" cy="150" r="5" fill="#6b7280" opacity="0.9" />
                  <circle cx="100" cy="25" r="5" fill="#f59e0b" opacity="0.9" />
                  <circle cx="100" cy="175" r="5" fill="#32b8c6" opacity="0.9" />
                  {/* User dot */}
                  <circle cx="100" cy="100" r="4" fill="#3b82f6">
                    <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                  </circle>
                </svg>
                <div className="absolute bottom-2 left-2 flex gap-2 text-[9px] text-[var(--color-text-secondary)]">
                  <span>🍔 Food</span>
                  <span>🍺 Drinks</span>
                  <span>🚻 WC</span>
                  <span className="text-blue-400">● You</span>
                </div>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-2">Tap to explore & navigate →</p>
            </GlassCard>
          </div>

          {/* ─── AI ASSISTANT ─── */}
          <div className="col-span-2 md:col-span-2 row-span-2">
            <GlassCard glow className="h-full flex flex-col !p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#32b8c6] to-purple-500 flex items-center justify-center shadow-lg">
                  <span className="text-base">✨</span>
                </div>
                <div>
                  <h2 className="text-base font-bold">Gemini Concierge</h2>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">Powered by Google AI</p>
                </div>
              </div>

              <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                Your AI stadium assistant — find food, navigate, manage orders, check scores.
              </p>

              <div className="space-y-2 mb-4 flex-1">
                {["Where's the shortest beer line?", "Navigate me to Section 114", "Order nachos ahead"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setChatOpen(true)}
                    className="w-full text-left text-xs px-3 py-2.5 rounded-xl bg-white/5 text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[#32b8c6]/50 hover:text-white transition-all"
                  >
                    &ldquo;{q}&rdquo;
                  </button>
                ))}
              </div>

              <button
                onClick={() => setChatOpen(true)}
                className="w-full py-3 bg-gradient-to-r from-[#21808d] to-purple-600 text-white font-semibold rounded-xl hover:from-[#1d7480] hover:to-purple-700 transition-all shadow-lg shadow-[#1a6873]/20 active:scale-[0.98] text-sm"
              >
                Open Concierge ✨
              </button>
            </GlassCard>
          </div>

          {/* ─── FASTEST QUEUE ─── */}
          <div className="col-span-1">
            <GlassCard className="h-full cursor-pointer !p-4" onClick={() => router.push("/order")}>
              <h3 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                ⚡ Fastest Now
              </h3>
              {fastestQueue && (
                <>
                  <p className="text-sm font-bold text-white leading-tight">{fastestQueue.standName}</p>
                  <p className="text-2xl font-black text-[#32b8c6] mt-1">
                    {fastestQueue.estimatedWaitMin}
                    <span className="text-xs font-normal text-[var(--color-text-secondary)] ml-1">min</span>
                  </p>
                  <p className="text-[10px] text-[var(--color-text-secondary)] mt-1">
                    {fastestQueue.queueLength} in line
                  </p>
                </>
              )}
            </GlassCard>
          </div>

          {/* ─── SLASH ALERTS ─── */}
          <div className="col-span-1">
            <GlassCard className="h-full !p-4 flex flex-col items-center justify-center text-center">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-12 h-12 rounded-full border-2 border-[#21808d] flex items-center justify-center mb-2 bg-[#21808d]/10"
              >
                <span className="text-[#32b8c6] text-xl">⚡</span>
              </motion.div>
              <h3 className="font-bold text-sm">Slash Alerts</h3>
              <p className="text-[10px] text-[var(--color-text-secondary)] mt-1 leading-tight">
                Auto-notify when lines &lt; 2 min
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[9px] text-green-400">Active</span>
              </div>
            </GlassCard>
          </div>

          {/* ─── QUEUE TIMES ─── */}
          <div className="col-span-2 md:col-span-2">
            <GlassCard className="!p-4">
              <h3 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
                🍽️ Concession Wait Times
              </h3>
              <div className="space-y-2.5">
                {sortedQueues.slice(0, 5).map((q) => (
                  <div key={q.standId}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-white font-medium">{q.standName}</span>
                      <span className="font-bold" style={{ color: getWaitColor(q.estimatedWaitMin) }}>
                        {q.estimatedWaitMin} min
                      </span>
                    </div>
                    <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: getWaitColor(q.estimatedWaitMin) }}
                        animate={{ width: `${Math.min((q.estimatedWaitMin / 15) * 100, 100)}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* ─── RESTROOMS ─── */}
          <div className="col-span-1">
            <GlassCard className="!p-4">
              <h3 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
                🚻 Restrooms
              </h3>
              <div className="space-y-2">
                {restrooms.map((q) => (
                  <div key={q.standId} className="flex items-center justify-between">
                    <span className="text-xs text-white">{q.standName.replace("Restroom ", "")}</span>
                    <span className="text-xs font-bold" style={{ color: getWaitColor(q.estimatedWaitMin) }}>
                      {q.estimatedWaitMin} min
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* ─── ACTIVE ORDERS ─── */}
          <div className="col-span-1">
            <GlassCard
              glow={activeOrders.some((o) => o.status === "ready")}
              className="!p-4 cursor-pointer h-full"
              onClick={() => router.push("/orders")}
            >
              <h3 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                📋 Orders
              </h3>
              {activeOrders.length > 0 ? (
                <div className="space-y-2">
                  {activeOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <span className="text-xs text-white truncate max-w-[100px]">{order.standName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          order.status === "ready"
                            ? "bg-green-500/20 text-green-400"
                            : order.status === "preparing"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {order.status === "ready" ? "Ready!" : order.status === "preparing" ? "Making" : "Queued"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <span className="text-2xl mb-1 block">🍽️</span>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">No active orders</p>
                </div>
              )}
            </GlassCard>
          </div>

          {/* ─── AR STATS OVERLAY (from research) ─── */}
          <div className="col-span-2 md:col-span-2">
            <GlassCard className="!p-4 bg-gradient-to-r from-purple-900/20 to-[#1a6873]/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📊</span>
                <h3 className="text-sm font-bold text-white">AR Stats Overlay</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">Beta</span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mb-3">Point your camera at the field for real-time player stats and play analysis.</p>
              <div className="flex gap-4 text-xs">
                <div>
                  <p className="text-[var(--color-text-secondary)]">QB Rating</p>
                  <p className="font-bold text-white text-lg">118.4</p>
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)]">Pass Yards</p>
                  <p className="font-bold text-white text-lg">245</p>
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)]">Rush Yards</p>
                  <p className="font-bold text-white text-lg">98</p>
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)]">TDs</p>
                  <p className="font-bold text-[#32b8c6] text-lg">3</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* ─── QUICK ACTIONS ─── */}
          <div className="col-span-2 md:col-span-2">
            <GlassCard className="!p-4">
              <h3 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: "🍔", label: "Order Food", path: "/order" },
                  { icon: "🗺️", label: "Navigate", path: "/map" },
                  { icon: "👥", label: "Find Crew", path: "/crew" },
                ].map((action) => (
                  <button
                    key={action.label}
                    onClick={() => router.push(action.path)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/5 border border-[var(--color-border)] hover:border-[#32b8c6]/50 hover:bg-white/8 transition-all active:scale-95"
                  >
                    <span className="text-xl">{action.icon}</span>
                    <span className="text-[10px] text-[var(--color-text-secondary)]">{action.label}</span>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* ─── FIND MY CREW ─── */}
          <div className="col-span-2 md:col-span-4">
            <GlassCard
              className="!p-4 flex items-center justify-between cursor-pointer"
              onClick={() => router.push("/crew")}
            >
              <div>
                <h2 className="text-lg font-bold">Find My Crew 👥</h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {crewId
                    ? `${members.length} friends sharing location`
                    : "Create or join a crew to see friends on the map"}
                </p>
              </div>
              <div className="flex -space-x-3">
                {members.slice(0, 4).map((member, i) => (
                  <motion.div
                    key={member.uid}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-10 h-10 rounded-full border-2 border-[#262828] flex items-center justify-center font-bold text-white text-xs shadow-lg"
                    style={{
                      backgroundColor: ["#21808d", "#a855f6", "#f97316", "#ef4444"][i % 4],
                    }}
                  >
                    {member.avatar}
                  </motion.div>
                ))}
                {members.length === 0 && (
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)]">
                    +
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Floating AI Button */}
      {!chatOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChatOpen(true)}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-[#32b8c6] to-purple-500 flex items-center justify-center text-2xl shadow-2xl shadow-[#1a6873]/40 z-50"
        >
          ✨
        </motion.button>
      )}

      <AIChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </main>
  );
}

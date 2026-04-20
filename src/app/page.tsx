"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { GlassCard } from "@/components/ui/GlassCard";
import { AIChatPanel } from "@/components/ui/AIChatPanel";
import { useQueues, useCrew, useOrders, useToast } from "@/lib/providers";
import { useChat } from "@/app/providers";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { chatOpen, setChatOpen } = useChat();
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
        {/* Header - Kinetic Typography Overlay */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 relative"
        >
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 90, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#32b8c6] to-purple-600 flex items-center justify-center text-xl font-black shadow-[0_0_20px_rgba(50,184,198,0.4)] text-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
              <span className="relative z-10 glitch-text" data-text="SF">SF</span>
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-1 uppercase flex items-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Stadium</span>
                <span className="text-[#32b8c6] ml-1 drop-shadow-[0_0_15px_rgba(50,184,198,0.6)] animate-pulse">Flow</span>
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                <p className="text-xs font-mono tracking-widest text-[#32b8c6] uppercase">
                  SoFi Stadium // Broadcast Live
                </p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2 opacity-50"
        >
          <p className="text-[10px] uppercase font-mono tracking-widest rotate-90 mb-8 text-[var(--color-text-secondary)]">Scroll</p>
          <div className="h-24 w-px bg-gradient-to-b from-transparent via-[#32b8c6] to-transparent relative">
            <motion.div 
              animate={{ y: [0, 96, 0] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute top-0 left-[-1.5px] w-1 h-3 rounded-full bg-[#32b8c6] shadow-[0_0_10px_#32b8c6]" 
            />
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div ref={gridRef} className="bento-grid">

          {/* ─── LIVE GAME BANNER ─── */}
          <div className="bento-large">
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

          {/* ─── USP: REAL-TIME CROWD INTEL ─── */}
          <div className="bento-wide">
            <GlassCard className="!p-5 border-[#00f3ff]/40 shadow-[0_0_30px_rgba(0,243,255,0.15)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00f3ff]/5 to-[#db00ff]/5 pointer-events-none" />
              <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-[#00f3ff]/10 rounded-full blur-3xl group-hover:bg-[#db00ff]/20 transition-all duration-700" />
              
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">📡</span>
                    <h2 className="text-lg font-bold text-white tracking-tight">Real-Time Crowd Routing</h2>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mb-4">
                    StadiumFlow's core USP: Telemetry node networks predict and redirect foot traffic to eliminate waiting times.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono tracking-widest text-[#00f3ff]">
                    <span className="px-2 py-1 bg-[#00f3ff]/10 rounded border border-[#00f3ff]/30">SYNC = 500MS</span>
                    <span className="px-2 py-1 bg-[#db00ff]/10 rounded border border-[#db00ff]/30 text-[#db00ff]">AI LOAD BALANCING</span>
                  </div>
                </div>
                
                {/* SVG Infographic */}
                <div className="w-32 h-24 bg-black/40 rounded-xl border border-[var(--color-border)] p-2 relative overflow-hidden flex flex-col justify-end">
                   <div className="w-full flex items-end justify-between gap-1 h-12">
                     <motion.div className="w-full bg-[#ff003c] rounded-t-sm" animate={{ height: ["80%", "40%", "15%"] }} transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }} />
                     <motion.div className="w-full bg-[#fcee0a] rounded-t-sm" animate={{ height: ["60%", "30%", "20%"] }} transition={{ delay: 0.5, duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }} />
                     <motion.div className="w-full bg-[#00f3ff] rounded-t-sm" animate={{ height: ["20%", "70%", "90%"] }} transition={{ delay: 1, duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }} />
                     <motion.div className="w-full bg-[#00f3ff] rounded-t-sm" animate={{ height: ["10%", "50%", "85%"] }} transition={{ delay: 1.5, duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }} />
                   </div>
                   <div className="absolute top-2 left-2 flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                     <span className="text-[8px] font-mono text-green-400">Congestion Drop</span>
                   </div>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="bento-tall">
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
          <div className="bento-tall">
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
                aria-label="Open Gemini Concierge Chat"
                onClick={() => setChatOpen(true)}
                className="w-full py-3 bg-gradient-to-r from-[#21808d] to-purple-600 text-white font-semibold rounded-xl hover:from-[#1d7480] hover:to-purple-700 transition-all shadow-lg shadow-[#1a6873]/20 active:scale-[0.98] text-sm"
              >
                Open Concierge ✨
              </button>
            </GlassCard>
          </div>

          {/* ─── FASTEST QUEUE ─── */}
          <div className="bento-small">
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
          <div className="bento-small">
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
          <div className="bento-wide">
            <GlassCard className="!p-4" aria-live="polite" aria-atomic="true">
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
          <div className="bento-small">
            <GlassCard className="!p-4 h-full">
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
          <div className="bento-small">
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

          {/* ─── AR STATS OVERLAY ─── */}
          <div className="bento-wide">
            <GlassCard className="!p-4 mesh-gradient border-none">
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
          <div className="bento-wide">
            <GlassCard className="!p-4 h-full">
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
                    aria-label={action.label}
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
          <div className="bento-large">
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

    </main>
  );
}

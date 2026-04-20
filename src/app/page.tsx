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
    if (min <= 3) return "#00f3ff";
    if (min <= 7) return "#f59e0b";
    return "#ff5459";
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-[30%] -left-[20%] w-[60%] h-[60%] bg-gradient-to-br from-[#00f3ff]/15 to-transparent rounded-full blur-[150px]" />
        <div className="absolute -bottom-[20%] -right-[15%] w-[40%] h-[40%] bg-gradient-to-tl from-[#db00ff]/15 to-transparent rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-24">
        {/* ═══ HEADER HUD ═══ */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00f3ff] to-[#db00ff] flex items-center justify-center text-lg font-black text-white relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 animate-pulse" />
                <span className="relative z-10 glitch-text" data-text="SF">SF</span>
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
                  <span className="text-white">STADIUM</span>
                  <span className="text-[#00f3ff] neon-text ml-1">FLOW</span>
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                  <p className="text-[10px] font-mono tracking-[0.2em] text-[var(--color-text-secondary)] uppercase">
                    SoFi Stadium ⁄⁄ Live Feed
                  </p>
                </div>
              </div>
            </div>

            {/* Fan Level Badge */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="data-label">Fan Level</p>
                <p className="text-lg font-black text-[#fcee0a] data-value">LV.7</p>
              </div>
              <div className="w-12 h-12 rounded-lg border border-[#fcee0a]/30 bg-[#fcee0a]/5 flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-4 flex items-center gap-3">
            <span className="data-label text-[#00f3ff]">XP</span>
            <div className="xp-bar flex-1">
              <div className="xp-bar-fill" style={{ width: "72%" }} />
            </div>
            <span className="data-label">4,320 / 6,000</span>
          </div>
        </motion.header>

        {/* ═══ DASHBOARD GRID ═══ */}
        <div ref={gridRef} className="bento-grid">

          {/* ── LIVE GAME (full width hero) ── */}
          <div className="bento-hero">
            <div className="cyber-card scanlines">
              <div className="p-4 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse relative pulse-ring" />
                  <span className="cyber-badge badge-magenta">LIVE</span>
                  <span className="text-sm font-semibold text-white ml-1">SoFi Stadium — Rams vs 49ers</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-white data-value">24</span>
                    <span className="text-lg text-[var(--color-text-secondary)]">—</span>
                    <span className="text-2xl font-black text-white data-value">17</span>
                  </div>
                  <span className="cyber-badge badge-cyan">Q3 · 8:42</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── CROWD ROUTING USP (animated neon border) ── */}
          <div className="bento-wide">
            <div className="cyber-card scanlines h-full">
              <div className="p-5 relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded bg-[#00f3ff]/10 border border-[#00f3ff]/30 flex items-center justify-center text-xs">📡</div>
                      <h2 className="text-base font-bold text-white tracking-tight">Real-Time Crowd Routing</h2>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] max-w-xs mb-3">
                      Telemetry nodes predict & redirect foot traffic. Avg wait reduced from <span className="text-[#ff003c] font-bold">22min</span> → <span className="text-[#00f3ff] font-bold neon-text">4min</span>.
                    </p>
                    <div className="flex gap-2">
                      <span className="cyber-badge badge-cyan">SYNC:500MS</span>
                      <span className="cyber-badge badge-magenta">AI ROUTING</span>
                    </div>
                  </div>
                  
                  {/* Animated congestion chart */}
                  <div className="w-28 h-20 bg-black/50 rounded-lg border border-[var(--color-border)] p-2 flex items-end justify-between gap-1">
                    <motion.div className="w-full bg-[#ff003c] rounded-t-sm" animate={{ height: ["80%", "30%", "10%"] }} transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }} />
                    <motion.div className="w-full bg-[#fcee0a] rounded-t-sm" animate={{ height: ["60%", "25%", "15%"] }} transition={{ delay: 0.3, duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }} />
                    <motion.div className="w-full bg-[#00f3ff] rounded-t-sm" animate={{ height: ["15%", "65%", "90%"] }} transition={{ delay: 0.6, duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }} />
                    <motion.div className="w-full bg-[#22c55e] rounded-t-sm" animate={{ height: ["10%", "55%", "85%"] }} transition={{ delay: 0.9, duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── FASTEST QUEUE (HUD-style) ── */}
          <div className="bento-wide">
            <GlassCard className="!p-4 h-full cursor-pointer" onClick={() => router.push("/order")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="data-label mb-1">⚡ FASTEST QUEUE</p>
                  {fastestQueue && (
                    <>
                      <p className="text-sm font-bold text-white">{fastestQueue.standName}</p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{fastestQueue.queueLength} in line</p>
                    </>
                  )}
                </div>
                {fastestQueue && (
                  <div className="text-right">
                    <p className="text-4xl font-black text-[#00f3ff] data-value neon-text">
                      {fastestQueue.estimatedWaitMin}
                    </p>
                    <p className="data-label">MIN WAIT</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* ── VENUE MAP ── */}
          <div className="bento-large">
            <GlassCard
              disableTilt
              className="h-full cursor-pointer !p-4 flex flex-col"
              onClick={() => router.push("/map")}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-[#00f3ff]">VENUE MAP</h2>
                <span className="cyber-badge badge-green">INTERACTIVE</span>
              </div>
              <div className="flex-1 min-h-[220px] bg-[#060610] rounded-lg relative overflow-hidden border border-[var(--color-border)]">
                <svg viewBox="0 0 200 200" className="w-full h-full opacity-70" preserveAspectRatio="xMidYMid meet">
                  <ellipse cx="100" cy="100" rx="85" ry="80" fill="none" stroke="#00f3ff" strokeWidth="6" opacity="0.2">
                    <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="60s" repeatCount="indefinite" />
                  </ellipse>
                  <ellipse cx="100" cy="100" rx="60" ry="56" fill="none" stroke="#db00ff" strokeWidth="3" opacity="0.15" strokeDasharray="8 12">
                    <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="40s" repeatCount="indefinite" />
                  </ellipse>
                  <ellipse cx="100" cy="100" rx="32" ry="28" fill="#0a2010" opacity="0.9" stroke="#22c55e" strokeWidth="1" />
                  <line x1="72" y1="100" x2="128" y2="100" stroke="white" strokeWidth="0.5" opacity="0.2" />
                  <circle cx="40" cy="50" r="5" fill="#f59e0b" opacity="0.9"><animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" /></circle>
                  <circle cx="160" cy="50" r="5" fill="#00f3ff" opacity="0.9"><animate attributeName="opacity" values="0.9;0.4;0.9" dur="2.5s" repeatCount="indefinite" /></circle>
                  <circle cx="160" cy="150" r="5" fill="#db00ff" opacity="0.9"><animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.8s" repeatCount="indefinite" /></circle>
                  <circle cx="40" cy="150" r="5" fill="#6b7280" opacity="0.9" />
                  <circle cx="100" cy="100" r="4" fill="#3b82f6"><animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" /></circle>
                </svg>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-3 text-[9px] text-[var(--color-text-secondary)] font-mono">
                  <span>■ FOOD</span><span>■ DRINK</span><span>■ WC</span><span className="text-blue-400">● YOU</span>
                </div>
                <span className="text-[10px] text-[#00f3ff]">TAP TO EXPLORE →</span>
              </div>
            </GlassCard>
          </div>

          {/* ── QUEUE TIMES (primary data card) ── */}
          <div className="bento-wide" style={{ gridRow: "span 2" }}>
            <GlassCard className="!p-4 h-full" aria-live="polite" aria-atomic="true">
              <div className="flex items-center justify-between mb-4">
                <p className="data-label">CONCESSION WAIT TIMES</p>
                <div className="group relative cursor-help">
                  <div className="w-5 h-5 rounded border border-[#00f3ff]/30 flex items-center justify-center text-[9px] text-[#00f3ff] font-mono">i</div>
                  <div className="hidden group-hover:block absolute right-0 top-7 z-50 w-52 p-3 bg-[#0c0e1a] border border-[#00f3ff]/30 rounded-lg shadow-[0_0_30px_rgba(0,243,255,0.2)] text-[10px]">
                    <p className="font-bold text-[#00f3ff] mb-1 font-mono">REAL-TIME TELEMETRY</p>
                    <p className="text-[var(--color-text-secondary)]">Firebase RTDB syncs every <span className="text-white font-bold">500ms</span> from IoT sensors.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {sortedQueues.slice(0, 6).map((q) => (
                  <div key={q.standId}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white font-medium">{q.standName}</span>
                      <span className="data-value text-sm" style={{ color: getWaitColor(q.estimatedWaitMin) }}>
                        {q.estimatedWaitMin}<span className="text-[9px] font-normal ml-0.5 text-[var(--color-text-secondary)]">min</span>
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
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

          {/* ── SLASH ALERTS ── */}
          <div className="bento-wide">
            <div className="cyber-card h-full">
              <div className="p-4 relative z-10 flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-14 h-14 rounded-lg border border-[#fcee0a]/30 bg-[#fcee0a]/5 flex items-center justify-center shrink-0"
                >
                  <span className="text-2xl">⚡</span>
                </motion.div>
                <div>
                  <h3 className="font-bold text-white text-sm">Slash Alerts</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    Predictive alerts fire when lines drop below 2 min. Trip time: <span className="text-[#ff003c] font-bold line-through">22 min</span> → <span className="text-[#00f3ff] font-bold neon-text">4 min</span>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="cyber-badge badge-green">MONITORING</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── GEMINI CONCIERGE ── */}
          <div className="bento-wide">
            <GlassCard glow className="!p-4 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00f3ff] to-[#db00ff] flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                  <span className="text-lg">✦</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Gemini Concierge</h2>
                  <p className="text-[10px] text-[var(--color-text-secondary)] font-mono">GOOGLE AI • FUNCTION CALLING</p>
                </div>
              </div>
              <div className="space-y-1.5 mb-3 flex-1">
                {["Shortest beer line?", "Navigate to Sec 114", "Order nachos"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setChatOpen(true)}
                    className="w-full text-left text-xs px-3 py-2 rounded-lg bg-white/3 text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[#00f3ff]/50 hover:text-[#00f3ff] transition-all font-mono"
                  >
                    &gt; {q}
                  </button>
                ))}
              </div>
              <button
                aria-label="Open Gemini Concierge Chat"
                onClick={() => setChatOpen(true)}
                className="w-full py-2.5 bg-gradient-to-r from-[#00f3ff]/20 to-[#db00ff]/20 text-[#00f3ff] font-bold rounded-lg border border-[#00f3ff]/30 hover:border-[#00f3ff] hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all active:scale-[0.98] text-sm font-mono tracking-wider"
              >
                OPEN CONCIERGE ✦
              </button>
            </GlassCard>
          </div>

          {/* ── RESTROOMS + ORDERS row ── */}
          <div className="bento-wide">
            <GlassCard className="!p-4 h-full">
              <p className="data-label mb-3">RESTROOM STATUS</p>
              <div className="space-y-2">
                {restrooms.map((q) => (
                  <div key={q.standId} className="flex items-center justify-between">
                    <span className="text-xs text-white font-mono">{q.standName.replace("Restroom ", "WC-")}</span>
                    <span className="data-value text-xs" style={{ color: getWaitColor(q.estimatedWaitMin) }}>
                      {q.estimatedWaitMin} min
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="bento-wide">
            <GlassCard
              glow={activeOrders.some((o) => o.status === "ready")}
              className="!p-4 cursor-pointer h-full"
              onClick={() => router.push("/orders")}
            >
              <p className="data-label mb-3">ACTIVE ORDERS</p>
              {activeOrders.length > 0 ? (
                <div className="space-y-2">
                  {activeOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <span className="text-xs text-white truncate max-w-[120px] font-mono">{order.standName}</span>
                      <span className={`cyber-badge ${
                        order.status === "ready" ? "badge-green" : order.status === "preparing" ? "badge-cyan" : "badge-yellow"
                      }`}>
                        {order.status === "ready" ? "READY" : order.status === "preparing" ? "MAKING" : "QUEUED"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-[var(--color-text-secondary)] font-mono">NO ACTIVE ORDERS</p>
                  <p className="text-xs text-[#00f3ff] mt-1">Tap to order →</p>
                </div>
              )}
            </GlassCard>
          </div>

          {/* ── QUICK ACTIONS ── */}
          <div className="bento-wide">
            <GlassCard className="!p-4 h-full">
              <p className="data-label mb-3">QUICK ACTIONS</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: "🍔", label: "ORDER", path: "/order" },
                  { icon: "🗺", label: "MAP", path: "/map" },
                  { icon: "👥", label: "CREW", path: "/crew" },
                ].map((action) => (
                  <button
                    key={action.label}
                    aria-label={action.label}
                    onClick={() => router.push(action.path)}
                    className="flex flex-col items-center gap-2 py-3 rounded-lg bg-white/3 border border-[var(--color-border)] hover:border-[#00f3ff]/50 hover:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all active:scale-95"
                  >
                    <span className="text-xl">{action.icon}</span>
                    <span className="text-[9px] font-mono tracking-[0.15em] text-[var(--color-text-secondary)]">{action.label}</span>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* ── FIND MY CREW ── */}
          <div className="bento-wide">
            <div className="cyber-card h-full cursor-pointer" onClick={() => router.push("/crew")}>
              <div className="p-4 flex items-center justify-between relative z-10">
                <div>
                  <h2 className="text-sm font-bold text-white">Find My Crew</h2>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 font-mono">
                    {crewId
                      ? `${members.length} MEMBERS • LOCATION SHARING`
                      : "CREATE/JOIN A CREW →"}
                  </p>
                </div>
                <div className="flex -space-x-2">
                  {members.slice(0, 4).map((member, i) => (
                    <motion.div
                      key={member.uid}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="w-9 h-9 rounded-lg border border-[#111424] flex items-center justify-center font-bold text-white text-[10px] font-mono"
                      style={{ backgroundColor: ["#db00ff", "#00f3ff", "#f97316", "#22c55e"][i % 4] }}
                    >
                      {member.avatar}
                    </motion.div>
                  ))}
                  {members.length === 0 && (
                    <div className="w-9 h-9 rounded-lg border border-dashed border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] text-sm">+</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── ACHIEVEMENTS ── */}
          <div className="bento-hero">
            <GlassCard className="!p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="data-label">ACHIEVEMENTS</p>
                <span className="text-xs text-[var(--color-text-secondary)] font-mono">3/12 UNLOCKED</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { icon: "🎯", name: "First Order", desc: "Placed your first order", unlocked: true },
                  { icon: "🏃", name: "Queue Skipper", desc: "Used a Slash Alert", unlocked: true },
                  { icon: "👥", name: "Crew Chief", desc: "Created a crew", unlocked: true },
                  { icon: "🔒", name: "Speed Demon", desc: "Sub-2min pickup", unlocked: false },
                ].map((ach) => (
                  <div key={ach.name} className={`p-3 rounded-lg border text-center ${ach.unlocked ? 'border-[#fcee0a]/30 bg-[#fcee0a]/5' : 'border-[var(--color-border)] bg-white/2 opacity-40'}`}>
                    <span className="text-2xl block mb-1">{ach.icon}</span>
                    <p className="text-[10px] font-bold text-white">{ach.name}</p>
                    <p className="text-[8px] text-[var(--color-text-secondary)] mt-0.5">{ach.desc}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </main>
  );
}

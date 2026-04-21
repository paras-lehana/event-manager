"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { GlassCard } from "@/components/ui/GlassCard";
import { AIChatPanel } from "@/components/ui/AIChatPanel";
import { AchievementsHUD } from "@/components/ui/AchievementsHUD";
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
                onClick={() => router.push("/admin")}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00f3ff] to-[#db00ff] flex items-center justify-center text-lg font-black text-white relative overflow-hidden cursor-pointer group"
              >
                <div className="absolute inset-0 bg-white/10 group-hover:bg-white/30 transition-colors animate-pulse" />
                <span className="relative z-10 glitch-text" data-text="SF">SF</span>
                <div className="absolute inset-0 flex items-center justify-center translate-y-full group-hover:translate-y-0 bg-black/80 transition-transform duration-200">
                  <span className="text-[8px] font-mono font-black">ADMIN</span>
                </div>
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
                  <span className="text-white">STADIUM</span>
                  <span className="text-[#00f3ff] neon-text ml-1 font-outline">FLOW</span>
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                  <p className="text-[10px] font-mono tracking-[0.2em] text-[#00f3ff]/60 uppercase">
                    SoFi Stadium ⁄⁄ <span className="text-[8px] opacity-40">NODE_ID: 767-171-449</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="data-label text-[10px] opacity-40">AUTH_SESSION</p>
                <p className="text-lg font-black text-[#fcee0a] data-value">LEVEL_07</p>
              </div>
              <div className="w-12 h-12 rounded-lg border-2 border-[#fcee0a]/30 bg-[#fcee0a]/5 flex items-center justify-center shadow-[0_0_20px_rgba(252,238,10,0.1)]">
                <span className="text-2xl drop-shadow-md">🏆</span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex flex-col">
               <span className="text-[9px] font-bold text-[#00f3ff]/60 font-mono tracking-widest">LOYALTY_XP</span>
               <span className="text-xs font-black text-white">4,320 ⁄ 6,000</span>
            </div>
            <div className="xp-bar flex-1 h-2 relative">
              <div className="xp-bar-fill shadow-[0_0_15px_rgba(219,0,255,0.5)]" style={{ width: "72%" }} />
            </div>
          </div>
        </motion.header>

        {/* ═══ DASHBOARD GRID ═══ */}
        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min">

          {/* ── LIVE GAME (full width hero) ── */}
          <div className="col-span-2 lg:col-span-4">
            <div className="cyber-card scanlines relative overflow-hidden group cursor-pointer border-[#00f3ff]/20">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-transparent pointer-events-none" />
              <div className="p-4 flex flex-col md:flex-row items-center justify-between relative z-10 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse relative">
                     <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-50" />
                  </div>
                  <span className="cyber-badge badge-magenta border-red-500 text-red-500 text-[10px]">LIVE FEED</span>
                  <span className="text-sm font-black text-white tracking-tight uppercase">SoFi Stadium • Rams vs 49ers</span>
                  <span className="text-[10px] text-white/30 hidden md:block">⁄⁄ BROADCASTID: 9812-X</span>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-4">
                    <div className="text-center font-mono">
                      <p className="text-[8px] text-white/40">RAMS</p>
                      <span className="text-3xl font-black text-white data-value">24</span>
                    </div>
                    <span className="text-lg text-[var(--color-text-secondary)]">—</span>
                    <div className="text-center font-mono">
                      <p className="text-[8px] text-white/40">49ERS</p>
                      <span className="text-3xl font-black text-white data-value">17</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="cyber-badge badge-cyan px-3 py-1 font-black text-sm">Q3 · 08:42</span>
                    <span className="text-[8px] text-[#00f3ff]/60 mt-1 font-mono tracking-widest uppercase">CLOCK_ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CROWD ROUTING USP (spans 2 col, 2 row) ── */}
          <div className="col-span-2 lg:col-span-2 row-span-2">
            <div 
              role="region"
              aria-label="Crowd Dynamics Feed"
              className="cyber-card scanlines h-full relative cursor-pointer group" 
              onClick={() => router.push("/map")}
            >
              <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none text-xs font-mono">FLOW_SCAN_v4.1</div>
              <div className="p-6 relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#00f3ff]/10 border border-[#00f3ff]/40 flex items-center justify-center text-xl shadow-[inset_0_0_10px_rgba(0,243,255,0.2)]">📡</div>
                      <div>
                        <h2 className="text-lg font-black text-white tracking-widest uppercase">CROWD DYNAMICS</h2>
                        <span className="text-[9px] font-mono text-[#00f3ff] animate-pulse">SYSTEM_ONLINE_&_ACTIVE</span>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6 font-medium">
                      Intelligent spatial routing predicts bottleneck formations and redirects traffic to low-density concourses.
                    </p>
                    <div className="flex flex-col gap-4">
                       <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                             <span className="text-[8px] text-white/40 uppercase">Old Wait</span>
                             <span className="text-lg font-black text-white/40 line-through decoration-[#ff003c] decoration-2">22 MIN</span>
                          </div>
                          <div className="w-10 h-[2px] bg-white/10 relative">
                             <div className="absolute inset-0 bg-[#00f3ff] animate-pulse" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[8px] text-[#00f3ff] font-black uppercase">Optimized</span>
                             <span className="text-2xl font-black text-[#00f3ff] neon-text">4 MIN</span>
                          </div>
                       </div>
                       <div className="flex gap-2">
                        <span className="cyber-badge badge-cyan text-[9px] font-mono">REAL-TIME TELEMETRY</span>
                        <span className="cyber-badge badge-magenta text-[9px] font-mono">AI PREDICTION</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 flex-1 flex flex-col justify-end">
                   <div className="w-full h-32 bg-black/60 rounded-xl border border-white/5 p-4 flex items-center justify-around gap-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px]" />
                      {[80, 30, 10, 45, 60, 20, 15, 90].map((h, i) => (
                        <motion.div 
                          key={i}
                          className="w-full rounded-t-sm relative group" 
                          style={{ backgroundColor: h > 70 ? '#ff003c' : h > 40 ? '#fcee0a' : '#00f3ff' }}
                          animate={{ height: [`${h}%`, `${Math.max(10, h-30)}%`, `${h}%`] }} 
                          transition={{ delay: i * 0.1, duration: 2 + Math.random(), ease: "easeInOut", repeat: Infinity }}
                        >
                           <div className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[6px] font-mono text-white transition-opacity">{h}%</div>
                        </motion.div>
                      ))}
                   </div>
                   <p className="text-[8px] font-mono text-[var(--color-text-secondary)] text-center mt-3 tracking-[0.3em] uppercase">BOTTLENECK_HEATMAP_ANALYSIS</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── FASTEST QUEUE (spans 2 col) ── */}
          <div className="col-span-2 lg:col-span-2">
            <GlassCard 
              glow 
              role="button"
              aria-label="Quick Access to Optimal Entry Point"
              className="!p-6 h-full cursor-pointer relative group border-[#00f3ff]/40 shadow-[0_0_30px_rgba(0,243,255,0.1)] overflow-hidden" 
              onClick={() => router.push("/order")}
            >
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#00f3ff]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                     <span className="animate-pulse">⚡</span>
                     <p className="data-label text-[10px] tracking-[0.2em] font-black uppercase">OPTIMAL_ENTRY_POINT</p>
                  </div>
                  {fastestQueue && (
                    <>
                      <h3 className="text-xl font-black text-white tracking-tight uppercase leading-none mb-1 group-hover:text-[#00f3ff] transition-colors">{fastestQueue.standName}</h3>
                      <div className="flex items-center gap-3">
                         <span className="cyber-badge badge-green text-[8px] font-mono">{fastestQueue.queueLength} IN_QUEUE</span>
                         <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">SYDNEY_UNIT_B</span>
                      </div>
                    </>
                  )}
                </div>
                {fastestQueue && (
                  <div className="text-right border-l border-white/10 pl-6">
                    <p className="text-5xl font-black text-[#00f3ff] data-value neon-text leading-none mb-1">
                      {String(fastestQueue.estimatedWaitMin).padStart(2, '0')}
                    </p>
                    <p className="text-[10px] font-mono text-white/60 tracking-widest uppercase">MIN_WAIT</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* ── VENUE MAP (spans 2 col, 2 row) ── */}
          <div className="col-span-2 lg:col-span-2 row-span-2">
            <GlassCard
              disableTilt
              className="h-full cursor-pointer !p-6 flex flex-col border-[#00f3ff]/20 bg-[#0c0e1a]/80 group"
              onClick={() => router.push("/map")}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                   <h2 className="text-lg font-black text-white tracking-widest uppercase">SPATIAL HUD</h2>
                   <p className="text-[10px] font-mono text-[#00f3ff]">MAP_REVISION: 8.4.1</p>
                </div>
                <span className="cyber-badge badge-green shadow-[0_0_15px_rgba(34,197,94,0.3)] text-[10px]">INTELLIGENT</span>
              </div>
              
              <div className="flex-1 min-h-[300px] bg-[#060610] rounded-xl relative overflow-hidden border border-white/5 group-hover:border-white/10 transition-colors">
                <div className="absolute inset-0 z-10 pointer-events-none">
                   <motion.div 
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-full h-1 bg-[#00f3ff]/30 shadow-[0_0_20px_#00f3ff] relative"
                   />
                </div>

                <svg viewBox="0 0 200 200" className="w-full h-full p-4" preserveAspectRatio="xMidYMid meet">
                  <ellipse cx="100" cy="100" rx="90" ry="85" fill="none" stroke="#00f3ff" strokeWidth="1" strokeDasharray="2 4" opacity="0.3" />
                  <ellipse cx="100" cy="100" rx="65" ry="60" fill="none" stroke="#db00ff" strokeWidth="5" opacity="0.1" />
                  <ellipse cx="100" cy="100" rx="45" ry="40" fill="#0a2010" stroke="#22c55e" strokeWidth="1" opacity="0.8" />
                  <line x1="60" y1="100" x2="140" y2="100" stroke="white" strokeWidth="0.5" opacity="0.1" />
                  
                  {[
                    { x: 40, y: 55, c: "#f59e0b" },
                    { x: 160, y: 55, c: "#00f3ff" },
                    { x: 160, y: 145, c: "#db00ff" },
                    { x: 40, y: 145, c: "#6b7280" }
                  ].map((p, i) => (
                    <g key={i}>
                       <circle cx={p.x} cy={p.y} r="2" fill={p.c} />
                    </g>
                  ))}
                  <circle cx="100" cy="105" r="4" fill="#3b82f6" />
                </svg>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                   <div className="flex flex-col gap-0.5">
                      <span className="text-[7px] font-mono text-white/40 tracking-widest uppercase">CONC_NODES: 12</span>
                      <span className="text-[7px] font-mono text-[#00f3ff] tracking-widest uppercase">ENCRYPT_MODE_AES:256</span>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-white uppercase tracking-tighter">SOFI STADIUM</p>
                   </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-4">
                   <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]" />
                       <span className="text-[9px] font-mono text-white font-black tracking-widest">YOU</span>
                   </div>
                </div>
                <div className="group flex items-center gap-2 px-3 py-1 bg-white/5 rounded border border-white/5 hover:border-[#00f3ff]/40 transition-all">
                  <span className="text-[8px] font-black text-white tracking-[0.25em] uppercase">INITIATE_MAP</span>
                  <span className="text-[10px] text-[#00f3ff] group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* ── QUEUE LATENCY (spans 2 col, 2 row) ── */}
          <div className="col-span-2 lg:col-span-2 row-span-2">
            <GlassCard className="!p-6 h-full border-[#db00ff]/20 bg-[#160c1a]/40" aria-live="polite" aria-atomic="true">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="data-label text-[10px] font-mono tracking-widest">IOT_TELEMETRY_FEED</p>
                  <h2 className="text-lg font-black text-white tracking-widest uppercase mt-1">QUEUE LATENCY</h2>
                </div>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 rounded-full border border-[#db00ff]/30 flex items-center justify-center text-sm text-[#db00ff] relative"
                >
                   <span className="absolute">⟳</span>
                </motion.div>
              </div>

              <div className="space-y-5">
                {sortedQueues.slice(0, 6).map((q, i) => (
                  <div key={q.standId} className="group cursor-pointer" onClick={() => router.push(`/order?standId=${q.standId}`)}>
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex flex-col">
                         <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">STAND_ID: {q.standId.slice(0, 8)}</span>
                         <span className="text-[13px] font-black text-white tracking-tight leading-none group-hover:text-[#db00ff] transition-colors">{q.standName.toUpperCase()}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black data-value leading-none" style={{ color: getWaitColor(q.estimatedWaitMin) }}>
                          {String(q.estimatedWaitMin).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] font-mono ml-1 text-white/40 uppercase">MIN</span>
                      </div>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-sm overflow-hidden p-[2px] border border-white/5">
                      <motion.div
                        className="h-full rounded-sm shadow-[0_0_10px_currentColor]"
                        style={{ backgroundColor: getWaitColor(q.estimatedWaitMin), color: getWaitColor(q.estimatedWaitMin) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((q.estimatedWaitMin / 15) * 100, 100)}%` }}
                        transition={{ delay: i * 0.1, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                 <button 
                  onClick={() => router.push("/order")}
                  className="w-full py-3 bg-[#db00ff]/10 hover:bg-[#db00ff]/20 border border-[#db00ff]/30 rounded-lg text-[10px] font-black text-[#db00ff] uppercase tracking-[0.3em] transition-all"
                 >
                    EXPLORE_ALL_CONCESSIONS
                 </button>
              </div>
            </GlassCard>
          </div>

          {/* ── SLASH ALERTS HUD ── */}
          <div className="col-span-2">
            <div className="cyber-card h-full border-[#fcee0a]/30">
              <div className="p-6 relative z-10 flex items-center gap-6">
                <motion.div
                  animate={{ 
                    scale: [1, 1.15, 1],
                    boxShadow: ["0 0 0px #fcee0a", "0 0 20px #fcee0a", "0 0 0px #fcee0a"]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-16 h-16 rounded-xl border border-[#fcee0a]/50 bg-[#fcee0a]/10 flex items-center justify-center shrink-0"
                >
                  <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(252,238,10,0.8)]">⚡</span>
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                     <h3 className="font-black text-white text-base tracking-widest uppercase">SLASH ALERTS_v2</h3>
                     <span className="text-[8px] font-mono text-white/40 uppercase">PREDICTIVE_FIREBASE_ALGO</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-medium">
                     Neural monitoring of queue velocity. Average excursion time optimized: <span className="text-[#ff003c] font-black line-through italic mr-2">22 MIN</span> <span className="text-[#00f3ff] font-black neon-text">⁄⁄ 04 MIN</span>
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[9px] font-black text-green-400 tracking-widest uppercase">MONITOR_ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── GEMINI AGENTIC HUD ── */}
          <div className="col-span-2 lg:col-span-2">
            <GlassCard glow className="!p-6 h-full flex flex-col border-[#00f3ff]/30 bg-[#0c1a1a]/40 group" onClick={() => setChatOpen(true)}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00f3ff] to-[#db00ff] flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.4)] group-hover:scale-110 transition-transform">
                    <span className="text-2xl text-white font-serif drop-shadow-md">✦</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white tracking-widest uppercase leading-none">GEMINI CONCIERGE</h2>
                    <p className="text-[10px] text-[var(--color-text-secondary)] font-mono tracking-widest mt-1 uppercase">LLM_AGENT ⁄⁄ FUNC_CALLING_v1.5</p>
                  </div>
                </div>
                <div className="text-right">
                   <div className="flex items-center gap-1 justify-end">
                      <div className="w-1 h-1 rounded-full bg-[#00f3ff]" />
                      <div className="w-1 h-1 rounded-full bg-[#00f3ff]" />
                      <div className="w-1 h-1 rounded-full bg-[#00f3ff]" />
                   </div>
                   <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">READY_TO_CHAT</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2 mb-6">
                {[
                  "Which restroom has no line right now?",
                  "Order two hot dogs and a soda to Sec 102",
                  "Estimate wait for Rams merchandise stand"
                ].map((q) => (
                  <div
                    key={q}
                    className="group-hover:translate-x-2 transition-transform cursor-pointer flex items-center gap-3 py-2 px-3 rounded border border-white/5 bg-white/2"
                  >
                    <span className="text-[#00f3ff] font-mono text-[10px]">&gt;</span>
                    <span className="text-xs text-[var(--color-text-secondary)] font-mono group-hover:text-white transition-colors">{q}</span>
                  </div>
                ))}
              </div>
              
              <button
                aria-label="Engage StadiumFlow Neural Assistant"
                className="w-full py-4 relative overflow-hidden rounded-xl border border-[#00f3ff]/50 bg-black/40 group/btn"
              >
                 <div className="absolute inset-0 bg-[#00f3ff]/5 scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-500" />
                 <span className="relative z-10 text-[10px] font-black text-[#00f3ff] uppercase tracking-[0.4em]">INITIATE_NEURAL_LINK ✦</span>
              </button>
            </GlassCard>
          </div>

          {/* ── RESTROOMS HUD ── */}
          <div className="col-span-2 lg:col-span-1">
            <GlassCard className="!p-5 h-full bg-black/60 border-white/5 relative overflow-hidden group hover:border-[#00f3ff]/20 transition-all cursor-pointer" onClick={() => router.push("/map?filter=restroom")}>
              <div className="absolute top-0 right-0 p-3 text-[10px] text-white/10 font-mono tracking-widest pointer-events-none uppercase">WC_MONITOR</div>
              <p className="data-label text-[10px] mb-4 text-[#00f3ff]/60 uppercase tracking-[0.2em] font-black">FACILITY_STATUS</p>
              <div className="space-y-4">
                {restrooms.map((q) => (
                  <div key={q.standId} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] text-white font-black uppercase font-mono">{q.standName.replace("Restroom ", "UNIT-")}</span>
                       <span className="text-sm font-black italic" style={{ color: getWaitColor(q.estimatedWaitMin) }}>
                          {q.estimatedWaitMin}M
                       </span>
                    </div>
                    <div className="w-full h-[1px] bg-white/5 relative">
                       <div className="h-full bg-white/20" style={{ width: `${(q.queueLength / 10) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <GlassCard
              glow={activeOrders.some((o) => o.status === "ready")}
              className="!p-5 cursor-pointer h-full border-white/5 bg-black/60 relative overflow-hidden group hover:border-[#db00ff]/20 transition-all font-mono"
              onClick={() => router.push("/orders")}
            >
              <div className="absolute top-0 right-0 p-3 text-[10px] text-white/10 font-mono tracking-widest pointer-events-none">TX_BUFFER</div>
              <p className="data-label text-[10px] mb-4 text-[#db00ff]/60 uppercase tracking-[0.2em] font-black">ACTIVE_ORDERS</p>
              {activeOrders.length > 0 ? (
                <div className="space-y-4">
                  {activeOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white truncate max-w-[80px] font-black">{order.standName.toUpperCase()}</span>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                          order.status === "ready" ? "bg-green-400/20 border-green-400 text-green-400" : order.status === "preparing" ? "bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff]" : "bg-yellow-400/20 border-yellow-400 text-yellow-400"
                        }`}>
                          {order.status === "ready" ? "READY" : order.status === "preparing" ? "PROCESS" : "QUEUE"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-[10px] text-white/30 tracking-widest uppercase">NO_ACTIVE_TX</p>
                  <p className="text-[8px] text-[#db00ff] mt-2 group-hover:scale-110 transition-transform">INITIALIZE_COMMERCE ▷</p>
                </div>
              )}
            </GlassCard>
          </div>

          {/* ── QUICK ACTIONS ── */}
          <div className="col-span-2">
            <GlassCard className="!p-6 h-full border-white/5 bg-black/40">
              <p className="data-label text-[10px] mb-4 text-white/40 uppercase tracking-[0.3em] font-black">SYSTEM_COMMANDS</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: "🍔", label: "ORDER", path: "/order" },
                  { icon: "🗺", label: "MAP", path: "/map" },
                  { icon: "👥", label: "CREW", path: "/crew" },
                ].map((action) => (
                  <button
                    key={action.label}
                    aria-label={action.label}
                    onClick={() => router.push(action.path)}
                    className="flex flex-col items-center gap-3 py-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#00f3ff]/50 hover:bg-[#00f3ff]/5 transition-all active:scale-95 group/act"
                  >
                    <span className="text-2xl group-hover/act:scale-110 transition-transform">{action.icon}</span>
                    <span className="text-[10px] font-black tracking-widest text-[var(--color-text-secondary)] uppercase group-hover/act:text-[#00f3ff] transition-colors">{action.label}</span>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* ── FIND MY CREW (spans 2 col) ── */}
          <div className="col-span-2">
            <div className="cyber-card h-full cursor-pointer hover:border-[#db00ff]/50 transition-all group" onClick={() => router.push("/crew")}>
              <div className="p-6 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl group-hover:bg-[#db00ff]/10 group-hover:border-[#db00ff]/40 transition-all shadow-[inset_0_0_10px_rgba(219,0,255,0.1)]">
                      👥
                   </div>
                   <div>
                    <h2 className="text-base font-black text-white tracking-widest uppercase">CREW_COORD_NET</h2>
                    <p className="text-[10px] font-mono text-[var(--color-text-secondary)] mt-1 tracking-widest uppercase">
                      {crewId
                        ? `${String(members.length).padStart(2, '0')} ACTIVE_UNITS ⁄⁄ LOCATION_SYNC_ON`
                        : "ESTABLISH_NEW_CREW_NETWORKS ▷"}
                    </p>
                  </div>
                </div>
                <div className="flex -space-x-3">
                  {members.slice(0, 4).map((member, i) => (
                    <motion.div
                      key={member.uid}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="w-10 h-10 rounded-xl border border-[#0c0e1a] flex items-center justify-center font-black text-white text-[10px] font-mono shadow-[5px_0_15px_rgba(0,0,0,0.5)] z-10"
                      style={{ backgroundColor: ["#db00ff", "#00f3ff", "#f97316", "#22c55e"][i % 4] }}
                    >
                      {member.avatar}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── ACHIEVEMENTS HUD (Full Width) ── */}
          <div className="col-span-2 lg:col-span-4">
            <AchievementsHUD />
          </div>

        </div>
      </div>
    </main>
  );
}

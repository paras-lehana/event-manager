"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useCrew } from "@/lib/providers";
import { VenueMap } from "@/components/ui/VenueMap";
import { motion } from "framer-motion";
import { useState } from "react";

const CREW_COLORS = ["#db00ff", "#a855f6", "#f97316", "#ef4444", "#22c55e"];

export default function CrewPage() {
  const { crewId, members, createCrew, leaveCrew } = useCrew();
  const [shareCode, setShareCode] = useState("");

  const crewPositions = members.map((m, i) => ({
    id: m.uid,
    name: m.avatar,
    x: 30 + (i * 15) + Math.random() * 10,
    y: 30 + (i * 12) + Math.random() * 10,
    color: CREW_COLORS[i % CREW_COLORS.length],
  }));

  return (
    <main className="min-h-screen bg-[var(--background)] text-[#f5f5f5] pb-24">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-1 tracking-tight">Find My Crew 👥</h1>
          <p className="text-[var(--color-text-secondary)] mb-6">See where your friends are in the stadium</p>
        </motion.div>

        {crewId ? (
          <>
            {/* Crew info */}
            <GlassCard className="mb-4 border-t-2 border-[#00f3ff]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black text-xl text-white glow-teal tracking-wide">Crew Active</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] font-mono mt-1">SECURE_LINK: <span className="text-[#00f3ff]">{crewId}</span></p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(crewId);
                  }}
                  className="magnetic-btn text-xs px-4 py-2 rounded-full border border-[#00f3ff]/30 bg-[#00f3ff]/10 text-[#00f3ff] hover:bg-[#00f3ff]/20 transition-all shadow-[0_0_10px_rgba(50,184,198,0.2)]"
                >
                  📋 COPY CIPHER
                </button>
              </div>

              {/* Member list */}
              <div className="space-y-3">
                {members.map((member, i) => (
                  <motion.div
                    key={member.uid}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-[var(--background)]/50 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="relative">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg z-10 relative"
                        style={{ backgroundColor: CREW_COLORS[i % CREW_COLORS.length] }}
                      >
                        {member.avatar}
                      </div>
                      <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: CREW_COLORS[i % CREW_COLORS.length] }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white tracking-wide">{member.displayName}</p>
                      <p className="text-xs text-[var(--color-text-secondary)] font-mono">
                        Ping: {Math.floor((Date.now() - member.lastSeen) / 1000)}ms
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Map with crew positions */}
            <GlassCard>
              <h3 className="font-semibold text-[var(--color-text-secondary)] uppercase text-xs tracking-wider mb-3">
                Crew Locations
              </h3>
              <VenueMap crewPositions={crewPositions} />
            </GlassCard>

            <button
              onClick={leaveCrew}
              className="w-full mt-4 py-3 border border-[var(--color-error)]/30 text-[var(--color-error)] rounded-xl hover:bg-[var(--color-error)]/10 transition-colors"
            >
              Leave Crew
            </button>
          </>
        ) : (
          <div className="space-y-6">
            <GlassCard className="text-center py-10 relative overflow-hidden group border-t border-[#00f3ff]/30">
              <div className="absolute inset-0 mesh-gradient opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative z-10 w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#00f3ff]/20 to-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-5xl group-hover:scale-125 transition-transform duration-500 delay-100">🤝</span>
                <div className="absolute inset-0 rounded-full border border-[#00f3ff]/50 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-wide glow-teal uppercase">Secure Handshake</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-8 max-w-[250px] mx-auto leading-relaxed">
                Sync locations and orders with your group via encrypted peerlink.
              </p>
              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <button
                  onClick={() => createCrew("My Crew")}
                  className="magnetic-btn py-4 bg-gradient-to-r from-[#db00ff] to-purple-600 text-white rounded-xl font-bold shadow-[0_0_15px_rgba(50,184,198,0.4)] transition-all active:scale-95"
                >
                  Generate Root Beacon
                </button>
                <div className="flex items-center gap-3">
                  <div className="h-px bg-white/10 flex-1" />
                  <span className="text-xs font-mono text-[var(--color-text-secondary)] hidden md:block">OR INTERCEPT SIGNAL</span>
                  <div className="h-px bg-white/10 flex-1" />
                </div>
                <div className="flex gap-2">
                  <input
                    value={shareCode}
                    onChange={(e) => setShareCode(e.target.value)}
                    placeholder="Enter 6-char Cipher..."
                    className="flex-[2] bg-[#111424] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-center text-white placeholder-[var(--color-text-secondary)] font-mono uppercase tracking-widest focus:outline-none focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff]/50 transition-all shadow-inner"
                    maxLength={6}
                  />
                  <button
                    onClick={() => shareCode && createCrew(shareCode)}
                    disabled={shareCode.length < 3}
                    className="flex-1 magnetic-btn px-4 py-3.5 bg-white/5 border border-[#00f3ff]/50 text-[#00f3ff] rounded-xl hover:bg-[#00f3ff]/20 disabled:opacity-50 transition-all font-bold tracking-wide"
                  >
                    SYNC
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </main>
  );
}

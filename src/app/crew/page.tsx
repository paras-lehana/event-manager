"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useCrew } from "@/lib/providers";
import { VenueMap } from "@/components/ui/VenueMap";
import { motion } from "framer-motion";
import { useState } from "react";

const CREW_COLORS = ["#21808d", "#a855f6", "#f97316", "#ef4444", "#22c55e"];

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
    <main className="min-h-screen bg-[#1f2121] text-[#f5f5f5] pb-24">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-1 tracking-tight">Find My Crew 👥</h1>
          <p className="text-[var(--color-text-secondary)] mb-6">See where your friends are in the stadium</p>
        </motion.div>

        {crewId ? (
          <>
            {/* Crew info */}
            <GlassCard className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white">Crew Active</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">Code: {crewId}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(crewId);
                  }}
                  className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-teal-300)] transition-colors"
                >
                  📋 Copy Code
                </button>
              </div>

              {/* Member list */}
              <div className="space-y-2">
                {members.map((member, i) => (
                  <motion.div
                    key={member.uid}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: CREW_COLORS[i % CREW_COLORS.length] }}
                    >
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{member.displayName}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        Last seen {Math.floor((Date.now() - member.lastSeen) / 1000)}s ago
                      </p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
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
          <div className="space-y-4">
            <GlassCard className="text-center py-8">
              <span className="text-5xl mb-4 block">👥</span>
              <h3 className="text-xl font-bold text-white mb-2">No active crew</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                Create a crew or join one with a code to see your friends on the map
              </p>
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <button
                  onClick={() => createCrew("My Crew")}
                  className="py-3 bg-[var(--color-teal-500)] text-white rounded-xl font-bold hover:bg-[var(--color-teal-600)] transition-colors"
                >
                  Create Crew
                </button>
                <div className="flex gap-2">
                  <input
                    value={shareCode}
                    onChange={(e) => setShareCode(e.target.value)}
                    placeholder="Enter crew code"
                    className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-teal-300)]"
                  />
                  <button
                    onClick={() => shareCode && createCrew(shareCode)}
                    className="px-4 py-3 border border-[var(--color-teal-300)] text-[var(--color-teal-300)] rounded-xl hover:bg-[var(--color-teal-300)]/10 transition-colors"
                  >
                    Join
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

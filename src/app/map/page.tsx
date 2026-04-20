"use client";

import { useState } from "react";
import { VenueMap } from "@/components/ui/VenueMap";
import { StandMenu } from "@/components/ui/StandMenu";
import { GlassCard } from "@/components/ui/GlassCard";
import { Stand } from "@/lib/types";
import { motion } from "framer-motion";

export default function MapPage() {
  const [selectedStand, setSelectedStand] = useState<Stand | null>(null);

  const crewPositions = [
    { id: "u1", name: "AJ", avatar: "AJ", x: 35, y: 30, color: "#db00ff" },
    { id: "u2", name: "MK", avatar: "MK", x: 65, y: 35, color: "#a855f6" },
    { id: "u3", name: "DS", avatar: "DS", x: 40, y: 70, color: "#f97316" },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[#f5f5f5] pb-24">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-1 tracking-tight">Stadium Map</h1>
          <p className="text-[var(--color-text-secondary)] mb-6">Tap a marker to view details or navigate</p>
        </motion.div>

        {selectedStand ? (
          <StandMenu stand={selectedStand} onBack={() => setSelectedStand(null)} />
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard disableTilt>
              <VenueMap
                onStandClick={(stand) => setSelectedStand(stand)}
                highlightStand={null}
                crewPositions={crewPositions}
              />
            </GlassCard>
          </motion.div>
        )}
      </div>
    </main>
  );
}

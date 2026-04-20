"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_STANDS, MOCK_VENUE } from "@/lib/mock-data";
import { useQueues } from "@/lib/providers";
import { Stand } from "@/lib/types";

function getMarkerColor(type: Stand["type"]): string {
  switch (type) {
    case "food": return "#f59e0b";
    case "beverage": return "#00f3ff";
    case "merchandise": return "#a855f6";
    case "restroom": return "#6b7280";
    default: return "#fff";
  }
}

function getMarkerIcon(type: Stand["type"]): string {
  switch (type) {
    case "food": return "🍔";
    case "beverage": return "🍺";
    case "merchandise": return "🏪";
    case "restroom": return "🚻";
    default: return "📍";
  }
}

interface VenueMapProps {
  onStandClick?: (stand: Stand) => void;
  highlightStand?: string | null;
  crewPositions?: { id: string; name: string; avatar: string; x: number; y: number; color: string }[];
}

export function VenueMap({ onStandClick, highlightStand, crewPositions }: VenueMapProps) {
  const [hoveredStand, setHoveredStand] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const { queues } = useQueues();

  // Map stand positions in an oval pattern
  const standPositions = MOCK_STANDS.map((stand, i) => {
    const angle = (i / MOCK_STANDS.length) * 2 * Math.PI - Math.PI / 2;
    return {
      stand,
      x: 50 + Math.cos(angle) * 38,
      y: 50 + Math.sin(angle) * 36,
    };
  });

  const filteredPositions = filter === "all"
    ? standPositions
    : standPositions.filter((sp) => sp.stand.type === filter);

  // Constants for map layout
  const cx = 250;
  const cy = 250;
  const rx = 210;
  const ry = 200;

  return (
    <div className="relative w-full">
      {/* Filter buttons */}
      <div className="flex gap-2 mb-4 scrollbar-hide overflow-x-auto pb-1">
        {["all", "food", "beverage", "restroom", "merchandise"].map((f) => (
          <button
            key={f}
            aria-label={`Filter by ${f}`}
            onClick={() => setFilter(f)}
            className={`text-[10px] uppercase font-mono tracking-wider px-3 py-1.5 rounded border transition-all whitespace-nowrap ${
              filter === f
                ? "bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.2)]"
                : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[#00f3ff]/50 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Map container */}
      <div className="relative w-full aspect-square max-h-[550px] rounded-2xl overflow-hidden border border-[#00f3ff]/20 bg-[#06060c] shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] group">
        {/* Dynamic Scanning Grid */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00f3ff_1px,transparent_1px)] bg-[size:40px_40px]" 
            style={{ transform: "perspective(500px) rotateX(60deg) translateY(0%) scale(2)" }}
          />
        </div>

        {/* Stadium SVG Layered Architecture */}
        <svg 
          viewBox="0 0 500 500" 
          className="w-full h-full p-4 relative z-10"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* DEFINITIONS for effects */}
          <defs>
            <radialGradient id="radar-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00f3ff" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* TIER 3: Outer Concourse */}
          <ellipse 
            cx={cx} cy={cy} rx={rx} ry={ry} 
            fill="none" stroke="#00f3ff" strokeOpacity="0.1" strokeWidth="40" 
            className="transition-all duration-700"
          />
          <ellipse 
            cx={cx} cy={cy} rx={rx + 15} ry={ry + 15} 
            fill="none" stroke="#00f3ff" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="10 20" 
          >
             <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="120s" repeatCount="indefinite" />
          </ellipse>

          {/* TIER 2: Seating Tiers */}
          <ellipse 
            cx={cx} cy={cy} rx={rx * 0.75} ry={ry * 0.75} 
            fill="none" stroke="#00f3ff" strokeOpacity="0.15" strokeWidth="30" 
          />
          
          {/* TIER 1: Lower Field Seating */}
          <ellipse 
            cx={cx} cy={cy} rx={rx * 0.52} ry={ry * 0.52} 
            fill="none" stroke="#db00ff" strokeOpacity="0.15" strokeWidth="15" 
          />

          {/* FIELD */}
          <ellipse 
            cx={cx} cy={cy} rx={rx * 0.38} ry={ry * 0.38} 
            fill="#0a2010" stroke="#22c55e" strokeOpacity="0.6" strokeWidth="2" 
            filter="url(#glow)"
          />
          {/* Center Circle & Lines */}
          <circle cx={cx} cy={cy} r="25" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1={cx - 70} y1={cy} x2={cx + 70} y2={cy} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

          {/* RADAR SWEEP ANIMATION */}
          <g className="origin-center pointer-events-none">
            <line x1={cx} y1={cy} x2={cx} y2={cy - rx - 20} stroke="#00f3ff" strokeWidth="4" strokeOpacity="0.4" filter="url(#glow)">
              <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="8s" repeatCount="indefinite" />
            </line>
            <path 
              d={`M ${cx} ${cy} L ${cx} ${cy - rx - 20} A ${rx + 20} ${rx + 20} 0 0 1 ${cx + 100} ${cy - rx + 30} Z`} 
              fill="url(#radar-gradient)" 
              opacity="0.3"
            >
              <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="8s" repeatCount="indefinite" />
            </path>
          </g>

          {/* STADIUM SECTION NUMBERS */}
          {MOCK_VENUE.sections.map((sec, i) => {
            const angle = (i / MOCK_VENUE.sections.length) * 2 * Math.PI - Math.PI / 2;
            const textX = cx + Math.cos(angle) * rx * 0.9;
            const textY = cy + Math.sin(angle) * ry * 0.9;
            return (
              <text 
                key={sec.id} x={textX} y={textY} 
                fill="white" fillOpacity="0.4" fontSize="8" fontWeight="bold" fontFamily="monospace"
                textAnchor="middle" alignmentBaseline="middle"
              >
                {sec.name.replace("Section ", "")}
              </text>
            );
          })}
        </svg>

        {/* Stand markers (Overlayed for better interaction) */}
        {filteredPositions.map(({ stand, x, y }) => {
          const queue = queues.find((q) => q.standId === stand.id);
          const isHighlighted = highlightStand === stand.id;
          const isHovered = hoveredStand === stand.id;
          const waitColor = queue ? (queue.estimatedWaitMin <= 3 ? "#00f3ff" : queue.estimatedWaitMin <= 7 ? "#fcee0a" : "#ff003c") : "#ffffff";

          return (
            <motion.div
              key={stand.id}
              className="absolute cursor-pointer z-20"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
              initial={false}
              animate={{
                scale: isHighlighted || isHovered ? 1.4 : 1,
                opacity: 1
              }}
              whileHover={{ scale: 1.4 }}
              onMouseEnter={() => setHoveredStand(stand.id)}
              onMouseLeave={() => setHoveredStand(null)}
              onClick={() => onStandClick?.(stand)}
            >
              <div
                className={`relative w-9 h-9 rounded-lg flex items-center justify-center text-base shadow-lg transition-all border border-white/20 overflow-hidden ${
                   isHighlighted ? "z-30" : ""
                }`}
                style={{
                  backgroundColor: "#0c0e1a",
                  boxShadow: `0 0 15px ${waitColor}40`,
                }}
              >
                {/* Status Glow Border */}
                <div className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: waitColor }} />
                <span className="relative z-10">{getMarkerIcon(stand.type)}</span>
                
                {/* Background pulse for distance status */}
                {queue && queue.estimatedWaitMin <= 3 && (
                  <motion.div 
                    animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute inset-0 bg-[#00f3ff]/20 rounded-lg"
                  />
                )}
              </div>

              {/* HUD Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 min-w-[140px] z-[100]"
                  >
                    <div className="bg-[#0c0e1a]/95 backdrop-blur-xl border border-[#00f3ff]/30 rounded px-3 py-2 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col gap-1">
                      <p className="text-[10px] font-black text-white tracking-widest uppercase truncate">{stand.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[9px] font-mono text-[var(--color-text-secondary)]">LATENCY</span>
                        <span className="text-[9px] font-mono text-[#00f3ff]">REAL-TIME</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-[var(--color-text-secondary)]">WAIT</span>
                        <span className="text-xs font-black" style={{ color: waitColor }}>{queue?.estimatedWaitMin || 0} MIN</span>
                      </div>
                      {/* Capacity usage mini-bar */}
                      <div className="w-full bg-white/10 h-0.5 mt-1 rounded-full overflow-hidden">
                        <div className="h-full bg-[#00f3ff]" style={{ width: `${Math.min(((queue?.queueLength || 0) / 10) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Crew markers with floating badges */}
        {crewPositions?.map((member) => (
          <motion.div
            key={member.id}
            className="absolute z-40"
            style={{
              left: `${member.x}%`,
              top: `${member.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              y: [0, -4, 0],
            }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white border border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.3)] relative"
              style={{ backgroundColor: member.color }}
            >
               <span className="text-[10px] drop-shadow-md">{member.avatar}</span>
               {/* Online Ring */}
               <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-400 border border-[#0c0e1a]" />
            </div>
          </motion.div>
        ))}

        {/* User position (The Pulse) */}
        <motion.div
          className="absolute z-50 pointer-events-none"
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        >
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 w-8 h-8 -ml-2 -mt-2 rounded-full bg-blue-500/30"
            />
            <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_20px_rgba(59,130,246,0.8)] relative z-10" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 bg-blue-500 rounded text-[7px] font-black text-white uppercase tracking-tighter">YOU</div>
          </div>
        </motion.div>

        {/* HUD Scan Overlay Corners */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#00f3ff]/40 pointer-events-none" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#00f3ff]/40 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#00f3ff]/40 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#00f3ff]/40 pointer-events-none" />
      </div>

      {/* Modern HUD Legend */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {[
          { color: "#f59e0b", label: "CONCESSIONS", icon: "🍔" },
          { color: "#00f3ff", label: "BEVERAGES", icon: "🍺" },
          { color: "#6b7280", label: "RESTROOMS", icon: "🚻" },
          { color: "#db00ff", label: "CREW UNITS", icon: "👥" },
        ].map((item) => (
          <div key={item.label} className="bg-black/20 border border-[var(--color-border)] rounded-lg p-2.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-sm border-l-2" style={{ borderColor: item.color }}>
              {item.icon}
            </div>
            <div>
              <p className="text-[8px] font-mono text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">{item.label}</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-black text-white">ACTIVE</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  crewPositions?: { id: string; name: string; x: number; y: number; color: string }[];
}

export function VenueMap({ onStandClick, highlightStand, crewPositions }: VenueMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredStand, setHoveredStand] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const { queues } = useQueues();

  // Draw the stadium SVG-style canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#0a1128";
    ctx.fillRect(0, 0, width, height);

    // Stadium oval
    const cx = width / 2;
    const cy = height / 2;
    const rx = width * 0.42;
    const ry = height * 0.40;

    // Outer ring (stands)
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(50, 184, 198, 0.3)";
    ctx.lineWidth = 30;
    ctx.stroke();

    // Inner ring (seating)
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 0.75, ry * 0.75, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(50, 184, 198, 0.15)";
    ctx.lineWidth = 20;
    ctx.stroke();

    // Field
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 0.45, ry * 0.45, 0, 0, 2 * Math.PI);
    ctx.fillStyle = "#1a5c28";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Field lines
    ctx.beginPath();
    ctx.moveTo(cx - rx * 0.35, cy);
    ctx.lineTo(cx + rx * 0.35, cy);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Section labels
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.textAlign = "center";
    MOCK_VENUE.sections.forEach((sec, i) => {
      const angle = (i / MOCK_VENUE.sections.length) * 2 * Math.PI - Math.PI / 2;
      const labelX = cx + Math.cos(angle) * rx * 0.85;
      const labelY = cy + Math.sin(angle) * ry * 0.85;
      ctx.fillText(sec.name.replace("Section ", "S"), labelX, labelY);
    });
  }, []);

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

  return (
    <div className="relative w-full">
      {/* Filter buttons */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {["all", "food", "beverage", "restroom", "merchandise"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              filter === f
                ? "bg-[var(--color-teal-500)] border-[var(--color-teal-300)] text-white"
                : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-teal-300)]"
            }`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Map container */}
      <div className="relative w-full aspect-square max-h-[500px] rounded-xl overflow-hidden border border-[var(--color-border)]">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full h-full"
        />

        {/* Stand markers */}
        {filteredPositions.map(({ stand, x, y }) => {
          const queue = queues.find((q) => q.standId === stand.id);
          const isHighlighted = highlightStand === stand.id;
          const isHovered = hoveredStand === stand.id;

          return (
            <motion.div
              key={stand.id}
              className="absolute cursor-pointer"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
              whileHover={{ scale: 1.3 }}
              onMouseEnter={() => setHoveredStand(stand.id)}
              onMouseLeave={() => setHoveredStand(null)}
              onClick={() => onStandClick?.(stand)}
            >
              <div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg transition-all ${
                  isHighlighted ? "ring-2 ring-white scale-125" : ""
                }`}
                style={{
                  backgroundColor: getMarkerColor(stand.type),
                  boxShadow: isHighlighted
                    ? `0 0 20px ${getMarkerColor(stand.type)}`
                    : `0 0 10px ${getMarkerColor(stand.type)}40`,
                }}
              >
                {getMarkerIcon(stand.type)}
              </div>

              {/* Tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#111424] border border-[var(--color-border)] rounded-lg px-3 py-2 whitespace-nowrap z-10 shadow-xl"
                >
                  <p className="text-sm font-bold text-white">{stand.name}</p>
                  {queue && (
                    <p className="text-xs" style={{ color: queue.estimatedWaitMin > 5 ? "var(--color-error)" : "var(--color-teal-300)" }}>
                      Wait: {queue.estimatedWaitMin} min
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Crew markers */}
        {crewPositions?.map((member) => (
          <motion.div
            key={member.id}
            className="absolute"
            style={{
              left: `${member.x}%`,
              top: `${member.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              y: [0, -3, 0],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white shadow-lg"
              style={{ backgroundColor: member.color }}
            >
              {member.name}
            </div>
          </motion.div>
        ))}

        {/* User position (blue dot) */}
        <motion.div
          className="absolute"
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
        </motion.div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 flex-wrap">
        {[
          { type: "food", label: "Food", icon: "🍔" },
          { type: "beverage", label: "Drinks", icon: "🍺" },
          { type: "restroom", label: "Restroom", icon: "🚻" },
          { type: "merchandise", label: "Merch", icon: "🏪" },
        ].map((item) => (
          <div key={item.type} className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
          <div className="w-3 h-3 rounded-full bg-blue-500 border border-white" />
          <span>You</span>
        </div>
      </div>
    </div>
  );
}

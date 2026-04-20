"use client";

import React, { useRef, useState } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  disableTilt?: boolean;
}

export function GlassCard({ children, className, glow, disableTilt = false, ...props }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableTilt) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (centerY - y) / 15;
    const rotateY = (x - centerX) / 15;
    setTiltStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (disableTilt) return;
    setTiltStyle("");
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        transform: tiltStyle, 
        transition: isHovered ? "none" : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)" 
      }}
      className={`glass-card relative overflow-hidden p-6 
      hover:shadow-2xl hover:shadow-[#32b8c6]/20
      group
      ${glow ? "shadow-[0_0_40px_rgba(50,184,198,0.2)] border-[#32b8c6]/30" : ""} 
      ${className || ""}`}
      {...props}
    >
      {/* Interior ambient hover spotlight */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-[#32b8c6]/10 via-transparent to-purple-500/5" />
      
      {/* Content wrapper to stay above spotlight */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

"use client";

import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
}

export function GlassCard({ children, className, glow, ...props }: GlassCardProps) {
  return (
    <div
      className={`glass-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[rgba(50,184,198,0.3)] ${glow ? "shadow-[0_0_30px_rgba(50,184,198,0.15)]" : ""} ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
}

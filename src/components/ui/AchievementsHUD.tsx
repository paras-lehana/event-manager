import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";

/**
 * AchievementsHUD Component
 * Displays the gamification engine and user trophies.
 * Extracted from main layout to enhance maintainability and code structure.
 */
export function AchievementsHUD() {
  return (
    <GlassCard className="!p-6 bg-black/40 border-white/5 h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl font-black pointer-events-none tracking-tighter uppercase">TROPHY_SYS_v2</div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="data-label text-[10px] tracking-widest mb-1 text-[#fcee0a]/60 font-black uppercase">GAMIFICATION_ENGINE</p>
          <h2 className="text-lg font-black text-white tracking-widest uppercase">BATTLE_ACHIEVEMENTS</h2>
        </div>
        <div className="text-right">
           <p className="text-xl font-black text-[#fcee0a] leading-none mb-1">03 <span className="text-[10px] text-white/40 font-mono tracking-[0.3em]">⁄⁄ 12</span></p>
           <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#fcee0a] shadow-[0_0_10px_#fcee0a]" style={{ width: '25%' }} />
           </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: "🎯", name: "First Order", desc: "COMMERCE_FLOW_INITIATED", unlocked: true },
          { icon: "🏃", name: "Queue Skipper", desc: "SLASH_ALERTS_ENGAGED", unlocked: true },
          { icon: "👥", name: "Crew Chief", desc: "NET_COORD_ESTABLISHED", unlocked: true },
          { icon: "🔒", name: "Speed Demon", desc: "LOCKED_REQUIRE_S2_VAL", unlocked: false },
        ].map((ach) => (
          <div key={ach.name} className={`p-4 rounded-xl border relative overflow-hidden transition-all group hover:scale-[1.02] cursor-pointer ${ach.unlocked ? 'border-[#fcee0a]/30 bg-[#fcee0a]/10 shadow-[0_0_20px_rgba(252,238,10,0.05)]' : 'border-white/5 bg-white/5 opacity-40 grayscale'}`}>
            <div className="absolute -right-2 -bottom-2 opacity-10 scale-150 rotate-12 transition-transform group-hover:scale-[2] group-hover:rotate-0">{ach.icon}</div>
            <span className="text-3xl block mb-3 drop-shadow-lg">{ach.icon}</span>
            <p className="text-xs font-black text-white uppercase tracking-widest leading-none mb-1">{ach.name}</p>
            <p className="text-[8px] font-mono text-white/50 uppercase tracking-tighter">{ach.desc}</p>
            {ach.unlocked && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#fcee0a] shadow-[0_0_5px_#fcee0a]" />}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

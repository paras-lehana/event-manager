"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, set, push, serverTimestamp } from "firebase/database";
import { GlassCard } from "@/components/ui/GlassCard";
import { AmbientScene } from "@/components/ui/AmbientScene";

type CrewMember = {
  uid: string;
  name: string;
  avatar: string;
  role: string;
  location: string;
  status: "active" | "standby" | "off";
};

type Concession = {
  id: string;
  name: string;
  stock: number;
  capacity: number;
  status: "optimal" | "low" | "critical";
};

export default function AdminHUD() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"crowd" | "inventory" | "logs">("crowd");
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [logs, setLogs] = useState<{ id: string; msg: string; time: string; type: string }[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Mock data for concessions
  const [concessions] = useState<Concession[]>([
    { id: "1", name: "NORTH SIDE HOTDOGS", stock: 85, capacity: 100, status: "optimal" },
    { id: "2", name: "SECTION 102 BEER CACHE", stock: 12, capacity: 50, status: "critical" },
    { id: "3", name: "SOUTH WING TACOS", stock: 45, capacity: 100, status: "low" },
    { id: "4", name: "RAMS OFFICIAL MERCH", stock: 92, capacity: 150, status: "optimal" },
  ]);

  useEffect(() => {
    const crewRef = ref(rtdb, "crew");
    const unsubscribe = onValue(crewRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data) as CrewMember[];
        setCrew(list);
      }
    });

    // Initial logs
    setLogs([
      { id: "1", msg: "SYST_INIT_COMPLETE", time: "18:02:11", type: "info" },
      { id: "2", msg: "FIREBASE_RTDB_SYNC_ESTABLISHED", time: "18:02:12", type: "success" },
      { id: "3", msg: "GEOLOCATION_NODES_ACTIVE: 42", time: "18:02:15", type: "info" },
    ]);

    return () => unsubscribe();
  }, []);

  const addLog = (msg: string, type: "info" | "success" | "warn" | "error" = "info") => {
    const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
    setLogs(prev => [...prev.slice(-15), { id: Math.random().toString(), msg, time, type }]);
    
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 50);
  };

  const handleGenerateCrowd = async (scenario: string = "RANDOM") => {
    setIsSimulating(true);
    addLog(`INITIATING_STRATEGIC_SCENARIO: ${scenario}`, "warn");
    addLog("COMPUTING_IDEAL_DENSITY_MAP...", "info");
    
    // Simulate Gemini Reasoning delay
    await new Promise(r => setTimeout(r, 1500));
    
    const avatars = ["🏈", "🍺", "🌭", "🧢", "👟", "📣"];
    const roles = {
      HALFTIME: ["Crowd Marshal", "Vendor Support", "Rapid Response"],
      EMERGENCY: ["Medic", "Security", "Evacuation Lead"],
      RANDOM: ["Specialist", "Support", "Field Op", "Medic"]
    };
    
    const count = scenario === "HALFTIME" ? 8 : 4;
    
    for (let i = 0; i < count; i++) {
       const roleList = roles[scenario as keyof typeof roles] || roles.RANDOM;
       const newMember = {
         uid: `AGNT_${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
         name: `OP_UNIT_${i + 101}`,
         avatar: avatars[Math.floor(Math.random() * avatars.length)],
         role: roleList[Math.floor(Math.random() * roleList.length)],
         location: "GRID_NODE_" + Math.floor(Math.random() * 50),
         status: "active",
         lastSeen: Date.now()
       };
       
       await push(ref(rtdb, "crew"), newMember);
       addLog(`STRATEGIC_DEPLOYMENT: ${newMember.name} [${newMember.role}]`, "success");
       await new Promise(r => setTimeout(r, 150));
    }
    
    setIsSimulating(false);
    addLog(`SCENARIO_${scenario}_STABILIZED`, "info");
  };

  const handleCSVUpload = (data: string) => {
    addLog("PARSING_INGESTION_STREAM...", "warn");
    try {
      // Simulate parsing
      const rows = data.split('\n').filter(r => r.length > 5);
      addLog(`DETECTED_${rows.length}_ENTRIES`, "info");
      
      rows.forEach((row, i) => {
        setTimeout(() => {
          addLog(`INGESTED: ${row.split(',')[0] || 'RECORD_' + i}`, "success");
        }, i * 50);
      });
      
      setTimeout(() => addLog("BULK_INGESTION_SYNC_COMPLETE", "success"), rows.length * 50 + 100);
    } catch (e) {
      addLog("INGESTION_ERROR: INVALID_FORMAT", "error");
    }
  };

  return (
    <main className="min-h-screen bg-[#06060c] text-white relative overflow-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <AmbientScene />
      </div>
      
      {/* ═══ ADMIN HUD HEADER ═══ */}
      <header className="border-b border-[#00f3ff]/20 bg-black/40 backdrop-blur-xl relative z-20">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/")}
              className="w-10 h-10 rounded border border-white/10 flex items-center justify-center hover:border-[#00f3ff]/50 transition-all font-mono text-xs uppercase"
            >
              ←
            </motion.button>
            <div>
              <h1 className="text-xl font-black tracking-widest uppercase flex items-center gap-3">
                 <span className="text-[#00f3ff] neon-text">SPATIAL</span> OPERATIONS CENTER
                 <span className="cyber-badge badge-magenta text-[9px] translate-y-[-2px]">V0.8.2-BETA</span>
              </h1>
              <p className="text-[9px] font-mono text-white/30 tracking-[0.3em] uppercase">SYSTEM_NODE: CA-NORTH-SOFI-01</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-4 border-l border-white/10 pl-8">
               <div className="text-right">
                  <p className="text-[8px] text-white/40 font-mono">CORE_LATENCY</p>
                  <p className="text-xs font-black text-green-400">12MS</p>
               </div>
               <div className="text-right">
                  <p className="text-[8px] text-white/40 font-mono">ACTIVE_AGENTS</p>
                  <p className="text-xs font-black text-[#00f3ff]">{crew.length}</p>
               </div>
            </div>
            <button className="px-6 py-2 bg-[#ff003c]/20 border border-[#ff003c]/40 text-[#ff003c] text-[10px] font-black uppercase tracking-widest hover:bg-[#ff003c]/30 transition-all rounded shadow-[0_0_15px_rgba(255,0,60,0.1)]">
              EMERGENCY_LOCKDOWN
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto p-6 grid grid-cols-12 gap-6 relative z-10 h-[calc(100vh-120px)]">
        
        {/* ═══ SIDEBAR NAVIGATION ═══ */}
        <nav 
          aria-label="Operations Navigation"
          className="col-span-12 lg:col-span-2 flex flex-col gap-2"
        >
          {[
            { id: "crowd", icon: "📡", label: "CROWD SIM" },
            { id: "inventory", icon: "📦", label: "INVENTORY" },
            { id: "logs", icon: "📜", label: "SYSTEM LOGS" },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all relative overflow-hidden group ${
                activeTab === tab.id 
                  ? "bg-[#00f3ff]/10 border-[#00f3ff]/40 text-white shadow-[0_0_20px_rgba(0,243,255,0.1)]" 
                  : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
              }`}
            >
              <span className="text-xl" aria-hidden="true">{tab.icon}</span>
              <span className="text-[10px] font-black tracking-widest uppercase">{tab.label}</span>
              {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute left-0 top-0 bottom-0 w-1 bg-[#00f3ff]" />}
            </button>
          ))}
          
          <div className="mt-auto p-4 rounded-xl border border-white/5 bg-black/40">
             <p className="text-[9px] text-[#db00ff] font-mono tracking-widest mb-3 uppercase">AI_CONCIERGE_STATE</p>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase">LLM_READY</span>
             </div>
          </div>
        </nav>

        {/* ═══ MAIN OPERATIONS AREA ═══ */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          
          <AnimatePresence mode="wait">
            {activeTab === "crowd" && (
              <motion.div 
                key="crowd"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6 h-full"
              >
                <GlassCard 
                  role="tabpanel"
                  id="crowd-panel"
                  className="flex-1 bg-black/60 border-white/5 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 font-mono text-[80px] font-black text-white/[0.02] pointer-events-none select-none">GRID-01</div>
                  <div className="p-6 relative z-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                       <div>
                          <h2 className="text-lg font-black tracking-widest uppercase">SPATIAL SIMULATION</h2>
                          <p className="text-[10px] font-mono text-white/30 uppercase mt-1">REAL-TIME_ENTITY_PLACEMENT</p>
                       </div>
                       <div className="flex gap-2">
                          <span className="cyber-badge badge-green">SYNC_ACTIVE</span>
                          <span className="cyber-badge badge-cyan">42_NODES_UP</span>
                       </div>
                    </div>
                    
                    {/* Simulated Map View */}
                    <div 
                      role="application"
                      aria-label="Interactive Spatial Command Grid"
                      className="flex-1 rounded-xl bg-[#030308] border border-white/5 relative overflow-hidden cursor-crosshair group-hover:border-[#00f3ff]/20 transition-all"
                    >
                       <div className="absolute inset-0 bg-[#00f3ff]/[0.02] bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
                       
                       {/* Mock Entities */}
                       {crew.map((member) => (
                         <motion.div
                           key={member.uid}
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           className="absolute w-8 h-8 rounded bg-white/5 border border-white/20 flex items-center justify-center text-sm shadow-[0_0_15px_rgba(255,255,255,0.05)] cursor-pointer group/unit"
                           style={{ 
                             left: `${Math.random() * 80 + 10}%`, 
                             top: `${Math.random() * 80 + 10}%`,
                           }}
                         >
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-white/20 px-2 py-0.5 rounded text-[8px] opacity-0 group-hover/unit:opacity-100 transition-opacity whitespace-nowrap z-50">
                             {member.name} ⁄⁄ {member.role}
                           </div>
                           {member.avatar}
                         </motion.div>
                       ))}
                       
                       <div className="absolute bottom-6 right-6 p-4 bg-black/80 backdrop-blur border border-white/10 rounded-lg text-right">
                          <p className="text-[10px] font-black text-white/40 uppercase">ACTIVE_HOTSPOTS</p>
                          <p className="text-2xl font-black text-[#fcee0a]">04</p>
                       </div>
                    </div>
                  </div>
                </GlassCard>

                <div className="grid grid-cols-3 gap-6">
                  <GlassCard className="!p-6 border-[#6366f1]/20 bg-[#6366f1]/5 flex flex-col justify-between">
                    <h3 className="text-sm font-black tracking-widest uppercase mb-4 text-[#6366f1]">STRATEGIC_AI_OPS</h3>
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-2">
                        {["HALFTIME", "EMERGENCY", "ENTRANCE", "RANDOM"].map(s => (
                          <button 
                            key={s}
                            disabled={isSimulating}
                            onClick={() => handleGenerateCrowd(s)}
                            className={`py-2 rounded border border-[#6366f1]/40 text-[9px] font-black uppercase tracking-widest transition-all ${isSimulating ? 'opacity-50' : 'hover:bg-[#6366f1]/20 active:scale-95'}`}
                          >
                            RUN_{s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                  
                  <GlassCard className="!p-6 border-[#fcee0a]/20 bg-[#fcee0a]/5 flex flex-col justify-between">
                     <h3 className="text-sm font-black tracking-widest uppercase mb-4 text-[#fcee0a]">BULK_INGESTION</h3>
                     <textarea 
                        placeholder="NAME, ROLE, LOC..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.ctrlKey) {
                            handleCSVUpload(e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                        className="w-full h-12 bg-black/40 border border-white/10 rounded p-2 text-[8px] font-mono mb-2 focus:border-[#fcee0a] outline-none transition-colors"
                     />
                     <p className="text-[7px] font-mono text-white/40 uppercase tracking-widest">CTRL+ENTER to INGEST_STREAM</p>
                  </GlassCard>

                  <GlassCard className="!p-6 border-[#00f3ff]/20 bg-[#00f3ff]/5 flex flex-col justify-between">
                     <h3 className="text-sm font-black tracking-widest uppercase mb-4 text-[#00f3ff]">VISION_API_SCANNER</h3>
                     <button
                        onClick={() => {
                          addLog("GCP_VISION_API: INITIATING_CROWD_SCAN", "info");
                          setTimeout(() => addLog("GCP_VISION_API: HIGHEST_DENSITY_DETECTED_SECTOR_7G", "success"), 1200);
                        }}
                        className="w-full h-12 bg-black/40 border border-white/10 rounded flex items-center justify-center text-[10px] font-black uppercase hover:border-[#00f3ff]/50 hover:bg-[#00f3ff]/10 transition-all text-[#00f3ff]"
                     >
                        SCAN_CAMERA_FEED
                     </button>
                     <p className="text-[7px] font-mono text-white/40 uppercase tracking-widest text-center mt-2">VERTEX_AI_IMAGE_ANALYSIS</p>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {activeTab === "inventory" && (
              <motion.div 
                key="inventory"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                <GlassCard className="h-full bg-black/60 border-white/5 p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-lg font-black tracking-widest uppercase">INVENTORY MANAGEMENT</h2>
                        <p className="text-[10px] font-mono text-white/30 uppercase mt-1">REAL-TIME_STOCK_TELEMETRY</p>
                    </div>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] font-black uppercase transition-all">REFRESH_ALL</button>
                  </div>
                  
                  <div className="space-y-4">
                    {concessions.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl border border-white/5 bg-black/40 group hover:border-[#fcee0a]/20 transition-all">
                        <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${item.status === 'optimal' ? 'bg-green-400' : item.status === 'low' ? 'bg-orange-400' : 'bg-red-500 animate-pulse'}`} />
                              <span className="text-sm font-black tracking-tight">{item.name}</span>
                           </div>
                           <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                              item.status === 'optimal' ? 'border-green-400/20 text-green-400' : item.status === 'low' ? 'border-orange-400/20 text-orange-400' : 'border-red-500/20 text-red-500'
                           }`}>
                              {item.status}
                           </span>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.stock / item.capacity) * 100}%` }}
                                className={`h-full rounded-full ${item.status === 'optimal' ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : item.status === 'low' ? 'bg-orange-400' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}
                              />
                           </div>
                           <div className="flex flex-col items-end shrink-0">
                              <span className="text-[10px] font-mono font-bold">
                                {item.stock} / {item.capacity}
                              </span>
                              <span className="text-[7px] font-mono text-[#fcee0a] animate-pulse">
                                EXHAUST_IN ~{item.status === 'optimal' ? '120m' : item.status === 'low' ? '35m' : '8m'}
                              </span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 rounded-xl border border-dashed border-[#00f3ff]/20 bg-[#00f3ff]/5">
                     <p className="text-xs font-black text-[#00f3ff] uppercase mb-2">AI_REORDER_PREDICTION</p>
                     <p className="text-[10px] text-white/60 leading-relaxed font-mono">
                        BASED_ON_SIM_VELOCITY:_SECTION_102_BEER_WILL_EXHAUST_IN_~14_MINUTES._AUTO_DISPATCH_ENABLED.
                     </p>
                  </div>
                </GlassCard>
              </motion.div>
            )}
            
            {activeTab === "logs" && (
              <motion.div 
                key="logs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                <GlassCard className="h-full bg-black/60 border-white/5 p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-black tracking-widest uppercase">SYSTEM TERMINAL</h2>
                        <p className="text-[10px] font-mono text-white/30 uppercase mt-1">LOG_BUFFER_PRIMARY</p>
                    </div>
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-400" />
                       <div className="w-3 h-3 rounded-full bg-yellow-400" />
                       <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                  </div>
                  
                  <div 
                    ref={terminalRef}
                    className="flex-1 bg-black/80 rounded border border-white/5 p-6 font-mono text-[11px] overflow-y-auto space-y-1.5 scrollbar-hide"
                  >
                     {logs.map((log) => (
                       <div key={log.id} className="flex gap-4">
                          <span className="text-white/20 whitespace-nowrap">[{log.time}]</span>
                          <span className={`${
                            log.type === 'success' ? 'text-green-400' : 
                            log.type === 'warn' ? 'text-[#fcee0a]' : 
                            log.type === 'error' ? 'text-[#ff003c]' : 
                            'text-[#00f3ff]'
                          } font-bold`}>
                             {log.type.toUpperCase()}
                          </span>
                          <span className="text-white/80">{log.msg}</span>
                       </div>
                     ))}
                     <div className="text-[#00f3ff] animate-pulse">_</div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══ RIGHT PANEL (CREW STATUS) ═══ */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
           <GlassCard className="flex-1 bg-black/60 border-white/5 p-6 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-sm font-black tracking-widest uppercase">ACTIVE_FIELD_OPS</h2>
                 <span className="text-[10px] font-mono text-white/40">{crew.length} UNITS</span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                 {crew.map((member) => (
                   <div key={member.uid} className="p-3 rounded-lg border border-white/5 bg-white/2 flex items-center justify-between group hover:border-[#00f3ff]/30 transition-all">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-xl border border-white/10 group-hover:border-[#00f3ff]/20">
                            {member.avatar}
                         </div>
                         <div>
                            <p className="text-[11px] font-black text-white">{member.name}</p>
                            <p className="text-[9px] text-white/30 font-mono tracking-wider">{member.role} ⁄ {member.location}</p>
                         </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                   </div>
                 ))}
                 
                 {crew.length === 0 && (
                    <div className="text-center py-12">
                       <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">NO_AGENTS_DEPLOYED</p>
                    </div>
                 )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                 <button 
                  onClick={() => router.push("/crew")}
                  className="text-[9px] font-black text-[#00f3ff] uppercase tracking-[0.4em] hover:text-[#db00ff] transition-all"
                 >
                    MANAGE_FIELD_PERMITS_▷
                 </button>
              </div>
           </GlassCard>
        </div>

      </div>
    </main>
  );
}

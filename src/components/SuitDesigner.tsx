import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Cpu, Activity, Layers, Terminal, Box, Cog } from 'lucide-react';

const SUIT_PARTS = [
  { id: 'helmet', name: 'Neural Interface Helmet', status: 'Online', power: 98 },
  { id: 'chest', name: 'Arc Reactor Core', status: 'Active', power: 100 },
  { id: 'arms', name: 'Repulsor Gauntlets', status: 'Standby', power: 85 },
  { id: 'legs', name: 'Flight Stabilizers', status: 'Online', power: 92 },
];

export default function SuitDesigner() {
  const [selectedPart, setSelectedPart] = useState(SUIT_PARTS[0]);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] font-mono overflow-hidden">
      {/* HUD Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-4">
          <div className="w-2 h-8 bg-emerald-500 animate-pulse" />
          <div>
            <h2 className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Mark VII Suit Designer</h2>
            <p className="text-emerald-500/40 text-[10px]">SYSTEM STATUS: NOMINAL // EL OS v4.2</p>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="text-right">
            <p className="text-emerald-500/40 text-[10px]">CORE TEMP</p>
            <p className="text-emerald-400 text-sm">42.5°C</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-500/40 text-[10px]">POWER LEVEL</p>
            <p className="text-emerald-400 text-sm">99.8%</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel: Parts List */}
        <div className="w-80 border-r border-emerald-500/10 p-6 space-y-4 bg-black/40">
          <h3 className="text-emerald-500/60 text-[10px] uppercase tracking-widest mb-6">Subsystem Modules</h3>
          {SUIT_PARTS.map((part) => (
            <button
              key={part.id}
              onClick={() => setSelectedPart(part)}
              className={`w-full group flex items-center justify-between p-4 rounded-lg border transition-all ${
                selectedPart.id === part.id 
                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'bg-white/5 border-white/5 hover:border-emerald-500/20'
              }`}
            >
              <div className="flex flex-col items-start">
                <span className={`text-xs ${selectedPart.id === part.id ? 'text-emerald-400' : 'text-white/60'}`}>
                  {part.name}
                </span>
                <span className="text-[9px] text-white/30 uppercase tracking-tighter mt-1">
                  Status: {part.status}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500" 
                    style={{ width: `${part.power}%` }} 
                  />
                </div>
                <span className="text-[9px] text-emerald-500/60 mt-1">{part.power}%</span>
              </div>
            </button>
          ))}

          <div className="mt-12 p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Terminal className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold">Diagnostics</span>
            </div>
            <div className="space-y-2 font-mono text-[9px] text-emerald-500/60">
              <p>{`> Initializing neural link...`}</p>
              <p className="animate-pulse">{`> Calibration in progress...`}</p>
              <p>{`> All systems green.`}</p>
            </div>
          </div>
        </div>

        {/* Center Panel: 3D Visualization Placeholder */}
        <div className="flex-1 relative flex items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.05)_0%,_transparent_70%)]">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-10" 
            style={{ 
              backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} 
          />

          {/* Hologram Effect */}
          <div className="relative w-96 h-96 flex items-center justify-center">
            {/* Rotating Rings */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-emerald-500/20 rounded-full border-dashed"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 border border-emerald-500/10 rounded-full border-dashed"
            />
            
            {/* Suit Silhouette Placeholder */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  filter: ['drop-shadow(0 0 10px rgba(16,185,129,0.2))', 'drop-shadow(0 0 20px rgba(16,185,129,0.4))', 'drop-shadow(0 0 10px rgba(16,185,129,0.2))']
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-48 h-80 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-3xl flex items-center justify-center overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 to-transparent opacity-50" />
                <div className="flex flex-col items-center gap-6 opacity-40">
                  <Shield className="w-16 h-16" />
                  <div className="w-24 h-2 bg-emerald-500/40 rounded-full" />
                  <div className="w-32 h-2 bg-emerald-500/40 rounded-full" />
                  <div className="w-28 h-2 bg-emerald-500/40 rounded-full" />
                </div>
                
                {/* Scanner Line */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_10px_#10b981] z-20"
                />
              </motion.div>
              <div className="text-emerald-400/60 text-[10px] uppercase tracking-[0.3em] font-bold">
                Scanning: {selectedPart.name}
              </div>
            </div>
          </div>

          {/* Floating HUD Elements */}
          <div className="absolute top-10 right-10 w-48 space-y-4">
            <div className="p-3 border border-emerald-500/20 bg-black/60 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-3 h-3 text-emerald-400" />
                <span className="text-[9px] text-emerald-400 uppercase">Vitals</span>
              </div>
              <div className="h-8 flex items-end gap-0.5">
                {[40, 70, 45, 90, 65, 30, 80, 50, 60, 40].map((h, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [`${h}%`, `${h+10}%`, `${h}%`] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                    className="flex-1 bg-emerald-500/40"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Controls */}
        <div className="w-80 border-l border-emerald-500/10 p-6 space-y-8 bg-black/40">
          <div className="space-y-4">
            <h3 className="text-emerald-500/60 text-[10px] uppercase tracking-widest">Configuration</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] text-white/40">
                <span>ARMOR INTEGRITY</span>
                <span className="text-emerald-400">94%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[94%]" />
              </div>
              
              <div className="flex items-center justify-between text-[10px] text-white/40">
                <span>THRUSTER OUTPUT</span>
                <span className="text-emerald-400">82%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[82%]" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-emerald-500/60 text-[10px] uppercase tracking-widest">Active Mods</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Zap, label: 'Overcharge' },
                { icon: Shield, label: 'Reinforce' },
                { icon: Cpu, label: 'Auto-Pilot' },
                { icon: Box, label: 'Stealth' },
              ].map((mod) => (
                <button key={mod.label} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all">
                  <mod.icon className="w-4 h-4 text-emerald-400" />
                  <span className="text-[9px] text-white/60 uppercase">{mod.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button className="w-full py-4 rounded-xl bg-emerald-500 text-black font-bold text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            Initiate Deployment
          </button>
        </div>
      </div>
    </div>
  );
}

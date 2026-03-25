import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Shield, Target, Cpu, ChevronRight, Github } from 'lucide-react';

interface LandingPageProps {
  onLaunch: () => void;
}

export default function LandingPage({ onLaunch }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Terminal className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tighter">EL SYSTEM</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#tech" className="hover:text-emerald-400 transition-colors">Technology</a>
            <a href="#creator" className="hover:text-emerald-400 transition-colors">Creator</a>
          </div>

          <button 
            onClick={onLaunch}
            className="px-6 py-2.5 bg-emerald-500 text-black text-sm font-bold rounded-full hover:bg-emerald-400 transition-all active:scale-95"
          >
            Launch System
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8">
              <Cpu className="w-3 h-3" />
              Next-Gen Operating System
            </div>
            
            <h1 className="text-7xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8">
              THE FUTURE <br />
              <span className="text-emerald-500">IS PROPRIETARY.</span>
            </h1>
            
            <p className="text-xl text-white/50 leading-relaxed mb-12 max-w-xl">
              EL is a highly advanced operating system created by Python. 
              Engineered for precision, tactical superiority, and seamless AI integration.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onLaunch}
                className="group px-8 py-4 bg-white text-black text-lg font-bold rounded-xl flex items-center gap-3 hover:bg-emerald-500 transition-all active:scale-95"
              >
                Enter Interface
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="px-8 py-4 bg-white/5 border border-white/10 text-lg font-bold rounded-xl flex items-center gap-3 hover:bg-white/10 transition-all"
              >
                <Github className="w-5 h-5" />
                View Source
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Terminal className="w-6 h-6" />}
              title="EL Core AI"
              description="Advanced neural processing unit capable of complex engineering and tactical analysis."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6" />}
              title="Armor Forge"
              description="Real-time 3D tactical suit customization and ballistic simulation environment."
            />
            <FeatureCard 
              icon={<Target className="w-6 h-6" />}
              title="Combat Sim"
              description="High-fidelity tactical training arena with active drone neutralization protocols."
            />
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section id="creator" className="py-32 px-6 bg-emerald-500 text-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-8 italic">
              "I AM CREATED BY PYTHON. <br />
              MY CREATOR IS ROBEL DEMISS."
            </h2>
            <p className="text-xl font-medium opacity-80">
              A vision of the future, built with the precision of modern engineering.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <div className="aspect-square w-64 bg-black rounded-3xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500">
              <Terminal className="w-32 h-32 text-emerald-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
              <Terminal className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tighter">EL SYSTEM</span>
          </div>
          <p className="text-white/40 text-sm">
            &copy; 2026 EL System. Engineered by Robel Demiss. <br />
            All rights reserved. Proprietary Technology.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-white/50 leading-relaxed">{description}</p>
    </div>
  );
}

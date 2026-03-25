/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import SuitDesigner from './components/SuitDesigner';
import CombatSimulator from './components/CombatSimulator';
import LandingPage from './components/LandingPage';
import { MessageSquare, Shield, Terminal, Target, LogOut } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function App() {
  const [view, setView] = useState<'landing' | 'os'>('landing');
  const [activeTab, setActiveTab] = useState<'chat' | 'designer' | 'combat'>('chat');

  if (view === 'landing') {
    return <LandingPage onLaunch={() => setView('os')} />;
  }

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      {/* Global Tab Switcher */}
      <div className="flex items-center justify-between px-6 py-2 bg-black border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
            <Terminal className="w-4 h-4 text-black" />
          </div>
          <span className="text-sm font-bold tracking-tighter text-white">EL SYSTEM</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all",
              activeTab === 'chat' 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-white/40 hover:text-white/60"
            )}
          >
            <Terminal className="w-4 h-4" />
            EL Core
          </button>
          <button
            onClick={() => setActiveTab('designer')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all",
              activeTab === 'designer' 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-white/40 hover:text-white/60"
            )}
          >
            <Shield className="w-4 h-4" />
            Armor Systems
          </button>
          <button
            onClick={() => setActiveTab('combat')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all",
              activeTab === 'combat' 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-white/40 hover:text-white/60"
            )}
          >
            <Target className="w-4 h-4" />
            Combat Sim
          </button>
        </div>

        <button 
          onClick={() => setView('landing')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Exit
        </button>
      </div>

      <div className="flex-1 relative">
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'designer' && <SuitDesigner />}
        {activeTab === 'combat' && <CombatSimulator />}
      </div>
    </div>
  );
}

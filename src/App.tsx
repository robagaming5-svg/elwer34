/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import SuitDesigner from './components/SuitDesigner';
import CombatSimulator from './components/CombatSimulator';
import { MessageSquare, Shield, Terminal, Target } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'designer' | 'combat'>('chat');

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      {/* Global Tab Switcher */}
      <div className="flex items-center justify-center gap-2 p-2 bg-black border-b border-white/5">
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

      <div className="flex-1 relative">
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'designer' && <SuitDesigner />}
        {activeTab === 'combat' && <CombatSimulator />}
      </div>
    </div>
  );
}

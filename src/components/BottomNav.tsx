import React from 'react';
import { Home, Calendar, BookOpen, Gift, BarChart3, Scan, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

export type NavTab = 'home' | 'events' | 'resources' | 'rewards' | 'impact' | 'admin';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenQuickScan: () => void;
  onOpenAI: () => void;
  role: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenQuickScan,
  onOpenAI,
  role,
}) => {
  return (
    <nav className="bg-slate-900 border-t border-slate-800 px-2 py-1.5 flex justify-around items-center shrink-0 shadow-xl select-none z-30">
      {/* Home */}
      <button
        onClick={() => {
          sounds.playClick();
          onTabChange('home');
        }}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
          currentTab === 'home'
            ? 'text-emerald-400 font-bold scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">Home</span>
      </button>

      {/* Events */}
      <button
        onClick={() => {
          sounds.playClick();
          onTabChange('events');
        }}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
          currentTab === 'events'
            ? 'text-emerald-400 font-bold scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Calendar className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">Events</span>
      </button>

      {/* Center Floating Quick Scan Button */}
      <button
        onClick={() => {
          sounds.playClick();
          onOpenQuickScan();
        }}
        className="relative -top-3 bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-slate-900 active:scale-95 transition"
        title="Scan QR / Bin"
      >
        <Scan className="w-5 h-5 font-black" />
      </button>

      {/* Resources */}
      <button
        onClick={() => {
          sounds.playClick();
          onTabChange('resources');
        }}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
          currentTab === 'resources'
            ? 'text-emerald-400 font-bold scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <BookOpen className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">Learn</span>
      </button>

      {/* Rewards Store */}
      <button
        onClick={() => {
          sounds.playClick();
          onTabChange('rewards');
        }}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
          currentTab === 'rewards'
            ? 'text-emerald-400 font-bold scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Gift className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">Store</span>
      </button>

      {/* Impact Analytics / Admin */}
      <button
        onClick={() => {
          sounds.playClick();
          if (role === 'ADMIN') {
            onTabChange('admin');
          } else {
            onTabChange('impact');
          }
        }}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
          currentTab === 'impact' || currentTab === 'admin'
            ? 'text-emerald-400 font-bold scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <BarChart3 className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">{role === 'ADMIN' ? 'Admin' : 'Impact'}</span>
      </button>
    </nav>
  );
};

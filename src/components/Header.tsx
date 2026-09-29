import React from 'react';
import { Role, UserProfile } from '../types';
import { Sparkles, Smartphone, Monitor, Ticket, Coins } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  user: UserProfile;
  activeRole: Role;
  onRoleChange: (role: Role) => void;
  frameMode: boolean;
  onToggleFrameMode: () => void;
  onOpenStore: () => void;
  onOpenWallet: () => void;
  voucherCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeRole,
  onRoleChange,
  frameMode,
  onToggleFrameMode,
  onOpenStore,
  onOpenWallet,
  voucherCount,
}) => {
  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-3 py-2.5 flex items-center justify-between text-xs sticky top-0 z-30 select-none shadow-sm">
      {/* Brand & Status */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20 text-slate-950 font-black text-sm">
          🌱
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-white text-xs sm:text-sm">CAMPUS GREEN</span>
            <span className="hidden sm:inline-block bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
              v3.0
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Sustainable Campus Operations</p>
        </div>
      </div>

      {/* Role Switcher & Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Role Select Dropdown */}
        <div className="relative">
          <select
            value={activeRole}
            onChange={(e) => {
              sounds.playClick();
              onRoleChange(e.target.value as Role);
            }}
            className="bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-emerald-300 text-[11px] font-bold px-2 py-1.5 rounded-xl cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 transition shadow-inner"
          >
            <option value="STUDENT">🎓 Student ({user.name.split(' ')[0]})</option>
            <option value="FACULTY">👩‍🏫 Faculty (Dr. Sharma)</option>
            <option value="STAFF">🛠️ Staff (Facilities)</option>
            <option value="ADMIN">⚡ Admin (System)</option>
          </select>
        </div>

        {/* Voucher Wallet Button */}
        {voucherCount > 0 && (
          <button
            onClick={() => {
              sounds.playClick();
              onOpenWallet();
            }}
            className="bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/40 px-2 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition"
            title="My Reward Vouchers"
          >
            <Ticket className="w-3.5 h-3.5 text-purple-300" />
            <span className="bg-purple-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
              {voucherCount}
            </span>
          </button>
        )}

        {/* Eco Points Badge */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenStore();
          }}
          className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 text-amber-300 px-2.5 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1.5 transition shadow-sm active:scale-95"
          title="Eco Points Balance"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>{user.points}</span>
          <span className="text-[10px] text-amber-400/80 hidden xs:inline">Pts</span>
        </button>

        {/* Frame Toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleFrameMode();
          }}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 p-1.5 rounded-xl transition"
          title={frameMode ? 'Switch to Expanded View' : 'Switch to Mobile Frame'}
        >
          {frameMode ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5 text-emerald-400" />}
        </button>
      </div>
    </header>
  );
};

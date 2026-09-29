import React, { useState, useRef, useEffect } from 'react';
import { Role, UserProfile } from '../types';
import { Sparkles, Smartphone, Monitor, Ticket, Coins, LogOut, User, Flame, ChevronDown } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  user: UserProfile;
  activeRole: Role;
  onRoleChange: (role: Role) => void;
  frameMode: boolean;
  onToggleFrameMode: () => void;
  onOpenStore: () => void;
  onOpenWallet: () => void;
  onLogout: () => void;
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
  onLogout,
  voucherCount,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-3 py-2 flex items-center justify-between text-xs sticky top-0 z-30 select-none shadow-sm">
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

        {/* User Profile & Logout Dropdown Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => {
              sounds.playClick();
              setShowProfileMenu(!showProfileMenu);
            }}
            className="w-7 h-7 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-xs font-black text-emerald-400 overflow-hidden transition active:scale-95"
            title="Account Menu"
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{user.name.charAt(0)}</span>
            )}
          </button>

          {/* Profile Dropdown Popup */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl p-3 shadow-2xl z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="pb-2.5 border-b border-slate-800">
                <p className="font-extrabold text-white text-xs truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                    {user.role}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">• {user.departmentCode}</span>
                </div>
              </div>

              <div className="py-2 space-y-1.5 text-[11px] text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Eco-Points:</span>
                  <span className="font-bold text-amber-400">{user.points} Pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Streak:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-0.5">
                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{user.streak} Days</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Level:</span>
                  <span className="font-bold text-slate-200">Lvl {user.level.id} ({user.level.title})</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full bg-rose-950/70 hover:bg-rose-900 text-rose-300 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-rose-800/60"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Account</span>
                </button>
              </div>
            </div>
          )}
        </div>

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

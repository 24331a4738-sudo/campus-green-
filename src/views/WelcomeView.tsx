import React from 'react';
import { Role } from '../types';
import { sounds } from '../utils/audio';
import { ArrowRight, GraduationCap, School, Wrench, ShieldCheck } from 'lucide-react';

interface WelcomeViewProps {
  selectedRole: Role;
  onSelectRole: (role: Role) => void;
  onContinue: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  selectedRole,
  onSelectRole,
  onContinue,
}) => {
  return (
    <div className="flex flex-col justify-between h-full p-5 bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 text-white select-none">
      {/* Brand Hero */}
      <div className="text-center pt-4">
        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center border border-white/20 shadow-2xl mb-3 text-3xl">
          🌱
        </div>
        <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
          ONE CAMPUS PLATFORM
        </span>
        <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">Campus Green</h1>
        <p className="text-xs text-emerald-200/90 mt-1 max-w-[260px] mx-auto font-medium">
          Uniting Students, Faculty & Staff for UN SDGs & Carbon Neutrality
        </p>
      </div>

      {/* Role Picker Card */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-white/10 shadow-2xl my-auto">
        <h2 className="text-base font-extrabold text-center mb-0.5">Select Stakeholder Role</h2>
        <p className="text-[11px] text-emerald-200/80 text-center mb-3">
          Experience tailored tools, workflows & permissions
        </p>

        {/* 4 Role Selector Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-black/40 rounded-2xl mb-4 border border-white/10 text-[11px]">
          {(['STUDENT', 'FACULTY', 'STAFF', 'ADMIN'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => {
                sounds.playClick();
                onSelectRole(r);
              }}
              className={`py-2 rounded-xl font-bold transition text-center ${
                selectedRole === r
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-emerald-100/70 hover:text-white'
              }`}
            >
              {r === 'STUDENT' ? 'Student' : r === 'FACULTY' ? 'Faculty' : r === 'STAFF' ? 'Staff' : 'Admin'}
            </button>
          ))}
        </div>

        {/* Active Role Feature Overview */}
        <div className="bg-black/30 rounded-2xl p-3.5 border border-white/10 text-xs flex items-center gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-xl border border-white/10">
            {selectedRole === 'STUDENT' && <GraduationCap className="w-5 h-5 text-emerald-400" />}
            {selectedRole === 'FACULTY' && <School className="w-5 h-5 text-cyan-400" />}
            {selectedRole === 'STAFF' && <Wrench className="w-5 h-5 text-amber-400" />}
            {selectedRole === 'ADMIN' && <ShieldCheck className="w-5 h-5 text-purple-400" />}
          </div>
          <div>
            <h4 className="font-extrabold text-white text-xs">
              {selectedRole === 'STUDENT' && 'Student Portal (Alex River)'}
              {selectedRole === 'FACULTY' && 'Faculty Portal (Dr. Sharma)'}
              {selectedRole === 'STAFF' && 'Facilities & Maintenance (Marcus Vance)'}
              {selectedRole === 'ADMIN' && 'System Administrator (Campus Ops)'}
            </h4>
            <p className="text-[10px] text-emerald-100/80 mt-0.5 leading-relaxed">
              {selectedRole === 'STUDENT' && 'Join tree plantation drives, scan smart bins, take eco quizzes, and redeem store vouchers.'}
              {selectedRole === 'FACULTY' && 'Publish curriculum sustainability activities, share learning resources, and track student eco-hours.'}
              {selectedRole === 'STAFF' && 'Triage voice maintenance dispatches, manage bin emptying cycles, and monitor campus metrics.'}
              {selectedRole === 'ADMIN' && 'Audit point transactions, configure system rewards, review user roles, and monitor SDG metrics.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onContinue();
          }}
          className="w-full bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black py-3 rounded-2xl shadow-xl transition active:scale-95 text-xs flex items-center justify-center gap-2"
        >
          <span>CONTINUE AS {selectedRole}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-emerald-200/60 pb-1">
        UN Sustainable Development Goals • SDG 7, 11, 12, 13, 15
      </div>
    </div>
  );
};

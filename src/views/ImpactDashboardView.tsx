import React from 'react';
import { BarChart3, TrendingUp, Trees, Zap, Recycle, ShieldCheck, Award } from 'lucide-react';

export const ImpactDashboardView: React.FC = () => {
  const departments = [
    { name: 'Computer Science & Engineering', code: 'CSE', score: 1420, rank: 1, color: 'bg-emerald-500' },
    { name: 'Environmental Studies', code: 'ENV', score: 1350, rank: 2, color: 'bg-teal-500' },
    { name: 'Campus Facilities & Ops', code: 'FAC', score: 980, rank: 3, color: 'bg-blue-500' },
    { name: 'Business & Economics', code: 'BUS', score: 740, rank: 4, color: 'bg-amber-500' },
    { name: 'Architecture & Design', code: 'ARC', score: 620, rank: 5, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-3.5 sm:p-4 space-y-4 overflow-y-auto">
      {/* Top Header */}
      <div className="flex justify-between items-center pt-1">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Impact Dashboard</h2>
          <p className="text-xs text-slate-500 font-medium">May 2026 Campus Metrics & UN SDG Alignment</p>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-300">
          Live Telemetry
        </span>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-emerald-600 text-white p-3.5 rounded-2xl text-center shadow-sm">
          <p className="text-3xl font-black">120</p>
          <p className="text-[10px] font-semibold text-emerald-100 uppercase tracking-wider">Events Held</p>
        </div>

        <div className="bg-teal-600 text-white p-3.5 rounded-2xl text-center shadow-sm">
          <p className="text-3xl font-black">25</p>
          <p className="text-[10px] font-semibold text-teal-100 uppercase tracking-wider">Projects Active</p>
        </div>

        <div className="bg-emerald-700 text-white p-3.5 rounded-2xl text-center shadow-sm">
          <p className="text-3xl font-black">95</p>
          <p className="text-[10px] font-semibold text-emerald-100 uppercase tracking-wider">Trees Planted</p>
        </div>

        <div className="bg-slate-900 text-white p-3.5 rounded-2xl text-center shadow-sm border border-slate-800">
          <p className="text-3xl font-black text-amber-400">240</p>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Eco-Score</p>
        </div>
      </div>

      {/* Weekly Engagement Trend Chart */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Weekly Campus Engagement
            </h3>
          </div>
          <span className="text-xs text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
            ↑ 24% vs Last Month
          </span>
        </div>

        {/* Bar Visualizer */}
        <div className="flex items-end justify-between h-28 gap-3 px-3 pt-2">
          <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <span className="text-[9px] font-bold text-slate-400">420</span>
            <div className="w-full bg-emerald-300 rounded-t-xl h-[40%] transition-all hover:bg-emerald-400" />
            <span className="text-[10px] text-slate-500 font-black">W1</span>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <span className="text-[9px] font-bold text-slate-400">680</span>
            <div className="w-full bg-emerald-400 rounded-t-xl h-[65%] transition-all hover:bg-emerald-500" />
            <span className="text-[10px] text-slate-500 font-black">W2</span>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <span className="text-[9px] font-bold text-slate-400">910</span>
            <div className="w-full bg-emerald-500 rounded-t-xl h-[85%] transition-all hover:bg-emerald-600" />
            <span className="text-[10px] text-slate-500 font-black">W3</span>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <span className="text-[9px] font-bold text-emerald-600 font-black">1,240</span>
            <div className="w-full bg-emerald-600 rounded-t-xl h-[100%] transition-all hover:bg-emerald-500 shadow-md shadow-emerald-500/20" />
            <span className="text-[10px] text-emerald-700 font-black">W4</span>
          </div>
        </div>
      </div>

      {/* Department Leaderboard */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">
          Department Sustainability Leaderboard
        </h3>

        <div className="space-y-2.5">
          {departments.map((dept) => (
            <div key={dept.code} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] text-white ${
                    dept.rank === 1
                      ? 'bg-amber-500'
                      : dept.rank === 2
                      ? 'bg-slate-400'
                      : dept.rank === 3
                      ? 'bg-amber-700'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {dept.rank}
                </span>
                <span className="font-bold text-slate-800">{dept.name}</span>
              </div>
              <span className="font-mono font-black text-slate-900">{dept.score} Pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* UN SDG Campus Alignment */}
      <div className="bg-slate-950 text-white p-4 rounded-3xl border border-slate-800 shadow-md">
        <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-2">
          UN Sustainable Development Goals (SDG)
        </h3>
        <p className="text-[11px] text-slate-400 mb-3">
          Campus Green directly maps everyday university behaviors to global targets:
        </p>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-bold text-slate-200">SDG 7: Affordable & Clean Energy</span>
            <span className="text-emerald-400 font-mono font-bold">18.4 MWh</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-bold text-slate-200">SDG 12: Responsible Consumption</span>
            <span className="text-teal-400 font-mono font-bold">95% Diverted</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-bold text-slate-200">SDG 13 & 15: Climate Action & Land</span>
            <span className="text-emerald-400 font-mono font-bold">95 Trees</span>
          </div>
        </div>
      </div>
    </div>
  );
};

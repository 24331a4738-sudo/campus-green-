import React, { useState } from 'react';
import { UserProfile, RewardItem, CampusEvent, PointTransaction } from '../types';
import { ShieldCheck, Database, RefreshCw, Plus, Users, Gift, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AdminViewProps {
  user: UserProfile;
  rewards: RewardItem[];
  events: CampusEvent[];
  transactions: PointTransaction[];
  onRestockReward: (rewardId: string, addedStock: number) => void;
  onResetSystemData: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  user,
  rewards,
  events,
  transactions,
  onRestockReward,
  onResetSystemData,
}) => {
  const [selectedRewardId, setSelectedRewardId] = useState<string>(rewards[0]?.id || '');
  const [restockAmount, setRestockAmount] = useState<number>(10);

  const handleRestock = () => {
    if (!selectedRewardId) return;
    sounds.playSuccess();
    onRestockReward(selectedRewardId, Number(restockAmount));
  };

  return (
    <div className="p-3.5 sm:p-4 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white p-4 rounded-3xl border border-purple-800/40 shadow-lg flex justify-between items-center">
        <div>
          <span className="text-[9px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold border border-purple-500/30 uppercase tracking-wider">
            Root System Console
          </span>
          <h2 className="text-lg font-black mt-1 text-white">System Administration</h2>
          <p className="text-xs text-slate-300">Office of Campus Sustainability • Governance & Audit</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Inventory Restocker */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 mb-2">
          <Gift className="w-4 h-4 text-purple-600" />
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Reward Inventory Restocker
          </h3>
        </div>
        <p className="text-[11px] text-slate-500 mb-3">
          Manage stock allocations for student union store merchandise.
        </p>

        <div className="flex gap-2 text-xs">
          <select
            value={selectedRewardId}
            onChange={(e) => setSelectedRewardId(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 font-medium"
          >
            {rewards.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} ({r.stock} remaining)
              </option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            max={100}
            value={restockAmount}
            onChange={(e) => setRestockAmount(Number(e.target.value))}
            className="w-20 bg-slate-50 border border-slate-200 rounded-xl p-2 text-center text-slate-900 font-bold"
          />

          <button
            onClick={handleRestock}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-2 rounded-xl transition flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Restock</span>
          </button>
        </div>
      </div>

      {/* Point Transaction Audit Trail */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Point Transaction Audit Trail
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-bold">{transactions.length} records</span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-bold text-slate-800 leading-tight">{tx.description}</p>
                <p className="text-[10px] text-slate-400">
                  {tx.type} • {tx.timestamp}
                </p>
              </div>
              <span
                className={`font-mono font-black text-xs px-2 py-0.5 rounded-lg ${
                  tx.amount > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Seed Data */}
      <div className="bg-slate-900 text-white p-4 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white">Reset Local Database</h4>
          <p className="text-[10px] text-slate-400">Restore default initial test data and seed state</p>
        </div>
        <button
          onClick={() => {
            sounds.playClick();
            onResetSystemData();
          }}
          className="bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

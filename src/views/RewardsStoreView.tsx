import React, { useState } from 'react';
import { UserProfile, RewardItem, Badge } from '../types';
import { Gift, Coins, Award, CheckCircle2, Ticket, Sparkles, MapPin, Search } from 'lucide-react';
import { sounds } from '../utils/audio';

interface RewardsStoreViewProps {
  user: UserProfile;
  rewards: RewardItem[];
  onRedeemReward: (reward: RewardItem) => void;
  onOpenWallet: () => void;
  voucherCount: number;
}

export const RewardsStoreView: React.FC<RewardsStoreViewProps> = ({
  user,
  rewards,
  onRedeemReward,
  onOpenWallet,
  voucherCount,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const nextLvlTarget = user.level.nextLevelPoints;
  const progressPercent = Math.min(
    100,
    Math.round(((user.points - user.level.minPoints) / (nextLvlTarget - user.level.minPoints)) * 100)
  );

  const categories = ['ALL', 'Merchandise', 'Dining', 'Electronics', 'Apparel', 'Gardening'];

  const filteredRewards = rewards.filter((r) => {
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-3.5 sm:p-4 space-y-4 overflow-y-auto">
      {/* Top Header */}
      <div className="flex justify-between items-center pt-1">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Eco Rewards Store</h2>
          <p className="text-xs text-slate-500 font-medium">Redeem verified points for sustainable campus gear</p>
        </div>

        {voucherCount > 0 && (
          <button
            onClick={() => {
              sounds.playClick();
              onOpenWallet();
            }}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow flex items-center gap-1.5 transition active:scale-95"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Vouchers ({voucherCount})</span>
          </button>
        )}
      </div>

      {/* Hero Balance & Level Progression Card */}
      <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 p-4 sm:p-5 rounded-3xl shadow-lg border border-amber-300 relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-950/80 bg-amber-300/60 px-2 py-0.5 rounded-md">
              Available Balance
            </span>
            <p className="text-4xl font-black my-1 text-slate-950 tracking-tight">
              {user.points}{' '}
              <span className="text-base font-bold text-amber-950">Eco-Points</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-300/60 flex items-center justify-center text-2xl shadow-inner">
            🪙
          </div>
        </div>

        {/* Level Progression */}
        <div className="mt-3 pt-3 border-t border-amber-400/80">
          <div className="flex justify-between text-[11px] font-extrabold text-amber-950 mb-1">
            <span>Level {user.level.id}: {user.level.title}</span>
            <span>{user.points} / {nextLvlTarget} Pts</span>
          </div>
          <div className="w-full bg-amber-700/30 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-slate-950 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
          <p className="text-[10px] text-amber-950/80 mt-1 font-medium">
            Earn {Math.max(0, nextLvlTarget - user.points)} more points to reach Next Tier
          </p>
        </div>
      </div>

      {/* Earned Badges Showcase */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Earned Eco-Badges
          </h3>
          <span className="text-[10px] font-bold text-emerald-700">
            {user.badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {user.badges.map((b) => (
            <div
              key={b.id}
              className="bg-white p-2.5 rounded-2xl border border-slate-200 text-center flex flex-col items-center shadow-sm hover:border-emerald-300 transition"
              title={b.description}
            >
              <span className="text-2xl mb-1">{b.icon}</span>
              <span className="text-[10px] font-black text-slate-900 leading-tight">
                {b.name}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">Verified</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar text-xs">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => {
              sounds.playClick();
              setSelectedCategory(c);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              selectedCategory === c
                ? 'bg-slate-900 text-emerald-300 shadow'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {c === 'ALL' ? 'All Rewards' : c}
          </button>
        ))}
      </div>

      {/* Catalog of Redeemable Rewards */}
      <div className="space-y-3">
        {filteredRewards.map((reward) => {
          const canAfford = user.points >= reward.pointCost;
          const inStock = reward.stock > 0;

          return (
            <div
              key={reward.id}
              className="bg-white rounded-3xl p-3.5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-emerald-300 transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={reward.imageUrl}
                  alt={reward.title}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-100 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.2 rounded">
                      {reward.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      • {reward.stock} available
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug mt-0.5">
                    {reward.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                    {reward.description}
                  </p>
                  {reward.pickupLocation && (
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{reward.pickupLocation}</span>
                    </p>
                  )}
                  <span className="text-xs font-black text-amber-600 block mt-1">
                    {reward.pointCost} Eco-Points
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  onRedeemReward(reward);
                }}
                disabled={!canAfford || !inStock}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-black transition shadow flex items-center justify-center gap-1.5 shrink-0 active:scale-95 ${
                  !inStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : canAfford
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Gift className="w-3.5 h-3.5" />
                <span>
                  {!inStock
                    ? 'Out of Stock'
                    : canAfford
                    ? 'Redeem Voucher'
                    : `Need ${reward.pointCost - user.points} more`}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

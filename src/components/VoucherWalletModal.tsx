import React, { useState } from 'react';
import { RedeemedVoucher } from '../types';
import { Ticket, X, Copy, CheckCircle2, QrCode, MapPin, Printer } from 'lucide-react';
import { sounds } from '../utils/audio';

interface VoucherWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  vouchers: RedeemedVoucher[];
  onClaimVoucher: (voucherId: string) => void;
}

export const VoucherWalletModal: React.FC<VoucherWalletModalProps> = ({
  isOpen,
  onClose,
  vouchers,
  onClaimVoucher,
}) => {
  const [filter, setFilter] = useState<'ACTIVE' | 'CLAIMED'>('ACTIVE');

  if (!isOpen) return null;

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    sounds.playClick();
  };

  const filteredVouchers = vouchers.filter((v) =>
    filter === 'ACTIVE' ? !v.isClaimed : v.isClaimed
  );

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-sm rounded-3xl p-4 sm:p-5 shadow-2xl relative max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-2.5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Eco Rewards Wallet</h3>
              <p className="text-[10px] text-slate-400">Present code at campus desk for pickup</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-2xl my-3 shrink-0 text-xs">
          <button
            onClick={() => {
              sounds.playClick();
              setFilter('ACTIVE');
            }}
            className={`py-1.5 rounded-xl font-bold transition text-center ${
              filter === 'ACTIVE'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active ({vouchers.filter((v) => !v.isClaimed).length})
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setFilter('CLAIMED');
            }}
            className={`py-1.5 rounded-xl font-bold transition text-center ${
              filter === 'CLAIMED'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Claimed History ({vouchers.filter((v) => v.isClaimed).length})
          </button>
        </div>

        {/* Voucher List */}
        <div className="flex-1 overflow-y-auto py-1 space-y-3 pr-1">
          {filteredVouchers.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p className="text-3xl mb-2">🎟️</p>
              <p className="font-bold text-xs text-slate-300">
                {filter === 'ACTIVE' ? 'No active vouchers' : 'No claimed history yet'}
              </p>
              <p className="text-[10px] mt-1 max-w-[200px] mx-auto text-slate-500">
                Redeem reusable bottles, coffee passes, or solar banks in the Eco Rewards Store!
              </p>
            </div>
          ) : (
            filteredVouchers.map((v) => (
              <div
                key={v.id}
                className={`bg-slate-950 border rounded-2xl p-3.5 relative overflow-hidden transition ${
                  v.isClaimed
                    ? 'border-slate-800 opacity-60'
                    : 'border-purple-500/50 shadow-lg shadow-purple-950/40'
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div>
                    <h4 className="text-xs font-bold text-white">{v.rewardTitle}</h4>
                    <p className="text-[10px] text-slate-400">Redeemed {v.redeemedAt}</p>
                  </div>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      v.isClaimed
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {v.isClaimed ? 'CLAIMED' : 'READY FOR PICKUP'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-2">
                  <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                  <span>{v.pickupLocation || 'Student Union Helpdesk'}</span>
                </div>

                {/* Scannable Barcode & QR Box */}
                <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-2.5 flex items-center justify-between my-2">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-white p-1 rounded-lg">
                      <QrCode className="w-8 h-8 text-slate-950" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">
                        Voucher Pass ID
                      </span>
                      <span className="font-mono text-xs font-black text-amber-400 tracking-wider">
                        {v.claimCode}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyCode(v.claimCode)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Copy code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                {!v.isClaimed ? (
                  <button
                    onClick={() => {
                      sounds.playSuccess();
                      onClaimVoucher(v.id);
                    }}
                    className="w-full mt-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-[10px] flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Pickup at Campus Counter</span>
                  </button>
                ) : (
                  <p className="text-[10px] text-slate-500 text-center mt-1">
                    ✓ Verified & Claimed
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

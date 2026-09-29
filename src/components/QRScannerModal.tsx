import React, { useState } from 'react';
import { QrCode, X, CheckCircle2, Sparkles, Camera, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (pointsAward: number, itemName: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [scannedItem, setScannedItem] = useState<{ name: string; points: number } | null>(null);

  if (!isOpen) return null;

  const triggerScan = (name: string, points: number) => {
    sounds.playClick();
    setIsScanning(true);
    setScannedItem({ name, points });

    setTimeout(() => {
      setIsScanning(false);
      sounds.playPointsChime();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#38bdf8', '#fbbf24'],
      });
      onScanSuccess(points, name);
      onClose();
    }, 1200);
  };

  const handleManualScan = () => {
    if (!customCode.trim()) return;
    triggerScan(`Custom Tag: ${customCode}`, 40);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-sm rounded-3xl p-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Campus Hardware Scanner</h3>
              <p className="text-[10px] text-slate-400">Scan smart bins, solar kiosks & docks</p>
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

        {/* Viewfinder Simulation */}
        <div className="h-44 bg-slate-950 rounded-2xl border-2 border-slate-800 relative overflow-hidden flex flex-col items-center justify-center mb-3">
          {/* Laser scanning beam */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-[bounce_2s_infinite]" />

          {/* Target box */}
          <div className="w-32 h-32 border-2 border-emerald-400/80 rounded-2xl relative flex items-center justify-center">
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-300" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-300" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-300" />

            <QrCode className="w-16 h-16 text-emerald-400/40 animate-pulse" />
          </div>

          <p className="text-[10px] text-slate-400 font-mono mt-2 z-10">
            {isScanning ? `Verifying ${scannedItem?.name}...` : 'Point camera at QR code label on hardware'}
          </p>
        </div>

        {/* Simulate Verified Station Scans */}
        <div className="mb-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-black mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Simulate Campus Hardware Scans
          </p>

          <div className="space-y-1.5">
            <button
              onClick={() => triggerScan('Compost Bin #04 (Cafeteria)', 50)}
              disabled={isScanning}
              className="w-full bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 p-2.5 rounded-xl text-xs flex justify-between items-center transition group active:scale-98"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">♻️</span>
                <span className="font-bold text-slate-200 group-hover:text-emerald-300">
                  Compost Bin #04 (Cafeteria)
                </span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 font-black text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                +50 Pts
              </span>
            </button>

            <button
              onClick={() => triggerScan('Solar Bin Station #12 (North Quad)', 50)}
              disabled={isScanning}
              className="w-full bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 p-2.5 rounded-xl text-xs flex justify-between items-center transition group active:scale-98"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">☀️</span>
                <span className="font-bold text-slate-200 group-hover:text-emerald-300">
                  Solar Bin #12 (North Quad)
                </span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 font-black text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                +50 Pts
              </span>
            </button>

            <button
              onClick={() => triggerScan('E-Waste Smart Station (Library)', 60)}
              disabled={isScanning}
              className="w-full bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 p-2.5 rounded-xl text-xs flex justify-between items-center transition group active:scale-98"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">💻</span>
                <span className="font-bold text-slate-200 group-hover:text-emerald-300">
                  E-Waste Station (Library)
                </span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 font-black text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                +60 Pts
              </span>
            </button>

            <button
              onClick={() => triggerScan('Campus Bike Dock #03', 30)}
              disabled={isScanning}
              className="w-full bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 p-2.5 rounded-xl text-xs flex justify-between items-center transition group active:scale-98"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🚲</span>
                <span className="font-bold text-slate-200 group-hover:text-emerald-300">
                  Campus Bike Dock #03
                </span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 font-black text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                +30 Pts
              </span>
            </button>
          </div>
        </div>

        {/* Manual code input */}
        <div className="pt-2 border-t border-slate-800 flex gap-1.5">
          <input
            type="text"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="Or enter tag code (e.g., BIN-2026)"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={handleManualScan}
            disabled={!customCode.trim() || isScanning}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition"
          >
            <span>Scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

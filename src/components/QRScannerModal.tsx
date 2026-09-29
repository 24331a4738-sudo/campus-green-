import React, { useState, useRef, useEffect } from 'react';
import { QrCode, X, CheckCircle2, Sparkles, Camera, ArrowRight, Video, VideoOff, Upload } from 'lucide-react';
import { sounds } from '../utils/audio';
import { INITIAL_STATIONS } from '../data/initialData';
import confetti from 'canvas-confetti';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (pointsAward: number, itemName: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [scannedItem, setScannedItem] = useState<{ name: string; points: number } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (useRealCamera && isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [useRealCamera, isOpen]);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch {
      setUseRealCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  if (!isOpen) return null;

  const triggerScan = (name: string, points: number) => {
    sounds.playClick();
    setIsScanning(true);
    setScannedItem({ name, points });

    setTimeout(() => {
      setIsScanning(false);
      stopCamera();
      sounds.playPointsChime();
      confetti({
        particleCount: 65,
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      triggerScan(`Image QR: ${file.name.replace(/\.[^/.]+$/, '')}`, 50);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-sm rounded-3xl p-4 sm:p-5 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Smart Hardware Scanner</h3>
              <p className="text-[10px] text-slate-400">Scan smart bins, solar stations & docks</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              stopCamera();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="h-44 bg-slate-950 rounded-2xl border-2 border-slate-800 relative overflow-hidden flex flex-col items-center justify-center mb-3 shadow-inner">
          {/* Real Camera Stream if activated */}
          {useRealCamera ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null}

          {/* Laser scanning beam */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-[bounce_2s_infinite] z-10" />

          {/* Target box */}
          <div className="w-32 h-32 border-2 border-emerald-400/80 rounded-2xl relative flex items-center justify-center z-10 backdrop-blur-[0.5px]">
            <div className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-300" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-300" />
            <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-300" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-300" />

            {!useRealCamera && <QrCode className="w-16 h-16 text-emerald-400/40 animate-pulse" />}
          </div>

          <p className="text-[10px] text-slate-300 font-mono mt-2 z-10 bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-slate-800">
            {isScanning ? `Verifying ${scannedItem?.name}...` : 'Align QR code inside target box'}
          </p>
        </div>

        {/* Camera Toggle and Photo Upload */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setUseRealCamera(!useRealCamera);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border ${
              useRealCamera
                ? 'bg-rose-950 text-rose-300 border-rose-700'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {useRealCamera ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{useRealCamera ? 'Stop Webcam' : 'Use Live Camera'}</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition"
          >
            <Upload className="w-3.5 h-3.5 text-purple-400" />
            <span>Upload Image QR</span>
          </button>
        </div>

        {/* Verified Campus Stations Quick-Scan */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 font-black mb-2">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Verified Campus Stations
            </span>
            <span className="text-emerald-400 font-bold">{INITIAL_STATIONS.length} Available</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {INITIAL_STATIONS.map((station) => (
              <button
                key={station.id}
                onClick={() => triggerScan(station.name, station.pointsReward)}
                disabled={isScanning}
                className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 p-2.5 rounded-xl text-xs flex justify-between items-center transition group active:scale-98 text-left"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">
                      {station.type === 'COMPOST' ? '♻️' : station.type === 'SOLAR' ? '☀️' : station.type === 'EWASTE' ? '💻' : station.type === 'BIKE' ? '🚲' : '💧'}
                    </span>
                    <span className="font-bold text-slate-200 group-hover:text-emerald-300">
                      {station.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 ml-5">
                    {station.location} • Fill: {station.fillLevelPercent}%
                  </p>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 font-black text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                  +{station.pointsReward} Pts
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual code input */}
        <div className="pt-2 border-t border-slate-800 flex gap-1.5">
          <input
            type="text"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="Enter tag ID (e.g., BIN-2026)"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={handleManualScan}
            disabled={!customCode.trim() || isScanning}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition"
          >
            <span>Verify</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { CampusStation } from '../types';
import { INITIAL_STATIONS } from '../data/initialData';
import { MapPin, Navigation, Scan, AlertTriangle, CheckCircle2, Filter, Layers, Info } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CampusMapViewProps {
  onScanStation: (stationName: string, points: number) => void;
  onReportStationIssue: (stationLocation: string, category: string) => void;
}

export const CampusMapView: React.FC<CampusMapViewProps> = ({
  onScanStation,
  onReportStationIssue,
}) => {
  const [selectedStation, setSelectedStation] = useState<CampusStation>(INITIAL_STATIONS[0]);
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredStations = INITIAL_STATIONS.filter((s) => {
    if (filterType === 'ALL') return true;
    return s.type === filterType;
  });

  const getStationIcon = (type: CampusStation['type']) => {
    switch (type) {
      case 'COMPOST':
        return '♻️';
      case 'SOLAR':
        return '☀️';
      case 'EWASTE':
        return '💻';
      case 'WATER':
        return '💧';
      case 'BIKE':
        return '🚲';
      default:
        return '🌱';
    }
  };

  return (
    <div className="p-3.5 sm:p-4 space-y-3.5 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center pt-1">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Campus Eco Map</h2>
          <p className="text-xs text-slate-500 font-medium">Smart bins, solar inverters, refill & bike docks</p>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
          <Navigation className="w-3 h-3 text-emerald-600 animate-spin [animation-duration:10s]" />
          <span>GPS Active</span>
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar text-xs">
        {['ALL', 'COMPOST', 'SOLAR', 'EWASTE', 'WATER', 'BIKE'].map((t) => (
          <button
            key={t}
            onClick={() => {
              sounds.playClick();
              setFilterType(t);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              filterType === t
                ? 'bg-slate-900 text-emerald-300 shadow'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t === 'ALL' ? 'All Stations' : t}
          </button>
        ))}
      </div>

      {/* Interactive Campus Map Canvas Container */}
      <div className="relative h-64 sm:h-72 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 rounded-3xl border-2 border-emerald-800/40 p-3 shadow-xl overflow-hidden select-none">
        {/* Campus Map Stylized Zones & Pathways */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-0 right-0 h-4 bg-emerald-500/30 transform -rotate-6" />
          <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-emerald-500/30 transform rotate-12" />
          <div className="absolute top-1/2 left-0 right-0 h-6 bg-teal-500/20" />
        </div>

        {/* Zone Labels */}
        <div className="absolute top-3 left-3 text-[10px] font-black uppercase text-emerald-400/60 tracking-wider">
          North Quad Park
        </div>
        <div className="absolute bottom-3 left-4 text-[10px] font-black uppercase text-teal-400/60 tracking-wider">
          Student Union Plaza
        </div>
        <div className="absolute top-3 right-4 text-[10px] font-black uppercase text-cyan-400/60 tracking-wider">
          Engineering Complex
        </div>
        <div className="absolute bottom-3 right-4 text-[10px] font-black uppercase text-emerald-400/60 tracking-wider">
          Science & Bio Labs
        </div>

        {/* Interactive Station Markers */}
        {filteredStations.map((station) => {
          const isSelected = selectedStation?.id === station.id;
          return (
            <button
              key={station.id}
              onClick={() => {
                sounds.playClick();
                setSelectedStation(station);
              }}
              style={{ left: `${station.coordinates.x}%`, top: `${station.coordinates.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl flex items-center justify-center transition-all ${
                isSelected
                  ? 'w-10 h-10 bg-emerald-400 text-slate-950 shadow-[0_0_20px_#34d399] z-20 scale-110 ring-4 ring-white/50'
                  : 'w-8 h-8 bg-slate-900/90 text-white border border-emerald-500/60 hover:scale-110 shadow-lg z-10'
              }`}
              title={station.name}
            >
              <span className="text-sm">{getStationIcon(station.type)}</span>
              {station.fillLevelPercent >= 80 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Station Detail Card */}
      {selectedStation && (
        <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{getStationIcon(selectedStation.type)}</span>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                    {selectedStation.name}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {selectedStation.location} • {selectedStation.zone}
                  </p>
                </div>
              </div>
            </div>

            <span
              className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                selectedStation.status === 'FULL'
                  ? 'bg-rose-100 text-rose-700'
                  : selectedStation.status === 'ATTENTION'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {selectedStation.status}
            </span>
          </div>

          {/* Fill level progress */}
          <div>
            <div className="flex justify-between text-[11px] font-extrabold text-slate-700 mb-1">
              <span>Container Capacity / Fill Level</span>
              <span
                className={
                  selectedStation.fillLevelPercent >= 80
                    ? 'text-rose-600 font-black'
                    : 'text-emerald-600'
                }
              >
                {selectedStation.fillLevelPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  selectedStation.fillLevelPercent >= 80
                    ? 'bg-rose-500'
                    : selectedStation.fillLevelPercent >= 50
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${selectedStation.fillLevelPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Last serviced: {selectedStation.lastEmptied || 'Recently'} • Standard emptying schedule active
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
            <button
              onClick={() => onScanStation(selectedStation.name, selectedStation.pointsReward)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow active:scale-95"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Scan Station (+{selectedStation.pointsReward} Pts)</span>
            </button>

            <button
              onClick={() => onReportStationIssue(selectedStation.location, selectedStation.type === 'COMPOST' ? 'Waste Management' : 'Energy & Solar')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-slate-200"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

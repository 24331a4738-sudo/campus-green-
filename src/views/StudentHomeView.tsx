import React from 'react';
import { UserProfile, CampusEvent, ResourceItem } from '../types';
import { Calendar, Award, BookOpen, Gift, Scan, Mic, ArrowRight, Flame, Download, CheckCircle, MapPin, Map, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface StudentHomeViewProps {
  user: UserProfile;
  events: CampusEvent[];
  resources: ResourceItem[];
  onNavigateTab: (tab: 'home' | 'map' | 'events' | 'resources' | 'rewards' | 'impact') => void;
  onOpenQRScanner: () => void;
  onOpenVoiceModal: () => void;
  onOpenQuiz: () => void;
  onToggleDrive: (eventId: string) => void;
  onSelectEventDetail: (event: CampusEvent) => void;
  onDownloadResource: (title: string) => void;
}

export const StudentHomeView: React.FC<StudentHomeViewProps> = ({
  user,
  events,
  resources,
  onNavigateTab,
  onOpenQRScanner,
  onOpenVoiceModal,
  onOpenQuiz,
  onToggleDrive,
  onSelectEventDetail,
  onDownloadResource,
}) => {
  const featuredEvent = events[0] || null;

  return (
    <div className="p-3.5 sm:p-4 space-y-4 overflow-y-auto">
      {/* Top Greeting & Streak */}
      <div className="flex justify-between items-start pt-1">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Hello, {user.name.split(' ')[0]}! 👋
            </h2>
            <span className="bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
              <span>{user.streak}d Streak</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {user.level.title} • {user.departmentCode}
          </p>
        </div>

        {/* Level Badge */}
        <div
          onClick={() => {
            sounds.playClick();
            onNavigateTab('rewards');
          }}
          className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-3 py-1.5 rounded-2xl text-xs font-black shadow-sm flex items-center gap-1.5 active:scale-95 transition"
        >
          <span>🌱</span>
          <span>Lvl {user.level.id}</span>
        </div>
      </div>

      {/* 4 Feature Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div
          onClick={() => {
            sounds.playClick();
            onNavigateTab('events');
          }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-3.5 rounded-2xl shadow-sm cursor-pointer flex flex-col justify-between h-24 sm:h-28 transition active:scale-98"
        >
          <div className="flex justify-between items-center">
            <span className="text-2xl font-black">{events.length}</span>
            <Calendar className="w-4 h-4 text-emerald-200" />
          </div>
          <div>
            <p className="font-bold text-xs sm:text-sm">Campus Drives</p>
            <p className="text-[10px] text-emerald-100 font-medium flex items-center gap-0.5">
              <span>Explore events</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </p>
          </div>
        </div>

        <div
          onClick={() => {
            sounds.playClick();
            onOpenQuiz();
          }}
          className="bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white p-3.5 rounded-2xl shadow-sm cursor-pointer flex flex-col justify-between h-24 sm:h-28 transition active:scale-98"
        >
          <div className="flex justify-between items-center">
            <span className="text-2xl font-black">7</span>
            <Award className="w-4 h-4 text-amber-200" />
          </div>
          <div>
            <p className="font-bold text-xs sm:text-sm">Eco Quiz</p>
            <p className="text-[10px] text-amber-100 font-medium">Take Quiz (+50 Pts)</p>
          </div>
        </div>

        <div
          onClick={() => {
            sounds.playClick();
            onNavigateTab('resources');
          }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3.5 rounded-2xl shadow-sm cursor-pointer flex flex-col justify-between h-24 sm:h-28 transition active:scale-98"
        >
          <div className="flex justify-between items-center">
            <span className="text-2xl font-black">{resources.length}</span>
            <BookOpen className="w-4 h-4 text-blue-200" />
          </div>
          <div>
            <p className="font-bold text-xs sm:text-sm">Resources</p>
            <p className="text-[10px] text-blue-100 font-medium">Guides & Lectures</p>
          </div>
        </div>

        <div
          onClick={() => {
            sounds.playClick();
            onNavigateTab('rewards');
          }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-3.5 rounded-2xl shadow-sm cursor-pointer flex flex-col justify-between h-24 sm:h-28 transition active:scale-98"
        >
          <div className="flex justify-between items-center">
            <span className="text-2xl font-black">{user.points}</span>
            <Gift className="w-4 h-4 text-purple-200" />
          </div>
          <div>
            <p className="font-bold text-xs sm:text-sm">Eco Points</p>
            <p className="text-[10px] text-purple-100 font-medium">Redeem Vouchers →</p>
          </div>
        </div>
      </div>

      {/* Hardware Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => {
            sounds.playClick();
            onOpenQRScanner();
          }}
          className="bg-slate-900 hover:bg-slate-800 text-emerald-400 p-2.5 rounded-2xl border border-slate-800 shadow-sm text-xs font-bold flex flex-col items-center justify-center gap-1 transition active:scale-95"
        >
          <Scan className="w-4 h-4 text-emerald-400" />
          <span>Scan Hardware</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onNavigateTab('map');
          }}
          className="bg-slate-900 hover:bg-slate-800 text-cyan-400 p-2.5 rounded-2xl border border-slate-800 shadow-sm text-xs font-bold flex flex-col items-center justify-center gap-1 transition active:scale-95"
        >
          <Map className="w-4 h-4 text-cyan-400" />
          <span>Campus Map</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenVoiceModal();
          }}
          className="bg-slate-900 hover:bg-slate-800 text-amber-400 p-2.5 rounded-2xl border border-slate-800 shadow-sm text-xs font-bold flex flex-col items-center justify-center gap-1 transition active:scale-95"
        >
          <Mic className="w-4 h-4 text-amber-400" />
          <span>Voice Issue</span>
        </button>
      </div>

      {/* Featured Banner: Tree Plantation Drive 2026 */}
      {featuredEvent && (
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Featured Campus Drive
            </h3>
            <span className="text-[10px] font-bold text-emerald-700">Nov 18 • Central Park</span>
          </div>

          <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 text-white p-4 rounded-3xl shadow-lg border border-emerald-700/40 relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  {featuredEvent.category}
                </span>
                <h4
                  onClick={() => {
                    sounds.playClick();
                    onSelectEventDetail(featuredEvent);
                  }}
                  className="font-extrabold text-sm sm:text-base text-white mt-1 cursor-pointer hover:underline"
                >
                  {featuredEvent.title}
                </h4>
              </div>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black px-2 py-0.5 rounded-xl">
                +{featuredEvent.pointsValue} Pts
              </span>
            </div>

            <p className="text-[11px] text-emerald-100/80 mb-3 line-clamp-2 leading-relaxed">
              {featuredEvent.description}
            </p>

            {/* Participation bar */}
            <div className="bg-black/30 p-2.5 rounded-2xl mb-3 flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-emerald-200 font-extrabold">
                  Registration Progress
                </p>
                <p className="text-xs font-bold text-white">
                  <span className="text-emerald-300 font-black">{featuredEvent.currentParticipants}</span> / {featuredEvent.capacity} Students Joined
                </p>
              </div>
              <div className="w-24 bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (featuredEvent.currentParticipants / featuredEvent.capacity) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  onSelectEventDetail(featuredEvent);
                }}
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition"
              >
                <span>View Details</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onToggleDrive(featuredEvent.id);
                }}
                className={`py-2 rounded-xl text-xs font-black transition shadow flex items-center justify-center gap-1.5 active:scale-95 ${
                  featuredEvent.isRegistered
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                }`}
              >
                {featuredEvent.isRegistered ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Registered</span>
                  </>
                ) : (
                  <>
                    <span>Join Drive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Learning Resources */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Recommended Guides
          </h3>
          <button
            onClick={() => {
              sounds.playClick();
              onNavigateTab('resources');
            }}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-bold"
          >
            See all ({resources.length})
          </button>
        </div>

        <div className="space-y-2">
          {resources.slice(0, 2).map((res) => (
            <div
              key={res.id}
              className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between hover:border-emerald-300 transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                    res.type === 'PDF'
                      ? 'bg-rose-100 text-rose-700'
                      : res.type === 'VIDEO'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-teal-100 text-teal-700'
                  }`}
                >
                  {res.type}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">{res.title}</p>
                  <p className="text-[10px] text-slate-500">
                    {res.author} {res.fileSizeMb ? `• ${res.fileSizeMb} MB` : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  onDownloadResource(res.title);
                }}
                className="p-2 text-slate-400 hover:text-emerald-600 transition"
                title="Download / View"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

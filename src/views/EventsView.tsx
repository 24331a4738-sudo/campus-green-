import React, { useState } from 'react';
import { CampusEvent } from '../types';
import { Calendar, MapPin, Users, Award, CheckCircle, Sparkles, Filter, Search, ArrowRight, Eye } from 'lucide-react';
import { sounds } from '../utils/audio';

interface EventsViewProps {
  events: CampusEvent[];
  onToggleRegistration: (eventId: string) => void;
  onOpenCreateModal?: () => void;
  canCreateEvent?: boolean;
  onSelectEventDetail: (event: CampusEvent) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  onToggleRegistration,
  onOpenCreateModal,
  canCreateEvent,
  onSelectEventDetail,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['ALL', 'Drives & Campaigns', 'Clean Energy', 'Waste Management', 'Workshops'];

  const filteredEvents = events.filter((e) => {
    const matchesCategory = selectedCategory === 'ALL' || e.category === selectedCategory;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-3.5 sm:p-4 space-y-4 overflow-y-auto">
      {/* Top Header */}
      <div className="flex justify-between items-center pt-1">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Explore Events</h2>
          <p className="text-xs text-slate-500 font-medium">Join campus drives, earn verified eco-points</p>
        </div>
        {canCreateEvent && onOpenCreateModal && (
          <button
            onClick={() => {
              sounds.playClick();
              onOpenCreateModal();
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow transition"
          >
            + Create
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search campus drives, workshops, locations..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
        />
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sounds.playClick();
              setSelectedCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-slate-900 text-emerald-300 shadow'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Feed */}
      <div className="space-y-3.5">
        {filteredEvents.map((evt) => {
          const isFull = evt.currentParticipants >= evt.capacity && !evt.isRegistered;
          const progressPercent = Math.min(100, (evt.currentParticipants / evt.capacity) * 100);

          return (
            <div
              key={evt.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden hover:border-emerald-300 transition"
            >
              {/* Cover Banner */}
              <div
                onClick={() => {
                  sounds.playClick();
                  onSelectEventDetail(evt);
                }}
                className="h-28 sm:h-32 bg-slate-900 relative overflow-hidden cursor-pointer group"
              >
                <img
                  src={evt.coverImage}
                  alt={evt.title}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                <div className="absolute top-2.5 left-3 flex gap-1.5 flex-wrap">
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {evt.category}
                  </span>
                  {evt.isRegistered && (
                    <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 text-[10px] font-black px-2 py-0.5 rounded-md">
                      ✓ ENROLLED
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-3 bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-xl shadow">
                  +{evt.pointsValue} Pts
                </div>

                <div className="absolute bottom-2 left-3 right-3 text-white flex justify-between items-end">
                  <h3 className="font-black text-base leading-tight drop-shadow">
                    {evt.title}
                  </h3>
                  <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-0.5">
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Event Body */}
              <div className="p-3.5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{evt.date} • {evt.startTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.location}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                  {evt.description}
                </p>

                {/* SDG Goals */}
                <div className="flex flex-wrap gap-1">
                  {evt.sdgGoals.map((sdg, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-lg"
                    >
                      {sdg}
                    </span>
                  ))}
                </div>

                {/* Registration Progress */}
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      <strong className="text-slate-900 font-extrabold">{evt.currentParticipants}</strong> / {evt.capacity} spots filled
                    </span>
                  </div>
                  <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onSelectEventDetail(evt);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-slate-200"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>View Pass & Schedule</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      onToggleRegistration(evt.id);
                    }}
                    disabled={isFull}
                    className={`py-2 rounded-xl text-xs font-black transition shadow flex items-center justify-center gap-1 active:scale-98 ${
                      evt.isRegistered
                        ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                        : isFull
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    }`}
                  >
                    {evt.isRegistered ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-700" />
                        <span>Registered (Cancel)</span>
                      </>
                    ) : isFull ? (
                      <span>Capacity Full</span>
                    ) : (
                      <span>Join (+{evt.pointsValue} Pts)</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

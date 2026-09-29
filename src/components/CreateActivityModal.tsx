import React, { useState } from 'react';
import { PlusCircle, X, Calendar, MapPin, Users, Award, Tag } from 'lucide-react';
import { CampusEvent } from '../types';
import { sounds } from '../utils/audio';

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: Omit<CampusEvent, 'id' | 'currentParticipants' | 'isRegistered'>) => void;
}

export const CreateActivityModal: React.FC<CreateActivityModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Drives & Campaigns');
  const [location, setLocation] = useState('Central Quad');
  const [date, setDate] = useState('Nov 28, 2026');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('02:00 PM');
  const [capacity, setCapacity] = useState(100);
  const [pointsValue, setPointsValue] = useState(50);
  const [sdgGoals, setSdgGoals] = useState(['SDG 12 Responsible Consumption', 'SDG 13 Climate Action']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    sounds.playSuccess();
    onCreateEvent({
      title,
      description,
      category,
      location,
      date,
      startTime,
      endTime,
      capacity: Number(capacity),
      pointsValue: Number(pointsValue),
      status: 'PUBLISHED',
      sdgGoals,
      coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-sm rounded-3xl p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Create Green Activity</h3>
              <p className="text-[10px] text-slate-400">Publish campus event or drive</p>
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

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Activity Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Campus Biodiversity Flora Mapping"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Description
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the objectives, hands-on tasks, and environmental benefits..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200"
              >
                <option value="Drives & Campaigns">Drives & Campaigns</option>
                <option value="Clean Energy">Clean Energy</option>
                <option value="Waste Management">Waste Management</option>
                <option value="Workshops">Academic Workshops</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white text-[11px]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Capacity</label>
              <input
                type="number"
                min={5}
                max={500}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white text-[11px]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Eco-Points</label>
              <input
                type="number"
                min={10}
                max={200}
                value={pointsValue}
                onChange={(e) => setPointsValue(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-amber-400 font-bold text-[11px]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black py-3 rounded-2xl shadow-lg transition mt-4 active:scale-95"
          >
            Publish Activity to Campus Feed
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { CampusEvent } from '../types';
import { Calendar, MapPin, Users, Award, X, CheckCircle, Clock, QrCode, Download, Share2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface EventDetailModalProps {
  event: CampusEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleRegistration: (eventId: string) => void;
  userName: string;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onToggleRegistration,
  userName,
}) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; mins: number }>({
    days: 49,
    hours: 8,
    mins: 20,
  });

  if (!isOpen || !event) return null;

  const isFull = event.currentParticipants >= event.capacity && !event.isRegistered;

  const downloadCalendarFile = () => {
    sounds.playClick();
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Campus Green//Sustainability Drives//EN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-sm rounded-3xl p-4 sm:p-5 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Cover Header */}
        <div className="relative h-32 rounded-2xl overflow-hidden mb-3">
          <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-2 right-2 bg-slate-900/80 text-white p-1.5 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded">
              {event.category}
            </span>
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-xl">
              +{event.pointsValue} Pts
            </span>
          </div>
        </div>

        <h3 className="text-base font-black text-white leading-tight mb-1">{event.title}</h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-3">{event.description}</p>

        {/* Date, Time, Location details */}
        <div className="space-y-1.5 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs mb-3">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold">{event.date} • {event.startTime} - {event.endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{event.location}</span>
          </div>
          {event.organizer && (
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <Users className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Organizer: {event.organizer}</span>
            </div>
          )}
        </div>

        {/* Requirements Checklist */}
        {event.requirements && event.requirements.length > 0 && (
          <div className="mb-3">
            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
              Event Checklist & Preparation
            </h4>
            <div className="space-y-1">
              {event.requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Digital Event Pass if Registered */}
        {event.isRegistered && (
          <div className="bg-emerald-950/60 border border-emerald-500/40 p-3 rounded-2xl text-center mb-3">
            <div className="flex items-center justify-center gap-2 text-emerald-300 text-xs font-black mb-1">
              <QrCode className="w-4 h-4" />
              <span>OFFICIAL DIGITAL ATTENDANCE PASS</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Pass Holder: {userName} • Gate Check-in ID: CG-EVT-{event.id.toUpperCase()}
            </p>
            <div className="bg-white p-2 w-24 h-24 rounded-xl mx-auto my-2 flex items-center justify-center">
              <QrCode className="w-20 h-20 text-slate-950" />
            </div>
            <p className="text-[9px] text-emerald-400 font-mono">Present to gate volunteer on arrival</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={downloadCalendarFile}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add to Calendar</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onToggleRegistration(event.id);
            }}
            disabled={isFull}
            className={`font-black py-2.5 rounded-2xl text-xs transition shadow flex items-center justify-center gap-1 ${
              event.isRegistered
                ? 'bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-700'
                : isFull
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            <span>{event.isRegistered ? 'Leave Event' : isFull ? 'Event Full' : 'Join Event (+50 Pts)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

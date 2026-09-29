import React, { useState } from 'react';
import { UserProfile, MaintenanceReport, ReportStatus, ReportPriority } from '../types';
import { Scan, Mic, CheckCircle2, AlertTriangle, Clock, MapPin, Tag, Wrench, Filter, Play, Square, MessageSquare, UserCheck, Image } from 'lucide-react';
import { sounds } from '../utils/audio';

interface StaffMaintenanceViewProps {
  user: UserProfile;
  reports: MaintenanceReport[];
  onOpenQRScanner: () => void;
  onOpenVoiceModal: () => void;
  onUpdateReportStatus: (reportId: string, status: ReportStatus, staffNote?: string) => void;
}

export const StaffMaintenanceView: React.FC<StaffMaintenanceViewProps> = ({
  user,
  reports,
  onOpenQRScanner,
  onOpenVoiceModal,
  onUpdateReportStatus,
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [activeAudioPlaying, setActiveAudioPlaying] = useState<string | null>(null);
  const [selectedReportForNotes, setSelectedReportForNotes] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>('');

  const filteredReports = reports.filter((r) => {
    const matchesPriority = filterPriority === 'ALL' || r.priority === filterPriority;
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchesPriority && matchesStatus;
  });

  const pendingCount = reports.filter((r) => r.status !== 'RESOLVED').length;

  const playVoiceMemo = (reportId: string, audioUrl?: string) => {
    if (!audioUrl) return;
    sounds.playClick();
    if (activeAudioPlaying === reportId) {
      setActiveAudioPlaying(null);
    } else {
      const audio = new Audio(audioUrl);
      audio.onended = () => setActiveAudioPlaying(null);
      audio.play().catch(() => {});
      setActiveAudioPlaying(reportId);
    }
  };

  const handleSaveStaffNote = (reportId: string) => {
    if (!noteInput.trim()) return;
    sounds.playSuccess();
    onUpdateReportStatus(reportId, 'IN_PROGRESS', noteInput.trim());
    setSelectedReportForNotes(null);
    setNoteInput('');
  };

  return (
    <div className="p-3.5 sm:p-4 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center pt-1">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Facilities & Hardware Queue</h2>
          <p className="text-xs text-slate-500 font-medium">Operations triage, bin dispatches & audio reports</p>
        </div>
        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] px-2.5 py-1 rounded-full font-black">
          Facilities Staff
        </span>
      </div>

      {/* 2 Big Stat Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Participants</p>
          <p className="text-3xl font-black text-emerald-600 my-0.5">1,240</p>
          <p className="text-[10px] text-emerald-600 font-bold">↑ 12% this month</p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Waste Recycled</p>
          <p className="text-3xl font-black text-teal-600 my-0.5">95%</p>
          <p className="text-[10px] text-teal-600 font-bold">✓ 5% vs last month</p>
        </div>
      </div>

      {/* Hardware Dispatch Action Bar */}
      <div className="space-y-2">
        <button
          onClick={() => {
            sounds.playClick();
            onOpenQRScanner();
          }}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md transition active:scale-98"
        >
          <Scan className="w-4 h-4 text-slate-950" />
          <span>Scan QR Code (Hardware & Smart Bins)</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenVoiceModal();
          }}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs border border-slate-700 shadow-sm transition active:scale-98"
        >
          <Mic className="w-4 h-4 text-emerald-400" />
          <span>Voice Maintenance Dispatch</span>
        </button>
      </div>

      {/* Reports Queue */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Tickets & Reports Queue
            </h3>
            <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
              {pendingCount} Pending
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 text-[10px]">
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
              <button
                key={p}
                onClick={() => {
                  sounds.playClick();
                  setFilterPriority(p);
                }}
                className={`px-2 py-0.5 rounded-lg font-bold transition ${
                  filterPriority === p
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Report List */}
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className={`bg-white p-3.5 rounded-3xl border transition shadow-sm space-y-2 ${
                report.status === 'RESOLVED'
                  ? 'border-slate-200 opacity-80'
                  : report.priority === 'CRITICAL' || report.priority === 'HIGH'
                  ? 'border-amber-400/80 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {report.location}
                    </span>
                    <span className="text-[10px] text-slate-400">• {report.reportedAt}</span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                        report.priority === 'CRITICAL'
                          ? 'bg-red-100 text-red-700'
                          : report.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {report.priority}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                    {report.category} • Reporter: {report.reportedBy}
                  </span>
                </div>

                {/* State Machine Status Toggle */}
                <button
                  onClick={() => {
                    sounds.playSuccess();
                    onUpdateReportStatus(
                      report.id,
                      report.status === 'RESOLVED' ? 'SUBMITTED' : 'RESOLVED'
                    );
                  }}
                  className={`text-xs font-black px-3 py-1.5 rounded-xl transition shadow-sm flex items-center gap-1 active:scale-95 ${
                    report.status === 'RESOLVED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{report.status === 'RESOLVED' ? 'Resolved' : 'Mark Done'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {report.description}
              </p>

              {/* Audio voice memo playback */}
              {report.voiceMemoTranscript && (
                <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600 text-[11px] font-mono">
                    <Mic className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">"{report.voiceMemoTranscript}"</span>
                  </div>
                  {report.audioUrl && (
                    <button
                      onClick={() => playVoiceMemo(report.id, report.audioUrl)}
                      className="bg-slate-800 text-emerald-300 hover:bg-slate-700 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0"
                    >
                      {activeAudioPlaying === report.id ? <Square className="w-3 h-3 fill-emerald-300" /> : <Play className="w-3 h-3 fill-emerald-300" />}
                      <span>{activeAudioPlaying === report.id ? 'Stop' : 'Play Memo'}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Photo preview if present */}
              {report.photoUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200 max-h-36">
                  <img src={report.photoUrl} alt="Report attachment" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Staff Resolution Notes */}
              {report.staffNotes && (
                <div className="p-2 bg-emerald-50/60 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-medium flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Staff Log: {report.staffNotes}</span>
                </div>
              )}

              {/* Add Note Form */}
              {selectedReportForNotes === report.id ? (
                <div className="pt-2 flex gap-1.5">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Enter facilities action note..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs"
                  />
                  <button
                    onClick={() => handleSaveStaffNote(report.id)}
                    className="bg-emerald-600 text-white font-bold px-3 py-1 rounded-xl text-xs"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => setSelectedReportForNotes(null)}
                    className="text-slate-400 px-2 py-1 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Assignee: {report.assigneeName || 'Unassigned (General Pool)'}</span>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setSelectedReportForNotes(report.id);
                    }}
                    className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>{report.staffNotes ? 'Edit Staff Note' : '+ Add Action Note'}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

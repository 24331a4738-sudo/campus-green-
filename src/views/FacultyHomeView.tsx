import React, { useState } from 'react';
import { UserProfile, CampusEvent } from '../types';
import { BookOpen, PlusCircle, BarChart3, Sparkles, CheckCircle2, Clock, Users, ArrowRight, Map, UserPlus, Award } from 'lucide-react';
import { sounds } from '../utils/audio';

interface FacultyHomeViewProps {
  user: UserProfile;
  events: CampusEvent[];
  onNavigateTab: (tab: 'home' | 'map' | 'events' | 'resources' | 'rewards' | 'impact') => void;
  onOpenCreateActivity: () => void;
  onOpenAI: () => void;
  onApproveStudentAction: (studentName: string, actionDesc: string) => void;
}

export const FacultyHomeView: React.FC<FacultyHomeViewProps> = ({
  user,
  events,
  onNavigateTab,
  onOpenCreateActivity,
  onOpenAI,
  onApproveStudentAction,
}) => {
  const [studentRoster, setStudentRoster] = useState([
    { id: 'st-1', name: 'Liam K.', role: 'Sophomore — CSE', task: '15-min Solar Inverter Telemetry Log', approved: false },
    { id: 'st-2', name: 'Maya S.', role: 'Junior — Environmental', task: 'Native Shrub Census & Soil Test', approved: false },
    { id: 'st-3', name: 'Devon R.', role: 'Senior — Mechanical', task: 'Cafeteria Compost Sieve Analysis', approved: true },
    { id: 'st-4', name: 'Chloe T.', role: 'Freshman — Biology', task: 'Campus Monarch Waystation Census', approved: false },
  ]);

  const handleApprove = (id: string, name: string, task: string) => {
    sounds.playSuccess();
    setStudentRoster((prev) =>
      prev.map((s) => (s.id === id ? { ...s, approved: true } : s))
    );
    onApproveStudentAction(name, task);
  };

  return (
    <div className="p-3.5 sm:p-4 space-y-4 overflow-y-auto">
      {/* Faculty Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-4 rounded-3xl flex justify-between items-center border border-emerald-800/40 shadow-lg">
        <div>
          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30 uppercase tracking-wider">
            Faculty & Curriculum Portal
          </span>
          <h2 className="text-lg font-black mt-1 text-white">Good Morning, {user.name}</h2>
          <p className="text-xs text-slate-300">Dept. of {user.department}</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black text-slate-950 text-sm shadow-md">
          DS
        </div>
      </div>

      {/* 4 Action Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => {
            sounds.playClick();
            onNavigateTab('resources');
          }}
          className="bg-cyan-600 hover:bg-cyan-700 text-white p-3.5 rounded-2xl text-left flex flex-col justify-between h-24 sm:h-28 shadow-sm transition active:scale-98"
        >
          <BookOpen className="w-5 h-5 text-cyan-200" />
          <div>
            <p className="font-bold text-xs sm:text-sm">Resource Library</p>
            <p className="text-[10px] text-cyan-100">Upload & Share Guides</p>
          </div>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenCreateActivity();
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-2xl text-left flex flex-col justify-between h-24 sm:h-28 shadow-sm border-2 border-emerald-300/60 transition active:scale-98"
        >
          <PlusCircle className="w-5 h-5 text-emerald-200" />
          <div>
            <p className="font-black text-xs sm:text-sm">+ Create Activity</p>
            <p className="text-[10px] text-emerald-100">Publish New Drive</p>
          </div>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onNavigateTab('map');
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3.5 rounded-2xl text-left flex flex-col justify-between h-24 sm:h-28 shadow-sm transition active:scale-98"
        >
          <Map className="w-5 h-5 text-indigo-200" />
          <div>
            <p className="font-bold text-xs sm:text-sm">Campus Eco Map</p>
            <p className="text-[10px] text-indigo-100">Station Status & Sensors</p>
          </div>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenAI();
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3.5 rounded-2xl text-left flex flex-col justify-between h-24 sm:h-28 shadow-sm transition active:scale-98"
        >
          <Sparkles className="w-5 h-5 text-purple-200" />
          <div>
            <p className="font-bold text-xs sm:text-sm">AI Assistant</p>
            <p className="text-[10px] text-purple-100">Syllabus & SDG Bot</p>
          </div>
        </button>
      </div>

      {/* Active Curricula Integration */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Curriculum Sustainability Modules
          </h3>
          <span className="text-[10px] font-bold text-emerald-700">Fall 2026</span>
        </div>

        <div className="space-y-2">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                  Clean Energy
                </span>
                <span className="text-[10px] text-slate-400">• ENVS-304</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mt-1">Solar Microgrid Lab Audit</h4>
              <p className="text-[10px] text-slate-500">38 Students Enrolled • Engineering Lab 4</p>
            </div>
            <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
              +60 Pts
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded">
                  Biodiversity
                </span>
                <span className="text-[10px] text-slate-400">• BIO-201</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mt-1">Campus Flora & Fauna Census</h4>
              <p className="text-[10px] text-slate-500">42 Students Enrolled • Botanical Reserve</p>
            </div>
            <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
              +45 Pts
            </span>
          </div>
        </div>
      </div>

      {/* Student Field Verification Queue */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Student Field Submissions Verification
          </h3>
          <span className="text-[10px] text-slate-400 font-bold">
            {studentRoster.filter((s) => !s.approved).length} Pending
          </span>
        </div>

        <div className="space-y-2">
          {studentRoster.map((student) => (
            <div
              key={student.id}
              className={`p-3 rounded-2xl border shadow-sm flex items-center justify-between transition ${
                student.approved
                  ? 'bg-slate-50/80 border-slate-200 opacity-75'
                  : 'bg-white border-emerald-300'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">{student.name}</span>
                  <span className="text-[9px] text-slate-400">• {student.role}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">{student.task}</p>
              </div>

              {student.approved ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-xl flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified (+40)</span>
                </span>
              ) : (
                <button
                  onClick={() => handleApprove(student.id, student.name, student.task)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] px-3 py-1.5 rounded-xl shadow transition active:scale-95"
                >
                  Approve (+40 Pts)
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

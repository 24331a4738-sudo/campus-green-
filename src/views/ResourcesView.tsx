import React, { useState } from 'react';
import { ResourceItem, ResourceType } from '../types';
import { BookOpen, Download, Bookmark, CheckCircle2, Play, FileText, Search, ExternalLink, X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ResourcesViewProps {
  resources: ResourceItem[];
  onToggleBookmark: (id: string) => void;
  onToggleCompleted: (id: string) => void;
  onDownloadResource: (title: string) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  resources,
  onToggleBookmark,
  onToggleCompleted,
  onDownloadResource,
}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [activePreview, setActivePreview] = useState<ResourceItem | null>(null);

  const filtered = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.author.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'ALL' || r.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-3.5 sm:p-4 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="pt-1">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Resource Library</h2>
        <p className="text-xs text-slate-500 font-medium">
          Authoritative guides, circular economy lectures & waste manuals
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search guides, research, authors..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar text-xs">
        {['ALL', 'PDF', 'VIDEO', 'GUIDE', 'ARTICLE'].map((t) => (
          <button
            key={t}
            onClick={() => {
              sounds.playClick();
              setSelectedType(t);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              selectedType === t
                ? 'bg-slate-900 text-emerald-300 shadow'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t === 'ALL' ? 'All Types' : t}
          </button>
        ))}
      </div>

      {/* Resource Cards */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm hover:border-emerald-300 transition"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase ${
                    item.type === 'VIDEO'
                      ? 'bg-blue-100 text-blue-800'
                      : item.type === 'PDF'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {item.type}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">• {item.category}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    sounds.playClick();
                    onToggleBookmark(item.id);
                  }}
                  className={`p-1.5 rounded-lg transition ${
                    item.bookmarked
                      ? 'text-amber-500 hover:text-amber-600'
                      : 'text-slate-300 hover:text-slate-500'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className={`w-4 h-4 ${item.bookmarked ? 'fill-amber-500' : ''}`} />
                </button>
              </div>
            </div>

            <h3 className="font-extrabold text-sm text-slate-900 leading-snug mb-1">
              {item.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium mb-3">
              {item.description}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <div>
                <span className="font-bold text-slate-700">{item.author}</span>
                {item.fileSizeMb && <span className="ml-1.5">• {item.fileSizeMb} MB</span>}
                {item.durationMin && <span className="ml-1.5">• {item.durationMin} mins</span>}
              </div>

              <div className="flex items-center gap-1.5">
                {/* View / Play preview */}
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActivePreview(item);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 transition"
                >
                  {item.type === 'VIDEO' ? <Play className="w-3.5 h-3.5 text-blue-600" /> : <FileText className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{item.type === 'VIDEO' ? 'Watch' : 'Read'}</span>
                </button>

                {/* Download */}
                <button
                  onClick={() => {
                    sounds.playClick();
                    onDownloadResource(item.title);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 transition shadow-sm"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reader / Video Modal Preview */}
      {activePreview && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-sm rounded-3xl p-5 shadow-2xl relative">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-3">
              <div>
                <span className="text-[9px] uppercase font-bold text-emerald-400">
                  {activePreview.type} Document Preview
                </span>
                <h3 className="font-extrabold text-sm text-white">{activePreview.title}</h3>
              </div>
              <button
                onClick={() => setActivePreview(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activePreview.type === 'VIDEO' ? (
              <div className="h-44 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden mb-3">
                <div className="w-14 h-14 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xl mb-2">
                  <Play className="w-6 h-6 fill-blue-400 text-blue-400" />
                </div>
                <p className="text-xs font-bold text-white">Streaming Video Lecture</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Author: {activePreview.author}</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-blue-500 h-full w-1/3 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="h-44 bg-slate-950 rounded-2xl border border-slate-800 p-3.5 text-xs text-slate-300 overflow-y-auto mb-3 font-serif leading-relaxed">
                <p className="font-bold text-emerald-400 mb-1">
                  Executive Summary — UN Campus Sustainability
                </p>
                <p className="text-[11px] text-slate-400 mb-2">{activePreview.description}</p>
                <p className="text-[11px]">
                  "Institutions must transition from passive waste disposal toward circular material loops. By standardizing organic composting protocols across student unions and providing verified smart recycling depots, campus carbon outputs drop significantly..."
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sounds.playPointsChime();
                  onToggleCompleted(activePreview.id);
                  setActivePreview(null);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 shadow"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Finished (+20)</span>
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onDownloadResource(activePreview.title);
                  setActivePreview(null);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 border border-slate-700"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

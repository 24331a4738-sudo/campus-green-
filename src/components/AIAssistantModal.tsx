import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, RefreshCw, Volume2, VolumeX, Copy, Trash2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  sdgReferences?: string[];
  timestamp: string;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, role }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-01',
      sender: 'bot',
      text: `Hello! I am your Campus Green AI sustainability advisor. Ask me anything about waste sorting protocols, SDG curriculum integration, tree plantation drives, or how to maximize your eco-points balance!`,
      sdgReferences: ['SDG 12: Responsible Consumption', 'SDG 13: Climate Action'],
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Clean up speech synthesis on close
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[•*#]/g, ''));
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard?.writeText(text);
    sounds.playClick();
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    sounds.playClick();
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend, role }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: data.answer || 'Thank you for your question.',
          sdgReferences: data.sdgReferences || ['SDG 12: Responsible Consumption', 'SDG 13: Climate Action'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        sounds.playSuccess();
      } else {
        throw new Error('Server returned error status');
      }
    } catch {
      // Robust client fallback
      let fallbackText = "Campus Green connects campus behaviors to UN Sustainable Development Goals (SDG 12 & SDG 13). Blue bins accept clean plastics/paper; Green bins accept cafeteria organic compost; Yellow stations handle e-waste.";
      const lower = textToSend.toLowerCase();
      if (lower.includes('recycle') || lower.includes('bin') || lower.includes('waste')) {
        fallbackText = "Campus Recycling Protocols:\n• Blue Bins: Clean plastics (PET 1, HDPE 2) & dry paper.\n• Green Bins: Strictly food leftovers, fruit rinds & compostable cafeteria napkins.\n• Yellow Stations: E-waste, batteries & charging cables at the Library quad.";
      } else if (lower.includes('faculty') || lower.includes('curriculum') || lower.includes('syllabus')) {
        fallbackText = "Faculty Recommendation: Incorporate a 15-minute campus biodiversity audit or solar energy efficiency challenge into your lab assessments.";
      } else if (lower.includes('points') || lower.includes('earn')) {
        fallbackText = "Earn Eco-Points by participating in plantation drives (+50 Pts), scanning solar bin stations (+50 Pts), taking weekly Eco Quizzes (+50 Pts), and logging voice reports (+25 Pts). Redeem for reusable flasks and coffee passes in the store!";
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: fallbackText,
        sdgReferences: ['SDG 12: Responsible Consumption', 'SDG 13: Climate Action'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'How do I sort campus cafeteria waste?',
    'Faculty idea: how to add SDGs to syllabus?',
    'What rewards can I redeem with eco-points?',
    'Explain UN SDG 12 vs SDG 13 on campus',
    'How does campus solar microgrid work?',
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-sm rounded-3xl p-4 shadow-2xl flex flex-col h-[520px] relative">
        {/* Header */}
        <div className="flex justify-between items-center pb-2.5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-4 h-4 animate-spin [animation-duration:6s]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white">Campus Green AI</h3>
                <span className="bg-purple-950 text-purple-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-purple-700/50">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Voice-ready UN SDG Sustainability Advisor</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: `bot-${Date.now()}`,
                    sender: 'bot',
                    text: 'Chat history cleared. How can I help you today?',
                    timestamp: 'Just now',
                  },
                ]);
                sounds.playClick();
              }}
              className="text-slate-400 hover:text-rose-400 p-1 rounded-lg transition"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                }
                sounds.playClick();
                onClose();
              }}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[90%] leading-relaxed relative group ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-sm shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-sm'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {m.sdgReferences && m.sdgReferences.length > 0 && (
                  <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex flex-wrap gap-1">
                    {m.sdgReferences.map((sdg, i) => (
                      <span
                        key={i}
                        className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-semibold px-1.5 py-0.2 rounded"
                      >
                        {sdg}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bot Message Action Buttons (Read Aloud & Copy) */}
                {m.sender === 'bot' && (
                  <div className="flex items-center gap-2 mt-2 pt-1 border-t border-slate-800/60 text-slate-400">
                    <button
                      onClick={() => speakText(m.text)}
                      className="hover:text-purple-400 flex items-center gap-1 text-[10px]"
                      title="Read aloud"
                    >
                      {isSpeaking ? <VolumeX className="w-3 h-3 text-purple-400" /> : <Volume2 className="w-3 h-3" />}
                      <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
                    </button>
                    <button
                      onClick={() => copyText(m.text)}
                      className="hover:text-slate-200 flex items-center gap-1 text-[10px]"
                      title="Copy response"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-950 p-2.5 rounded-2xl w-fit border border-slate-800">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>Thinking with Gemini...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt suggestion pills */}
        <div className="flex gap-1.5 overflow-x-auto py-1.5 no-scrollbar shrink-0 border-t border-slate-800/60">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={isLoading}
              className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition active:scale-95 shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="pt-2 flex gap-1.5 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about waste, curriculum, points..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

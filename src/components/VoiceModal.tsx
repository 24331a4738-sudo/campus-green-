import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, X, Send, MapPin, Tag, Flame, Camera, Play, Square, Image as ImageIcon } from 'lucide-react';
import { ReportPriority } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: {
    location: string;
    category: string;
    description: string;
    priority: ReportPriority;
    voiceTranscript: string;
    audioUrl?: string;
    photoUrl?: string;
  }) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose, onSubmitReport }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [location, setLocation] = useState('Block C Cafeteria');
  const [category, setCategory] = useState('Waste Management');
  const [priority, setPriority] = useState<ReportPriority>('HIGH');
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);

  // Audio recording state
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Photo attachment
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'en-US';

          rec.onresult = (event: any) => {
            let fullText = '';
            for (let i = 0; i < event.results.length; i++) {
              fullText += event.results[i][0].transcript + ' ';
            }
            setTranscript(fullText.trim());
          };

          rec.onend = () => {
            setIsRecording(false);
          };

          rec.onerror = () => {
            setIsRecording(false);
          };

          recognitionRef.current = rec;
        } catch {
          setHasSpeechSupport(false);
        }
      } else {
        setHasSpeechSupport(false);
      }
    }
  }, []);

  if (!isOpen) return null;

  const startMediaRecording = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(audioUrl);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
      }
    } catch {
      // Audio capture fallback
    }
  };

  const stopMediaRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const toggleRecording = () => {
    sounds.playClick();
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      stopMediaRecording();
      setIsRecording(false);
    } else {
      setTranscript('');
      setRecordedAudioUrl(null);
      setIsRecording(true);
      startMediaRecording();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          simulateVoiceInput();
        }
      } else {
        simulateVoiceInput();
      }
    }
  };

  const simulateVoiceInput = () => {
    const samples = [
      'Compost Bin 04 near cafeteria dish return is 85% full and needs immediate clearing before lunch rush.',
      'Sprinkler sensor on North Quad lawn is stuck spraying water during rain, causing unnecessary water waste.',
      'Solar station inverter #3 is displaying a flashing red fault code on the quad walkway.',
      'E-waste dropoff box at Library entrance is full and needs secondary collection bin.',
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    setTimeout(() => {
      setTranscript(picked);
      setIsRecording(false);
      sounds.playSuccess();
    }, 2800);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        sounds.playClick();
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleAudioPlayback = () => {
    if (!recordedAudioUrl) return;
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio(recordedAudioUrl);
      audioPlayerRef.current.onended = () => setIsPlayingAudio(false);
    }

    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleSubmit = () => {
    if (!transcript.trim()) {
      sounds.playClick();
      return;
    }
    sounds.playPointsChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#f59e0b'],
    });

    onSubmitReport({
      location,
      category,
      description: transcript,
      priority,
      voiceTranscript: transcript,
      audioUrl: recordedAudioUrl || undefined,
      photoUrl: photoUrl || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-sm rounded-3xl p-4 sm:p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Voice Issue Dispatcher</h3>
              <p className="text-[10px] text-slate-400">Speak campus issue & dispatch staff</p>
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

        {/* Recording Visualizer Button */}
        <div className="flex flex-col items-center py-3 bg-slate-950/70 rounded-2xl border border-slate-800/80 my-2">
          <button
            onClick={toggleRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-xl active:scale-95 ${
              isRecording
                ? 'bg-rose-600 ring-8 ring-rose-500/30 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 ring-4 ring-emerald-500/20'
            }`}
          >
            {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>

          <p className="text-xs font-bold text-slate-200 mt-2.5">
            {isRecording ? 'Listening... Speak campus issue' : 'Tap mic to record voice memo'}
          </p>
          <p className="text-[10px] text-emerald-400 font-medium">
            Earns +25 Eco-Points upon submission
          </p>

          {/* Sound waves animation while recording */}
          {isRecording && (
            <div className="flex items-center gap-1 mt-2.5">
              <span className="w-1.5 h-4 bg-rose-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-7 bg-rose-500 rounded-full animate-bounce [animation-delay:0.1s]"></span>
              <span className="w-1.5 h-9 bg-rose-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-6 bg-rose-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
              <span className="w-1.5 h-3 bg-rose-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          )}

          {/* Playback test if audio recorded */}
          {recordedAudioUrl && !isRecording && (
            <button
              onClick={toggleAudioPlayback}
              className="mt-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border border-slate-700"
            >
              {isPlayingAudio ? <Square className="w-3 h-3 fill-emerald-300" /> : <Play className="w-3 h-3 fill-emerald-300" />}
              <span>{isPlayingAudio ? 'Stop Preview' : 'Play Voice Memo'}</span>
            </button>
          )}
        </div>

        {/* Transcript Box */}
        <div className="mb-2.5">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1">
            <span>Audio Transcript</span>
            <button
              onClick={simulateVoiceInput}
              className="text-emerald-400 hover:underline text-[9px] font-semibold"
            >
              Use Sample Text
            </button>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Audio transcription will render here in real time. You can also edit it..."
            rows={2}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2 text-xs text-emerald-300 font-mono placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
          />
        </div>

        {/* Location & Category Selectors */}
        <div className="grid grid-cols-2 gap-2 mb-2.5">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
              <MapPin className="w-3 h-3 text-slate-400" /> Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Block C Cafeteria">Block C Cafeteria</option>
              <option value="North Quad Gardens">North Quad Gardens</option>
              <option value="Library Annex">Library Annex</option>
              <option value="Engineering Lab 4">Engineering Lab 4</option>
              <option value="Science Complex B">Science Complex B</option>
              <option value="Student Union Plaza">Student Union Plaza</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
              <Tag className="w-3 h-3 text-slate-400" /> Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Waste Management">Waste Management</option>
              <option value="Water Conservation">Water Conservation</option>
              <option value="Energy & Solar">Energy & Solar</option>
              <option value="E-Waste">E-Waste</option>
              <option value="Landscaping">Landscaping & Trees</option>
            </select>
          </div>
        </div>

        {/* Priority Selector & Photo Upload */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
              <Flame className="w-3 h-3 text-amber-400" /> Priority Level
            </label>
            <div className="grid grid-cols-2 gap-1">
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as ReportPriority[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setPriority(lvl);
                  }}
                  className={`py-1 rounded-lg text-[9px] font-black transition border ${
                    priority === lvl
                      ? lvl === 'CRITICAL'
                        ? 'bg-red-600 text-white border-red-500'
                        : lvl === 'HIGH'
                        ? 'bg-amber-600 text-white border-amber-500'
                        : 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
              <Camera className="w-3 h-3 text-slate-400" /> Attach Photo
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            {photoUrl ? (
              <div className="relative rounded-xl overflow-hidden h-14 border border-emerald-500/50">
                <img src={photoUrl} alt="Attached" className="w-full h-full object-cover" />
                <button
                  onClick={() => setPhotoUrl(null)}
                  className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 text-[10px]"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-14 bg-slate-950 hover:bg-slate-800 border border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-[10px] text-slate-400 transition"
              >
                <ImageIcon className="w-4 h-4 mb-0.5 text-slate-500" />
                <span>Add Photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Submit Action */}
        <button
          onClick={handleSubmit}
          disabled={!transcript.trim()}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black py-2.5 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-lg transition active:scale-95"
        >
          <Send className="w-4 h-4" />
          <span>Dispatch Report (+25 Pts)</span>
        </button>
      </div>
    </div>
  );
};

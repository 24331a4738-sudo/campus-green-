import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../data/initialData';
import { HelpCircle, CheckCircle2, XCircle, Award, ArrowRight, X, RotateCcw, Filter, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface EcoQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteQuiz: (pointsEarned: number) => void;
}

export const EcoQuizModal: React.FC<EcoQuizModalProps> = ({ isOpen, onClose, onCompleteQuiz }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const startQuiz = () => {
    sounds.playClick();
    let pool = QUIZ_QUESTIONS;
    if (selectedCategory !== 'ALL') {
      pool = pool.filter((q) => q.category === selectedCategory);
    }
    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, questionCount);
    setActiveQuestions(shuffled.length > 0 ? shuffled : QUIZ_QUESTIONS.slice(0, questionCount));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setIsStarted(true);
  };

  const currentQ = activeQuestions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      sounds.playSuccess();
      setScore((s) => s + 1);
    } else {
      sounds.playClick();
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      sounds.playPointsChime();
      const points = 50 + score * 5; // Base 50 + 5 per correct
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
      });
      onCompleteQuiz(points);
    }
  };

  const handleRestart = () => {
    sounds.playClick();
    setIsStarted(false);
    setIsFinished(false);
  };

  const categories = ['ALL', 'Waste & Composting', 'Clean Energy', 'Biodiversity', 'Circular Economy'];

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-sm rounded-3xl p-4 sm:p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Campus Eco Quiz Hub</h3>
              <p className="text-[10px] text-slate-400">Earn up to +75 Eco-Points per round</p>
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

        {!isStarted ? (
          /* Pre-Quiz Setup Screen */
          <div className="space-y-4 py-2">
            <div className="bg-gradient-to-br from-amber-500/20 to-emerald-500/20 p-4 rounded-2xl border border-amber-500/30 text-center">
              <span className="text-3xl">🧠</span>
              <h4 className="font-black text-sm text-white mt-1">Sustainability Knowledge Challenge</h4>
              <p className="text-xs text-slate-300 mt-1">
                Select your focus domain and test your understanding of campus recycling, microgrids, and UN SDGs.
              </p>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                Quiz Domain
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedCategory(cat);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                      selectedCategory === cat
                        ? 'bg-emerald-500 text-slate-950 font-black shadow'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                Length
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 8].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      sounds.playClick();
                      setQuestionCount(n);
                    }}
                    className={`py-1.5 rounded-xl text-xs font-bold transition ${
                      questionCount === n
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-950 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {n} Questions
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black py-3 rounded-2xl shadow-xl transition active:scale-95 text-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>START QUIZ CHALLENGE</span>
            </button>
          </div>
        ) : !isFinished && currentQ ? (
          <div>
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5">
              <span>Question {currentIndex + 1} of {activeQuestions.length}</span>
              <span className="text-emerald-400">{currentQ.sdgTag}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
              <div
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <h4 className="text-xs sm:text-sm font-bold text-white mb-3 leading-snug">
              {currentQ.question}
            </h4>

            {/* Options */}
            <div className="space-y-2 mb-3">
              {currentQ.options.map((opt, idx) => {
                const isCorrect = idx === currentQ.correctIndex;
                const isSelected = idx === selectedOption;

                let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/80';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-2.5 rounded-2xl border text-xs font-medium flex items-center justify-between transition-all ${btnStyle}`}
                  >
                    <span className="flex-1">{opt}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {isAnswered && (
              <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-2xl text-[11px] text-slate-300 mb-3 animate-in fade-in">
                <span className="font-bold text-emerald-400">Sustainability Fact: </span>
                {currentQ.explanation}
              </div>
            )}

            {/* Next / Submit Button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black py-2.5 rounded-2xl flex items-center justify-center gap-1.5 text-xs shadow-lg transition active:scale-95"
              >
                <span>{currentIndex < activeQuestions.length - 1 ? 'Next Question' : 'Complete Quiz & Claim Points'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          /* Finished State */
          <div className="text-center py-3">
            <div className="w-14 h-14 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-3xl mx-auto mb-2 shadow-lg">
              🎉
            </div>
            <h4 className="text-base font-black text-white mb-0.5">Quiz Completed!</h4>
            <p className="text-xs text-slate-400 mb-3">
              You got <span className="text-emerald-400 font-bold">{score} of {activeQuestions.length}</span> correct answers.
            </p>

            <div className="bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-800/80 p-3 rounded-2xl mb-4 text-center">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-300">
                Eco Points Awarded
              </span>
              <p className="text-2xl font-black text-amber-400 my-0.5">
                +{50 + score * 5} Eco-Points
              </p>
              <p className="text-[10px] text-slate-400">Credited to your balance</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleRestart}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 rounded-2xl flex items-center justify-center gap-1 border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black py-2.5 rounded-2xl shadow transition"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

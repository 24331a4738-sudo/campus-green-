import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../data/initialData';
import { HelpCircle, CheckCircle2, XCircle, Award, ArrowRight, X, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface EcoQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteQuiz: (pointsEarned: number) => void;
}

export const EcoQuizModal: React.FC<EcoQuizModalProps> = ({ isOpen, onClose, onCompleteQuiz }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex];

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
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      sounds.playPointsChime();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
      });
      onCompleteQuiz(50);
    }
  };

  const handleRestart = () => {
    sounds.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-sm rounded-3xl p-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Campus Eco Quiz</h3>
              <p className="text-[10px] text-slate-400">Test knowledge & earn +50 Eco-Points</p>
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

        {!isFinished ? (
          <div>
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5">
              <span>Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}</span>
              <span className="text-emerald-400">{currentQ.sdgTag}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
              <div
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <h4 className="text-sm font-bold text-white mb-4 leading-snug">
              {currentQ.question}
            </h4>

            {/* Options */}
            <div className="space-y-2 mb-4">
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
                    className={`w-full text-left p-3 rounded-2xl border text-xs font-medium flex items-center justify-between transition-all ${btnStyle}`}
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
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl text-[11px] text-slate-300 mb-4 animate-in fade-in">
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
                <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Complete Quiz & Claim +50 Pts'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          /* Finished State */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">
              🎉
            </div>
            <h4 className="text-lg font-black text-white mb-1">Quiz Completed!</h4>
            <p className="text-xs text-slate-400 mb-3">
              You scored <span className="text-emerald-400 font-bold">{score} / {QUIZ_QUESTIONS.length}</span> correct answers.
            </p>

            <div className="bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-800/80 p-3.5 rounded-2xl mb-4 text-center">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-300">
                Reward Granted
              </span>
              <p className="text-2xl font-black text-amber-400 my-0.5">+50 Eco-Points</p>
              <p className="text-[10px] text-slate-400">Added directly to your balance</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleRestart}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 rounded-2xl flex items-center justify-center gap-1 border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
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

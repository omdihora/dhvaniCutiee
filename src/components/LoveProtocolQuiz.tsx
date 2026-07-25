import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { StarEasterEgg } from './StarEasterEgg';

interface QuizQuestion {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  wrongOption?: 'A' | 'B';
  cuteErrorTitle?: string;
  cuteErrorMessage?: string;
  correctedAnswer?: string;
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Are you ready to spend the next two minutes with your favorite developer?",
    optionA: "Maybe Later ⌛",
    optionB: "Absolutely Yes ❤️",
    wrongOption: 'A',
    cuteErrorTitle: "Delay Exception ⚠️",
    cuteErrorMessage: "Delay request rejected! Om is way too excited to wait for you ❤️",
    correctedAnswer: "Absolutely Yes ❤️",
  },
  {
    id: 2,
    question: "Who is the cutest IT guy you've ever met?",
    optionA: "Sundar Pichai 💼",
    optionB: "Om ❤️",
    wrongOption: 'A',
    cuteErrorTitle: "403 Forbidden 🔒",
    cuteErrorMessage: "Google's CEO is great, but Om is the CEO of your heart ❤️",
    correctedAnswer: "Om ❤️",
  },
  {
    id: 3,
    question: "If happiness had a username, what would it be?",
    optionA: "@GuestUser_123 👤",
    optionB: "@Om ❤️",
    wrongOption: 'A',
    cuteErrorTitle: "Invalid Username ❌",
    cuteErrorMessage: "Guest accounts disabled! Correct handle is @Om ❤️",
    correctedAnswer: "@Om ❤️",
  },
  {
    id: 4,
    question: "What is your favorite programming language?",
    optionA: "Python 🐍",
    optionB: "Om ❤️",
    wrongOption: 'A',
    cuteErrorTitle: "Syntax Error ❌",
    cuteErrorMessage: "Python is cool, but Om is cooler! Correct Answer: Om ❤️",
    correctedAnswer: "Om ❤️",
  },
  {
    id: 5,
    question: "Who makes your heart compile successfully every day?",
    optionA: "A Cup of Coffee ☕",
    optionB: "Om ❤️",
    wrongOption: 'A',
    cuteErrorTitle: "Runtime Warning ☕",
    cuteErrorMessage: "Coffee gives energy, but only Om makes your heart compile ❤️",
    correctedAnswer: "Om ❤️",
  },
  {
    id: 6,
    question: "If life throws bugs at us, who should we debug them with?",
    optionA: "ChatGPT 🤖",
    optionB: "Together Forever ❤️",
    wrongOption: 'A',
    cuteErrorTitle: "AI Offline 🤖",
    cuteErrorMessage: "AI can't debug love! Only Om + Dhvani together ❤️",
    correctedAnswer: "Together Forever ❤️",
  },
  {
    id: 7,
    question: "Who deserves unlimited hugs 24/7?",
    optionA: "A Teddy Bear 🧸",
    optionB: "My Favorite Human Om ❤️",
    wrongOption: 'A',
    cuteErrorTitle: "Insufficient Warmth 🧸",
    cuteErrorMessage: "Teddy bears are cute, but Om gives real warm hugs ❤️",
    correctedAnswer: "My Favorite Human Om ❤️",
  },
  {
    id: 8,
    question: "If your heart had only one permanent notification, who would it be?",
    optionA: "System Update Available 📲",
    optionB: "Always Om ❤️",
    wrongOption: 'A',
    cuteErrorTitle: "Notification Blocked 🚫",
    cuteErrorMessage: "System updates paused! Permanent notification: Om ❤️",
    correctedAnswer: "Always Om ❤️",
  },
  {
    id: 9,
    question: "Would you like Lifetime Premium Access to this Developer?",
    optionA: "Free Trial Mode ⏳",
    optionB: "Install Forever ❤️",
    wrongOption: 'A',
    cuteErrorTitle: "Trial Upgrade Required 🚀",
    cuteErrorMessage: "Free trials expired! Automatically upgrading you to Lifetime Premium ❤️",
    correctedAnswer: "Install Forever ❤️",
  },
  {
    id: 10,
    question: "If I could pause one moment forever, it would be every moment with...",
    optionA: "A Pizza Slice 🍕",
    optionB: "You ❤️",
    wrongOption: 'A',
    cuteErrorTitle: "Hunger Alert 🍕",
    cuteErrorMessage: "Pizza is delicious, but every moment with you is priceless ❤️",
    correctedAnswer: "You ❤️",
  },
  {
    id: 11,
    question: "Should we keep creating beautiful memories together?",
    optionA: "Definitely ❤️",
    optionB: "Forever ❤️",
  },
];

interface LoveProtocolQuizProps {
  onQuizComplete: () => void;
}

export const LoveProtocolQuiz: React.FC<LoveProtocolQuizProps> = ({ onQuizComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedQuestion, setTypedQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [activeErrorModal, setActiveErrorModal] = useState<{
    title: string;
    message: string;
    corrected: string;
  } | null>(null);
  const [heartBurst, setHeartBurst] = useState<{ id: number; x: number; y: number }[]>([]);

  const currentQ = QUESTIONS[currentIndex];

  useEffect(() => {
    setTypedQuestion('');
    setIsTyping(true);
    let i = 0;
    const targetText = currentQ.question;

    const interval = setInterval(() => {
      if (i <= targetText.length) {
        setTypedQuestion(targetText.slice(0, i));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [currentIndex, currentQ]);

  const handleAnswerSelect = (
    optionLetter: 'A' | 'B',
    _optionText: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX || rect.left + rect.width / 2;
    const clickY = e.clientY || rect.top + rect.height / 2;

    const newHearts = Array.from({ length: 6 }).map((_, idx) => ({
      id: Date.now() + idx,
      x: clickX + (Math.random() * 40 - 20),
      y: clickY + (Math.random() * 40 - 20),
    }));
    setHeartBurst((prev) => [...prev, ...newHearts]);

    if (currentQ.wrongOption === optionLetter) {
      soundEngine.playErrorSound();
      setActiveErrorModal({
        title: currentQ.cuteErrorTitle || "Cute System Exception ⚠️",
        message: currentQ.cuteErrorMessage || "Oops! That's not quite right ❤️",
        corrected: currentQ.correctedAnswer || "Om ❤️",
      });

      setTimeout(() => {
        setActiveErrorModal(null);
        soundEngine.playHeartPop();
        advanceNext();
      }, 2400);
      return;
    }

    soundEngine.playHeartPop();
    advanceNext();
  };

  const advanceNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      soundEngine.playCelebration();
      onQuizComplete();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative z-10 my-auto">
      <StarEasterEgg message="You're my favorite notification ❤️" top="15%" left="12%" />
      <StarEasterEgg message="Handcrafted with love ❤️" bottom="18%" right="12%" />

      {heartBurst.map((h) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 1, scale: 0.5, y: 0 }}
          animate={{ opacity: 0, scale: 1.8, y: -60 }}
          transition={{ duration: 0.8 }}
          onAnimationComplete={() => {
            setHeartBurst((prev) => prev.filter((item) => item.id !== h.id));
          }}
          style={{ left: h.x, top: h.y }}
          className="fixed pointer-events-none z-50 text-rose-400 text-xl font-bold"
        >
          ❤️
        </motion.div>
      ))}

      {/* Main Glass Card */}
      <div className="w-full max-w-2xl glass-card-apple rounded-[36px] p-6 sm:p-10 border border-white/20 shadow-[0_20px_80px_rgba(236,72,153,0.25)] relative overflow-hidden">
        {/* Header Ribbon */}
        <div className="mb-6 flex justify-between items-center text-xs font-code text-pink-200">
          <span className="flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-4 h-4 text-pink-300" />
            PAGE 11 // LOVE_PROTOCOL_QUIZ ({currentIndex + 1}/{QUESTIONS.length})
          </span>
          <span className="text-pink-300 font-bold">
            {Math.round(((currentIndex + 1) / QUESTIONS.length) * 100)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-black/25 rounded-full overflow-hidden p-0.5 border border-white/15 mb-8">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400 rounded-full shadow-[0_0_12px_rgba(248,200,220,0.8)]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Question Text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            className="min-h-[140px] flex flex-col justify-center mb-8 text-center"
          >
            <div className="inline-flex items-center justify-center gap-2 text-xs font-code text-pink-300/80 mb-3 uppercase tracking-wider font-bold">
              <span>QUESTION #{currentQ.id}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-snug tracking-tight">
              {typedQuestion}
              {isTyping && <span className="inline-block w-2.5 h-6 bg-pink-300 animate-pulse ml-1 align-middle" />}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Answer Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => handleAnswerSelect('A', currentQ.optionA, e)}
            className="relative overflow-hidden glass-button-romantic py-4 px-6 rounded-full text-white font-medium text-base sm:text-lg flex items-center justify-center gap-3 border border-white/20 group"
          >
            <span className="relative z-10 group-hover:scale-105 transition-transform">
              {currentQ.optionA}
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => handleAnswerSelect('B', currentQ.optionB, e)}
            className="relative overflow-hidden glass-button-romantic py-4 px-6 rounded-full text-white font-medium text-base sm:text-lg flex items-center justify-center gap-3 border border-white/20 group"
          >
            <span className="relative z-10 group-hover:scale-105 transition-transform">
              {currentQ.optionB}
            </span>
          </motion.button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs font-code text-pink-200/70 flex items-center justify-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>All paths lead straight to love</span>
        </div>
      </div>

      {/* Cute Error Correction Modal */}
      <AnimatePresence>
        {activeErrorModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl"
          >
            <div className="glass-card-apple bg-[#1f0727]/95 border-2 border-pink-300/50 rounded-[32px] p-8 max-w-md text-center shadow-[0_20px_80px_rgba(244,63,94,0.6)] space-y-4 animate-shake">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center mx-auto text-rose-300">
                <AlertTriangle className="w-8 h-8 animate-bounce" />
              </div>

              <h3 className="text-2xl font-bold font-code text-pink-300 tracking-wide glow-text-blush">
                {activeErrorModal.title}
              </h3>

              <p className="text-base text-slate-100 font-medium leading-relaxed">
                {activeErrorModal.message}
              </p>

              <div className="pt-2 text-sm font-code text-pink-200 font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Auto-correcting to: {activeErrorModal.corrected}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

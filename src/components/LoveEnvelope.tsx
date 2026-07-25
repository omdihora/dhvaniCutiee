import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface LoveEnvelopeProps {
  onNext?: () => void;
}

export const LoveEnvelope: React.FC<LoveEnvelopeProps> = ({ onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    soundEngine.playWhoosh();

    setTimeout(() => {
      setShowLetter(true);
      soundEngine.playHeartPop();
    }, 800);
  };

  const handleNextPage = () => {
    soundEngine.playPageSwitch();
    if (onNext) onNext();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative my-auto">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-pink-100 text-xs font-code mb-4 shadow-sm">
          <Mail className="w-3.5 h-3.5 text-pink-300" />
          <span>PAGE 4 // INBOX // 1 UNREAD LETTER</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-200 via-rose-200 to-purple-200 bg-clip-text text-transparent">
          You Have One Unread Message
        </h2>
        {!isOpen && (
          <p className="text-pink-200/70 text-sm mt-2 font-code">
            Tap the wax seal to break open the 3D envelope ✨
          </p>
        )}
      </motion.div>

      {/* Envelope Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="envelope-container cursor-pointer relative z-10"
        onClick={handleOpen}
      >
        <div className={`relative ${!isOpen ? 'envelope-float' : ''}`}>
          {/* Envelope Body */}
          <div className="relative w-72 sm:w-96 h-48 sm:h-56">
            {/* Bottom of envelope */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a1040] to-[#1a0828] rounded-2xl border border-pink-300/40 shadow-[0_20px_60px_rgba(236,72,153,0.3)] overflow-hidden">
              {/* Inner pattern */}
              <div className="absolute inset-2 rounded-xl border border-pink-400/10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(236,72,153,0.03)_10px,rgba(236,72,153,0.03)_20px)]" />

              {/* Wax Seal */}
              {!isOpen && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 border-2 border-pink-300/60 flex items-center justify-center z-20 shadow-[0_0_25px_rgba(244,63,94,0.8)]"
                >
                  <Heart className="w-8 h-8 text-white fill-white" />
                </motion.div>
              )}
            </div>

            {/* Envelope Flap (triangular top) */}
            <motion.div
              animate={isOpen ? { rotateX: -180 } : { rotateX: 0 }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
              className="absolute -top-0 left-0 right-0 h-28 sm:h-32 z-10"
            >
              {/* Front face of flap */}
              <div
                className="absolute inset-0"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <svg viewBox="0 0 384 128" className="w-full h-full">
                  <path
                    d="M0,0 L192,110 L384,0 L384,0 L0,0 Z"
                    fill="url(#flapGradient)"
                    stroke="rgba(236,72,153,0.3)"
                    strokeWidth="1"
                  />
                  <defs>
                    <linearGradient id="flapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2d1248" />
                      <stop offset="100%" stopColor="#1f0a35" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {/* Back face of flap */}
              <div
                className="absolute inset-0"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
              >
                <svg viewBox="0 0 384 128" className="w-full h-full">
                  <path
                    d="M0,0 L192,110 L384,0 L384,0 L0,0 Z"
                    fill="#1a0828"
                    stroke="rgba(236,72,153,0.2)"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Letter Content — revealed after opening */}
      <AnimatePresence>
        {showLetter && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 w-full max-w-lg glass-card-apple rounded-[32px] p-8 sm:p-10 border border-pink-300/30 shadow-[0_20px_80px_rgba(236,72,153,0.3)] relative overflow-hidden z-20"
          >
            <div className="text-center space-y-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                className="text-4xl"
              >
                💌
              </motion.div>

              <h3 className="font-cursive text-3xl sm:text-4xl text-pink-200 font-bold">
                Dear Dhvani,
              </h3>

              <div className="space-y-4 text-slate-100/90 text-base sm:text-lg leading-relaxed font-light">
                <p>
                  If I could write a letter for every thought I've ever had about you, I would run out of paper in the entire world.
                </p>
                <p>
                  Every line of code I write, every late night I stay up debugging — you are the reason behind my smile through all of it.
                </p>
                <p className="text-pink-200/90 italic">
                  You are not just my favorite person. You are my favorite <span className="font-code text-amber-200 font-normal">everything</span>.
                </p>
              </div>

              <p className="font-cursive text-2xl sm:text-3xl text-rose-300 pt-2 font-semibold">
                Forever & Always, Om ❤️
              </p>

              {onNext && (
                <div className="pt-6 border-t border-pink-300/20 flex justify-center">
                  <button
                    onClick={handleNextPage}
                    className="glass-button-romantic px-7 py-3.5 rounded-full text-white font-medium text-base flex items-center gap-3 shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>Proceed to Blooming Rose</span>
                    <ArrowRight className="w-4 h-4 text-pink-300" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, ShieldCheck, Lock, Sparkles, RefreshCw, Code, ArrowLeft } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { StarEasterEgg } from './StarEasterEgg';

interface GrandFinaleProps {
  onRestart: () => void;
  onOpenGallery?: () => void;
}

export const GrandFinale: React.FC<GrandFinaleProps> = ({ onRestart, onOpenGallery }) => {
  useEffect(() => {
    soundEngine.playCelebration();

    const count = 240;
    const defaults = {
      origin: { y: 0.65 },
      colors: ['#fadadd', '#f8c8dc', '#ec4899', '#f43f5e', '#a855f7', '#fbbf24', '#ffffff'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    const interval = setInterval(() => {
      confetti({
        particleCount: 16,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fadadd', '#f8c8dc', '#c084fc'],
      });
      confetti({
        particleCount: 16,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fadadd', '#f8c8dc', '#c084fc'],
      });
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const handleReplay = () => {
    soundEngine.playPageSwitch();
    onRestart();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 relative z-10 text-center py-12 my-auto">
      {/* Floating Easter Egg Stars */}
      <StarEasterEgg message="You're my favorite person in the universe ❤️" top="15%" left="10%" />
      <StarEasterEgg message="Forever & Always ❤️" top="20%" right="12%" />
      <StarEasterEgg message="Handcrafted with love by Om ❤️" bottom="22%" left="14%" />
      <StarEasterEgg message="No Disconnect Button Found ❤️" bottom="24%" right="15%" />

      {/* Giant Pulsing Heart in Center */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="absolute w-80 h-80 bg-pink-400/25 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute w-52 h-52 bg-rose-400/35 rounded-full blur-2xl animate-ping opacity-30" />

        <motion.div
          animate={{ scale: [1, 1.18, 1, 1.14, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="relative text-8xl sm:text-9xl drop-shadow-[0_0_50px_rgba(244,63,94,0.8)] cursor-pointer"
          onClick={() => {
            soundEngine.playHeartPop();
            confetti({ particleCount: 45, spread: 85 });
          }}
        >
          ❤️
        </motion.div>
      </div>

      {/* Main Glass Card */}
      <div className="w-full max-w-xl glass-card-apple rounded-[36px] p-8 sm:p-10 border border-white/20 shadow-[0_20px_90px_rgba(236,72,153,0.3)] space-y-6">
        <div className="space-y-2.5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-pink-100 text-xs font-code mb-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>PAGE 13 // GRAND_FINALE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight glow-text-blush flex items-center justify-center gap-2 flex-wrap"
          >
            <span>Relationship Status: Connected Successfully</span>
            <span className="text-rose-400">❤️</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-pink-200/90 text-sm sm:text-base font-code flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-pink-300" />
            <span>No Disconnect Button Found.</span>
          </motion.p>
        </div>

        {/* System Badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-code"
        >
          <span className="px-4 py-1.5 rounded-full glass-pill border border-pink-300/30 text-pink-100 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Version: RelationshipOS vForever
          </span>
          <span className="px-4 py-1.5 rounded-full glass-pill border border-purple-300/30 text-purple-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Uptime: Infinity Days
          </span>
        </motion.div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          {onOpenGallery && (
            <button
              onClick={() => {
                soundEngine.playPageSwitch();
                onOpenGallery();
              }}
              className="w-full sm:w-auto glass-button-romantic py-3.5 px-6 rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all"
            >
              <span>🖼️</span>
              <span>Visit Our Memory Gallery</span>
            </button>
          )}

          <button
            onClick={() => {
              soundEngine.playHeartPop();
              confetti({ particleCount: 75, spread: 100 });
            }}
            className="w-full sm:w-auto glass-pill hover:bg-white/15 py-3.5 px-5 rounded-full text-white text-sm font-medium flex items-center justify-center gap-2 border border-white/20 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Fireworks</span>
          </button>

          <button
            onClick={handleReplay}
            className="w-full sm:w-auto glass-pill hover:bg-white/15 py-3.5 px-5 rounded-full text-pink-100 text-sm font-code flex items-center justify-center gap-2 border border-white/20 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4 text-pink-300" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs font-code text-pink-200/70 space-y-1.5">
        <p className="flex items-center justify-center gap-1.5">
          <Code className="w-3.5 h-3.5 text-pink-300" />
          <span>Handcrafted with ❤️ by Om for Dhvani.</span>
        </p>
        <p className="text-slate-400/50 text-[10px]">
          © {new Date().getFullYear()} RelationshipOS Kernel // Made exclusively for Dhvani
        </p>
      </footer>
    </div>
  );
};

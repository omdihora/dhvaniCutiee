import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Play, Ribbon, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { StarEasterEgg } from './StarEasterEgg';

interface HeroWelcomeProps {
  onStartQuiz: () => void;
}

export const HeroWelcome: React.FC<HeroWelcomeProps> = ({ onStartQuiz }) => {
  const handleClickStart = () => {
    soundEngine.playPageSwitch();
    onStartQuiz();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative z-10 my-auto">
      {/* Floating Interactive Star Easter Eggs */}
      <StarEasterEgg message="I miss you every single day ❤️" top="18%" left="12%" />
      <StarEasterEgg message="You're my favorite notification ❤️" top="22%" right="12%" />
      <StarEasterEgg message="Handcrafted with love by Om ❤️" bottom="22%" left="14%" />
      <StarEasterEgg message="My favorite bug is falling for you ❤️" bottom="24%" right="14%" />

      {/* Main Apple Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl glass-card-apple rounded-[36px] p-8 sm:p-12 text-center border border-white/20 shadow-[0_20px_80px_rgba(236,72,153,0.25)] relative overflow-hidden group"
      >
        {/* Background Glowing Ambient Orbs */}
        <div className="absolute -top-28 -left-28 w-72 h-72 bg-pink-400/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-pink-400/30 transition-all duration-700" />
        <div className="absolute -bottom-28 -right-28 w-72 h-72 bg-purple-400/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-400/30 transition-all duration-700" />

        {/* Pinterest Ribbon Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-pink-100 text-xs font-code mb-6 shadow-sm"
        >
          <Ribbon className="w-3.5 h-3.5 text-pink-300" />
          <span>PAGE 3 // DHVANI_LOVE_OS_v3.0</span>
        </motion.div>

        {/* Large Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-pink-200 via-rose-200 to-purple-200 bg-clip-text text-transparent drop-shadow-sm flex items-center justify-center gap-3 flex-wrap"
        >
          <span>Welcome Dhvani</span>
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="inline-block text-rose-400 text-4xl sm:text-6xl drop-shadow-[0_0_20px_rgba(244,63,94,0.7)]"
          >
            ❤️
          </motion.span>
        </motion.h1>

        {/* Romantic Subtitle Text */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="text-base sm:text-xl text-slate-100/90 leading-relaxed max-w-xl mx-auto mb-10 font-sans font-light"
        >
          This experience wasn't written with just <span className="font-code text-pink-200 font-normal">HTML</span>,{' '}
          <span className="font-code text-purple-200 font-normal">CSS</span>, and{' '}
          <span className="font-code text-amber-200 font-normal">TypeScript</span>...
          <br className="hidden sm:block" />
          It was handcrafted with <span className="text-pink-200 font-medium underline decoration-pink-300/60 underline-offset-4">countless thoughts about you.</span>
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex justify-center"
        >
          <button
            onClick={handleClickStart}
            className="relative group/btn overflow-hidden rounded-full p-0.5 font-semibold text-base sm:text-lg transition-all duration-300 active:scale-95 shadow-[0_0_40px_rgba(236,72,153,0.4)] hover:shadow-[0_0_60px_rgba(236,72,153,0.7)]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400 rounded-full animate-pulse-glow" />

            <span className="relative px-9 py-4 rounded-full bg-[#160a24] text-white flex items-center gap-3 transition-all duration-300 group-hover/btn:bg-transparent group-hover/btn:text-white">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="tracking-wide font-medium">Open Unread Love Letter</span>
              <ArrowRight className="w-5 h-5 text-pink-300 group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </button>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-10 flex items-center justify-center gap-2 text-xs font-code text-pink-200/70"
        >
          <Heart className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>Status: 100% Compatible with Om</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

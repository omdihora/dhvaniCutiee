import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ShieldCheck, Lock, Sparkles, RefreshCw, Code } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { StarEasterEgg } from './StarEasterEgg';

interface GrandFinaleProps {
  onRestart: () => void;
  onOpenGallery?: () => void;
}

const FINALE_LETTER_SENTENCES = [
  "From the moment our eyes first met, my world changed forever.",
  "Every milestone, every quiet laugh, and every gentle touch has built a life more beautiful than any dream.",
  "No matter how far apart we may physically be, my soul is always at home right beside you.",
  "I choose you today, tomorrow, and for every lifetime to come.",
];

export const GrandFinale: React.FC<GrandFinaleProps> = ({ onRestart, onOpenGallery }) => {
  const [visibleSentenceIndex, setVisibleSentenceIndex] = useState(0);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  useEffect(() => {
    soundEngine.playCelebration();

    const count = 240;
    const defaults = {
      origin: { y: 0.65 },
      colors: ['#f7e7ce', '#fadadd', '#f8c8dc', '#ec4899', '#d4af37', '#e5c158', '#ffffff'],
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
        colors: ['#f7e7ce', '#fadadd', '#d4af37'],
      });
      confetti({
        particleCount: 16,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f7e7ce', '#fadadd', '#d4af37'],
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Reveal sentence by sentence
  useEffect(() => {
    if (visibleSentenceIndex < FINALE_LETTER_SENTENCES.length) {
      const timer = setTimeout(() => {
        setVisibleSentenceIndex((prev) => prev + 1);
        soundEngine.playClick();
      }, 2200);
      return () => clearTimeout(timer);
    } else {
      const heartTimer = setTimeout(() => {
        setShowHeartAnimation(true);
      }, 1500);
      return () => clearTimeout(heartTimer);
    }
  }, [visibleSentenceIndex]);

  const handleReplay = () => {
    soundEngine.playPageSwitch();
    onRestart();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 relative z-10 text-center py-12 my-auto bg-gradient-to-b from-[#0f051d] via-[#2d0a10] to-[#5c1325]/90">
      {/* Sunset Glow Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#f7e7ce]/10 via-[#d4af37]/5 to-transparent pointer-events-none" />

      {/* Floating Easter Egg Stars */}
      <StarEasterEgg message="You're my favorite person in the universe ❤️" top="15%" left="10%" />
      <StarEasterEgg message="Forever & Always ❤️" top="20%" right="12%" />
      <StarEasterEgg message="Handcrafted with love by Om ❤️" bottom="22%" left="14%" />
      <StarEasterEgg message="No Disconnect Button Found ❤️" bottom="24%" right="15%" />

      {/* Floating Upward Petals & Butterflies */}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={`finale-petal-${i}`}
          animate={{
            y: ['100vh', '-20vh'],
            x: [0, (i % 2 === 0 ? 50 : -50)],
            rotate: [0, 360],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 14 + (i % 4) * 3,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.8,
          }}
          className="absolute z-0 text-xl sm:text-2xl pointer-events-none filter drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]"
          style={{ left: `${(i * 5) % 95}%` }}
        >
          🌸
        </motion.div>
      ))}

      {/* Movie-Ending Featured Couple Photo with Glowing Frame */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute w-80 h-80 bg-[#d4af37]/25 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute w-60 h-60 bg-[#fadadd]/30 rounded-full blur-2xl animate-ping opacity-30" />

        {/* Photo inside Crystal Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, type: 'spring' }}
          className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden glass-card-luxury border-4 border-[#f7e7ce]/60 shadow-[0_0_80px_rgba(212,175,55,0.4)] cursor-pointer group"
          onClick={() => {
            soundEngine.playHeartPop();
            confetti({ particleCount: 50, spread: 90 });
          }}
        >
          <img
            src="/gallery/photo6.jpg"
            alt="Om & Dhvani Forever"
            className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700"
          />

          {/* Giant Animated Glowing Heart Overlay */}
          {showHeartAnimation && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0.8, 1.15, 1], opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs"
            >
              <span className="text-7xl sm:text-9xl filter drop-shadow-[0_0_40px_rgba(212,175,55,0.9)] animate-pulse">
                ❤️
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Main Glass Card with Sentence-by-Sentence Handwritten Message */}
      <div className="w-full max-w-xl glass-card-luxury rounded-[36px] p-8 sm:p-10 border-2 border-[#f7e7ce]/40 shadow-[0_20px_90px_rgba(212,175,55,0.3)] space-y-6">
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-[#f7e7ce] text-xs font-mono mb-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>CHAPTER 22 // GRAND_FINALE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white tracking-tight glow-text-gold flex items-center justify-center gap-2 flex-wrap"
          >
            <span>Relationship Status: Connected Forever</span>
            <span className="text-rose-400">❤️</span>
          </motion.h2>

          {/* Sentence by Sentence Handwritten Letter */}
          <div className="space-y-3 pt-2 text-left sm:text-center min-h-[140px]">
            {FINALE_LETTER_SENTENCES.slice(0, visibleSentenceIndex).map((sent, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="font-handwritten text-xl sm:text-2xl text-[#f7e7ce] leading-relaxed"
              >
                "{sent}"
              </motion.p>
            ))}

            {visibleSentenceIndex >= FINALE_LETTER_SENTENCES.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="pt-4 text-center"
              >
                <span className="font-serif-luxury text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f7e7ce] via-[#d4af37] to-[#fadadd]">
                  "With all my love, Om ❤️"
                </span>
                <p className="font-serif-luxury text-lg text-pink-100/90 mt-2 italic">
                  Forever Starts Every Time I Choose You.
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* System Badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono"
        >
          <span className="px-4 py-1.5 rounded-full glass-pill border border-[#f7e7ce]/30 text-[#f7e7ce] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Version: RelationshipOS vForever
          </span>
          <span className="px-4 py-1.5 rounded-full glass-pill border border-[#f7e7ce]/30 text-[#f7e7ce] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
            No Disconnect Button Found
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
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b76e79] text-[#0f051d] text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all font-serif-luxury cursor-pointer"
            >
              <span>🖼️</span>
              <span>Visit Our Memory Gallery</span>
            </button>
          )}

          <button
            onClick={() => {
              soundEngine.playHeartPop();
              confetti({ particleCount: 85, spread: 110 });
            }}
            className="w-full sm:w-auto glass-pill hover:bg-white/15 py-3.5 px-5 rounded-full text-white text-sm font-medium flex items-center justify-center gap-2 border border-[#f7e7ce]/30 active:scale-95 font-serif-luxury cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#e5c158]" />
            <span>Fireworks</span>
          </button>

          <button
            onClick={handleReplay}
            className="w-full sm:w-auto glass-pill hover:bg-white/15 py-3.5 px-5 rounded-full text-[#f7e7ce] text-sm font-mono flex items-center justify-center gap-2 border border-[#f7e7ce]/30 transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#d4af37]" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs font-mono text-pink-200/70 space-y-1.5">
        <p className="flex items-center justify-center gap-1.5">
          <Code className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Handcrafted with ❤️ by Om for Dhvani.</span>
        </p>
        <p className="text-slate-400/50 text-[10px]">
          © {new Date().getFullYear()} RelationshipOS Kernel // Made exclusively for Dhvani
        </p>
      </footer>
    </div>
  );
};

export default GrandFinale;

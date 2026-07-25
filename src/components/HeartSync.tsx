import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HeartSyncProps {
  onNext?: () => void;
}

export const HeartSync: React.FC<HeartSyncProps> = ({ onNext }) => {
  const [tapCount, setTapCount] = useState(0);
  const [isSynced, setIsSynced] = useState(false);
  const [pulseRings, setPulseRings] = useState<{ id: number }[]>([]);
  const [bpm, setBpm] = useState(60);

  const maxTaps = 10;

  const handleTap = () => {
    if (isSynced) return;

    const next = tapCount + 1;
    setTapCount(next);
    soundEngine.playHeartbeat();

    setPulseRings(prev => [...prev, { id: Date.now() }]);

    setBpm(Math.min(180, 60 + next * 12));

    if (next >= maxTaps) {
      setIsSynced(true);
      soundEngine.playCelebration();

      confetti({
        particleCount: 220,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#ec4899', '#f43f5e', '#fbbf24', '#a855f7', '#ffffff'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.4, x: 0.3 },
          colors: ['#fadadd', '#f8c8dc', '#ffd6e8'],
        });
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.4, x: 0.7 },
          colors: ['#fadadd', '#f8c8dc', '#ffd6e8'],
        });
      }, 400);
    }
  };

  const handleNextPage = () => {
    soundEngine.playPageSwitch();
    if (onNext) onNext();
  };

  const heartScale = 1 + (tapCount / maxTaps) * 0.5;
  const glowIntensity = 20 + (tapCount / maxTaps) * 60;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative my-auto">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-pink-100 text-xs font-code mb-4 shadow-sm">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>PAGE 7 // HEART_SYNC_CHAMBER</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-rose-200 via-pink-200 to-red-200 bg-clip-text text-transparent">
          Heartbeat Synchronization
        </h2>
        {!isSynced && (
          <p className="text-pink-200/80 text-sm mt-2 font-code">
            Tap the beating heart to sync our rhythm • {tapCount}/{maxTaps}
          </p>
        )}
      </motion.div>

      {/* Pulsing Heart Container */}
      <div className="relative flex items-center justify-center mb-6 my-4">
        <AnimatePresence>
          {pulseRings.slice(-5).map((ring) => (
            <motion.div
              key={ring.id}
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              onAnimationComplete={() => {
                setPulseRings(prev => prev.filter(r => r.id !== ring.id));
              }}
              className="absolute w-36 h-36 rounded-full border-2 border-rose-400/50 pointer-events-none"
            />
          ))}
        </AnimatePresence>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 60 / bpm,
          }}
          className="absolute w-52 h-52 rounded-full blur-[40px] pointer-events-none"
          style={{
            background: `rgba(244, 63, 94, ${0.25 + tapCount * 0.04})`,
          }}
        />

        <motion.button
          animate={{
            scale: isSynced
              ? [heartScale, heartScale * 1.08, heartScale, heartScale * 1.06, heartScale]
              : [heartScale, heartScale * 1.12, heartScale, heartScale * 1.08, heartScale],
          }}
          transition={{
            repeat: Infinity,
            duration: 60 / bpm,
            ease: 'easeInOut',
          }}
          onClick={handleTap}
          className="relative text-7xl sm:text-9xl cursor-pointer select-none z-10 active:scale-90 transition-transform"
          style={{
            filter: `drop-shadow(0 0 ${glowIntensity}px rgba(244,63,94,0.85))`,
          }}
          disabled={isSynced}
        >
          ❤️
        </motion.button>
      </div>

      {/* Live BPM Counter Badge */}
      {!isSynced && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-pill px-6 py-3 border border-pink-300/30 flex items-center gap-4 mb-6 z-10"
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ repeat: Infinity, duration: 60 / bpm }}
              className="w-3.5 h-3.5 rounded-full bg-rose-400"
            />
            <span className="text-sm font-code text-pink-200">HEART_BPM</span>
          </div>
          <span className="text-2xl font-bold text-white font-code">{bpm}</span>
          <div className="h-6 w-px bg-pink-300/20" />
          <span className="text-xs font-code text-pink-300/80 font-medium">
            {tapCount < 3 ? 'Warming up...' : tapCount < 7 ? 'Getting stronger...' : tapCount < 10 ? 'Almost synchronized!' : 'SYNCED!'}
          </span>
        </motion.div>
      )}

      {/* Sync Complete Card */}
      <AnimatePresence>
        {isSynced && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card-apple rounded-[28px] p-6 sm:p-8 text-center max-w-md border border-rose-300/40 shadow-[0_20px_80px_rgba(244,63,94,0.4)] z-20"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-xs font-code text-emerald-300 font-bold">SYNC_COMPLETE ✓</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white glow-text-blush leading-relaxed">
              Heart Sync Complete
            </p>
            <p className="text-xl sm:text-2xl font-cursive text-pink-200 mt-2 font-bold">
              Dhvani ❤️ Om
            </p>
            <p className="text-xs font-code text-pink-300/70 mt-3">
              // Two hearts, one frequency — forever synchronized
            </p>

            {onNext && (
              <div className="pt-6 mt-4 border-t border-rose-300/20 flex justify-center">
                <button
                  onClick={handleNextPage}
                  className="glass-button-romantic px-7 py-3.5 rounded-full text-white font-medium text-base flex items-center gap-3 shadow-[0_0_30px_rgba(244,63,94,0.5)] hover:scale-105 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Proceed to Our Story Timeline</span>
                  <ArrowRight className="w-4 h-4 text-rose-300" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

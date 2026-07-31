import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Shield, Zap, Heart, Star } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface LoveDNAScannerProps {
  onNext?: () => void;
}

interface TraitResult {
  name: string;
  icon: string;
  value: number;
  label: string;
  color: string;
  glowColor: string;
}

const DNA_TRAITS: TraitResult[] = [
  { name: 'Kindness Level', icon: '💛', value: 100, label: '∞ INFINITE', color: 'from-amber-400 to-yellow-300', glowColor: 'rgba(245,158,11,0.5)' },
  { name: 'Smile Radiance', icon: '😊', value: 100, label: '∞ BLINDING', color: 'from-pink-400 to-rose-300', glowColor: 'rgba(244,114,182,0.5)' },
  { name: 'Laughter Frequency', icon: '😂', value: 100, label: '∞ CONTAGIOUS', color: 'from-purple-400 to-violet-300', glowColor: 'rgba(168,85,247,0.5)' },
  { name: 'Heart Compatibility', icon: '❤️', value: 100, label: '∞ PERFECT', color: 'from-rose-500 to-pink-400', glowColor: 'rgba(244,63,94,0.5)' },
  { name: 'Cuteness Factor', icon: '🥰', value: 100, label: '∞ OFF THE CHARTS', color: 'from-pink-300 to-fuchsia-300', glowColor: 'rgba(236,72,153,0.5)' },
  { name: 'Huggability Index', icon: '🤗', value: 100, label: '∞ MAXIMUM', color: 'from-emerald-400 to-teal-300', glowColor: 'rgba(52,211,153,0.5)' },
];

export const LoveDNAScanner: React.FC<LoveDNAScannerProps> = ({ onNext }) => {
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'analyzing' | 'result'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [currentTraitIndex, setCurrentTraitIndex] = useState(-1);
  const [traitProgresses, setTraitProgresses] = useState<number[]>(DNA_TRAITS.map(() => 0));
  const [scanLineY, setScanLineY] = useState(0);

  // Auto-start scanning
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('scanning');
      soundEngine.playClick();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Scanning phase - progress bar
  useEffect(() => {
    if (phase !== 'scanning') return;
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.8;
      setScanProgress(Math.min(100, Math.floor(progress)));
      setScanLineY((progress * 3) % 300);
      if (progress >= 100) {
        clearInterval(interval);
        soundEngine.playSuccess();
        setTimeout(() => setPhase('analyzing'), 500);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [phase]);

  // Analyzing phase - reveal traits one by one
  useEffect(() => {
    if (phase !== 'analyzing') return;

    let traitIdx = 0;
    const revealNext = () => {
      if (traitIdx >= DNA_TRAITS.length) {
        setTimeout(() => {
          setPhase('result');
          soundEngine.playHeartPop();
        }, 800);
        return;
      }

      setCurrentTraitIndex(traitIdx);
      soundEngine.playClick();

      // Animate the progress bar for this trait
      let progress = 0;
      const barInterval = setInterval(() => {
        progress += 3;
        setTraitProgresses((prev) => {
          const next = [...prev];
          next[traitIdx] = Math.min(100, progress);
          return next;
        });
        if (progress >= 100) {
          clearInterval(barInterval);
          traitIdx++;
          setTimeout(revealNext, 400);
        }
      }, 20);
    };

    setTimeout(revealNext, 600);
  }, [phase]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative my-auto">
      {/* DNA Helix Background Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(i) * 15, 0],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{ repeat: Infinity, duration: 3 + i * 0.4, delay: i * 0.2 }}
            className="absolute w-3 h-3 rounded-full bg-purple-400/20 blur-sm"
            style={{
              top: `${(i * 8 + 5) % 90}%`,
              left: `${i % 2 === 0 ? 15 + Math.sin(i) * 10 : 75 + Math.cos(i) * 10}%`,
            }}
          />
        ))}
      </div>

      {/* Section Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-pink-100 text-xs font-code mb-4">
          <Shield className="w-3.5 h-3.5 text-emerald-300" />
          <span>LOVE DNA ANALYSIS MODULE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-200 via-pink-200 to-rose-200 bg-clip-text text-transparent">
          Love DNA Scanner
        </h2>
        <p className="text-purple-200/60 text-sm mt-2">Analyzing subject: <span className="text-pink-300 font-semibold">Dhvani</span></p>
      </motion.div>

      {/* Main Scanner Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-2xl z-10 glass-card-apple rounded-[32px] p-6 sm:p-8 border border-purple-500/20 shadow-[0_20px_60px_rgba(168,85,247,0.2)] relative overflow-hidden"
      >
        {/* Animated Scan Line */}
        {phase === 'scanning' && (
          <motion.div
            animate={{ top: [0, '100%', 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent z-20 shadow-[0_0_20px_rgba(52,211,153,0.8)]"
          />
        )}

        <AnimatePresence mode="wait">
          {/* IDLE / SCANNING Phase */}
          {(phase === 'idle' || phase === 'scanning') && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-8 space-y-6"
            >
              {/* Holographic Avatar Circle */}
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                  className="w-32 h-32 rounded-full border-2 border-dashed border-purple-400/40"
                />
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-5xl">
                  🧬
                </div>
                {phase === 'scanning' && (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 rounded-full border-2 border-emerald-400/50"
                  />
                )}
              </div>

              <div className="text-center">
                <p className="text-sm font-code text-emerald-300">
                  {phase === 'idle' ? 'Initializing Scanner...' : `Scanning DNA... ${scanProgress}%`}
                </p>
                {phase === 'scanning' && (
                  <div className="mt-3 w-64 h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_10px_rgba(52,211,153,0.6)]"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ANALYZING Phase - Trait Bars */}
          {phase === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 py-4"
            >
              <div className="text-center mb-6">
                <p className="text-xs font-code text-purple-300 tracking-widest">ANALYZING LOVE COMPATIBILITY TRAITS</p>
              </div>

              {DNA_TRAITS.map((trait, idx) => (
                <motion.div
                  key={trait.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: idx <= currentTraitIndex ? 1 : 0.3,
                    x: idx <= currentTraitIndex ? 0 : -20,
                  }}
                  transition={{ duration: 0.4 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-white font-medium">
                      <span>{trait.icon}</span>
                      <span>{trait.name}</span>
                    </span>
                    <span className="text-xs font-code text-pink-300">
                      {idx <= currentTraitIndex && traitProgresses[idx] >= 100
                        ? trait.label
                        : `${traitProgresses[idx]}%`}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${trait.color} transition-all duration-100`}
                      style={{
                        width: `${traitProgresses[idx]}%`,
                        boxShadow: traitProgresses[idx] > 50 ? `0 0 12px ${trait.glowColor}` : 'none',
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* RESULT Phase */}
          {phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center py-8 space-y-6"
            >
              {/* Match Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
                className="relative"
              >
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border-2 border-emerald-400/60 flex items-center justify-center shadow-[0_0_50px_rgba(52,211,153,0.4)]">
                  <span className="text-5xl">✅</span>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-full border-2 border-emerald-400/30"
                />
              </motion.div>

              <div className="text-center space-y-2">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs font-code text-emerald-300 tracking-widest uppercase"
                >
                  DNA Analysis Complete
                </motion.p>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl sm:text-4xl font-extrabold text-white"
                >
                  Perfect Match Found ❤️
                </motion.h3>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="glass-card bg-pink-500/10 border border-pink-400/30 rounded-2xl p-4 mt-4 shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                >
                  <p className="text-xs font-code text-pink-300 mb-1">MATCH_SUBJECT</p>
                  <p className="text-3xl sm:text-4xl font-extrabold text-pink-200 glow-text-pink">
                    Dhvani
                  </p>
                  <p className="text-xs font-code text-emerald-300 mt-2 flex items-center justify-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Compatibility: 100% — Soulmate Level
                  </p>
                </motion.div>
              </div>

              {/* Trait Summary Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex flex-wrap justify-center gap-2 pt-2"
              >
                {DNA_TRAITS.map((trait) => (
                  <span
                    key={trait.name}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-pink-200 flex items-center gap-1.5"
                  >
                    <span>{trait.icon}</span>
                    <span>{trait.name}: ∞</span>
                  </span>
                ))}
              </motion.div>

              {/* Continue Button */}
              {onNext && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 }}
                  className="pt-4"
                >
                  <button
                    onClick={() => {
                      soundEngine.playPageSwitch();
                      onNext();
                    }}
                    className="glass-button-romantic px-8 py-3.5 rounded-full text-white font-medium text-base flex items-center gap-3 shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>View Love Commit History</span>
                    <ArrowRight className="w-4 h-4 text-pink-300" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoveDNAScanner;

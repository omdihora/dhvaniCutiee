import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Terminal, Heart, X, Code2, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';

interface EasterEggsModalProps {
  isOpenHint: boolean;
  onCloseHint: () => void;
}

export const EasterEggsModal: React.FC<EasterEggsModalProps> = ({ isOpenHint, onCloseHint }) => {
  const [typedKeys, setTypedKeys] = useState<string>('');
  const [konamiProgress, setKonamiProgress] = useState<number>(0);
  const [activeTrigger, setActiveTrigger] = useState<'DHVANI' | 'KONAMI' | null>(null);
  const [heartRainDrops, setHeartRainDrops] = useState<{ id: number; x: number; delay: number; size: number }[]>([]);

  const konamiSequence = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];

  useEffect(() => {
    let currentKonamiIdx = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. "DHVANI" listener
      const char = e.key.toUpperCase();
      if (/^[A-Z]$/.test(char)) {
        setTypedKeys((prev) => {
          const updated = (prev + char).slice(-10);
          if (updated.endsWith('DHVANI')) {
            triggerDhvaniSecret();
            return '';
          }
          return updated;
        });
      }

      // 2. Konami Code listener
      const key = e.key;
      if (key.toLowerCase() === konamiSequence[currentKonamiIdx].toLowerCase()) {
        currentKonamiIdx++;
        setKonamiProgress(currentKonamiIdx);
        if (currentKonamiIdx === konamiSequence.length) {
          triggerKonamiSecret();
          currentKonamiIdx = 0;
          setKonamiProgress(0);
        }
      } else {
        currentKonamiIdx = 0;
        setKonamiProgress(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerDhvaniSecret = () => {
    soundEngine.playCelebration();
    setActiveTrigger('DHVANI');

    // Massive confetti
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#ec4899', '#f43f5e', '#a855f7', '#fbbf24', '#ffffff'],
    });

    // Spawn floating heart particles across the screen
    const drops = Array.from({ length: 40 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      size: Math.random() * 20 + 14,
    }));
    setHeartRainDrops(drops);

    setTimeout(() => setHeartRainDrops([]), 5000);
  };

  const triggerKonamiSecret = () => {
    soundEngine.playCelebration();
    setActiveTrigger('KONAMI');

    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.3 },
      colors: ['#22c55e', '#ec4899', '#3b82f6', '#fbbf24'],
    });

    // Heart rain effect
    const drops = Array.from({ length: 50 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 24 + 12,
    }));
    setHeartRainDrops(drops);

    setTimeout(() => setHeartRainDrops([]), 6000);
  };

  return (
    <>
      {/* Heart Rain Overlay */}
      {heartRainDrops.length > 0 && (
        <div className="fixed inset-0 z-[55] pointer-events-none overflow-hidden">
          {heartRainDrops.map((drop) => (
            <div
              key={drop.id}
              className="absolute heart-rain-particle"
              style={{
                left: `${drop.x}%`,
                top: '-20px',
                fontSize: `${drop.size}px`,
                animationDelay: `${drop.delay}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              ❤️
            </div>
          ))}
        </div>
      )}

      {/* 1. Interactive Trigger Modals */}
      <AnimatePresence>
        {activeTrigger && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={() => setActiveTrigger(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="glass-card bg-[#14061f]/95 border-2 border-pink-500/50 rounded-3xl p-8 max-w-lg text-center shadow-[0_0_80px_rgba(236,72,153,0.5)] space-y-6 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveTrigger(null)}
                className="absolute top-4 right-4 text-pink-300/60 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              {activeTrigger === 'DHVANI' ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center mx-auto text-4xl animate-bounce">
                    💖
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-3xl font-extrabold text-white glow-text-pink">
                      Secret Unlocked ❤️
                    </h3>
                    <p className="text-xl text-pink-200 font-medium">
                      You're My Favorite Person
                    </p>
                    <p className="text-base text-pink-100/70 font-light mt-2">
                      Every time you type my name, my heart skips a beat. Even digitally. ❤️
                    </p>
                  </div>

                  <p className="text-xs font-code text-pink-300/60 border-t border-pink-500/20 pt-4">
                    // Triggered by typing "DHVANI" anywhere on screen
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <Terminal className="w-10 h-10 animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-3xl font-extrabold text-emerald-400 font-code tracking-wide">
                      Developer Mode ❤️
                    </h3>
                    <p className="text-lg text-slate-100 font-medium">
                      Unlimited Love & Debugging Mode Granted!
                    </p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl text-left text-xs font-code text-emerald-300 space-y-1">
                    <div>$ system.setLoveLevel(INFINITY);</div>
                    <div>$ system.setDisagreements(0);</div>
                    <div>$ heartRain.activate() // ❤️ raining across screen</div>
                    <div>$ status: "PERFECT_MATCH";</div>
                  </div>

                  <p className="text-xs font-code text-slate-400 border-t border-white/10 pt-4">
                    // Triggered by Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Secret Hints Drawer Modal */}
      <AnimatePresence>
        {isOpenHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={onCloseHint}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card bg-[#14061d]/95 border border-pink-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_60px_rgba(236,72,153,0.3)] space-y-5 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-pink-500/20 pb-4">
                <div className="flex items-center gap-2 text-pink-300 font-semibold text-lg">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Hidden Easter Eggs</span>
                </div>
                <button
                  onClick={onCloseHint}
                  className="text-pink-300/60 hover:text-white p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-slate-200">
                <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-start gap-3">
                  <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-pink-200">Secret Word</div>
                    <div className="text-xs text-slate-300 font-code">
                      Type <span className="text-amber-300 font-bold">"DHVANI"</span> on your keyboard anytime!
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                  <Code2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-emerald-200">Konami Code</div>
                    <div className="text-xs text-slate-300 font-code">
                      Press <span className="text-emerald-300 font-bold">↑ ↑ ↓ ↓ ← → ← → B A</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-3">
                  <Star className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-purple-200">Hovering Stars</div>
                    <div className="text-xs text-slate-300">
                      Hover over glowing stars to discover sweet messages!
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-rose-200">Hidden Heart</div>
                    <div className="text-xs text-slate-300">
                      A tiny glowing heart is hidden somewhere on the page... can you find it? 💕
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center text-xs font-code text-pink-300/60">
                RelationshipOS v2.0 // Made for Dhvani
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

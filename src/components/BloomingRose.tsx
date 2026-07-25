import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

const PETAL_LAYERS = [
  [
    { rotate: 0, scale: 0.4, x: 0, y: -8 },
    { rotate: 72, scale: 0.4, x: 8, y: -3 },
    { rotate: 144, scale: 0.4, x: 5, y: 6 },
    { rotate: 216, scale: 0.4, x: -5, y: 6 },
    { rotate: 288, scale: 0.4, x: -8, y: -3 },
  ],
  [
    { rotate: 36, scale: 0.6, x: 0, y: -18 },
    { rotate: 108, scale: 0.6, x: 17, y: -6 },
    { rotate: 180, scale: 0.6, x: 10, y: 14 },
    { rotate: 252, scale: 0.6, x: -10, y: 14 },
    { rotate: 324, scale: 0.6, x: -17, y: -6 },
  ],
  [
    { rotate: 15, scale: 0.8, x: 5, y: -28 },
    { rotate: 87, scale: 0.8, x: 26, y: -8 },
    { rotate: 159, scale: 0.8, x: 18, y: 22 },
    { rotate: 231, scale: 0.8, x: -18, y: 22 },
    { rotate: 303, scale: 0.8, x: -26, y: -8 },
  ],
  [
    { rotate: 50, scale: 1, x: 12, y: -36 },
    { rotate: 122, scale: 1, x: 34, y: -2 },
    { rotate: 194, scale: 1, x: 20, y: 30 },
    { rotate: 266, scale: 1, x: -20, y: 30 },
    { rotate: 338, scale: 1, x: -34, y: -2 },
  ],
  [
    { rotate: 25, scale: 1.15, x: 8, y: -44 },
    { rotate: 97, scale: 1.15, x: 42, y: -10 },
    { rotate: 169, scale: 1.15, x: 28, y: 36 },
    { rotate: 241, scale: 1.15, x: -28, y: 36 },
    { rotate: 313, scale: 1.15, x: -42, y: -10 },
  ],
];

const PETAL_COLORS = [
  '#f43f5e',
  '#fb7185',
  '#fda4af',
  '#fecdd3',
  '#fda4af',
];

const BLOOM_NOTES = [
  "Tap the rose to watch it bloom...",
  "Layer 1: Every smile of yours lights up my world 🌸",
  "Layer 2: Every moment with you is my favorite memory 🌷",
  "Layer 3: You bring colors into my everyday code 🌺",
  "Layer 4: Almost fully blossomed for Dhvani 💖",
  "Full Bloom: Just like you made my life bloom ❤️",
];

interface BloomingRoseProps {
  onNext?: () => void;
}

export const BloomingRose: React.FC<BloomingRoseProps> = ({ onNext }) => {
  const [bloomLevel, setBloomLevel] = useState(0); // 0 to 5
  const [isFullBloom, setIsFullBloom] = useState(false);
  const [petalParticles, setPetalParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleTap = () => {
    if (bloomLevel >= 5) return;

    const nextLevel = bloomLevel + 1;
    setBloomLevel(nextLevel);
    soundEngine.playBloom();

    const newPetals = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 140,
      y: (Math.random() - 0.5) * 140,
    }));
    setPetalParticles(prev => [...prev, ...newPetals]);

    if (nextLevel >= 5) {
      setTimeout(() => {
        setIsFullBloom(true);
        soundEngine.playCelebration();
      }, 500);
    }
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
        className="text-center mb-8 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-pink-100 text-xs font-code mb-4 shadow-sm">
          <span>🌹</span>
          <span>PAGE 5 // MAGIC_ROSE_BLOOM_PROTOCOL</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-rose-200 via-pink-200 to-red-200 bg-clip-text text-transparent">
          The Blooming Rose
        </h2>
        <p className="text-pink-200/80 text-sm sm:text-base mt-2 font-light">
          {BLOOM_NOTES[bloomLevel]}
        </p>
      </motion.div>

      {/* Rose Interactive Canvas Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative w-64 h-64 sm:w-80 sm:h-80 cursor-pointer my-4"
        onClick={handleTap}
      >
        {/* Glow behind rose */}
        <div className={`absolute inset-0 rounded-full blur-[60px] transition-all duration-700 ${
          bloomLevel >= 5
            ? 'bg-rose-400/35'
            : bloomLevel >= 3
            ? 'bg-rose-400/20'
            : 'bg-rose-400/10'
        }`} />

        {/* Rose SVG Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Stem */}
          <div className="absolute bottom-4 w-1.5 h-28 bg-gradient-to-t from-emerald-800 to-emerald-500 rounded-full" />

          {/* Leaves */}
          <motion.div
            animate={{ rotate: bloomLevel > 0 ? -25 : -15 }}
            className="absolute bottom-16 left-1/2 ml-2"
          >
            <div className="w-9 h-4 bg-emerald-500 rounded-full origin-left" style={{ borderRadius: '50% 0 50% 0' }} />
          </motion.div>
          <motion.div
            animate={{ rotate: bloomLevel > 0 ? 25 : 15 }}
            className="absolute bottom-20 left-1/2 -ml-11"
          >
            <div className="w-9 h-4 bg-emerald-600 rounded-full origin-right" style={{ borderRadius: '0 50% 0 50%' }} />
          </motion.div>

          {/* Petal Layers */}
          <div className="relative">
            {PETAL_LAYERS.map((layer, layerIdx) => (
              <React.Fragment key={layerIdx}>
                {layerIdx < bloomLevel && layer.map((petal, petalIdx) => (
                  <motion.div
                    key={`${layerIdx}-${petalIdx}`}
                    initial={{ scale: 0, rotate: petal.rotate - 60, opacity: 0 }}
                    animate={{ scale: petal.scale, rotate: petal.rotate, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: petalIdx * 0.05,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    className="absolute"
                    style={{
                      left: `calc(50% + ${petal.x}px)`,
                      top: `calc(50% + ${petal.y}px)`,
                      transform: `translate(-50%, -50%) rotate(${petal.rotate}deg) scale(${petal.scale})`,
                    }}
                  >
                    <div
                      className="w-7 h-10 rounded-t-full"
                      style={{
                        background: `linear-gradient(to bottom, ${PETAL_COLORS[layerIdx]}, ${PETAL_COLORS[layerIdx]}cc)`,
                        boxShadow: `0 0 12px ${PETAL_COLORS[layerIdx]}70`,
                      }}
                    />
                  </motion.div>
                ))}
              </React.Fragment>
            ))}

            {/* Center bud — always visible */}
            <motion.div
              animate={{
                scale: bloomLevel >= 5 ? [1, 1.12, 1] : 1,
              }}
              transition={{ repeat: bloomLevel >= 5 ? Infinity : 0, duration: 2 }}
              className="relative z-10 w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-red-600 shadow-[0_0_25px_rgba(244,63,94,0.8)]"
            />
          </div>
        </div>

        {/* Floating petal particles */}
        <AnimatePresence>
          {petalParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, x: p.x, y: p.y - 50, scale: 0, rotate: 180 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              onAnimationComplete={() => {
                setPetalParticles(prev => prev.filter(item => item.id !== p.id));
              }}
              className="absolute top-1/2 left-1/2 w-3.5 h-5 rounded-full pointer-events-none"
              style={{ background: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)] }}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Full Bloom Message & Navigation */}
      <AnimatePresence>
        {isFullBloom && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 glass-card-apple rounded-[28px] p-6 sm:p-8 text-center max-w-md border border-pink-300/30 shadow-[0_20px_60px_rgba(236,72,153,0.3)] z-20"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-xs font-code text-pink-200/80 font-bold">BLOOM_COMPLETE</span>
            </div>
            <p className="text-2xl sm:text-3xl font-cursive text-pink-200 font-bold leading-relaxed">
              "Just like you made my life bloom." 🌹
            </p>

            {onNext && (
              <div className="pt-6 mt-4 border-t border-pink-300/20 flex justify-center">
                <button
                  onClick={handleNextPage}
                  className="glass-button-romantic px-7 py-3.5 rounded-full text-white font-medium text-base flex items-center gap-3 shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Proceed to Shooting Star Sky</span>
                  <ArrowRight className="w-4 h-4 text-pink-300" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

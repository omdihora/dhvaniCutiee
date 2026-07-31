import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface OurUniverseProps {
  onNext?: () => void;
}

const ZOOM_STAGES = [
  {
    label: 'The Observable Universe',
    emoji: '🌌',
    count: '93 Billion Light Years',
    description: 'Infinite galaxies, stars, and mysteries...',
    bg: 'radial-gradient(ellipse at center, #0a0015 0%, #000005 100%)',
  },
  {
    label: 'The Milky Way Galaxy',
    emoji: '🌀',
    count: '400 Billion Stars',
    description: 'Our home galaxy, a spiral of light...',
    bg: 'radial-gradient(ellipse at center, #0d0520 0%, #050010 100%)',
  },
  {
    label: 'Our Solar System',
    emoji: '☀️',
    count: '8 Planets',
    description: 'One tiny corner of the Milky Way...',
    bg: 'radial-gradient(ellipse at center, #12082a 0%, #080015 100%)',
  },
  {
    label: 'Planet Earth',
    emoji: '🌍',
    count: '8 Billion People',
    description: 'A beautiful blue marble floating in space...',
    bg: 'radial-gradient(ellipse at center, #0a1628 0%, #060d18 100%)',
  },
  {
    label: 'Our Country',
    emoji: '🇮🇳',
    count: '1.4 Billion People',
    description: 'A land of colors, cultures, and stories...',
    bg: 'radial-gradient(ellipse at center, #140a28 0%, #0a0518 100%)',
  },
  {
    label: 'Our City',
    emoji: '🏙️',
    count: 'Millions of People',
    description: 'Streets, lights, and endless crowds...',
    bg: 'radial-gradient(ellipse at center, #1a0a30 0%, #0e0520 100%)',
  },
  {
    label: 'And Yet...',
    emoji: '✨',
    count: 'Out of Everyone',
    description: 'In this entire vast universe...',
    bg: 'radial-gradient(ellipse at center, #1f0a38 0%, #120828 100%)',
  },
];

const FINAL_MESSAGE = {
  label: 'My Favorite Person Is You',
  name: 'Dhvani ❤️',
  description: 'Out of billions of people, galaxies, and stars... the universe led me to you.',
};

export const OurUniverse: React.FC<OurUniverseProps> = ({ onNext }) => {
  const [currentStage, setCurrentStage] = useState(-1); // -1 = intro, 0-6 = stages, 7 = final
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  useEffect(() => {
    // Start auto-play after a brief intro
    const timer = setTimeout(() => {
      setIsAutoPlaying(true);
      setCurrentStage(0);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || currentStage < 0) return;

    if (currentStage < ZOOM_STAGES.length) {
      const timer = setTimeout(() => {
        soundEngine.playClick();
        setCurrentStage((prev) => prev + 1);
      }, 2800);
      return () => clearTimeout(timer);
    } else if (currentStage === ZOOM_STAGES.length) {
      // Final stage reached
      soundEngine.playHeartPop();
      setIsAutoPlaying(false);
    }
  }, [currentStage, isAutoPlaying]);

  const isFinal = currentStage >= ZOOM_STAGES.length;
  const stage = currentStage >= 0 && currentStage < ZOOM_STAGES.length ? ZOOM_STAGES[currentStage] : null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative my-auto overflow-hidden">
      {/* Deep Space Starfield */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.2 + Math.random() * 0.6,
              animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Nebula Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-pink-500/8 blur-[100px] pointer-events-none translate-x-32 translate-y-20" />

      {/* Intro Screen */}
      <AnimatePresence mode="wait">
        {currentStage === -1 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.8 }}
            className="z-10 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-pink-100 text-xs font-code mb-6">
              <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
              <span>INITIATING COSMIC JOURNEY</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
              Our Universe
            </h1>
            <p className="text-purple-200/70 mt-3 text-sm">Zooming through infinity to find you...</p>
          </motion.div>
        )}

        {/* Zoom Stages */}
        {stage && (
          <motion.div
            key={`stage-${currentStage}`}
            initial={{ opacity: 0, scale: 0.6, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 2.5, filter: 'blur(30px)' }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="z-10 flex flex-col items-center text-center max-w-xl"
          >
            {/* Zoom Ring Pulse */}
            <div className="relative mb-8">
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute inset-0 w-32 h-32 rounded-full border-2 border-purple-400/30 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                className="absolute inset-0 w-24 h-24 rounded-full border border-pink-400/20 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                {stage.emoji}
              </div>
            </div>

            {/* Stage Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-xs font-code text-purple-300/80 tracking-widest uppercase">
                {stage.count}
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 tracking-tight">
                {stage.label}
              </h2>
              <p className="text-purple-200/70 mt-3 text-base max-w-md">
                {stage.description}
              </p>
            </motion.div>

            {/* Progress Dots */}
            <div className="flex items-center gap-2 mt-8">
              {ZOOM_STAGES.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    i === currentStage
                      ? 'bg-pink-400 w-6 shadow-[0_0_10px_rgba(236,72,153,0.8)]'
                      : i < currentStage
                      ? 'bg-purple-400/60'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* FINAL REVEAL */}
        {isFinal && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="z-10 flex flex-col items-center text-center max-w-2xl"
          >
            {/* Giant Pulsing Heart */}
            <div className="relative mb-8">
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.05, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute w-48 h-48 rounded-full bg-pink-500/20 blur-3xl -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              />
              <motion.div
                animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                className="text-7xl sm:text-8xl drop-shadow-[0_0_40px_rgba(244,63,94,0.8)]"
              >
                ❤️
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="text-xs font-code text-pink-300 tracking-widest uppercase">
                Out of 8 Billion People
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mt-3 bg-gradient-to-r from-pink-200 via-rose-200 to-amber-200 bg-clip-text text-transparent leading-tight">
                {FINAL_MESSAGE.label}
              </h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-4xl sm:text-5xl font-extrabold text-white mt-4 glow-text-pink"
              >
                {FINAL_MESSAGE.name}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="text-pink-200/80 mt-4 text-base sm:text-lg max-w-lg mx-auto font-light leading-relaxed"
              >
                {FINAL_MESSAGE.description}
              </motion.p>
            </motion.div>

            {/* Continue Button */}
            {onNext && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
                className="mt-10"
              >
                <button
                  onClick={() => {
                    soundEngine.playPageSwitch();
                    onNext();
                  }}
                  className="glass-button-romantic px-8 py-3.5 rounded-full text-white font-medium text-base flex items-center gap-3 shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Continue Our Journey</span>
                  <ArrowRight className="w-4 h-4 text-pink-300" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for twinkle animation */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
};

export default OurUniverse;

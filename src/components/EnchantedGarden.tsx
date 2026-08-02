import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Sparkles, ArrowRight, Heart, Flower2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';

// ───────────────────────────────────────────────
// TYPES
// ───────────────────────────────────────────────
interface PlantedFlower {
  id: number;
  x: number;
  y: number;
  type: string;
  scale: number;
  delay: number;
}

interface LoveNote {
  id: number;
  x: number;
  y: number;
  message: string;
  flower: string;
  visible: boolean;
}

interface EnchantedGardenProps {
  onNext?: () => void;
}

// ───────────────────────────────────────────────
// CONSTANTS
// ───────────────────────────────────────────────
const FLOWER_EMOJIS = ['🌹', '🌷', '🌸', '🌺', '🌻', '💐', '🌼', '🏵️', '💮', '🪷'];
const BUTTERFLY_EMOJIS = ['🦋', '🦋', '🦋', '🐝', '🐞', '🪲'];

const LOVE_NOTES = [
  "You're the most beautiful flower in my life ❤️",
  "Every flower reminds me of your smile 🌸",
  "I still fall for you every single day ❤️",
  "You make the whole world bloom brighter 🌹",
  "My heart gardens only grow for you 💕",
  "You are the sunshine my flowers need ☀️",
  "Every petal whispers your name 🌷",
  "In a field of roses, you're the rarest one 🌹",
];

const GARDEN_FLOWERS = [
  { name: 'Rose', emoji: '🌹', color: '#e11d48' },
  { name: 'Tulip', emoji: '🌷', color: '#ec4899' },
  { name: 'Cherry Blossom', emoji: '🌸', color: '#f9a8d4' },
  { name: 'Hibiscus', emoji: '🌺', color: '#f43f5e' },
  { name: 'Sunflower', emoji: '🌻', color: '#eab308' },
  { name: 'Daisy', emoji: '🌼', color: '#fbbf24' },
  { name: 'Lotus', emoji: '🪷', color: '#c084fc' },
  { name: 'Orchid', emoji: '💮', color: '#e879f9' },
];

export const EnchantedGarden: React.FC<EnchantedGardenProps> = ({ onNext }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [plantedFlowers, setPlantedFlowers] = useState<PlantedFlower[]>([]);
  const [activeLoveNote, setActiveLoveNote] = useState<LoveNote | null>(null);
  const [secretFound, setSecretFound] = useState(false);
  const [treeGrowth, setTreeGrowth] = useState(0); // 0 to 1
  const [totalFlowersPlanted, setTotalFlowersPlanted] = useState(0);
  const [showFinalReveal] = useState(false);

  const { scrollYProgress } = useScroll({ target: containerRef });

  // Tree grows based on scroll
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      setTreeGrowth(Math.min(1, v * 1.5));
    });
    return () => unsub();
  }, [scrollYProgress]);

  // Plant flower on click
  const handlePlantFlower = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newFlower: PlantedFlower = {
      id: Date.now() + Math.random(),
      x,
      y,
      type: FLOWER_EMOJIS[Math.floor(Math.random() * FLOWER_EMOJIS.length)],
      scale: 0.8 + Math.random() * 0.6,
      delay: 0,
    };

    setPlantedFlowers((prev) => [...prev.slice(-35), newFlower]);
    setTotalFlowersPlanted((p) => p + 1);
    soundEngine.playClick();
  }, []);

  // Reveal secret white rose
  const handleSecretRose = () => {
    if (secretFound) return;
    setSecretFound(true);
    soundEngine.playCelebration();

    const end = Date.now() + 3000;
    const colors = ['#f7e7ce', '#fadadd', '#f8c8dc', '#ec4899', '#d4af37', '#e5c158'];
    (function frame() {
      confetti({ particleCount: 8, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 8, angle: 120, spread: 55, origin: { x: 1 }, colors });
      confetti({ particleCount: 12, spread: 100, origin: { y: 0.3 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  return (
    <div
      ref={containerRef}
      className="w-full relative overflow-x-hidden bg-[#0f051d]"
    >
      {/* ───────────────────────────────────────────────
          SECTION 1: FANTASY FLOWER GARDEN HERO
          ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Soft Sunlight Rays & Gradient Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d0a10] via-[#5c1325]/80 to-[#0f051d] z-0" />

        {/* Golden Sun Rays */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.75, 0.5] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-10 right-20 sm:right-36 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-[#f7e7ce] via-[#d4af37]/60 to-transparent blur-3xl z-0"
        />

        {/* Soft Dreamy Clouds & Fog */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`cloud-${i}`}
            animate={{ x: ['-10%', '110%'] }}
            transition={{ repeat: Infinity, duration: 35 + i * 12, ease: 'linear', delay: i * 6 }}
            className="absolute z-[1]"
            style={{ top: `${6 + i * 7}%` }}
          >
            <div className="bg-white/20 rounded-full blur-xl w-64 sm:w-96 h-16 sm:h-24" />
          </motion.div>
        ))}

        {/* Drifting Petals reacting to Wind */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            animate={{
              y: ['-10vh', '110vh'],
              x: [0, (i % 2 === 0 ? 80 : -80)],
              rotate: [0, 360],
            }}
            transition={{
              duration: 12 + (i % 5) * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.7,
            }}
            className="absolute z-10 text-xl sm:text-2xl pointer-events-none filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
            style={{ left: `${(i * 6) % 95}%` }}
          >
            🌸
          </motion.div>
        ))}

        {/* Floating Butterflies & Birds */}
        {BUTTERFLY_EMOJIS.map((b, i) => (
          <motion.div
            key={`butterfly-${i}`}
            animate={{
              x: [0, 80, -40, 60, 0],
              y: [0, -50, 30, -30, 0],
              rotate: [0, 15, -10, 10, 0],
            }}
            transition={{ duration: 15 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute z-10 text-2xl sm:text-3xl pointer-events-none filter drop-shadow-[0_0_12px_rgba(212,175,55,0.8)]"
            style={{ left: `${15 + i * 16}%`, top: `${20 + (i * 12) % 60}%` }}
          >
            {b}
          </motion.div>
        ))}

        {/* Hero Copy Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="z-20 text-center max-w-3xl px-4 py-8 glass-card-luxury bg-[#0f051d]/85 border-2 border-[#f7e7ce]/40 rounded-[36px] shadow-[0_20px_80px_rgba(212,175,55,0.3)] my-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-[#f7e7ce]/30 text-[#f7e7ce] text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>FANTASY FLOWER GARDEN</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-white leading-tight tracking-tight">
            Our Love Blooming in Full Colors 🌸
          </h1>

          <p className="font-handwritten text-xl sm:text-2xl text-[#f7e7ce] mt-4 max-w-xl mx-auto leading-relaxed">
            "Click anywhere in this fantasy garden to plant new flowers, uncover hidden love notes, and watch our garden bloom as you scroll."
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleSecretRose}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b76e79] text-[#0f051d] text-sm font-semibold flex items-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all font-serif-luxury cursor-pointer"
            >
              <Flower2 className="w-4 h-4 text-[#0f051d]" />
              <span>Bloom Secret White Rose ✨</span>
            </button>

            {onNext && (
              <button
                onClick={() => {
                  soundEngine.playPageSwitch();
                  onNext();
                }}
                className="glass-pill px-6 py-3 text-xs sm:text-sm font-medium text-[#f7e7ce] flex items-center gap-2 border border-[#f7e7ce]/30 hover:bg-white/15 active:scale-95 transition-all font-serif-luxury cursor-pointer"
              >
                <span>Continue Journey</span>
                <ArrowRight className="w-4 h-4 text-[#d4af37]" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Floating Lanterns drifting into Sky */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`lantern-${i}`}
            animate={{
              y: ['100vh', '-20vh'],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: 16 + i * 4,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 3,
            }}
            className="absolute z-10 text-2xl sm:text-3xl pointer-events-none filter drop-shadow-[0_0_15px_rgba(255,183,77,0.8)]"
            style={{ left: `${8 + i * 16}%` }}
          >
            🏮
          </motion.div>
        ))}
      </section>

      {/* ───────────────────────────────────────────────
          SECTION 2: INTERACTIVE GARDEN MEADOW & CLICK TO PLANT
          ─────────────────────────────────────────────── */}
      <section
        onClick={handlePlantFlower}
        className="relative min-h-screen py-20 px-4 flex flex-col items-center justify-center border-t border-[#f7e7ce]/20 bg-gradient-to-b from-[#0f051d] via-[#1a0729] to-[#0f051d] cursor-pointer"
      >
        <div className="text-center z-10 max-w-2xl mb-8">
          <span className="text-[#d4af37] font-mono text-xs font-bold uppercase tracking-widest">
            Interactive Planting Canvas ({totalFlowersPlanted} Planted)
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white mt-1">
            Tap Anywhere to Plant Your Own Flowers 🌸
          </h2>
          <p className="font-handwritten text-lg text-[#f7e7ce] mt-2">
            Every flower you plant blooms with a tiny spark of romance.
          </p>
        </div>

        {/* Planted Flowers Canvas Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {plantedFlowers.map((flower) => (
            <motion.div
              key={flower.id}
              initial={{ scale: 0, opacity: 0, rotate: -30 }}
              animate={{ scale: flower.scale, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 180 }}
              className="absolute text-3xl sm:text-5xl filter drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]"
              style={{ left: `${flower.x}%`, top: `${flower.y}%` }}
            >
              {flower.type}
            </motion.div>
          ))}
        </div>

        {/* Flower Grid Varieties Showcase */}
        <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 z-10 pt-8">
          {GARDEN_FLOWERS.map((f, idx) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playHeartPop();
                setActiveLoveNote({
                  id: idx,
                  x: 50,
                  y: 50,
                  message: LOVE_NOTES[idx % LOVE_NOTES.length],
                  flower: f.emoji,
                  visible: true,
                });
              }}
              className="glass-card-luxury p-5 rounded-3xl text-center border border-[#f7e7ce]/25 hover:border-[#f7e7ce]/60 hover:scale-105 transition-all cursor-pointer group"
            >
              <div className="text-4xl sm:text-5xl mb-3 group-hover:scale-115 transition-transform duration-300">
                {f.emoji}
              </div>
              <h4 className="text-white font-serif-luxury font-bold text-base">{f.name}</h4>
              <span className="text-[11px] font-mono text-[#d4af37] block mt-1">Tap for Love Note 💌</span>
            </motion.div>
          ))}
        </div>

        {/* Love Note Modal */}
        <AnimatePresence>
          {activeLoveNote && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
              onClick={() => setActiveLoveNote(null)}
            >
              <div
                className="glass-card-luxury bg-[#0f051d]/95 border-2 border-[#f7e7ce]/40 rounded-3xl p-6 max-w-sm text-center shadow-[0_0_60px_rgba(212,175,55,0.4)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-5xl mb-3 animate-bounce">{activeLoveNote.flower}</div>
                <h3 className="text-[#d4af37] font-serif-luxury text-xl font-bold mb-2">Hidden Love Note</h3>
                <p className="font-handwritten text-xl text-[#f7e7ce] leading-relaxed">
                  "{activeLoveNote.message}"
                </p>
                <button
                  onClick={() => setActiveLoveNote(null)}
                  className="mt-5 px-6 py-2 rounded-full bg-[#d4af37] text-[#0f051d] text-xs font-semibold font-serif-luxury"
                >
                  Close Note 💕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ───────────────────────────────────────────────
          SECTION 3: GRAND REVEAL & BLOOMING SECRET
          ─────────────────────────────────────────────── */}
      <section className="relative py-24 px-4 flex flex-col items-center justify-center border-t border-[#f7e7ce]/20 bg-gradient-to-b from-[#0f051d] via-[#2d0a10] to-[#0f051d] text-center">
        {secretFound && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <div className="text-8xl drop-shadow-[0_0_40px_rgba(247,231,206,0.8)] animate-pulse">
              🌹
            </div>
            <h3 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white mt-4">
              The Rarest White Rose Has Bloomed 🌹✨
            </h3>
            <p className="font-handwritten text-2xl text-[#f7e7ce] mt-2 max-w-md mx-auto">
              "In a garden of millions of flowers, you remain the only one my heart will ever choose."
            </p>
          </motion.div>
        )}

        <div className="pt-8 flex flex-wrap items-center justify-center gap-4">
          {onNext && (
            <button
              onClick={() => {
                soundEngine.playPageSwitch();
                onNext();
              }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b76e79] text-[#0f051d] text-sm font-semibold flex items-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all font-serif-luxury cursor-pointer"
            >
              <span>Continue to Next Chapter 💖</span>
              <ArrowRight className="w-4 h-4 text-[#0f051d]" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EnchantedGarden;

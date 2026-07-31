import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
const PETAL_COLORS = ['#fadadd', '#f8c8dc', '#ffd6e8', '#e6d5ff', '#fff0f5', '#ffe4e1'];

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

// ───────────────────────────────────────────────
// MAIN COMPONENT
// ───────────────────────────────────────────────
export const EnchantedGarden: React.FC<EnchantedGardenProps> = ({ onNext }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [plantedFlowers, setPlantedFlowers] = useState<PlantedFlower[]>([]);
  const [activeLoveNote, setActiveLoveNote] = useState<LoveNote | null>(null);
  const [secretFound, setSecretFound] = useState(false);
  const [treeGrowth, setTreeGrowth] = useState(0); // 0 to 1
  const [totalFlowersPlanted, setTotalFlowersPlanted] = useState(0);
  const [showFinalReveal, setShowFinalReveal] = useState(false);

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

    setPlantedFlowers((prev) => [...prev.slice(-30), newFlower]);
    setTotalFlowersPlanted((p) => p + 1);
    soundEngine.playClick();
  }, []);

  // Reveal secret white rose
  const handleSecretRose = () => {
    if (secretFound) return;
    setSecretFound(true);
    soundEngine.playCelebration();

    // Massive bloom confetti
    const end = Date.now() + 3000;
    const colors = ['#fadadd', '#f8c8dc', '#ec4899', '#f43f5e', '#c084fc', '#fbbf24'];
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
      className="w-full relative overflow-x-hidden"
      style={{ cursor: 'url("data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22><text y=%2224%22 font-size=%2224%22>🌸</text></svg>") 16 16, auto' }}
    >
      {/* ═══════════════════════════════════════════
          SECTION 1: MEADOW HERO — ANIMATED SKY
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Gradient Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffd1dc] via-[#ffc2d4] to-[#e8b4c8] z-0" />

        {/* Sun Glow */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-16 right-20 sm:right-32 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 blur-3xl z-0"
        />

        {/* Soft Clouds */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`cloud-${i}`}
            animate={{ x: ['-10%', '110%'] }}
            transition={{ repeat: Infinity, duration: 40 + i * 15, ease: 'linear', delay: i * 8 }}
            className="absolute z-[1]"
            style={{ top: `${8 + i * 6}%` }}
          >
            <div
              className="bg-white/50 rounded-full blur-md"
              style={{
                width: `${120 + i * 30}px`,
                height: `${40 + i * 10}px`,
              }}
            />
          </motion.div>
        ))}

        {/* Flying Birds */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`bird-${i}`}
            animate={{
              x: ['-5%', '105%'],
              y: [0, -15, 5, -10, 0],
            }}
            transition={{
              x: { repeat: Infinity, duration: 20 + i * 8, ease: 'linear', delay: i * 5 },
              y: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
            }}
            className="absolute z-[2] text-slate-700/40 text-xs"
            style={{ top: `${12 + i * 5}%` }}
          >
            🕊️
          </motion.div>
        ))}

        {/* Floating Butterflies */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`bf-${i}`}
            animate={{
              x: [0, 30 * Math.sin(i), -20, 15 * Math.cos(i), 0],
              y: [0, -25, 10, -15, 0],
              rotate: [0, 15, -10, 5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 6 + i * 1.5,
              ease: 'easeInOut',
              delay: i * 0.8,
            }}
            className="absolute z-[3] text-lg sm:text-xl pointer-events-none"
            style={{
              top: `${20 + (i * 10) % 60}%`,
              left: `${5 + (i * 13) % 85}%`,
            }}
          >
            {BUTTERFLY_EMOJIS[i % BUTTERFLY_EMOJIS.length]}
          </motion.div>
        ))}

        {/* Drifting Petals */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            animate={{
              x: [0, 80, 160],
              y: [0, 200, 500],
              rotate: [0, 180, 360],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 8 + i * 2,
              ease: 'easeInOut',
              delay: i * 1.2,
            }}
            className="absolute z-[2] pointer-events-none"
            style={{
              top: `-5%`,
              left: `${(i * 9) % 95}%`,
            }}
          >
            <div
              className="w-3 h-4 rounded-full rotate-45"
              style={{ backgroundColor: PETAL_COLORS[i % PETAL_COLORS.length], opacity: 0.7 }}
            />
          </motion.div>
        ))}

        {/* Ground / Meadow */}
        <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-[#4a7c59] via-[#5a9a6a] to-transparent z-[4]" />

        {/* Grass Blades */}
        <div className="absolute bottom-0 left-0 right-0 h-20 z-[5] overflow-hidden">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={`grass-${i}`}
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 2 + Math.random() * 2, delay: Math.random() }}
              className="absolute bottom-0 w-1 bg-gradient-to-t from-[#3d6b4a] to-[#7bc67e] rounded-t-full origin-bottom"
              style={{
                height: `${30 + Math.random() * 40}px`,
                left: `${i * 2.5}%`,
                opacity: 0.5 + Math.random() * 0.5,
              }}
            />
          ))}
        </div>

        {/* HERO TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="relative z-10 text-center px-4 max-w-3xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, type: 'spring', bounce: 0.4 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-[#6b2142] text-xs font-code mb-6 shadow-lg"
          >
            <Flower2 className="w-4 h-4 text-pink-600" />
            <span>THE ENCHANTED FLOWER GARDEN</span>
            <span>🌸</span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#4a1030] drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)] leading-tight">
            Welcome to Our
            <br />
            <span className="bg-gradient-to-r from-[#e11d48] via-[#ec4899] to-[#c026d3] bg-clip-text text-transparent">
              Enchanted Garden
            </span>
            <span className="ml-2">❤️</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-4 text-base sm:text-lg text-[#6b2142]/80 font-light max-w-xl mx-auto leading-relaxed"
          >
            Every flower here blooms because of a beautiful memory we created together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="mt-8 flex items-center justify-center gap-2 text-[#8b3a5a]/60 text-sm"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ↓
            </motion.div>
            <span className="font-code text-xs">Scroll to explore the garden</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ↓
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Meadow Flowers */}
        <div className="absolute bottom-8 left-0 right-0 z-[6] flex items-end justify-around px-4">
          {GARDEN_FLOWERS.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 2 + i * 0.2, type: 'spring', bounce: 0.5 }}
              className="text-2xl sm:text-3xl"
              style={{ transform: `translateX(${Math.sin(i) * 10}px)` }}
            >
              <motion.div
                animate={{ y: [0, -4, 0], rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: 'easeInOut' }}
              >
                {f.emoji}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2: INTERACTIVE FLOWER PLANTING FIELD
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen bg-gradient-to-b from-[#e8b4c8] via-[#d4a0b8] to-[#2d5a3a] overflow-hidden">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center pt-16 pb-8 px-4 relative z-10"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4a1030]">
            Plant Your Own Flowers 🌱
          </h2>
          <p className="text-[#6b2142]/70 text-sm mt-2">
            Click anywhere in the garden below to plant a magical flower
          </p>
          <p className="text-xs font-code text-[#8b3a5a]/50 mt-1">
            {totalFlowersPlanted} flowers planted with love 💕
          </p>
        </motion.div>

        {/* Plantable Garden Area */}
        <div
          onClick={handlePlantFlower}
          className="relative w-full min-h-[60vh] cursor-pointer z-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(90,154,106,0.3) 0%, rgba(74,124,89,0.8) 60%, #3d6b4a 100%)',
          }}
        >
          {/* Pre-planted decorative flowers */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`pre-${i}`}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              className="absolute text-xl sm:text-2xl"
              style={{
                left: `${5 + (i * 7) % 90}%`,
                bottom: `${5 + (i * 5) % 40}%`,
              }}
            >
              <motion.div
                animate={{ y: [0, -3, 0], rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 3 + i * 0.3 }}
              >
                {FLOWER_EMOJIS[i % FLOWER_EMOJIS.length]}
              </motion.div>
            </motion.div>
          ))}

          {/* User-planted flowers */}
          {plantedFlowers.map((flower) => (
            <motion.div
              key={flower.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: flower.scale, rotate: 0 }}
              transition={{ duration: 0.6, type: 'spring', bounce: 0.6 }}
              className="absolute text-2xl sm:text-3xl pointer-events-none"
              style={{
                left: `${flower.x}%`,
                top: `${flower.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {flower.type}
              {/* Sparkle burst on plant */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-center text-xs"
              >
                ✨
              </motion.div>
            </motion.div>
          ))}

          {/* Hidden Rare Flowers with Love Notes */}
          {LOVE_NOTES.slice(0, 5).map((note, i) => (
            <motion.div
              key={`rare-${i}`}
              whileHover={{ scale: 1.3 }}
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playHeartPop();
                setActiveLoveNote({
                  id: i,
                  x: 50,
                  y: 50,
                  message: note,
                  flower: '🌹',
                  visible: true,
                });
              }}
              className="absolute cursor-pointer z-20"
              style={{
                left: `${15 + i * 18}%`,
                bottom: `${15 + (i * 7) % 30}%`,
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'],
                }}
                transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.4 }}
                className="text-2xl sm:text-3xl drop-shadow-[0_0_12px_rgba(236,72,153,0.8)]"
              >
                {['🌹', '🌷', '🌺', '💮', '🪷'][i]}
              </motion.div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-pink-400/40 blur-sm" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3: CHERRY BLOSSOM FOREST
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen bg-gradient-to-b from-[#2d5a3a] to-[#1a3d2a] overflow-hidden flex items-center justify-center">
        {/* Forest Background Trees */}
        <div className="absolute inset-0 z-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={`tree-${i}`}
              className="absolute bottom-0"
              style={{ left: `${i * 18}%` }}
            >
              {/* Tree trunk */}
              <div
                className="mx-auto bg-gradient-to-t from-[#5d3a1a] to-[#8b5e3c] rounded-t-lg"
                style={{ width: '12px', height: `${100 + i * 20}px` }}
              />
              {/* Tree canopy */}
              <div
                className="rounded-full bg-gradient-to-b from-[#f9a8d4] to-[#ec4899] blur-sm -mt-10 mx-auto"
                style={{
                  width: `${80 + i * 15}px`,
                  height: `${60 + i * 10}px`,
                  marginLeft: `-${(80 + i * 15) / 2 - 6}px`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Falling Cherry Blossoms */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`cb-${i}`}
            animate={{
              y: ['-10vh', '110vh'],
              x: [0, Math.sin(i) * 60, Math.cos(i) * 40, 0],
              rotate: [0, 360],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 6 + Math.random() * 6,
              delay: i * 0.5,
              ease: 'linear',
            }}
            className="absolute z-10 pointer-events-none"
            style={{ left: `${Math.random() * 100}%` }}
          >
            <div
              className="w-2.5 h-3 rounded-full rotate-45"
              style={{
                backgroundColor: ['#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6'][i % 4],
                opacity: 0.8,
              }}
            />
          </motion.div>
        ))}

        {/* Sunlight Rays */}
        <div className="absolute top-0 right-0 w-full h-full z-[5] pointer-events-none overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              transition={{ repeat: Infinity, duration: 4 + i, delay: i * 1.5 }}
              className="absolute top-0 bg-gradient-to-b from-amber-200/20 to-transparent"
              style={{
                left: `${20 + i * 20}%`,
                width: '60px',
                height: '100%',
                transform: `rotate(${10 + i * 5}deg)`,
                transformOrigin: 'top center',
              }}
            />
          ))}
        </div>

        {/* Forest Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-20 text-center px-4 max-w-xl"
        >
          <h2 className="text-3xl sm:text-5xl font-extrabold text-pink-100 drop-shadow-[0_2px_20px_rgba(236,72,153,0.5)]">
            Cherry Blossom Forest 🌸
          </h2>
          <p className="text-pink-200/70 mt-3 text-sm sm:text-base font-light">
            A thousand petals falling softly, each one carrying a whisper of love...
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4: LOTUS LAKE WITH FIREFLIES
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen bg-gradient-to-b from-[#1a3d2a] via-[#0f2a40] to-[#0a1628] overflow-hidden flex items-center justify-center">
        {/* Moon */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="absolute top-12 right-16 sm:right-28 z-[2]"
        >
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 shadow-[0_0_60px_rgba(251,191,36,0.4)]" />
          <div className="absolute top-2 right-1 w-6 h-6 rounded-full bg-amber-100/30" />
        </motion.div>

        {/* Water Surface */}
        <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-[#0a3050] via-[#0d2845] to-[#0f2a40]/50 z-[3]">
          {/* Water ripples */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`ripple-${i}`}
              animate={{ scaleX: [1, 1.5, 1], opacity: [0.15, 0.05, 0.15] }}
              transition={{ repeat: Infinity, duration: 4 + i, delay: i }}
              className="absolute w-full h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent"
              style={{ top: `${20 + i * 18}%` }}
            />
          ))}
        </div>

        {/* Floating Lotus Flowers */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`lotus-${i}`}
            animate={{
              x: [0, 8, -5, 3, 0],
              y: [0, -3, 2, -2, 0],
            }}
            transition={{ repeat: Infinity, duration: 5 + i * 2, ease: 'easeInOut' }}
            className="absolute z-[5] text-2xl sm:text-4xl"
            style={{
              bottom: `${12 + (i * 5) % 20}%`,
              left: `${10 + i * 18}%`,
            }}
          >
            🪷
            {/* Glow underneath */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-3 rounded-full bg-purple-400/20 blur-md" />
          </motion.div>
        ))}

        {/* Koi Fish silhouettes */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`koi-${i}`}
            animate={{ x: ['-100px', '200px', '-100px'] }}
            transition={{ repeat: Infinity, duration: 12 + i * 5, ease: 'easeInOut', delay: i * 3 }}
            className="absolute z-[4] text-lg opacity-30"
            style={{ bottom: `${8 + i * 6}%`, left: `${20 + i * 20}%` }}
          >
            🐟
          </motion.div>
        ))}

        {/* Fireflies */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`firefly-${i}`}
            animate={{
              x: [0, 30 * Math.sin(i * 0.7), -20, 25 * Math.cos(i), 0],
              y: [0, -20, 15, -25, 0],
              opacity: [0, 1, 0.3, 1, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4 + Math.random() * 4,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
            className="absolute z-[8] w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.9)]"
            style={{
              top: `${15 + (i * 4) % 60}%`,
              left: `${5 + (i * 5) % 90}%`,
            }}
          />
        ))}

        {/* Floating Lanterns */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`lantern-${i}`}
            animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 4 + i, delay: i * 2 }}
            className="absolute z-[6] text-xl sm:text-2xl"
            style={{ bottom: `${25 + i * 8}%`, left: `${25 + i * 25}%` }}
          >
            🏮
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 rounded-full bg-orange-400/20 blur-md" />
          </motion.div>
        ))}

        {/* Lake Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-20 text-center px-4 max-w-xl"
        >
          <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-100 drop-shadow-[0_2px_20px_rgba(59,130,246,0.4)]">
            The Lotus Lake 🪷
          </h2>
          <p className="text-blue-200/60 mt-3 text-sm sm:text-base font-light">
            Where peace meets beauty, and moonlight dances on still waters...
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5: TREE OF LOVE — GROWS WITH SCROLL
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen bg-gradient-to-b from-[#0a1628] via-[#12082a] to-[#0e0716] overflow-hidden flex flex-col items-center justify-center px-4 py-16">
        {/* Starfield */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full bg-white z-0"
            style={{
              width: `${1 + Math.random()}px`,
              height: `${1 + Math.random()}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.5,
            }}
          />
        ))}

        {/* The Growing Tree */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Tree Crown — scales with scroll */}
          <motion.div
            style={{ scale: 0.2 + treeGrowth * 0.8, opacity: 0.3 + treeGrowth * 0.7 }}
            className="relative"
          >
            {/* Glowing Aura */}
            <div
              className="absolute inset-0 rounded-full blur-3xl -z-10"
              style={{
                background: `radial-gradient(circle, rgba(236,72,153,${0.1 + treeGrowth * 0.3}) 0%, transparent 70%)`,
                width: '300px',
                height: '300px',
                marginLeft: '-100px',
                marginTop: '-80px',
              }}
            />

            {/* Cherry blossom canopy */}
            <div className="relative">
              <div className="text-center text-6xl sm:text-8xl">🌸</div>
              {treeGrowth > 0.3 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-4 -left-8 text-3xl sm:text-4xl"
                >
                  🌸
                </motion.div>
              )}
              {treeGrowth > 0.4 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-8 text-3xl sm:text-4xl"
                >
                  🌸
                </motion.div>
              )}
              {treeGrowth > 0.5 && (
                <>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-6 -left-14 text-2xl sm:text-3xl">🌸</motion.div>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-6 -right-14 text-2xl sm:text-3xl">🌸</motion.div>
                </>
              )}
              {treeGrowth > 0.7 && (
                <>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-8 left-2 text-2xl">🌸</motion.div>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-10 -left-10 text-xl">🌸</motion.div>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-10 -right-10 text-xl">🌸</motion.div>
                </>
              )}
              {treeGrowth > 0.9 && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={`glow-${i}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.8 }}
                      className="absolute w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                      style={{
                        top: `${-10 + Math.random() * 80}%`,
                        left: `${-30 + Math.random() * 160}%`,
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          </motion.div>

          {/* Trunk */}
          <div
            className="bg-gradient-to-t from-[#5d3a1a] to-[#8b5e3c] rounded-t-lg mx-auto transition-all duration-700"
            style={{
              width: `${8 + treeGrowth * 10}px`,
              height: `${20 + treeGrowth * 100}px`,
            }}
          />

          {/* Ground */}
          <div className="w-32 h-3 rounded-full bg-gradient-to-r from-transparent via-[#3d6b4a]/50 to-transparent" />
        </div>

        {/* Tree Message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative z-10 text-center mt-10 max-w-lg"
        >
          <h3 className="text-2xl sm:text-3xl font-extrabold text-pink-200 glow-text-pink">
            The Tree of Love 🌳
          </h3>
          <p className="font-handwritten text-xl sm:text-2xl text-pink-200/80 mt-3 leading-relaxed">
            "This tree grew because every moment with you became another beautiful memory."
          </p>
          <p className="text-xs font-code text-pink-300/50 mt-3">
            Growth: {Math.round(treeGrowth * 100)}% — Keep scrolling to make it bloom ✨
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 6: SECRET WHITE ROSE
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] bg-[#0e0716] overflow-hidden flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative z-10 flex flex-col items-center text-center px-4"
        >
          {!secretFound ? (
            <>
              <p className="text-xs font-code text-pink-300/40 tracking-widest mb-6">
                A SECRET AWAITS... LOOK CAREFULLY
              </p>

              <motion.button
                onClick={handleSecretRose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  filter: ['brightness(0.8)', 'brightness(1.4)', 'brightness(0.8)'],
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-6xl sm:text-8xl cursor-pointer drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] relative"
              >
                🤍
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.05, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 w-full h-full rounded-full border-2 border-white/20 -z-10"
                  style={{ margin: '-20px' }}
                />
              </motion.button>

              <p className="text-pink-200/30 text-xs mt-4 font-code">Tap the glowing heart...</p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: 'spring' }}
              className="space-y-6"
            >
              <div className="text-7xl sm:text-9xl">🌹</div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white glow-text-pink">
                You found the rarest flower...
              </h3>
              <p className="text-xl sm:text-2xl font-handwritten text-pink-200 max-w-md">
                just like I found the rarest person ❤️
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Bloom burst when found */}
        <AnimatePresence>
          {secretFound && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none z-[5] overflow-hidden"
            >
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={`bloom-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.5],
                    opacity: [0, 0.8, 0],
                    x: (Math.random() - 0.5) * 600,
                    y: (Math.random() - 0.5) * 400,
                  }}
                  transition={{ duration: 2 + Math.random(), delay: i * 0.08 }}
                  className="absolute top-1/2 left-1/2 text-xl sm:text-2xl"
                >
                  {['🌸', '🌹', '🌷', '🦋', '✨', '💖', '🌺', '🪷'][i % 8]}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 7: FLOWER TUNNEL
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-[80vh] bg-gradient-to-b from-[#0e0716] via-[#1f0a2e] to-[#2a0a33] overflow-hidden flex items-center justify-center">
        {/* Left Side Flowers */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-[5] flex flex-col items-center justify-around py-8">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`tl-${i}`}
              initial={{ x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              className="text-2xl sm:text-3xl"
            >
              {FLOWER_EMOJIS[i % FLOWER_EMOJIS.length]}
            </motion.div>
          ))}
        </div>

        {/* Right Side Flowers */}
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-[5] flex flex-col items-center justify-around py-8">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`tr-${i}`}
              initial={{ x: 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              className="text-2xl sm:text-3xl"
            >
              {FLOWER_EMOJIS[(i + 4) % FLOWER_EMOJIS.length]}
            </motion.div>
          ))}
        </div>

        {/* Petal Rain */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`tunnel-petal-${i}`}
            animate={{ y: ['-5vh', '105vh'], rotate: [0, 360], opacity: [0, 0.6, 0] }}
            transition={{ repeat: Infinity, duration: 5 + Math.random() * 4, delay: i * 0.3 }}
            className="absolute z-[3] pointer-events-none"
            style={{ left: `${10 + Math.random() * 80}%` }}
          >
            <div
              className="w-2 h-3 rounded-full rotate-45"
              style={{ backgroundColor: PETAL_COLORS[i % PETAL_COLORS.length], opacity: 0.6 }}
            />
          </motion.div>
        ))}

        {/* Tunnel Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 text-center px-4 max-w-lg"
        >
          <h2 className="text-3xl sm:text-5xl font-extrabold text-purple-100 drop-shadow-[0_2px_20px_rgba(168,85,247,0.4)]">
            The Flower Tunnel 🌺
          </h2>
          <p className="font-handwritten text-xl sm:text-2xl text-pink-200/80 mt-4 leading-relaxed">
            Walking through this tunnel of blooms, every petal a promise of forever...
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 8: FINAL AERIAL REVEAL
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen bg-gradient-to-b from-[#2a0a33] via-[#1a0528] to-[#0e0716] overflow-hidden flex flex-col items-center justify-center px-4 py-16">
        {/* Massive falling petals */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`final-petal-${i}`}
            animate={{ y: ['-10vh', '110vh'], x: [0, Math.sin(i) * 40, 0], rotate: [0, 360], opacity: [0, 0.5, 0] }}
            transition={{ repeat: Infinity, duration: 6 + Math.random() * 5, delay: i * 0.3, ease: 'linear' }}
            className="absolute z-0 pointer-events-none"
            style={{ left: `${Math.random() * 100}%` }}
          >
            <div
              className="w-2.5 h-3.5 rounded-full rotate-45"
              style={{ backgroundColor: PETAL_COLORS[i % PETAL_COLORS.length], opacity: 0.5 }}
            />
          </motion.div>
        ))}

        {/* Butterflies */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`final-bf-${i}`}
            animate={{
              x: [0, 50 * Math.sin(i), -30, 40, 0],
              y: [0, -30, 20, -40, 0],
            }}
            transition={{ repeat: Infinity, duration: 8 + i * 2, ease: 'easeInOut' }}
            className="absolute z-[5] text-xl sm:text-2xl pointer-events-none"
            style={{ top: `${15 + (i * 12) % 70}%`, left: `${10 + (i * 15) % 80}%` }}
          >
            🦋
          </motion.div>
        ))}

        {/* DHVANI Name Reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="relative z-10 text-center"
        >
          {/* Heart surrounding */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-8xl sm:text-[120px] lg:text-[150px] leading-none drop-shadow-[0_0_40px_rgba(244,63,94,0.5)]"
          >
            ❤️
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-pink-200 via-rose-200 to-amber-200 bg-clip-text text-transparent mt-4"
          >
            DHVANI
          </motion.h2>
        </motion.div>

        {/* Final Message */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 1 }}
          className="relative z-10 max-w-xl text-center mt-10 glass-card-apple bg-pink-500/5 border border-pink-400/20 rounded-[32px] p-6 sm:p-10 shadow-[0_0_60px_rgba(236,72,153,0.2)]"
        >
          <p className="font-handwritten text-xl sm:text-2xl lg:text-3xl text-pink-100 leading-relaxed">
            "No matter how many flowers bloom in this world, none could ever be as beautiful as the person this garden was made for.
          </p>
          <p className="font-handwritten text-xl sm:text-2xl lg:text-3xl text-pink-100 leading-relaxed mt-4">
            This garden will always bloom for you... because you will always have a special place in my heart."
          </p>
          <p className="text-right font-handwritten text-xl text-pink-300 mt-6">
            ❤️ — Om
          </p>
        </motion.div>

        {/* Continue Button */}
        {onNext && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 2 }}
            className="relative z-10 mt-10"
          >
            <button
              onClick={() => {
                soundEngine.playPageSwitch();
                onNext();
              }}
              className="glass-button-romantic px-8 py-3.5 rounded-full text-white font-medium text-base flex items-center gap-3 shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all"
            >
              <Heart className="w-4 h-4 text-pink-300 fill-pink-300" />
              <span>Continue Our Journey</span>
              <ArrowRight className="w-4 h-4 text-pink-300" />
            </button>
          </motion.div>
        )}
      </section>

      {/* ═══════════════════════════════════════════
          LOVE NOTE POPUP MODAL
          ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {activeLoveNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLoveNote(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card-apple bg-pink-950/80 border-2 border-pink-400/40 rounded-[32px] p-8 sm:p-12 max-w-md text-center shadow-[0_0_80px_rgba(236,72,153,0.4)] relative"
            >
              <div className="text-5xl mb-4">🌹</div>
              <p className="font-handwritten text-2xl sm:text-3xl text-pink-100 leading-relaxed">
                {activeLoveNote.message}
              </p>
              <button
                onClick={() => setActiveLoveNote(null)}
                className="mt-6 px-6 py-2 rounded-full glass-pill text-pink-200 text-sm hover:bg-white/10 border border-pink-400/30"
              >
                Close 💕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnchantedGarden;

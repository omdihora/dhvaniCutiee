import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/audio';

// ✨ Ultra-Attractive Animated Floral Bouquet Component
// Features layered floral art, stem weaving, blossom unfurling, satin ribbon, floating sparkles, and interactive notes

interface BouquetFlower {
  id: number;
  name: string;
  emoji: string;
  color: string;
  x: number; // final bouquet position relative to center
  y: number;
  scale: number;
  rotation: number;
  note: string;
  delay: number;
}

const BOUQUET_FLOWERS: BouquetFlower[] = [
  { id: 1, name: 'Royal Red Rose', emoji: '🌹', color: '#e11d48', x: 0, y: -65, scale: 1.5, rotation: 0, note: "You're the center of my universe ❤️", delay: 0.2 },
  { id: 2, name: 'Blush Cherry Blossom', emoji: '🌸', color: '#f472b6', x: -45, y: -80, scale: 1.3, rotation: -15, note: "Your smile brightens every day ✨", delay: 0.4 },
  { id: 3, name: 'Pastel Pink Tulip', emoji: '🌷', color: '#f43f5e', x: 45, y: -75, scale: 1.3, rotation: 15, note: "Every moment with you is precious 💕", delay: 0.6 },
  { id: 4, name: 'Golden Sunflower', emoji: '🌻', color: '#eab308', x: -65, y: -40, scale: 1.2, rotation: -25, note: "You bring endless warmth to my soul ☀️", delay: 0.8 },
  { id: 5, name: 'Enchanted Lotus', emoji: '🪷', color: '#c084fc', x: 65, y: -35, scale: 1.2, rotation: 25, note: "Pure grace and absolute beauty 🪷", delay: 1.0 },
  { id: 6, name: 'Magenta Hibiscus', emoji: '🌺', color: '#ec4899', x: -25, y: -105, scale: 1.2, rotation: -10, note: "I fall deeper for you every single day 💗", delay: 1.2 },
  { id: 7, name: 'Field Daisy', emoji: '🌼', color: '#fbbf24', x: 25, y: -100, scale: 1.1, rotation: 10, note: "Simple joys, infinite love with you 🌼", delay: 1.4 },
  { id: 8, name: 'Sweet Lily', emoji: '💐', color: '#a855f7', x: 0, y: -125, scale: 1.4, rotation: 0, note: "Handcrafted with pure love for Dhvani 💐", delay: 1.6 },
];

interface AnimatedBouquetProps {
  onComplete?: () => void;
}

export const AnimatedBouquet: React.FC<AnimatedBouquetProps> = ({ onComplete }) => {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [hoveredFlowerId, setHoveredFlowerId] = useState<number | null>(null);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  // Generate background sparkles around bouquet
  useEffect(() => {
    const newSparkles = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 240,
      y: -140 + (Math.random() - 0.5) * 160,
      size: 4 + Math.random() * 8,
    }));
    setSparkles(newSparkles);
  }, []);

  const handleFlowerClick = (flower: BouquetFlower, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playFlowerBloom();
    setActiveNote(flower.note);
    setHoveredFlowerId(flower.id);
    setTimeout(() => setActiveNote(null), 3500);
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-6">
      {/* Soft Radiant Glow Backdrop */}
      <div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full pointer-events-none animate-pulse-soft"
        style={{
          top: '-40px',
          background: 'radial-gradient(circle, rgba(244,114,182,0.25) 0%, rgba(216,180,254,0.15) 50%, transparent 75%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Floating Sparkles & Baby's Breath Halo */}
      {sparkles.map((sp) => (
        <motion.div
          key={sp.id}
          animate={{
            opacity: [0.2, 0.9, 0.2],
            scale: [0.8, 1.3, 0.8],
            y: [sp.y, sp.y - 12, sp.y],
          }}
          transition={{
            duration: 2.5 + (sp.id % 4) * 0.5,
            repeat: Infinity,
            delay: sp.id * 0.2,
            ease: 'easeInOut',
          }}
          className="absolute text-amber-300 pointer-events-none z-10"
          style={{
            left: `calc(50% + ${sp.x}px)`,
            top: `calc(50% + ${sp.y}px)`,
            fontSize: `${sp.size}px`,
            filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.8))',
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* Main Bouquet Container */}
      <div className="relative w-80 h-96 sm:w-96 sm:h-[420px] flex items-center justify-center">

        {/* Layer 1: Stem Weaving SVG Background */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 400 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stems */}
          <motion.path
            d="M200 400 C190 320 160 220 130 150"
            stroke="#15803d" strokeWidth="6" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.2 }}
          />
          <motion.path
            d="M200 400 C200 320 200 210 200 130"
            stroke="#16a34a" strokeWidth="7" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.3 }}
          />
          <motion.path
            d="M200 400 C210 320 240 220 270 150"
            stroke="#15803d" strokeWidth="6" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.4 }}
          />
          <motion.path
            d="M200 400 C180 300 130 200 100 140"
            stroke="#22c55e" strokeWidth="5" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.5 }}
          />
          <motion.path
            d="M200 400 C220 300 270 200 300 140"
            stroke="#22c55e" strokeWidth="5" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.6 }}
          />

          {/* Fern Leaves */}
          <motion.path
            d="M170 280 C130 260 100 240 80 210 M150 260 C120 230 90 200 M140 240 C110 210"
            stroke="#4ade80" strokeWidth="3" strokeLinecap="round"
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.8, scale: 1 }} transition={{ duration: 1, delay: 0.8 }}
          />
          <motion.path
            d="M230 280 C270 260 300 240 320 210 M250 260 C280 230 310 200 M260 240 C290 210"
            stroke="#4ade80" strokeWidth="3" strokeLinecap="round"
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.8, scale: 1 }} transition={{ duration: 1, delay: 0.9 }}
          />
        </svg>

        {/* Layer 2: Bouquet Wrapping Cone (Satin Fabric Overlay) */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 1.5, type: 'spring', stiffness: 120 }}
          className="absolute bottom-6 w-44 h-48 sm:w-52 sm:h-56 z-20 pointer-events-none"
        >
          {/* Wrapping paper cone gradient */}
          <svg viewBox="0 0 200 220" fill="none" className="w-full h-full drop-shadow-2xl">
            <path
              d="M30 20 L170 20 L125 210 L75 210 Z"
              fill="url(#wrapGrad)"
              stroke="rgba(244,114,182,0.4)"
              strokeWidth="2"
            />
            <path
              d="M30 20 C60 50 140 50 170 20"
              fill="none"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="3"
            />
            {/* Satin folds */}
            <path d="M70 20 L95 210" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            <path d="M130 20 L105 210" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />

            <defs>
              <linearGradient id="wrapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fecdd3" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#f472b6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#e11d48" stopOpacity="0.95" />
              </linearGradient>
            </defs>
          </svg>

          {/* Satin Ribbon & Bow */}
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-12 left-1/2 -translate-x-1/2 text-4xl sm:text-5xl"
            style={{ filter: 'drop-shadow(0 6px 12px rgba(225,29,72,0.4))' }}
          >
            🎀
          </motion.div>
        </motion.div>

        {/* Layer 3: Flowers Floating In & Blooming */}
        <div className="absolute inset-0 flex items-center justify-center z-30">
          {BOUQUET_FLOWERS.map((flower) => {
            const isHovered = hoveredFlowerId === flower.id;
            return (
              <motion.div
                key={flower.id}
                initial={{
                  x: (Math.random() - 0.5) * 400,
                  y: -300 - Math.random() * 100,
                  scale: 0,
                  rotate: (Math.random() - 0.5) * 180,
                  opacity: 0,
                }}
                animate={{
                  x: flower.x,
                  y: flower.y,
                  scale: isHovered ? flower.scale * 1.25 : flower.scale,
                  rotate: flower.rotation,
                  opacity: 1,
                }}
                transition={{
                  delay: flower.delay,
                  duration: 1.2,
                  type: 'spring',
                  stiffness: 110,
                  damping: 12,
                }}
                onClick={(e) => handleFlowerClick(flower, e)}
                onMouseEnter={() => setHoveredFlowerId(flower.id)}
                onMouseLeave={() => setHoveredFlowerId(null)}
                className="absolute cursor-pointer transition-transform select-none"
                style={{
                  transformOrigin: 'bottom center',
                  filter: isHovered
                    ? `drop-shadow(0 0 16px ${flower.color}) brightness(1.2)`
                    : 'drop-shadow(0 6px 10px rgba(0,0,0,0.3))',
                }}
                title={`Tap ${flower.name}`}
              >
                <div className="relative text-4xl sm:text-5xl">
                  {flower.emoji}

                  {/* Pulsing aura ring on hover */}
                  {isHovered && (
                    <motion.div
                      layoutId="hoverGlow"
                      className="absolute inset-0 rounded-full border-2 border-white/60 animate-ping"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Love Note Toast popup when tapping a flower */}
      <AnimatePresence>
        {activeNote && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="glass-card-romantic px-6 py-3.5 max-w-xs text-center z-40 mt-2 shadow-2xl"
          >
            <p className="font-handwritten text-base sm:text-lg text-pink-200 leading-snug">
              {activeNote}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-white/40 text-xs mt-3 font-body">
        Tap any flower in the bouquet to reveal a secret note 🌸
      </p>
    </div>
  );
};

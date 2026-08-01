import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/audio';

// ✨ Page 3: Enchanted Flower Garden
// Click to plant flowers, scroll to grow them, find hidden love notes

interface FlowerGardenProps {
  onNext: () => void;
  onFlowerFound?: () => void;
}

interface PlantedFlower {
  id: number; x: number; y: number; type: number;
  scale: number; bloomed: boolean;
}

const FLOWER_TYPES = ['🌹', '🌷', '🌸', '🌺', '🌻', '🌼', '🪷', '💐'];

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

const HIDDEN_FLOWERS = [
  { x: 15, y: 30, note: "You found a secret rose! You are my forever 🌹" },
  { x: 80, y: 45, note: "A hidden lotus! Your grace inspires me 🪷" },
  { x: 45, y: 70, note: "A golden sunflower! You light up my world 🌻" },
  { x: 65, y: 25, note: "Cherry blossom magic! Our love blooms eternal 🌸" },
  { x: 30, y: 55, note: "A rare orchid! You're one in a billion 💮" },
  { x: 85, y: 65, note: "A field daisy! Simple joys, infinite love 🌼" },
  { x: 50, y: 40, note: "Tulip garden! My love grows stronger daily 🌷" },
  { x: 10, y: 60, note: "Hibiscus bloom! Tropical love, endless warmth 🌺" },
];

export const FlowerGarden: React.FC<FlowerGardenProps> = ({ onNext, onFlowerFound }) => {
  const [plantedFlowers, setPlantedFlowers] = useState<PlantedFlower[]>([]);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [foundHidden, setFoundHidden] = useState<Set<number>>(new Set());
  const [showSecret, setShowSecret] = useState(false);
  const [driftingPetals, setDriftingPetals] = useState<{ id: number; x: number; delay: number; color: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Drifting petals effect
  useEffect(() => {
    const petals = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      color: ['#fadadd', '#f8c8dc', '#ffd6e8', '#e6d5ff'][Math.floor(Math.random() * 4)],
    }));
    setDriftingPetals(petals);
  }, []);

  // Check if all hidden flowers found
  useEffect(() => {
    if (foundHidden.size === HIDDEN_FLOWERS.length && !showSecret) {
      setShowSecret(true);
      soundEngine.playCelebration();
    }
  }, [foundHidden, showSecret]);

  const handlePlantFlower = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if near a hidden flower
    const hiddenIdx = HIDDEN_FLOWERS.findIndex((hf, idx) => {
      if (foundHidden.has(idx)) return false;
      return Math.abs(hf.x - x) < 8 && Math.abs(hf.y - y) < 8;
    });

    if (hiddenIdx >= 0) {
      setFoundHidden(prev => new Set([...prev, hiddenIdx]));
      setActiveNote(HIDDEN_FLOWERS[hiddenIdx].note);
      soundEngine.playFlowerBloom();
      onFlowerFound?.();
      setTimeout(() => setActiveNote(null), 4000);
      return;
    }

    // Plant a regular flower
    soundEngine.playClick();
    const newFlower: PlantedFlower = {
      id: Date.now(),
      x, y,
      type: Math.floor(Math.random() * FLOWER_TYPES.length),
      scale: 0.8 + Math.random() * 0.5,
      bloomed: false,
    };
    setPlantedFlowers(prev => [...prev, newFlower]);

    // Show random love note occasionally
    if (Math.random() < 0.3) {
      const note = LOVE_NOTES[Math.floor(Math.random() * LOVE_NOTES.length)];
      setActiveNote(note);
      setTimeout(() => setActiveNote(null), 3000);
    }
  }, [foundHidden, onFlowerFound]);

  return (
    <section
      ref={containerRef}
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #1a2040 0%, #1a3030 30%, #1a4020 60%, #0f2810 100%)',
      }}
      onClick={handlePlantFlower}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center pt-8 pb-4 relative z-20 pointer-events-none"
      >
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white glow-text-blush">
          Enchanted Garden 🌸
        </h2>
        <p className="font-body text-sm text-white/40 mt-2">
          Click anywhere to plant flowers • Find all 8 hidden flowers for a surprise
        </p>
        <p className="font-body text-xs text-pink-300/60 mt-1">
          {foundHidden.size} / {HIDDEN_FLOWERS.length} secret flowers found
        </p>
      </motion.div>

      {/* Drifting petals */}
      {driftingPetals.map(petal => (
        <div
          key={petal.id}
          className="absolute pointer-events-none animate-petal-fall"
          style={{
            left: `${petal.x}%`,
            top: '-5%',
            animationDelay: `${petal.delay}s`,
            animationDuration: `${12 + Math.random() * 6}s`,
            zIndex: 15,
          }}
        >
          <div
            className="w-3 h-4 rounded-full"
            style={{
              background: petal.color,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}

      {/* Hidden flower indicators (subtle glow hints) */}
      {HIDDEN_FLOWERS.map((hf, idx) => (
        !foundHidden.has(idx) && (
          <div
            key={idx}
            className="absolute pointer-events-none animate-pulse-soft"
            style={{
              left: `${hf.x}%`,
              top: `${hf.y}%`,
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
              transform: 'translate(-50%, -50%)',
              zIndex: 5,
            }}
          />
        )
      ))}

      {/* Found hidden flowers */}
      {HIDDEN_FLOWERS.map((hf, idx) => (
        foundHidden.has(idx) && (
          <motion.div
            key={`found-${idx}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="absolute text-3xl pointer-events-none animate-flower-pulse"
            style={{
              left: `${hf.x}%`,
              top: `${hf.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 12,
            }}
          >
            {FLOWER_TYPES[idx % FLOWER_TYPES.length]}
          </motion.div>
        )
      ))}

      {/* Planted flowers */}
      <AnimatePresence>
        {plantedFlowers.map(flower => (
          <motion.div
            key={flower.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: flower.scale, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="absolute pointer-events-none"
            style={{
              left: `${flower.x}%`,
              top: `${flower.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${24 + flower.scale * 10}px`,
              zIndex: 10,
            }}
          >
            {FLOWER_TYPES[flower.type]}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Ground layer */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '30%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(30, 60, 20, 0.6) 40%, rgba(20, 50, 15, 0.9) 100%)',
          zIndex: 3,
        }}
      />

      {/* Pre-placed garden flowers */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 4, height: '25%' }}>
        {Array.from({ length: 25 }, (_, i) => (
          <motion.div
            key={`garden-${i}`}
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 200 }}
            className="absolute animate-float"
            style={{
              left: `${(i * 4.2) % 100}%`,
              bottom: `${5 + Math.random() * 15}%`,
              fontSize: `${20 + Math.random() * 16}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${5 + Math.random() * 3}s`,
            }}
          >
            {FLOWER_TYPES[i % FLOWER_TYPES.length]}
          </motion.div>
        ))}
      </div>

      {/* Butterflies */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={`butterfly-${i}`}
          animate={{
            x: [0, 100 + i * 50, -50, 80, 0],
            y: [0, -60, -30, -80, 0],
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute pointer-events-none text-xl"
          style={{
            left: `${20 + i * 25}%`,
            top: `${30 + i * 15}%`,
            zIndex: 16,
          }}
        >
          <span className="animate-butterfly-wings inline-block">🦋</span>
        </motion.div>
      ))}

      {/* Love note popup */}
      <AnimatePresence>
        {activeNote && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 glass-card-romantic px-6 py-4 max-w-sm text-center pointer-events-none"
            style={{ zIndex: 30 }}
          >
            <p className="font-handwritten text-lg sm:text-xl text-pink-200">
              {activeNote}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secret message when all found */}
      <AnimatePresence>
        {showSecret && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 40, background: 'rgba(10, 5, 20, 0.9)', backdropFilter: 'blur(10px)' }}
            onClick={() => setShowSecret(false)}
          >
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring' }}
              className="glass-card-romantic p-8 max-w-md text-center"
            >
              <div className="text-5xl mb-4">🌺✨🌸</div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                You Found All the Flowers! 🎉
              </h3>
              <p className="font-handwritten text-lg text-pink-200 leading-relaxed">
                "Just like you found every hidden flower in this garden, you've found every hidden corner of my heart. You are the garden I never want to leave. ❤️ — Om"
              </p>
              <p className="text-white/30 text-xs mt-4 font-body">Tap to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-8 right-8 z-20"
      >
        <button
          onClick={(e) => { e.stopPropagation(); soundEngine.playPageSwitch(); onNext(); }}
          className="glass-button text-sm"
        >
          To the Night Sky 🌙
        </button>
      </motion.div>
    </section>
  );
};

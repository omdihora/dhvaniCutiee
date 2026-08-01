import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ✨ Random compliment notifications

const COMPLIMENTS = [
  "Dhvani, you're absolutely radiant ✨",
  "The most beautiful smile in the world 💕",
  "You make the world a better place 🌸",
  "Every day with you is a gift 🎁",
  "Your kindness is magical ✨",
  "The universe got lucky when it made you 💫",
  "You are brighter than any star 🌟",
  "Your heart is pure gold 💛",
  "You inspire everyone around you 🌺",
  "Simply extraordinary, that's you ❤️",
  "The prettiest flower in any garden 🌹",
  "Your laugh could light up the darkest room 💕",
];

interface ComplimentNotificationProps {
  enabled: boolean;
}

export const ComplimentNotification: React.FC<ComplimentNotificationProps> = ({ enabled }) => {
  const [activeCompliment, setActiveCompliment] = useState<string | null>(null);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());

  const showCompliment = useCallback(() => {
    // Pick unused compliment
    const available = COMPLIMENTS.map((_, i) => i).filter(i => !usedIndices.has(i));
    if (available.length === 0) {
      setUsedIndices(new Set());
      return;
    }
    const idx = available[Math.floor(Math.random() * available.length)];
    setUsedIndices(prev => new Set([...prev, idx]));
    setActiveCompliment(COMPLIMENTS[idx]);

    // Auto-dismiss
    setTimeout(() => setActiveCompliment(null), 4000);
  }, [usedIndices]);

  useEffect(() => {
    if (!enabled) return;

    // Show first one after 15 seconds, then every 35-60 seconds
    const firstTimeout = setTimeout(showCompliment, 15000);

    const interval = setInterval(() => {
      if (Math.random() < 0.6) showCompliment();
    }, 35000 + Math.random() * 25000);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, [enabled, showCompliment]);

  return (
    <AnimatePresence>
      {activeCompliment && (
        <motion.div
          initial={{ opacity: 0, x: 60, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 60, y: -10 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed top-6 right-6 z-50 max-w-xs"
          onClick={() => setActiveCompliment(null)}
        >
          <div
            className="glass-card-romantic px-5 py-3 flex items-center gap-3"
            style={{ borderRadius: '16px' }}
          >
            <span className="text-xl flex-shrink-0">💝</span>
            <p className="font-handwritten text-base text-pink-200 leading-snug">
              {activeCompliment}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

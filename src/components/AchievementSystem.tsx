import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/audio';

// ✨ Heart-shaped achievement system

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_page', title: 'Journey Begins', description: 'Started the love story', emoji: '🌅', unlocked: false },
  { id: 'gallery_viewed', title: 'Memory Keeper', description: 'Explored the photo gallery', emoji: '📸', unlocked: false },
  { id: 'flower_found', title: 'Garden Explorer', description: 'Found a hidden flower', emoji: '🌸', unlocked: false },
  { id: 'star_found', title: 'Star Gazer', description: 'Discovered a star memory', emoji: '⭐', unlocked: false },
  { id: 'lantern_released', title: 'Wish Maker', description: 'Released a lantern', emoji: '🏮', unlocked: false },
  { id: 'letter_read', title: 'Love Reader', description: 'Read the love letter', emoji: '💌', unlocked: false },
  { id: 'gift_opened', title: 'Surprise Unwrapped', description: 'Opened the gift box', emoji: '🎁', unlocked: false },
  { id: 'all_pages', title: 'Love Explorer', description: 'Visited every page', emoji: '💕', unlocked: false },
];

interface AchievementSystemProps {
  unlockedIds: Set<string>;
  onUnlock: (id: string) => void;
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({ unlockedIds, onUnlock }) => {
  const [showToast, setShowToast] = useState<Achievement | null>(null);
  const [lastUnlocked, setLastUnlocked] = useState<string | null>(null);

  // Watch for new unlocks
  useEffect(() => {
    const newest = [...unlockedIds].find(id => id !== lastUnlocked && !ACHIEVEMENTS.find(a => a.id === id)?.unlocked);
    if (newest && newest !== lastUnlocked) {
      const achievement = ACHIEVEMENTS.find(a => a.id === newest);
      if (achievement) {
        setLastUnlocked(newest);
        setShowToast(achievement);
        soundEngine.playAchievement();
        setTimeout(() => setShowToast(null), 3500);
      }
    }
  }, [unlockedIds, lastUnlocked]);

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="glass-card-romantic px-6 py-4 flex items-center gap-4" style={{ borderRadius: '20px' }}>
            <div className="text-3xl animate-heartbeat">{showToast.emoji}</div>
            <div>
              <p className="font-display text-sm font-bold text-white">
                Achievement Unlocked! ✨
              </p>
              <p className="font-body text-xs text-white/70">
                {showToast.title} — {showToast.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { ACHIEVEMENTS };

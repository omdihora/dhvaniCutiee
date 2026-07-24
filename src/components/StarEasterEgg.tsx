import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface StarEasterEggProps {
  message: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

export const StarEasterEgg: React.FC<StarEasterEggProps> = ({
  message,
  top,
  bottom,
  left,
  right,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundEngine.playClick();
  };

  return (
    <div
      className="absolute z-30 cursor-pointer pointer-events-auto"
      style={{ top, bottom, left, right }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        soundEngine.playHeartPop();
        setIsHovered(!isHovered);
      }}
    >
      {/* Glowing Star Icon */}
      <motion.div
        animate={{
          scale: isHovered ? [1, 1.4, 1.2] : [1, 1.25, 1],
          rotate: isHovered ? 180 : [0, 45, 0],
        }}
        transition={{ repeat: isHovered ? 0 : Infinity, duration: 3, ease: 'easeInOut' }}
        className="p-2 rounded-full glass-card hover:bg-pink-500/20 border border-pink-500/30 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-colors"
      >
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 fill-amber-300/40" />
      </motion.div>

      {/* Floating Tooltip Message */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap glass-card bg-[#1b0826]/95 border border-pink-500/40 text-pink-100 text-xs font-semibold px-3 py-1.5 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center gap-1.5 pointer-events-none"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

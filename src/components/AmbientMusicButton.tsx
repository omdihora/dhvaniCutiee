import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/audio';

// ✨ Floating ambient music toggle button

export const AmbientMusicButton: React.FC = () => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    const newMuted = soundEngine.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      soundEngine.startAmbientBGM();
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center
        transition-all duration-300"
      style={{
        background: isHovered
          ? 'linear-gradient(135deg, rgba(255,214,232,0.25), rgba(230,213,255,0.25))'
          : 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(16px)',
        border: `1px solid rgba(250, 218, 221, ${isHovered ? 0.4 : 0.15})`,
        boxShadow: isMuted
          ? '0 4px 12px rgba(0,0,0,0.2)'
          : '0 4px 20px rgba(236, 72, 153, 0.2), 0 0 30px rgba(216, 180, 254, 0.1)',
      }}
      title={isMuted ? 'Unmute music' : 'Mute music'}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={isMuted ? 'muted' : 'playing'}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
          className="text-lg"
        >
          {isMuted ? '🔇' : '♫'}
        </motion.span>
      </AnimatePresence>

      {/* Pulsing ring when playing */}
      {!isMuted && (
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border border-pink-400/30"
        />
      )}
    </motion.button>
  );
};

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ButterflyGuideProps {
  currentPageIndex: number;
}

export const ButterflyGuide: React.FC<ButterflyGuideProps> = ({ currentPageIndex }) => {
  const [position, setPosition] = useState({ x: window.innerWidth * 0.2, y: window.innerHeight * 0.3 });
  const [guideMessage, setGuideMessage] = useState<string | null>(null);

  useEffect(() => {
    // Dynamic guidance messages based on chapter discovery
    const messages: Record<number, string> = {
      0: "Touch the sensor to unlock RelationshipOS ✨",
      1: "Booting kernel... Establishing love connection ❤️",
      2: "Follow me into our magical love story 🌸",
      3: "An unread letter awaits your touch 💌",
      4: "Tap the rose to make it bloom 🌹",
      5: "Make a wish upon the shooting star 🌠",
      7: "Walk down our memory timeline 📜",
      10: "Interactive questions handcrafted for you ❓",
      17: "Tap anywhere in the garden to plant new flowers 🌸",
      19: "Royal Flower Celebration for Girlfriend's Day 💐",
      20: "Look high above to see our World Heart ❤️",
      21: "Explore our Memory Museum Gallery 🖼️",
    };

    setGuideMessage(messages[currentPageIndex] || "Follow the butterfly of light ✨");

    const timer = setTimeout(() => {
      setGuideMessage(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentPageIndex]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Smooth butterfly lag behind cursor
      setPosition({
        x: e.clientX + 35,
        y: e.clientY - 35,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Floating Butterfly of Light */}
      <motion.div
        animate={{
          x: position.x,
          y: position.y,
        }}
        transition={{ type: 'spring', stiffness: 60, damping: 15 }}
        className="absolute top-0 left-0"
      >
        <div className="relative flex items-center gap-2">
          {/* Glowing Butterfly Mesh */}
          <div className="text-3xl sm:text-4xl filter drop-shadow-[0_0_20px_rgba(212,175,55,0.9)] animate-butterfly">
            <span className="animate-butterfly-wings inline-block">🦋</span>
          </div>

          {/* Golden Sparkle Trail */}
          <div className="absolute -inset-2 rounded-full bg-[#d4af37]/20 blur-md pointer-events-none animate-pulse" />

          {/* Guidance Message Speech Bubble */}
          <AnimatePresence>
            {guideMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 10 }}
                className="glass-pill bg-[#0f051d]/90 border border-[#f7e7ce]/40 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#f7e7ce] shadow-[0_0_20px_rgba(212,175,55,0.3)] whitespace-nowrap"
              >
                <span>{guideMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ButterflyGuide;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';

export const HiddenHeartEasterEgg: React.FC = () => {
  const [found, setFound] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false);

  const handleDiscover = () => {
    if (found) return;
    setFound(true);
    soundEngine.playCelebration();

    // Confetti burst
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#f43f5e', '#a855f7', '#fbbf24', '#ffffff'],
    });

    // Floating hearts effect
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5, x: 0.3 },
        colors: ['#fadadd', '#f8c8dc', '#ffd6e8'],
      });
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5, x: 0.7 },
        colors: ['#fadadd', '#f8c8dc', '#ffd6e8'],
      });
    }, 300);

    setTimeout(() => setShowPopup(true), 500);
  };

  return (
    <>
      {/* The tiny hidden heart — positioned near footer area */}
      {!found && (
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="fixed bottom-8 right-8 z-30 cursor-pointer"
          onClick={handleDiscover}
          title=""
        >
          <div className="w-3 h-3 relative">
            <Heart className="w-3 h-3 text-pink-400/50 fill-pink-400/50" />
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-pink-400/20 blur-sm" />
          </div>
        </motion.div>
      )}

      {/* Achievement Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={() => {
              if (!showSecondary) {
                setShowSecondary(true);
              } else {
                setShowPopup(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.7, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 30 }}
              className="glass-card-apple bg-[#14061f]/95 border-2 border-pink-500/50 rounded-[32px] p-8 sm:p-10 max-w-md text-center shadow-[0_0_100px_rgba(236,72,153,0.5)] space-y-5 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-pink-300/60 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Achievement Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 10, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 border-2 border-pink-400/50 flex items-center justify-center mx-auto text-4xl shadow-[0_0_30px_rgba(236,72,153,0.5)]"
              >
                🎉
              </motion.div>

              <AnimatePresence mode="wait">
                {!showSecondary ? (
                  <motion.div
                    key="primary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white glow-text-pink">
                      Secret Unlocked!
                    </h3>
                    <p className="text-lg text-pink-200 font-medium">
                      You found the hidden piece of my heart ❤️
                    </p>

                    <div className="flex items-center justify-center gap-2 text-xs font-code text-pink-300/60 pt-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Achievement unlocked • Tap to continue</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="secondary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-pink-500/20 border border-pink-400/30 flex items-center justify-center mx-auto">
                      <Heart className="w-6 h-6 text-rose-400 fill-rose-400 animate-pulse" />
                    </div>
                    <p className="text-base text-pink-100/90 leading-relaxed font-light italic">
                      "If you found this, it means you explored every little detail... just like I notice every little thing about you."
                    </p>
                    <p className="font-cursive text-xl text-rose-300">— Om ❤️</p>

                    <button
                      onClick={() => setShowPopup(false)}
                      className="mt-4 glass-button-romantic py-2.5 px-6 rounded-full text-white text-sm font-medium border border-pink-300/30"
                    >
                      Close ❤️
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  opacity: number;
}

interface ShootingStarProps {
  onNext?: () => void;
}

export const ShootingStar: React.FC<ShootingStarProps> = ({ onNext }) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStarPos, setShootingStarPos] = useState<{ x: number; y: number; active: boolean; id: number }>({
    x: -100, y: 100, active: false, id: 0
  });
  const [caught, setCaught] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const shootingRef = useRef({ x: -100, y: 300, vx: 4, vy: -1.5, active: false });

  useEffect(() => {
    const generated: Star[] = [];
    for (let i = 0; i < 90; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.8,
        twinkleSpeed: Math.random() * 3 + 2,
        opacity: Math.random() * 0.7 + 0.3,
      });
    }
    setStars(generated);
  }, []);

  useEffect(() => {
    if (caught) return;

    const launchStar = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const startX = -50;
      const startY = Math.random() * rect.height * 0.5 + rect.height * 0.2;

      shootingRef.current = {
        x: startX,
        y: startY,
        vx: 3.5 + Math.random() * 2,
        vy: -1.2 - Math.random() * 1.5,
        active: true,
      };

      const animate = () => {
        const s = shootingRef.current;
        if (!s.active) return;

        s.x += s.vx;
        s.y += s.vy;

        setShootingStarPos({ x: s.x, y: s.y, active: true, id: Date.now() });

        if (s.x > (rect?.width || 1200) + 100 || s.y < -100) {
          s.active = false;
          setShootingStarPos(prev => ({ ...prev, active: false }));
          return;
        }

        animFrameRef.current = requestAnimationFrame(animate);
      };

      animate();
    };

    const interval = setInterval(() => {
      if (!shootingRef.current.active && !caught) {
        launchStar();
      }
    }, 3500);

    const timeout = setTimeout(launchStar, 1200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [caught]);

  const handleCatchStar = useCallback(() => {
    if (caught) return;
    shootingRef.current.active = false;
    setCaught(true);
    soundEngine.playStarCatch();

    setTimeout(() => {
      setShowMessage(true);
    }, 400);
  }, [caught]);

  const handleNextPage = () => {
    soundEngine.playPageSwitch();
    if (onNext) onNext();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden my-auto">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-pink-100 text-xs font-code mb-4 shadow-sm">
          <span>🌠</span>
          <span>PAGE 6 // NIGHT_SKY_SHOOTING_STAR</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
          Catch a Shooting Star
        </h2>
        {!caught && (
          <p className="text-purple-200/80 text-sm mt-2 font-code">
            Click/tap the glowing shooting star as it flies across the sky ✨
          </p>
        )}
      </motion.div>

      {/* Night Sky Interactive Window */}
      <div
        ref={containerRef}
        className="relative w-full max-w-3xl h-80 sm:h-96 rounded-[32px] overflow-hidden border border-purple-300/20 shadow-[0_20px_60px_rgba(139,92,246,0.25)] my-4"
        style={{
          background: 'linear-gradient(to bottom, #0c0118, #120926, #0e0520)',
        }}
      >
        {/* Background Twinkling Stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white star-sparkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDuration: `${star.twinkleSpeed}s`,
              animationDelay: `${star.id * 0.1}s`,
              boxShadow: `0 0 ${star.size * 3}px rgba(255,255,255,0.5)`,
            }}
          />
        ))}

        {/* Crescent Moon */}
        <div className="absolute top-8 right-12 w-16 h-16 rounded-full bg-amber-100/90 shadow-[0_0_40px_rgba(251,191,36,0.5),0_0_80px_rgba(251,191,36,0.2)]">
          <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-[#0c0118]" style={{ transform: 'translate(4px, -2px)' }} />
        </div>

        {/* Shooting Star Flying Element */}
        {shootingStarPos.active && !caught && (
          <motion.div
            className="absolute cursor-pointer z-20"
            style={{
              left: shootingStarPos.x,
              top: shootingStarPos.y,
            }}
            onClick={handleCatchStar}
            whileHover={{ scale: 1.5 }}
          >
            <div className="relative">
              <div className="w-5 h-5 rounded-full bg-white shadow-[0_0_25px_rgba(255,255,255,1),0_0_50px_rgba(251,191,36,0.8)]" />
              <div
                className="absolute top-1.5 right-full w-32 h-0.5 opacity-90"
                style={{
                  background: 'linear-gradient(to left, rgba(255,255,255,0.9), rgba(251,191,36,0.5), transparent)',
                }}
              />
              <div
                className="absolute top-2.5 right-full w-20 h-0.5 opacity-50"
                style={{
                  background: 'linear-gradient(to left, rgba(255,255,255,0.6), transparent)',
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Star Burst Effect */}
        <AnimatePresence>
          {caught && !showMessage && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3.5, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-amber-300/90 blur-md"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Wish Message & Progression Button */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 glass-card-apple rounded-[28px] p-6 sm:p-8 text-center max-w-md border border-purple-300/30 shadow-[0_20px_60px_rgba(139,92,246,0.3)] z-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 10 }}
              className="text-4xl mb-3"
            >
              ⭐
            </motion.div>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-code text-purple-200/80 font-bold">WISH_FULFILLED</span>
            </div>
            <p className="text-2xl sm:text-3xl font-cursive text-purple-200 font-bold leading-relaxed">
              "I already used my wish... I wished for you ❤️"
            </p>

            {onNext && (
              <div className="pt-6 mt-4 border-t border-purple-300/20 flex justify-center">
                <button
                  onClick={handleNextPage}
                  className="glass-button-romantic px-7 py-3.5 rounded-full text-white font-medium text-base flex items-center gap-3 shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Proceed to Heart Sync Chamber</span>
                  <ArrowRight className="w-4 h-4 text-purple-300" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

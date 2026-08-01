import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/audio';

// ✨ Page 4: Dreamy Night Sky with Clickable Star Memories

interface NightSkyMemoriesProps {
  onNext: () => void;
  onStarFound?: () => void;
}

interface StarData {
  id: number; x: number; y: number; size: number;
  brightness: number; twinkleSpeed: number;
  isSpecial: boolean; message?: string; title?: string;
}

const STAR_MESSAGES = [
  { title: 'First Smile ✨', message: 'The moment I saw you smile for the first time, I knew my world had changed forever.' },
  { title: 'Late Night Talks 🌙', message: 'Those 3am conversations where we shared our dreams, fears, and everything in between.' },
  { title: 'Your Laugh 💕', message: 'Your laugh is like a melody that plays on repeat in my heart.' },
  { title: 'Missing You 💫', message: 'Even the stars seem dim when I\'m missing you. Distance is just a number when the heart is full.' },
  { title: 'Our Promise ❤️', message: 'We promised to grow together, to face every storm together. That promise is my anchor.' },
  { title: 'Your Kindness 🌸', message: 'The way you care about everyone around you makes me fall deeper in love every day.' },
  { title: 'Dream Together 🌟', message: 'Every dream I have, you\'re in it. Every plan I make, you\'re part of it.' },
  { title: 'Forever Yours 💗', message: 'If the stars could spell out one word, they would spell your name. You are my universe.' },
];

export const NightSkyMemories: React.FC<NightSkyMemoriesProps> = ({ onNext, onStarFound }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const starsRef = useRef<StarData[]>([]);
  const [selectedStar, setSelectedStar] = useState<StarData | null>(null);
  const [foundStars, setFoundStars] = useState<Set<number>>(new Set());
  const [shootingStarActive, setShootingStarActive] = useState(false);

  // Generate stars
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const regularStars: StarData[] = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * w,
      y: Math.random() * h * 0.85,
      size: 0.5 + Math.random() * 2,
      brightness: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 1 + Math.random() * 3,
      isSpecial: false,
    }));

    const specialStars: StarData[] = STAR_MESSAGES.map((msg, i) => ({
      id: 1000 + i,
      x: (w * 0.1) + Math.random() * (w * 0.8),
      y: (h * 0.08) + Math.random() * (h * 0.6),
      size: 3 + Math.random() * 2,
      brightness: 0.8,
      twinkleSpeed: 1.5,
      isSpecial: true,
      message: msg.message,
      title: msg.title,
    }));

    starsRef.current = [...regularStars, ...specialStars];
  }, []);

  // Shooting star effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShootingStarActive(true);
      setTimeout(() => setShootingStarActive(false), 1500);
    }, 6000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let time = 0;

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      time += 0.016;

      // Night sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#050510');
      grad.addColorStop(0.3, '#0a0a25');
      grad.addColorStop(0.6, '#0f0830');
      grad.addColorStop(0.8, '#1a0a2e');
      grad.addColorStop(1, '#150820');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Milky way band
      ctx.save();
      ctx.globalAlpha = 0.06;
      const milkyGrad = ctx.createLinearGradient(0, 0, w, h * 0.5);
      milkyGrad.addColorStop(0, 'transparent');
      milkyGrad.addColorStop(0.3, '#e6d5ff');
      milkyGrad.addColorStop(0.5, '#ffd6e8');
      milkyGrad.addColorStop(0.7, '#e6d5ff');
      milkyGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = milkyGrad;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.1);
      for (let x = 0; x <= w; x += 5) {
        const y = h * 0.35 + Math.sin(x * 0.003) * h * 0.12 + Math.sin(x * 0.001) * h * 0.08;
        ctx.lineTo(x, y);
      }
      for (let x = w; x >= 0; x -= 5) {
        const y = h * 0.35 + Math.sin(x * 0.003) * h * 0.12 + Math.sin(x * 0.001) * h * 0.08 + h * 0.08;
        ctx.lineTo(x, y);
      }
      ctx.fill();
      ctx.restore();

      // Moon
      const moonX = w * 0.85;
      const moonY = h * 0.12;
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 100);
      moonGlow.addColorStop(0, 'rgba(255, 255, 240, 0.25)');
      moonGlow.addColorStop(0.3, 'rgba(255, 255, 240, 0.08)');
      moonGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = moonGlow;
      ctx.fillRect(moonX - 100, moonY - 100, 200, 200);

      ctx.beginPath();
      ctx.arc(moonX, moonY, 25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 240, 0.9)';
      ctx.fill();

      // Stars
      starsRef.current.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.id) * 0.3 + 0.7;
        const alpha = star.brightness * twinkle;
        const s = star.size * (0.8 + twinkle * 0.2);

        if (star.isSpecial) {
          // Special stars have a colored glow
          const isFound = foundStars.has(star.id);
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, s * 6);
          glow.addColorStop(0, isFound
            ? `rgba(251, 191, 36, ${alpha * 0.6})`
            : `rgba(236, 72, 153, ${alpha * 0.4})`);
          glow.addColorStop(0.5, isFound
            ? `rgba(251, 191, 36, ${alpha * 0.15})`
            : `rgba(216, 180, 254, ${alpha * 0.1})`);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(star.x, star.y, s * 6, 0, Math.PI * 2);
          ctx.fill();

          // Core
          ctx.fillStyle = isFound
            ? `rgba(251, 191, 36, ${alpha})`
            : `rgba(255, 200, 220, ${alpha})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, s, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, s, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Fireflies at bottom
      for (let i = 0; i < 8; i++) {
        const fx = (w * 0.1) + Math.sin(time * 0.3 + i * 1.5) * (w * 0.3) + (i / 8) * w * 0.6;
        const fy = h * 0.75 + Math.cos(time * 0.5 + i * 2) * 30;
        const fglow = (Math.sin(time * 2 + i * 3) + 1) * 0.5;

        const fGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, 12);
        fGrad.addColorStop(0, `rgba(251, 191, 36, ${fglow * 0.6})`);
        fGrad.addColorStop(0.5, `rgba(251, 191, 36, ${fglow * 0.15})`);
        fGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = fGrad;
        ctx.beginPath();
        ctx.arc(fx, fy, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 230, 150, ${fglow * 0.8})`;
        ctx.beginPath();
        ctx.arc(fx, fy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [foundStars]);

  // Click handler for stars
  const handleCanvasClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Find nearest special star
    const specialStars = starsRef.current.filter(s => s.isSpecial);
    for (const star of specialStars) {
      const dist = Math.sqrt((clickX - star.x) ** 2 + (clickY - star.y) ** 2);
      if (dist < 30) {
        soundEngine.playStarReveal();
        setSelectedStar(star);
        setFoundStars(prev => new Set([...prev, star.id]));
        onStarFound?.();
        return;
      }
    }
  };

  return (
    <section className="h-screen w-full relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onClick={handleCanvasClick}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-0 right-0 text-center z-10 pointer-events-none"
      >
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white glow-text-lavender">
          Night Sky Memories 🌙
        </h2>
        <p className="font-body text-sm text-white/40 mt-2">
          Click the glowing stars to reveal memories • {foundStars.size} / {STAR_MESSAGES.length} found
        </p>
      </motion.div>

      {/* Shooting star */}
      <AnimatePresence>
        {shootingStarActive && (
          <motion.div
            initial={{ x: '-10%', y: '10%', opacity: 0 }}
            animate={{ x: '110%', y: '60%', opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeIn' }}
            className="absolute pointer-events-none z-10"
            style={{ top: 0, left: 0 }}
          >
            <div
              className="w-2 h-2 bg-white rounded-full"
              style={{
                boxShadow: '0 0 10px #fff, 0 0 20px #ffd6e8, -20px 0 30px rgba(255,255,255,0.3), -40px 0 20px rgba(255,255,255,0.1)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Star message popup */}
      <AnimatePresence>
        {selectedStar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-30"
            style={{ background: 'rgba(5, 5, 16, 0.7)', backdropFilter: 'blur(10px)' }}
            onClick={() => setSelectedStar(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="glass-card-romantic p-6 sm:p-8 max-w-sm text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="font-display text-xl font-bold text-white mb-2">
                {selectedStar.title}
              </h3>
              <p className="font-handwritten text-lg text-pink-200/80 leading-relaxed">
                "{selectedStar.message}"
              </p>
              <button
                onClick={() => setSelectedStar(null)}
                className="mt-4 text-white/40 text-xs font-body hover:text-white/60 transition-colors"
              >
                Close ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 right-8 z-20"
      >
        <button
          onClick={() => { soundEngine.playPageSwitch(); onNext(); }}
          className="glass-button text-sm"
        >
          Visit the Lake 🪷
        </button>
      </motion.div>
    </section>
  );
};

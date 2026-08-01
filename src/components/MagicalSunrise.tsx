import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/audio';

// ✨ Page 0: Magical Sunrise Homepage
// A cinematic sunrise over a flower garden with floating petals,
// butterflies, fireflies, and a glowing heart that transforms into text

interface MagicalSunriseProps {
  onBegin: () => void;
}

interface FloatingPetal {
  id: number; x: number; y: number; size: number;
  speedX: number; speedY: number; rotation: number;
  rotSpeed: number; color: string; opacity: number;
}

interface Butterfly {
  id: number; x: number; y: number;
  phase: number; speed: number; wingPhase: number;
}

interface Firefly {
  id: number; x: number; y: number;
  vx: number; vy: number; glow: number; phase: number;
}

const PETAL_COLORS = ['#fadadd', '#f8c8dc', '#ffd6e8', '#e6d5ff', '#f4a0b5', '#ffb6c1'];
const TITLE_TEXT = "For the most beautiful girl, Dhvani ❤️";

export const MagicalSunrise: React.FC<MagicalSunriseProps> = ({ onBegin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const petalsRef = useRef<FloatingPetal[]>([]);
  const butterfliesRef = useRef<Butterfly[]>([]);
  const firefliesRef = useRef<Firefly[]>([]);
  const timeRef = useRef(0);

  const [phase, setPhase] = useState<'sunrise' | 'heart' | 'title' | 'ready'>('sunrise');
  const [displayedText, setDisplayedText] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [hoverParticles, setHoverParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Initialize particles
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    petalsRef.current = Array.from({ length: 60 }, (_, i) => ({
      id: i, x: Math.random() * w, y: Math.random() * h - h * 0.2,
      size: 3 + Math.random() * 6,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: 0.3 + Math.random() * 0.7,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 3,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      opacity: 0.4 + Math.random() * 0.5,
    }));

    butterfliesRef.current = Array.from({ length: 5 }, (_, i) => ({
      id: i, x: Math.random() * w, y: h * 0.4 + Math.random() * h * 0.3,
      phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.5,
      wingPhase: Math.random() * Math.PI * 2,
    }));

    firefliesRef.current = Array.from({ length: 15 }, (_, i) => ({
      id: i, x: Math.random() * w, y: h * 0.5 + Math.random() * h * 0.4,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      glow: Math.random(), phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  // Phase sequence
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('heart'), 1500);
    const t2 = setTimeout(() => setPhase('title'), 3500);
    const t3 = setTimeout(() => setPhase('ready'), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (phase !== 'title' && phase !== 'ready') return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= TITLE_TEXT.length) {
        setDisplayedText(TITLE_TEXT.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 55);
    return () => clearInterval(interval);
  }, [phase]);

  // Canvas animation — sunrise sky, garden, petals
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

    const drawSunrise = (w: number, h: number, t: number) => {
      // Sky gradient that shifts over time (sunrise effect)
      const progress = Math.min(1, t / 3);
      const gradient = ctx.createLinearGradient(0, 0, 0, h);

      // Interpolate from night to sunrise
      const nightTop = [15, 5, 30];
      const sunriseTop = [45, 20, 80];
      const sunriseMid = [180, 100, 120];
      const sunriseHorizon = [249, 197, 141];
      const sunriseBottom = [255, 240, 230];

      const lerp = (a: number[], b: number[], t: number) =>
        a.map((v, i) => Math.round(v + (b[i] - v) * t));

      const top = lerp(nightTop, sunriseTop, progress);
      const mid = lerp([30, 10, 50], sunriseMid, progress);
      const horizon = lerp([50, 20, 60], sunriseHorizon, progress);
      const bottom = lerp([20, 10, 35], sunriseBottom, progress);

      gradient.addColorStop(0, `rgb(${top.join(',')})`);
      gradient.addColorStop(0.35, `rgb(${mid.join(',')})`);
      gradient.addColorStop(0.55, `rgb(${horizon.join(',')})`);
      gradient.addColorStop(0.7, `rgb(${bottom.join(',')})`);
      gradient.addColorStop(1, `rgb(30, 80, 40)`); // Garden green

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Sun
      if (progress > 0.3) {
        const sunY = h * 0.55 - (progress - 0.3) * h * 0.2;
        const sunAlpha = Math.min(1, (progress - 0.3) * 2);

        // Sun glow
        const sunGlow = ctx.createRadialGradient(w / 2, sunY, 0, w / 2, sunY, 200);
        sunGlow.addColorStop(0, `rgba(255, 220, 150, ${sunAlpha * 0.8})`);
        sunGlow.addColorStop(0.3, `rgba(255, 180, 100, ${sunAlpha * 0.3})`);
        sunGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = sunGlow;
        ctx.fillRect(0, 0, w, h);

        // Sun disc
        ctx.beginPath();
        ctx.arc(w / 2, sunY, 40 + progress * 20, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 230, 170, ${sunAlpha})`;
        ctx.fill();
      }

      // Distant mountains
      ctx.fillStyle = `rgba(100, 60, 100, ${0.3 + progress * 0.2})`;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.6);
      for (let x = 0; x <= w; x += 2) {
        const y = h * 0.6 - Math.sin(x * 0.003) * 40 - Math.sin(x * 0.007) * 25 - Math.sin(x * 0.001) * 50;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Garden ground
      const gardenGrad = ctx.createLinearGradient(0, h * 0.7, 0, h);
      gardenGrad.addColorStop(0, `rgba(40, 90, 40, ${0.5 + progress * 0.5})`);
      gardenGrad.addColorStop(0.5, `rgba(30, 70, 30, ${0.6 + progress * 0.4})`);
      gardenGrad.addColorStop(1, `rgba(20, 50, 20, 1)`);
      ctx.fillStyle = gardenGrad;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.72);
      for (let x = 0; x <= w; x += 3) {
        const y = h * 0.72 + Math.sin(x * 0.02 + t * 0.5) * 8 + Math.sin(x * 0.005) * 15;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Ground flowers (emojis rendered as colored shapes)
      if (progress > 0.4) {
        const flowerColors = ['#e11d48', '#ec4899', '#f9a8d4', '#fbbf24', '#c084fc', '#f43f5e'];
        for (let i = 0; i < 30; i++) {
          const fx = (i * 137.5) % w;
          const baseY = h * 0.72 + Math.sin(fx * 0.02) * 8 + Math.sin(fx * 0.005) * 15;
          const fy = baseY + Math.random() * 5;
          const fSize = 3 + Math.random() * 5;
          const bloom = Math.min(1, (progress - 0.4) * 3 + Math.sin(t + i) * 0.1);

          ctx.globalAlpha = bloom * 0.8;

          // Stem
          ctx.strokeStyle = '#3a7a3a';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(fx, fy);
          ctx.lineTo(fx, fy - fSize * 3 * bloom);
          ctx.stroke();

          // Flower head
          const color = flowerColors[i % flowerColors.length];
          ctx.fillStyle = color;
          for (let p = 0; p < 5; p++) {
            const angle = (p / 5) * Math.PI * 2 + t * 0.3;
            ctx.beginPath();
            ctx.ellipse(
              fx + Math.cos(angle) * fSize * 0.5 * bloom,
              fy - fSize * 3 * bloom + Math.sin(angle) * fSize * 0.5 * bloom,
              fSize * 0.4 * bloom, fSize * 0.6 * bloom,
              angle, 0, Math.PI * 2
            );
            ctx.fill();
          }
          // Center
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(fx, fy - fSize * 3 * bloom, fSize * 0.25 * bloom, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalAlpha = 1;
        }
      }
    };

    const drawPetal = (p: FloatingPetal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      // Highlight
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.ellipse(-p.size * 0.15, -p.size * 0.2, p.size * 0.2, p.size * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawButterfly = (b: Butterfly, t: number) => {
      const wingAngle = Math.sin(t * 4 + b.wingPhase) * 0.8;
      ctx.save();
      ctx.translate(b.x, b.y);

      // Wings
      ctx.fillStyle = `hsla(${280 + b.id * 30}, 70%, 75%, 0.7)`;
      ctx.save();
      ctx.scale(Math.cos(wingAngle), 1);
      ctx.beginPath();
      ctx.ellipse(-6, -2, 8, 5, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.scale(-Math.cos(wingAngle), 1);
      ctx.beginPath();
      ctx.ellipse(-6, -2, 8, 5, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Body
      ctx.fillStyle = '#4a2060';
      ctx.beginPath();
      ctx.ellipse(0, 0, 1.5, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawFirefly = (f: Firefly, t: number) => {
      const glow = (Math.sin(t * 2 + f.phase) + 1) * 0.5;
      const radius = 2 + glow * 3;
      const alpha = 0.2 + glow * 0.6;

      const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, radius * 4);
      grad.addColorStop(0, `rgba(251, 191, 36, ${alpha})`);
      grad.addColorStop(0.3, `rgba(251, 191, 36, ${alpha * 0.3})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(f.x, f.y, radius * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 230, 150, ${alpha})`;
      ctx.beginPath();
      ctx.arc(f.x, f.y, radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      timeRef.current += 0.016;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);
      drawSunrise(w, h, t);

      // Update & draw petals
      petalsRef.current.forEach(p => {
        p.x += p.speedX + Math.sin(t + p.id) * 0.3;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;
        if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        drawPetal(p);
      });

      // Update & draw butterflies
      butterfliesRef.current.forEach(b => {
        b.x += Math.sin(t * b.speed + b.phase) * 1.2;
        b.y += Math.cos(t * b.speed * 0.7 + b.phase) * 0.6;
        if (b.x < -50) b.x = w + 50;
        if (b.x > w + 50) b.x = -50;
        drawButterfly(b, t);
      });

      // Update & draw fireflies
      firefliesRef.current.forEach(f => {
        f.x += f.vx + Math.sin(t * 0.5 + f.phase) * 0.2;
        f.y += f.vy + Math.cos(t * 0.3 + f.phase) * 0.15;
        if (f.x < 0 || f.x > w) f.vx *= -1;
        if (f.y < h * 0.4 || f.y > h) f.vy *= -1;
        drawFirefly(f, t);
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleBegin = useCallback(() => {
    soundEngine.playFlowerBloom();
    soundEngine.startAmbientBGM();
    onBegin();
  }, [onBegin]);

  const handleHover = useCallback((entering: boolean) => {
    setIsHovering(entering);
    if (entering) {
      soundEngine.playClick();
      // Spawn heart particles around button
      const newParticles = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 30,
      }));
      setHoverParticles(newParticles);
    } else {
      setHoverParticles([]);
    }
  }, []);

  return (
    <section className="h-screen w-full overflow-hidden relative flex flex-col items-center justify-center">
      {/* Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />

      {/* Soft overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" style={{ zIndex: 1 }} />

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center gap-6 px-4" style={{ zIndex: 10 }}>
        {/* Glowing Heart Phase */}
        <AnimatePresence>
          {(phase === 'heart') && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-7xl sm:text-8xl md:text-9xl animate-heartbeat"
              style={{ filter: 'drop-shadow(0 0 40px rgba(236, 72, 153, 0.6))' }}
            >
              ❤️
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title Phase */}
        <AnimatePresence>
          {(phase === 'title' || phase === 'ready') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <h1
                className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-white glow-text-blush"
              >
                {displayedText}
                <span className="typewriter-cursor" />
              </h1>

              {/* Decorative flowers around title */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.6, type: 'spring' }}
                className="flex justify-center gap-2 mt-4 text-2xl"
              >
                🌸 🌹 🌷 💐 🌺
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Begin Button */}
        <AnimatePresence>
          {phase === 'ready' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8, type: 'spring', stiffness: 100 }}
              className="relative mt-6"
            >
              {/* Heart particles on hover */}
              <AnimatePresence>
                {hoverParticles.map(p => (
                  <motion.span
                    key={p.id}
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      scale: 1,
                      x: p.x,
                      y: p.y - 30,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="absolute left-1/2 top-1/2 pointer-events-none text-sm"
                  >
                    💕
                  </motion.span>
                ))}
              </AnimatePresence>

              <button
                onClick={handleBegin}
                onMouseEnter={() => handleHover(true)}
                onMouseLeave={() => handleHover(false)}
                className="relative px-10 py-4 rounded-full font-body font-semibold text-base sm:text-lg text-white
                  transition-all duration-500 overflow-hidden group"
                style={{
                  background: isHovering
                    ? 'linear-gradient(135deg, rgba(255,214,232,0.35), rgba(230,213,255,0.35))'
                    : 'linear-gradient(135deg, rgba(255,214,232,0.2), rgba(230,213,255,0.2))',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid rgba(250, 218, 221, ${isHovering ? 0.6 : 0.3})`,
                  boxShadow: isHovering
                    ? '0 12px 40px rgba(236, 72, 153, 0.35), 0 0 60px rgba(216, 180, 254, 0.2), inset 0 1px 2px rgba(255,255,255,0.5)'
                    : '0 8px 30px rgba(236, 72, 153, 0.15), inset 0 1px 1px rgba(255,255,255,0.3)',
                  transform: isHovering ? 'translateY(-3px) scale(1.03)' : 'translateY(0) scale(1)',
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>Begin Our Story</span>
                  <span className="text-lg">✨</span>
                </span>

                {/* Animated glow ring */}
                <div
                  className="absolute inset-0 rounded-full animate-pulse-soft"
                  style={{
                    background: 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(216,180,254,0.1))',
                    filter: 'blur(8px)',
                  }}
                />
              </button>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 3, duration: 1 }}
                className="text-center text-white/50 text-xs sm:text-sm mt-4 font-body"
              >
                A digital fairytale handcrafted by Om 💌
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll indicator */}
      <AnimatePresence>
        {phase === 'ready' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 4, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            style={{ zIndex: 10 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-1 text-white/40"
            >
              <span className="text-xs font-body">Scroll or tap to begin</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 12L2 6h12L8 12z" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

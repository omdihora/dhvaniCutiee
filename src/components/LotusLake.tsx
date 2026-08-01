import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/audio';

// ✨ Page 5: Lotus Lake
// A tranquil lake with floating lanterns, lotus flowers, koi fish, moonlight

interface LotusLakeProps {
  onNext: () => void;
  onLanternReleased?: () => void;
}

interface Lantern {
  id: number; x: number; y: number;
  released: boolean; message: string;
}

const LANTERN_MESSAGES = [
  "May our love light the way through every darkness ❤️",
  "Each lantern carries a wish — and my every wish is you 💕",
  "Like these lanterns, our love rises above everything 🌟",
  "You are the warm glow in my life's darkest nights ✨",
  "Together, we illuminate each other's worlds 💫",
  "Our love floats higher than any dream 🏮",
];

export const LotusLake: React.FC<LotusLakeProps> = ({ onNext, onLanternReleased }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const [lanterns, setLanterns] = useState<Lantern[]>(
    LANTERN_MESSAGES.map((msg, i) => ({
      id: i, x: 15 + (i * 14), y: 65 + Math.random() * 10,
      released: false, message: msg,
    }))
  );
  const [selectedLantern, setSelectedLantern] = useState<Lantern | null>(null);
  const [releasedLanterns, setReleasedLanterns] = useState<{ id: number; x: number; startY: number; msg: string }[]>([]);

  // Canvas animation — water, moon, koi fish
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

      // Night sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.55);
      skyGrad.addColorStop(0, '#050510');
      skyGrad.addColorStop(0.5, '#0a0a30');
      skyGrad.addColorStop(1, '#0f1040');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.55);

      // Moon
      const moonX = w * 0.2;
      const moonY = h * 0.15;
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 120);
      moonGlow.addColorStop(0, 'rgba(255, 255, 240, 0.2)');
      moonGlow.addColorStop(0.4, 'rgba(255, 255, 240, 0.05)');
      moonGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 120, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(moonX, moonY, 30, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 240, 0.85)';
      ctx.fill();

      // Water surface
      const waterY = h * 0.55;
      const waterGrad = ctx.createLinearGradient(0, waterY, 0, h);
      waterGrad.addColorStop(0, '#0a1535');
      waterGrad.addColorStop(0.3, '#081228');
      waterGrad.addColorStop(0.7, '#060e20');
      waterGrad.addColorStop(1, '#040a18');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, waterY, w, h - waterY);

      // Moon reflection on water
      const reflGrad = ctx.createRadialGradient(moonX, waterY + 40, 0, moonX, waterY + 60, 80);
      reflGrad.addColorStop(0, 'rgba(255, 255, 240, 0.08)');
      reflGrad.addColorStop(0.5, 'rgba(255, 255, 240, 0.03)');
      reflGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = reflGrad;
      ctx.beginPath();
      ctx.ellipse(moonX, waterY + 50, 60, 25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shimmer lines on water
      ctx.strokeStyle = 'rgba(255, 255, 240, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const ly = waterY + 20 + i * 30 + Math.sin(time + i) * 5;
        ctx.beginPath();
        ctx.moveTo(0, ly);
        for (let x = 0; x < w; x += 10) {
          ctx.lineTo(x, ly + Math.sin(x * 0.02 + time * 2 + i) * 3);
        }
        ctx.stroke();
      }

      // Water ripples
      for (let i = 0; i < 3; i++) {
        const rx = w * (0.3 + i * 0.2) + Math.sin(time + i * 2) * 50;
        const ry = waterY + 60 + i * 40 + Math.cos(time * 0.5 + i) * 10;
        const rsize = 20 + Math.sin(time * 2 + i * 3) * 10;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 + Math.sin(time + i) * 0.015})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.ellipse(rx, ry, rsize, rsize * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Koi fish (subtle shadows under water)
      for (let i = 0; i < 3; i++) {
        const kx = (w * 0.2 + Math.sin(time * 0.3 + i * 2.5) * w * 0.3 + i * w * 0.2) % w;
        const ky = waterY + 80 + i * 40 + Math.cos(time * 0.4 + i * 1.5) * 15;
        const kAngle = Math.cos(time * 0.3 + i * 2.5) * 0.3;

        ctx.save();
        ctx.translate(kx, ky);
        ctx.rotate(kAngle);
        ctx.globalAlpha = 0.15;

        // Body
        ctx.fillStyle = i === 0 ? '#ff6b6b' : i === 1 ? '#ffa500' : '#ffffff';
        ctx.beginPath();
        ctx.ellipse(0, 0, 18, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail
        ctx.beginPath();
        ctx.moveTo(-18, 0);
        ctx.lineTo(-28, -8);
        ctx.lineTo(-28, 8);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // Lotus flowers on water
      const lotusPositions = [
        { x: w * 0.35, y: waterY + 20 },
        { x: w * 0.55, y: waterY + 35 },
        { x: w * 0.75, y: waterY + 15 },
        { x: w * 0.15, y: waterY + 30 },
        { x: w * 0.9, y: waterY + 25 },
      ];

      lotusPositions.forEach((pos, i) => {
        const bobY = pos.y + Math.sin(time * 0.8 + i * 1.2) * 3;
        ctx.save();
        ctx.translate(pos.x, bobY);

        // Lily pad
        ctx.fillStyle = 'rgba(50, 120, 50, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, 5, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Petals
        const petalCount = 8;
        for (let p = 0; p < petalCount; p++) {
          const angle = (p / petalCount) * Math.PI * 2 + Math.sin(time * 0.3) * 0.1;
          ctx.fillStyle = `hsla(${310 + p * 5}, 60%, ${75 + p * 2}%, 0.7)`;
          ctx.beginPath();
          ctx.ellipse(
            Math.cos(angle) * 8, Math.sin(angle) * 4 - 3,
            6, 3, angle, 0, Math.PI * 2
          );
          ctx.fill();
        }

        // Center
        ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
        ctx.beginPath();
        ctx.arc(0, -3, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // Fireflies
      for (let i = 0; i < 12; i++) {
        const fx = w * (0.05 + (i / 12) * 0.9) + Math.sin(time * 0.5 + i * 2) * 30;
        const fy = waterY - 30 + Math.cos(time * 0.3 + i * 1.7) * 40 - i * 5;
        const fglow = (Math.sin(time * 2.5 + i * 3.7) + 1) * 0.5;

        const fGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, 8);
        fGrad.addColorStop(0, `rgba(251, 191, 36, ${fglow * 0.5})`);
        fGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = fGrad;
        ctx.beginPath();
        ctx.arc(fx, fy, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleReleaseLantern = (lantern: Lantern) => {
    soundEngine.playLanternRelease();
    setLanterns(prev => prev.map(l => l.id === lantern.id ? { ...l, released: true } : l));
    setReleasedLanterns(prev => [...prev, {
      id: lantern.id, x: lantern.x, startY: lantern.y, msg: lantern.message,
    }]);
    setSelectedLantern(null);
    onLanternReleased?.();
  };

  return (
    <section className="h-screen w-full relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-0 right-0 text-center z-10 pointer-events-none"
      >
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white glow-text-lavender">
          Lotus Lake 🪷
        </h2>
        <p className="font-body text-sm text-white/40 mt-2">
          Click on the lanterns to release them into the sky
        </p>
      </motion.div>

      {/* Floating lanterns (clickable) */}
      {lanterns.filter(l => !l.released).map(lantern => (
        <motion.div
          key={lantern.id}
          animate={{
            y: [0, -8, 0],
            x: [0, 5, -3, 0],
          }}
          transition={{
            duration: 4 + lantern.id * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute z-10"
          style={{
            left: `${lantern.x}%`,
            top: `${lantern.y}%`,
          }}
          onClick={() => setSelectedLantern(lantern)}
        >
          <div
            className="w-10 h-14 sm:w-12 sm:h-16 rounded-lg flex items-center justify-center text-2xl sm:text-3xl relative"
            style={{
              background: 'linear-gradient(180deg, rgba(255,183,77,0.4) 0%, rgba(255,140,50,0.3) 100%)',
              border: '1px solid rgba(255,183,77,0.3)',
              boxShadow: '0 0 20px rgba(255,183,77,0.3), 0 0 40px rgba(255,183,77,0.1)',
              animation: 'lanternGlow 3s ease-in-out infinite',
            }}
          >
            🏮
          </div>
        </motion.div>
      ))}

      {/* Released lanterns floating up */}
      {releasedLanterns.map(rl => (
        <motion.div
          key={`released-${rl.id}`}
          initial={{ y: 0, opacity: 0.9 }}
          animate={{ y: '-120vh', opacity: [0.9, 0.8, 0.5, 0] }}
          transition={{ duration: 12, ease: 'easeOut' }}
          className="absolute z-10 pointer-events-none"
          style={{ left: `${rl.x}%`, top: `${rl.startY}%` }}
        >
          <div className="text-2xl sm:text-3xl" style={{ filter: 'drop-shadow(0 0 15px rgba(255,183,77,0.5))' }}>
            🏮
          </div>
        </motion.div>
      ))}

      {/* Lantern release confirmation */}
      <AnimatePresence>
        {selectedLantern && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-30"
            style={{ background: 'rgba(5, 5, 16, 0.6)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedLantern(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="glass-card-romantic p-6 sm:p-8 max-w-sm text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-5xl mb-4">🏮</div>
              <p className="font-handwritten text-lg text-pink-200 leading-relaxed mb-4">
                "{selectedLantern.message}"
              </p>
              <button
                onClick={() => handleReleaseLantern(selectedLantern)}
                className="glass-button text-sm"
              >
                Release Into the Sky ✨
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
          See the Love Tree 🌳
        </button>
      </motion.div>
    </section>
  );
};

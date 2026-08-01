import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '../utils/audio';

// ✨ Page 6: Love Tree — Cherry Blossom that grows as you explore

interface LoveTreeProps {
  onNext: () => void;
  pagesVisited: number;
  totalPages: number;
}

const GROWTH_MESSAGES = [
  { min: 0, label: '🌱 A Tiny Seed', message: 'Every great love story starts with a single seed...' },
  { min: 2, label: '🌿 A Sprout', message: 'Our love is beginning to take root...' },
  { min: 4, label: '🪴 A Sapling', message: 'Growing stronger with every shared moment...' },
  { min: 6, label: '🌳 A Young Tree', message: 'Our love stands tall, reaching for the sky...' },
  { min: 8, label: '🌸 Blooming', message: 'Love in full bloom — beautiful and breathtaking...' },
  { min: 10, label: '🌸✨ Full Blossom', message: 'A magnificent cherry blossom, forever in bloom for you ❤️' },
];

export const LoveTree: React.FC<LoveTreeProps> = ({ onNext, pagesVisited, totalPages }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const growth = Math.min(1, pagesVisited / totalPages);
  const [currentMessage, setCurrentMessage] = useState(GROWTH_MESSAGES[0]);

  useEffect(() => {
    const msg = [...GROWTH_MESSAGES].reverse().find(m => pagesVisited >= m.min) || GROWTH_MESSAGES[0];
    setCurrentMessage(msg);
  }, [pagesVisited]);

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

    const drawBranch = (
      x: number, y: number, angle: number, length: number, depth: number, maxDepth: number
    ) => {
      if (depth > maxDepth * growth || length < 3) return;

      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;

      // Branch
      const thickness = Math.max(1, (maxDepth - depth) * 1.8 * growth);
      ctx.strokeStyle = depth < 3
        ? `rgba(101, 67, 33, ${0.6 + growth * 0.4})`
        : `rgba(139, 90, 50, ${0.5 + growth * 0.3})`;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Sub-branches
      if (depth < maxDepth * growth) {
        const sway = Math.sin(time * 0.5 + depth) * 0.03;
        drawBranch(endX, endY, angle - 0.4 + sway, length * 0.72, depth + 1, maxDepth);
        drawBranch(endX, endY, angle + 0.5 + sway, length * 0.68, depth + 1, maxDepth);
        if (depth % 2 === 0 && growth > 0.5) {
          drawBranch(endX, endY, angle + 0.1 + sway, length * 0.55, depth + 1, maxDepth);
        }
      }

      // Blossoms at branch tips (only when growth > 0.6)
      if (growth > 0.6 && depth >= maxDepth * growth - 1.5 && length < 15) {
        const bloomSize = 4 + Math.sin(time * 2 + depth + x) * 2;
        const bloomAlpha = Math.min(1, (growth - 0.6) * 2.5);
        const colors = ['#f9a8d4', '#fda4af', '#f0abfc', '#fbb6ce', '#e879f9'];
        const color = colors[Math.floor((depth + x) % colors.length)];

        ctx.fillStyle = color;
        ctx.globalAlpha = bloomAlpha * (0.5 + Math.sin(time + depth) * 0.2);

        for (let p = 0; p < 5; p++) {
          const pAngle = (p / 5) * Math.PI * 2 + time * 0.2;
          ctx.beginPath();
          ctx.ellipse(
            endX + Math.cos(pAngle) * bloomSize * 0.4,
            endY + Math.sin(pAngle) * bloomSize * 0.4,
            bloomSize * 0.5, bloomSize * 0.35,
            pAngle, 0, Math.PI * 2
          );
          ctx.fill();
        }
        // Center
        ctx.fillStyle = '#fbbf24';
        ctx.globalAlpha = bloomAlpha * 0.7;
        ctx.beginPath();
        ctx.arc(endX, endY, bloomSize * 0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
      }
    };

    // Falling petals
    const petals: { x: number; y: number; vx: number; vy: number; rot: number; size: number; alpha: number }[] = [];
    if (growth > 0.7) {
      for (let i = 0; i < 30; i++) {
        petals.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight * 0.6,
          vx: (Math.random() - 0.5) * 0.5,
          vy: 0.3 + Math.random() * 0.5,
          rot: Math.random() * 360,
          size: 2 + Math.random() * 4,
          alpha: 0.4 + Math.random() * 0.4,
        });
      }
    }

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      time += 0.016;

      // Soft sky background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#1a1a3e');
      skyGrad.addColorStop(0.3, '#2a1a4a');
      skyGrad.addColorStop(0.6, '#3a2a5a');
      skyGrad.addColorStop(0.8, '#2a3a2a');
      skyGrad.addColorStop(1, '#1a2a1a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Soft clouds
      ctx.globalAlpha = 0.05;
      for (let i = 0; i < 4; i++) {
        const cx = (w * 0.2 + i * w * 0.2 + Math.sin(time * 0.1 + i) * 30) % w;
        const cy = h * 0.15 + i * 30;
        const cloudGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
        cloudGrad.addColorStop(0, '#e6d5ff');
        cloudGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = cloudGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 120, 40, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Ground
      const groundGrad = ctx.createLinearGradient(0, h * 0.75, 0, h);
      groundGrad.addColorStop(0, '#2a4a2a');
      groundGrad.addColorStop(0.5, '#1a3a1a');
      groundGrad.addColorStop(1, '#0f2a0f');
      ctx.fillStyle = groundGrad;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.78);
      for (let x = 0; x <= w; x += 5) {
        ctx.lineTo(x, h * 0.78 + Math.sin(x * 0.01 + time * 0.3) * 5);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Small ground flowers
      if (growth > 0.3) {
        const flowerEmojis = ['🌸', '🌹', '🌷', '🌼'];
        for (let i = 0; i < 15; i++) {
          const fx = (i * 73 + 20) % w;
          const fy = h * 0.78 + Math.sin(fx * 0.01) * 5 + 5;
          const fgrow = Math.min(1, (growth - 0.3) * 3);
          ctx.font = `${10 + fgrow * 6}px serif`;
          ctx.globalAlpha = fgrow * 0.7;
          ctx.fillText(flowerEmojis[i % flowerEmojis.length], fx, fy);
        }
        ctx.globalAlpha = 1;
      }

      // Draw tree trunk
      const treeX = w / 2;
      const treeBaseY = h * 0.78;
      const trunkHeight = 100 * growth + 20;

      // Trunk
      ctx.strokeStyle = 'rgba(101, 67, 33, 0.8)';
      ctx.lineWidth = 8 + growth * 12;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(treeX, treeBaseY);
      ctx.lineTo(treeX, treeBaseY - trunkHeight);
      ctx.stroke();

      // Roots
      if (growth > 0.2) {
        ctx.lineWidth = 3 + growth * 4;
        ctx.strokeStyle = 'rgba(101, 67, 33, 0.5)';
        for (let i = 0; i < 3; i++) {
          const angle = Math.PI * 0.5 + (i - 1) * 0.5;
          ctx.beginPath();
          ctx.moveTo(treeX, treeBaseY);
          ctx.lineTo(
            treeX + Math.cos(angle) * (20 + growth * 30),
            treeBaseY + Math.sin(angle) * 15
          );
          ctx.stroke();
        }
      }

      // Branches
      drawBranch(treeX, treeBaseY - trunkHeight, -Math.PI / 2 - 0.3, 50 + growth * 30, 0, 7);
      drawBranch(treeX, treeBaseY - trunkHeight, -Math.PI / 2 + 0.3, 45 + growth * 28, 0, 7);
      drawBranch(treeX, treeBaseY - trunkHeight * 0.7, -Math.PI / 2 - 0.6, 35 + growth * 20, 0, 5);
      drawBranch(treeX, treeBaseY - trunkHeight * 0.7, -Math.PI / 2 + 0.6, 35 + growth * 20, 0, 5);

      // Falling cherry blossom petals
      petals.forEach(p => {
        p.x += p.vx + Math.sin(time + p.rot) * 0.3;
        p.y += p.vy;
        p.rot += 2;
        if (p.y > h) { p.y = -10; p.x = Math.random() * w; }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#f9a8d4';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Birds on branches
      if (growth > 0.7) {
        const birdPositions = [
          { x: treeX - 40, y: treeBaseY - trunkHeight - 30 },
          { x: treeX + 55, y: treeBaseY - trunkHeight - 15 },
        ];
        birdPositions.forEach((bp, i) => {
          ctx.save();
          ctx.translate(bp.x, bp.y);
          ctx.fillStyle = i === 0 ? '#4a90a4' : '#e07060';
          // Body
          ctx.beginPath();
          ctx.ellipse(0, 0, 6, 4, 0, 0, Math.PI * 2);
          ctx.fill();
          // Head
          ctx.beginPath();
          ctx.arc(5, -2, 3, 0, Math.PI * 2);
          ctx.fill();
          // Beak
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.moveTo(8, -2);
          ctx.lineTo(11, -1);
          ctx.lineTo(8, 0);
          ctx.fill();
          ctx.restore();
        });
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [growth]);

  return (
    <section className="h-screen w-full relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-0 right-0 text-center z-10 pointer-events-none"
      >
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white glow-text-blush">
          Our Love Tree 🌳
        </h2>
        <p className="font-body text-sm text-white/40 mt-1">
          It grows as you explore our story
        </p>
      </motion.div>

      {/* Growth progress */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-24 left-6 z-10 glass-card-romantic p-4 max-w-xs"
      >
        <p className="text-2xl mb-1">{currentMessage.label}</p>
        <p className="font-handwritten text-base text-pink-200/80">
          {currentMessage.message}
        </p>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${growth * 100}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #ec4899, #d8b4fe, #fbbf24)',
            }}
          />
        </div>
        <p className="text-white/30 text-xs mt-1 font-body">
          {pagesVisited} / {totalPages} pages explored
        </p>
      </motion.div>

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
          Today's Surprise 🎁
        </button>
      </motion.div>
    </section>
  );
};

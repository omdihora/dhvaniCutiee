import React, { useEffect, useRef } from 'react';

interface Particle {
  type: 'heart' | 'sparkle' | 'petal' | 'goldDust' | 'ring';
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  rotation: number;
  vRot: number;
}

export const HeartCursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouseHistory: { x: number; y: number; time: number }[] = [];

    const colors = [
      '#ffd700', // Pure Radiant Gold
      '#f7e7ce', // Champagne Gold
      '#ff2e8c', // Electric Rose
      '#f43f5e', // Neon Pink
      '#fadadd', // Blush Pink
      '#e6d5ff', // Aurora Lavender
      '#ffffff', // Diamond Pearl
    ];

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawHeart = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.shadowColor = color;
      context.shadowBlur = 14;

      context.beginPath();
      const topCurveHeight = size * 0.3;
      context.moveTo(0, topCurveHeight);
      context.bezierCurveTo(-size / 2, -size / 2, -size, topCurveHeight, 0, size);
      context.bezierCurveTo(size, topCurveHeight, size / 2, -size / 2, 0, topCurveHeight);
      context.closePath();
      context.fill();
      context.restore();
    };

    const drawPetal = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.shadowColor = '#ffd700';
      context.shadowBlur = 10;

      context.beginPath();
      context.ellipse(0, 0, size * 0.5, size * 1.3, 0, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    const drawSparkle = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.translate(x, y);
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.shadowColor = color;
      context.shadowBlur = 12;

      context.beginPath();
      context.arc(0, 0, size, 0, Math.PI * 2);
      context.fill();

      // Diamond cross sparkle lines
      context.strokeStyle = color;
      context.lineWidth = 1.2;
      context.beginPath();
      context.moveTo(-size * 2.2, 0);
      context.lineTo(size * 2.2, 0);
      context.moveTo(0, -size * 2.2);
      context.lineTo(0, size * 2.2);
      context.stroke();

      context.restore();
    };

    const drawRing = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.translate(x, y);
      context.globalAlpha = alpha;
      context.strokeStyle = color;
      context.shadowColor = color;
      context.shadowBlur = 15;
      context.lineWidth = 2;
      context.beginPath();
      context.arc(0, 0, size, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    };

    const handlePointerMove = (x: number, y: number) => {
      targetMouseX = x;
      targetMouseY = y;
      mouseHistory.push({ x, y, time: Date.now() });
      if (mouseHistory.length > 20) mouseHistory.shift();

      for (let i = 0; i < 3; i++) {
        const rand = Math.random();
        const type: 'heart' | 'sparkle' | 'petal' | 'goldDust' =
          rand < 0.3 ? 'goldDust' : rand < 0.6 ? 'sparkle' : rand < 0.85 ? 'heart' : 'petal';

        particles.push({
          type,
          x: x + (Math.random() * 14 - 7),
          y: y + (Math.random() * 14 - 7),
          size: type === 'heart' ? Math.random() * 8 + 5 : type === 'petal' ? Math.random() * 6 + 3 : Math.random() * 4 + 1.5,
          vx: (Math.random() - 0.5) * 2.0,
          vy: -Math.random() * 2.2 - 0.6,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: (Math.random() - 0.5) * 0.8,
          vRot: (Math.random() - 0.5) * 0.1,
        });
      }

      if (particles.length > 120) {
        particles = particles.slice(particles.length - 120);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const triggerClickFireworks = (x: number, y: number) => {
      // Ring shockwave
      particles.push({
        type: 'ring',
        x,
        y,
        size: 5,
        vx: 0,
        vy: 0,
        alpha: 1,
        color: '#ffd700',
        rotation: 0,
        vRot: 0,
      });

      // Burst particles
      for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 * i) / 30;
        const speed = Math.random() * 5 + 3;
        particles.push({
          type: Math.random() < 0.4 ? 'goldDust' : Math.random() < 0.75 ? 'sparkle' : 'heart',
          x,
          y,
          size: Math.random() * 11 + 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.15,
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      triggerClickFireworks(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        triggerClickFireworks(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth cursor lerp
      mouseX += (targetMouseX - mouseX) * 0.28;
      mouseY += (targetMouseY - mouseY) * 0.28;

      // Draw subtle glowing ribbon trail behind cursor
      const now = Date.now();
      const validPoints = mouseHistory.filter((p) => now - p.time < 350);
      if (validPoints.length > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(validPoints[0].x, validPoints[0].y);
        for (let i = 1; i < validPoints.length; i++) {
          ctx.lineTo(validPoints[i].x, validPoints[i].y);
        }
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.25)';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 12;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.restore();
      }

      // Draw glowing custom cursor ring
      ctx.save();
      ctx.translate(mouseX, mouseY);
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 14;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.stroke();

      // Inner glowing dot
      ctx.fillStyle = '#ff2e8c';
      ctx.shadowColor = '#ff2e8c';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Render floating particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.type === 'ring' ? 0.035 : 0.016;
        p.rotation += p.vRot;

        if (p.type === 'ring') {
          p.size += 3.5;
        } else {
          p.size *= 0.985;
        }

        if (p.alpha > 0 && p.size > 0.5) {
          if (p.type === 'heart') {
            drawHeart(ctx, p.x, p.y, p.size, p.rotation, p.color, p.alpha);
          } else if (p.type === 'petal') {
            drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.color, p.alpha);
          } else if (p.type === 'ring') {
            drawRing(ctx, p.x, p.y, p.size, p.color, p.alpha);
          } else {
            drawSparkle(ctx, p.x, p.y, p.size, p.color, p.alpha);
          }
        }
      }

      particles = particles.filter((p) => p.alpha > 0 && p.size > 0.5);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouchStart);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ touchAction: 'none' }}
    />
  );
};

export default HeartCursorTrail;
